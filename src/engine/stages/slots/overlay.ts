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
  let baseAppStageRef: Stage | null = null;
  const hookedPatchStages = new WeakSet<Stage>();

  function getMissionAndTier() {
    const bState = ctx.getBuildState ? ctx.getBuildState() : undefined;
    return {
      bState,
      mission: bState?.mission || "brand",
      tier: bState?.tier || "solo",
    };
  }

  function attachPatchToStage(stage: Stage): void {
    if (hookedPatchStages.has(stage)) return;
    hookedPatchStages.add(stage);

    const origUpdate = stage.update.bind(stage);
    stage.update = (params: StageUpdateParams) => {
      origUpdate(params);

      const { bState, mission, tier } = getMissionAndTier();
      if (envbMgr) {
        const isBaseAppSolo = stage === baseAppStageRef && tier === "solo";
        envbMgr.group.visible = isBaseAppSolo;
        if (isBaseAppSolo) {
          envbMgr.setMission(mission);
          envbMgr.update(params.t, params.dt, params.reduceMotion);
        }
      }

      // Update #patch and #patch2 canvases across all app-mode stages (appStage, encStage, raidStage)
      patchMgr.update(
        params.t,
        bState || { mission: "brand" },
        params.reduceMotion
      );
    };
  }

  function attachEnvbToBaseAppStage(baseAppStage: Stage): void {
    if (envbMgr) return;
    baseAppStageRef = baseAppStage;
    envbMgr = createEnvbManager(ctx.three, ctx.mats, baseAppStage.group);
    const { mission, tier } = getMissionAndTier();
    envbMgr.setMission(mission);
    envbMgr.group.visible = tier === "solo";

    const origDispose = baseAppStage.dispose.bind(baseAppStage);
    baseAppStage.dispose = () => {
      if (envbMgr) {
        envbMgr.dispose();
        envbMgr = null;
      }
      baseAppStageRef = null;
      origDispose();
    };
  }

  // Check if any app-mode stages already exist in cache
  const existingApp = manager.getBuiltStage("app");
  if (existingApp) {
    attachEnvbToBaseAppStage(existingApp);
    attachPatchToStage(existingApp);
  }
  const existingEnc = manager.getBuiltStage("enc");
  if (existingEnc) {
    attachPatchToStage(existingEnc);
  }
  const existingRaid = manager.getBuiltStage("raid");
  if (existingRaid) {
    attachPatchToStage(existingRaid);
  }

  // Intercept manager.select to attach ENVB only to base createAppStage ("app"),
  // hide ENVB when enc/raid/other stages are active, and hook #patch/#patch2 on all of "app", "enc", "raid".
  const origSelect = manager.select.bind(manager);
  manager.select = (key: string): Stage | null => {
    const stage = origSelect(key);
    const { tier } = getMissionAndTier();
    const baseAppStage = manager.getBuiltStage("app");
    const isAppTierKey = key === "app" || key === "enc" || key === "raid";

    if (isAppTierKey && stage) {
      if (
        key === "app" &&
        tier === "solo" &&
        baseAppStage &&
        stage === baseAppStage &&
        !envbMgr
      ) {
        attachEnvbToBaseAppStage(baseAppStage);
      }
      attachPatchToStage(stage);
      if (envbMgr) {
        envbMgr.group.visible =
          key === "app" && stage === baseAppStageRef && tier === "solo";
      }
    } else if (envbMgr) {
      envbMgr.group.visible = false;
    }

    return stage;
  };

  const origManagerDispose = manager.dispose.bind(manager);
  manager.dispose = () => {
    if (envbMgr) {
      envbMgr.dispose();
      envbMgr = null;
    }
    patchMgr.dispose();
    hudMgr.dispose();
    origManagerDispose();
  };

  activeHandles = {
    patch: patchMgr,
    get envb() {
      return envbMgr || undefined;
    },
    hud: hudMgr,
  };

  if (process.env.NEXT_PUBLIC_E2E === "1" && typeof window !== "undefined") {
    (
      window as unknown as { __CONCEPFUL_OVERLAY__?: ActiveOverlayHandles }
    ).__CONCEPFUL_OVERLAY__ = activeHandles;
  }
}
