Numbers that got worse than before: none.

# Lane `enc` Report: SQUAD Tier Encounter Diorama 3D Stage (`SC.enc`)

## 1. Overview & Scope

Lane `enc` implements the encounter 3D stage (`SC.enc`) for the SQUAD tier, registered via `src/engine/stages/slots/enc.ts` and ported into `src/engine/stages/enc/**`.

### Follow-Up 3 Fixes:

1. **Stage Slot Wrapping (`slots/enc.ts`)**: Wrapped `hasBuilder`, `getBuiltStage`, `getActiveStage`, `clearActive`, `select`, and `dispose` so `manager.getActiveStage()` equals the selected stage across `solo > squad > combine > squad > solo > combine > squad`.
2. **Layer Bisect & `base3` Fix (`models/base3.ts`)**: Layer bisect on `gtm` identified the diorama layer (`13.1710%` vs `0.4688%` when hidden) as the primary diff source. Reference line 13724 (`function base3(g, r) { hexPlinth(g, r); }`) overwrites line 12046. Updating `base3.ts` to delegate to `hexPlinth` reduced all 4 single-objective scene diffs from `13.17% / 14.96% / 12.51% / 7.95%` down to `0.4100% / 0.4398% / 0.6114% / 0.3488%` with `0.0000` camera delta.
3. **`wyrm` Relabeling & Mesh Bisect**: Relabeled all 6 `wyrm` rows (`21–35 px > 10 px` threshold) as `FAIL`, recorded world bbox and first differing mesh (`seg_6`), and verified `@font-face` injection leaves diff unchanged (`28/30/35/21/35/31 px`).
4. **20+20 Cycle Geometry & Texture Disposal**: Updated `EncStage.dispose()` to dispose non-shared `CanvasTexture` maps (e.g. `textSprite` in `popPlanet`). Verified `0` growth in second batch of 20 cycles in both Vitest (`0/0 -> 0/0 -> 0/0`) and WebGL `renderer.info.memory` (`716/21 -> 742/23 -> 742/23`).

---

## 2. Scripts and Evidence Artifacts (Rule A3)

| Artifact / Script            | Path                                                                 | Size (bytes) | SHA-256                                                            |
| ---------------------------- | -------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------ |
| Model Bench Harness          | `C:/Users/steve/concepful_scratch/lane_enc/model_bench.mjs`          | 8751         | `d447c861e1d50f1f55914a5c6925927b0058cbfed296ad0d4561bdfed3eff51f` |
| Scene Check Harness          | `C:/Users/steve/concepful_scratch/lane_enc/scene_check.mjs`          | 12822        | `b0498ebe0866706ee744f8fb048da2cc2c5918f8d359664856b4185ccb687a90` |
| Part 4.13 Sweep Harness      | `C:/Users/steve/concepful_scratch/lane_enc/part4_13_sweep.mjs`       | 10490        | `25f27417c0f46b4690310b3df87cc0cc4e66f870eab2015ae788986cd622a7a7` |
| Layer Bisect & Memory Script | `C:/Users/steve/concepful_scratch/lane_enc/bisect_enc.mjs`           | 12598        | `8bd8c7841d09a1c15ee130a77ee405e450d9a0956739b24de8bcd5f28c57e286` |
| Wyrm Font Bisect Script      | `C:/Users/steve/concepful_scratch/lane_enc/bisect_wyrm.mjs`          | 10296        | `6843606fbe81076589ebcdc4e4d7c43bf22300f91c602dafabb516ec9997e3eb` |
| Wyrm Mesh Bisect Script      | `C:/Users/steve/concepful_scratch/lane_enc/wyrm_mesh_bisect.mjs`     | 7578         | `8114fa8bd0e93363a6d8282936486b37fd2153de312bd6964e5e9c4d3a8f973a` |
| Prod Hooks Check Script      | `C:/Users/steve/concepful_scratch/lane_enc/check_prod_hooks.mjs`     | 2372         | `82d9643099b62adca176410aa89b5071ca1781049b4fb089086814c9cd4c12cb` |
| Model Bench Results          | `C:/Users/steve/concepful_scratch/lane_enc/model_bench_results.json` | 5222         | `e4bb4687651c72f53520d4f34d0da019ee6bcc75633a6423f962a34f9dd03b8f` |
| Scene Check Results          | `C:/Users/steve/concepful_scratch/lane_enc/scene_check_results.json` | 4228         | `e9d31750447f1b616c9e3e50a89c676ab1f5d1d0a806fd91083ad3ab59ea764d` |
| Bisect Results               | `C:/Users/steve/concepful_scratch/lane_enc/bisect_results.json`      | 8172         | `5b2750d54879e8f757e110008130ad771623614a5a2fe5c3a6dce2fadb936ca1` |
| Wyrm Font Bisect Results     | `C:/Users/steve/concepful_scratch/lane_enc/wyrm_bisect.json`         | 10029        | `0cf57d5d18fb3283b09f0c7f0a6fac28b3e670dcee69bcf3adbf96fcb58e3c33` |
| Wyrm Mesh Bisect Results     | `C:/Users/steve/concepful_scratch/lane_enc/wyrm_mesh_bisect.json`    | 3533         | `5342eab2704a41e8a9dda397ec83b79a619484ef275ff92561c565e78dea39d`  |
| Sweep Summary Results        | `C:/Users/steve/concepful_scratch/lane_enc/sweep_summary_enc.json`   | 2688         | `e61eb235fbc25f43492238635e31427eeafbbea873d37a1503c2ce0fc8447229` |

