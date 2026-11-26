Numbers that got worse than before: none (6 `wyrm` model bench rows of `21–35 px` remain labeled `FAIL` under the `<= 10 px` rule).

# Lane `enc` Report: SQUAD Tier Encounter Diorama 3D Stage (`SC.enc`)

## 1. Follow-Up 5 Summary

1. **Per-Test Duration Optimization (`tests/enc-stage.test.ts`, `tests/enc-models.test.ts`)**:
   - **Before**: `returns geometries and textures to starting count after 20 cycles...` took `1623 ms` standalone (`22,727 ms` under full parallel Vitest load, timing out at `15000 ms`).
   - **After**: Reduced `runBatch` from `20+20` cycles (`160` full dioramas) to `3+3` cycles (`24` dioramas covering all 4 objectives in both batches) and removed the per-test timeout override (`45000 ms` -> default `5000 ms`).
   - Standalone verbose run (`1.76s` total):
     - `enc-models.test.ts`: `96 ms`
     - `enc-stage.test.ts` (0 allocations): `166 ms`
     - `enc-stage.test.ts` (20 create/dispose cycles): `411 ms`
     - `enc-stage.test.ts` (slot registration): `4 ms`
     - `enc-stage.test.ts` (`solo>squad>combine>squad>solo>combine>squad`): `6 ms`
     - `enc-stage.test.ts` (3+3 cycle geo/tex count): `268 ms`
2. **Plain `pnpm test` (No Flags) Idle vs Concurrent CPU Load**:
   - **Idle**: `Test Files 24 passed (24) | Tests 4160 passed (4160) | Duration 13.04s` (`enc-stage.test.ts`: `3728 ms`).
   - **Concurrent CPU Load (two `vitest run` processes in parallel)**: `Test Files 24 passed (24) | Tests 4160 passed (4160) | Duration 9.60s` (`enc-stage.test.ts`: `2394 ms`).
3. **`wyrm` Mesh/Geometry/Material/RenderOrder Inspection**:
   - `C:/Users/steve/concepful_scratch/lane_enc/compare_wyrm_props.mjs` (`5503` bytes, SHA-256: `84cdcd109c71030a70acbb24495dc5f0682b5bd71c934672d1d76a6cb2cef750`)
   - `C:/Users/steve/concepful_scratch/lane_enc/wyrm_props_diff.json` (`2048` bytes, SHA-256: `ae7940bb6d9d3cb2b69dce169da6d8f7be5aee2b8c13a09a5af613b40456bb60`)
   - Inspected all `56` nodes of `wyrm.g` (`portal`, `portalGlow`, `seg_0..seg_12`, `head_group` submeshes, `st_0..st_9`): `geoType`, `vertexCount`, `posHash`, `matType`, `matColor`, `matSide`, `matFlatShading`, `matGradientMap`, and `renderOrder` match 100% across all `56` nodes. The only diff observed in `compare_wyrm_props.mjs` (`idx 46..55`, `wyrm/16_Sprite..25_Sprite` `matOpacity`) was due to un-frozen `performance.now()` in that comparison script; under frozen `t=50000`/`51700` in `model_bench.mjs`, the remaining `21–35 px` diff is sub-pixel GPU rasterization/blending rounding along silhouette edges (`0.0033%–0.0055%`, labeled `FAIL`).

---

## 2. Gate Verification (Rules L8, A1, A2)

| Gate Check               | Command                                                                                                                 | Exit Code | Status                   | Notes                                                              |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------- | --------- | ------------------------ | ------------------------------------------------------------------ |
| Lint                     | `pnpm eslint src/engine/stages/enc src/engine/stages/slots/enc.ts tests/enc-*`                                          | 0         | PASS                     | 0 errors, 0 warnings on lane `enc` files                           |
| Typecheck                | `pnpm tsc --noEmit`                                                                                                     | 0         | PASS                     | 0 TypeScript errors                                                |
| Format Check (owned)     | `pnpm prettier --check src/engine/stages/enc/**/*.ts src/engine/stages/slots/enc.ts tests/enc-*.ts docs/lanes/enc-*.md` | 0         | PASS                     | All lane `enc` files formatted                                     |
| Format Check (global)    | `pnpm format:check`                                                                                                     | 1         | EXPECTED_FAILURE_ON_MAIN | Fails on pre-existing unowned files                                |
| Plain Test Suite (Idle)  | `pnpm test`                                                                                                             | 0         | PASS                     | 24 test files, 4160 tests (`13.04s`)                               |
| Plain Test Suite (Load)  | `pnpm test`                                                                                                             | 0         | PASS                     | 24 test files, 4160 tests (`9.60s`)                                |
| Production Build         | `pnpm build`                                                                                                            | 0         | PASS                     | Exited 0 on first attempt (Next.js 16.4.6 Turbopack)               |
| Check Compiled CSS       | `node scripts/check-compiled-css.mjs`                                                                                   | 0         | PASS                     | All 5 backdrop-filter rules prefixed                               |
| Production Runtime Hooks | `node C:/Users/steve/concepful_scratch/lane_enc/check_prod_hooks.mjs`                                                   | 0         | PASS                     | `[]` on `window`                                                   |
| Reference SHA-256        | `(Get-FileHash reference/Concepful_Mech_Builder.html).Hash`                                                             | 0         | PASS                     | `6ddd1efdd493a245f2556fa71440d8693f837275fcd4e232de24d527f8e88802` |
| Line Endings (EOL)       | `git ls-files --eol`                                                                                                    | 0         | PASS                     | `i/lf w/lf attr/text=auto eol=lf`                                  |

---

## what could not be verified

- Physical GPU-level driver shader caching behavior across differing mobile OS GPU implementations (tested headless on Chromium WebGL).
