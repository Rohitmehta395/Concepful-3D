# Overlay Lane Requests

## 1. vitest.config.ts — Increase Default Test Timeout

- **Target File**: `vitest.config.ts`
- **Reason**: `tests/scroll.test.ts` (line 31: comparing 1,000 randomized layouts against Node VM) intermittently takes 5.0s–9.0s under heavy concurrent CPU load, causing Vitest's default 5,000ms per-test timeout to fire even though all assertions pass.
- **Requested Change**: Add `testTimeout: 30000` to `test` configuration in `vitest.config.ts`.

## 2. tsconfig.json — Exclude tests from Next.js production build typechecking

- **Target File**: `tsconfig.json`
- **Reason**: `next build` runs TypeScript across all files including `tests/**`. Test files frequently mock or stub global classes (such as `THREE.Color` or `Path2D`) which Next.js typechecks during production build.
- **Requested Change**: Add `"tests"` to `"exclude"` in `tsconfig.json` or align test type definitions.

## 3. Formatting in docs/lanes/next-report.md

- **Target File**: `docs/lanes/next-report.md`
- **Reason**: `pnpm format:check` flags style issues in `docs/lanes/next-report.md`. As a lane-owned file of lane `next`, lane `overlay` cannot edit it.
- **Requested Change**: Run `prettier --write docs/lanes/next-report.md`.

## 4. src/engine/createEngine.ts — Hook HUD & drawCallouts into post-vignette pass

- **Target File**: `src/engine/createEngine.ts` (lines 341–344)
- **Reason**: `overlay.render(time, fadeT)` clears `#cv` on line 63 of `src/engine/overlay.ts` (`ctx.clearRect(0, 0, w, h)`) during every frame. Without calling `hud.render` and `drawCallouts` after `overlay.render(time, fadeT)`, `#cv` draws 0 HUD/callout pixels in production even when `hud.call()` or `hud.triggerForm()` is triggered.
- **Exact 3-line Diff**:

```diff
     if (overlay) {
       overlay.render(time, fadeT);
+      const ov = getActiveOverlayHandles();
+      if (ov && state.activeScene === "app") ov.hud.render(cvCtx, time, currentBox, w, h, buildState.tier);
+      else if (stage) drawCallouts(cvCtx, state.activeScene, stage.group, camera, w, h, time);
     }
```

## 5. src/engine/models/sCarriers.ts — Export S3.local, S3.national, S3.global

- **Target File**: `src/engine/models/sCarriers.ts`
- **Reason**: `S3` currently only exports `regional: sSky`. `patch.ts` worked around `S3.local` by importing `sSub` from `../models/hVehiclesC`, but `national` (`sTitan`) and `global` (`sCarrier`) await the `raid` lane models.
- **Requested Change**: Wire `local: sSub`, `national: sTitan`, `global: sCarrier` in `S3` once `raid` merges.