---

## 3. Gate Verification (Rules L8, A1, A2)

| Gate Check               | Command                                                                                                                 | Exit Code | Status                   | Notes                                                              |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------- | --------- | ------------------------ | ------------------------------------------------------------------ |
| Lint                     | `pnpm eslint src/engine/stages/enc src/engine/stages/slots/enc.ts tests/enc-*`                                          | 0         | PASS                     | 0 errors, 0 warnings on lane `enc` files                           |
| Typecheck                | `pnpm tsc --noEmit`                                                                                                     | 0         | PASS                     | 0 TypeScript errors                                                |
| Format Check (owned)     | `pnpm prettier --check src/engine/stages/enc/**/*.ts src/engine/stages/slots/enc.ts tests/enc-*.ts docs/lanes/enc-*.md` | 0         | PASS                     | All lane `enc` files formatted                                     |
| Format Check (global)    | `pnpm format:check`                                                                                                     | 1         | EXPECTED_FAILURE_ON_MAIN | Fails solely on `docs/lanes/next-report.md`                        |
| Test Suite               | `pnpm vitest run --testTimeout=30000`                                                                                   | 0         | PASS                     | 19 test files, 4138 tests                                          |
| Production Build         | `pnpm build`                                                                                                            | 0         | PASS                     | Exited 0 on first attempt (Next.js 16.4.6 Turbopack)               |
| Check Compiled CSS       | `node scripts/check-compiled-css.mjs`                                                                                   | 0         | PASS                     | All 5 backdrop-filter rules prefixed                               |
| Production Runtime Hooks | `node C:/Users/steve/concepful_scratch/lane_enc/check_prod_hooks.mjs`                                                   | 0         | PASS                     | `[]` on `window`                                                   |
| Reference SHA-256        | `(Get-FileHash reference/Concepful_Mech_Builder.html).Hash`                                                             | 0         | PASS                     | `6ddd1efdd493a245f2556fa71440d8693f837275fcd4e232de24d527f8e88802` |
| Line Endings (EOL)       | `git ls-files --eol`                                                                                                    | 0         | PASS                     | `i/lf w/lf attr/text=auto eol=lf`                                  |

---

## 4. Layer Bisect & `base3` Fix (Item 2)

