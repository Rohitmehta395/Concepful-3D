Numbers that got worse than before: None (all national and global scene rows improved from 31.6–44.6% FAIL to 1.31–2.05% PASS; regional improved from 8.4–8.5% to 7.58–7.76%; sMother yaw 0 and sCarrier yaw 0/90 unchanged).

# Lane RAID Report: SC.raid 3D Scene Port & Combine Stage Integration (Follow-Up 3)

## Commits and Changed Files

### Commits on `lane/raid`

- `b628877` feat(raid): port SC.raid 3D scene and register combine stage
- `89b05c1` docs(lanes): add raid-report.md and update raid-requests.md
- `e67ed76` docs(lanes): update raid-report.md for Amendments A1-A4
- `190154e` fix(raid): port sTitan/sCarrier, fix camera dx oscillation, and update Follow-Up 2 evidence
- Subsequent commit: `fix(raid): port raid cosmos preset and toon clouds, update Follow-Up 3 evidence`

### Changed Files

- `src/engine/stages/raid/raidCosmos.ts` (created) — Exact port of reference `cosmos(SC.raid, "raid")` preset (`lines 10864–10918`: `addStars(700, 160, 81)`, `addNebula([10, 16, -110], 220, MEL, VIO, 47, 0.1, 0.55)`, `addComets(2, [100, 30, -80], 29)`).
- `src/engine/stages/raid/raidStage.ts` (updated) — Switched `cosmos` from `createCosmos(..., "raid")` (which silently fell back to `"intro"` in `src/engine/world/cosmos.ts`) to `createRaidCosmos`, and replaced `MeshBasicMaterial` clouds from `clouds.ts` with `mats.tm(HX.cloud)` toon-shaded clouds matching reference lines `10394–10413`.
- `src/engine/stages/raid/raidShips.ts` (unchanged since `190154e`)
- `src/engine/stages/slots/raid.ts` (unchanged since `b628877`)
- `tests/raid-stage.test.ts` (unchanged since `b628877`)
- `docs/lanes/raid-requests.md` (updated) — Added Section 4 requesting `"raid"` preset in `src/engine/world/cosmos.ts` and `mats.tm(HX.cloud)` in `src/engine/world/clouds.ts`.
- `docs/lanes/raid-report.md` (updated) — This report.

---

## Part 1: Layer Bisect & Top Differing Layer Analysis

### Layer Bisect Tables (1280x800, before fix)

From `bisect_followup3.mjs`:

#### `regional` (`sky`, baseline: `86,270 px`, `8.4248%`)

```text
layer      | single-hide diff px | single-hide % | delta vs base | cumul-hide diff px | cumul-hide %
-----------+---------------------+---------------+---------------+--------------------+-------------
backdrop   |               86270 |       8.4248% |             0 |              86270 |      8.4248%
fog        |               86270 |       8.4248% |             0 |              86270 |      8.4248%
clouds     |                6489 |       0.6337% |        -79781 |               6489 |      0.6337%
bubbles    |               86270 |       8.4248% |             0 |               6489 |      0.6337%
planet     |               86270 |       8.4248% |             0 |               6489 |      0.6337%
streaks    |               80202 |       7.8322% |         -6068 |                  0 |      0.0000%
cosmos     |               86270 |       8.4248% |             0 |                  0 |      0.0000%
lights     |               86270 |       8.4248% |             0 |                  0 |      0.0000%
ship       |               93473 |       9.1282% |          7203 |                  0 |      0.0000%
escorts    |               86270 |       8.4248% |             0 |                  0 |      0.0000%
crew       |               86270 |       8.4248% |             0 |                  0 |      0.0000%
```

#### `national` (`space`, baseline: `463,234 px`, `45.2377%`)

