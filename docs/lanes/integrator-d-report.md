# Lane `integrator-d` Report

Worse than previous lane reports: Step 4 Production vs E2E A/B (`ab_diff_results.json`, expected `0 px`): `1280 solo #gl` `43.6642%` (`447,121 px` `FAIL`), `1280 solo #patch` `10.4741%` (`1,825 px` `FAIL`), `1280 squad #gl` `49.5228%` (`507,113 px` `FAIL`), `1280 squad #patch` `29.7119%` (`5,177 px` `FAIL`), `1280 combine #gl` `4.615%` (`47,258 px` `FAIL`), `1280 combine #patch` `0.7518%` (`131 px` `FAIL`), `390 solo #gl` `39.7484%` (`124,015 px` `FAIL`), `390 squad #gl` `43.4478%` (`135,557 px` `FAIL`), `390 combine #gl` `3.083%` (`9,619 px` `FAIL`); Step 5 Production vs Reference (`prod_vs_ref_results.json`) vs `wiring-report.md`: `1280 solo #patch` `6.841%` (`FAIL`, vs `4.93%` in `wiring-report.md`), `390 combine #gl` `1.931%` (`PASS`, vs `1.895%` in `wiring-report.md`), plus pre-existing `FAIL` rows `1280 solo #gl` `46.258%`, `1280 squad #gl` `21.578%`, `390 solo #gl` `38.496%`, `390 squad #gl` `15.096%`; Step 6 `tier_cycle_check.mjs` (`tier_cycle_results.json`) `step 1/5 solo` `8.4455%` (`FAIL` without `AUTO` zeroing).

## 1. Commits & Files Changed

- **Branch**: `lane/integration-d` (port `3125`)
- **Base**: `8abf97e` (`feat(prod2): remove invented site URL, measure a11y audit, and verify dual-h1 neutrality`)
- **Commits on `lane/integration-d`**:
  1. `Merge remote-tracking branch 'origin/lane/wiring' into lane/integration-d` (`--no-ff` merge of `80bb53c`, 0 conflicts)
  2. `19689da` `fix(a11y): single h1` (`src/components/configurator/ConfiguratorShell.tsx`: `<h1 className="title">` -> `<h2 className="title">`)
  3. `9c336b0` `chore(shell): remove unused GuildModal.tsx` (deleted `src/components/shell/GuildModal.tsx`, 0 `src/`/`tests/` imports)
  4. `docs(lanes): add integrator-d report` (`docs/lanes/integrator-d-report.md`)

## 2. Gate Exit Codes

- Post-merge (`origin/lane/wiring`): `pnpm install --frozen-lockfile` (`0`), `pnpm typecheck` (`0`), `pnpm lint` (`0`), `pnpm test` (`0`, 26 files / 4166 tests), `pnpm build` (`0`).
- Final gate (production, `NEXT_PUBLIC_E2E` unset):
  - `pnpm lint`: `0`
  - `pnpm typecheck`: `0`
  - `pnpm format:check`: `0`
  - `pnpm test`: `0` (includes `tests/css-prefix-order.test.ts`, 26 files, 4166 tests)
  - `pnpm build`: `0`
  - Production runtime hook check (`check_hooks.mjs`): `0` (`PROD_HOOKS: []`)
  - `reference/Concepful_Mech_Builder.html` SHA256: `6DDD1EFDD493A245F2556FA71440D8693F837275FCD4E232DE24D527F8E88802`
  - `git ls-files --eol`: `i/lf w/lf` on all changed files

## 3. Step 2: Single `<h1>` Neutrality Check

- Results file: `C:\Users\steve\concepful_scratch\lane_integrator-d\h1_pixel_diff.json` (`1969` bytes, SHA256 `D6F1A848CBCF6D11880A0B66D2C025C53D3250A22BA61F992DB686FB81289F4D`)
- Script: `C:\Users\steve\concepful_scratch\lane_integrator-d\pixel_check_h1.mjs` (`9888` bytes, SHA256 `6330ACB214637442D84D901F0A36D063290D4E287BEC3F1F8622CF226B53AC4E`)

