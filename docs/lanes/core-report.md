# Lane CORE Report

## Scope & Ownership

- **Lane**: `core` (port `3121`)
- **Base**: `2828633` (`origin/main` after `lane/integration-a`)
- **Branch**: `lane/core`
- **Owned Files Modified/Added**:
  - `src/engine/stages/appStage.ts`
  - `src/engine/createEngine.ts`
  - `src/engine/overlay.ts`
  - `src/engine/stages/StageManager.ts`
  - `tests/core-engine.test.ts`
  - `docs/lanes/core-requests.md`
  - `docs/lanes/core-report.md`

## Gate Results

| Check                   | Command                                                                                         | Exit Code                                                          |
| ----------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Lint                    | `pnpm lint`                                                                                     | 0                                                                  |
| Typecheck               | `pnpm typecheck`                                                                                | 0                                                                  |
| Format                  | `pnpm format:check`                                                                             | 0                                                                  |
| Unit Tests              | `pnpm test` (23 files, 4153 tests)                                                              | 0                                                                  |
| Production Build        | `pnpm build` (Next.js 16.4.6)                                                                   | 0                                                                  |
| Compiled CSS            | `node scripts/check-compiled-css.mjs`                                                           | 0                                                                  |
| Prod Runtime Hook Check | `node C:/Users/steve/concepful_scratch/lane_core/prod_hook_check.mjs` (`PROD_WINDOW_HOOKS: []`) | 0                                                                  |
| Reference SHA-256       | `reference/Concepful_Mech_Builder.html`                                                         | `6ddd1efdd493a245f2556fa71440d8693f837275fcd4e232de24d527f8e88802` |

## Acceptance Tables

### 1. Solo App Rows (10 rows, 3 loads per page)

- **Baseline** (`baseline_solo_app.csv`, 551 B, sha256 `3f86085b69cf809f62a557ec4be5d9983ab65721e6d3eb031a4b89a149147481`, noise floor `ref=0px reb=0px`):
  - `390` (9200..9600): `55276 px` (`17.7167%`) — `FAIL`
  - `1280` (9200): `169535 px` (`16.5562%`) — `FAIL`
  - `1280` (9300..9600): `169742 px` (`16.5764%`) — `FAIL`
- **After Camera Fix** (`after_cam_solo_app.csv`, 496 B, sha256 `b0ef4b56a252872e75a9df42101df1b3a8f23d92148f1eeb217e550b3c46aff8`, noise floor `ref=0px reb=0px`):

| Viewport | ScrollY | MinPx | MedPx | MaxPx | MedPct  | Status |
| -------- | ------- | ----- | ----- | ----- | ------- | ------ |
| 390      | 9200    | 3696  | 3696  | 3696  | 1.1846% | PASS   |
| 390      | 9300    | 3696  | 3696  | 3696  | 1.1846% | PASS   |
| 390      | 9400    | 3696  | 3696  | 3696  | 1.1846% | PASS   |
| 390      | 9500    | 3696  | 3696  | 3696  | 1.1846% | PASS   |
| 390      | 9600    | 3696  | 3696  | 3696  | 1.1846% | PASS   |
| 1280     | 9200    | 9645  | 9645  | 9645  | 0.9419% | PASS   |
| 1280     | 9300    | 9588  | 9588  | 9588  | 0.9363% | PASS   |
| 1280     | 9400    | 9588  | 9588  | 9588  | 0.9363% | PASS   |
| 1280     | 9500    | 9588  | 9588  | 9588  | 0.9363% | PASS   |
| 1280     | 9600    | 9588  | 9588  | 9588  | 0.9363% | PASS   |

### 2. Layer Bisect (1280x800, scrollY=9300)

Source: `layer_bisect.json` (736 B, sha256 `5ff9a1eb8df731a341b5e1afb4c4400f280f98fdcd038231efe9a251631e9f17`).

| Hidden Layer | DiffPx | TotalPx | DiffPct |
| ------------ | ------ | ------- | ------- |
| `none`       | 9645   | 1024000 | 0.9419% |
| `stars`      | 5555   | 1024000 | 0.5425% |
| `planet`     | 10127  | 1024000 | 0.989%  |
| `disc+ring`  | 12364  | 1024000 | 1.2074% |
| `brandRings` | 9663   | 1024000 | 0.9437% |
| `hero`       | 9891   | 1024000 | 0.9659% |
| `background` | 9646   | 1024000 | 0.942%  |

### 3. `#cv` HUD/Callouts Verification

Source: `hud_cv_verify.json` (136 B, sha256 `65eff82624c46b3ad1a81bd9a4d35a45ea5bd302012828e8b440e8d807d75f68`).

- `call("test", "sys")` + `triggerForm()` at frozen time, `#gl` hidden, 5 frames of 100ms: `diffPx = 16584`, `totalPx = 1024000`, `diffPct = 1.6195%` (`refNonZeroPx = 718088`, `rebNonZeroPx = 707876`), `status = PASS`.

### 4. Part 4.13 Story Sweep & Click Parity

- `sweep_summary.json` (95 B, sha256 `8421e45e38e71f609d9e6b34f37bdecb86cf3da2dddb087a414d3194ae63b6d0`): `storyRowCount = 184`, `storyMin = 0.0005%`, `storyMedian = 0.4487%`, `storyMax = 1.0513%`.
- `task_c1_parity_results.json` (86369 B, sha256 `c5ff3911bc5ecbf54fdcfe81fd31c9557e32378a14204bafdd3d7511b6a502fa`): `Snapshot Keys = 15`, `Compared Keys = 15`, `Negative Control = 2` (expected 2), `Total Actual Parity Mismatches = 0`.

## Open Issues & Requests to Other Lanes

- See `docs/lanes/core-requests.md` for the `raidStage.ts:333` `reduceMotion` camera `dx` guard removal request (owned by `raid`).
