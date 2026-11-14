import type * as THREE from "three";
import type { Stage, StageBuildContext, StageBuilder } from "./types";

export interface StageManager {
  hasBuilder(key: string): boolean;
  getBuiltStage(key: string): Stage | undefined;
  getActiveStage(): Stage | null;
  select(key: string): Stage | null;
  clearActive(): void;
  dispose(): void;
}

/**
 * Manages lazy stage construction (`STS` cache semantics), active stage
 * switching, background/fog application, and full resource disposal.
 */
export function createStageManager(
  scene: THREE.Scene,
  ctx: StageBuildContext,
  builders: Record<string, StageBuilder>
): StageManager {
  const cache = new Map<string, Stage>();
  let activeStage: Stage | null = null;

  function hasBuilder(key: string): boolean {
    return Object.prototype.hasOwnProperty.call(builders, key);
  }

  function getBuiltStage(key: string): Stage | undefined {
    return cache.get(key);
  }

  function getActiveStage(): Stage | null {
    return activeStage;
  }

  function getOrBuild(key: string): Stage | null {
    const cached = cache.get(key);
    if (cached) return cached;
    const builder = builders[key];
    if (!builder) return null;
    if (
      typeof window !== "undefined" &&
      typeof (window as unknown as { __reseed?: (seed?: number) => void })
        .__reseed === "function"
    ) {
      (window as unknown as { __reseed: (seed?: number) => void }).__reseed(
        1337
      );
    }
    const stage = builder(ctx);
    stage.setVisible(false);
    cache.set(key, stage);
    return stage;
  }

  function select(key: string): Stage | null {
    const next = getOrBuild(key);
    if (!next) {
      clearActive();
      return null;
    }
    if (activeStage && activeStage !== next) {
      activeStage.setVisible(false);
    }
    activeStage = next;
    activeStage.setVisible(true);
    scene.background = activeStage.backgroundTexture;
    scene.fog = activeStage.fog;
    return activeStage;
  }

  function clearActive(): void {
    if (activeStage) {
      activeStage.setVisible(false);
      activeStage = null;
    }
  }

  function dispose(): void {
    activeStage = null;
    for (const stage of cache.values()) {
      stage.dispose();
    }
    cache.clear();
  }

  return {
    hasBuilder,
    getBuiltStage,
    getActiveStage,
    select,
    clearActive,
    dispose,
  };
}
