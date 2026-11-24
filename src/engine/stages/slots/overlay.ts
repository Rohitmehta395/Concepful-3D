import type { Stage, StageBuildContext, StageUpdateParams } from "../types";
import type { StageManager } from "../StageManager";
import {
  createPatchManager,
  createEnvbManager,
  createHudManager,
  type PatchManager,
  type EnvbManager,
  type HudManager,
} from "../../overlay/index";

export interface ActiveOverlayHandles {
  readonly patch: PatchManager;
  readonly envb?: EnvbManager;
  readonly hud: HudManager;
}

let activeHandles: ActiveOverlayHandles | null = null;

export function getActiveOverlayHandles(): ActiveOverlayHandles | null {
  return activeHandles;
}

/**
 * Overlay slot.
 *
 * Owned by lane overlay.
 * Wires Phase 7 2D overlays (#patch, #patch2, #cv HUD/callouts) and ENVB drifters
 * to the engine lifecycle and stages.
 */
export function registerOverlay(
  manager: StageManager,
  ctx: StageBuildContext
): void {
  const patchMgr = createPatchManager(ctx.three, ctx.mats);
  const hudMgr = createHudManager();

  let envbMgr: EnvbManager | null = null;
  let isAppAttached = false;

  function attachToAppStage(appStage: Stage): void {
    if (isAppAttached) return;
    isAppAttached = true;

    envbMgr = createEnvbManager(ctx.three, ctx.mats, appStage.group);
    const initialMission = ctx.getBuildState
      ? ctx.getBuildState()?.mission || "brand"
      : "brand";
    envbMgr.setMission(initialMission);

    const origUpdate = appStage.update.bind(appStage);
    appStage.update = (params: StageUpdateParams) => {
      origUpdate(params);

      const bState = ctx.getBuildState ? ctx.getBuildState() : undefined;
      const mission = bState?.mission || "brand";
      if (envbMgr) {
        envbMgr.setMission(mission);
        envbMgr.update(params.t, params.dt, params.reduceMotion);
      }

      // Update #patch and #patch2 canvases
      patchMgr.update(
        params.t,
        bState || { mission: "brand" },
        params.reduceMotion
      );
    };

    const origDispose = appStage.dispose.bind(appStage);
    appStage.dispose = () => {
      if (envbMgr) {
        envbMgr.dispose();
        envbMgr = null;
      }
      patchMgr.dispose();
      hudMgr.dispose();
      origDispose();
    };
  }

  // Check if app stage already exists in cache
  const existingApp = manager.getBuiltStage("app");
  if (existingApp) {
    attachToAppStage(existingApp);
  }

  // Intercept manager.select to attach to appStage whenever it is built
  const origSelect = manager.select.bind(manager);
  manager.select = (key: string): Stage | null => {
    const stage = origSelect(key);
    if (key === "app" && stage && !isAppAttached) {
      attachToAppStage(stage);
    }
    return stage;
  };

  activeHandles = {
    patch: patchMgr,
    get envb() {
      return envbMgr || undefined;
    },
    hud: hudMgr,
  };
}
