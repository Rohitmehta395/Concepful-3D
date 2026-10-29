# Conceptful redevelopment: initial analysis and plan

**Note:** this analysis is static. The source was read but not rendered in a browser, so nothing below describes how the site looks in motion. Capturing reference screenshots is the first job of Part 1.2.

**Important:** the file does not match the brief in several ways (see 1.5). Confirm the file is the source of truth before building on it.

---

## Deliverable 1: Existing implementation analysis

### 1.1 What the file is (verified)

| Item           | Finding                                                                                                                                      |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Size and shape | 451,903 bytes, 15,145 lines. One `<style>` block of about 1,750 lines, one inline `<script>` of about 12,850 lines, and one external script. |
| Dependencies   | Only **Three.js r128** from cdnjs and Google Fonts (Inter, JetBrains Mono, Russo One). No GSAP, Motion, React or build step.                 |
| Title          | "Concepful Mech Builder (Copy)". The brief spells it "Conceptful".                                                                           |
| Nature         | Not a brochure site. It is a **scroll-driven story plus a pricing configurator**, framed as an MMO character-select screen.                  |

### 1.2 Structure (verified)

- **Two fixed full-screen canvases:**
  - `#gl` is a WebGL canvas, a low-poly, toon-shaded, ink-outlined 3D world.
  - `#cv` is a 2D canvas overlay for callouts, HUD, flames and "stickers".
- **Fixed header:** logo SVG and wordmark, nav (Classes, How it works, Plans, Start your build), a 3-way tier switch, a running price and a Start button.
- **Fixed panels:**
  - A left "Loadout" panel with five steps: Game mode, Mission, Flagship, Raid buffs, Loadout.
  - A right "Character sheet" card with a generated patch and stats.
  - A "boxart" title block.
- **Story sections** in `<main>`:
  - `s-intro` (hero)
  - `s-classes`
  - `s-logi` (a horizontal, sticky "mission log")
  - `s-rules`
  - `s-stages` (Plans)
  - `s-outro`
  - `#build` (the app section)
- **Footer** with an inline base64 PNG, plus a **modal dialog** ("Create your guild") with a form, which ends in a "Patch unlocked" state.

### 1.3 Visual systems (verified)

- **8 hero mechs** (dolphin, manta, owl, hawk, jellyfish, dragonfly, turtle, beetle).
- **About 19 department "units"** (Lancer, Kraken, Marshal, Stamp, Arachne, Ronin, Architect, Herald, Quill, Fresco, Forge, Dolly, Prism, Gantry, Goliath, Nexus, Hub, Watch, Cortex).
- **Drone and jet** vehicles.
- **Three flagship ships:** a submarine, a sky cruiser and a star carrier.
- **Three backgrounds:** `bgSpace`, `bgSea`, `bgSky`.
- **Three scenes:** solo, party and raid.
- **Procedural textures:** about 120 canvas-drawn textures through `texC`/`TX`.
- **Halftone and die-cut sticker effects** for the merch feel.
- **Procedural 2D vector art** (`u*`, `h*`, `draw*` functions) written directly on a 2D context.

### 1.4 Design tokens (verified, recoverable)

- **UI tokens** (`:root`):
  - Backgrounds and text: `--bg #4f5a68`, `--fg #f2efe8`, `--muted #a7a9b2`, `--dim #6b6e7a`, `--bone #ece6d6`.
  - Accents: `--red #e2404f`, `--str #6e8fcc`, `--pro #f2b33a`, `--ops #55c2b8`, `--ok #4cc58a`.
  - Glass surfaces: `--glass rgba(16,18,24,.82)`, `--glass2 rgba(30,33,42,.88)`.
- **Brand and scene colors:**
  - Ink/navy `#141624`
  - Brand red-magenta `#EE004E` (logo and scene)
  - Gunmetal `#3e4270`
  - Holo `#b8c2ff`
  - Periwinkle `#8c93e6`
  - Glass `#2a3060`
  - Bone `#ECE6D6`
