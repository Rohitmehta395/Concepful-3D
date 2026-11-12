import { describe, it, expect, vi } from "vitest";
import * as THREE from "three";
import { brandCol, createMaterialRegistry } from "@/engine/world/materials";
import { createOrbitController } from "@/engine/camera/orbitController";
import { createStageManager } from "@/engine/stages/StageManager";
import { createIntroStage } from "@/engine/stages/introStage";
import { createClassesStage } from "@/engine/stages/classesStage";
import { createRulesStage } from "@/engine/stages/rulesStage";

describe("Part 4.4: materials, orbit controller, and classesStage", () => {
  it("matches original brandCol colour mapping across navy ramp, reds, and highlights", () => {
    expect(brandCol("#3A4A55", THREE).toString(16)).toBe("2b2f56");
    expect(brandCol("#12181F", THREE).toString(16)).toBe("12181f");
    expect(brandCol("#8692A2", THREE).toString(16)).toBe("7d80ae");
    expect(brandCol("#4C5664", THREE).toString(16)).toBe("373b69");
    expect(brandCol("#12161E", THREE).toString(16)).toBe("12161e");
    expect(brandCol("#2E3442", THREE).toString(16)).toBe("222546");
    expect(brandCol(0xee004e, THREE).toString(16)).toBe("ee004e");
  });

  it("performs 0 Vector3 / Matrix4 / Color allocations per frame in the update path", () => {
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
          vec3Alloc++;
        }
      },
      Matrix4: class extends THREE.Matrix4 {
        constructor() {
          super();
          mat4Alloc++;
        }
      },
      Color: class extends THREE.Color {
        constructor(c?: THREE.Color | string | number) {
          super(c);
          colorAlloc++;
        }
      },
    } as unknown as typeof THREE;

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(30, 1280 / 800, 0.1, 600);
    const canvas = {
      classList: { add: () => {}, remove: () => {} },
    } as unknown as HTMLCanvasElement;

    const mats = createMaterialRegistry(trackedThree);
    const orbit = createOrbitController(trackedThree, canvas, () => {});
    const mgr = createStageManager(
      scene,
      {
        three: trackedThree,
        scene,
        mats,
        camera: cam,
        orbitCtrl: orbit,
      },
      {
        intro: createIntroStage,
        classes: createClassesStage,
        rules: createRulesStage,
      }
    );

    // Lazy build check (STS semantics)
    expect(mgr.getBuiltStage("intro")).toBeUndefined();
    expect(mgr.getBuiltStage("classes")).toBeUndefined();
    expect(mgr.getBuiltStage("rules")).toBeUndefined();

    const introStage = mgr.select("intro")!;
    const classesStage = mgr.select("classes")!;
    const rulesStage = mgr.select("rules")!;
    expect(mgr.getBuiltStage("intro")).toBe(introStage);
    expect(mgr.getBuiltStage("classes")).toBe(classesStage);
    expect(mgr.getBuiltStage("rules")).toBe(rulesStage);
    expect(mgr.select("logi")).toBeNull();

    const box = {
      x0: 500,
      x1: 1260,
      y0: 69.5,
      y1: 780,
      w: 760,
      h: 710.5,
      cx: 880,
      cy: 424.75,
    };

    // Reset counters after init/build
    vec3Alloc = 0;
    mat4Alloc = 0;
    colorAlloc = 0;

    for (let f = 1; f <= 120; f++) {
      const t = 1000 + f * 16.67;
      orbit.dragStep(16.67, false);
      orbit.autoStep(t, 16.67, false);
      introStage.update({
        t,
        dt: 16.67,
        p: 0.5,
        kk: 0.1,
        box,
        viewportH: 800,
        reduceMotion: false,
      });
      classesStage.update({
        t,
        dt: 16.67,
        p: 0.5,
        kk: 0.1,
        box,
        viewportH: 800,
        reduceMotion: false,
      });
      rulesStage.update({
        t,
        dt: 16.67,
        p: 0.5,
        kk: 0.1,
        box,
        viewportH: 800,
        reduceMotion: false,
      });
    }

    console.log(
      "Per-frame allocations over 120 update frames (intro + classes + rules):",
      {
        Vector3: vec3Alloc,
        Matrix4: mat4Alloc,
        Color: colorAlloc,
      }
    );

    expect(vec3Alloc).toBe(0);
    expect(mat4Alloc).toBe(0);
    expect(colorAlloc).toBe(0);

    mgr.dispose();
    expect(mgr.getBuiltStage("intro")).toBeUndefined();
    expect(mgr.getBuiltStage("classes")).toBeUndefined();
    expect(mgr.getBuiltStage("rules")).toBeUndefined();
    orbit.dispose();
    mats.dispose();
    vi.unstubAllGlobals();
  });
});
