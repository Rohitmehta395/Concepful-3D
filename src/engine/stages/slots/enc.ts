import type { Stage, StageBuildContext } from "../types";
import type { StageManager } from "../StageManager";
import { createEncStage } from "../enc/EncStage";

/**
 * Encounter stage slot.
 *
 * Owned by lane enc.
 * Intercepts stage selection for active scene "app" when tier === "squad",
 * routing rendering and camera aiming to the encounter stage (SC.enc).
 */
export function registerEncStage(
  manager: StageManager,
  ctx: StageBuildContext
): void {
  let encStage: Stage | null = null;
  let encActive = false;

  const originalSelect = manager.select.bind(manager);
  const originalClearActive = manager.clearActive.bind(manager);
  const originalGetActiveStage = manager.getActiveStage.bind(manager);
  const originalHasBuilder = manager.hasBuilder.bind(manager);
  const originalGetBuiltStage = manager.getBuiltStage.bind(manager);
  const originalDispose = manager.dispose.bind(manager);

  manager.hasBuilder = (key: string): boolean => {
    return key === "enc" || originalHasBuilder(key);
  };

  manager.getBuiltStage = (key: string): Stage | undefined => {
    if (key === "enc") {
      return encStage ?? undefined;
    }
    const buildState = ctx.getBuildState ? ctx.getBuildState() : undefined;
    if (key === "app" && buildState?.tier === "squad") {
      return encStage ?? undefined;
    }
    return originalGetBuiltStage(key);
  };

  manager.getActiveStage = (): Stage | null => {
    if (encActive && encStage) {
      return encStage;
    }
    return originalGetActiveStage();
  };

  manager.clearActive = (): void => {
    if (encActive && encStage) {
      encStage.setVisible(false);
      encActive = false;
    }
    originalClearActive();
  };

  manager.select = (key: string): Stage | null => {
    const buildState = ctx.getBuildState ? ctx.getBuildState() : undefined;
    if (key === "app" && buildState?.tier === "squad") {
      if (!encStage) {
        if (
          process.env.NEXT_PUBLIC_E2E === "1" &&
          typeof window !== "undefined"
        ) {
          const win = window as unknown as {
            __reseed?: (seed?: number) => void;
          };
          if (typeof win.__reseed === "function") {
            win.__reseed(1337);
          }
        }
        encStage = createEncStage(ctx);
        encStage.setVisible(false);
      }

      originalClearActive();
      encActive = true;
      encStage.setVisible(true);
      ctx.scene.background = encStage.backgroundTexture;
      ctx.scene.fog = encStage.fog;
      return encStage;
    }

    if (encActive && encStage) {
      encStage.setVisible(false);
      encActive = false;
    }

    return originalSelect(key);
  };

  manager.dispose = (): void => {
    encActive = false;
    if (encStage) {
      encStage.dispose();
      encStage = null;
    }
    originalDispose();
  };

  if (process.env.NEXT_PUBLIC_E2E === "1" && typeof window !== "undefined") {
    (window as unknown as Record<string, unknown>).__CONCEPFUL_ENC_BENCH__ =
      async (model: string, yawDeg: number, t: number) => {
        const modelsMod = await import("../enc/models");
        const three = ctx.three;
        const mats = ctx.mats;

        const sc = new three.Scene();
        sc.background = new three.Color(0x12161e);
        sc.add(new three.AmbientLight(0xa9acda, 0.6));
        const d1 = new three.DirectionalLight(0xffffff, 0.62);
        d1.position.set(-4, 8, 10);
        sc.add(d1);
        const d2 = new three.DirectionalLight(0xff7fa6, 0.22);
        d2.position.set(6, -2, -6);
        sc.add(d2);

        const cam = new three.PerspectiveCamera(30, 1, 0.1, 600);
        cam.position.set(0, 2.5, 11);
        cam.lookAt(0, 2.0, 0);

        let obj: import("three").Object3D;
        if (model === "barbarian") {
          const b = modelsMod.barbarian(three, mats);
          b.upd(t);
          obj = b.g;
        } else if (model === "furball") {
          const fb = modelsMod.furball(three, mats);
          fb.upd(t);
          obj = fb.g;
        } else if (model === "wyrm") {
          const w = modelsMod.wyrm(three, mats);
          w.upd(t);
          obj = w.g;
        } else if (model === "popPlanet") {
          const pp = modelsMod.popPlanet(three, mats);
          pp.upd(t);
          obj = pp.g;
        } else if (model === "maze") {
          const mz = modelsMod.maze(three, mats);
          obj = mz.g;
        } else if (model === "bossMino") {
          const bm = modelsMod.bossMino(three, mats);
          bm.upd(t);
          obj = bm.g;
        } else {
          throw new Error(`Unknown model: ${model}`);
        }

        obj.rotation.y = (yawDeg * Math.PI) / 180;
        sc.add(obj);

        const renderer = (
          window as unknown as {
            __CONCEPFUL_ENGINE__: { renderer: import("three").WebGLRenderer };
          }
        ).__CONCEPFUL_ENGINE__.renderer;
        renderer.setSize(800, 800, false);
        renderer.render(sc, cam);
      };
  }
}
