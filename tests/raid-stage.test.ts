import { describe, it, expect, vi } from "vitest";
import * as THREE from "three";
import { createMaterialRegistry } from "@/engine/world/materials";
import { createOrbitController } from "@/engine/camera/orbitController";
import { createStageManager } from "@/engine/stages/StageManager";
import { createAppStage } from "@/engine/stages/appStage";
import {
  createRaidStage,
  shipFor,
  backEase,
} from "@/engine/stages/raid/raidStage";
import { registerRaidStage } from "@/engine/stages/slots/raid";
import type { BuildState } from "@/engine/buildState";

describe("Lane raid: Flagship Raid Stage & Slot Contracts", () => {
  it("verifies shipFor mapping according to reference specification", () => {
    // 0 buffs: local (sub)
    expect(shipFor([])).toBe("local");
    // 1-2 buffs: regional (sky cruiser)
    expect(shipFor(["3d"])).toBe("regional");
    expect(shipFor(["3d", "fab"])).toBe("regional");
    // 3-4 buffs: national (star cruiser)
    expect(shipFor(["3d", "fab", "hw"])).toBe("national");
    expect(shipFor(["3d", "fab", "hw", "flow"])).toBe("national");
    // 5+ buffs: global (mothership)
    expect(shipFor(["3d", "fab", "hw", "flow", "cmd"])).toBe("global");
    expect(shipFor(["3d", "fab", "hw", "flow", "cmd", "intel"])).toBe("global");
    expect(shipFor(["3d", "fab", "hw", "flow", "cmd", "intel", "rush"])).toBe(
      "global"
    );
  });

  it("verifies backEase curve: 0 at u=0, 1 at u=1", () => {
    expect(backEase(0)).toBeCloseTo(0, 5);
    expect(backEase(1)).toBe(1);
  });

  it("performs 0 Vector3 / Matrix4 / Color allocations per frame in update loop", () => {
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

    const scene = new trackedThree.Scene();
    const mats = createMaterialRegistry(trackedThree);
    const camera = new trackedThree.PerspectiveCamera(30, 1280 / 800, 0.1, 600);
    const mockCanvas = {
      clientWidth: 1280,
      clientHeight: 800,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      classList: { add: vi.fn(), remove: vi.fn() },
    } as unknown as HTMLCanvasElement;
    const orbitCtrl = createOrbitController(trackedThree, mockCanvas, () => {});

    const mockBuildState: BuildState = {
      tier: "combine",
      reach: "global",
      mission: "brand",
      objective: "gtm",
      objectives: ["gtm", "dir", "research", "product"],
      buffs: ["3d", "fab", "hw", "cmd", "intel", "flow", "rush"],
    };

    const ctx = {
      three: trackedThree,
      scene,
      mats,
      camera,
      orbitCtrl,
      getBuildState: () => mockBuildState,
    };

    const stage = createRaidStage(ctx);
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

    // Warm up initial construction
    stage.update({
      t: 50000,
      dt: 16.67,
      p: 1,
      kk: 1,
      box,
      viewportH: 800,
      reduceMotion: false,
    });

    vec3Alloc = 0;
    mat4Alloc = 0;
    colorAlloc = 0;

    for (let f = 1; f <= 120; f++) {
      const t = 50000 + f * 16.67;
      stage.update({
        t,
        dt: 16.67,
        p: 1,
        kk: 0.08,
        box,
        viewportH: 800,
        reduceMotion: false,
      });
    }

    console.log("Raid stage per-frame allocations over 120 frames:", {
      Vector3: vec3Alloc,
      Matrix4: mat4Alloc,
      Color: colorAlloc,
    });

    expect(vec3Alloc).toBe(0);
    expect(mat4Alloc).toBe(0);
    expect(colorAlloc).toBe(0);

    stage.dispose();
    orbitCtrl.dispose();
    mats.dispose();
    vi.unstubAllGlobals();
  });

  it("handles slot registration and seamless tier switching between app (solo) and raid (combine)", () => {
    const scene = new THREE.Scene();
    const mats = createMaterialRegistry(THREE);
    const camera = new THREE.PerspectiveCamera(30, 1280 / 800, 0.1, 600);
    const mockCanvas = {
      clientWidth: 1280,
      clientHeight: 800,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      classList: { add: vi.fn(), remove: vi.fn() },
    } as unknown as HTMLCanvasElement;
    const orbitCtrl = createOrbitController(THREE, mockCanvas, () => {});

    let currentBuildState: BuildState = {
      tier: "solo",
      reach: "local",
      mission: "brand",
      objective: "gtm",
      objectives: ["gtm"],
      buffs: [],
    };

    const ctx = {
      three: THREE,
      scene,
      mats,
      camera,
      orbitCtrl,
      getBuildState: () => currentBuildState,
    };

    const manager = createStageManager(scene, ctx, {
      app: createAppStage,
    });

    registerRaidStage(manager, ctx);

    // Initial state: solo tier on "app" scene
    const initialStage = manager.select("app");
    expect(initialStage).not.toBeNull();
    expect(initialStage?.key).toBe("app");
    expect(manager.getActiveStage()?.key).toBe("app");

    // Switch to combine tier: manager.select("app") automatically delegates to raid
    currentBuildState = {
      ...currentBuildState,
      tier: "combine",
      buffs: ["3d", "fab"],
    };
    const combineStage = manager.select("app");
    expect(combineStage).not.toBeNull();
    expect(combineStage?.key).toBe("raid");
    expect(manager.getActiveStage()?.key).toBe("raid");

    // Direct selection of "raid" also resolves
    expect(manager.hasBuilder("raid")).toBe(true);
    const directRaid = manager.select("raid");
    expect(directRaid?.key).toBe("raid");

    // Switch back to solo
    currentBuildState = {
      ...currentBuildState,
      tier: "solo",
      buffs: [],
    };
    const soloStage = manager.select("app");
    expect(soloStage?.key).toBe("app");

    manager.dispose();
    orbitCtrl.dispose();
    mats.dispose();
  });
});
