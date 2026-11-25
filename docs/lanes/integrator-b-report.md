Numbers worse than any lane's own report: enc scene_check gtm 4198->1024000px (0.4100%->100.0000%), dir 4504->1024000px (0.4398%->100.0000%), research 6261->1024000px (0.6114%->100.0000%), product 3572->1023995px (0.3488%->99.9995%), multi 4198->1024000px (0.4100%->100.0000%); overlay patch_pixels/pt_portrait squad #patch 17->12651px (0.0976%->72.6067%) and #patch2 25->16493px (0.1111%->73.3022%), combine #patch 7..12->12651px (0.0402..0.0689%->72.6067%) and #patch2 9..13->16493px (0.0400..0.0578%->73.3022%); combine pixel_v2 390 mo #panel 21->79px (0.0135%->0.0506%), 390 mo .top 10->90px (0.0259%->0.2328%), 390 yr .top 10->11px (0.0259%->0.0285%).

# Lane `integrator-b` Integration Report

- **Branch**: `lane/integration-b` (based on `main` at `2828633 chore(integration): known fixes`)
- **Port**: `3122`
- **Scratch**: `C:\Users\steve\concepful_scratch\lane_integrator-b\`

---

## 1. Sequential `--no-ff` Merge Log & Per-Merge Exit Codes

`origin/lane/modal` had 0 new commits ahead of `main` (`2828633`); `origin/lane/prod2` does not exist. All 5 remaining branches merged with 0 conflicts.

| Order | Branch                | Merge | `pnpm install --frozen-lockfile` | `pnpm typecheck` | `pnpm lint` | `pnpm vitest run --testTimeout=30000` | `pnpm build` | Notes                                                                          |
| ----- | --------------------- | ----- | -------------------------------- | ---------------- | ----------- | ------------------------------------- | ------------ | ------------------------------------------------------------------------------ |
| 1     | `origin/lane/combine` | 0     | 0                                | 0                | 1           | 0 (4154)                              | 0            | `CombinePanel.tsx:42` `react-hooks/set-state-in-effect`                        |
| 2     | `origin/lane/enc`     | 0     | 0                                | 0                | 1           | 0 (4156)                              | 0            | Same `CombinePanel.tsx:42` lint error                                          |
| 3     | `origin/lane/raid`    | 0     | 0                                | 0                | 1           | 0 (4156)                              | 0            | Same `CombinePanel.tsx:42` lint error                                          |
| 4     | `origin/lane/overlay` | 0     | 0                                | 0                | 1           | 0 (4157)                              | 0            | Same `CombinePanel.tsx:42` lint error                                          |
| 5     | `origin/lane/core`    | 0     | 0                                | 2                | 1           | 0 (4160)                              | 1            | `tests/overlay-units.test.ts(449,21)` missing `registerStage` on `mockManager` |

Integration fixes applied after merges:

- `tests/overlay-units.test.ts`: added `registerStage: () => {}` to `mockManager`.
- `src/components/configurator/panels/CombinePanel.tsx`: replaced `useEffect` `setHasVisitedCombine(true)` with render-time state adjustment (`if (raid && !hasVisitedCombine) setHasVisitedCombine(true)`).

---

## 2. Stage Routing & Tier Cycle (`solo > squad > combine > squad > solo > combine > squad`)

- `createEngine.ts` lines 318-326 maps `state.activeScene === "app"` to `activeSceneKey = "raid"` (combine), `"enc"` (squad), or `"app"` (solo), and calls `stageManager.select(activeSceneKey)`.
- `src/engine/stages/slots/enc.ts` line 58 checks `if (key === "app" && buildState?.tier === "squad")` — it does NOT match `key === "enc"`, so `select("enc")` returns `null`.
- `src/engine/stages/slots/overlay.ts` line 112 checks `if (key === "app" && stage)` — it does NOT match `key === "enc"` or `key === "raid"`, so `attachPatchToStage(stage)` is never called for `squad` or `combine`.

Results from `tier_cycle_table.txt` (`1362` bytes, SHA-256 `dd6313d9997ebb9ecaac3ac2d01a01691fe02a159c788c5668a6892e371ad77b`):

Noise floor: `ref=0 px`, `reb=0 px`, `INVALID=OK`.

| Step | Tier      | `refStage` | `rebStage` | `refSteps` | `rebSteps` | `diffPx` | `totalPx` | `diffPct` | `bbox (>3%)`      | `INVALID` | `status` |
| ---- | --------- | ---------- | ---------- | ---------- | ---------- | -------- | --------- | --------- | ----------------- | --------- | -------- |
| 1    | `solo`    | `solo`     | `app`      | 600        | 600        | 125890   | 1024000   | 12.2939   | `[19,0,1279,799]` | OK        | FAIL     |
| 2    | `squad`   | `squad`    | `null`     | 32         | 30         | 1024000  | 1024000   | 100       | `[0,0,1279,799]`  | OK        | FAIL     |
| 3    | `combine` | `combine`  | `raid`     | 600        | 600        | 8402     | 1024000   | 0.8205    | `-`               | OK        | PASS     |
| 4    | `squad`   | `squad`    | `null`     | 32         | 30         | 1024000  | 1024000   | 100       | `[0,0,1279,799]`  | OK        | FAIL     |
| 5    | `solo`    | `solo`     | `app`      | 600        | 600        | 153365   | 1024000   | 14.9771   | `[0,0,1279,799]`  | OK        | FAIL     |
| 6    | `combine` | `combine`  | `raid`     | 600        | 600        | 8519     | 1024000   | 0.8319    | `-`               | OK        | PASS     |
| 7    | `squad`   | `squad`    | `null`     | 32         | 30         | 1024000  | 1024000   | 100       | `[0,0,1279,799]`  | OK        | FAIL     |

`renderer.info` across `solo -> squad -> combine -> solo` cycles:

- `0 cycles`: `geometries=490, textures=20, programs=10`
- `20 cycles`: `geometries=538, textures=25, programs=17`
- `40 cycles`: `geometries=538, textures=25, programs=17`

---

## 3. Re-Run of Unchanged Lane Scripts (Differences First)

### Differences vs Lane Reports

- **`enc` (`scene_check.mjs`)**: `scene_check_results.json` (`3844` bytes, SHA-256 `fee998e3c211fbdc5529856fcbad93583db5b4d4da4cf9b722ef34b9638a4082`) — `gtm` `4198 -> 1024000 px (100.0000%)`, `dir` `4504 -> 1024000 px (100.0000%)`, `research` `6261 -> 1024000 px (100.0000%)`, `product` `3572 -> 1023995 px (99.9995%)`, `multi` `4198 -> 1024000 px (100.0000%)` due to `"enc"` routing mismatch in `slots/enc.ts`.
- **`overlay` (`verify_acceptance.mjs`)**: `patch_pixels.json` (`5580` bytes, SHA-256 `0922a3d2feabd1c7be55271bad8e75aefe3e451f4e161f0f4f96541aaedc71a2`) and `pt_portrait.json` (`311` bytes, SHA-256 `572b0a4e0fb9492560754060076e09ad91b75853ffbb3a1d850a0cf675031a89`) — all `squad` and `combine` rows increased to `#patch = 12651 px (72.6067%)` and `#patch2 = 16493 px (73.3022%)` due to `slots/overlay.ts` checking `key === "app"`.
- **`combine` (`run_combine_pixel_v2.mjs`)**: `combine_pixel_results_v2.json` (`2792` bytes, SHA-256 `aa49ac8c239c29bf6a586f0fae0b1d30542913abb6619c9771ebc131112fc9b5`) — `390 mo #panel` `79 px (0.0506%)`, `390 mo .top` `90 px (0.2328%)`, `390 yr .top` `11 px (0.0285%)` (all `VALID`, noise `0/0`, `posControlPassed: true`).

