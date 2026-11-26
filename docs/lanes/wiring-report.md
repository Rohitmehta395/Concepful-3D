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

- See `docs/lanes/wiring-requests.md` for stage entry-animation hooks (`A.veh` in `appStage.ts`, `A[id]` in `EncStage.ts`, `A.ship` in `raidStage.ts`), which are outside `wiring`'s owned files.
- `drawBoss` bar in `squad` mode (`oy = 62`) is not yet rendered on `#cv` in `hud.ts`/`EncStage`, accounting for the ~0.96%–2.21% baseline `#cv` diff in `squad` mode.
