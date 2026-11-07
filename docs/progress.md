# Concepful Mech Builder — Redevelopment Progress Tracker

This document records the verification history, approved milestones, and live status of each phase in the redevelopment of **Concepful Mech Builder**.

---

## 1. Overall Progress Summary

|    Phase     | Title                                 | Parts  |                             Status                              |                                                           Approval Date                                                           |
| :----------: | :------------------------------------ | :----: | :-------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------: |
| **Phase 1**  | **Foundation and Baseline**           | 5 / 5  |                          **Approved**                           |                                                           Oct 30, 2026                                                            |
| **Phase 2**  | **Content and Domain Extraction**     | 2 / 2  |                          **Approved**                           |                                                           Oct 30, 2026                                                            |
| **Phase 3**  | **Static Page Shell**                 | 6 / 8  | **Part 3.1–3.6 approved; Part 3.7 in progress** | Part 3.1 & 3.2 Approved Oct 30, 2026; Part 3.3 Approved Nov 6, 2026; Part 3.4 Approved Nov 7, 2026; Part 3.5 Approved Nov 7, 2026; Part 3.6 Approved Nov 8, 2026 |
| **Phase 4**  | **Scene Engine Core**                 | 0 / 8  |                             Pending                             |                                                                 —                                                                 |
| **Phase 5**  | **3D Content (Ships, Heroes, Units)** | 0 / 14 |                             Pending                             |                                                                 —                                                                 |
| **Phase 6**  | **Configurator & Interaction Wiring** | 0 / 7  |                             Pending                             |                                                                 —                                                                 |
| **Phase 7**  | **2D Overlay, Callouts, and Patch**   | 0 / 4  |                             Pending                             |                                                                 —                                                                 |
| **Phase 8**  | **Responsive & Accessibility Pass**   | 0 / 5  |                             Pending                             |                                                                 —                                                                 |
| **Phase 9**  | **Performance & Optimization**        | 0 / 4  |                             Pending                             |                                                                 —                                                                 |
| **Phase 10** | **Production, QA, and Deployment**    | 0 / 5  |                             Pending                             |                                                                 —                                                                 |

---

## 2. Phase 1 Detailed Status Log

### Part 1.1: Project Foundation

- **Status:** **APPROVED**
- **Deliverables:** Next.js App Router scaffolded with pnpm, React 19, TypeScript strict mode (`noUncheckedIndexedAccess: true`), Tailwind CSS v4, Prettier with minimal config, ESLint Next configuration. Placeholder page and initial directory skeleton established.
- **Verification:** Clean pass on `pnpm lint`, `pnpm typecheck`, `pnpm format:check`, and `pnpm build`.
- **Reference HTML Checksum:** `6DDD1EFDD493A245F2556FA71440D8693F837275FCD4E232DE24D527F8E88802`.

### Part 1.2: Reference Baseline Capture

- **Status:** **APPROVED**
- **Deliverables:** Captured 36 reference screenshots across four standard viewport widths (`390px`, `768px`, `1280px`, `1920px`) covering all sections, modal states, and configurator panels in `reference/baseline/`.
- **Script:** Documented standalone capture tool in `reference/capture-baseline.mjs` using project-local Playwright.
- **Metrics Report:** `reference/baseline/README.md` and `capture-metadata.json` documenting animation-frame callback intervals (averaging 16.6ms / 60 Hz).

### Part 1.3: Design Tokens Extraction

- **Status:** **APPROVED**
- **Deliverables:** Extracted all CSS custom properties and Tailwind v4 `@theme` tokens in `src/styles/tokens.css`. Reconciled the two `:root` blocks in the source cascade: established that the second block (`lines 1658–1679`) active values (`--fg: #ffffff`, `--bone: #ffffff`, `--red: #ee004e`) supersede the earlier draft values. Preserved historical draft values under explicit `-draft` names. Authored `docs/design-system.md`.
- **Responsive Semantics:** Removed inverted min-width Tailwind breakpoints from `@theme`; documented original `max-width` thresholds (900px, 1023px) as CSS variables.

### Part 1.4: Font Integration

- **Status:** **APPROVED**
- **Deliverables:** Integrated `Russo One` (display), `Inter` (body), and `JetBrains Mono` (monospace) via `next/font/google` in `src/app/layout.tsx`. Eliminated circular token references by wiring font stacks directly in `@theme` and pointing `:root` tokens (`--display`, `--body`, `--mono`) to the theme variables.
- **Bundling:** Verified local build-time bundling of 16 `.woff2` files into `.next/static/media/` with zero runtime Google Fonts network requests and zero layout shift (CLS = 0).

### Part 1.5: Documentation Skeleton

