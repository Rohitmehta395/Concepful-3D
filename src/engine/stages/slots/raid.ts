import type { Stage, StageBuildContext } from "../types";
import type { StageManager } from "../StageManager";
import { DEFAULT_BUILD_STATE } from "../../buildState";
import { createRaidStage, renderRaidModelBench } from "../raid/raidStage";

/**
 * Raid stage slot.
 *
 * Owned by lane raid.
 * Mounts and registers the flagship raid stage into the StageManager,
 * enabling full Combine tier 3D rendering.
 */
export function registerRaidStage(
  manager: StageManager,
  ctx: StageBuildContext
): void {
  let raidStage: Stage | null = null;
  let activeIsRaid = false;

  // Gated test bench hook for E2E verification
  if (process.env.NEXT_PUBLIC_E2E === "1" && typeof window !== "undefined") {
    const win = window as unknown as Record<string, unknown>;
    win.__RAID_BENCH__ = (model: string, yawDeg: number, t: number) => {
      renderRaidModelBench(ctx, model, yawDeg, t);
    };
  }

  function getOrBuildRaid(): Stage {
    if (!raidStage) {
      raidStage = createRaidStage(ctx);
    }
    return raidStage;
  }

  const origSelect = manager.select.bind(manager);
  const origDispose = manager.dispose.bind(manager);
  const origHasBuilder = manager.hasBuilder.bind(manager);
  const origGetBuiltStage = manager.getBuiltStage.bind(manager);
  const origGetActiveStage = manager.getActiveStage.bind(manager);
  const origClearActive = manager.clearActive.bind(manager);

  manager.hasBuilder = (key: string): boolean => {
    if (key === "raid") return true;
    return origHasBuilder(key);
  };

  manager.getBuiltStage = (key: string): Stage | undefined => {
    if (key === "raid") return raidStage ?? undefined;
    return origGetBuiltStage(key);
  };

  manager.getActiveStage = (): Stage | null => {
    if (activeIsRaid) return raidStage;
    return origGetActiveStage();
  };

  manager.clearActive = (): void => {
    if (activeIsRaid && raidStage) {
      raidStage.setVisible(false);
      activeIsRaid = false;
    }
    origClearActive();
  };

  manager.select = (key: string): Stage | null => {
    const bState = ctx.getBuildState
      ? ctx.getBuildState()
      : DEFAULT_BUILD_STATE;
    const isCombine = bState.tier === "combine";

    if (key === "raid" || (key === "app" && isCombine)) {
      const stage = getOrBuildRaid();
      if (!activeIsRaid) {
        origClearActive();
        activeIsRaid = true;
        stage.setVisible(true);
      }
      ctx.scene.background = stage.backgroundTexture;
      ctx.scene.fog = stage.fog;
      return stage;
    }

    if (activeIsRaid && raidStage) {
      raidStage.setVisible(false);
      activeIsRaid = false;
    }

    return origSelect(key);
  };

  manager.dispose = (): void => {
    if (raidStage) {
      raidStage.dispose();
      raidStage = null;
    }
    activeIsRaid = false;
    origDispose();
  };
}
