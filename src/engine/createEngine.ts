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
import { createAppStage } from "./stages/appStage";
import { type BuildState, DEFAULT_BUILD_STATE } from "./buildState";
import {
  registerEncStage,
  registerRaidStage,
  registerOverlay,
} from "./stages/slots";
import { getActiveOverlayHandles } from "./stages/slots/overlay";
import type { HudManager } from "./overlay/types";
import { drawCallouts } from "./overlay/callouts";
import { createOverlay, type OverlayManager } from "./overlay";

export interface EngineOptions {
  antialias?: boolean;
  powerPreference?: WebGLPowerPreference;
  maxPixelRatio?: number;
  overlayCanvas?: HTMLCanvasElement | null;
}

export interface Engine {
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly renderer: THREE.WebGLRenderer;
  readonly backgroundManager: BackgroundManager;
  readonly orbitController: OrbitController;
  readonly stageManager: StageManager;
  readonly materials: MaterialRegistry;
  readonly overlay?: OverlayManager | null;
  readonly hud?: HudManager | null;
  start: () => void;
  stop: () => void;
  resize: () => void;
  render: () => void;
  dispose: () => void;
  getFrameCount: () => number;
  getScrollState: () => ScrollState;
  getBox: () => Box;
  setBuildState: (state: Partial<BuildState>) => void;
  getBuildState: () => BuildState;
  setHudMeta: (meta: { company?: string; cardName?: string }) => void;
  triggerEntry: (tierKey?: "app" | "enc" | "raid") => void;
}

let activeEngine: Engine | null = null;
const engineReadyListeners = new Set<(eng: Engine) => void>();

export function getActiveEngine(): Engine | null {
  return activeEngine;
}