- **Fonts:** Russo One (display), Inter (body), JetBrains Mono (mono).
- **Breakpoints:** only 900px and 1023px.
- **Inconsistency:** two reds coexist (`#e2404f` in UI, `#EE004E` in the logo and scene).

### 1.5 Mismatches with the brief

| Brief says                                        | Source shows                                                                                                                                            |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Purple, navy and deep-blue palette with neon pink | Slate-grey sky (`#4f5a68`), bone armor, navy ink, and a single hot-red/magenta accent. Some purple-blue (`#8c93e6`, `#3e4270`) exists inside the scene. |
| Futuristic aircraft carrier in a space setting    | Carriers/flagships exist, but across **three environments** (sea, sky, space). The brand voice is late-90s cel-shaded mecha MMO launcher.               |
| Animated floating objects                         | Verified, but they are procedural 3D meshes rather than assets.                                                                                         |
| A hero with a headline and CTAs                   | Verified (`Your creative department, on demand.`). It is only one of several scenes.                                                                    |

### 1.6 Animation and scroll (verified)

- There is **one `requestAnimationFrame` loop that runs continuously** and calls `paint()`.
- Each frame, `storyScan()` runs and reads `getBoundingClientRect` on sections to decide which scene is active. There is no ScrollTrigger and no scroll listener in normal mode.
- Layout values are eased toward targets (`easeBox`), which gives the "scene morphs as you scroll" effect.
- Reduced motion (`prefers-reduced-motion`) is handled: the loop does not start, and the page repaints on scroll instead.

### 1.7 Issues found

**Performance (verified or strongly implied)**

- A full-screen WebGL render plus a full-screen 2D canvas redraw on every frame, forever.
- No pause on `visibilitychange`, and no off-screen or low-power mode.
- Layout reads in the loop (`getBoundingClientRect`) risk layout thrash.
- 46 `Math.random` calls. Not checked whether they run per frame.
- 450 KB of inline script, a render-blocking Google Fonts `<link>`, and a base64 image in the footer.
- Three.js r128 from a CDN, which is old.

**Accessibility**

- Only 18 `aria-*` attributes.
- A real `role="dialog" aria-modal`, but a focus trap could not be verified.
- Focus-visible outlines are defined.
- The canvases are `aria-hidden` or labelled. The real text content is in the DOM, which is good for SEO and screen readers.
- Colors need a contrast audit, especially `--dim` on glass.

**SEO and production**

- No `lang`, no meta description, no Open Graph, no canonical. The `<title>` is misplaced inside `<body>`.
- The form is a prototype. The copy says "prices illustrative, nothing is sent".
- Stripe and "Context(TM) workspace" appear only in copy. There is no integration.

**Code**

- One global-scope script with `innerHTML` templating (9 uses) and no module boundaries.

### 1.8 Reuse, refactor, rebuild

| Verdict                   | What                                                                                                                                                                                          |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Reuse nearly as-is**    | The data tables (`TIERS`, `QUESTS`, `GEAR`, `OBJECTIVES`, `BUFFS`, `CLASSES`, `TEAMOF`, `ROLE`) and the pricing logic (`quote()`), converted to typed TS. All copy. The logo SVG. All tokens. |
| **Refactor into modules** | The 3D mesh builders (`m*`, `u*`, `s*`), texture factories, materials and `bg*` backgrounds. These are already close to self-contained functions.                                             |
| **Rebuild**               | The DOM and UI (as React with a pure reducer), the render loop (visibility-aware, scoped, cleaned up), and scene-state/scroll plumbing.                                                       |
| **Audit before touching** | The 2D `u*`/`h*` functions. 3D versions with the same names also exist, so the 2D set may be legacy or dead. **Unknown until traced.**                                                        |

### 1.9 What cannot be determined

- Actual visual output and frame rate.
- Which code paths are dead.
- Whether the story/scene mapping behaves identically at every viewport.
- Original design files or exported art. All art is procedural, so there are no external image assets to license.

---

## Deliverable 2: Requirements and scope

