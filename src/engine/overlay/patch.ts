import type * as THREE from "three";
import type { MaterialRegistry } from "../world/materials";
import { H3 } from "../models/hVehiclesC";
import { U3 } from "../models/uUnits";
import { S3 } from "../models/sCarriers";
import { flick } from "../world/geometry";
import { QUESTS } from "@/content/quests";
import { CLASSES } from "@/content/classes";
import type { OverlayBuildState, PatchManager } from "./types";

// Cached halftone patterns per context to guarantee 0 per-frame allocations
const halftonePatternCache = new WeakMap<
  CanvasRenderingContext2D,
  { dark: CanvasPattern | null; light: CanvasPattern | null }
>();

function getHalftonePattern(
  ctx: CanvasRenderingContext2D,
  dark: boolean
): CanvasPattern | null {
  let entry = halftonePatternCache.get(ctx);
  if (!entry) {
    entry = { dark: null, light: null };
    halftonePatternCache.set(ctx, entry);
  }

  if (dark && entry.dark) return entry.dark;
  if (!dark && entry.light) return entry.light;

  if (typeof document === "undefined") return null;
  const patternCanvas = document.createElement("canvas");
  patternCanvas.width = 7;
  patternCanvas.height = 7;
  const pctx = patternCanvas.getContext("2d");
  if (!pctx) return null;

  pctx.fillStyle = dark ? "rgba(8,10,16,.6)" : "rgba(255,255,255,.16)";
  pctx.beginPath();
  pctx.arc(3.5, 3.5, 1.5, 0, Math.PI * 2);
  pctx.fill();

  const pattern = ctx.createPattern(patternCanvas, "repeat");
  if (dark) {
    entry.dark = pattern;
  } else {
    entry.light = pattern;
  }
  return pattern;
}

function circ(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  fill?: string,
  stroke?: string,
  lineWidth?: number
): void {
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.1, r), 0, Math.PI * 2);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.lineWidth = lineWidth || 2;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
}

function star(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  col: string
): void {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 ? r * 0.45 : r;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const px = x + Math.cos(a) * rr;
    const py = y + Math.sin(a) * rr;
    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.closePath();
  ctx.fillStyle = col;
  ctx.fill();
}