| Viewport | Target     | Selector | Diff Px | Total Px | Noise (Before, After) | Status |
| :------- | :--------- | :------- | ------: | -------: | :-------------------- | :----- |
| 1280     | story_top  | `.top`   |       0 |   62,400 | (0, 0)                | PASS   |
| 1280     | story_hero | `.hero`  |       0 |  240,120 | (0, 0)                | PASS   |
| 1280     | app_top    | `.top`   |       0 |   64,896 | (0, 0)                | PASS   |
| 1280     | app_panel  | `#panel` |       0 |  281,600 | (0, 0)                | PASS   |
| 390      | story_top  | `.top`   |       0 |   17,900 | (0, 0)                | PASS   |
| 390      | story_hero | `.hero`  |       0 |  150,002 | (0, 0)                | PASS   |
| 390      | app_top    | `.top`   |       0 |   38,664 | (0, 0)                | PASS   |
| 390      | app_panel  | `#panel` |       0 |  156,000 | (0, 0)                | PASS   |

## 4. Step 4: Production vs E2E A/B (`ab_capture.mjs`)

- Results file: `C:\Users\steve\concepful_scratch\lane_integrator-d\ab_diff_results.json` (`4661` bytes, SHA256 `AAC943B5DE962CA205A73B229A6D87D1DE2BBEE80E8DF6F52D89743EFC7B96F2`)
- Script: `C:\Users\steve\concepful_scratch\lane_integrator-d\ab_capture.mjs` (`12388` bytes, SHA256 `1608CE93E5458241BA6B893A1FF20CF34EB59EF4855289C543DEF80006A0A0C1`)
- `prodHasHook`: `false`, `e2eHasHook`: `true` (no window hooks called by harness).

| Viewport | Tier    | Canvas   | Diff Px |  Total Px |   Diff % | Noise (Prod, E2E) | Status |
| :------- | :------ | :------- | ------: | --------: | -------: | :---------------- | :----- |
| 1280     | solo    | `#gl`    | 447,121 | 1,024,000 | 43.6642% | (0, 0)            | FAIL   |
| 1280     | solo    | `#cv`    |       0 | 1,024,000 |       0% | (0, 0)            | PASS   |
| 1280     | solo    | `#patch` |   1,825 |    17,424 | 10.4741% | (0, 0)            | FAIL   |
| 1280     | squad   | `#gl`    | 507,113 | 1,024,000 | 49.5228% | (0, 0)            | FAIL   |
| 1280     | squad   | `#cv`    |       0 | 1,024,000 |       0% | (0, 0)            | PASS   |
| 1280     | squad   | `#patch` |   5,177 |    17,424 | 29.7119% | (0, 0)            | FAIL   |
| 1280     | combine | `#gl`    |  47,258 | 1,024,000 |   4.615% | (0, 0)            | FAIL   |
| 1280     | combine | `#cv`    |       0 | 1,024,000 |       0% | (0, 0)            | PASS   |
| 1280     | combine | `#patch` |     131 |    17,424 |  0.7518% | (0, 0)            | FAIL   |
| 390      | solo    | `#gl`    | 124,015 |   312,000 | 39.7484% | (0, 0)            | FAIL   |
| 390      | solo    | `#cv`    |       0 |   312,000 |       0% | (0, 0)            | PASS   |
| 390      | solo    | `#patch` |       0 |    17,424 |       0% | (0, 0)            | PASS   |
| 390      | squad   | `#gl`    | 135,557 |   312,000 | 43.4478% | (0, 0)            | FAIL   |
| 390      | squad   | `#cv`    |       0 |   312,000 |       0% | (0, 0)            | PASS   |
| 390      | squad   | `#patch` |       0 |    17,424 |       0% | (0, 0)            | PASS   |
| 390      | combine | `#gl`    |   9,619 |   312,000 |   3.083% | (0, 0)            | FAIL   |
| 390      | combine | `#cv`    |       0 |   312,000 |       0% | (0, 0)            | PASS   |
| 390      | combine | `#patch` |       0 |    17,424 |       0% | (0, 0)            | PASS   |