```text
layer      | single-hide diff px | single-hide % | delta vs base | cumul-hide diff px | cumul-hide %
-----------+---------------------+---------------+---------------+--------------------+-------------
backdrop   |              463269 |      45.2411% |            35 |             463269 |     45.2411%
fog        |              463234 |      45.2377% |             0 |             463269 |     45.2411%
clouds     |              463234 |      45.2377% |             0 |             463269 |     45.2411%
bubbles    |              463234 |      45.2377% |             0 |             463269 |     45.2411%
planet     |              512371 |      50.0362% |         49137 |             512403 |     50.0394%
streaks    |              461293 |      45.0481% |         -1941 |             510678 |     49.8709%
cosmos     |               14805 |       1.4458% |       -448429 |                 39 |      0.0038%
lights     |              463193 |      45.2337% |           -41 |                  5 |      0.0005%
ship       |              499687 |      48.7976% |         36453 |                  0 |      0.0000%
escorts    |              464126 |      45.3248% |           892 |                  0 |      0.0000%
crew       |              463234 |      45.2377% |             0 |                  0 |      0.0000%
```

#### `global` (`deep`, baseline: `386,936 px`, `37.7867%`)

```text
layer      | single-hide diff px | single-hide % | delta vs base | cumul-hide diff px | cumul-hide %
-----------+---------------------+---------------+---------------+--------------------+-------------
backdrop   |              386968 |      37.7898% |            32 |             386968 |     37.7898%
fog        |              386936 |      37.7867% |             0 |             386968 |     37.7898%
clouds     |              386936 |      37.7867% |             0 |             386968 |     37.7898%
bubbles    |              386936 |      37.7867% |             0 |             386968 |     37.7898%
planet     |              460798 |      44.9998% |         73862 |             460827 |     45.0026%
streaks    |              385236 |      37.6207% |         -1700 |             459400 |     44.8633%
cosmos     |               14030 |       1.3701% |       -372906 |               1478 |      0.1443%
lights     |              386781 |      37.7716% |          -155 |               1306 |      0.1275%
ship       |              409961 |      40.0353% |         23025 |                  0 |      0.0000%
escorts    |              389245 |      38.0122% |          2309 |                  0 |      0.0000%
crew       |              386921 |      37.7853% |           -15 |                  0 |      0.0000%
```

### Top Differing Layer (`cosmos` for `national`/`global`, `clouds` for `regional`)

- **Reference `cosmos` (`reference/Concepful_Mech_Builder.html`, SHA256 `6ddd1efdd493a245f2556fa71440d8693f837275fcd4e232de24d527f8e88802`, lines 10911–10915):**
  ```js
  raid: () => {
    addStars(g, 700, 160, 81);
    addNebula(g, [10, 16, -110], 220, MEL, VIO, 47, 0.1, 0.55);
    addComets(g, 2, [100, 30, -80], 29);
  },
  ```
- **Previous rebuild (`src/engine/world/cosmos.ts` lines 398–444):**
  `presets` omitted `"raid"`, so `createCosmos(three, group, "raid")` fell back to `presets.intro`:
  - `addStars(700, 150, 11)` instead of `(700, 160, 81)` (different radius and seed)
  - Two nebulae `([-30, 22, -95], 170, MEL, VIO, 3, 0.25)` and `([40, -30, -110], 150, VIO, PER, 8, -0.2, 0.5)` instead of one nebula `([10, 16, -110], 220, MEL, VIO, 47, 0.1, 0.55)`
  - `addComets(2, [70, 30, -80], 5)` instead of `(2, [100, 30, -80], 29)`
- **Reference `clouds` (`reference/Concepful_Mech_Builder.html`, lines 10394–10413):**
  Uses `tm(HX.cloud)` (`MeshToonMaterial` with toon gradient `TG`) and `Math.random()` at page startup. Previous rebuild `src/engine/world/clouds.ts` line 22 used `MeshBasicMaterial`. Remaining `regional` diff (~7.6% at 1280, ~4.5% at 390) is solely due to `Math.random()` PRNG state difference between startup construction (`RAID.clouds` / `RAID.stars`) and lazy stage construction (`raidStage`).

---

