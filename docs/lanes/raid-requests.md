# Cross-Lane Requests from Lane RAID

## 1. Request to Core Engine / Integrator: Tier-Aware Active Stage Routing in `createEngine.ts`

- **Target File:** `src/engine/createEngine.ts` (around line 314 & line 661)
- **Context:**
  The configurator provider now passes `objectives` and `buffs` into `engine.setBuildState(state)`.
  In `createEngine.ts` (lines 661-666):
  ```typescript
  setBuildState: (state: Partial<BuildState>) => {
    buildState = { ...buildState, ...state };
    if (motionQuery && motionQuery.matches) {
      renderFrame(performance.now());
    }
  },
  ```
  `setBuildState` currently **never** rebuilds the app stage on any call: it neither rebuilds on every call nor when `tier`, `reach`, `mission`, or `objective` changes. It merely merges fields into the local closure `buildState` object.
  Furthermore, during `renderFrame()` (line 314):
  ```typescript
  const stage = stageManager.select(state.activeScene);
  ```
  When the user is viewing or interacting with the configurator, `state.activeScene` is always `"app"`. `stageManager.select("app")` routes strictly to `createAppStage` (the solo tier hero mechs). It does not inspect `buildState.tier` to route to `"raid"` for `tier === "combine"` or `"enc"` for `tier === "squad"`.
- **Impact:**
  Without routing or delegating `"app"` to `"raid"`, the 3D canvas continues rendering solo hero vehicles during combine tier builds.
- **Proposed Solution:**
  In `src/engine/createEngine.ts`:
  1. Map `"app"` active scene to the tier-specific stage:
     ```typescript
     const activeSceneKey =
       state.activeScene === "app"
         ? buildState.tier === "combine"
           ? "raid"
           : buildState.tier === "squad"
             ? "enc"
             : "app"
         : state.activeScene;
     const stage = stageManager.select(activeSceneKey);
     ```
  2. In `setBuildState`, trigger a frame render or notify the active stage when tier or buffs change:
     ```typescript
     setBuildState: (state: Partial<BuildState>) => {
       const prevTier = buildState.tier;
       buildState = { ...buildState, ...state };
       if (state.tier && state.tier !== prevTier) {
         snap = true;
       }
       if (motionQuery && motionQuery.matches) {
         renderFrame(performance.now());
       }
     },
     ```

---

## 2. Request to Core Stage Manager: Dynamic Builder Registration in `StageManager.ts`

- **Target File:** `src/engine/stages/StageManager.ts`
- **Context:**
  `CONTRACT.md` Section 4 specifies slot registration hooks:
  - `registerEncStage(manager, ctx)`
  - `registerRaidStage(manager, ctx)`
  - `registerOverlay(manager, ctx)`
    However, `createStageManager` accepts a static `Record<string, StageBuilder>` at instantiation and does not expose a `registerStage(key: string, builder: StageBuilder)` method.
- **Proposed Solution:**
  Add `registerStage(key: string, builder: StageBuilder): void` to the `StageManager` interface and implementation:
  ```typescript
  export interface StageManager {
    hasBuilder(key: string): boolean;
    registerStage(key: string, builder: StageBuilder): void;
    getBuiltStage(key: string): Stage | undefined;
    getActiveStage(): Stage | null;
    select(key: string): Stage | null;
    clearActive(): void;
    dispose(): void;
  }
  ```
  _(Note: Lane raid implements a zero-conflict wrapper on `manager.select` in `src/engine/stages/slots/raid.ts` so raid stage functionality is fully operational immediately without violating Rule L5)._
