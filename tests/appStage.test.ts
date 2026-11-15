import { describe, it, expect, vi } from "vitest";
import * as THREE from "three";
import { createMaterialRegistry } from "@/engine/world/materials";
import { createOrbitController } from "@/engine/camera/orbitController";
import {
  createAppStage,
  DEFAULT_BUILD_STATE,
  type BuildState,
} from "@/engine/stages/appStage";

describe("Part 4.17: appStage (tier=solo with 9 missions)", () => {
  it("builds appStage and performs 0 Vector3 / Matrix4 / Color allocations per frame over 120 frames", () => {
    vi.stubGlobal("Path2D", class {});
    vi.stubGlobal("document", {
      createElement: () => ({
        getContext: () => ({
          createLinearGradient: () => ({ addColorStop: () => {} }),
          createRadialGradient: () => ({ addColorStop: () => {} }),
          fillRect: () => {},
          strokeRect: () => {},
          beginPath: () => {},
          closePath: () => {},
          moveTo: () => {},
          lineTo: () => {},
          setLineDash: () => {},
          arc: () => {},
          save: () => {},
          restore: () => {},
          translate: () => {},
          scale: () => {},
          fill: () => {},
          stroke: () => {},
          measureText: () => ({ width: 100 }),
          strokeText: () => {},
          fillText: () => {},
          bezierCurveTo: () => {},
          clip: () => {},
        }),
      }),
    });

    let vec3Alloc = 0;
    let mat4Alloc = 0;
    let colorAlloc = 0;

    const trackedThree = {
      ...THREE,
      Vector3: class extends THREE.Vector3 {
        constructor(x?: number, y?: number, z?: number) {
          super(x, y, z);
          if (tracking) vec3Alloc++;
        }
      },
      Matrix4: class extends THREE.Matrix4 {
        constructor() {
          super();
          if (tracking) mat4Alloc++;
        }
      },
      Color: class extends THREE.Color {
        constructor(...args: unknown[]) {
          super(...(args as [never, never, never]));
          if (tracking) colorAlloc++;
        }
      },
    };

    let tracking = false;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1280 / 800, 0.1, 600);
    const canvas = {
      clientWidth: 1280,
      clientHeight: 800,
      addEventListener: () => {},
      removeEventListener: () => {},
    } as unknown as HTMLCanvasElement;

    const mats = createMaterialRegistry(
      trackedThree as unknown as typeof THREE
    );
    const orbit = createOrbitController(
      trackedThree as unknown as typeof THREE,
      canvas,
      () => {}
    );

    let currentBuildState: BuildState = { ...DEFAULT_BUILD_STATE };

    const stage = createAppStage({
      three: trackedThree as unknown as typeof THREE,
      scene,
      mats,
      camera,
      orbitCtrl: orbit,
      getBuildState: () => currentBuildState,
    });

    stage.setVisible(true);

    const box = {
      x0: 0,
      x1: 1280,
      y0: 0,
      y1: 800,
      w: 1280,
      h: 800,
      cx: 640,
      cy: 400,
    };

    // Cycle through all 9 missions during warm-up to pre-populate hero cache
    const missions: BuildState["mission"][] = [
      "brand",
      "web",
      "uiux",
      "decks",
      "copy",
      "motion",
      "3d",
      "fab",
      "ai",
    ];
    for (const m of missions) {
      currentBuildState = { ...currentBuildState, mission: m };
      stage.update({
        t: 1000,
        dt: 16.67,
        p: 0,
        kk: 1,
        box,
        viewportH: 800,
        reduceMotion: false,
      });
    }

    // Now start allocation tracking over 120 consecutive frames
    tracking = true;

    for (let frame = 0; frame < 120; frame++) {
      const t = 2000 + frame * 16.67;
      stage.update({
        t,
        dt: 16.67,
        p: 0.5,
        kk: 0.1,
        box,
        viewportH: 800,
        reduceMotion: false,
      });
    }

    tracking = false;

    console.log("appStage per-frame allocations over 120 frames:", {
      Vector3: vec3Alloc,
      Matrix4: mat4Alloc,
      Color: colorAlloc,
    });

    expect(vec3Alloc).toBe(0);
    expect(mat4Alloc).toBe(0);
    expect(colorAlloc).toBe(0);

    // Verify complete disposal
    stage.dispose();
    expect(stage.group.children.length).toBe(0);

    orbit.dispose();
    mats.dispose();
    vi.unstubAllGlobals();
  });
});
