import * as THREE from "three";

export interface EngineOptions {
  antialias?: boolean;
  powerPreference?: WebGLPowerPreference;
  maxPixelRatio?: number;
}

export interface Engine {
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly renderer: THREE.WebGLRenderer;
  start: () => void;
  stop: () => void;
  resize: () => void;
  render: () => void;
  dispose: () => void;
  getFrameCount: () => number;
}

export function createEngine(
  canvas: HTMLCanvasElement,
  options: EngineOptions = {}
): Engine {
  const antialias = options.antialias ?? true;
  const maxPixelRatio = options.maxPixelRatio ?? 2;

  // Reference line 7391: const R3 = new THREE.WebGLRenderer({ canvas: $("gl"), antialias: true });
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias,
    ...(options.powerPreference
      ? { powerPreference: options.powerPreference }
      : {}),
  });

  // Reference line 7392: R3.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  const dpr = Math.min(maxPixelRatio, window.devicePixelRatio || 1);
  renderer.setPixelRatio(dpr);

  // Clear colour default is #000000 alpha 1 (lines 7290)
  renderer.setClearColor(0x000000, 1);

  // Reference lines 7393: const CAM = new THREE.PerspectiveCamera(30, W / H, 0.1, 600);
  const width = canvas.clientWidth || window.innerWidth || 1;
  const height = canvas.clientHeight || window.innerHeight || 1;
  const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 600);
  camera.position.set(0, 1, 14);

  // Empty scene
  const scene = new THREE.Scene();

  let isDisposed = false;
  let isRunning = false;
  let rAFId: number | null = null;
  let frameCount = 0;
  const clock = new THREE.Clock(false);

  // Reference line 2646: const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const motionQuery =
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;

  function renderFrame(): void {
    if (isDisposed) return;
    frameCount++;
    renderer.render(scene, camera);
  }

  function tick(): void {
    if (isDisposed || !isRunning) return;

    // Check visibility: document.hidden pauses loop
    if (typeof document !== "undefined" && document.hidden) {
      rAFId = null;
      return;
    }

    renderFrame();

    // Respect prefers-reduced-motion:
    // Original line 15142: if (!reduce) requestAnimationFrame(loop);
    // When reduce is true, do not schedule continuous loop
    if (motionQuery && motionQuery.matches) {
      isRunning = false;
      rAFId = null;
      return;
    }

    rAFId = requestAnimationFrame(tick);
  }

  function start(): void {
    if (isDisposed || isRunning) return;
    isRunning = true;
    clock.start();

    // If prefers-reduced-motion is true, render exactly one frame and pause
    if (motionQuery && motionQuery.matches) {
      renderFrame();
      isRunning = false;
      return;
    }

    if (typeof document !== "undefined" && document.hidden) {
      return;
    }

    rAFId = requestAnimationFrame(tick);
  }

  function stop(): void {
    if (isDisposed) return;
    isRunning = false;
    clock.stop();
    if (rAFId !== null) {
      cancelAnimationFrame(rAFId);
      rAFId = null;
    }
  }

  function resize(): void {
    if (isDisposed) return;
    const w = canvas.clientWidth || window.innerWidth || 1;
    const h = canvas.clientHeight || window.innerHeight || 1;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // Reference line 2761: R3.setSize(W, H, false);
    renderer.setSize(w, h, false);
    if (!isRunning) {
      renderFrame();
    }
  }

  function handleVisibilityChange(): void {
    if (isDisposed) return;
    if (document.hidden) {
      if (rAFId !== null) {
        cancelAnimationFrame(rAFId);
        rAFId = null;
      }
    } else {
      if (
        isRunning &&
        rAFId === null &&
        (!motionQuery || !motionQuery.matches)
      ) {
        rAFId = requestAnimationFrame(tick);
      }
    }
  }

  function handleMotionChange(): void {
    if (isDisposed) return;
    if (motionQuery && motionQuery.matches) {
      stop();
      renderFrame();
    } else {
      start();
    }
  }

  if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", handleVisibilityChange);
  }

  if (motionQuery) {
    if (typeof motionQuery.addEventListener === "function") {
      motionQuery.addEventListener("change", handleMotionChange);
    }
  }

  let resizeObserver: ResizeObserver | null = null;
  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(() => {
      resize();
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    } else {
      resizeObserver.observe(canvas);
    }
  }

  // Initial sizing
  resize();

  function dispose(): void {
    if (isDisposed) return;
    isDisposed = true;
    stop();

    if (typeof document !== "undefined") {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    }

    if (motionQuery) {
      if (typeof motionQuery.removeEventListener === "function") {
        motionQuery.removeEventListener("change", handleMotionChange);
      }
    }

    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }

    // Traverse scene and dispose meshes, geometries, materials, textures
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        if (obj.geometry) {
          obj.geometry.dispose();
        }
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      }
    });

    renderer.dispose();
    renderer.forceContextLoss();
  }

  return {
    scene,
    camera,
    renderer,
    start,
    stop,
    resize,
    render: renderFrame,
    dispose,
    getFrameCount: () => frameCount,
  };
}