**Assumptions** (flag any you disagree with):

1. The supplied file is the source of truth, not the brief's palette description.
2. The brand is spelled **Concepful**, as in the file's title, footer and logo. Confirm, since the brief says "Conceptful".
3. The configurator is **in scope** (it is the core experience), but remains a client-side prototype.
4. Pricing stays illustrative, as the original states.

**Functional**

- Fixed header with working anchor navigation, tier switch, live price, and a Start CTA that opens the modal.
- Scroll-driven story across 6 sections with scene transitions.
- Configurator: tier, mission, flagship, buffs, monthly/annual toggle, itemized total, and character card.
- Modal form that validates and shows the "patch unlocked" result. **No data is sent.**

**Visual**

- Preserve the toon/ink/bone/red identity, the three scenes, and all mech and unit designs.
- Fix token inconsistencies. Improve contrast, spacing and responsive composition without redesign.

**Non-functional**

- Strict TypeScript, WCAG 2.2 AA target for DOM UI, `prefers-reduced-motion` respected, pause when the tab is hidden, graceful non-WebGL fallback, Lighthouse performance target to be set after the baseline, and no layout shift from fonts.

**Out of scope**

- Payments (Stripe), CRM, real form submission, analytics, auth, a CMS, and any new characters or art.

**Open questions (non-blocking):** the mismatch in 1.5, the brand spelling, whether Three.js r128 parity is required or an upgrade is welcome, and whether a non-WebGL fallback should be a static illustration.

---

## Deliverable 3: Technology decisions

| Decision          | Choice                                                                                                                        | Why / alternatives / when                                                                                                                                                                                                                                                                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework         | Next.js App Router, React, TS `strict`                                                                                        | Requested. Server Components for the copy-heavy sections (SEO), with client islands for the scene and configurator.                                                                                                                                                                                                                                           |
| Package manager   | **pnpm**                                                                                                                      | Fast, strict dependency resolution. Alternative npm. Needed immediately.                                                                                                                                                                                                                                                                                      |
| Styling           | Tailwind plus CSS variables for tokens, with plain CSS modules for the HUD/glass and complex effects                          | The source is hand-written CSS with custom components. Tailwind alone would be noisy. Immediate.                                                                                                                                                                                                                                                              |
| 3D                | **Imperative Three.js module, not React Three Fiber**                                                                         | The world is one tightly coupled, procedural scene with one render loop and scripted camera/layout. R3F would add reconciler overhead and fight the data flow. Start by **pinning three@0.128.0** (with matching `@types/three`) for visual parity. Upgrading is a separate, later part because of color-management and API changes (e.g. `LuminanceFormat`). |
| 2D overlay        | Keep it as a canvas                                                                                                           | It is procedural art, not DOM. Immediate.                                                                                                                                                                                                                                                                                                                     |
| Animation library | **None initially** (no GSAP, no Motion)                                                                                       | Scroll logic is custom and canvas-driven, and DOM transitions are simple CSS. Revisit only if the horizontal "mission log" needs something CSS sticky cannot do.                                                                                                                                                                                              |
| State             | `useReducer` plus pure `quote()`, with a tiny store the scene reads from a ref                                                | Zustand is unnecessary. Immediate.                                                                                                                                                                                                                                                                                                                            |
| shadcn/ui         | **Skip**                                                                                                                      | The UI is bespoke glass/HUD. Revisit only for dialog or focus-trap primitives, where a small headless library (Radix Dialog) is the likelier fit.                                                                                                                                                                                                             |
| Icons             | None needed yet                                                                                                               | The source uses no icon library.                                                                                                                                                                                                                                                                                                                              |
| Forms             | Controlled inputs, then **Zod** only if the schema grows                                                                      | Defer.                                                                                                                                                                                                                                                                                                                                                        |
| Fonts             | `next/font` for Inter, JetBrains Mono and Russo One                                                                           | Removes the render-blocking link and the layout shift. Immediate.                                                                                                                                                                                                                                                                                             |
| Testing           | **Vitest** for data and pricing, **Playwright** for e2e and reference screenshots                                             | Immediate for Vitest. Playwright from Phase 3.                                                                                                                                                                                                                                                                                                                |
| Lint and format   | ESLint (Next config) plus Prettier                                                                                            | Immediate.                                                                                                                                                                                                                                                                                                                                                    |
| Deployment        | **Vercel**                                                                                                                    | Zero-config for Next.js, with preview deploys. Deferred to Phase 10.                                                                                                                                                                                                                                                                                          |
| Versions          | Latest stable at implementation, **verified by Antigravity and reported**. No versions are stated that have not been checked. |                                                                                                                                                                                                                                                                                                                                                               |

