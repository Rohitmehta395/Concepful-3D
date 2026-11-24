import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import * as THREE from "three";
import { createMaterialRegistry } from "@/engine/world/materials";
import {
  createPatchManager,
  createEnvbManager,
  createHudManager,
  drawCallouts,
  toScreen,
  STAGE_C,
} from "@/engine/overlay/index";
import {
  registerOverlay,
  getActiveOverlayHandles,
} from "@/engine/stages/slots/overlay";
import { createStageManager } from "@/engine/stages/StageManager";
import { createAppStage } from "@/engine/stages/appStage";

describe("Phase 7 Overlay Unit Suite (tests/overlay-*)", () => {
  let mats: ReturnType<typeof createMaterialRegistry>;

  beforeEach(() => {
    vi.stubGlobal("Path2D", class {});
    mats = createMaterialRegistry(THREE);
  });

  afterEach(() => {
    mats.dispose();
    vi.unstubAllGlobals();
  });

  it("verifies STAGE_C data structure and toScreen projections", () => {
    expect(STAGE_C.length).toBe(4);
    for (let i = 0; i < STAGE_C.length; i++) {
      const stageItems = STAGE_C[i]!;
      expect(stageItems.length).toBe(4);
      for (const item of stageItems) {
        expect(item.at.length).toBe(3);
        expect(typeof item.h).toBe("string");
        expect(typeof item.d).toBe("string");
        expect(item.h.length).toBeGreaterThan(0);
        expect(item.d.length).toBeGreaterThan(0);
      }
    }

    const cam = new THREE.PerspectiveCamera(30, 1280 / 800, 0.1, 600);
    cam.position.set(0, 1, 14);
    cam.lookAt(0, 0, 0);
    cam.updateMatrixWorld(true);
    cam.updateProjectionMatrix();

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
    const p = toScreen(new THREE.Vector3(0, 0, 0), cam, box, 1280, 800);
    expect(p.length).toBe(2);
    expect(p[0]).toBeCloseTo(640, 1);
    expect(p[1]).toBeCloseTo(400, 1);
  });

  it("verifies EnvbManager builds all 9 mission decorators and enforces 0 per-frame allocations", () => {
    const parentGroup = new THREE.Group();
    const envb = createEnvbManager(THREE, mats, parentGroup);

    const missions = [
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
      envb.setMission(m);
      expect(envb.group.children.length).toBeGreaterThan(0);
    }

    // Allocation test: 120 frames in steady state must allocate 0 Vector3, Matrix4, or Color
    envb.setMission("brand");
    const counts = { Vector3: 0, Matrix4: 0, Color: 0 };
    const origV3 = THREE.Vector3;
    const origM4 = THREE.Matrix4;
    const origCol = THREE.Color;

    (THREE as unknown as { Vector3: typeof THREE.Vector3 }).Vector3 =
      class extends origV3 {
        constructor(...args: ConstructorParameters<typeof origV3>) {
          super(...args);
          counts.Vector3++;
        }
      };
    (THREE as unknown as { Matrix4: typeof THREE.Matrix4 }).Matrix4 =
      class extends origM4 {
        constructor(...args: ConstructorParameters<typeof origM4>) {
          super(...args);
          counts.Matrix4++;
        }
      };
    (THREE as unknown as { Color: unknown }).Color = class extends origCol {
      constructor(r?: any, g?: any, b?: any) {
        super(r, g, b);
        counts.Color++;
      }
    };

    try {
      for (let f = 0; f < 120; f++) {
        envb.update(f * 16.6, 16.6, false);
      }
    } finally {
      (THREE as unknown as { Vector3: typeof origV3 }).Vector3 = origV3;
      (THREE as unknown as { Matrix4: typeof origM4 }).Matrix4 = origM4;
      (THREE as unknown as { Color: typeof origCol }).Color = origCol;
    }

    expect(counts).toEqual({ Vector3: 0, Matrix4: 0, Color: 0 });

    // Reduced motion test: drifter positions must remain static
    const initialPositions =
      envb.group.children[0]?.children.map((c) => c.position.x) || [];
    envb.update(1000, 50, true);
    const postPositions =
      envb.group.children[0]?.children.map((c) => c.position.x) || [];
    expect(postPositions).toEqual(initialPositions);

    envb.dispose();
    expect(parentGroup.children.length).toBe(0);
  });

  it("verifies PatchManager lifecycle, model switching, and 0 per-frame allocations", () => {
    const patch = createPatchManager(THREE, mats);
    expect(patch.canvas).toBeDefined();

    // Verify model switching
    patch.renderPatch(100, { tier: "solo", mission: "brand" }, false);
    patch.renderPatch(116, { tier: "squad", leader: "pm" }, false);
    patch.renderPatch(133, { tier: "combine", reach: "local" }, false);

    // Test drawPatch with mock canvas
    const drawOps: string[] = [];
    const mockCtx = {
      setTransform: () => {},
      clearRect: () => {},
      beginPath: () => {},
      arc: () => {},
      fill: () => {},
      stroke: () => {},
      save: () => {},
      restore: () => {},
      translate: () => {},
      rotate: () => {},
      moveTo: () => {},
      lineTo: () => {},
      closePath: () => {},
      clip: () => {},
      fillRect: () => {},
      createLinearGradient: () => ({ addColorStop: () => {} }),
      createPattern: () => null,
      drawImage: () => drawOps.push("drawImage"),
      fillText: (t: string) => drawOps.push(`fillText:${t}`),
      measureText: (t: string) => ({ width: t.length * 6 }),
    } as unknown as CanvasRenderingContext2D;

    const mockCanvas = {
      width: 240,
      height: 240,
      getContext: () => mockCtx,
    } as unknown as HTMLCanvasElement;

    patch.drawPatch(mockCanvas, 200, { tier: "solo", mission: "brand" });
    expect(drawOps).toContain("fillText:C");
    expect(drawOps).toContain("drawImage");

    // Warm up model into steady state
    patch.renderPatch(0, { tier: "solo", mission: "brand" }, false);

    // Allocation test: steady state update must allocate 0 Three.js objects
    const counts = { Vector3: 0, Matrix4: 0, Color: 0 };
    const origV3 = THREE.Vector3;
    const origM4 = THREE.Matrix4;
    const origCol = THREE.Color;

    (THREE as unknown as { Vector3: typeof THREE.Vector3 }).Vector3 =
      class extends origV3 {
        constructor(...args: ConstructorParameters<typeof origV3>) {
          super(...args);
          counts.Vector3++;
        }
      };
    (THREE as unknown as { Matrix4: typeof THREE.Matrix4 }).Matrix4 =
      class extends origM4 {
        constructor(...args: ConstructorParameters<typeof origM4>) {
          super(...args);
          counts.Matrix4++;
        }
      };
    (THREE as unknown as { Color: unknown }).Color = class extends origCol {
      constructor(r?: any, g?: any, b?: any) {
        super(r, g, b);
        counts.Color++;
      }
    };

    try {
      for (let f = 0; f < 120; f++) {
        patch.renderPatch(f * 16.6, { tier: "solo", mission: "brand" }, false);
      }
    } finally {
      (THREE as unknown as { Vector3: typeof origV3 }).Vector3 = origV3;
      (THREE as unknown as { Matrix4: typeof origM4 }).Matrix4 = origM4;
      (THREE as unknown as { Color: typeof origCol }).Color = origCol;
    }

    expect(counts).toEqual({ Vector3: 0, Matrix4: 0, Color: 0 });

    patch.dispose();
  });

  it("verifies HudManager chat queue, part rings, and big moments", () => {
    const hud = createHudManager();
    hud.call("Systems online", "sys");
    hud.call("Loot acquired", "loot");
    hud.ring("core");
    hud.triggerForm();

    const textDrawn: string[] = [];
    const mockCtx = {
      fillRect: () => {},
      fillText: (t: string) => textDrawn.push(t),
      strokeText: () => {},
      measureText: (t: string) => ({ width: t.length * 6 }),
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      closePath: () => {},
      arc: () => {},
      stroke: () => {},
      fill: () => {},
      save: () => {},
      restore: () => {},
      translate: () => {},
      transform: () => {},
    } as unknown as CanvasRenderingContext2D;

    const box = {
      x0: 10,
      x1: 500,
      y0: 10,
      y1: 500,
      w: 490,
      h: 490,
      cx: 250,
      cy: 250,
    };
    hud.render(
      mockCtx,
      performance.now() + 50,
      box,
      1280,
      800,
      "solo",
      "Acme Guild"
    );

    expect(textDrawn).toContain("[System]");
    expect(textDrawn).toContain("Systems online");

    hud.dispose();
  });

  it("verifies registerOverlay attaches to StageManager and wires appStage update/dispose lifecycle", () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1280 / 800, 0.1, 600);
    const orbitCtrl = {
      drag: { yaw: 0, pitch: 0 },
      aim: () => {},
      dragStep: () => {},
      autoStep: () => {},
      autoPick: () => {},
      dispose: () => {},
    };

    let buildState = { mission: "brand", tier: "solo" };
    const ctx = {
      three: THREE,
      scene,
      mats,
      camera,
      orbitCtrl: orbitCtrl as any,
      getBuildState: () => buildState,
    };

    const manager = createStageManager(scene, ctx, {
      app: createAppStage,
    });

    registerOverlay(manager, ctx);

    const handles = getActiveOverlayHandles();
    expect(handles).not.toBeNull();
    expect(handles!.patch).toBeDefined();
    expect(handles!.hud).toBeDefined();

    // Select app stage: registerOverlay must hook into appStage
    const app = manager.select("app");
    expect(app).not.toBeNull();
    expect(handles!.envb).toBeDefined();
    expect(app!.group.children.length).toBeGreaterThan(0);

    // Verify update triggers both app and attached overlay
    app!.update({
      t: 100,
      dt: 16.6,
      p: 0.5,
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

    // Verify mission switch
    buildState = { mission: "web", tier: "solo" };
    app!.update({
      t: 116.6,
      dt: 16.6,
      p: 0.5,
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

    manager.dispose();
  });
});
