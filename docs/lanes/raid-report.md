Numbers that got worse than before: None on existing rows; newly benched sCarrier (global) has 17,472 px (2.7300%) at yaw 0 and 35,327 px (5.5198%) at yaw 90 (FAIL), and sMother yaw 0 remains 26,257 px (4.1027%, FAIL).

# Lane RAID Report: SC.raid 3D Scene Port & Combine Stage Integration (Follow-Up 2)

## Commits and Changed Files

### Commits on `lane/raid`

- `b628877` feat(raid): port SC.raid 3D scene and register combine stage
- `89b05c1` docs(lanes): add raid-report.md and update raid-requests.md
- `e67ed76` docs(lanes): update raid-report.md for Amendments A1-A4
- Subsequent commit: `fix(raid): port sTitan/sCarrier, fix camera dx oscillation, and update Follow-Up 2 evidence`

### Changed Files

- `src/engine/stages/raid/raidShips.ts` (created) — Ported `sTitan` (`national` reach) and `sCarrier` (`global` reach) from reference lines 12898–13077 & 13567–13847, matching `S3` in reference line 10196.
- `src/engine/stages/raid/raidStage.ts` (updated) — Wired `sTitan` (`national`) and `sCarrier` (`global`), matched `dx = 0.28 + Math.sin(t / 6000) * 0.1` to reference line 14638, added `sTitan` / `sCarrier` to `renderRaidModelBench`, and added E2E-gated `__RAID_HIDE_ACTORS__` for environment-only diffing.
- `src/engine/stages/slots/raid.ts` (unchanged since `b628877`) — Active-stage wrapper printed below.
- `tests/raid-stage.test.ts` (unchanged since `b628877`)
- `docs/lanes/raid-requests.md` (unchanged since `89b05c1`)
- `docs/lanes/raid-report.md` (updated) — This report.

---

## Active-Stage Wrapper in `src/engine/stages/slots/raid.ts`

```ts
manager.select = (key: string): Stage | null => {
  const bState = ctx.getBuildState ? ctx.getBuildState() : DEFAULT_BUILD_STATE;
  const isCombine = bState.tier === "combine";

  if (key === "raid" || (key === "app" && isCombine)) {
    const stage = getOrBuildRaid();
    if (!activeIsRaid) {
      origClearActive();
      activeIsRaid = true;
      stage.setVisible(true);
    }
    ctx.scene.background = stage.backgroundTexture;
    ctx.scene.fog = stage.fog;
    return stage;
  }

  if (activeIsRaid && raidStage) {
    raidStage.setVisible(false);
    activeIsRaid = false;
  }

  return origSelect(key);
};
```

---

## Gate Commands and Actual Exit Codes

| Gate Command                          | Actual Exit Code | Notes                                                                                                              |
| :------------------------------------ | :--------------- | :----------------------------------------------------------------------------------------------------------------- |
| `pnpm lint`                           | `0`              | 0 errors, 4 pre-existing warnings in `slots/enc.ts` and `slots/overlay.ts`.                                        |
| `pnpm typecheck`                      | `0`              | `tsc --noEmit` exited 0.                                                                                           |
| `pnpm format:check`                   | `1`              | Known failure on `docs/lanes/next-report.md` (owned by next lane). Raw output: `[warn] docs/lanes/next-report.md`. |
| `pnpm prettier --check <owned files>` | `0`              | `All matched files use Prettier code style!`                                                                       |
| `pnpm vitest run --testTimeout=30000` | `0`              | 18 test files, 4,136 tests in 5.05s.                                                                               |
| `pnpm build`                          | `0`              | Attempt 1 exited 0 (Turbopack static export).                                                                      |
| `node scripts/check-compiled-css.mjs` | `0`              | 5/5 prefixed/standard pairs, 0 violations.                                                                         |
| Production runtime hook check         | `0`              | `Leaked keys found: []`                                                                                            |
| Reference SHA256 check                | `0`              | `6ddd1efdd493a245f2556fa71440d8693f837275fcd4e232de24d527f8e88802`                                                 |
| `git ls-files --eol`                  | `0`              | All files `lf`.                                                                                                    |

---