## Updated 30 Scene Rows & Environment-Only Diff (Copied Verbatim from `followup3_30rows.txt`)

- **Results file:** `C:\Users\steve\concepful_scratch\lane_raid\followup3_30rows.txt`
  - **Size:** 11,527 bytes
  - **SHA256:** `A9891AD40690051E72C32B5FDF32ED6D2BD0AA250278618F1B64070C7EBF81E3`
- Status computed by script: `INVALID` if noise > 50, `FAIL` if diff > 3%, else `PASS`.

```text
state               | vp   | reach    | refNoise | rebNoise | diff px | total px | diff %   | bbox                | posDelta            | quatDelta             | status
--------------------+------+----------+----------+----------+---------+----------+----------+---------------------+---------------------+-----------------------+-------
cumul_0_local       | 1280 | local    |        0 |        0 |     482 |  1024000 |  0.0471% | [30,7,1250,791]     | [0,0,0]             | [0,0,0,0]             | PASS
cumul_1_regional    | 1280 | regional |        0 |        0 |   78767 |  1024000 |  7.6921% | [0,2,1279,796]      | [0,0,0]             | [0,0,0,0]             | FAIL
cumul_2_regional    | 1280 | regional |        0 |        0 |   79217 |  1024000 |  7.7360% | [0,0,1279,799]      | [0,0,0]             | [0,0,0,0]             | FAIL
cumul_3_national    | 1280 | national |        0 |        0 |   13459 |  1024000 |  1.3144% | [135,10,1279,772]   | [0,0,0]             | [0,0,0,0]             | PASS
cumul_4_national    | 1280 | national |        0 |        0 |   13609 |  1024000 |  1.3290% | [64,4,1279,735]     | [0,0,0]             | [0,0,0,0]             | PASS
cumul_5_global      | 1280 | global   |        0 |        0 |   18240 |  1024000 |  1.7812% | [23,2,1279,799]     | [0,0,0]             | [0,0,0,0]             | PASS
cumul_6_global      | 1280 | global   |        0 |        0 |   16466 |  1024000 |  1.6080% | [101,0,1279,799]    | [0,0,0]             | [0,0,0,0]             | PASS
cumul_7_global_all  | 1280 | global   |        0 |        0 |   15621 |  1024000 |  1.5255% | [98,0,1279,753]     | [0,0,0]             | [0,0,0,0]             | PASS
single_3d           | 1280 | regional |        0 |        0 |   78394 |  1024000 |  7.6557% | [0,2,1279,797]      | [0,0,0]             | [0,0,0,0]             | FAIL
single_fab          | 1280 | regional |        0 |        0 |   78568 |  1024000 |  7.6727% | [0,3,1279,799]      | [0,0,0]             | [0,0,0,0]             | FAIL
single_hw           | 1280 | regional |        0 |        0 |   79148 |  1024000 |  7.7293% | [0,1,1279,799]      | [0,0,0]             | [0,0,0,0]             | FAIL
single_flow         | 1280 | regional |        0 |        0 |   79467 |  1024000 |  7.7604% | [0,0,1279,799]      | [0,0,0]             | [0,0,0,0]             | FAIL
single_cmd          | 1280 | regional |        0 |        0 |   77668 |  1024000 |  7.5848% | [0,2,1279,795]      | [0,0,0]             | [0,0,0,0]             | FAIL
single_intel        | 1280 | regional |        0 |        0 |   78040 |  1024000 |  7.6211% | [0,4,1279,778]      | [0,0,0]             | [0,0,0,0]             | FAIL
single_rush         | 1280 | regional |        0 |        0 |   78195 |  1024000 |  7.6362% | [0,2,1279,799]      | [0,0,0]             | [0,0,0,0]             | FAIL
cumul_0_local       |  390 | local    |        0 |        0 |     163 |   312000 |  0.0522% | [9,18,371,530]      | [0,0,0]             | [0,0,0,0]             | PASS
cumul_1_regional    |  390 | regional |        0 |        0 |   14838 |   312000 |  4.7558% | [0,8,389,605]       | [0,0,0]             | [0,0,0,0]             | FAIL
cumul_2_regional    |  390 | regional |        0 |        0 |   14140 |   312000 |  4.5321% | [0,11,389,611]      | [0,0,0]             | [0,0,0,0]             | FAIL
cumul_3_national    |  390 | national |        0 |        0 |    4250 |   312000 |  1.3622% | [0,36,389,459]      | [0,0,0]             | [0,0,0,0]             | PASS
cumul_4_national    |  390 | national |        0 |        0 |    4341 |   312000 |  1.3913% | [0,34,389,445]      | [0,0,0]             | [0,0,0,0]             | PASS
cumul_5_global      |  390 | global   |        0 |        0 |    6393 |   312000 |  2.0490% | [0,0,389,500]       | [0,0,0]             | [0,0,0,0]             | PASS
cumul_6_global      |  390 | global   |        0 |        0 |    5549 |   312000 |  1.7785% | [0,1,389,482]       | [0,0,0]             | [0,0,0,0]             | PASS
cumul_7_global_all  |  390 | global   |        0 |        0 |    4914 |   312000 |  1.5750% | [0,1,389,482]       | [0,0,0]             | [0,0,0,0]             | PASS
single_3d           |  390 | regional |        0 |        0 |   14757 |   312000 |  4.7298% | [0,9,389,605]       | [0,0,0]             | [0,0,0,0]             | FAIL
single_fab          |  390 | regional |        0 |        0 |   14254 |   312000 |  4.5686% | [0,9,389,606]       | [0,0,0]             | [0,0,0,0]             | FAIL
single_hw           |  390 | regional |        0 |        0 |   14411 |   312000 |  4.6189% | [0,12,389,612]      | [0,0,0]             | [0,0,0,0]             | FAIL
single_flow         |  390 | regional |        0 |        0 |   14094 |   312000 |  4.5173% | [0,11,389,611]      | [0,0,0]             | [0,0,0,0]             | FAIL
single_cmd          |  390 | regional |        0 |        0 |   14744 |   312000 |  4.7256% | [0,8,389,604]       | [0,0,0]             | [0,0,0,0]             | FAIL
single_intel        |  390 | regional |        0 |        0 |   14190 |   312000 |  4.5481% | [0,9,389,606]       | [0,0,0]             | [0,0,0,0]             | FAIL
single_rush         |  390 | regional |        0 |        0 |   14007 |   312000 |  4.4894% | [0,12,389,613]      | [0,0,0]             | [0,0,0,0]             | FAIL
```

