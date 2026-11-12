import type * as THREE from "three";
import { measureBox, applyCameraOffset, type Box } from "./layout";
import { createScrollDriver, type ScrollState } from "./scroll";
import {
  createBackgroundManager,
  type BackgroundManager,
} from "./world/BackgroundManager";
import {
  createMaterialRegistry,
  type MaterialRegistry,
} from "./world/materials";
import {
  createOrbitController,
  type OrbitController,
} from "./camera/orbitController";
import { createStageManager, type StageManager } from "./stages/StageManager";
import { createIntroStage } from "./stages/introStage";
import { createClassesStage } from "./stages/classesStage";
import { createLogiStage } from "./stages/logiStage";
import { createRulesStage } from "./stages/rulesStage";
import { createStagesStage } from "./stages/stagesStage";
import { createOutroStage } from "./stages/outroStage";

export interface EngineOptions {
  antialias?: boolean;
  powerPreference?: WebGLPowerPreference;
  maxPixelRatio?: number;
}

export interface Engine {
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly renderer: THREE.WebGLRenderer;
  readonly backgroundManager: BackgroundManager;
  readonly orbitController: OrbitController;
  readonly stageManager: StageManager;
  readonly materials: MaterialRegistry;
  start: () => void;
  stop: () => void;
  resize: () => void;
  render: () => void;
  dispose: () => void;
  getFrameCount: () => number;
  getScrollState: () => ScrollState;
  getBox: () => Box;
}