export function onEngineReady(cb: (eng: Engine) => void): () => void {
  engineReadyListeners.add(cb);
  if (activeEngine) {
    cb(activeEngine);
  }
  return () => {
    engineReadyListeners.delete(cb);
  };
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
  let lastTime = typeof performance !== "undefined" ? performance.now() : 0;
  let fadeT: number | null = null;

  let overlay: OverlayManager | null = null;
  if (options.overlayCanvas) {
    overlay = createOverlay(options.overlayCanvas);
  }

  // Reference line 2646: const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const motionQuery =
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;

  let buildState: BuildState = { ...DEFAULT_BUILD_STATE };
  let hudCompany = "";
  let hudCardName = "";

  // Material registry + Background Manager + Orbit controller + Stage Manager
  const materials = createMaterialRegistry(three);
  const backgroundManager = createBackgroundManager(three);
  backgroundManager.build(scene, camera, renderer);
  const orbitController = createOrbitController(three, canvas, () => {
    // Reference line 7387: if (reduce) paint(performance.now());
    if (motionQuery && motionQuery.matches) {
      renderFrame(performance.now());
    }
  });
  const stageContext = {
    three,
    scene,
    mats: materials,
    camera,
    orbitCtrl: orbitController,
    getBuildState: () => buildState,
  };
  const stageManager = createStageManager(scene, stageContext, {
    intro: createIntroStage,
    classes: createClassesStage,
    logi: createLogiStage,
    rules: createRulesStage,
    stages: createStagesStage,
    outro: createOutroStage,
    app: createAppStage,
  });

  registerEncStage(stageManager, stageContext);
  registerRaidStage(stageManager, stageContext);
  registerOverlay(stageManager, stageContext);

  // Framing box & scroll driver
  const scrollDriver = createScrollDriver();
  let previousActiveScene = "";
  let lastFramingScrollY = -1;
  const currentBox: Box = {
    x0: 0,
    x1: width,
    y0: 0,
    y1: height,
    w: width,
    h: height,
    cx: width / 2,
    cy: height / 2,
  };
  let currentTargetBox: Box = { ...currentBox };

  function getTargetBox(): Box {
    if (isDisposed || typeof document === "undefined") return currentBox;
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

    return measureBox(w, h, topBottom, cards, sceneMode, elements);
  }

  function easeBox(current: Box, target: Box, k: number): void {
    current.w += (target.w - current.w) * k;
    current.h += (target.h - current.h) * k;
    current.x0 += (target.x0 - current.x0) * k;
    current.y0 += (target.y0 - current.y0) * k;
    current.x1 = current.x0 + current.w;
    current.y1 = current.y0 + current.h;
    current.cx = current.x0 + current.w / 2;
    current.cy = current.y0 + current.h / 2;
  }

  function updateFraming(snapImmediate = false): void {
    if (isDisposed || typeof document === "undefined") return;
    currentTargetBox = getTargetBox();
    if (snapImmediate) {
      currentBox.w = currentTargetBox.w;
      currentBox.h = currentTargetBox.h;
      currentBox.x0 = currentTargetBox.x0;
      currentBox.y0 = currentTargetBox.y0;
      currentBox.x1 = currentTargetBox.x1;
      currentBox.y1 = currentTargetBox.y1;
      currentBox.cx = currentTargetBox.cx;
      currentBox.cy = currentTargetBox.cy;
    }
    const w = window.innerWidth || canvas.clientWidth || 1;
    const h = window.innerHeight || canvas.clientHeight || 1;
    applyCameraOffset(camera, currentBox, w, h);
  }

  function renderFrame(time = performance.now()): void {
    if (isDisposed) return;
    frameCount++;

    // Reference line 7362: dt = Math.min(50, t - last);
    const dtMs = Math.min(50, Math.max(0, time - lastTime));
    lastTime = time;

    // 1. storyScan
    const state = scrollDriver.update(time);

    // Update beats and clock in active section DOM before framing measurement (matches reference lines 11987-12000)
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

    if (typeof document !== "undefined" && document.body?.classList) {
      document.body.classList.toggle(
        "app",
        state.activeScene === "app" || state.activeScene === "build"
      );
    }

    const scrollY = typeof window !== "undefined" ? window.scrollY || 0 : 0;
    if (
      state.activeScene !== previousActiveScene ||
      scrollY !== lastFramingScrollY
    ) {
      if (state.activeScene !== previousActiveScene) {
        previousActiveScene = state.activeScene;
        snap = true;
        fadeT = time;
      }
      lastFramingScrollY = scrollY;
      currentTargetBox = getTargetBox();
    }

    // 2. easeBox (reference line 7366: const kb = SNAP || reduce ? 1 : Math.min(1, dt / 180);)
    const reduceMotion = !!(motionQuery && motionQuery.matches);
    const kb = snap || reduceMotion ? 1 : Math.min(1, dtMs / 180);
    easeBox(currentBox, currentTargetBox, kb);

    // 3. render3D: apply camera view offset from eased box
    const w = window.innerWidth || canvas.clientWidth || 1;
    const h = window.innerHeight || canvas.clientHeight || 1;
    applyCameraOffset(camera, currentBox, w, h);

    const viewportH =
      typeof window !== "undefined" && window.innerHeight
        ? window.innerHeight
        : canvas.clientHeight || 1;

    orbitController.dragStep(dtMs, reduceMotion);
    if (snap) orbitController.autoPick(true, time);
    orbitController.autoStep(time, dtMs, reduceMotion);
    const kk = reduceMotion || snap ? 1 : Math.min(1, dtMs / 220);
    snap = false;

    const activeSceneKey =
      state.activeScene === "app"
        ? buildState.tier === "combine"
          ? "raid"
          : buildState.tier === "squad"
            ? "enc"
            : "app"
        : state.activeScene;
    const stage = stageManager.select(activeSceneKey);
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

    const ov = getActiveOverlayHandles();
    if (stage && state.activeScene === "app") {
      const formT = ov?.hud.getFormT?.() ?? 0;
      const punch =
        formT > 0 && time - formT < 1200
          ? Math.sin(Math.min(1, (time - formT) / 1200) * Math.PI) * 0.12
          : 0;
      if (punch > 0) {
        camera.position.multiplyScalar(1 - punch);
      }
    }

    renderer.render(scene, camera);
    if (overlay) {
      overlay.render(time, fadeT);
      if (overlay.ctx) {
        if (ov && state.activeScene === "app") {
          ov.hud.render(
            overlay.ctx,
            time,
            currentBox,
            w,
            h,
            buildState.tier,
            hudCompany,
            hudCardName,
            buildState.objectives,
            reduceMotion
          );
        } else if (stage && state.activeScene === "stages") {
          const stageIndex = Math.max(
            0,
            Math.min(3, Math.floor(state.activeProgress * 4))
          );
          drawCallouts(
            three,
            overlay.ctx,
            time,
            camera,
            currentBox,
            w,
            h,
            stageIndex,
            stage.group,
            reduceMotion
          );
        }
      }
    }
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
    lastTime = typeof performance !== "undefined" ? performance.now() : 0;

    if (typeof document !== "undefined" && document.hidden) {
      return;
    }

    rAFId = requestAnimationFrame(tick);
  }

  function stop(): void {
    if (isDisposed) return;
    isRunning = false;
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
    if (overlay) {
      overlay.resize(w, h, maxPixelRatio);
    }
    scrollDriver.measureSections();
    updateFraming(true);
    if (!isRunning && motionQuery && motionQuery.matches) {
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

    if (overlay) {
      overlay.dispose();
      overlay = null;
    }

    renderer.dispose();
    renderer.forceContextLoss();
    if (activeEngine === engineInstance) {
      activeEngine = null;
    }
  }

  const engineInstance: Engine = {
    scene,
    camera,
    renderer,
    backgroundManager,
    orbitController,
    stageManager,
    materials,
    overlay,
    get hud() {
      return getActiveOverlayHandles()?.hud ?? null;
    },
    start,
    stop,
    resize,
    render: () => renderFrame(performance.now()),
    dispose,
    getFrameCount: () => frameCount,
    getScrollState: () => scrollDriver.getState(),
    getBox: () => currentBox,
    setBuildState: (state: Partial<BuildState>) => {
      const prevTier = buildState.tier;
      buildState = { ...buildState, ...state };
      if (state.tier && state.tier !== prevTier) {
        snap = true;
        const targetKey =
          state.tier === "combine"
            ? "raid"
            : state.tier === "squad"
              ? "enc"
              : "app";
        const targetStage = stageManager.getBuiltStage(targetKey) as
          | { triggerEntry?: (t: number, reduce: boolean) => void }
          | null
          | undefined;
        const reduce = !!(motionQuery && motionQuery.matches);
        targetStage?.triggerEntry?.(
          typeof performance !== "undefined" ? performance.now() : 0,
          reduce
        );
      }
      if (motionQuery && motionQuery.matches) {
        renderFrame(performance.now());
      }
    },
    getBuildState: () => buildState,
    setHudMeta: (meta: { company?: string; cardName?: string }) => {
      if (meta.company !== undefined) hudCompany = meta.company;
      if (meta.cardName !== undefined) hudCardName = meta.cardName;
    },
    triggerEntry: (tierKey?: "app" | "enc" | "raid") => {
      const key =
        tierKey ??
        (buildState.tier === "combine"
          ? "raid"
          : buildState.tier === "squad"
            ? "enc"
            : "app");
      const targetStage = stageManager.getBuiltStage(key) as
        | { triggerEntry?: (t: number, reduce: boolean) => void }
        | null
        | undefined;
      const reduce = !!(motionQuery && motionQuery.matches);
      targetStage?.triggerEntry?.(
        typeof performance !== "undefined" ? performance.now() : 0,
        reduce
      );
      if (reduce) {
        renderFrame(performance.now());
      }
    },
  };

  activeEngine = engineInstance;
  queueMicrotask(() => {
    if (activeEngine !== engineInstance) return;
    for (const listener of engineReadyListeners) {
      listener(engineInstance);
    }
  });

  return engineInstance;
}

export { type BuildState, DEFAULT_BUILD_STATE } from "./buildState";