---

## Deliverable 4: Proposed architecture

```
/reference/                  original HTML (read-only) + baseline screenshots
/src/app/                    layout.tsx (fonts, metadata), page.tsx (server)
/src/content/                typed data: tiers, quests, gear, objectives, buffs, classes, copy
/src/domain/                 pure logic: quote(), config reducer, selectors  (unit-tested)
/src/components/
  shell/                     Header, Footer, SkipLink            (server where possible)
  story/                     Section components, Beats           (server)
  configurator/              Panel, Tiers, Groups, Loadout       (client)
  card/                      CharacterCard, Patch                (client)
  modal/                     GuildModal (focus trap, form)       (client)
  scene/SceneHost.tsx        the single client component that mounts the engine
/src/scene/                  framework-agnostic engine
  engine.ts                  renderer, camera, rAF loop, resize, dispose, visibility pause
  state.ts                   read-only view of config + scroll story state
  scroll.ts                  storyScan equivalent (IntersectionObserver / cached rects)
  backgrounds/  ships/  heroes/  units/  vehicles/
  materials/  textures/  overlay2d/
/src/styles/                 tokens.css, globals.css, glass.css
/src/lib/                    utils, feature detection (webgl, reduced motion)
/tests/ e2e/                 Vitest and Playwright
/docs/                       see Deliverable 8
```

**Principles:**

- **Rendering.** Static copy is rendered on the server. The scene and configurator are client islands loaded with `dynamic(..., { ssr:false })`.
- **Engine boundary.** The engine takes a canvas and a state subscription, and returns `dispose()`. React never reconciles scene objects. All geometry, material and texture disposal lives in the engine.
- **Loop.** One rAF loop. It pauses on `visibilitychange`, scales DPR down under load, and honors reduced motion (a single repaint on scroll).
- **Scroll.** Replace per-frame `getBoundingClientRect` with cached section offsets, refreshed on resize and font load.
- **Assets.** There are none beyond the SVG logo, so there are no licensing concerns. Textures stay procedural.
- **Responsive.** Scene layout targets come from breakpoint-aware functions. On phones the scene fills the top half and the loadout becomes a bottom sheet, as in the original.
- **Future integrations.** The modal submit goes through one `submitLead()` adapter. It is a no-op now, so a CRM or Stripe can be added later with no refactor.

---

## Deliverable 5: Phased roadmap

| #   | Phase                               | Depends on | Exit criteria                                                                                                       | Complexity |
| --- | ----------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------- | ---------- |
| 1   | Foundation and baseline             | none       | App builds, lint and type-check pass, reference screenshots captured, tokens extracted                              | Low        |
| 2   | Content and domain extraction       | 1          | Typed data and `quote()` match the original on a table of test cases                                                | Medium     |
| 3   | Static page shell                   | 1, 2       | All sections, header, footer and modal render semantically with no scene, responsive                                | Medium     |
| 4   | Scene engine core                   | 1, 3       | Canvas mounts and disposes cleanly. Camera, resize, loop, visibility pause and scroll driver run. Backgrounds work. | High       |
| 5   | 3D content (ships, heroes, units)   | 4          | Every model visually matches the reference                                                                          | Very High  |
| 6   | Configurator and interaction wiring | 2, 3, 4    | Tier, mission and buffs drive price, card and scene                                                                 | High       |
| 7   | 2D overlay, callouts, patch         | 4, 6       | HUD callouts and patch art match the reference                                                                      | High       |
| 8   | Responsive and accessibility pass   | 3 to 7     | Verified at 4 viewports. Keyboard and focus work. WCAG contrast met.                                                | Medium     |
| 9   | Performance                         | 5 to 8     | Frame-time and bundle budgets met, with a fallback for no WebGL                                                     | High       |
| 10  | SEO, QA and deployment              | all        | Metadata, e2e suite, docs, preview deploy                                                                           | Medium     |