### Matching / Unchanged Suites

- **`combine` click parity & 256 fixtures (`verify_combine_parity.mjs`)**: `click_parity_results.json` (`815` bytes, SHA-256 `447fab4986f9cc53d550e387d68e34370b75316e553f08635a0caa94b9d928fd`) — 0 mismatches across 1280/390 `squad` (13), `solo` (6), `combine` (28), negative control detected `true`; `combine_fixture_check_results.json` (`66` bytes, SHA-256 `9129a94554938e4eac01cedef9cad0865a8fd34dbea7f7289a70014591d3e050`) — 256/256 rows, 0 mismatches.
- **`combine` panel scroll sweep (`panel_scroll_sweep.mjs`)**: `panel_scroll_sweep_results.json` (`45907` bytes, SHA-256 `0b596deca9ec03088a6a6f26c1a7af4b9dce98ceb23bbd5bb292e374add34a57`) — all 6 suites `VALID`, noise `0/0`, `posControl=true`.
- **`raid` (`verify_followup2.mjs`)**: `followup2_results.txt` (`11530` bytes, SHA-256 `efb4d7a15885c77d1c7789f2ac6035d4e1d43286d45c75fb332366b1006a4beb`) — model bench and 30 scene rows match `raid-report.md` (`local`/`national`/`global` `PASS`, `regional` `FAIL`, `sMother` yaw 0 `FAIL`, `sCarrier` yaw 0/90 `FAIL`); Part 6 `tier=squad -> activeStage.key=null`.
- **`overlay` HUD/Callouts & Card/Boxart**: `callouts_hud.json` (`1948` bytes, SHA-256 `de3936deb9c0fc1c36c57d64aea55d5d70f2463f754b2d48ea515379862c38bd`) — `hud_*` `0 px`, `callouts_solo_1280` `695628 px`, `callouts_solo_390` `233312 px`; `card_boxart.json` (`640` bytes, SHA-256 `d2f33dbdb7a4fb7a4cb3450fc310083cba943802c99a9adc59e23c1cc7da36cc`) — `3 / 8 / 30 px`.
- **`modal` (`parity_harness.mjs`)**: `step3_parity_results.json` (`12765` bytes, SHA-256 `b3350a3857e643de79058be3d2a5cbfe48e35038c74d940d5149ede3c9ef25cd`) — `63/63` passed, `0` failed, `0` network requests, negative control detected `true`.

