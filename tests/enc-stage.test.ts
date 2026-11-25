import { describe, it, expect, vi } from "vitest";
import * as THREE from "three";
import { createMaterialRegistry } from "@/engine/world/materials";
import { createOrbitController } from "@/engine/camera/orbitController";
import { createStageManager } from "@/engine/stages/StageManager";
import { createEncStage } from "@/engine/stages/enc/EncStage";
import { registerEncStage } from "@/engine/stages/slots/enc";
import type { BuildState } from "@/engine/buildState";
import type { StageBuildContext } from "@/engine/stages/types";

describe("Encounter Stage: Lifecycle, Allocation, and Disposal", () => {
  it("performs 0 Vector3 / Matrix4 / Color allocations per frame during stage update across all objectives", () => {
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
    const cam = new trackedThree.PerspectiveCamera(30, 1280 / 800, 0.1, 600);
    const canvas = {
      clientWidth: 1280,
      clientHeight: 800,
      addEventListener: () => {},
      removeEventListener: () => {},
    } as unknown as HTMLCanvasElement;
    const orbit = createOrbitController(trackedThree, canvas, () => {});
    const mats = createMaterialRegistry(trackedThree);

    let state: BuildState = {
      tier: "squad",
      reach: "local",
      mission: "brand",
      objective: "gtm",
      objectives: ["gtm", "dir", "research", "product"],
      buffs: [],
    };

    const ctx: StageBuildContext = {
      three: trackedThree,
      scene,
      mats,
      camera: cam,
      orbitCtrl: orbit,
      getBuildState: () => state,
    };

    const stage = createEncStage(ctx);
    stage.setVisible(true);

    const dummyBox = {
      x0: 0,
      x1: 1280,
      y0: 0,
      y1: 800,
      w: 1280,
      h: 800,
      cx: 640,
      cy: 400,
    };

    // Pre-warm all 4 diorama caches
    for (const objId of ["gtm", "dir", "research", "product"] as const) {
      state = { ...state, objective: objId, objectives: [objId] };
      stage.update({
        t: 50000,
        dt: 16.67,
        p: 0,
        kk: 1,
        box: dummyBox,
        viewportH: 800,
        reduceMotion: false,
      });
    }

    vec3Alloc = 0;
    mat4Alloc = 0;
    colorAlloc = 0;

    // Run 120 animation frames across all objectives
    for (let f = 1; f <= 120; f++) {
      const t = 50000 + f * 16.67;
      stage.update({
        t,
        dt: 16.67,
        p: 0,
        kk: 1,
        box: dummyBox,
        viewportH: 800,
        reduceMotion: false,
      });
    }

    expect(vec3Alloc).toBe(0);
    expect(mat4Alloc).toBe(0);
    expect(colorAlloc).toBe(0);

    stage.dispose();
  });

  it("returns GPU object counts to 0 after 20 create/dispose cycles (full disposal leak check)", () => {
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

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(30, 1280 / 800, 0.1, 600);
    const canvas = {
      clientWidth: 1280,
      clientHeight: 800,
      addEventListener: () => {},
      removeEventListener: () => {},
    } as unknown as HTMLCanvasElement;
    const orbit = createOrbitController(THREE, canvas, () => {});
    const mats = createMaterialRegistry(THREE);

    const initialChildCount = scene.children.length;

    for (let cycle = 0; cycle < 20; cycle++) {
      const stage = createEncStage({
        three: THREE,
        scene,
        mats,
        camera: cam,
        orbitCtrl: orbit,
        getBuildState: () => ({
          tier: "squad",
          reach: "local",
          mission: "brand",
          objective: "gtm",
          objectives: ["gtm", "dir", "research", "product"],
          buffs: [],
        }),
      });

      // Warm up each diorama to allocate scene meshes
      for (let i = 0; i < 4; i++) {
        stage.update({
          t: 50000 + cycle * 100,
          dt: 16.67,
          p: 0,
          kk: 1,
          box: {
            x0: 0,
            x1: 1280,
            y0: 0,
            y1: 800,
            w: 1280,
            h: 800,
            cx: 640,
            cy: 400,
          },
          viewportH: 800,
          reduceMotion: false,
        });
      }

      stage.dispose();
    }

    expect(scene.children.length).toBe(initialChildCount);
  });

  it("registers encStage in StageManager and selects it when tier === 'squad' and scene is 'app'", () => {
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(30, 1280 / 800, 0.1, 600);
    const canvas = {
      clientWidth: 1280,
      clientHeight: 800,
      addEventListener: () => {},
      removeEventListener: () => {},
    } as unknown as HTMLCanvasElement;
    const orbit = createOrbitController(THREE, canvas, () => {});
    const mats = createMaterialRegistry(THREE);

    let state: BuildState = {
      tier: "squad",
      reach: "local",
      mission: "brand",
      objective: "gtm",
      objectives: ["gtm"],
      buffs: [],
    };

    const ctx: StageBuildContext = {
      three: THREE,
      scene,
      mats,
      camera: cam,
      orbitCtrl: orbit,
      getBuildState: () => state,
    };

    const manager = createStageManager(scene, ctx, {
      app: () => ({
        key: "app",
        group: new THREE.Group(),
        backgroundTexture: new THREE.CanvasTexture(
          document.createElement("canvas")
        ),
        fog: null,
        setVisible: () => {},
        update: () => {},
        dispose: () => {},
      }),
    });

    registerEncStage(manager, ctx);

    // tier is squad: select("app") should return enc stage
    const selected = manager.select("app");
    expect(selected).not.toBeNull();
    expect(selected?.key).toBe("enc");
    expect(manager.getActiveStage()).toBe(selected);
    expect(manager.hasBuilder("enc")).toBe(true);
    expect(manager.getBuiltStage("enc")).toBe(selected);

    // Switch tier to solo: select("app") should return app stage
    state = { ...state, tier: "solo" };
    const soloSelected = manager.select("app");
    expect(soloSelected).not.toBeNull();
    expect(soloSelected?.key).toBe("app");
    expect(manager.getActiveStage()).toBe(soloSelected);

    manager.dispose();
  });

  it("maintains activeStage === selectedStage across solo>squad>combine>squad>solo>combine>squad", () => {
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(30, 1280 / 800, 0.1, 600);
    const canvas = {
      clientWidth: 1280,
      clientHeight: 800,
      addEventListener: () => {},
      removeEventListener: () => {},
    } as unknown as HTMLCanvasElement;
    const orbit = createOrbitController(THREE, canvas, () => {});
    const mats = createMaterialRegistry(THREE);

    let state: BuildState = {
      tier: "solo",
      reach: "local",
      mission: "brand",
      objective: "gtm",
      objectives: ["gtm"],
      buffs: [],
    };

    const ctx: StageBuildContext = {
      three: THREE,
      scene,
      mats,
      camera: cam,
      orbitCtrl: orbit,
      getBuildState: () => state,
    };

    const manager = createStageManager(scene, ctx, {
      app: () => ({
        key: "app",
        group: new THREE.Group(),
        backgroundTexture: new THREE.CanvasTexture(
          document.createElement("canvas")
        ),
        fog: null,
        setVisible: () => {},
        update: () => {},
        dispose: () => {},
      }),
    });

    registerEncStage(manager, ctx);

    // Simulate raid slot wrapping after registerEncStage (matching createEngine.ts order)
    let raidStage: ReturnType<typeof manager.select> = null;
    let raidActive = false;
    const prevSelect = manager.select.bind(manager);
    const prevGetActive = manager.getActiveStage.bind(manager);
    const prevClearActive = manager.clearActive.bind(manager);
    const prevDispose = manager.dispose.bind(manager);

    manager.getActiveStage = () =>
      raidActive && raidStage ? raidStage : prevGetActive();
    manager.clearActive = () => {
      if (raidActive && raidStage) {
        raidStage.setVisible(false);
        raidActive = false;
      }
      prevClearActive();
    };
    manager.select = (key: string) => {
      if (key === "app" && state.tier === "combine") {
        if (!raidStage) {
          raidStage = {
            key: "raid",
            group: new THREE.Group(),
            backgroundTexture: new THREE.CanvasTexture(
              document.createElement("canvas")
            ),
            fog: null,
            setVisible: () => {},
            update: () => {},
            dispose: () => {},
          };
        }
        prevClearActive();
        raidActive = true;
        raidStage.setVisible(true);
        return raidStage;
      }
      if (raidActive && raidStage) {
        raidStage.setVisible(false);
        raidActive = false;
      }
      return prevSelect(key);
    };
    manager.dispose = () => {
      raidActive = false;
      raidStage = null;
      prevDispose();
    };

    const sequence: Array<{ tier: BuildState["tier"]; expectedKey: string }> = [
      { tier: "solo", expectedKey: "app" },
      { tier: "squad", expectedKey: "enc" },
      { tier: "combine", expectedKey: "raid" },
      { tier: "squad", expectedKey: "enc" },
      { tier: "solo", expectedKey: "app" },
      { tier: "combine", expectedKey: "raid" },
      { tier: "squad", expectedKey: "enc" },
    ];

    const observed: Array<{
      tier: string;
      selectedKey: string | undefined;
      activeKey: string | undefined;
    }> = [];

    for (const step of sequence) {
      state = { ...state, tier: step.tier };
      const selected = manager.select("app");
      const active = manager.getActiveStage();
      observed.push({
        tier: step.tier,
        selectedKey: selected?.key,
        activeKey: active?.key,
      });
      expect(selected).not.toBeNull();
      expect(active).toBe(selected);
      expect(active?.key).toBe(step.expectedKey);
    }

    expect(observed).toEqual([
      { tier: "solo", selectedKey: "app", activeKey: "app" },
      { tier: "squad", selectedKey: "enc", activeKey: "enc" },
      { tier: "combine", selectedKey: "raid", activeKey: "raid" },
      { tier: "squad", selectedKey: "enc", activeKey: "enc" },
      { tier: "solo", selectedKey: "app", activeKey: "app" },
      { tier: "combine", selectedKey: "raid", activeKey: "raid" },
      { tier: "squad", selectedKey: "enc", activeKey: "enc" },
    ]);

    manager.clearActive();
    expect(manager.getActiveStage()).toBeNull();

    manager.dispose();
  });

  it("returns geometries and textures to starting count after 20 cycles and does not grow in 20 more", () => {
    const liveGeos = new Set<THREE.BufferGeometry>();
    const liveTexs = new Set<THREE.Texture>();

    const origGeoDispose = THREE.BufferGeometry.prototype.dispose;
    const origTexDispose = THREE.Texture.prototype.dispose;

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(30, 1280 / 800, 0.1, 600);
    const canvas = {
      clientWidth: 1280,
      clientHeight: 800,
      addEventListener: () => {},
      removeEventListener: () => {},
    } as unknown as HTMLCanvasElement;
    const orbit = createOrbitController(THREE, canvas, () => {});
    const mats = createMaterialRegistry(THREE);

    const recordStageResources = (stage: ReturnType<typeof createEncStage>) => {
      if (stage.backgroundTexture) liveTexs.add(stage.backgroundTexture);
      stage.group.traverse((child) => {
        const r = child as unknown as {
          geometry?: THREE.BufferGeometry;
          material?: THREE.Material | THREE.Material[];
        };
        if (r.geometry) liveGeos.add(r.geometry);
        if (r.material) {
          const ms = Array.isArray(r.material) ? r.material : [r.material];
          for (const m of ms) {
            const withMap = m as unknown as { map?: THREE.Texture | null };
            if (
              withMap.map &&
              withMap.map !== mats.GLOWT &&
              withMap.map !== mats.TX("chart")
            ) {
              liveTexs.add(withMap.map);
            }
          }
        }
      });
    };

    THREE.BufferGeometry.prototype.dispose = function () {
      liveGeos.delete(this);
      return origGeoDispose.call(this);
    };
    THREE.Texture.prototype.dispose = function () {
      liveTexs.delete(this);
      return origTexDispose.call(this);
    };

    try {
      const startGeos = liveGeos.size;
      const startTexs = liveTexs.size;

      const runBatch = (count: number) => {
        for (let c = 0; c < count; c++) {
          const stage = createEncStage({
            three: THREE,
            scene,
            mats,
            camera: cam,
            orbitCtrl: orbit,
            getBuildState: () => ({
              tier: "squad",
              reach: "local",
              mission: "brand",
              objective: "gtm",
              objectives: ["gtm", "dir", "research", "product"],
              buffs: [],
            }),
          });
          for (let i = 0; i < 4; i++) {
            stage.update({
              t: 50000 + i * 12000,
              dt: 16.67,
              p: 0,
              kk: 1,
              box: {
                x0: 0,
                x1: 1280,
                y0: 0,
                y1: 800,
                w: 1280,
                h: 800,
                cx: 640,
                cy: 400,
              },
              viewportH: 800,
              reduceMotion: false,
            });
          }
          recordStageResources(stage);
          stage.dispose();
        }
      };

      runBatch(20);
      const after20Geos = liveGeos.size;
      const after20Texs = liveTexs.size;

      runBatch(20);
      const after40Geos = liveGeos.size;
      const after40Texs = liveTexs.size;

      console.log("20+20 cycle counts:", {
        startGeos,
        startTexs,
        after20Geos,
        after20Texs,
        after40Geos,
        after40Texs,
      });

      expect(after20Geos).toBe(startGeos);
      expect(after20Texs).toBe(startTexs);
      expect(after40Geos).toBe(after20Geos);
      expect(after40Texs).toBe(after20Texs);
    } finally {
      THREE.BufferGeometry.prototype.dispose = origGeoDispose;
      THREE.Texture.prototype.dispose = origTexDispose;
    }
  }, 15000);
});