---

## Deliverable 6: Phase and part breakdown

Each part lists its objective, with acceptance and verification (**AC/V**). Every part also needs lint, type-check and build green, a clean console, and a completion report.

### Phase 1: Foundation and baseline

- **1.1** Scaffold the Next.js app with pnpm, TS strict, Tailwind, ESLint and Prettier, a folder skeleton, and the original placed in `/reference`. _AC/V: `pnpm dev` serves a placeholder, lint and build pass._ **(prompt in Deliverable 9)**
- **1.2** Reference baseline: Playwright script that screenshots the original HTML at 390, 768, 1280 and 1920 widths at each section, and notes the frame cost. _AC/V: images committed to `/reference/baseline`._
- **1.3** Design tokens in `tokens.css` and Tailwind theme, with the two-red inconsistency resolved and documented. _AC/V: every token traces to a source line._
- **1.4** Fonts via `next/font`. _AC/V: no layout shift, no network CSS link._
- **1.5** Docs skeleton (Deliverable 8).

### Phase 2: Content and domain

- **2.1** Typed content modules from the data tables. _AC/V: types compile, content equals the source._
- **2.2** Port `quote()` and the config reducer as pure functions. _AC/V: Vitest table covering all tiers, missions, buffs and annual billing, compared with values derived from the original._

### Phase 3: Static shell

- **3.1** Root layout, metadata skeleton, skip link, `lang`.
- **3.2** Header and logo with an accessible nav.
- **3.3** Hero section.
- **3.4** Classes and Rules sections.
- **3.5** Mission log (CSS sticky horizontal track).
- **3.6** Plans and Outro sections.
- **3.7** Footer.
- **3.8** Modal with a focus trap and form UI (no submit logic).

_AC/V each: semantic landmarks, keyboard reachable, matches reference spacing at 2 viewports._

### Phase 4: Scene engine core

- **4.1** `SceneHost` and the engine lifecycle (mount, resize, dispose, StrictMode-safe).
- **4.2** Render loop with visibility pause and a reduced-motion repaint.
- **4.3** Camera and layout targets (`layout`, `storyTarget`).
- **4.4** Scroll driver with cached offsets.
- **4.5** Materials and the toon, ink and grid helpers.
- **4.6** Procedural texture factory.
- **4.7** Three backgrounds.
- **4.8** WebGL detection and fallback shell.

_AC/V: no leaks after 20 mount/unmount cycles (check `renderer.info`), clean console._

### Phase 5: 3D content (one part per group, ordered by dependency)

- **5.1** Shared geometry helpers and primitives.
- **5.2** Flagship: submarine.
- **5.3** Sky cruiser.
- **5.4** Star carrier.
- **5.5 to 5.8** Heroes in pairs (dolphin and manta, owl and hawk, jellyfish and dragonfly, turtle and beetle).
- **5.9 to 5.12** Units in groups of about 5.
- **5.13** Drone and jet.
- **5.14** Hero effects (flames, glow, flicker).

_AC/V each: side-by-side screenshot against the baseline, a draw-call and triangle count reported._

### Phase 6: Configurator

- **6.1** Panel steps 1 and 2 (tier and mission).
- **6.2** Flagship and buffs.
- **6.3** Loadout and billing toggle.
- **6.4** Character card.
- **6.5** Wire config into the scene (party layout, units on or off).
- **6.6** Header price and tier switch.
- **6.7** Modal submit via a no-op `submitLead()`.