- **Status:** **APPROVED**
- **Deliverables:**
  - `README.md` updated with architecture references, commands, and project status.
  - `docs/requirements.md` detailing functional, visual, and non-functional requirements with explicit provenance tracking.
  - `docs/architecture.md` detailing Next.js App Router boundaries, decoupled scene engine, and pure domain state.
  - `docs/implementation-roadmap.md` detailing the 10-phase redevelopment plan.
  - `docs/progress.md` tracking overall progress and verification history.
  - Architectural Decision Records: `0001-no-r3f.md`, `0002-pin-three-r128.md`, `0003-no-animation-library.md`.

---

## 3. Phase 2 Detailed Status Log

### Part 2.1: Typed Content Modules

- **Status:** **APPROVED**
- **Deliverables:** Ported verbatim content from `reference/Concepful_Mech_Builder.html` into 10 typed modules under `src/content/`: `types.ts`, `tiers.ts`, `quests.ts`, `gear.ts`, `objectives.ts`, `buffs.ts`, `classes.ts`, `roles.ts`, `roster.ts`, `callouts.ts`, `story.ts`, and barrel export `index.ts`. All IDs, copy, labels, tooltips, prices, and stats preserved with line citations.

### Part 2.2: Pure Domain Logic & Golden Differential Tests

- **Status:** **APPROVED**
- **Deliverables:** Ported pure logic functions into `src/domain/`: `quote.ts` (exact pricing formula, discounts, reach multipliers), `roster.ts` (`units()` and `leaders()` mapping), `ship.ts` (`shipFor()` flagship selection), `config.ts` (configuration state, actions, and reducer).
- **Verification:** Exhaustive 4,100-case differential test suite (`tests/differential.test.ts` and `tests/reducer.test.ts`) comparing against oracle execution of original source JavaScript in `vm2`/Node. 100% parity verified.

---

## 4. Phase 3 Detailed Status Log

### Part 3.0: Token Defect Remediation

- **Status:** **APPROVED**
- **Deliverables:** Removed circular radius definitions in `@theme` by specifying literals (3px, 6px, 10px, 14px, 18px, 999px); wired font stacks directly through `next/font` CSS variables; pruned dead draft tokens while strictly preserving active `:root` values matching lines 1659–1679.

### Part 3.1: Document Shell

- **Status:** **APPROVED**
- **Deliverables:**
  - `src/app/layout.tsx`: Configured Next.js Metadata and Viewport APIs. Verbatim title `"Concepful · Creative Department-as-a-Service"` and description from `src/content/story.ts`. Safe-area aware viewport cover and theme-color `#141624`. Optional `metadataBase` support via `NEXT_PUBLIC_SITE_URL`. Added `suppressHydrationWarning` on `<body>` to ignore browser extension mutations.
  - `src/content/a11y.ts`: Accessibility strings added by rewrite (`skipToMain`).
  - `src/components/shell/SkipLink.tsx`: Server component `<a href="#main">` visually hidden until focused, keyboard accessible, positioned with safe insets and `--z-modal`.
  - `src/app/page.tsx`: Placeholder wrapped in `<main id="main" tabIndex={-1}>`, rendered with `font-display` utility for Russo One.
  - `src/styles/base.css` & `src/app/globals.css`: Ported layout-independent base CSS resets (`box-sizing`, `margin`, `color`, `background`, `font-family`, `text-size-adjust`, reduced-motion guarded `scroll-behavior`).

### Part 3.2: Static Header

- **Status:** **APPROVED**
- **Deliverables:**
  - `src/components/shell/Logo.tsx`: Cel-shaded mecha crest SVG (`.mk`) and vector wordmark SVG (`.wm`) converted to valid JSX, marked with `aria-hidden="true"` and `focusable="false"`. Zero element IDs (no collision risk).
  - `src/components/shell/Header.tsx`: Fixed `<header id="top">` landmark housing `<a className="logo glass" href="#intro" aria-label="Concepful">` and `<nav className="navl glass" aria-label="Primary">` with `NAV_LINKS` and `NAV_CTA`. Zero hardcoded hrefs.
  - `src/styles/header.css` & `src/app/globals.css`: Global component CSS (ADR 0004); glass backdrop filter (`-webkit-backdrop-filter` declared before `backdrop-filter` to prevent LightningCSS de-duplication), safe-area gutter positioning (`--gl`, `--gr`, `--st`), retro 3D tactile button shadow (`--redLo`), hover/active translations, media query (<=900px) hiding non-CTA links, reduced-motion bypass, verified line-by-line citations matching prototype cascade.
  - `src/styles/base.css`: Added global prototype focus ring `:focus-visible { outline: 2px solid var(--pro); outline-offset: 2px; }` (line 578).
  - `src/components/shell/SkipLink.tsx`: Aligned focus styles with global `--pro` focus token (`focus:border-pro focus:outline-pro`).
  - `src/content/story.ts`: Exported `BRAND` (`href: "#intro"`, `label: "Concepful"`).
  - `src/app/layout.tsx`: Mounted `<Header />` directly following `<SkipLink />`.