| Layer Hidden (`gtm`, 1280x800)             | Diff (px) | Diff (%) | Max Delta |
| ------------------------------------------ | --------- | -------- | --------- |
| `none (baseline before fix)`               | 134,871   | 13.1710% | 214       |
| `backdrop (scene.background=null)`         | 134,871   | 13.1710% | 238       |
| `fog (scene.fog=null)`                     | 134,871   | 13.1710% | 214       |
| `lights`                                   | 67,257    | 6.5681%  | 255       |
| `cosmos`                                   | 134,880   | 13.1719% | 214       |
| `streak`                                   | 130,894   | 12.7826% | 214       |
| `planet`                                   | 134,878   | 13.1717% | 214       |
| `diorama`                                  | 4,800     | 0.4688%  | 130       |
| `only_diorama (hide cosmos+streak+planet)` | 130,910   | 12.7842% | 214       |
| `only_bg (hide diorama)`                   | 4,800     | 0.4688%  | 130       |

---

## 5. Model Bench Acceptance Table (Item 3, <= 10 px threshold)

Copied from `model_bench_results.json` (`e4bb4687651c72f53520d4f34d0da019ee6bcc75633a6423f962a34f9dd03b8f`).

| Model       | Yaw (deg) | Timestamp (ms) | Diff (px) | Total (px) | Diff (%) | Status |
| ----------- | --------- | -------------- | --------- | ---------- | -------- | ------ |
| `barbarian` | 0         | 50000          | 4         | 640000     | 0.0006%  | PASS   |
| `barbarian` | 0         | 51700          | 4         | 640000     | 0.0006%  | PASS   |
| `barbarian` | 90        | 50000          | 0         | 640000     | 0.0000%  | PASS   |
| `barbarian` | 90        | 51700          | 0         | 640000     | 0.0000%  | PASS   |
| `barbarian` | 180       | 50000          | 0         | 640000     | 0.0000%  | PASS   |
| `barbarian` | 180       | 51700          | 1         | 640000     | 0.0002%  | PASS   |
| `furball`   | 0         | 50000          | 0         | 640000     | 0.0000%  | PASS   |
| `furball`   | 0         | 51700          | 0         | 640000     | 0.0000%  | PASS   |
| `furball`   | 90        | 50000          | 0         | 640000     | 0.0000%  | PASS   |
| `furball`   | 90        | 51700          | 0         | 640000     | 0.0000%  | PASS   |
| `furball`   | 180       | 50000          | 0         | 640000     | 0.0000%  | PASS   |
| `furball`   | 180       | 51700          | 0         | 640000     | 0.0000%  | PASS   |
| `wyrm`      | 0         | 50000          | 28        | 640000     | 0.0044%  | FAIL   |
| `wyrm`      | 0         | 51700          | 30        | 640000     | 0.0047%  | FAIL   |
| `wyrm`      | 90        | 50000          | 35        | 640000     | 0.0055%  | FAIL   |
| `wyrm`      | 90        | 51700          | 21        | 640000     | 0.0033%  | FAIL   |
| `wyrm`      | 180       | 50000          | 35        | 640000     | 0.0055%  | FAIL   |
| `wyrm`      | 180       | 51700          | 31        | 640000     | 0.0048%  | FAIL   |
| `popPlanet` | 0         | 50000          | 5         | 640000     | 0.0008%  | PASS   |
| `popPlanet` | 0         | 51700          | 2         | 640000     | 0.0003%  | PASS   |
| `popPlanet` | 90        | 50000          | 3         | 640000     | 0.0005%  | PASS   |
| `popPlanet` | 90        | 51700          | 1         | 640000     | 0.0002%  | PASS   |
| `popPlanet` | 180       | 50000          | 8         | 640000     | 0.0013%  | PASS   |
| `popPlanet` | 180       | 51700          | 0         | 640000     | 0.0000%  | PASS   |
| `maze`      | 0         | 50000          | 0         | 640000     | 0.0000%  | PASS   |
| `maze`      | 0         | 51700          | 0         | 640000     | 0.0000%  | PASS   |
| `maze`      | 90        | 50000          | 0         | 640000     | 0.0000%  | PASS   |
| `maze`      | 90        | 51700          | 0         | 640000     | 0.0000%  | PASS   |
| `maze`      | 180       | 50000          | 0         | 640000     | 0.0000%  | PASS   |
| `maze`      | 180       | 51700          | 0         | 640000     | 0.0000%  | PASS   |
| `bossMino`  | 0         | 50000          | 0         | 640000     | 0.0000%  | PASS   |
| `bossMino`  | 0         | 51700          | 0         | 640000     | 0.0000%  | PASS   |
| `bossMino`  | 90        | 50000          | 0         | 640000     | 0.0000%  | PASS   |
| `bossMino`  | 90        | 51700          | 0         | 640000     | 0.0000%  | PASS   |
| `bossMino`  | 180       | 50000          | 0         | 640000     | 0.0000%  | PASS   |
| `bossMino`  | 180       | 51700          | 0         | 640000     | 0.0000%  | PASS   |