_AC/V: Playwright flow matches the reducer's quote._

### Phase 7: Overlay

- **7.1** The 2D overlay canvas and callouts.
- **7.2** The patch (`renderPatch`, `drawPatch`, the render target).
- **7.3** The boxart title block and burst.
- **7.4** Dead-code decision for the 2D `u*`/`h*` functions.

### Phase 8: Responsive and accessibility

- **8.1** Phone composition and bottom sheet.
- **8.2** Tablet and large-desktop.
- **8.3** Contrast and focus audit.
- **8.4** Screen-reader pass.
- **8.5** Touch and pointer handling.

### Phase 9: Performance

- **9.1** Profiling baseline (original vs new).
- **9.2** DPR and quality governor.
- **9.3** Bundle and code-splitting.
- **9.4** Optional upgrade of three to current stable, with a visual diff.

### Phase 10: Production

- **10.1** Metadata, Open Graph, sitemap, robots.
- **10.2** Error boundary and fallback.
- **10.3** Playwright suite.
- **10.4** Documentation.
- **10.5** Vercel preview and handover.

---

## Deliverable 7: Risk register

| Risk                                     | Impact                                        | Mitigation                                                                  |
| ---------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------- |
| Brief and file disagree on identity      | Wrong target                                  | Confirm now (1.5). The file wins.                                           |
| Recreating about 40 procedural 3D models | Very high effort and drift                    | Port function by function, with baseline screenshots and group-sized parts. |
| Three.js r128 versus modern three        | Look changes (color management, removed APIs) | Pin r128 first, upgrade as its own part with a visual diff.                 |
| Continuous dual-canvas rendering         | Mobile jank and battery                       | Visibility pause, DPR governor, cached layout, cheaper mobile quality tier. |
| Scene and scroll responsiveness          | Broken layouts at odd viewports               | Breakpoint-aware layout targets and a 4-viewport check each phase.          |
| Dead or duplicated 2D code               | Wasted porting                                | Audit in 7.4, and don't port blindly.                                       |
| No WebGL / old devices                   | Blank page                                    | Static fallback shell (4.8).                                                |
| Memory leaks on unmount                  | Slow degradation                              | Dispose in the engine and test mount cycles.                                |
| Scope creep (payments, CRM, new art)     | Delay                                         | Out-of-scope list and a `submitLead()` stub.                                |
| Unnecessary dependencies                 | Bloat                                         | No animation library, no R3F, no shadcn unless justified in an ADR.         |

---

## Deliverable 8: Documentation plan

**Create during planning:** `README.md`, `docs/requirements.md`, `docs/architecture.md`, `docs/implementation-roadmap.md`, `docs/progress.md`, `docs/decisions/0001-no-r3f.md`, `0002-pin-three-r128.md`, `0003-no-animation-library.md`.

**Create during implementation:** `docs/design-system.md` (Part 1.3), `docs/source-map.md` (original function to new module, 1.2 and 7.4), `docs/testing.md` (Phase 8), `docs/deployment.md` (Phase 10).

**Update after every approved part:** `docs/progress.md` and the roadmap status.

---

## Deliverable 9: Antigravity prompt, Phase 1, Part 1

