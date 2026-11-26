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

## Follow-Up 2 (Rebased on `67d1ba8`)

### 1. Side-by-Side Comparison: `part4_13_sweep.mjs` (`p4`) vs `measure_solo_app.mjs` (`ms`)

Source: `compare_methods.json` (9436 B, sha256 `db9995f1e73eff48f68614bd5e26dcb4e9fa8d37c8ddd531e1551c9c756ef819`).

- `p4` noise floor: `ref = 42835 px`, `reb = 138915 px` (`INVALID` per Rule A6, > 50 px).
- `ms` noise floor: `ref = 0 px`, `reb = 0 px` (`VALID`).
- Root cause of `p4` spikes (`390@9300` 22.51%, `390@9400` 16.17%, `390@9500` 9.88%, `1280@9300` 16.46%): `part4_13_sweep.mjs` calls `window.scrollTo` and immediately runs `repaint()`/`e.render()` twice without awaiting `document.fonts.ready`, without a post-scroll layout settle, and without a camera/box settle loop. As a result, `getTargetBox()` reads mid-transition `#boxart` heights (`p4_refBox.h = 282.59` vs `p4_rebBox.h = 289.43` at `390@9300`; `277.71` vs `280.56` at `390@9400`; `276.66` vs `276.96` at `390@9500`; `606` vs `609.11` at `1280@9300`), whereas `ms` settles to identical `refBox` and `rebBox` (`276.66` at 390, `606` at 1280) and identical `refCam` and `rebCam` on all 10 rows.

| Row         | `p4_medPx` | `p4_medPct` | `p4_status` | `ms_medPx` | `ms_medPct` | `ms_status` |
| ----------- | ---------- | ----------- | ----------- | ---------- | ----------- | ----------- |
| `390@9200`  | 3555       | 1.1394%     | INVALID     | 3696       | 1.1846%     | PASS        |
| `390@9300`  | 70246      | 22.5147%    | INVALID     | 3696       | 1.1846%     | PASS        |
| `390@9400`  | 50450      | 16.1699%    | INVALID     | 3696       | 1.1846%     | PASS        |
| `390@9500`  | 30818      | 9.8776%     | INVALID     | 3696       | 1.1846%     | PASS        |
| `390@9600`  | 3555       | 1.1394%     | INVALID     | 3696       | 1.1846%     | PASS        |
| `1280@9200` | 8577       | 0.8376%     | INVALID     | 9645       | 0.9419%     | PASS        |
| `1280@9300` | 168504     | 16.4555%    | INVALID     | 9588       | 0.9363%     | PASS        |
| `1280@9400` | 8520       | 0.832%      | INVALID     | 9588       | 0.9363%     | PASS        |
| `1280@9500` | 8520       | 0.832%      | INVALID     | 9588       | 0.9363%     | PASS        |
| `1280@9600` | 8520       | 0.832%      | INVALID     | 9588       | 0.9363%     | PASS        |

### 2. Tier Cycle Convergence (`solo > squad > combine > squad > solo > combine > squad`)

| Step | Clicked Tier | `buildTier` | `stageKey` | Frames | Converged | Camera                       | Status |
| ---- | ------------ | ----------- | ---------- | ------ | --------- | ---------------------------- | ------ |
| 1    | `solo`       | `solo`      | `app`      | 31     | true      | `[2.2384, 1.8911, 15.7591]`  | PASS   |
| 2    | `squad`      | `squad`     | `null`     | 30     | true      | `[0, 1, 14]`                 | PASS   |
| 3    | `combine`    | `combine`   | `raid`     | 31     | true      | `[10.6942, 6.7806, 29.0029]` | PASS   |
| 4    | `squad`      | `squad`     | `null`     | 30     | true      | `[0, 1, 14]`                 | PASS   |
| 5    | `solo`       | `solo`      | `app`      | 31     | true      | `[2.2384, 1.8911, 15.7591]`  | PASS   |
| 6    | `combine`    | `combine`   | `raid`     | 31     | true      | `[10.6942, 6.7806, 29.0029]` | PASS   |
| 7    | `squad`      | `squad`     | `null`     | 30     | true      | `[0, 1, 14]`                 | PASS   |