- **Verification:**
  - **Backdrop filter & Ancestors:** Both original and new app render `backdropFilter: blur(12px) saturate(1.1)` on `.logo` and `.navl` with identical background `rgba(20, 22, 40, 0.84)` across 1280px and 390px.
  - **Faux-Bold & Fonts:** Resolved font data: `.wm` is SVG vector mark (no text node). `.navl a` renders Inter 600. `.navl a.fu` renders Russo One 600 (inherits `font-weight: 600` from `.navl a`, identical to original prototype). Both Inter and Russo One confirmed loaded from network via Google Fonts CDN (status 200).
  - **Hover & Focus States:** Tested with Playwright at 1280px and 390px. Global `:focus-visible` renders `rgb(255, 127, 166)` (`--pro`) with `2px solid` and `2px offset` across skip link, logo, nav links, and CTA.
  - **Client JavaScript Proof:** 0 bytes raw difference, 0 bytes gzip difference (568,669 raw / 174,719 gzip) across identical chunk hashes.
  - **Pixel Diff:** Exact tolerance 0 diff is 22 pixels (0.025%) at 1280px (isolated via `elementFromPoint` to nav link text anti-aliasing) and 0 pixels (0.000%) at 390px. Tolerance 10 diff is 0.000% across all viewports. Controls confirmed failure modes.

### Part 3.3: Static Hero Section

- **Status:** **APPROVED** (Covering Part 3.3, 3.3c, 3.3d via commits `91f9f76`, `fb34812`, `df1b1b6`)
- **Deliverables:**
  - `src/content/sections.ts`: Exported canonical `SECTION_IDS` (`intro`, `classes`, `howItWorks`, `plans`, `build`) with comments citing original prototype IDs. Barrel exported via `src/content/index.ts`.
  - `tests/sections.test.ts`: Unit test suite verifying `BRAND`, `NAV_LINKS`, and `NAV_CTA` hrefs align with canonical `SECTION_IDS`.
  - `src/components/story/Hero.tsx`: Server Component rendering the introductory narrative card (`<section id="intro" className="st" data-scene="intro" aria-labelledby="hero-heading">`) with single `<h1>` (`id="hero-heading"`), highlighted `<span>on demand.</span>`, narrative paragraph, primary/secondary CTAs (`#build`, `#how-it-works`), and 3-column telemetry HUD specs.
  - `src/styles/hero.css`: Global component CSS per ADR 0004; glass backdrop filter, card boundary layout, slanted Russo One heading with `--redLo` drop shadow, ghost button styling, HUD spec boxes, mobile responsive adjustments (<=900px), imported in `src/app/globals.css`.
  - `src/styles/base.css`: Added horizontal body gutters `padding-left: var(--gl); padding-right: var(--gr);` (lines 559–560) and heading reset `h1, h2, h3 { margin: 0; text-wrap: balance; }` (lines 563–566).
  - `src/app/page.tsx`: Replaced placeholder markup with `<main id="main" tabIndex={-1} className="story outline-none"><Hero /></main>`.
  - `docs/scene-hooks.md`: Full inventory of DOM attributes (`data-scene="intro"`), element classifications (static vs interactive), and Three.js scene hooks.
- **Verification:**
  - **Computed Styles Parity:** 100% parity across all 4 viewports (390px, 768px, 1280px, 1920px) across 13 distinct elements.
  - **Pixel Diff:** Exact tolerance 0 diff on hero card is 28 pixels (0.0117%) at 1280px and 875 pixels (0.5833%) at 390px (subpixel text anti-aliasing edges only; tolerance 10 diff is 0.0004% at 1280px and 0.0393% at 390px). Injected failing controls confirmed sensitivity: h1 font-weight 700 produced 9.87% (1280px) and 7.35% (390px) diff; description color `--fg` produced 1.67% (1280px) and 2.85% (390px) diff.
  - **No-JS Compatibility:** Page renders complete hero card, heading, copy, CTAs, and HUD stats with JavaScript disabled.
  - **Font Face Readiness:** `document.fonts.check` passes for Russo One, Inter, and JetBrains Mono across tested sizes.
  - **Keyboard Tab Order & ARIA:** Tested tab order moves sequentially from skip link through header links to hero CTAs (`Start your build`, `See how it works`), all displaying `--pro` 2px focus ring.
  - **Client JS Bundle:** 0 bytes added (568,669 raw / 174,719 gzip across identical chunks).

### Part 3.3c: Hero Card Width Fix