function arcText(
  ctx: CanvasRenderingContext2D,
  str: string,
  cx: number,
  cy: number,
  r: number,
  top: boolean,
  fs: number
): void {
  ctx.font = `400 ${fs}px "Russo One", sans-serif`;
  ctx.fillStyle = "#F2EDE1";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const ch = Array.from(str);
  const sp = (fs * 0.92) / r;
  const tot = sp * (ch.length - 1);
  for (let i = 0; i < ch.length; i++) {
    const a = top
      ? -Math.PI / 2 - tot / 2 + i * sp
      : Math.PI / 2 + tot / 2 - i * sp;
    ctx.save();
    ctx.translate(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    ctx.rotate(top ? a + Math.PI / 2 : a - Math.PI / 2);
    ctx.fillText(ch[i]!, 0, 0);
    ctx.restore();
  }
  ctx.textBaseline = "alphabetic";
}

export function createPatchManager(
  three: typeof THREE,
  mats: MaterialRegistry,
  customRenderer?: THREE.WebGLRenderer
): PatchManager {
  let isDisposed = false;
  let ready = false;
  let frameCount = 0;

  // Scene & lighting (matches reference lines 7236-7237, 10213-10220)
  const sc = new three.Scene();
  sc.add(new three.AmbientLight(0xa9acda, 0.6));
  const dLight = new three.DirectionalLight(0xffffff, 0.62);
  dLight.position.set(-4, 8, 10);
  sc.add(dLight);
  const rLight = new three.DirectionalLight(0xff7fa6, 0.22);
  rLight.position.set(6, -2, -6);
  sc.add(rLight);

  // Camera & RenderTarget (matches reference lines 7238-7244)
  const cam = new three.PerspectiveCamera(24, 1, 0.1, 400);
  const rt = new three.WebGLRenderTarget(256, 256);
  const buf = new Uint8Array(256 * 256 * 4);

  // Offscreen canvas & ImageData
  let c: HTMLCanvasElement;
  let x: CanvasRenderingContext2D | null = null;
  let img: ImageData | null = null;

  if (typeof document !== "undefined") {
    c = document.createElement("canvas");
    c.width = 256;
    c.height = 256;
    x = c.getContext("2d");
    if (x && typeof x.createImageData === "function") {
      img = x.createImageData(256, 256);
    }
  } else {
    c = { width: 256, height: 256 } as unknown as HTMLCanvasElement;
  }

  // Dedicated offscreen renderer for hero portrait pass if not supplied
  let renderer: THREE.WebGLRenderer | null = customRenderer || null;
  if (!renderer && typeof document !== "undefined") {
    try {
      const renderCanvas = document.createElement("canvas");
      renderCanvas.width = 256;
      renderCanvas.height = 256;
      renderer = new three.WebGLRenderer({
        canvas: renderCanvas,
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
      });
      renderer.setSize(256, 256, false);
      renderer.setClearColor(0x000000, 0);
    } catch {
      // Graceful fallback for non-WebGL environments
      renderer = null;
    }
  }

  // Pre-allocated vectors for 0 per-frame allocations
  const fc = new three.Vector3(0, 0, 0);
  let fr = 1;
  const dirSquad = new three.Vector3(0.35, 0.18, 1).normalize();
  const dirSolo = new three.Vector3(0.55, 0.28, 1).normalize();

  // Cached unit handle
  let currentKey: string | null = null;
  let currentModel: {
    g: THREE.Group;
    w?: number;
    h?: number;
    len?: number;
    upd?: (t: number, opt: { rush?: boolean; reduceMotion?: boolean }) => void;
    fl?: unknown[];
  } | null = null;

  function patchModel(buildState: OverlayBuildState) {
    const tier = buildState.tier || "solo";
    const mission = buildState.mission || "brand";
    const leader = buildState.leader || "pm";
    const reach = buildState.reach || "local";

    const key =
      tier === "solo"
        ? `h:${mission}`
        : tier === "squad"
          ? `u:${leader}`
          : `s:${reach}`;

    if (currentKey !== key) {
      if (currentModel) {
        sc.remove(currentModel.g);
      }
      const id = key.slice(2);
      if (tier === "solo") {
        const builder = H3[id] || H3.brand;
        currentModel = builder ? builder(three, mats) : null;
      } else if (tier === "squad") {
        const builder = U3[id] || U3.pm;
        currentModel = builder ? builder(three, mats) : null;
      } else {
        const builder = S3[id] || S3.local;
        currentModel = builder ? builder(three, mats) : null;
      }

      if (currentModel) {
        sc.add(currentModel.g);
        currentKey = key;
        const M = currentModel;
        const w = M.w || 1;
        const h = M.h || 1;
        if (tier === "solo") {
          fc.set(0, 0, 0);
          fr = Math.max(w * 0.42, h * 0.6);
        } else if (tier === "squad") {
          fc.set(0, h * 0.5, 0);
          fr = Math.max(w * 0.45, h * 0.55);
        } else {
          fc.set(0, 0, 0);
          const len = M.len || w;
          fr = Math.max(len * 0.42, h * 0.5);
        }
      }
    }
    return currentModel;
  }

  function renderPatch(
    time: number,
    buildState: OverlayBuildState,
    reduceMotion = false
  ): void {
    if (isDisposed) return;
    const M = patchModel(buildState);
    if (!M) return;

    if (M.upd) {
      M.upd(time, { rush: false, reduceMotion });
    }
    if (M.fl && Array.isArray(M.fl) && M.fl.length > 0) {
      flick(M.fl as Parameters<typeof flick>[0], time, 0.15);
    }

    const tier = buildState.tier || "solo";
    const dir = tier === "squad" ? dirSquad : dirSolo;
    const d = fr / Math.tan((cam.fov * Math.PI) / 360);
    cam.position.copy(fc).addScaledVector(dir, d);
    cam.lookAt(fc);

    if (renderer && typeof renderer.setRenderTarget === "function") {
      renderer.setRenderTarget(rt);
      if (typeof renderer.setClearColor === "function")
        renderer.setClearColor(0x000000, 0);
      if (typeof renderer.clear === "function") renderer.clear();
      if (typeof renderer.render === "function") renderer.render(sc, cam);
      if (typeof renderer.readRenderTargetPixels === "function") {
        renderer.readRenderTargetPixels(rt, 0, 0, 256, 256, buf);
      }
      renderer.setRenderTarget(null);
      if (typeof renderer.setClearColor === "function")
        renderer.setClearColor(0x000000, 1);

      if (img && x && typeof x.putImageData === "function") {
        const D = img.data;
        // Flip rows vertically from WebGL framebuffer into ImageData
        for (let y = 0; y < 256; y++) {
          D.set(buf.subarray((255 - y) * 1024, (256 - y) * 1024), y * 1024);
        }
        x.putImageData(img, 0, 0);
      }
    }
    ready = true;
  }

  function drawPatch(
    targetCanvas: HTMLCanvasElement,
    _time: number,
    buildState: OverlayBuildState
  ): void {
    if (isDisposed || !targetCanvas) return;
    const dpr =
      typeof window !== "undefined"
        ? Math.min(2, window.devicePixelRatio || 1)
        : 1;
    const defaultSz = targetCanvas.id === "patch2" ? 150 : 132;
    const expectedPx = Math.round(defaultSz * dpr);
    if (
      targetCanvas.width !== expectedPx ||
      targetCanvas.height !== expectedPx
    ) {
      targetCanvas.width = targetCanvas.height = expectedPx;
    }
    const size = defaultSz;
    if (!size) return;

    const ctx = targetCanvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    const cPos = size / 2;
    const R = cPos - 3;
    const ri = R - 24;

    // Outer concentric rings (matches reference lines 7322-7326)
    circ(ctx, cPos, cPos, R, "#141624");
    circ(ctx, cPos, cPos, R - 2.5, "#FFFFFF");
    circ(ctx, cPos, cPos, R - 5, "#141624");
    circ(ctx, cPos, cPos, R - 7, "#EE004E");
    circ(ctx, cPos, cPos, ri + 2.5, "#141624");

    // Masked inner portrait circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(cPos, cPos, ri, 0, Math.PI * 2);
    ctx.clip();

    // Background gradient inside portrait
    const grad = ctx.createLinearGradient(0, cPos - ri, 0, cPos + ri);
    grad.addColorStop(0, "#2A2D55");
    grad.addColorStop(1, "#141624");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Halftone overlay
    const pattern = getHalftonePattern(ctx, true);
    if (pattern) {
      ctx.fillStyle = pattern;
      ctx.globalAlpha = 0.5;
      ctx.fillRect(0, cPos, size, size);
      ctx.globalAlpha = 1;
    }

    // Secondary accent glow
    circ(
      ctx,
      cPos + ri * 0.25,
      cPos - ri * 0.15,
      ri * 0.62,
      "rgba(238,0,78,.85)"
    );

    // Draw 3D portrait
    if (ready && c) {
      const s = ri * 2.3;
      ctx.drawImage(c, cPos - s / 2, cPos - s * 0.5, s, s);
    }
    ctx.restore();

    // Badge labels
    const tier = buildState.tier || "solo";
    const mission = (buildState.mission as keyof typeof QUESTS) || "brand";
    const reach = buildState.reach || "local";

    let nm = "SOLO";
    if (tier === "solo") {
      const q = QUESTS.find((item) => item.id === mission);
      nm = q ? q.hero : "HERO";
    } else if (tier === "squad") {
      nm = "FULL CREW";
    } else {
      const cls = CLASSES.find((item) => item.id === reach);
      nm = cls ? cls.ship : "FLAGSHIP";
    }

    arcText(ctx, "CONCEPFUL", cPos, cPos, R - 15.5, true, 10.5);
    arcText(ctx, nm.toUpperCase(), cPos, cPos, R - 15.5, false, 10.5);
    star(ctx, cPos - R + 15.5, cPos, 4.5, "#FFFFFF");
    star(ctx, cPos + R - 15.5, cPos, 4.5, "#FFFFFF");
  }

  function update(
    time: number,
    buildState: OverlayBuildState,
    reduceMotion = false
  ): void {
    if (isDisposed || typeof document === "undefined") return;
    frameCount++;

    const card = document.getElementById("card");
    const modal = document.getElementById("modal");
    const cardOn = !!card && card.getBoundingClientRect().width > 0;
    const modalOn = !!modal && !modal.hidden;

    const pOn = cardOn || modalOn;
    if (pOn && (reduceMotion || frameCount % 4 === 1 || !ready)) {
      renderPatch(time, buildState, reduceMotion);
    }

    if (cardOn && (reduceMotion || frameCount % 2 === 0)) {
      const p1 = document.getElementById("patch") as HTMLCanvasElement | null;
      if (p1) {
        drawPatch(p1, time, buildState);
      }
    }

    if (modalOn) {
      const p2 = document.getElementById("patch2") as HTMLCanvasElement | null;
      if (p2) {
        drawPatch(p2, time, buildState);
      }
    }
  }

  function dispose(): void {
    if (isDisposed) return;
    isDisposed = true;
    if (currentModel) {
      if (typeof sc.remove === "function") sc.remove(currentModel.g);
      currentModel = null;
    }
    while (sc.children && sc.children.length > 0) {
      if (typeof sc.remove === "function") {
        sc.remove(sc.children[0]!);
      } else {
        sc.children.shift();
      }
    }
    if (rt && typeof rt.dispose === "function") {
      rt.dispose();
    }
    if (
      renderer &&
      renderer !== customRenderer &&
      typeof renderer.dispose === "function"
    ) {
      renderer.dispose();
      renderer = null;
    }
  }

  return {
    get canvas() {
      return c;
    },
    renderPatch,
    drawPatch,
    update,
    getPortraitCanvas: () => c,
    getPortraitBuffer: () => buf,
    isReady: () => ready,
    dispose,
  };
}