---

## 4. Part 4.13 Sweep & 10 Solo Rows

From `sweep_summary.json` (`95` bytes, SHA-256 `8421e45e38e71f609d9e6b34f37bdecb86cf3da2dddb087a414d3194ae63b6d0`) and `truth_sweep.csv` (`11668` bytes, SHA-256 `09f59019878a316556e66944bd4283b2ef20963ede40e7f1c43007b817a29cf3`):

- **Story scenes (`184` rows)**: `min=0.0005%`, `median=0.4487%`, `max=1.0513%`.
- **Solo (`app`) rows (`10` rows)**:
  - `390@9200`: `3555 / 312000` (`1.1394%`)
  - `390@9300`: `60474 / 312000` (`19.3827%`)
  - `390@9400`: `47669 / 312000` (`15.2785%`)
  - `390@9500`: `32861 / 312000` (`10.5324%`)
  - `390@9600`: `3555 / 312000` (`1.1394%`)
  - `1280@9200`: `8577 / 1024000` (`0.8376%`)
  - `1280@9300`: `132690 / 1024000` (`12.9580%`)
  - `1280@9400`: `8520 / 1024000` (`0.8320%`)
  - `1280@9500`: `8520 / 1024000` (`0.8320%`)
  - `1280@9600`: `8520 / 1024000` (`0.8320%`)

---

## 5. Final L8 Gate

| Check                                             | Exit Code | Result                                                             |
| ------------------------------------------------- | --------- | ------------------------------------------------------------------ |
| `pnpm lint`                                       | 0         | PASS                                                               |
| `pnpm typecheck`                                  | 0         | PASS                                                               |
| `pnpm format:check`                               | 0         | PASS                                                               |
| `pnpm vitest run --testTimeout=30000`             | 0         | 24 files, 4160 tests                                               |
| `pnpm build` (clean prod)                         | 0         | PASS                                                               |
| `node scripts/check-compiled-css.mjs`             | 0         | PASS (5/5 prefixed)                                                |
| Production runtime hooks (`check_prod_hooks.mjs`) | 0         | `[]`                                                               |
| Reference SHA-256                                 | 0         | `6ddd1efdd493a245f2556fa71440d8693f837275fcd4e232de24d527f8e88802` |
| `git ls-files --eol`                              | 0         | `i/lf w/lf`                                                        |

---

## 6. Requests to Other Lanes

- **Lane `enc` (`src/engine/stages/slots/enc.ts`)**: accept `key === "enc"` in addition to `key === "app" && buildState?.tier === "squad"` in `select` (and `getBuiltStage`) so `createEngine.ts` routing to `"enc"` renders `encStage`.
- **Lane `overlay` (`src/engine/stages/slots/overlay.ts`)**: accept `(key === "app" || key === "enc" || key === "raid") && stage` in `manager.select` so `#patch` / `#patch2` attach and update on `squad` and `combine` stages.

## what could not be verified

- Physical GPU driver rendering across non-headless browsers; all Playwright pixel checks ran in headless Chromium on Windows.