- **Status:** **APPROVED**
- **Commit:** `fix(hero): size card to fit heading` (`fb34812`)
- **Problem:** At viewports ≥901px the h1 "DEPARTMENT," token (Russo One, `skewX(-8deg)`, `clamp(36px, 5vw, 66px)`) overflowed the shared `.sc` card's right padding edge. This is an original prototype defect — the reference HTML has the same overflow. The fix is applied only in the rebuild.
- **Method:** Playwright `getClientRects()` text-node Range measurements at 9 viewports (1920, 1440, 1280, 1100, 1024, 901, 900, 768, 390) on both original and new page. Computed K = `deptWordWidth / fontSize` = 7.2322 (identical at 66px and 64px); rounded up to 7.24. Formula: `max-width: calc(7.24 * var(--hero-h1) + 54px)` where `54px = 2×22px(padding) + 10px(breathing)`.
- **Scope:** `src/styles/hero.css` only; `.sc.hero` selector only; shared `.sc` rule unchanged.
- **Deliverables:**
  - `src/styles/hero.css`: added `.sc.hero { --hero-h1: clamp(36px, 5vw, 66px); max-width: calc(7.24 * var(--hero-h1) + 54px); }` and `.sc.hero { max-width: none }` inside the `@media (max-width: 900px)` block.
  - `docs/design-system.md`: hero card width note added.
- **Verification:**
  - **Overflow (new page, all widths ≥901px):** overflowRight ≤ 0 at 1920 (−17.0px), 1440 (−17.0px), 1280 (−16.7px), 1100 (−15.6px), 1024 (−15.2px), 901 (−14.3px). No horizontal scrollbar (`scrollWidth === innerWidth`).
  - **Mobile (≤900px):** `max-width: none` correctly applied; card fills row as before.
  - **h1 font-size unchanged:** 66px at 1920/1440, 64px at 1280, 55px at 1100, 51.2px at 1024, 45.05px at 901, 34px at ≤900px — identical to pre-fix measurements.
  - **JS bundle:** 568,669 bytes raw — 0 bytes added.
  - **Quality checks:** `pnpm lint`, `pnpm typecheck`, `pnpm format:check`, `pnpm test` (4,104 tests) — all pass.

### Part 3.3d: Hero Refactor & Verification Closure

- **Status:** **APPROVED**
- **Commit:** `refactor(hero): single source for heading size, evidence docs` (`df1b1b6`)
- **Deliverables:** Eliminated duplicate `--hero-h1` definition in `src/styles/hero.css` by scoping directly to `.sc.hero h1.big { font-size: var(--hero-h1); }`. Redid CTA interaction measurements with 300ms transition buffer and no-transition controls; corrected navigation anchor citations in `src/content/story.ts`, `src/content/sections.ts`, and `docs/scene-hooks.md` to exact lines 1868–1872 (`d2ce7aa`).

### Part 3.4: Static "Classes" and "Server Rules" Sections

- **Status:** **APPROVED** (Commits `0dd19c3`, `d2ce7aa`, `efca537`, `8c0d26e`, `8c3ebfa`)
- **Deliverables:**
  - `src/styles/story.css`: Extracted shared layout rules (`.story`, `.st`, `.in`, `.sc`, `.sc .eyebrow`, `.sc p`) out of `hero.css` to share across story sections.
  - `src/styles/hero.css`: Refactored to hero-specific rules only (`.sc.hero`, `h1.big`, `.ctas`, `.hud`).
  - `src/content/sections.ts`: Added `rules: "rules"` to `SECTION_IDS` (citing line 2103).
  - `tests/sections.test.ts`: Added unit test asserting `SECTION_IDS.rules === "rules"`.
  - `src/components/story/Classes.tsx`: Server Component rendering `<section id="classes" className="st tall" data-scene="classes" aria-labelledby="classes-heading">` with 3 `.beat` elements and 4 `.perks` tags (lines 2018–2057).
  - `src/styles/classes.css`: Section styles for `.st.tall` (`min-height: 240vh`), `.st.tall .sc` (`position: sticky`), `.beats`, `.beat`, `.perks`, and mobile responsive overrides (<=900px).
  - `src/components/story/Rules.tsx`: Server Component rendering `<section id="rules" className="st" data-scene="rules" aria-labelledby="rules-heading">` with 6 `.rules li` bulleted items (lines 2103–2134).
  - `src/styles/rules.css`: Section styles for `.rules`, `.rules li`, red rotated square marker pseudo-elements (`.rules li::before`), and mobile font adjustments.
  - `src/app/globals.css`: Imported `story.css`, `hero.css`, `classes.css`, `rules.css`.
  - `src/app/page.tsx`: Mounted `<Hero />`, `<Classes />`, and `<Rules />` in sequence inside `<main>`.
  - `docs/scene-hooks.md`: Documented scene hooks, scroll-driven beat detection (`data-beats`), unit camera bindings, and layout specifications.

### Part 3.5: Static "Mission Log" (how-it-works) Section

