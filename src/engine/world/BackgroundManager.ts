import type * as THREE from "three";
import type { ScrollState } from "../scroll";
import { bgTex } from "./materials";
import { createStreakField, type StreakField } from "./streakField";
import { createPlanet, type Planet } from "./planet";
import { createClouds, type Clouds } from "./clouds";
import { createBubbles, type Bubbles } from "./bubbles";
import { createCosmos, type CosmosLayer } from "./cosmos";

export type BackgroundMode = "space" | "sea" | "sky";

export interface BackgroundManager {
  readonly mode: BackgroundMode;
  build(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ): void;
  setMode(mode: BackgroundMode): void;
  setVisible(visible: boolean): void;
  update(scrollState: ScrollState, dt: number, time?: number): void;
  dispose(): void;
}

export function createBackgroundManager(
  three: typeof THREE
): BackgroundManager {
  let currentScene: THREE.Scene | null = null;
  let currentCamera: THREE.PerspectiveCamera | null = null;
  let currentMode: BackgroundMode = "space";
  let activeSceneKey = "";

  // Textures and scene background maps
  let spaceBgTex: THREE.CanvasTexture | null = null;
  let seaBgTex: THREE.CanvasTexture | null = null;
  let skyBgTex: THREE.CanvasTexture | null = null;

  // Components
  let starfield: StreakField | null = null;
  let planet: Planet | null = null;
  let clouds: Clouds | null = null;
  let bubbles: Bubbles | null = null;
  let cosmosLayer: CosmosLayer | null = null;

  // Fog for sea mode
  let seaFog: THREE.Fog | null = null;

  function setMode(mode: BackgroundMode): void {
    if (!currentScene || !currentCamera) return;
    currentMode = mode;

    if (mode === "sea") {
      currentScene.background = seaBgTex;
      const dd = currentCamera.position.length();
      if (!seaFog) {
        seaFog = new three.Fog(0x1e2244, dd * 0.9, dd * 3.2);
      }
      currentScene.fog = seaFog;

      if (bubbles) bubbles.points.visible = true;
      if (clouds) clouds.group.visible = false;
      if (planet) planet.group.visible = false;
      if (starfield) starfield.mesh.visible = false;
      if (cosmosLayer) cosmosLayer.group.visible = false;
    } else if (mode === "sky") {
      currentScene.background = skyBgTex;
      currentScene.fog = null;

      if (bubbles) bubbles.points.visible = false;
      if (clouds) clouds.group.visible = true;
      if (planet) planet.group.visible = false;
      if (starfield) starfield.mesh.visible = true;
      if (cosmosLayer) cosmosLayer.group.visible = false;
    } else {
      // Space mode
      currentScene.background = spaceBgTex;
      currentScene.fog = null;

      if (bubbles) bubbles.points.visible = false;
      if (clouds) clouds.group.visible = false;
      if (planet) planet.group.visible = true;
      if (starfield) starfield.mesh.visible = true;
      if (cosmosLayer) cosmosLayer.group.visible = true;
    }
  }

  function setVisible(visible: boolean): void {
    if (!visible) {
      if (bubbles) bubbles.points.visible = false;
      if (clouds) clouds.group.visible = false;
      if (planet) planet.group.visible = false;
      if (starfield) starfield.mesh.visible = false;
      if (cosmosLayer) cosmosLayer.group.visible = false;
    } else {
      setMode(currentMode);
    }
  }

  function updateCosmosForScene(key: string): void {
    if (!currentScene) return;
    if (activeSceneKey === key) return;
    activeSceneKey = key;

    if (cosmosLayer) {
      cosmosLayer.dispose();
      cosmosLayer = null;
    }

    if (currentMode === "space") {
      cosmosLayer = createCosmos(three, currentScene, key);
    }
  }

  function build(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer?: THREE.WebGLRenderer
  ): void {
    currentScene = scene;
    currentCamera = camera;
    if (
      renderer &&
      renderer.info &&
      typeof renderer.info.reset === "function"
    ) {
      renderer.info.reset();
    }

    // Ambient and directional lighting (reference lines 10213-10221)
    scene.add(new three.AmbientLight(0xa9acda, 0.6));
    const dirLight = new three.DirectionalLight(0xffffff, 0.62);
    dirLight.position.set(-4, 8, 10);
    scene.add(dirLight);

    const rimLight = new three.DirectionalLight(0xff7fa6, 0.22);
    rimLight.position.set(6, -2, -6);
    scene.add(rimLight);

    // Pre-create background textures
    spaceBgTex = bgTex("#141A26", "#3A4556", three);
    seaBgTex = bgTex("#3A4A55", "#12181F", three);
    skyBgTex = bgTex("#8692A2", "#4C5664", three);

    // Starfield: 140 stars, spread [70, 34, 30], len 2.5 (reference line 10385)
    starfield = createStreakField(three, scene, 140, [70, 34, 30], 2.5);

    // Planet: r=10, pos=[14, -14, -30], col=0x6e7e92, ring=true (reference line 10394)
    planet = createPlanet(three, scene, 10, [14, -14, -30], 0x6e7e92, true);

    // Clouds: 9 groups of 4 icosahedrons (reference lines 10396-10415)
    clouds = createClouds(three, scene);

    // Bubbles: 60 Points (reference lines 10416-10435)
    bubbles = createBubbles(three, scene);

    // Initial mode is space
    setMode("space");
    updateCosmosForScene("intro");
  }

  function update(
    scrollState: ScrollState,
    dt: number,
    time = performance.now()
  ): void {
    if (!currentScene) return;

    // Map scroll section to background environment:
    // Sections intro/classes/rules/stages/outro/app default to space with cosmos presets
    if (activeSceneKey !== scrollState.activeScene) {
      updateCosmosForScene(scrollState.activeScene);
    }

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Speed multiplier: 1.8 for sky, 1.0 for space
    const speedMult = currentMode === "sky" ? 1.8 : 1.0;

    if (starfield && starfield.mesh.visible) {
      starfield.update(dt, speedMult, reduceMotion);
    }

    if (planet && planet.group.visible && !reduceMotion) {
      planet.update(time);
    }

    if (clouds && clouds.group.visible) {
      clouds.update(dt, reduceMotion);
    }

    if (bubbles && bubbles.points.visible) {
      bubbles.update(dt, reduceMotion);
    }

    if (cosmosLayer && cosmosLayer.group.visible) {
      cosmosLayer.update(time, reduceMotion);
    }
  }

  function dispose(): void {
    if (starfield) {
      starfield.dispose();
      starfield = null;
    }

    if (planet) {
      planet.dispose();
      planet = null;
    }

    if (clouds) {
      clouds.dispose();
      clouds = null;
    }

    if (bubbles) {
      bubbles.dispose();
      bubbles = null;
    }

    if (cosmosLayer) {
      cosmosLayer.dispose();
      cosmosLayer = null;
    }

    if (spaceBgTex) {
      spaceBgTex.dispose();
      spaceBgTex = null;
    }

    if (seaBgTex) {
      seaBgTex.dispose();
      seaBgTex = null;
    }

    if (skyBgTex) {
      skyBgTex.dispose();
      skyBgTex = null;
    }

    if (currentScene) {
      currentScene.background = null;
      currentScene.fog = null;
      currentScene = null;
    }
    currentCamera = null;
    seaFog = null;
  }

  return {
    get mode() {
      return currentMode;
    },
    build,
    setMode,
    setVisible,
    update,
    dispose,
  };
}
