import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import * as THREE from "three";
import { createMaterialRegistry } from "@/engine/world/materials";
import {
  createPatchManager,
  createEnvbManager,
  createHudManager,
  toScreen,
  STAGE_C,
} from "@/engine/overlay/index";
import {
  registerOverlay,
  getActiveOverlayHandles,
} from "@/engine/stages/slots/overlay";
import { createStageManager } from "@/engine/stages/StageManager";
import type {
  StageBuildContext,
  StageUpdateParams,
} from "@/engine/stages/types";
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
    (THREE as unknown as { Color: typeof origCol }).Color = class extends (
      origCol
    ) {
      constructor(c?: THREE.Color | string | number) {
        super(c);
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
    (THREE as unknown as { Color: typeof origCol }).Color = class extends (
      origCol
    ) {
      constructor(c?: THREE.Color | string | number) {
        super(c);
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
      orbitCtrl: orbitCtrl as unknown as Parameters<
        typeof createStageManager
      >[1]["orbitCtrl"],
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

  it("attaches ENVB only to base appStage on solo, hides on enc/raid, and updates #patch across all three stages", () => {
    const mockBox = {
      x0: 0,
      x1: 1280,
      y0: 0,
      y1: 800,
      w: 1280,
      h: 800,
      cx: 640,
      cy: 400,
    };
    const appGroup = new THREE.Group();
    const encGroup = new THREE.Group();
    const raidGroup = new THREE.Group();

    let appUpdateCount = 0;
    let encUpdateCount = 0;
    let raidUpdateCount = 0;

    const makeStage = (
      key: string,
      group: THREE.Group,
      onUpdate: (_params: StageUpdateParams) => void
    ) => ({
      key,
      group,
      backgroundTexture: new THREE.CanvasTexture(
        null as unknown as HTMLCanvasElement
      ),
      fog: null,
      setVisible: (v: boolean) => {
        group.visible = v;
      },
      update: onUpdate,
      dispose: () => {},
    });

    const baseAppStage = makeStage("app", appGroup, () => appUpdateCount++);
    const encStage = makeStage("enc", encGroup, () => encUpdateCount++);
    const raidStage = makeStage("raid", raidGroup, () => raidUpdateCount++);

    let buildState: {
      mission: string;
      tier?: string;
      objectives?: string[];
      buffs?: string[];
    } = {
      mission: "uiux",
      tier: "squad",
      objectives: ["gtm"],
      buffs: [],
    };

    let builtApp: typeof baseAppStage | undefined;
    let builtEnc: typeof encStage | undefined;
    let builtRaid: typeof raidStage | undefined;
    const mockManager = {
      hasBuilder: () => true,
      registerStage: () => {},
      getBuiltStage: (k: string) =>
        k === "app"
          ? builtApp
          : k === "enc"
            ? builtEnc
            : k === "raid"
              ? builtRaid
              : undefined,
      getActiveStage: () => null,
      select: (k: string) => {
        if (k === "enc") {
          if (!builtEnc) builtEnc = encStage;
          return builtEnc;
        }
        if (k === "raid") {
          if (!builtRaid) builtRaid = raidStage;
          return builtRaid;
        }
        if (k === "app") {
          if (!builtApp) builtApp = baseAppStage;
          return builtApp;
        }
        return null;
      },
      clearActive: () => {},
      dispose: () => {},
    };

    const mats = createMaterialRegistry(THREE);
    const ctx = {
      three: THREE,
      scene: new THREE.Scene(),
      mats,
      camera: new THREE.PerspectiveCamera(45, 1, 0.1, 100),
      orbitCtrl: {
        drag: { yaw: 0, pitch: 0 },
        aim: () => {},
      } as unknown as StageBuildContext["orbitCtrl"],
      getBuildState: () => buildState,
    };

    registerOverlay(mockManager, ctx);
    const handles = getActiveOverlayHandles()!;

    // Stub #card and #patch so patchMgr.update renders patchModel on each stage update
    const mockCard = { getBoundingClientRect: () => ({ width: 200 }) };
    const mockPatchCanvas = {
      id: "patch",
      width: 132,
      height: 132,
      getContext: () => ({
        setTransform: () => {},
        clearRect: () => {},
        beginPath: () => {},
        arc: () => {},
        fill: () => {},
        stroke: () => {},
        save: () => {},
        clip: () => {},
        restore: () => {},
        fillRect: () => {},
        createLinearGradient: () => ({ addColorStop: () => {} }),
        createPattern: () => null,
        drawImage: () => {},
        translate: () => {},
        rotate: () => {},
        fillText: () => {},
        moveTo: () => {},
        lineTo: () => {},
        closePath: () => {},
      }),
    };
    const origDoc = globalThis.document;
    vi.stubGlobal("document", {
      getElementById: (id: string) => {
        if (id === "card") return mockCard as unknown as HTMLElement;
        if (id === "patch") return mockPatchCanvas as unknown as HTMLElement;
        return origDoc ? origDoc.getElementById(id) : null;
      },
      createElement: origDoc
        ? origDoc.createElement.bind(origDoc)
        : () => ({ width: 7, height: 7, getContext: () => null }),
    });

    try {
      // 1. First visit is squad -> createEngine selects "enc", ENVB must NOT attach yet, patchKey = "u:gtm"
      const s1 = mockManager.select("enc");
      expect(s1).toBe(encStage);
      expect(handles.envb).toBeUndefined();
      expect(encGroup.children.length).toBe(0);
      s1!.update({
        t: 100,
        dt: 16.6,
        p: 0.5,
        kk: 1,
        box: mockBox,
        viewportH: 800,
        reduceMotion: false,
      });
      expect(encUpdateCount).toBe(1);
      expect(handles.patch.getDebugInfo?.().key).toBe("u:gtm");

      // 2. Switch to combine -> createEngine selects "raid", ENVB still NOT attached, patchKey = "s:local"
      buildState = {
        mission: "uiux",
        tier: "combine",
        objectives: ["gtm"],
        buffs: [],
      };
      const s2 = mockManager.select("raid");
      expect(s2).toBe(raidStage);
      expect(handles.envb).toBeUndefined();
      s2!.update({
        t: 116.6,
        dt: 16.6,
        p: 0.5,
        kk: 1,
        box: mockBox,
        viewportH: 800,
        reduceMotion: false,
      });
      expect(raidUpdateCount).toBe(1);
      expect(handles.patch.getDebugInfo?.().key).toBe("s:local");

      // 3. Switch to solo -> createEngine selects "app", ENVB attaches with 15 uiux children, patchKey = "h:uiux"
      buildState = {
        mission: "uiux",
        tier: "solo",
        objectives: ["gtm"],
        buffs: [],
      };
      const s3 = mockManager.select("app");
      expect(s3).toBe(baseAppStage);
      expect(handles.envb).toBeDefined();
      expect(handles.envb!.group.visible).toBe(true);
      s3!.update({
        t: 133.3,
        dt: 16.6,
        p: 0.5,
        kk: 1,
        box: mockBox,
        viewportH: 800,
        reduceMotion: false,
      });
      expect(appUpdateCount).toBe(1);
      expect(handles.patch.getDebugInfo?.().key).toBe("h:uiux");
      const activeUiux = handles.envb!.group.children.find((c) => c.visible);
      expect(activeUiux).toBeDefined();
      expect(activeUiux!.children.length).toBe(15);

      // 4. Switch back to squad ("enc") -> ENVB must hide
      buildState = {
        mission: "uiux",
        tier: "squad",
        objectives: ["gtm"],
        buffs: [],
      };
      mockManager.select("enc");
      expect(handles.envb!.group.visible).toBe(false);
    } finally {
      vi.unstubAllGlobals();
    }

    mockManager.dispose();
  });
});