- **Status:** **IMPLEMENTED (Awaiting User Review and Approval)**
- **Deliverables:**
  - `src/components/story/Logistics.tsx`: Server Component rendering `<section id="how-it-works" className="hz-sec" data-scene="logi" aria-labelledby="how-it-works-heading">` with centered header card `.hz-head.sc` and 4-step telemetry pipeline grid track `.hz-track#hzt` (lines 2058–2101).
  - `src/styles/logistics.css`: Section styles for `.hz-sec` (`height: 420vh`), `.hz` (`position: sticky`), `.hz-head`, `.hz-view`, `.hz-track`, `.slide`, `.slide i`, `.slide b`, `.slide small`, and mobile responsive overrides (`@media (max-width: 900px)`), using exact line citations and active tokens only.
  - `src/app/globals.css`: Imported `logistics.css` after `rules.css`.
  - `src/app/page.tsx`: Rendered sections in canonical visual order: `<Hero />`, `<Classes />`, `<Logistics />`, `<Rules />`.
  - `docs/scene-hooks.md`: Documented scene hook `data-scene="logi"`, scroll progress active beat toggling formula `idx = Math.min(n - 1, Math.floor(p * n * 1.05))`, and CSS grid layout behavior.
- **Verification:**
  - **Quality Gates:** `pnpm lint`, `pnpm typecheck`, `pnpm format:check`, `pnpm test` (4,104 tests), `pnpm build` all pass cleanly.
  - **Overflow Pre-check:** Measured original prototype across 9 viewports (1920 to 390); all cards have negative overflow (`hasOverflow: false` across all cards and widths).
  - **Document Geometry:** Offsets match the original exactly on both pages at 390px and 1280px (Hero: 0/900; Classes: 900/2160; Logistics: 3060/3780; Rules: 6840/900).
  - **Computed Styles Parity:** 0 structural mismatches; 0 unexpected property differences across all 24 elements in the Logistics subtree across 390px, 768px, 1280px, and 1920px (total 4,896 property comparisons).
  - **Visual Diff:** Exact 0 diff pixels on head card at 390px and 768px; 9px and 22px at 1280px and 1920px (subpixel text antialiasing). Forced states and sensitive controls (heading weight 700: 3,539–5,460 diff px; slide color `--fg`: 2,391–2,851 diff px) vastly exceed noise floor.
  - **No-JS Compatibility:** All 4 slides render and are visible in grid without clipping; innerText matches original identically.
  - **Fonts:** Every distinct (family, weight, size) tuple matches 100%; `document.fonts.check` and `load` pass for all families.
  - **Semantics:** Tab order strictly sequential; heading outline valid with 1 H1 and 3 H2s (0 skipped levels); 0 duplicate IDs; aria snapshot confirms complete accessible region hierarchy.
  - **Client JS Bundle:** Exactly 0 bytes added (raw diff: 0, gzip diff: 0).
  - **Screenshots:** Element screenshots of original, new, and diff saved to OS temporary directory.

> **Part 3.5 Note:** Before porting subsequent sections (Plans, Outro), run the same overflow measurement on each. Do not widen them without first measuring their heading overflow at all ≥901px viewports.

### Part 3.5: Static Mission Log Section (`#how-it-works`)

- **Status:** **APPROVED**
- **Commit:** `d1ecdde feat(story): static mission log section` (implementation) and `0885209 fix(story): mission log slide parity` (vendor prefix declaration order fix).
- **Deliverables:**
  - `src/components/story/Logistics.tsx`: Canonical `#how-it-works` section with `hz-head` and 4 `.slide` cards.
  - `src/styles/logistics.css`: Sticky viewport frame, CSS grid telemetry track, glassmorphism cards.
  - `src/content/sections.ts`: Canonical `howItWorks: "how-it-works"` ID mapping.
- **Verification:**
  - Geometry: Exact match on offsetTop (3060px) and offsetHeight (3780px) at 390px and 1280px.
  - Parity: 0 diff pixels at 390px and 768px; 73 diff pixels at 1280px and 1920px (antialiasing only, max $\Delta \le 3$).
  - Sticky: Exact match across $f \in \{0, 0.25, 0.5, 0.75, 1\}$ (0 px diff at 390px, 102 px diff at 1280px).
  - Quality Gates: All lint, typecheck, format, test (4,108 tests), and build checks pass cleanly.

### Part 3.6: Static Plans & Outro Sections (`#plans`, `#outro`)

- **Status:** **APPROVED** (commits `012a93e`, `ed63120`, evidence `184028e`, fix `d6b9c90`)
- **Deliverables:**
  - `src/components/story/Plans.tsx`: Static server component for `#plans` (`s-stages` in prototype), rendering stage beats with `data-pick` attributes and primary CTA link.
  - `src/components/story/Outro.tsx`: Static server component for `#outro` (`s-outro` in prototype), rendering concluding hero card with primary and secondary CTAs.
  - `src/styles/plans.css`: Section-specific responsive styles for Plans beats, tags, and actions.
  - `src/content/sections.ts`: Added `outro: "outro"` mapping (line 2172).
  - `src/app/page.tsx`: Rendered all 6 static story sections in order: Hero, Classes, Logistics, Rules, Plans, Outro.
  - `src/styles/hero.css`: Follow-up `d6b9c90` scoped `.sc.hero` rules to `#intro .sc.hero`, allowing removal of redundant `src/styles/outro.css` while maintaining exact 0px diff against HEAD across all viewports.