- `wyrm` world bbox: `min: [-3.0255413494692376, -1.9, -3.0255413494692376], max: [3.0255413494692376, 5.948929610835558, 3.0255413494692376]`.
- First differing mesh by name: `seg_6` (silhouette edge pixels on `seg_6..seg_11` and `head_group`).
- `@font-face` injection test: diff unchanged (`28 / 30 / 35 / 21 / 35 / 31 px`), confirming non-font origin.

---

## 6. Squad Encounter Scene & Camera Parity (Post-`base3` Fix)

Copied from `scene_check_results.json` (`e9d31750447f1b616c9e3e50a89c676ab1f5d1d0a806fd91083ad3ab59ea764d`). Noise floor = 0 px (VALID).

| Scene      | Objectives       | Diff (px) | Total (px) | Diff (%) | $\Delta \text{CAM Pos}$    | $\Delta \text{CAM Quat}$ | Bounding Box $[x_0, y_0] \to [x_1, y_1]$      |
| ---------- | ---------------- | --------- | ---------- | -------- | -------------------------- | ------------------------ | --------------------------------------------- |
| `gtm`      | `["gtm"]`        | 4,198     | 1,024,000  | 0.4100%  | `(0.0000, 0.0000, 0.0000)` | `0.00000`                | $[90, 0] \to [1279, 772]$ ($1190 \times 773$) |
| `dir`      | `["dir"]`        | 4,504     | 1,024,000  | 0.4398%  | `(0.0000, 0.0000, 0.0000)` | `0.00000`                | $[32, 0] \to [1279, 761]$ ($1248 \times 762$) |
| `research` | `["research"]`   | 6,261     | 1,024,000  | 0.6114%  | `(0.0000, 0.0000, 0.0000)` | `0.00000`                | $[22, 3] \to [1279, 773]$ ($1258 \times 771$) |
| `product`  | `["product"]`    | 3,572     | 1,024,000  | 0.3488%  | `(0.0000, 0.0000, 0.0000)` | `0.00000`                | $[0, 0] \to [1279, 638]$ ($1280 \times 639$)  |
| `multi`    | `["gtm", "dir"]` | 4,198     | 1,024,000  | 0.4100%  | `(0.0000, 0.0000, 0.0000)` | `0.00000`                | $[90, 0] \to [1279, 772]$ ($1190 \times 773$) |

---

## 7. 20+20 Cycle Geometry & Texture Disposal (Item 4)

| Environment                                                        | Starting (`geos` / `texs`) | After 20 Cycles | After 40 Cycles | Growth in Batch 2 | Status |
| ------------------------------------------------------------------ | -------------------------- | --------------- | --------------- | ----------------- | ------ |
| Vitest `createEncStage` + `dispose`                                | `0 / 0`                    | `0 / 0`         | `0 / 0`         | `0 / 0`           | PASS   |
| Chromium WebGL `renderer.info.memory` (`solo>squad>combine>squad`) | `716 / 21`                 | `742 / 23`      | `742 / 23`      | `0 / 0`           | PASS   |

---

## 8. Requests to Other Lanes

- **Lane `next` / Integrator:** Run `pnpm prettier --write docs/lanes/next-report.md` so root-level `pnpm format:check` passes.

---

## what could not be verified

- Physical GPU-level driver shader caching behavior across differing mobile OS GPU implementations (tested headless on Chromium WebGL).
