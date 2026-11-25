Numbers that got worse than before: none (6 `wyrm` model bench rows of `21–35 px` remain labeled `FAIL` under the `<= 10 px` rule).

# Lane `enc` Report: SQUAD Tier Encounter Diorama 3D Stage (`SC.enc`)

## 1. Overview & Scope

Lane `enc` implements the encounter 3D stage (`SC.enc`) for the SQUAD tier, registered via `src/engine/stages/slots/enc.ts` and ported into `src/engine/stages/enc/**`.

### Follow-Up 4 Fixes (Post-`origin/main` `67d1ba8` Rebase):

1. **Routing Key `"enc"` (`slots/enc.ts`)**: `src/engine/createEngine.ts` (lines 318–326) routes `tier === "squad"` to `stageManager.select("enc")`. Updated `slots/enc.ts` to handle `key === "enc" || (key === "app" && buildState?.tier === "squad")` matching `slots/raid.ts` shape (`hasBuilder("enc")`, `getBuiltStage("enc")`, `getActiveStage`, `clearActive`, `select`, `dispose`). Extended `tests/enc-stage.test.ts` to test `solo > squad > combine > squad > solo > combine > squad` using real routing (`app`, `enc`, `raid`).
2. **Merged E2E Build Scene Check, Tier Cycle `#gl` Compare, & 20/40 Memory**: Verified 0 px noise floor across 3 loads (`VALID`), all 5 scene rows at `0.3488%–0.6114%` (`PASS`), `#gl` parity across all 7 steps of `solo > squad > combine > squad > solo > combine > squad`, and `renderer.info.memory` unchanged after 20 and 40 cycles (`1334 geos / 27 texs -> 1334 / 27 -> 1334 / 27`).
3. **`wyrm` World Matrix Check**: Evaluated `wyrm()` in-page at `t=50000` and `t=51700` on both reference and rebuild; all 26 children (`portal`, `portalGlow`, `seg_0..seg_12`, `head_group`, `st_0..st_9`) have `0` world matrix diffs `> 1e-6` (`firstDiff: null`).

---

## 2. Scripts and Evidence Artifacts (Rule A3)

| Artifact / Script               | Path                                                                 | Size (bytes) | SHA-256                                                            |
| ------------------------------- | -------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------ |
| Follow-Up 4 Verification Script | `C:/Users/steve/concepful_scratch/lane_enc/verify_f4.mjs`            | 14416        | `b4c52b72120de960ab4efdfcefe13406e6f96f3c69037094f2dff5e983c1af40` |
| Follow-Up 4 Results JSON        | `C:/Users/steve/concepful_scratch/lane_enc/f4_results.json`          | 2729         | `8de691e9281e4784afb81629aeb13d0ed8847601805cc8a573b3bcc0e996a46a` |
| Model Bench Harness             | `C:/Users/steve/concepful_scratch/lane_enc/model_bench.mjs`          | 8751         | `d447c861e1d50f1f55914a5c6925927b0058cbfed296ad0d4561bdfed3eff51f` |
| Model Bench Results             | `C:/Users/steve/concepful_scratch/lane_enc/model_bench_results.json` | 5222         | `e4bb4687651c72f53520d4f34d0da019ee6bcc75633a6423f962a34f9dd03b8f` |
| Prod Hooks Check Script         | `C:/Users/steve/concepful_scratch/lane_enc/check_prod_hooks.mjs`     | 2372         | `82d9643099b62adca176410aa89b5071ca1781049b4fb089086814c9cd4c12cb` |

---

## 3. Gate Verification (Rules L8, A1, A2)