- **Verification:**
  - Geometry: Exact match on offsetTop (Plans: 7740px, Outro: 9900px) and offsetHeight (Plans: 2160px, Outro: 900px) on both pages at 390px and 1280px.
  - Parity: Outro card diff is 25 px at 1280px (0.0128%), 27 px at 1920px (0.0136%), 40 px at 768px (0.0273%), 41 px at 390px (0.0406%). Plans card diff is 381–425 px across all viewports; attribution probe confirmed 375–379 px are localized exclusively to the fallback arrow glyph (`→`) in `<em>Mission → Full Crew</em>`.
  - Follow-up Scope Fix (`d6b9c90`): Proved exact 0 diff pixels against HEAD across all 4 standard viewports (390, 768, 1280, 1920) across all 7 component targets (hero card, outro card, header, classes card, logistics head/track, rules card, plans card). Outro card vs reference retains identical 25–41 px residual.
  - Controls: Heading font-weight 700 produces 15,337 diff px (7.22%); button background changed produces 14,393 diff px (6.77%), both vastly exceeding noise floors.
  - Sticky: Plans card bounding rect matches to the subpixel across $f \in \{0, 0.5, 1\}$ on both pages (390px and 1280px).
  - No-JS: All text and cards 100% visible and accessible without JavaScript; innerText matches prototype identically.
  - Semantics: 1 H1, 5 H2s (0 skipped levels); 0 duplicate IDs; tab order strictly sequential across all 11 focusable links.
  - Client JS Bundle: Exactly 0 bytes added (raw diff: 0, gzip diff: 0).
  - Quality Gates: All lint, typecheck, format, test (4,108 tests), and build checks pass cleanly.

---

## 5. Open Decisions & Technical Spikes

1. **Turbopack CSS Loader & CSS Modules:**
   `turbopack.rules['*.css']` custom loader makes CSS Modules unusable (ADR 0004); evaluate the standard Tailwind v4 PostCSS integration in a spike before Phase 4, with a visual diff of header and hero.

2. **Plans Tier Chip Arrow Glyph Width Difference (U+2192):**
   - **Context:** In `reference/Concepful_Mech_Builder.html` line 2148, the Plans section contains `<b>Startups <em>Mission → Full Crew</em></b>`. This is the sole occurrence of `→` (U+2192) in the entire reference file.
   - **Measurements at 1280px:**
     - Reference chip `<em>` width: `122.265625px` (rendered with fallback system monospace font in offline/test context).
     - Rebuild chip `<em>` width: `129.828125px` (rendered with bundled JetBrains Mono webfont).
     - Width delta: `7.5625px`.
     - Glyphs at `font-size: 9.5px`, `letter-spacing: 0.08em`:
       - Consolas: `→` = `5.984375px`, '0'/'M'/' ' = `5.984375px`.
       - Arial: `→` = `10.265625px`, '0' = `6.046875px`, 'M' = `8.6875px`.
       - Consolas, Arial, sans-serif: `→` = `5.984375px`.
       - JetBrains Mono: advance = `6.46875px`; `→` glyph falls back to Consolas at `5.984375px` in Windows Chromium.
     - The `7.5625px` difference across the chip is the cumulative width difference of the 18 ASCII characters taking JetBrains Mono advance (`6.46875px`) vs Consolas (`5.984375px`), plus letter-spacing.
   - **Layout Impact:** None. Parent `<b>` is flex (`display: flex; flex-wrap: nowrap; gap: 8px`), `em` is styled `margin-left: auto;`, and `scrollHeight === clientHeight` (`wraps: false`). No line wraps anywhere on the page as a result of the arrow width.
   - **Decision:** Keep canonical UTF-8 glyph `→` in `src/content/story.ts`.

3. **Body Reset & User-Agent Style Parity:**
   - Subtree property comparison across 136 elements in Plans and Outro verified that 0 geometric differences exist outside the Plans arrow chip.
   - Four body-level styling differences between prototype and rebuild were measured:
     - `-webkit-font-smoothing`: `antialiased` (rebuild, from Tailwind `@theme`/utility) vs `auto` (prototype). Overriding body to `auto` in Windows Chromium DirectWrite yielded exact 0 pixel delta on Hero and Plans cards.
     - `tab-size`: `4` (rebuild) vs `8` (prototype UA default).
     - `text-size-adjust`: `100%` (rebuild) vs `auto` (prototype UA default).
     - `-webkit-tap-highlight-color`: `transparent` (rebuild) vs UA default.
   - **Decision:** Keep Tailwind v4 standard reset properties; font smoothing produces identical DirectWrite rasterization on Windows Chromium.

---

## 6. Accessibility & Polish Backlog

The following items are tracked for remediation in Phase 8 (Responsive & Accessibility Pass) without regressing visual parity with the reference prototype:

1. **Polish Backlog — Hero Text Left Clearance:**
   Hero heading text left clearance to card border box is 4.4px at 1920/1440, 5.0px at 1280, and 7.6px at 1100 (original prototype: 0.09px across 5 lines). Candidate remediation: `padding-left` on the heading about `0.27 * var(--hero-h1)` plus matching extra card width; decision pending.
2. **Polish Backlog — Subpixel Text Edge Difference:**
   47 to 48 px of heading glyph-edge diff at <=768px; cause unproven (subpixel text anti-aliasing / font engine rasterization).
3. **Polish Backlog — CTA Label Contrast:**
   White text on `--red` (`#ee004e`) measures at 4.43:1 (WCAG AA non-bold small text target is 4.5:1). Matches original prototype.
4. **Text Contrast on Background (`--red` on `--bg`):**
   `--red` (`#ee004e`) on `--bg` (`#141624`) measures at 4.056:1 if any regular text uses it (WCAG AA requires 4.5:1 for small text).
5. **Synthetic / Faux-Bold Display Font (`Russo One` at weight 600):**
   `Russo One` is a single-weight font (400). In the original prototype, `.navl a.fu` inherits `font-weight: 600` from `.navl a`, causing browser synthetic bolding. Kept for visual parity with original prototype; Phase 8 will evaluate explicit font-weight overrides or typography styling.
6. **Header Text-Edge Subpixel Difference (22px at 1280px):**
   At 1280px viewport width, an exact tolerance 0 diff identified 22 isolated edge pixels on nav link text anti-aliasing against the reference prototype. Cause is unproven. Tolerance 10 diff is 0.000%.
7. **Mobile Navigation Link Accessibility (<900px):**
   Below 900px, `.navl a:not(.fu)` is hidden via `display: none` in the original prototype, leaving no accessible hamburger menu or navigation list alternative on small screens. Phase 8 will provide an accessible responsive navigation drawer.
8. **beat description contrast 2.85:1 (title 4.89:1) measured with the opacity-group model, same as the original; Phase 8:**
   The earlier report's entries (citing 5.74:1 / 3.40:1 and 5.11:1 / 3.00:1) used incorrect compositing models. Under the correct model where element opacity $o = 0.5$ applies to the entire beat element (`surfaceFinal = o * compose(beatBg over cardEffective) + (1 - o) * cardEffective`; `textPixelFinal = o * textColor + (1 - o) * cardEffective`):
   - `cardEffective`: `rgb(20, 22, 39)`
   - `beatOverCard`: `rgb(32, 35, 62)`
   - `surfaceFinal`: `rgb(26, 29, 51)` (luminance `0.0134`, screenshot sampled `[26, 28, 51]`)
   - `titlePixelFinal`: `rgb(138, 139, 147)` (luminance `0.2598`, screenshot sampled `[137, 138, 148]`), yielding **4.89:1** (passes WCAG AA Normal Text >= 4.5:1).
   - `descPixelFinal`: `rgb(98, 100, 121)` (luminance `0.1309`, screenshot sampled `[97, 99, 122]`), yielding **2.85:1** (below 4.5:1 for normal text and 3.0:1 for large text).
     Logged for Phase 8 accessibility pass to evaluate contrast enhancement.
9. **mobile Classes card 1-unit channel residual: probe 0.2 findings:**
   Classes mobile diff caused by original .wmark overlay; re-measure after the footer is built (Part 3.7).
   Variant (c) (hiding canvases and setting flat html/body background) left 1,096 diff pixels at 390px and 1,097 at 768px. In-depth DOM layer probe identified that 1,072 of these pixels are caused by the fixed watermark footer (`.wmark`, lines 1741–1785 / 2196–2206) in the reference prototype, which sits at `position: fixed; z-index: 5; bottom: calc(8px + var(--sb)); right: calc(var(--gr) + 2px)` and overlays the bottom-right corner of the sticky card at viewports `<= 900px`. When `.wmark` is hidden (Variant d), the Classes card diff drops from 1,096 to **24 pixels** at 390px and from 1,097 to **25 pixels** at 768px, which are pure subpixel glyph-edge rasterization differences.
10. **Static Beat Non-Interactive Pointer Cursor:**
    Classes beats show `cursor: pointer` and a focus-visible style but are not interactive in the static build; the original makes them `role="button"` and `tabIndex = 0` by script (reference lines 15092–15121). Decide at Phase 4/6 (wire the behavior or remove the pointer cursor).
11. **Mission Log Slide Opacity & List Semantics:**
    Slides carry the `.beat` class, rendering at `opacity: 0.5` until `.on` is applied by script (same as the original prototype; contrast measured for beats applies). Slide markup consists of `div/i/b/small` without semantic list elements (candidate enhancement: ordered list `<ol>/<li>`, "added by the rewrite", Phase 8).