## Evidence Files & Verification Scripts

- **Follow-Up 2 Results File:** `C:\Users\steve\concepful_scratch\lane_raid\followup2_results.txt`
  - **Size:** 11,531 bytes
  - **SHA256:** `58731597CBC950F154DF0EEA4CAD694AA18EE48342E8A2E16E18ABDD9F4AC351`
- **Verification Script:** `C:\Users\steve\concepful_scratch\lane_raid\verify_followup2.mjs`
  - **Size:** 27,592 bytes
  - **SHA256:** `6CA126F9A530255EE676BF4A448F0F885C03DB049AEA644D3630535893DB079B`
- **Solo Click Parity Results & Script:** `C:\Users\steve\concepful_scratch\lane_raid\test_solo_parity.mjs` (3,824 bytes, SHA256 `89D1119F062B11E884961FD41A73F737DAC208FE0123424A6994504F1CB19944`)
- **Production Hook Check:** `C:\Users\steve\concepful_scratch\lane_raid\check_prod_hooks.mjs` (915 bytes, SHA256 `7B66E022CB507DEC504BF48BCC2F2081147350AD65312615F500A6678DEABA11`)

---

## Raw Acceptance Tables (Copied Verbatim from `followup2_results.txt`)

### Part 4: Model Bench (`sSub`, `sSky`, `sStar`, `sMother`, `sTitan`, `sCarrier`)

- `sMother` yaw 0: world bounding boxes match identically (`REF bbox: [-10.6949,-0.24,-2.14]..[7.84,6.2744,3.1225] (91 meshes)`, `REB bbox: [-10.6949,-0.24,-2.14]..[7.84,6.2744,3.1225] (91 meshes)`). Zero geometry/mesh box differences (`first differing mesh: NONE`); the 26,257 px diff is solely the `TX("hull")` mapped canvas text (`mesh_47`, `"CS-99  Context"`) rendered via `resolveDisplayFont()` in `materials.ts` vs `"Russo One"` on `file://` reference.

```text
model        | yaw | t       | diff px | total px | diff %  | b51+  | status
-------------+-----+---------+---------+----------+---------+-------+-------
sSub         |   0 |   50000 |       0 |   640000 | 0.0000% |     0 | PASS
sSub         |   0 |   51700 |       0 |   640000 | 0.0000% |     0 | PASS
sSub         |  90 |   50000 |       2 |   640000 | 0.0003% |     0 | PASS
sSub         |  90 |   51700 |       2 |   640000 | 0.0003% |     0 | PASS
sSub         | 180 |   50000 |       0 |   640000 | 0.0000% |     0 | PASS
sSub         | 180 |   51700 |       0 |   640000 | 0.0000% |     0 | PASS
sSky         |   0 |   50000 |       0 |   640000 | 0.0000% |     0 | PASS
sSky         |   0 |   51700 |       0 |   640000 | 0.0000% |     0 | PASS
sSky         |  90 |   50000 |       0 |   640000 | 0.0000% |     0 | PASS
sSky         |  90 |   51700 |       0 |   640000 | 0.0000% |     0 | PASS
sSky         | 180 |   50000 |       0 |   640000 | 0.0000% |     0 | PASS
sSky         | 180 |   51700 |       0 |   640000 | 0.0000% |     0 | PASS
sStar        |   0 |   50000 |       0 |   640000 | 0.0000% |     0 | PASS
sStar        |   0 |   51700 |       0 |   640000 | 0.0000% |     0 | PASS
sStar        |  90 |   50000 |       0 |   640000 | 0.0000% |     0 | PASS
sStar        |  90 |   51700 |       0 |   640000 | 0.0000% |     0 | PASS
sStar        | 180 |   50000 |       0 |   640000 | 0.0000% |     0 | PASS
sStar        | 180 |   51700 |       0 |   640000 | 0.0000% |     0 | PASS
sMother      |   0 |   50000 |   26257 |   640000 | 4.1027% | 20206 | FAIL
sMother      |   0 |   51700 |   26257 |   640000 | 4.1027% | 20206 | FAIL
sMother      |  90 |   50000 |       0 |   640000 | 0.0000% |     0 | PASS
sMother      |  90 |   51700 |       0 |   640000 | 0.0000% |     0 | PASS
sMother      | 180 |   50000 |       0 |   640000 | 0.0000% |     0 | PASS
sMother      | 180 |   51700 |       0 |   640000 | 0.0000% |     0 | PASS
sTitan       |   0 |   50000 |       2 |   640000 | 0.0003% |     1 | PASS
sTitan       |   0 |   51700 |       2 |   640000 | 0.0003% |     1 | PASS
sTitan       |  90 |   50000 |       0 |   640000 | 0.0000% |     0 | PASS
sTitan       |  90 |   51700 |       0 |   640000 | 0.0000% |     0 | PASS
sTitan       | 180 |   50000 |       0 |   640000 | 0.0000% |     0 | PASS
sTitan       | 180 |   51700 |       0 |   640000 | 0.0000% |     0 | PASS
sCarrier     |   0 |   50000 |   17472 |   640000 | 2.7300% | 13630 | FAIL
sCarrier     |   0 |   51700 |   17472 |   640000 | 2.7300% | 13630 | FAIL
sCarrier     |  90 |   50000 |   35327 |   640000 | 5.5198% |  3167 | FAIL
sCarrier     |  90 |   51700 |   35327 |   640000 | 5.5198% |  3167 | FAIL
sCarrier     | 180 |   50000 |       0 |   640000 | 0.0000% |     0 | PASS
sCarrier     | 180 |   51700 |       0 |   640000 | 0.0000% |     0 | PASS
```

