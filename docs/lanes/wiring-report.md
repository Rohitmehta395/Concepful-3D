# Lane `wiring` Report

## 1. Summary

- **Branch**: `lane/wiring` (port `3124`)
- **Base**: `ee37225` (`Merge remote-tracking branch 'origin/lane/combine' into lane/integration-c`)
- **Files changed**:
  - `src/engine/overlay/types.ts`
  - `src/engine/overlay/hud.ts`
  - `src/engine/createEngine.ts`
  - `src/components/modal/LeadModalProvider.tsx`
  - `src/components/modal/LeadModal.tsx`
  - `src/components/configurator/ConfiguratorProvider.tsx`
  - `tests/wiring-messages.json`
  - `tests/wiring-messages.test.ts`
  - `docs/lanes/wiring-requests.md`
  - `docs/lanes/wiring-report.md`

## 2. Gate Exit Codes

- `pnpm lint`: `0`
- `pnpm typecheck`: `0`
- `pnpm format:check`: `0`
- `pnpm test`: `0` (25 test files, 4163 tests passed)
- `pnpm build` (production, `NEXT_PUBLIC_E2E` unset): `0`
- Production runtime hook check (`check_hooks.mjs`): `0` (`PROD_HOOKS: []`)
- `reference/Concepful_Mech_Builder.html` SHA256: `6DDD1EFDD493A245F2556FA71440D8693F837275FCD4E232DE24D527F8E88802`
- `git ls-files --eol`: `i/lf w/lf` on all modified tracked files

## 3. Acceptance Results

- **Results file**: `C:\Users\steve\concepful_scratch\lane_wiring\wiring_verify_results.json` (44481 bytes, SHA256 `8948ca94059691e43ddca68b9c7436f31a43bb98dbdea628fcdd7a7f144a4e70`)
- **`call()` message parity**: 12/12 `PASS` (1280x800 & 390x800, reducedMotion `false` & `true`, `solo`/`squad`/`combine`).
- **`#modal` hidden timings (`+0, +1000, +1850, +1950 ms`)**: 48/48 `PASS`.
- **`#cv` comparison (`#gl` hidden)**:
  - Noise floors (3 loads): `1280x800 red=false` `ref=284px, reb=0px` (`INVALID`); `1280x800 red=true` `0/0` (`PASS`); `390x800 red=false` `0/0` (`PASS`); `390x800 red=true` `0/0` (`PASS`).
  - `1280x800 red=true`: 12/12 `PASS` (`0.001%` solo/combine, `0.964%` squad).
  - `390x800 red=true`: 12/12 `PASS` (`0%` solo, `2.213%` squad, `0.039%` combine).
  - `390x800 red=false`: 8/12 `PASS`, 4/12 `FAIL` (`squad +1500/+2500ms` `5.262%`, `combine +1500/+2500ms` `3.068%`).
  - `1280x800 red=false`: 12/12 `INVALID` (reference noise floor `284px > 50px`; raw diffs `0.001%–3.622%`).
- **Click parity (`click_parity_harness.mjs`)**: `0` mismatches (negative control: 2 expected mismatches).
- **Modal parity (`modal_parity_harness.mjs`)**: `63/63` passed, `0` failed, `0` network requests, negative control detected.

## 4. Open Issues & Requests to Other Lanes

- See `docs/lanes/wiring-requests.md` for original stage entry-animation requests (resolved for `A.veh`, `EncStage` drop `triggerEntry`, and `A.ship` in Follow-Up 2; per-unit 2D `A[id]` stagger is superseded by 3D `EncStage` diorama drop).

## 5. Follow-Up 2 (Production Build, Entry Animations, `drawBoss`, Deterministic 1280 Capture)

- **Production `setBuildState` sync**: Verified `origin/main` gated `setBuildState` behind `NEXT_PUBLIC_E2E === "1"` (`window.__CONCEPFUL_ENGINE__`), whereas `lane/wiring` uses `onEngineReady`/`getActiveEngine()` from `src/engine/createEngine.ts` in all environments.
- **Production `#gl` / `#patch` & pairwise tier diffs** ([prod_gl_patch_results.json](file:///C:/Users/steve/concepful_scratch/lane_wiring/prod_gl_patch_results.json), 3363 bytes, SHA256 `4d38872b634417cdabc3042238a8865076d48508a35eed423856efb81850babc`):
  - `prodHookUndefined`: `true` (`window.__CONCEPFUL_ENGINE__` is `undefined`).
  - Pairwise `#gl` diffs on production: `1280x800` (`solo vs squad` `68.521%`, `solo vs combine` `96.278%`, `squad vs combine` `97.438%`), `390x800` (`solo vs squad` `77.796%`, `solo vs combine` `98.728%`, `squad vs combine` `99.922%`) — all `PASS` (`> 3%`), confirming `squad` and `combine` differ from `solo` in production.
  - `#patch` vs reference: `1280x800` `squad` `0.08%` (`PASS`), `combine` `0.029%` (`PASS`), `solo` `4.93%` (`FAIL`); `390x800` `0%` (`PASS`) across all 3 tiers.
  - `#gl` vs reference: `combine` `2.335%` (`1280`) / `1.895%` (`390`) `PASS`; `solo` (`46.712%`/`39.659%`) and `squad` (`22.204%`/`15.768%`) `FAIL` due to un-zeroed orbit AUTO phase without E2E hooks.
- **Entry animations (`A.veh`, `EncStage` drop, `A.ship`), `drawBoss`, and 1280 noise** ([followup2_results.json](file:///C:/Users/steve/concepful_scratch/lane_wiring/followup2_results.json), 4657 bytes, SHA256 `2283043bd2d28a267f15f2a567743c3714f1e1fe46e147b2278b5bb5d7d505d2`):
  - `1280 red=false` `#cv` 3-load noise floor: `refNoisePx: 0, rebNoisePx: 0` (`PASS`, down from `284 px` by stepping 60 frames = 1000 ms past `fadeT` 450 ms and `bootMission` 300 ms).
  - `390 red=false` `#cv` with `drawBoss` ported to `hud.ts`: `squad +0ms` improved from `2.171%` to `0.056%` (`PASS`), `squad +500ms` from `2.171%` to `0.058%` (`PASS`), `squad +1500/+2500ms` from `5.262%` to `3.148%` (`FAIL`), `combine +1500/+2500ms` `3.068%` (`FAIL`).
  - Entry animations (`+0, +300, +900 ms`, `glEntryNoise` `ref=35px, reb=0px` `PASS`): `combine` form click `2.288%`/`2.46%`/`2.618%` (`PASS`), `combine->solo +0ms` `2.288%` (`PASS`); `solo`/`squad` `#gl` `21.46%–50.308%` (`FAIL`, pre-existing orbit-AUTO baseline).
- **Production click & modal parity**:
  - `click_parity_harness.mjs` (prod `pnpm start`): `0` mismatches (negative control: 2 expected).
  - `modal_parity_harness.mjs` (prod `next start`): `63/63` passed, `0` failed, `0` network requests, negative control detected.
  - `check_hooks.mjs` (prod `next start`): `PROD_HOOKS: []`.