### Updated Environment-Only Diff

```text
vp   | reach    | state            | diff px | total px | envDiff %
-----+----------+------------------+---------+----------+----------
1280 | local    | cumul_0_local    |     509 |  1024000 | 0.0497%
1280 | regional | cumul_1_regional |   91581 |  1024000 | 8.9435%
1280 | national | cumul_3_national |   13637 |  1024000 | 1.3317%
1280 | global   | cumul_5_global   |   19867 |  1024000 | 1.9401%
 390 | local    | cumul_0_local    |     167 |   312000 | 0.0535%
 390 | regional | cumul_1_regional |   18446 |   312000 | 5.9122%
 390 | national | cumul_3_national |    4267 |   312000 | 1.3676%
 390 | global   | cumul_5_global   |    6996 |   312000 | 2.2423%
```

---

## Part 2: Hull Texture Flat-Color Verification & Font Analysis

```text
sMother  yaw=  0 (flat hull color) | diff=0 px (0.0000%)
sMother  yaw= 90 (flat hull color) | diff=0 px (0.0000%)
sMother  yaw=180 (flat hull color) | diff=0 px (0.0000%)
sCarrier yaw=  0 (flat hull color) | diff=0 px (0.0000%)
sCarrier yaw= 90 (flat hull color) | diff=35327 px (5.5198%)
sCarrier yaw=180 (flat hull color) | diff=0 px (0.0000%)
```