```
# PROJECT CONTEXT
We are rebuilding the "Concepful Mech Builder" prototype (a single exported HTML file, ~450 KB, using Three.js r128 plus 2D canvas) as a production Next.js application. It is a scroll-driven story and pricing configurator with a low-poly toon-shaded mecha look: bone armor, navy ink (#141624), hot red-magenta (#EE004E), slate sky. The original file is the visual source of truth. Planning is done; this is the first implementation part. Nothing exists yet.

# CURRENT TASK (Phase 1, Part 1: Project foundation)
Create the empty, verified project foundation. No site content, no scene code, no animation.

# ARCHITECTURE TO ESTABLISH
Package manager: pnpm. Stack: Next.js (App Router, `src/` directory), React, TypeScript with strict mode, Tailwind CSS, ESLint with the Next.js config, Prettier. Use the latest stable versions available now; do not invent versions. Report the versions actually installed.

Folder skeleton (empty folders hold a `.gitkeep`):
/reference            (original HTML goes here)
/src/app  /src/content  /src/domain  /src/lib  /src/styles
/src/components/{shell,story,configurator,card,modal,scene}
/src/scene
/tests  /docs

# IMPLEMENTATION STEPS
1. Create the app in the current directory with create-next-app (TypeScript, Tailwind, ESLint, App Router, src directory, no Turbopack-specific customisation). Use pnpm.
2. Enable and confirm `"strict": true` in tsconfig. Add `"noUncheckedIndexedAccess": true`.
3. Add Prettier with a minimal config, plus `eslint-config-prettier` so they do not conflict.
4. Add scripts: `dev`, `build`, `start`, `lint`, `typecheck` (`tsc --noEmit`), `format`, `format:check`.
5. Copy the supplied original file to `/reference/Concepful_Mech_Builder.html`. Do not modify, reformat or open-and-save it. Add `/reference` to Prettier ignore and ESLint ignore.
6. Replace the default home page with a minimal placeholder: a `<main>` containing an `<h1>` reading "Concepful", on a `#141624` background with `#f2efe8` text. Remove all create-next-app boilerplate, default images and the default CSS.
7. Set `<html lang="en">` and a basic `<title>` ("Concepful") in the root layout. No fonts, no metadata beyond that.
8. Create `README.md` with: project description, prerequisites, install and run commands, and the script list.
9. Initialise git (if not already), add a sensible `.gitignore`, and make one commit: "chore: project foundation".

# DESIGN REQUIREMENTS
None yet beyond the placeholder colors. Do not create design tokens, fonts or components. That is Part 1.3 and 1.4.

# SCOPE BOUNDARIES (do NOT do any of this)
Do not install Three.js, GSAP, Framer Motion, shadcn/ui, Zustand, Zod, or testing libraries. Do not port any code from the reference file. Do not create components. Do not add Playwright or Vitest. Do not change the reference file.

# QUALITY REQUIREMENTS
TypeScript strict with zero errors. ESLint clean. Prettier formatting applied. No unused boilerplate.

# VERIFICATION (run these and report real output)
pnpm install, pnpm lint, pnpm typecheck, pnpm format:check, pnpm build, then pnpm dev and load http://localhost:3000. Confirm the placeholder renders, the console is clean, and `git status` is clean. Run `diff` or a checksum to confirm the reference file is byte-identical to the original.

# COMPLETION REPORT (required)
1. What was implemented.
2. Files created, modified and deleted.
3. Dependencies added, with exact installed versions and reasons.
4. Every command run and its actual result.
5. Checks completed, and any you could not run (and why).
6. Known issues or deviations.
7. A screenshot of the placeholder page.
8. Anything I should review before approval.
Do not claim a check passed unless you ran it. Do not skip failures silently.
```

---

## Deliverable 10: Review protocol

After Part 1.1, return:

1. Antigravity's full completion report.
2. The output of `pnpm build` and `pnpm lint` (the last 30 lines each are enough).
3. `package.json` and `tsconfig.json`.
4. The result of `ls -R src` (two levels) and `git log --oneline`.
5. The placeholder screenshot.
6. The checksum or diff output confirming the reference file is untouched.

**Approval** requires: strict mode on, all checks run with real output, no forbidden dependencies added, the structure matching, the reference file byte-identical, and an honest report about anything that could not be run. Otherwise the status is **NEEDS FIXES** (with a focused corrective prompt) or **BLOCKED** (if evidence is missing).

---

## Project state

- **Approved:** nothing yet.
- **Current:** Phase 1, Part 1.1, prompt issued.
- **Decisions pending confirmation:** the identity mismatch (1.5), the brand spelling "Concepful", the configurator in scope, and pinning three r128 first.
- **Next action:** answer those, then run Part 1.1 in Antigravity and send back the report.