export function createEngine(
  canvas: HTMLCanvasElement,
  three: typeof THREE,
  options: EngineOptions = {}
): Engine {
  const antialias = options.antialias ?? true;
  const maxPixelRatio = options.maxPixelRatio ?? 2;

  // Reference line 7391: const R3 = new THREE.WebGLRenderer({ canvas: $("gl"), antialias: true });
  const renderer = new three.WebGLRenderer({
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
  const camera = new three.PerspectiveCamera(30, width / height, 0.1, 600);
  camera.position.set(0, 1, 14);

  // Empty scene
  const scene = new three.Scene();

  let isDisposed = false;
  let isRunning = false;
  let rAFId: number | null = null;
  let frameCount = 0;
  let snap = true;
  let wasInPortedStage = false;
  const clock = new three.Clock(false);

  // Material registry + Background Manager + Orbit controller + Stage Manager
  const materials = createMaterialRegistry(three);
  const backgroundManager = createBackgroundManager(three);
  backgroundManager.build(scene, camera, renderer);
  const orbitController = createOrbitController(three, canvas, () =>
    renderFrame(performance.now())
  );
  const stageManager = createStageManager(
    scene,
    {
      three,
      scene,
      mats: materials,
      camera,
      orbitCtrl: orbitController,
    },
    {
      intro: createIntroStage,
      classes: createClassesStage,
      logi: createLogiStage,
      rules: createRulesStage,
      stages: createStagesStage,
      outro: createOutroStage,
    }
  );

  // Framing box & scroll driver
  const scrollDriver = createScrollDriver();
  let previousActiveScene = "";
  let currentBox: Box = {
    x0: 0,
    x1: width,
    y0: 0,
    y1: height,
    w: width,
    h: height,
    cx: width / 2,
    cy: height / 2,
  };

  // Reference line 2646: const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const motionQuery =
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;

  function updateFraming(): void {
    if (isDisposed || typeof document === "undefined") return;
    const w = window.innerWidth || canvas.clientWidth || 1;
    const h = window.innerHeight || canvas.clientHeight || 1;

    const topHeader = document.querySelector("header.top");
    const topBottom = topHeader ? topHeader.getBoundingClientRect().bottom : 52;

    const cardElements = document.querySelectorAll(".story .sc");
    const cards = Array.from(cardElements).map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
      };
    });

    const activeScene = scrollDriver.getState().activeScene;
    const sceneMode: "story" | "logi" | "app" =
      activeScene === "logi"
        ? "logi"
        : activeScene === "app" || activeScene === "build"
          ? "app"
          : "story";

    const hh = document.querySelector(".hz-head");
    const tk = document.querySelector(".hz-view");
    const panel = document.getElementById("panel");
    const card = document.getElementById("card");
    const boxart = document.getElementById("boxart");

    const elements = {
      hzHeadBottom: hh ? hh.getBoundingClientRect().bottom : undefined,
      hzViewTop: tk ? tk.getBoundingClientRect().top : undefined,
      panelRight: panel ? panel.getBoundingClientRect().right : undefined,
      panelTop: panel ? panel.getBoundingClientRect().top : undefined,
      cardLeft: card ? card.getBoundingClientRect().left : undefined,
      cardWidth: card ? card.getBoundingClientRect().width : undefined,
      boxartHeight: boxart ? boxart.getBoundingClientRect().height : undefined,
      boxartTop: boxart ? boxart.getBoundingClientRect().top : undefined,
    };

    currentBox = measureBox(w, h, topBottom, cards, sceneMode, elements);
    applyCameraOffset(camera, currentBox, w, h);
  }

  function renderFrame(time = performance.now()): void {
    if (isDisposed) return;
    frameCount++;
    const state = scrollDriver.update(time);

    // Update beats and clock in active section DOM (reference lines 11987-12000)
    if (typeof document !== "undefined") {
      const activeEl = document.querySelector(
        `[data-scene="${state.activeScene}"]`
      );
      if (activeEl) {
        const bs = activeEl.querySelector("[data-beats]");
        if (bs) {
          const n = bs.children.length;
          const idx = Math.min(
            n - 1,
            Math.floor(state.activeProgress * n * 1.05)
          );
          Array.from(bs.children).forEach((c, i) => {
            c.classList.toggle("on", i === idx);
          });
        }
      }
    }

    if (state.activeScene !== previousActiveScene) {
      previousActiveScene = state.activeScene;
      snap = true;
      updateFraming();
    }

    const reduceMotion = !!(motionQuery && motionQuery.matches);
    const dtMs = clock.getDelta() * 1000;
    const viewportH =
      typeof window !== "undefined" && window.innerHeight
        ? window.innerHeight
        : canvas.clientHeight || 1;

    orbitController.dragStep(dtMs, reduceMotion);
    if (snap) orbitController.autoPick(true, time);
    orbitController.autoStep(time, dtMs, reduceMotion);
    const kk = reduceMotion || snap ? 1 : Math.min(1, dtMs / 220);
    snap = false;

    const stage = stageManager.select(state.activeScene);
    if (stage) {
      if (!wasInPortedStage) {
        backgroundManager.setVisible(false);
        wasInPortedStage = true;
      }
      stage.update({
        t: time,
        dt: dtMs,
        p: state.activeProgress,
        kk,
        box: currentBox,
        viewportH,
        reduceMotion,
      });
    } else {
      if (wasInPortedStage) {
        stageManager.clearActive();
        backgroundManager.setVisible(true);
        camera.position.set(0, 1, 14);
        camera.lookAt(0, 0, 0);
        wasInPortedStage = false;
      }
      backgroundManager.update(state, dtMs, time);
    }

    renderer.render(scene, camera);
    if (frameCount === 1 && canvas.classList) {
      canvas.classList.add("ready");
    }
  }

  function tick(time: number): void {
    if (isDisposed || !isRunning) return;

    // Check visibility: document.hidden pauses loop
    if (typeof document !== "undefined" && document.hidden) {
      rAFId = null;
      return;
    }

    renderFrame(time);

    // Respect prefers-reduced-motion:
    // Original line 15142: if (!reduce) requestAnimationFrame(loop);
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
      renderFrame(performance.now());
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
    renderer.setSize(w, h, false);
    scrollDriver.measureSections();
    updateFraming();
    if (!isRunning) {
      renderFrame(performance.now());
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
      renderFrame(performance.now());
    } else {
      start();
    }
  }

  function handleScroll(): void {
    if (isDisposed) return;
    // Reduced motion: recompute on scroll
    if (motionQuery && motionQuery.matches) {
      renderFrame(performance.now());
    }
  }

  let resizeRAFId: number | null = null;
  function scheduleResize(): void {
    if (isDisposed) return;
    if (resizeRAFId !== null) return;
    resizeRAFId = requestAnimationFrame(() => {
      resizeRAFId = null;
      if (isDisposed) return;
      resize();
    });
  }

  if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", handleVisibilityChange);
  }

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", scheduleResize, { passive: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!isDisposed) {
          scrollDriver.measureSections();
          updateFraming();
        }
      });
    }
  }

  if (motionQuery) {
    if (typeof motionQuery.addEventListener === "function") {
      motionQuery.addEventListener("change", handleMotionChange);
    }
  }

  let resizeObserver: ResizeObserver | null = null;
  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(() => {
      scheduleResize();
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    } else {
      resizeObserver.observe(canvas);
    }
  }

  // Initial measurement and sizing
  scrollDriver.measureSections();
  previousActiveScene = scrollDriver.getState().activeScene;
  resize();

  function dispose(): void {
    if (isDisposed) return;
    isDisposed = true;
    stop();

    if (resizeRAFId !== null) {
      cancelAnimationFrame(resizeRAFId);
      resizeRAFId = null;
    }

    if (typeof document !== "undefined") {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    }

    if (typeof window !== "undefined") {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", scheduleResize);
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

    const disposeMaterial = (mat: THREE.Material) => {
      const m = mat as unknown as Record<string, unknown>;
      const mapKeys = [
        "map",
        "alphaMap",
        "emissiveMap",
        "aoMap",
        "bumpMap",
        "displacementMap",
        "envMap",
        "lightMap",
        "metalnessMap",
        "normalMap",
        "roughnessMap",
        "specularMap",
        "gradientMap",
      ];
      for (const k of mapKeys) {
        const tex = m[k];
        if (
          tex &&
          typeof (tex as { dispose?: () => void }).dispose === "function"
        ) {
          (tex as { dispose: () => void }).dispose();
        }
      }
      mat.dispose();
    };

    // Release Three.js r128 internal WebGLBackground planeMesh/boxMesh quad before renderLists.dispose()
    if (
      renderer.renderLists &&
      typeof renderer.renderLists.get === "function"
    ) {
      const rl = (
        renderer.renderLists as unknown as {
          get: (s: THREE.Scene, depth: number) => unknown;
        }
      ).get(scene, 0) as {
        opaque?: {
          geometry?: THREE.BufferGeometry | null;
          material?: THREE.Material | null;
        }[];
      } | null;
      if (rl && Array.isArray(rl.opaque)) {
        for (const item of rl.opaque) {
          if (item.geometry) item.geometry.dispose();
          if (item.material) disposeMaterial(item.material);
        }
      }
    }

    // Traverse all renderable object types (Mesh, Points, LineSegments, Line, Sprite) before backgroundManager removes them
    scene.traverse((obj) => {
      const renderable = obj as unknown as {
        isMesh?: boolean;
        isPoints?: boolean;
        isLineSegments?: boolean;
        isLine?: boolean;
        isSprite?: boolean;
        geometry?: THREE.BufferGeometry;
        material?: THREE.Material | THREE.Material[];
      };
      if (
        renderable.isMesh ||
        renderable.isPoints ||
        renderable.isLineSegments ||
        renderable.isLine ||
        renderable.isSprite ||
        obj instanceof three.Mesh ||
        obj instanceof three.Points ||
        obj instanceof three.LineSegments ||
        obj instanceof three.Line ||
        obj instanceof three.Sprite
      ) {
        if (renderable.geometry) {
          renderable.geometry.dispose();
        }
        if (renderable.material) {
          if (Array.isArray(renderable.material)) {
            renderable.material.forEach(disposeMaterial);
          } else {
            disposeMaterial(renderable.material);
          }
        }
      }
    });

    if (
      scene.background &&
      (scene.background as { isTexture?: boolean }).isTexture
    ) {
      (scene.background as THREE.Texture).dispose();
      scene.background = null;
    }

    if (typeof renderer.getRenderTarget === "function") {
      const rt = renderer.getRenderTarget() as unknown as {
        dispose?: () => void;
      } | null;
      if (rt && typeof rt.dispose === "function") {
        rt.dispose();
        renderer.setRenderTarget(null);
      }
    }

    orbitController.dispose();
    stageManager.dispose();
    backgroundManager.dispose();
    materials.dispose();

    renderer.dispose();
    renderer.forceContextLoss();
  }

  return {
    scene,
    camera,
    renderer,
    backgroundManager,
    orbitController,
    stageManager,
    materials,
    start,
    stop,
    resize,
    render: () => renderFrame(performance.now()),
    dispose,
    getFrameCount: () => frameCount,
    getScrollState: () => scrollDriver.getState(),
    getBox: () => currentBox,
  };
}