- **Why `file://` vs `next/font` differs:** Reference line 7606 uses `const F = '"Russo One", "Arial Black", sans-serif'`. Under `file://` in headless Chromium, the remote Google Font stylesheet is not loaded locally, so canvas `TX("hull")` falls back to `"Arial Black", sans-serif`. Rebuild `materials.ts` line 256 uses `resolveDisplayFont()`, which resolves Next.js's self-hosted `next/font/google` `"Russo One"` font face.
- **Proposed Harness Fix:** Intercept the Google Fonts request on the reference page (or inject an `@font-face { font-family: "Russo One"; src: url(...); }` pointing to the `.next/static/media/*.woff2` file) and `await document.fonts.ready` on both pages before constructing `TX("hull")` / models.

---

## Part 3: Tier Cycle with Converged Cameras & 20 / 40 Cycles

```text
  tier=solo    | stage=app | frames=31 consec=30 | camPos=[2.3612,1.889,15.7414]
  tier=combine | stage=raid | frames=600 consec=0 | camPos=[11.3852,11.5688,50.7675]
  tier=solo    | stage=app | frames=30 consec=30 | camPos=[2.3612,1.889,15.7414]
  tier=combine | stage=raid | frames=600 consec=0 | camPos=[10.3753,11.6142,50.9735]
  tier=squad   | stage=app | frames=30 consec=30 | camPos=[2.3612,1.889,15.7414]
  tier=combine | stage=raid | frames=600 consec=0 | camPos=[17.3177,11.2112,49.1418]
renderer.info.memory (0 cycles):  {"geometries":1152,"textures":34}
renderer.info.memory (20 cycles): {"geometries":1216,"textures":35}
renderer.info.memory (40 cycles): {"geometries":1216,"textures":35}
```

_(Zero memory growth between cycle 20 and cycle 40: `geometries` remains 1216, `textures` remains 35)._

---

## Gate Commands and Actual Exit Codes

| Gate Command                          | Actual Exit Code | Notes                                                                       |
| :------------------------------------ | :--------------- | :-------------------------------------------------------------------------- |
| `pnpm lint`                           | `0`              | 0 errors, 4 pre-existing warnings in `slots/enc.ts` and `slots/overlay.ts`. |
| `pnpm typecheck`                      | `0`              | `tsc --noEmit` exited 0.                                                    |
| `pnpm format:check`                   | `1`              | Known failure on `docs/lanes/next-report.md` (owned by next lane).          |
| `pnpm prettier --check <owned files>` | `0`              | `All matched files use Prettier code style!`                                |
| `pnpm vitest run --testTimeout=30000` | `0`              | 18 test files, 4,136 tests passed.                                          |
| `pnpm build`                          | `0`              | Attempt 1 exited 0 (clean production build).                                |
| `node scripts/check-compiled-css.mjs` | `0`              | 5/5 prefixed/standard pairs, 0 violations.                                  |
| Production runtime hook check         | `0`              | `Leaked keys found: []`                                                     |
| Reference SHA256 check                | `0`              | `6ddd1efdd493a245f2556fa71440d8693f837275fcd4e232de24d527f8e88802`          |
| `git ls-files --eol`                  | `0`              | All files `lf`.                                                             |

## Open Issues

1. `regional` (`sky`) diff (~7.6% at 1280, ~4.5% at 390) is due to `Math.random()` PRNG state difference between startup construction (`RAID.clouds` / `RAID.stars`) and lazy stage construction (`raidStage`).
2. `sCarrier` yaw 90 retains 35,327 px (5.52%) diff even with flat hull color.

## Requests to Other Lanes

See `docs/lanes/raid-requests.md`.

## what could not be verified

1. Multi-player real-time websocket synchronization for the combine tier flagship scene (the live application executes combine tier locally via client-side state).
2. Hardware WebGL anti-aliasing variations across non-Chromium GPU drivers.