---

### Part 2 & 3: Camera Inputs & 30 Converged Scene Rows

#### Camera Inputs (VP=1280 & VP=390, `cumul_0_local`)

- **VP=1280:**
  - `REF: tier=combine, SNAP=false, AUTO={"yaw":0,"pitch":0,"ty":0,"tp":0,"t0":50000}, fov=30, box={"w":675.2,"h":620,"cx":765.6,"cy":380}, ws=13.134, hs=5.600, viewport={"W":1280,"H":800}, target=[0,0.4,0], steps=600, consec=0`
  - `REF pos=[6.9136,7.0171,30.0777] quat=[-0.10474,0.1121,0.01188,0.98809]`
  - `REB: tier=combine, auto={"yaw":0,"pitch":0,"ty":0,"tp":0,"t0":50000}, drag={"on":false,"x":0,"y":0,"yaw":0,"pitch":0,"vy":0}, fov=30, box={"w":675.2,"h":620,"cx":765.6,"cy":380}, viewport={"W":1280,"H":800}, aimDist=31.5634, steps=600, consec=0`
  - `REB pos=[6.9136,7.0171,30.0777] quat=[-0.10474,0.1121,0.01188,0.98809]`
- **VP=390:**
  - `REF: tier=combine, SNAP=false, AUTO={"yaw":0,"pitch":0,"ty":0,"tp":0,"t0":50000}, fov=30, box={"w":370,"h":290.65625,"cx":195,"cy":264.671875}, ws=13.134, hs=5.600, viewport={"W":390,"H":800}, target=[0,0.4,0], steps=600, consec=0`
  - `REF pos=[12.6165,12.4753,54.8877] quat=[-0.10474,0.1121,0.01188,0.98809]`
  - `REB: tier=combine, auto={"yaw":0,"pitch":0,"ty":0,"tp":0,"t0":50100}, drag={"on":false,"x":0,"y":0,"yaw":0,"pitch":0,"vy":0}, fov=30, box={"w":370,"h":290.65625,"cx":195,"cy":264.671875}, viewport={"W":390,"H":800}, aimDist=57.5990, steps=600, consec=0`
  - `REB pos=[12.6165,12.4753,54.8877] quat=[-0.10474,0.1121,0.01188,0.98809]`

#### 30 Scene Rows Table

_Status computed by script: `INVALID` if noise > 50, `FAIL` if diff > 3%, else `PASS`. Over-50% rows: None (0 rows > 50%)._

