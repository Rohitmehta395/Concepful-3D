import type { StageBuildContext } from "../types";
import type { StageManager } from "../StageManager";

/**
 * Overlay slot.
 *
 * Owned by lane overlay.
 * Future implementation will register overlay elements or stages.
 * In Phase p0, this registration is a no-op contract placeholder.
 */
export function registerOverlay(
  _manager: StageManager,
  _ctx: StageBuildContext
): void {
  // No-op in lane p0; implemented in lane overlay
}