- **Root Cause (`src/engine/camera/orbitController.ts:139-146`)**: When `NEXT_PUBLIC_E2E === "1"`, `autoPick()` calls `window.__reseed(1337)` before sampling `auto.ty` and `auto.tp`, whereas Production does not reset the PRNG.

## 5. Step 5: Production vs Reference (`prod_vs_ref.mjs`)

- Results file: `C:\Users\steve\concepful_scratch\lane_integrator-d\prod_vs_ref_results.json` (`4890` bytes, SHA256 `A8DA18F4106CB1AFD94D116EFE57DE30FEEE3F174D3FD006F566308E9EEB5A4E`)
- Script: `C:\Users\steve\concepful_scratch\lane_integrator-d\prod_vs_ref.mjs` (`12072` bytes, SHA256 `D52A54655040EC3793E6332247559818DF95CBA0B9BB1ED6F71046C20602F4D5`)

| Viewport | Tier    | Canvas   | Diff Px |  Total Px |  Diff % | Noise (Ref, Prod) | Status |
| :------- | :------ | :------- | ------: | --------: | ------: | :---------------- | :----- |
| 1280     | solo    | `#gl`    | 473,680 | 1,024,000 | 46.258% | (0, 0)            | FAIL   |
| 1280     | solo    | `#patch` |   1,192 |    17,424 |  6.841% | (0, 0)            | FAIL   |
| 1280     | solo    | `#cv`    |      11 | 1,024,000 |  0.001% | (0, 0)            | PASS   |
| 1280     | squad   | `#gl`    | 220,957 | 1,024,000 | 21.578% | (0, 0)            | FAIL   |
| 1280     | squad   | `#patch` |      65 |    17,424 |  0.373% | (0, 0)            | PASS   |
| 1280     | squad   | `#cv`    |      11 | 1,024,000 |  0.001% | (0, 0)            | PASS   |
| 1280     | combine | `#gl`    |  23,151 | 1,024,000 |  2.261% | (0, 0)            | PASS   |
| 1280     | combine | `#patch` |       5 |    17,424 |  0.029% | (0, 0)            | PASS   |
| 1280     | combine | `#cv`    |      11 | 1,024,000 |  0.001% | (0, 0)            | PASS   |
| 390      | solo    | `#gl`    | 120,108 |   312,000 | 38.496% | (0, 0)            | FAIL   |
| 390      | solo    | `#patch` |       0 |    17,424 |      0% | (0, 0)            | PASS   |
| 390      | solo    | `#cv`    |       0 |   312,000 |      0% | (0, 0)            | PASS   |
| 390      | squad   | `#gl`    |  47,100 |   312,000 | 15.096% | (0, 0)            | FAIL   |
| 390      | squad   | `#patch` |       0 |    17,424 |      0% | (0, 0)            | PASS   |
| 390      | squad   | `#cv`    |     150 |   312,000 |  0.048% | (0, 0)            | PASS   |
| 390      | combine | `#gl`    |   6,025 |   312,000 |  1.931% | (0, 0)            | PASS   |
| 390      | combine | `#patch` |       0 |    17,424 |      0% | (0, 0)            | PASS   |
| 390      | combine | `#cv`    |       0 |   312,000 |      0% | (0, 0)            | PASS   |

- **State Difference (`diag_state_diff.json`, `536` bytes, SHA256 `388923A628997827C604183853D0A893326B115D7C4D833AE2CB2FE9B981EE40`)**:
  - `stepCount`: `90` on both pages.
  - `rand`: Reference `seed=492735611, randCalls=8942`; Rebuild `seed=700040826, randCalls=3378`.
  - Reference `auto`: `yaw=-0.4057198847697302, pitch=0.031321057557427395, ty=-0.4057198847697302, tp=0.031321057557427395, t0=50016.666666666664`; Rebuild `camPos=[-6.025557545586929, -0.1299369313453535, 14.852909463875887]`.
  - `solo`/`squad` `#gl` and `1280 solo #patch` differ because `orbit.auto` (`yaw`/`pitch`/`ty`/`tp`) samples `Math.random()` at different PRNG positions without `AUTO` zeroing.

## 6. Step 6: Production & E2E Acceptance Suites

