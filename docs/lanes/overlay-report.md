Numbers that got worse than before: none (build stopped per rule L8 due to nonzero exit on first attempt).

# Lane `overlay` Report: Phase 7 2D Overlays & ENVB Integration

## 1. Commits and Changed Files

### Changed Files
- `src/engine/stages/slots/overlay.ts` (modified - wired `registerOverlay` to `StageManager`, `appStage`, `PatchManager`, `EnvbManager`, and `HudManager`)
- `src/engine/overlay/types.ts` (new file - shared overlay interfaces)
- `src/engine/overlay/patch.ts` (new file - `PT` offscreen hero portrait render pass, `drawPatch` badges, and runtime `#patch`/`#patch2` canvas updates)
- `src/engine/overlay/envb.ts` (new file - `ENVB` mission environment decorators for all 9 missions with `drifters` physics)
- `src/engine/overlay/callouts.ts` (new file - `STAGE_C` data structure, `toScreen` projection, and `drawCallouts`)
- `src/engine/overlay/hud.ts` (new file - `calls` chat queue, part `rings`, and big moments banner)
- `src/engine/overlay/index.ts` (new file - module exports)
- `tests/overlay-units.test.ts` (new file - unit tests for overlay systems, 0 per-frame allocations, and reduced-motion)
- `docs/lanes/overlay-requests.md` (new file - requests to integrator and other lanes)
- `docs/lanes/overlay-report.md` (new file - this report)

---

## 2. Gate Commands and Actual Exit Codes

| Gate Command | Actual Exit Code | Status / Diagnostic |
| :--- | :---: | :--- |
| `pnpm lint` | 0 | PASSED (0 errors, warnings only in slot placeholders) |
| `pnpm typecheck` | 0 | PASSED (`tsc --noEmit` exited 0) |
| `pnpm format:check` | 1 | FAILED on `docs/lanes/next-report.md` (owned by lane `next`; all lane `overlay` files pass prettier) |
| `pnpm test` | 1 / 0 | `pnpm test` (default 5s timeout) failed due to `tests/scroll.test.ts` (1,000 randomized layouts in Node VM taking ~5.06s). With `--testTimeout=60000`, all 17 test files and 4,132 tests passed (exit 0). `tests/overlay-units.test.ts` passed 5/5. |
| `pnpm build` | 1 | **STOPPED PER RULE L8**: `pnpm build` MUST exit 0 on its first attempt. Exited with code 1 during Next.js test typechecking (`tests/overlay-units.test.ts` Color constructor mock signature). Do not retry or rebuild. |
| `reference SHA256 check` | 0 | PASSED (`6ddd1efdd493a245f2556fa71440d8693f837275fcd4e232de24d527f8e88802`) |
| `git ls-files --eol` | 0 | PASSED (`i/lf w/lf attr/text=auto eol=lf`) |

---

## 3. Characterization Summary

### 1. Patch System Sources in `reference/Concepful_Mech_Builder.html`
- **`patchInit`**: Lines 7234–7245 (SHA256: `a7fd2c370436bce65e0bd23da201b567ddb653b84d382772cca525204163d5e9`)
  - Allocates offscreen `THREE.Scene`, `PerspectiveCamera(24, 1, 0.1, 400)`, `WebGLRenderTarget(256, 256)`, `Uint8Array(256*256*4)`, and offscreen 2D canvas `PT.c` (256x256).
- **`patchModel`**: Lines 7246–7273 (SHA256: `27c35e99e982edda49428e6d96abb0da86d1bbff82dc97fb745219b7b5b48bc2`)
  - Selects model based on `tier`: `H3[mission]` for solo, `U3[leader]` for squad, `S3[reach]` for combine. Computes camera target `PT.fc` and distance radius `PT.fr`.
- **`renderPatch`**: Lines 7274–7297 (SHA256: `74c1aea0bcb672590c186c928a44f8b2fb4f49a3ff74fcc8bb46fe6650b1ec19`)
  - Positions camera, renders scene to `PT.rt`, reads pixels into `PT.buf`, flips buffer vertically into `PT.img.data`, and copies to `PT.c`.
- **`hexP`**: Lines 7298–7313 (SHA256: `75d81f1104661a8d655ab65a0992a03710146a0365828916475310f6ec0a54d1`)
- **`drawPatch`**: Lines 7314–7360 (SHA256: `07fa8ba1ceb46b21468ecbdaeea6256fdb1ffa7d79b710b513d8720df5567847`)
  - Renders concentric rings, clipped circle with linear gradient and halftone pattern, accent highlight, `PT.c` portrait, arc texts ("CONCEPFUL", hero/crew/ship name), and stars.

### 2. Hero Portrait Render Pass (`PT`)
- **Lifecycle**: Offscreen 256x256 render target (`PT.rt`), Uint8Array buffer, and offscreen canvas `PT.c`.
- **Created**: Lines 7234–7245.
- **Rendered**: Lines 7274–7297.
- **Composited**: In `drawPatch` at lines 7344–7347 via `ctx.drawImage(PT.c, c - s / 2, c - s * 0.5, s, s)`.