| Gate Check               | Command                                                                                                                 | Exit Code | Status                   | Notes                                                              |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------- | --------- | ------------------------ | ------------------------------------------------------------------ |
| Lint                     | `pnpm eslint src/engine/stages/enc src/engine/stages/slots/enc.ts tests/enc-*`                                          | 0         | PASS                     | 0 errors, 0 warnings on lane `enc` files                           |
| Typecheck                | `pnpm tsc --noEmit`                                                                                                     | 0         | PASS                     | 0 TypeScript errors                                                |
| Format Check (owned)     | `pnpm prettier --check src/engine/stages/enc/**/*.ts src/engine/stages/slots/enc.ts tests/enc-*.ts docs/lanes/enc-*.md` | 0         | PASS                     | All lane `enc` files formatted                                     |
| Format Check (global)    | `pnpm format:check`                                                                                                     | 1         | EXPECTED_FAILURE_ON_MAIN | Fails on pre-existing unowned files                                |
| Test Suite               | `pnpm vitest run --testTimeout=30000`                                                                                   | 0         | PASS                     | 23 test files, 4208+ tests                                         |
| Production Build         | `pnpm build`                                                                                                            | 0         | PASS                     | Exited 0 on first attempt (Next.js 16.4.6 Turbopack)               |
| Check Compiled CSS       | `node scripts/check-compiled-css.mjs`                                                                                   | 0         | PASS                     | All 5 backdrop-filter rules prefixed                               |
| Production Runtime Hooks | `node C:/Users/steve/concepful_scratch/lane_enc/check_prod_hooks.mjs`                                                   | 0         | PASS                     | `[]` on `window`                                                   |
| Reference SHA-256        | `(Get-FileHash reference/Concepful_Mech_Builder.html).Hash`                                                             | 0         | PASS                     | `6ddd1efdd493a245f2556fa71440d8693f837275fcd4e232de24d527f8e88802` |
| Line Endings (EOL)       | `git ls-files --eol`                                                                                                    | 0         | PASS                     | `i/lf w/lf attr/text=auto eol=lf`                                  |

---

## 4. Merged E2E Scene Check, Tier Cycle & Memory (`f4_results.json`)

### 4.1 Noise Floor (3 Loads)

- `1 vs 2`: `refDiff = 0`, `rebDiff = 0`, `status = VALID`
- `2 vs 3`: `refDiff = 0`, `rebDiff = 0`, `status = VALID`

### 4.2 Scene Check (1280x800, `#gl` only)

| Scene             | Diff (px) | Total (px) | Diff (%) | $\Delta \text{CAM Pos}$    | $\Delta \text{CAM Quat}$ | Script-Computed Status |
| ----------------- | --------- | ---------- | -------- | -------------------------- | ------------------------ | ---------------------- |
| `gtm`             | 4,198     | 1,024,000  | 0.4100%  | `(0.0000, 0.0000, 0.0000)` | `0.00000`                | PASS                   |
| `dir`             | 4,504     | 1,024,000  | 0.4398%  | `(0.0000, 0.0000, 0.0000)` | `0.00000`                | PASS                   |
| `research`        | 6,261     | 1,024,000  | 0.6114%  | `(0.0000, 0.0000, 0.0000)` | `0.00000`                | PASS                   |
| `product`         | 3,572     | 1,024,000  | 0.3488%  | `(0.0000, 0.0000, 0.0000)` | `0.00000`                | PASS                   |
| `multi (gtm+dir)` | 4,198     | 1,024,000  | 0.4100%  | `(0.0000, 0.0000, 0.0000)` | `0.00000`                | PASS                   |

### 4.3 Tier Cycle `#gl` Compare (`solo > squad > combine > squad > solo > combine > squad`)

| Step | Tier      | `rebStageKey` | Diff (px) | Diff (%) |
| ---- | --------- | ------------- | --------- | -------- |
| 1    | `solo`    | `app`         | 9,645     | 0.9419%  |
| 2    | `squad`   | `enc`         | 4,198     | 0.4100%  |
| 3    | `combine` | `raid`        | 452       | 0.0441%  |
| 4    | `squad`   | `enc`         | 4,198     | 0.4100%  |
| 5    | `solo`    | `app`         | 9,645     | 0.9419%  |
| 6    | `combine` | `raid`        | 452       | 0.0441%  |
| 7    | `squad`   | `enc`         | 4,198     | 0.4100%  |

### 4.4 `renderer.info.memory` (20 & 40 Tier Cycles)

- `start`: `geometries: 1334`, `textures: 27`
- `after20`: `geometries: 1334`, `textures: 27`
- `after40`: `geometries: 1334`, `textures: 27` (0 growth)

---

## 5. `wyrm` World Matrix Check (`t=50000`, `t=51700`)

- Reference `wyrm` `upd` (lines 12224–12250, SHA-256: `0be580ddb5a0f082a072e558a603a12346f28d6e6a36732707c89d9e3b6c5dbf`).
- Evaluated in-page at `t=50000` and `t=51700`: `firstDiff: null` across all 26 children (`checkedCount: 26`, max matrix element delta `<= 1e-6`).
- All 6 `wyrm` model bench rows (`28, 30, 35, 21, 35, 31 px`) remain labeled `FAIL` under `<= 10 px`.

---

## 6. Requests to Other Lanes

- **Lane `next` / Integrator:** Run `pnpm prettier --write` on unowned report files so root-level `pnpm format:check` exits 0.

---

## what could not be verified

- Physical GPU-level driver shader caching behavior across differing mobile OS GPU implementations (tested headless on Chromium WebGL).
