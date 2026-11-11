import type * as THREE from "three";
import type { Box } from "../layout";

export interface DragState {
  on: boolean;
  x: number;
  y: number;
  yaw: number;
  pitch: number;
  vy: number;
}

export interface AutoOrbitState {
  yaw: number;
  pitch: number;
  ty: number;
  tp: number;
  t0: number;
}

export interface OrbitController {
  readonly drag: DragState;
  readonly auto: AutoOrbitState;
  dragStep(dt: number, reduceMotion: boolean): void;
  autoPick(snap: boolean, now?: number): void;
  autoStep(t: number, dt: number, reduceMotion: boolean): void;
  orbitInto(
    dx: number,
    dy: number,
    dz: number,
    out: THREE.Vector3,
    t: number,
    reduceMotion: boolean
  ): THREE.Vector3;
  aim(
    camera: THREE.PerspectiveCamera,
    tx: number,
    ty: number,
    tz: number,
    dx: number,
    dy: number,
    dz: number,
    ws: number,
    hs: number,
    k: number,
    box: Box,
    viewportH: number,
    t: number,
    reduceMotion: boolean
  ): void;
  bgShift(scene: THREE.Scene): void;
  setDrag(yaw: number, pitch: number): void;
  setAuto(yaw: number, pitch: number): void;
  dispose(): void;
}

/**
 * Orbit, pointer drag, and idle camera drift controller.
 * Source: reference lines 10448-10526 and 14445-14461.
 * Allocates zero Vector3 / Matrix4 / Color objects per frame.
 */
export function createOrbitController(
  three: typeof THREE,
  canvas: HTMLCanvasElement,
  onRepaint: () => void
): OrbitController {
  const drag: DragState = {
    on: false,
    x: 0,
    y: 0,
    yaw: 0,
    pitch: 0,
    vy: 0,
  };

  const auto: AutoOrbitState = {
    yaw: 0,
    pitch: 0,
    ty: 0,
    tp: 0,
    t0: 0,
  };

  // Pre-allocated scratch vectors (0 per-frame allocations)
  const _target = new three.Vector3();
  const _dir = new three.Vector3();
  const _tmpV = new three.Vector3();
  const _camPos = new three.Vector3(0, 1, 14);
  const _camTgt = new three.Vector3(0, 0, 0);

  const onPointerDown = (e: PointerEvent) => {
    drag.on = true;
    drag.x = e.clientX;
    drag.y = e.clientY;
    drag.vy = 0;
    canvas.classList?.add("drag");
    try {
      canvas.setPointerCapture?.(e.pointerId);
    } catch {
      // Ignore capture failures on synthetic events
    }
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!drag.on) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    drag.x = e.clientX;
    drag.y = e.clientY;
    drag.vy = dx * 0.003;
    drag.yaw = Math.max(-0.6, Math.min(0.6, drag.yaw + dx * 0.005));
    drag.pitch = Math.max(-0.28, Math.min(0.28, drag.pitch + dy * 0.003));
    onRepaint();
  };

  const onPointerUp = () => {
    drag.on = false;
    canvas.classList?.remove("drag");
  };

  if (typeof canvas.addEventListener === "function") {
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("lostpointercapture", onPointerUp);
  }

  function dragStep(dt: number, reduceMotion: boolean): void {
    if (drag.on) return;
    const k = reduceMotion ? 1 : Math.min(1, dt / 260);
    drag.yaw = Math.max(-0.6, Math.min(0.6, drag.yaw + drag.vy));
    drag.vy *= 0.85;
    drag.yaw *= 1 - k;
    drag.pitch *= 1 - k;
  }

  function autoPick(snap: boolean, now = performance.now()): void {
    auto.ty = (Math.random() * 2 - 1) * 0.55;
    auto.tp = -0.1 + Math.random() * 0.28;
    auto.t0 = now;
    if (snap) {
      auto.yaw = auto.ty;
      auto.pitch = auto.tp;
    }
  }

  function autoStep(t: number, dt: number, reduceMotion: boolean): void {
    if (reduceMotion) return;
    if (t - auto.t0 > 9000) autoPick(false, t);
    const k = Math.min(1, dt / 2600);
    auto.yaw += (auto.ty - auto.yaw) * k;
    auto.pitch += (auto.tp - auto.pitch) * k;
  }

  function orbitInto(
    dx: number,
    dy: number,
    dz: number,
    out: THREE.Vector3,
    t: number,
    reduceMotion: boolean
  ): THREE.Vector3 {
    const y =
      drag.yaw + auto.yaw + (reduceMotion ? 0 : Math.sin(t / 5200) * 0.06);
    const p = drag.pitch + auto.pitch;
    const c = Math.cos(y);
    const s = Math.sin(y);
    out.set(dx * c + dz * s, dy - p * 0.9, -dx * s + dz * c);
    return out;
  }

  function aim(
    camera: THREE.PerspectiveCamera,
    tx: number,
    ty: number,
    tz: number,
    dx: number,
    dy: number,
    dz: number,
    ws: number,
    hs: number,
    k: number,
    box: Box,
    viewportH: number,
    t: number,
    reduceMotion: boolean
  ): void {
    _target.set(tx, ty, tz);
    orbitInto(dx, dy, dz, _dir, t, reduceMotion);

    const tn = Math.tan((camera.fov * Math.PI) / 360);
    const dH = (hs * viewportH) / (Math.max(120, box.h) * 2 * tn * 0.82);
    const dW = (ws * viewportH) / (Math.max(200, box.w) * 2 * tn * 0.92);
    const d = Math.max(dH, dW);

    _tmpV.copy(_target).addScaledVector(_dir.normalize(), d);
    const effK = drag.on ? Math.max(k, 0.5) : k;
    if (effK >= 1) {
      _camPos.copy(_tmpV);
      _camTgt.copy(_target);
    } else {
      _camPos.lerp(_tmpV, effK);
      _camTgt.lerp(_target, effK);
    }
    camera.position.copy(_camPos);
    camera.lookAt(_camTgt);
  }

  function bgShift(scene: THREE.Scene): void {
    const b = scene.background as THREE.Texture | null;
    if (b && b.isTexture) {
      b.wrapS = b.wrapT = three.ClampToEdgeWrapping;
      b.offset.set(0, Math.max(-0.08, Math.min(0.08, drag.pitch * 0.2)));
    }
  }

  function setDrag(yaw: number, pitch: number): void {
    drag.yaw = Math.max(-0.6, Math.min(0.6, yaw));
    drag.pitch = Math.max(-0.28, Math.min(0.28, pitch));
  }

  function setAuto(yaw: number, pitch: number): void {
    auto.yaw = yaw;
    auto.pitch = pitch;
    auto.ty = yaw;
    auto.tp = pitch;
  }

  function dispose(): void {
    if (typeof canvas.removeEventListener === "function") {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("lostpointercapture", onPointerUp);
    }
    canvas.classList?.remove("drag");
  }

  return {
    drag,
    auto,
    dragStep,
    autoPick,
    autoStep,
    orbitInto,
    aim,
    bgShift,
    setDrag,
    setAuto,
    dispose,
  };
}
