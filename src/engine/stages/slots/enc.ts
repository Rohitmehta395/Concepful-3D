import type { StageBuildContext } from "../types";
import type { StageManager } from "../StageManager";

/**
 * Encounter stage slot.
 *
 * Owned by lane enc.
 * Future implementation will mount the encounter stage into the stage manager.
 * In Phase p0, this registration is a no-op contract placeholder.
 */
export function registerEncStage(
  _manager: StageManager,
  _ctx: StageBuildContext
): void {
  // No-op in lane p0; implemented in lane enc
}