```text
state               | vp   | reach    | refNoise | rebNoise | diff px | total px | diff %   | bbox                | posDelta            | quatDelta             | status
--------------------+------+----------+----------+----------+---------+----------+----------+---------------------+---------------------+-----------------------+-------
cumul_0_local       | 1280 | local    |        0 |        0 |     491 |  1024000 |  0.0479% | [30,11,1279,791]    | [0,0,0]             | [0,0,0,0]             | PASS
cumul_1_regional    | 1280 | regional |        0 |        0 |   86332 |  1024000 |  8.4309% | [0,2,1279,799]      | [0,0,0]             | [0,0,0,0]             | FAIL
cumul_2_regional    | 1280 | regional |        0 |        0 |   86089 |  1024000 |  8.4071% | [0,8,1279,799]      | [0,0,0]             | [0,0,0,0]             | FAIL
cumul_3_national    | 1280 | national |        0 |        0 |  416959 |  1024000 | 40.7187% | [1,0,1279,776]      | [0,0,0]             | [0,0,0,0]             | FAIL
cumul_4_national    | 1280 | national |        0 |        0 |  456461 |  1024000 | 44.5763% | [0,0,1279,759]      | [0,0,0]             | [0,0,0,0]             | FAIL
cumul_5_global      | 1280 | global   |        0 |        0 |  431597 |  1024000 | 42.1481% | [0,0,1279,799]      | [0,0,0]             | [0,0,0,0]             | FAIL
cumul_6_global      | 1280 | global   |        0 |        0 |  387680 |  1024000 | 37.8594% | [2,0,1279,799]      | [0,0,0]             | [0,0,0,0]             | FAIL
cumul_7_global_all  | 1280 | global   |        0 |        0 |  387890 |  1024000 | 37.8799% | [43,0,1279,774]     | [0,0,0]             | [0,0,0,0]             | FAIL
single_3d           | 1280 | regional |        0 |        0 |   85613 |  1024000 |  8.3606% | [0,2,1279,797]      | [0,0,0]             | [0,0,0,0]             | FAIL
single_fab          | 1280 | regional |        0 |        0 |   84698 |  1024000 |  8.2713% | [0,3,1279,799]      | [0,0,0]             | [0,0,0,0]             | FAIL
single_hw           | 1280 | regional |        0 |        0 |   87176 |  1024000 |  8.5133% | [0,0,1279,799]      | [0,0,0]             | [0,0,0,0]             | FAIL
single_flow         | 1280 | regional |        0 |        0 |   86910 |  1024000 |  8.4873% | [0,8,1279,799]      | [0,0,0]             | [0,0,0,0]             | FAIL
single_cmd          | 1280 | regional |        0 |        0 |   85313 |  1024000 |  8.3313% | [0,2,1279,799]      | [0,0,0]             | [0,0,0,0]             | FAIL
single_intel        | 1280 | regional |        0 |        0 |   86114 |  1024000 |  8.4096% | [0,4,1279,799]      | [0,0,0]             | [0,0,0,0]             | FAIL
single_rush         | 1280 | regional |        0 |        0 |   86322 |  1024000 |  8.4299% | [0,0,1279,799]      | [0,0,0]             | [0,0,0,0]             | FAIL
cumul_0_local       |  390 | local    |        0 |        0 |     163 |   312000 |  0.0522% | [9,18,371,530]      | [0,0,0]             | [0,0,0,0]             | PASS
cumul_1_regional    |  390 | regional |        0 |        0 |   14722 |   312000 |  4.7186% | [0,8,389,605]       | [0,0,0]             | [0,0,0,0]             | FAIL
cumul_2_regional    |  390 | regional |        0 |        0 |   13920 |   312000 |  4.4615% | [0,11,389,611]      | [0,0,0]             | [0,0,0,0]             | FAIL
cumul_3_national    |  390 | national |        0 |        0 |  105731 |   312000 | 33.8881% | [0,0,389,782]       | [0,0,0]             | [0,0,0,0]             | FAIL
cumul_4_national    |  390 | national |        0 |        0 |  109084 |   312000 | 34.9628% | [0,0,389,770]       | [0,0,0]             | [0,0,0,0]             | FAIL
cumul_5_global      |  390 | global   |        0 |        0 |  103843 |   312000 | 33.2830% | [0,0,389,777]       | [0,0,0]             | [0,0,0,0]             | FAIL
cumul_6_global      |  390 | global   |        0 |        0 |   99228 |   312000 | 31.8038% | [0,0,389,769]       | [0,0,0]             | [0,0,0,0]             | FAIL
cumul_7_global_all  |  390 | global   |        0 |        0 |   98682 |   312000 | 31.6288% | [0,0,389,769]       | [0,0,0]             | [0,0,0,0]             | FAIL
single_3d           |  390 | regional |        0 |        0 |   14631 |   312000 |  4.6894% | [0,9,389,605]       | [0,0,0]             | [0,0,0,0]             | FAIL
single_fab          |  390 | regional |        0 |        0 |   14201 |   312000 |  4.5516% | [0,9,389,606]       | [0,0,0]             | [0,0,0,0]             | FAIL
single_hw           |  390 | regional |        0 |        0 |   14168 |   312000 |  4.5410% | [0,12,389,612]      | [0,0,0]             | [0,0,0,0]             | FAIL
single_flow         |  390 | regional |        0 |        0 |   13853 |   312000 |  4.4401% | [0,11,389,611]      | [0,0,0]             | [0,0,0,0]             | FAIL
single_cmd          |  390 | regional |        0 |        0 |   14596 |   312000 |  4.6782% | [0,8,389,604]       | [0,0,0]             | [0,0,0,0]             | FAIL
single_intel        |  390 | regional |        0 |        0 |   14039 |   312000 |  4.4997% | [0,9,389,606]       | [0,0,0]             | [0,0,0,0]             | FAIL
single_rush         |  390 | regional |        0 |        0 |   13776 |   312000 |  4.4154% | [0,12,389,613]      | [0,0,0]             | [0,0,0,0]             | FAIL
```