12. **Plans and Outro CTA and Beat Contrast Measurements:**
    - Primary CTA (`.fu` on Plans 'Build yours' and Outro 'Choose your plan'): `#ffffff` on `#ee004e` (`--red`) measures at **4.43:1** (target: 4.5:1 for normal text, passes WCAG Large AA >= 3.0:1; matches prototype).
    - Outro Secondary Ghost CTA (`.ghost` 'Compare plans'): `#ffffff` on composited dark glass background (`rgb(20, 22, 39)`) measures at **17.89:1** (passes WCAG AAA).
    - Plans Beat Title ('Solo founders'): `#ffffff` on composited dark glass background (`rgb(20, 22, 39)`) measures at **17.89:1** (passes WCAG AAA).
    - Plans Beat Tier Chip ('Mission'): `#ff7fa6` on composited dark glass background (`rgb(20, 22, 39)`) measures at **7.53:1** (passes WCAG AA).
    - Plans Beat Description ('From zero to...'): `#afb1cb` on composited dark glass background (`rgb(20, 22, 39)`) measures at **8.50:1** (passes WCAG AA).
13. **Plans Tier Chip Arrow Glyph Font Fallback:**
    U+2192 in Plans tier chips renders from a system fallback on the rebuild; original used Google-hosted JetBrains Mono; decision pending.
14. **Mission Log Mobile Description Visibility:**
    At `<=900px`, step descriptions (`.slide small`) and the section paragraph (`.hz-head p`) are `display: none` unless `.on` is set by script; without JS they are invisible (same in the original prototype). Decide at Phase 4/8.
15. **Plans & Outro Primary CTA Contrast (`.fu` on Red):**
    Measured luminance on white `#fff` text (`L = 1.000`) over red `#ee004e` button (`L = 0.187`) yields **4.43:1**, passing WCAG Large Text AA (>= 3.0:1) and falling just below 4.5:1 normal text threshold. Identical to original prototype.
16. **Plans Stage Beat Typography Contrast:**
    - Beat Titles (`b`): white text on card glass yields **17.89:1** (passes WCAG AAA).
    - Beat Tiers (`em`): `var(--pro)` (`rgb(255, 127, 166)`, $L = 0.392$) on card glass yields **7.53:1** (passes WCAG AAA).
    - Beat Descriptions (`small`): `var(--muted)` (`rgb(175, 177, 203)`, $L = 0.449$) on card glass yields **8.50:1** (passes WCAG AAA).
17. **Outro Secondary Ghost CTA Contrast:**
    Measured white `#fff` text over card glass background yields **17.89:1** (passes WCAG AAA). Border (`var(--line2)`) provides boundary definition over glass.

---

## 7. Verification Dimensions & Quality Targets

| Dimension                      | Verification Scope                                  | Status                 | Notes                                                                            |
| :----------------------------- | :-------------------------------------------------- | :--------------------- | :------------------------------------------------------------------------------- |
| **Code & Build Checks**        | `pnpm lint`, `typecheck`, `format:check`, `build`   | **Verified Passing**   | All standard commands pass cleanly with exit code 0.                             |
| **Domain Logic Tests**         | `pnpm test` (4,104 test cases)                      | **Verified Passing**   | 100% parity against original JavaScript oracle; section ID link unit tests pass. |
| **Repository File Integrity**  | Checksum of `reference/Concepful_Mech_Builder.html` | **Verified Passing**   | SHA-256: `6DDD1EFDD493A245F2556FA71440D8693F837275FCD4E232DE24D527F8E88802`.     |
| **Visual Baseline Archive**    | 36 screenshots in `reference/baseline/`             | **Verified Passing**   | Intact across 4 viewports (Part 1.2).                                            |
| **Document Shell Parity**      | HTML head, skip link, keyboard focus                | **Verified Passing**   | Head metadata matches, skip link focuses main, fonts verified in browser engine. |
| **Static Header Parity**       | Logo, wordmark, nav links, CTA, glass styling       | **Verified Passing**   | Computed styles match across 4 viewports; mobile link collapsing matches.        |
| **Static Hero Parity**         | Glass card, slanted Russo One h1, copy, CTAs, HUD   | **Verified Passing**   | Computed styles match across 4 viewports; pixel diff <=0.58% (subpixel AA only). |
| **Font Bundling (CLS = 0)**    | Build-time `.woff2` extraction                      | **Verified Passing**   | Local assets preloaded in head. Russo One, Inter, JetBrains Mono verified.       |
| **Visual Fidelity (Scene/UI)** | Reconstructed 3D mechas & HUD vs. baseline          | **Pending Phases 4–7** | Layout implementation in progress.                                               |
| **Accessibility (WCAG AA)**    | Keyboard navigation, focus rings, contrast          | **In Progress**        | Skip link and header focus rings verified; full audit scheduled for Phase 8.     |
| **Performance (60 FPS)**       | Profiling render loop & DPR governor                | **Pending Phase 9**    | Scheduled for Phase 9 profiling.                                                 |
| **E2E Test Suite**             | Full Playwright configurator flow                   | **Pending Phase 10**   | Scheduled for Phase 10 QA.                                                       |