### 3. Callouts (`#cv`) and `toScreen` Projections
- **`toScreen`**: Lines 14462–14468 (SHA256: `56d89310d425fad89059bfdd2db38ed9893d6515c4ca56abafb8cb62b7cb9df2`)
- **`drawCallouts`**: Lines 7016–7112 (SHA256: `cf62d0d2d12c71235d8022970c6260f2fdfd6c2ec8dcb52f7c0a79207ad5ebd1`)
- **`STAGE_C`**: Lines 6909–7004 (4 tiers x 4 callout points with 3D anchors, header tags, and descriptions).

### 4. Boxart Drawing
- **DOM Element**: `<div class="boxart" id="boxart">` (Line 1980).
- **Layout & Framing**: Lines 2733, 2751 (`br = $("boxart").getBoundingClientRect(); y1: br.height ? br.top + 10 : H - 20`).
- **CSS**: Lines 130, 137, 1266, 1480 (`.boxart`).

### 5. HUD
- **Chat & Rings**: Lines 6890–6908 (`calls`, `rings`).
- **HUD Rendering in `overlay()`**: Lines 7134–7230 (chat log, part rings, big moments `formT` ray burst, flash, and 3D-skewed word header).

### 6. ENVB Terrain Drifters
- **`drifters` Physics**: Lines 10955–10961 (SHA256: `c43a98547afa689ceaec9650b2aecc551700dcdeb14ce5ef733c300ae0377d2c`).
- **Mission Decorators**: Lines 11037–11391 (all 9 missions: `brand`, `web`, `uiux`, `decks`, `copy`, `motion`, `3d`, `fab`, `ai`).

### 7. Canvas Elements & Drawing Code Matrix
| Canvas ID | Type | DOM / Offscreen | Size / DPR | Drawing Code |
| :--- | :--- | :--- | :--- | :--- |
| `#gl` | WebGL | DOM (`<canvas id="gl">`) | W * DPR x H * DPR | `THREE.WebGLRenderer` (`R3.render(SC[scene], CAM)`) |
| `#cv` | 2D Canvas | DOM (`<canvas id="cv">`) | W * DPR x H * DPR | `createOverlay` (`ctx`): radial vignette, scene fade (`STORY.fadeT`), `drawCallouts`, HUD chat log (`calls`), rings, and big moments banner (`formT`) |
| `#patch` | 2D Canvas | DOM (`<canvas id="patch">` in `#card`) | 120 x 120 (DPR scaled) | `drawPatch($("patch"), t)`: badge border, concentric rings, stars, arc text, hero portrait `PT.c` |
| `#patch2` | 2D Canvas | DOM (`<canvas id="patch2">` in `#modal`) | 120 x 120 (DPR scaled) | `drawPatch($("patch2"), t)`: modal badge border, rings, stars, arc text, hero portrait `PT.c` |
| `PT.c` | 2D Canvas | Offscreen (`document.createElement("canvas")`) | 256 x 256 | `renderPatch(t)` reads pixels from WebGLRenderTarget `PT.rt` into `PT.buf`, puts to `PT.img` on `PT.x` |

### 8. Existing `src/engine/overlay.ts` Contents
- Lines: 1–97 (SHA256: `30e8a182167f5ae0609552ef64fb40c6667e5cfbf955247e4922bffc9f8a73af`).
- Implements radial vignette and 450ms scene transition fade with `FADE_ALPHA_TABLE` (256 cached strings).

---

## 4. Open Issues

1. **Build rule stop**: Per L8: "BUILD RULE: `pnpm build` MUST exit 0 on its first attempt. Any nonzero exit, including SecurityFatalError, means STOP and report. Do not retry or rebuild." `pnpm build` exited with code 1 due to Next.js running TypeScript over `tests/overlay-units.test.ts` where the `THREE.Color` subclass constructor mock signature had fewer arguments than expected by TS.
2. **Vitest timeout in `tests/scroll.test.ts`**: The 1,000-layout Node VM test takes ~5.06s under parallel execution, exceeding Vitest's default 5.0s per-test timeout unless `--testTimeout` is configured.

---

## 5. Requests to Other Lanes

See `docs/lanes/overlay-requests.md`:
1. In `vitest.config.ts`, increase `testTimeout: 30000`.
2. In `tsconfig.json`, add `"tests"` to `"exclude"` or align test mock type definitions for Next.js build.
3. In `docs/lanes/next-report.md`, format with Prettier to resolve `pnpm format:check`.

---

## what could not be verified

1. Live runtime browser element capture of `#patch` and `#patch2` across all 12 states on `localhost:3115` could not be executed because production server startup (`pnpm start`) requires a successful `pnpm build`, and the lane halted immediately upon first nonzero exit of `pnpm build` in strict compliance with Rule L8.
2. Full page visual sweep and canvas pixel noise floor diffs against reference page on port 3115 could not be captured for the same reason.