- **Production Click Parity** (`click_parity_harness.mjs`, `12020` bytes, SHA256 `6FFC4B0EBBDB0DD1125C8AE2A9A6DD75201EC884A018A282A1A0D615ADF2FF29`; `task_c1_parity_results.json`, `86369` bytes, SHA256 `C5FF3911BC5ECBF54FDCFE81FD31C9557E32378A14204BAFDD3D7511B6A502FA`): `0` mismatches, negative control `2/2` (`PASS`).
- **Production 256 Combine Fixture** (`combine_256_prod.mjs`, `7085` bytes, SHA256 `F096EE64A2F2465C468EBEBB49EB8E840EF45237E3D7F1CD5800930F60138ECF`; `combine_256_prod_results.json`, `108` bytes, SHA256 `F1290111D27E7E03578EABE9BF63A1873DA33712F1DDE1BF1A9CB4F187B83A9F`): `256/256` matched, `0` mismatches (`PASS`).
- **Production Modal Parity** (`modal_parity_harness.mjs`, `19416` bytes, SHA256 `09DEB83EA8D2ED97E45DC584020EF4FE579347A83228FBE65C6E34D41948A993`; `step3_parity_results.json`, `12765` bytes, SHA256 `18B7AA6BC67F253A632B752BA1720C6E620CA4875CAB7A57058AA635DEC844EE`): `63/63` matched, `0` failed, `0` network requests, negative control detected (`PASS`).
- **Production Wiring Message/Timing** (`verify_wiring.mjs`, `17398` bytes, SHA256 `E837BB955DB8831C4E1C3CCFC60D6C7976275E84A21B2972776788E199A08723`; `wiring_verify_results.json`, `31949` bytes, SHA256 `38B84A8FBA0F83960D298CC7B2C40684695DCDF29F35483C7B6F9E8EE010B7D6`): exit `0` (`PASS`).
- **E2E 184 Story Rows** (`part4_13_sweep.mjs`, `9986` bytes, SHA256 `A72E5757E1BA65BCAF2AF58EAF3DF8109063D6825B0F6541DFDC255C0BD7CC4E`; `sweep_summary.json`, `95` bytes, SHA256 `8421E45E38E71F609D9E6B34F37BDECB86CF3DA2DDDB087A414D3194AE63B6D0`): `184` rows, `min=0.0005%`, `median=0.4487%`, `max=1.0513%` (`PASS`).
- **E2E Settled Solo Rows** (`measure_solo_app.mjs`, `12550` bytes, SHA256 `B75CC694D02C09088F93BA697A3EC73A8685B24C78BD7DB76380271DE4005B61`; `integrator_d_solo_app.json`, `3527` bytes, SHA256 `C37919C5C15FC2FE2AD1C6ED5D2B2FC62EFBC8733123F9D87AF9095D86855BB2`): `390` `1.1846%` (`PASS`), `1280` `0.9363%`–`0.9419%` (`PASS`).
- **E2E 20/40 Tier-Cycle Memory** (`tier_cycle_check.mjs`, `15496` bytes, SHA256 `C6E45C96D5A606F4F6B02C9E77D33B4651439598829D4FB576E5D42298BD5A7C`; `tier_cycle_results.json`, `3692` bytes, SHA256 `AD2E85891E8A1746F59DAE9299D662C3679CAE90348ECAFEE13A9D1F0B0C279B`): `0 cycles` `geometries=490, textures=20, programs=10`; `20 cycles` `768/24/17`; `40 cycles` `768/24/17`; `step 1/5 solo` `8.4455%` (`FAIL` without `AUTO` zeroing), `squad` `2.2882%` (`PASS`), `combine` `0.4824%` (`PASS`).

## 7. Open Issues & Requests to Other Lanes

- `src/engine/camera/orbitController.ts:139-144` gates `window.__reseed(1337)` on `NEXT_PUBLIC_E2E === "1"`, causing E2E vs Production divergence on `solo`/`squad` `#gl` and `#patch`.
- Production `solo`/`squad` `#gl` and `1280 solo #patch` diverge from Reference when `orbit.auto` is not zeroed because `Math.random()` call counts differ between Reference (`8942`) and Rebuild (`3378`).