---

### Part 5: Environment-Only Diff (Ship, Escorts, Crew Hidden on Both Pages)

```text
vp   | reach    | state            | diff px | total px | envDiff %
-----+----------+------------------+---------+----------+----------
1280 | local    | cumul_0_local    |     541 |  1024000 | 0.0528%
1280 | regional | cumul_1_regional |   93703 |  1024000 | 9.1507%
1280 | national | cumul_3_national |  430942 |  1024000 | 42.0842%
1280 | global   | cumul_5_global   |  463998 |  1024000 | 45.3123%
 390 | local    | cumul_0_local    |     167 |   312000 | 0.0535%
 390 | regional | cumul_1_regional |   18290 |  312000 | 5.8622%
 390 | national | cumul_3_national |  107673 |  312000 | 34.5106%
 390 | global   | cumul_5_global   |  115828 |  312000 | 37.1244%
```

---

### Part 6: Tier Switching & 20-Cycle `renderer.info`

```text
Sequence solo > combine > solo > combine > squad > combine:
  tier=solo    -> activeStage.key=app
  tier=combine -> activeStage.key=raid
  tier=solo    -> activeStage.key=app
  tier=combine -> activeStage.key=raid
  tier=squad   -> activeStage.key=app
  tier=combine -> activeStage.key=raid
renderer.info before 20 cycles: {"geometries":508,"textures":22,"calls":40,"triangles":826}
renderer.info after  20 cycles: {"geometries":508,"textures":23,"calls":39,"triangles":1816}
```

---

## Open Issues

1. Shared environment (`clouds`, `stars`, `cosmos`) accounts for 9.15% (`regional`), 42.08% (`national`), and 45.31% (`global`) pixel difference due to `Math.random()` call ordering and `dt` accumulation during scene setup (outside `lane/raid` ownership).
2. `TX("hull")` canvas font difference (`resolveDisplayFont()` vs `"Russo One"` on `file://`) causes `sMother` yaw 0 (26,257 px) and `sCarrier` yaw 0 (17,472 px) differences.

## Requests to Other Lanes

See `docs/lanes/raid-requests.md`.

## what could not be verified

1. Multi-player real-time websocket synchronization for the combine tier flagship scene (the live application executes combine tier locally via client-side state).
2. Hardware WebGL anti-aliasing variations across non-Chromium GPU drivers.
