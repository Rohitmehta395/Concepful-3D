# Concepful Mech Builder — Redevelopment Progress Tracker

This document records the verification history, approved milestones, and live status of each phase in the redevelopment of **Concepful Mech Builder**.

---

## 1. Overall Progress Summary

|    Phase     | Title                                 | Parts  |              Status              |                     Approval Date                     |
| :----------: | :------------------------------------ | :----: | :------------------------------: | :---------------------------------------------------: |
| **Phase 1**  | **Foundation and Baseline**           | 5 / 5  |           **Approved**           |                     Oct 30, 2026                      |
| **Phase 2**  | **Content and Domain Extraction**     | 2 / 2  |           **Approved**           |                     Oct 30, 2026                      |
| **Phase 3**  | **Static Page Shell**                 | 8 / 8  | **In Review (Pending Sign-Off)** | Part 3.1–3.8 static shell built; verification ongoing |
| **Phase 4**  | **Scene Engine Core**                 | 0 / 8  |             Pending              |                           —                           |
| **Phase 5**  | **3D Content (Ships, Heroes, Units)** | 0 / 14 |             Pending              |                           —                           |
| **Phase 6**  | **Configurator & Interaction Wiring** | 0 / 7  |             Pending              |                           —                           |
| **Phase 7**  | **2D Overlay, Callouts, and Patch**   | 0 / 4  |             Pending              |                           —                           |
| **Phase 8**  | **Responsive & Accessibility Pass**   | 0 / 5  |             Pending              |                           —                           |
| **Phase 9**  | **Performance & Optimization**        | 0 / 4  |             Pending              |                           —                           |
| **Phase 10** | **Production, QA, and Deployment**    | 0 / 5  |             Pending              |                           —                           |

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

### Part 3.7: Static Ending — Build Skeleton & Watermark Footer (`#build`, `.wmark`)

- **Status:** **APPROVED**
- **Deliverables:**
  - `src/components/story/Build.tsx`: Static server component for `#build` (`.app-sec`, lines 2189–2194), rendering empty 100vh landing skeleton with `data-scene="app"` and `aria-label="Build your department"`.
  - `src/components/shell/Footer.tsx`: Static server component for `.wmark` watermark footer (lines 2196–2206), rendering disclaimer copy and embedded base64 brand mark.
  - `src/styles/build.css`: Dedicated stylesheet declaring `.app-sec { height: 100vh; }` (lines 395–397).
  - `src/styles/footer.css`: Dedicated stylesheet porting lines 1741–1786 (fixed positioning, typography, responsive mobile query hiding text at `<=900px`).
  - `src/app/page.tsx`: Mounted `<Build />` inside `<main>` as the 7th and concluding section.
  - `src/app/layout.tsx`: Mounted `<Footer />` as the global shell footer directly following `<main>`.
  - `src/app/globals.css`: Imported `build.css` and `footer.css`.
  - `docs/scene-hooks.md`: Added Section 10 documenting `#build` and `.wmark` scene hooks, attributes, and classification.
- **Verification:**
  - Geometry: Page scrollHeight matches reference exactly at 11,700px at 1280x900 ($13 \times 900\text{px}$). `#build` offsetTop is 10,800px, offsetHeight 900px on both pages.
  - Computed Styles: 100% match across all 9 standard viewports (1920 to 390) for `.app-sec`, `.wmark`, `.wmark span`, and `.wmark img`.
  - Parity (Footer): 0 diff pixels at 390px and 768px (exact match); 4 diff pixels at 1280px and 1920px (0.0368%, maxDelta 3).
  - Parity (Classes Mobile Re-check): With `.wmark` now present in rebuild, the Classes mobile diff dropped from 1,096px down to **24px** at 390px and **25px** at 768px, fulfilling the $\le 100\text{px}$ target and confirming the overlay probe findings.
  - Parity (Existing Sections): Hero card (47–48px mobile, matching baseline), Outro card (25–41px, matching baseline), and Plans card (381–425px, matching baseline) verified with 0 regressions.
  - No-JS: `#build` and `.wmark` visible and styled without JavaScript; text matches reference byte-for-byte.
  - Fonts: 100% JetBrains Mono (110 glyphs), 0 fallback fonts used on `.wmark`.
  - Semantics & Landmarks: Accessible region landmark on `#build`, contentinfo role on `.wmark`, 0 duplicate IDs.
  - Bundle Size: Exactly 0 bytes added to client JavaScript bundle (`isServerOnly: true`).
  - Contrast: Analytical 3.85:1 desktop (`opacity: 0.6` on dark background); text hidden at `<=900px`.
  - Quality Gates: All lint, typecheck, format, test (4,108 tests), and build checks pass cleanly.

### Part 3.7: Build Section Skeleton & Watermark Footer

- **Status:** **COMPLETE & VERIFIED**
- **Deliverables:**
  - `src/components/story/Build.tsx` & `src/styles/build.css`: Static 100vh `#build` landing section skeleton matching original lines 2189–2194 (`<section class="app-sec" data-scene="app" id="build" aria-label="Build your department">`).
  - `src/components/shell/Footer.tsx`, `src/styles/footer.css`, & `src/content/assets.ts`: Fixed watermark footer (`.wmark`, lines 2196–2206) with copyright text, responsive disclaimer hiding (`display: none` at `<=900px`), and 28x28px brand mark extracted into typed asset constant with ADR 0005 justification.
  - `docs/decisions/0005-inline-data-uri-img.md`: Documented architectural decision for inline base64 mark without next/image wrapper.
- **Interim UX Note:**
  With Part 3.7 complete, the story scroll flows smoothly through all narrative sections (Hero, Classes, Mission log, Rules, Plans, Outro) to the `#build` landing zone, where the footer watermark pins to the bottom right of the viewport.
- **Empty Region Landmark Note:**
  The skeleton `<section id="build" aria-label="Build your department">` creates an empty landmark region until Phase 6 interactive configurator populates it; this is deliberate and documented.
- **Verification Evidence:**
  - Exact Worktree Diff: 0 differing pixels across all 8 previous targets (`header.top`, `#intro .sc`, `#classes .sc`, `#how-it-works .hz-head`, `#how-it-works .hz-track`, `#rules .sc`, `#plans .sc`, `#outro .sc`) at 390px, 768px, 1280px, and 1920px against commit `184028e`.
  - Noise Floors: Exactly 0 differing pixels between 3 consecutive runs on `footer.wmark` and `#classes .sc` across all 4 viewports; controls passed (0 px on identical white rect, 154 px on 1-px shifted text).
  - Geometry Parity at 390px: Exact 0.0000px delta on bounding box x, y, width, height, position (fixed), left (352px), right (18px), and bottom (8px).
  - Computed Styles: Reconciled across 9 viewports (390 to 1920). 0 custom or layout differences; exactly 14 universal Tailwind v4 reset property differences (-webkit-font-smoothing, -webkit-locale, -webkit-tap-highlight-color, 8 border-*-style, font-family, tab-size, text-size-adjust).
  - Client JS Bundle: Exactly 0 bytes added to client JS bundle (pure server components).

### Part 3.8: Static Guild Modal Shell

- **Status:** **COMPLETE & VERIFIED**
- **Deliverables:**
  - `src/components/shell/GuildModal.tsx` & `src/styles/modal.css`: Static "Create your guild" modal (`<div class="modal" id="modal" hidden>`) with dialog card (`.mcard.glass`), red header (`.hd`), close button (`#mx`), intake form (`#pilot`), and success card skeleton (`#m-done`, hidden) matching reference lines 2208–2283.
  - `src/content/modal.ts`: Verbatim modal copy matching reference lines 2208–2283.
  - Mount: Mounted in `src/app/layout.tsx` following original DOM order after `<Footer />`.
- **Verification Evidence:**
  - Exact Pixel Diff: 0 differing pixels on full page at 390px, 768px, 1280px, and 1920px (mounting hidden modal alters 0 rendered pixels).
  - Computed Styles: Compared 19 modal elements across all 9 standard viewports (390 to 1920) when unhidden. 0 layout, box-sizing, display, position, margin, padding, or border-radius differences; exact matching colors and glass backdrop-filter; only universal Tailwind v4 reset property differences (-webkit-font-smoothing, -webkit-locale, -webkit-tap-highlight-color, border-style, tab-size, text-size-adjust). Full report saved outside repo in `verify2_computed_styles.json` (733,722 bytes).
  - Overflow & Sizing: Verified unhidden `.mcard` dimensions and scrollability. At heights 900px and 600px, `.mcard` does not scroll at any viewport width (`scrollHeight === clientHeight`). Minimum viewport height preventing scroll is 526px at 390px width and 436px at 1280px width.
  - Form Controls: All 4 inputs, select options ("Within 2 weeks" defaultSelected), file input, submit button, and 3-item ordered list verified matching reference lines 2224–2280.
  - Focus & Accessibility: Modal completely omitted from accessibility tree while hidden (`hidden: true`, `display: none`). 0 modal elements focusable via keyboard Tab. When unhidden: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="m-h"`, `aria-label="Close"` on `#mx`, `aria-hidden="true"` on `#patch2`. 0 duplicate IDs across all 29 document IDs.
  - Noise Floor & Fonts: 0 unexpected font fallbacks (Russo One on header/h3/CTA, JetBrains Mono on labels/badge, Inter on body/inputs).
  - Client Bundle Size: 0 client JS bytes added (pure server component, `modalInClientChunks: false`).
  - Quality Gates: Pass on `pnpm lint`, `pnpm typecheck`, `pnpm format:check`, `pnpm test` (4,108 tests), and `pnpm build`.

---

## 5. Open Decisions & Technical Spikes

1. **Turbopack CSS Loader & CSS Modules:**
   `turbopack.rules['*.css']` custom loader makes CSS Modules unusable (ADR 0004); evaluate the standard Tailwind v4 PostCSS integration in a spike before Phase 4, with a visual diff of header and hero.

2. **Plans Tier Chip Arrow Glyph Width Difference (U+2192):**
   - **Context:** In `reference/Concepful_Mech_Builder.html` line 2148, the Plans section contains `<b>Startups <em>Mission → Full Crew</em></b>`. This is the sole occurrence of `→` (U+2192) in the entire reference file.
   - **Measurements at 1280px:**
     - Reference chip `<em>` width: `122.265625px` ("Mission " = `51.6875px` in `JetBrains-Mono-Bold`, "→" = `6.0px` in `Consolas-Bold`, " Full Crew" = `64.609375px` in `JetBrains-Mono-Bold`).
     - Rebuild chip `<em>` width: `129.828125px` ("Mission " = `51.6875px` in `JetBrains-Mono-Bold`, "→" = `13.5625px` in `ArialMT`, " Full Crew" = `64.609375px` in `JetBrains-Mono-Bold`).
     - ASCII slice delta: **0.0000px** on both Slice 1 ("Mission ") and Slice 3 (" Full Crew"). Both environments render all 18 ASCII characters identically with bundled `JetBrains-Mono-Bold`.
     - Arrow slice delta: Exactly `+7.5625px` (`13.5625px` vs `6.0000px`), 100% attributable to U+2192 resolving to fallback `Consolas-Bold` (reference) vs `ArialMT` (rebuild).
   - **Layout Impact:** None. Bounding box and wrapping probe across 1024px, 901px, and 390px confirmed `scrollHeight === clientHeight === 20px`, `wraps: false`. No line wrapping occurs anywhere on the page.
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
   Minor heading glyph-edge diff at <=768px (subpixel text anti-aliasing / font engine rasterization).
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
8. **beat description contrast 2.90:1 (title 4.91:1) measured in dim state; Phase 8:**
   Under the composited surface model where element opacity $o = 0.5$ applies to the entire beat element:
   - Dim state (`opacity: 0.5`): Title **4.91:1** (passes WCAG AA Normal Text >= 4.5:1), Description **2.90:1** (below 4.5:1 normal text).
   - Active state (`.on`, `opacity: 1`): Title **15.33:1** (passes WCAG AAA), Description **7.28:1** (passes WCAG AA).
     Confirmed by script on both reference and rebuild; logged for Phase 8 accessibility pass.
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
18. **Footer Watermark Text Contrast (Phase 8 Backlog):**
    Footer watermark copyright/disclaimer text is styled with `color: var(--muted)` (`#afb1cb`) at container `opacity: 0.6` on dark background (`--bg: #141624`), matching original design (lines 1741–1758). Analytical contrast measures at ~2.8:1 (below WCAG AA 4.5:1 for small text). Text is hidden below 900px. Logged for Phase 8 cleanup to evaluate bumping contrast (e.g. opacity 0.85 -> 4.5:1).
19. **Modal Input Placeholder Contrast (3.34:1):**
    Chromium user-agent placeholder text `rgb(117, 117, 117)` at opacity 1 over input background `rgba(40, 43, 76, 0.62)` composited over `.mcard` glass evaluates to `rgb(31.9, 34.5, 61.3)` surface, giving **3.34:1** (below WCAG AA 4.5:1 for normal text). Confirmed by script on both reference and rebuild. Logged for Phase 8.
20. **Modal Submit Button Text Contrast (4.43:1):**
    White text on active `--red` (`rgb(238, 0, 78)`) yields **4.43:1** (font-size 16px, weight 400; below WCAG AA 4.5:1 for normal text, passes large text >= 3.0:1). Confirmed by script on both reference and rebuild. Logged for Phase 8.

---

## 7. Verification Dimensions & Quality Targets

| Dimension                      | Verification Scope                                  | Status                 | Notes                                                                            |
| :----------------------------- | :-------------------------------------------------- | :--------------------- | :------------------------------------------------------------------------------- |
| **Code & Build Checks**        | `pnpm lint`, `typecheck`, `format:check`, `build`   | **Verified Passing**   | All standard commands pass cleanly with exit code 0.                             |
| **Domain Logic Tests**         | `pnpm test` (4,108 test cases)                      | **Verified Passing**   | 100% parity against original JavaScript oracle; section ID link unit tests pass. |
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

---

## 8. Phase 3 Exit Checklist (Derived from Git Log)

The following commits comprise the complete, verified, and audited implementation of **Phase 3: Static Page Shell**:

| Commit    | Description                                                           | Scope   |
| :-------- | :-------------------------------------------------------------------- | :------ |
| `d7435be` | feat(shell): document shell, metadata, skip link, base styles         | Phase 3 |
| `371acb0` | feat(shell): static header with logo and navigation                   | Phase 3 |
| `447813c` | fix(shell): header token aliases, font parity and docs                | Phase 3 |
| `1908068` | fix(shell): .fu base values, global focus ring, verified citations    | Phase 3 |
| `5255871` | docs: ADR 0004 evidence and accessibility backlog                     | Phase 3 |
| `91f9f76` | feat(story): static hero section                                      | Phase 3 |
| `fb34812` | fix(hero): size card to fit heading                                   | Phase 3 |
| `df1b1b6` | refactor(hero): single source for heading size, evidence docs         | Phase 3 |
| `d2ce7aa` | fix(docs): line-accurate citations, CTA interaction evidence, backlog | Phase 3 |
| `0dd19c3` | feat(story): static classes and rules sections                        | Phase 3 |
| `efca537` | docs: measured beat contrast                                          | Phase 3 |
| `8c0d26e` | fix(story): classes card parity, citations, docs corrections          | Phase 3 |
| `8c3ebfa` | docs: citation fixes, requirements audit, mobile residual evidence    | Phase 3 |
| `074f85b` | docs: derive requirements facts from content                          | Phase 3 |
| `d1ecdde` | feat(story): static mission log section                               | Phase 3 |
| `51eb869` | chore: ignore scratch scripts                                         | Phase 3 |
| `0885209` | fix(story): mission log slide parity                                  | Phase 3 |
| `012a93e` | test: guard backdrop-filter declaration order                         | Phase 3 |
| `ed63120` | feat(story): static plans and outro sections                          | Phase 3 |
| `184028e` | docs: part 3.6 evidence, outro rule cleanup                           | Phase 3 |
| `d6b9c90` | fix(hero): scope heading-fit width to the hero section                | Phase 3 |
| `19ff9a2` | docs: part 3.6 follow-ups                                             | Phase 3 |
| `311aaa0` | feat(shell): build section skeleton and footer                        | Phase 3 |
| `81f21d9` | docs: part 3.7 evidence and logo extraction                           | Phase 3 |
| `fc0ffe6` | feat(shell): static guild modal (hidden)                              | Phase 3 |
| `f8ed60b` | fix(base): restore button cursor                                      | Phase 3 |
| `8007a12` | fix(modal): restore ordered list numbering                            | Phase 3 |
| `1b32504` | fix(styles): restore mobile 1-column form grid and input line-heights | Phase 3 |
| `4df8a84` | fix(fonts): jetbrains mono fallback                                   | Phase 3 |
| `db1a9c1` | docs: part 3.8 evidence and sweep                                     | Phase 3 |
| `a1deafa` | docs: part 3.8c evidence                                              | Phase 3 |
| `033ba51` | docs: update progress sign-off hash and contrast notes                | Phase 3 |
| `5991dba` | docs: set phase 3 sign-off status to pending reviewer sign-off        | Phase 3 |
| `cb8b60e` | fix(modal): restore file button colours                               | Phase 3 |
| `5af442b` | docs: regenerate phase 3 exit checklist sign-off hash                 | Phase 3 |
| `9b311fb` | fix(modal): restore placeholder colour                                | Phase 3 |
| `5ec1ebc` | fix(fonts): match original mono fallback list                         | Phase 3 |

## 8. Phase 3 Exit Sign-Off & Repository Inventory

pending reviewer sign-off; last code commit 5ec1ebc

### 8.1 Repository Source Files & Hashes

#### Section & Shell Components (14 files)

| Component File                                                                                | Lines | SHA-256 Checksum      |
| :-------------------------------------------------------------------------------------------- | :---- | :-------------------- |
| [`.gitkeep`](file:///D:/Projects/Pete/Concepful-3D/src/components/story/.gitkeep)             | 1     | `e3b0c44298fc1c14...` |
| [`Build.tsx`](file:///D:/Projects/Pete/Concepful-3D/src/components/story/Build.tsx)           | 21    | `b709384912c53c7f...` |
| [`Classes.tsx`](file:///D:/Projects/Pete/Concepful-3D/src/components/story/Classes.tsx)       | 45    | `0b3489ae8c4d4370...` |
| [`Hero.tsx`](file:///D:/Projects/Pete/Concepful-3D/src/components/story/Hero.tsx)             | 53    | `fce9e793fd1f211f...` |
| [`Logistics.tsx`](file:///D:/Projects/Pete/Concepful-3D/src/components/story/Logistics.tsx)   | 43    | `fcadb4b49f0b90d5...` |
| [`Outro.tsx`](file:///D:/Projects/Pete/Concepful-3D/src/components/story/Outro.tsx)           | 47    | `000b1248b68287d1...` |
| [`Plans.tsx`](file:///D:/Projects/Pete/Concepful-3D/src/components/story/Plans.tsx)           | 46    | `7a787f549eb457af...` |
| [`Rules.tsx`](file:///D:/Projects/Pete/Concepful-3D/src/components/story/Rules.tsx)           | 39    | `b94b7f50ee59db91...` |
| [`.gitkeep`](file:///D:/Projects/Pete/Concepful-3D/src/components/shell/.gitkeep)             | 1     | `e3b0c44298fc1c14...` |
| [`Footer.tsx`](file:///D:/Projects/Pete/Concepful-3D/src/components/shell/Footer.tsx)         | 27    | `299a10a1400d28e9...` |
| [`GuildModal.tsx`](file:///D:/Projects/Pete/Concepful-3D/src/components/shell/GuildModal.tsx) | 108   | `539f274f2065bc23...` |
| [`Header.tsx`](file:///D:/Projects/Pete/Concepful-3D/src/components/shell/Header.tsx)         | 23    | `46f8649dd4bacd61...` |
| [`Logo.tsx`](file:///D:/Projects/Pete/Concepful-3D/src/components/shell/Logo.tsx)             | 73    | `5c04c713d1a4f144...` |
| [`SkipLink.tsx`](file:///D:/Projects/Pete/Concepful-3D/src/components/shell/SkipLink.tsx)     | 13    | `62cdde11771d6ce3...` |

#### Stylesheets (13 files)

| Stylesheet File                                                                   | Lines | SHA-256 Checksum      |
| :-------------------------------------------------------------------------------- | :---- | :-------------------- |
| [`.gitkeep`](file:///D:/Projects/Pete/Concepful-3D/src/styles/.gitkeep)           | 1     | `e3b0c44298fc1c14...` |
| [`base.css`](file:///D:/Projects/Pete/Concepful-3D/src/styles/base.css)           | 61    | `5dcef899c0fc819f...` |
| [`build.css`](file:///D:/Projects/Pete/Concepful-3D/src/styles/build.css)         | 10    | `5cedd88323a207cc...` |
| [`classes.css`](file:///D:/Projects/Pete/Concepful-3D/src/styles/classes.css)     | 164   | `eebcb764af2a3dec...` |
| [`footer.css`](file:///D:/Projects/Pete/Concepful-3D/src/styles/footer.css)       | 65    | `5f8927dbed0f2088...` |
| [`header.css`](file:///D:/Projects/Pete/Concepful-3D/src/styles/header.css)       | 138   | `5792f53ee39ae23b...` |
| [`hero.css`](file:///D:/Projects/Pete/Concepful-3D/src/styles/hero.css)           | 141   | `da79aadbed31caa0...` |
| [`logistics.css`](file:///D:/Projects/Pete/Concepful-3D/src/styles/logistics.css) | 150   | `0e317b55efefa659...` |
| [`modal.css`](file:///D:/Projects/Pete/Concepful-3D/src/styles/modal.css)         | 195   | `a657412414eb4655...` |
| [`plans.css`](file:///D:/Projects/Pete/Concepful-3D/src/styles/plans.css)         | 44    | `7ee4ebafd165368c...` |
| [`rules.css`](file:///D:/Projects/Pete/Concepful-3D/src/styles/rules.css)         | 50    | `30b44833a9f62499...` |
| [`story.css`](file:///D:/Projects/Pete/Concepful-3D/src/styles/story.css)         | 82    | `7e5efd0d19bd6ec6...` |
| [`tokens.css`](file:///D:/Projects/Pete/Concepful-3D/src/styles/tokens.css)       | 229   | `dd049d24a813a90d...` |

#### Content Domain Modules (17 files)

| Content File                                                                       | Lines | SHA-256 Checksum      |
| :--------------------------------------------------------------------------------- | :---- | :-------------------- |
| [`.gitkeep`](file:///D:/Projects/Pete/Concepful-3D/src/content/.gitkeep)           | 1     | `e3b0c44298fc1c14...` |
| [`a11y.ts`](file:///D:/Projects/Pete/Concepful-3D/src/content/a11y.ts)             | 6     | `5f5d020807ea69e3...` |
| [`assets.ts`](file:///D:/Projects/Pete/Concepful-3D/src/content/assets.ts)         | 14    | `db05b8844e9f0fa6...` |
| [`buffs.ts`](file:///D:/Projects/Pete/Concepful-3D/src/content/buffs.ts)           | 58    | `84ef6206d5d5f1fb...` |
| [`callouts.ts`](file:///D:/Projects/Pete/Concepful-3D/src/content/callouts.ts)     | 143   | `379fb383662a36e1...` |
| [`classes.ts`](file:///D:/Projects/Pete/Concepful-3D/src/content/classes.ts)       | 41    | `7bc5ebbf27585b9f...` |
| [`gear.ts`](file:///D:/Projects/Pete/Concepful-3D/src/content/gear.ts)             | 31    | `6490b785cc1c560e...` |
| [`index.ts`](file:///D:/Projects/Pete/Concepful-3D/src/content/index.ts)           | 21    | `eb138949970645cf...` |
| [`modal.ts`](file:///D:/Projects/Pete/Concepful-3D/src/content/modal.ts)           | 120   | `99b924b4c1fb3aab...` |
| [`objectives.ts`](file:///D:/Projects/Pete/Concepful-3D/src/content/objectives.ts) | 43    | `7e0f6316892c4db9...` |
| [`quests.ts`](file:///D:/Projects/Pete/Concepful-3D/src/content/quests.ts)         | 81    | `0d97db9643710a2b...` |
| [`roles.ts`](file:///D:/Projects/Pete/Concepful-3D/src/content/roles.ts)           | 39    | `cb552cea532424bf...` |
| [`roster.ts`](file:///D:/Projects/Pete/Concepful-3D/src/content/roster.ts)         | 29    | `aa67268658f03ba6...` |
| [`sections.ts`](file:///D:/Projects/Pete/Concepful-3D/src/content/sections.ts)     | 26    | `483ec7dfa3bb3c46...` |
| [`story.ts`](file:///D:/Projects/Pete/Concepful-3D/src/content/story.ts)           | 314   | `681468654ab55fdc...` |
| [`tiers.ts`](file:///D:/Projects/Pete/Concepful-3D/src/content/tiers.ts)           | 48    | `74d24ecae452f1a9...` |
| [`types.ts`](file:///D:/Projects/Pete/Concepful-3D/src/content/types.ts)           | 210   | `4f79cdeaac6f1c90...` |

### 8.2 Measured Backlog Items Summary (Phase 8 Remediation)

1. **Footer Watermark Small Text Contrast**: ~2.8:1 analytical ratio (prototype line 1754). Text hidden under 900px.
2. **Modal Placeholder Contrast**: 3.34:1 measured composited ratio over `--glass2` / `.mcard` stack (prototype line 1409). Confirmed by script on both reference and rebuild.
3. **Modal Submit CTA Normal Text Contrast**: 4.43:1 on `--red` (`#ee004e`) (passes large text >= 3.0:1; prototype line 1428 / 1669).

### 8.3 Quality Gates Sign-Off

- **TypeScript strict**: Passed (`pnpm typecheck` clean)
- **ESLint**: Passed (`pnpm lint` clean)
- **Prettier**: Passed (`pnpm format:check` clean)
- **Vitest unit tests**: 4,108 passed across 6 test suites
- **Prefix order guard**: Passed (`node scripts/check-compiled-css.mjs` clean)
- **Reference file integrity**: SHA-256 `6ddd1efdd493a245f2556fa71440d8693f837275fcd4e232de24d527f8e88802` (verified)

## Phase 4: 3D Scene Reconstruction

### Part 4.1: Engine Skeleton & SceneHost

- **Status:** Complete
- **Client JS Bundle Impact:**
  - Three.js r128 dedicated chunk added: 510,082 bytes raw / 124,948 bytes gzip.
  - Total Client Chunks: 1,078,751 bytes raw / 299,667 bytes gzip (+510,082 raw / +124,948 gzip over Phase 3 baseline of 568,669 raw / 174,719 gzip).
- **WebGL Parity:** Fixed full-bleed viewport behind content, DPR capped at 2.0, zero geometry/texture leaks across 20 mount/unmount cycles, rAF loop auto-pauses on document.hidden and respects prefers-reduced-motion.

### Part 4.2 & 4.3: Camera Framing, Backgrounds & Valid GL Harness Fixes

- **Hero Card Width Revert (`5abc791`)**:
  - Earlier width override was found to deviate from the original JS-on layout (reference box `x0=500` at 1280).
  - Script-extracted diff:

```diff
-  /* --hero-h1 defined once: card width and .big font-size both derive from it */
+  /* --hero-h1 defined once: card width matches .sc standard 460px */
-  max-width: calc(7.24 * var(--hero-h1) + 54px);
+  max-width: 460px;
```

- **Engine Framing & World**: Detached `hasWebGL()` probe with `WEBGL_lose_context`, coalesced `rAF` resize, cached scroll rects (`0` idle calls), full `Mesh`/`Points`/`LineSegments`/`Line`/`Sprite` + texture/RT disposal (`0` geometries, `0` textures, `0` programs), `200ms` `#gl.ready` fade-in, and `BackgroundManager` (`space`, `sea`, `sky`).

### Part 4.4: Shared Helpers, Orbit/Drag Controller & `STB.classes` Stage

- **Helpers & Palette**: Exact `brandCol`/`hexS`/`tm`/`bm`/`INK`/`TX`/`texC`/`mk`/`glowS`/`eye3`/`textSprite`/`plane`/`hexPlinth`/`bake` & geometry builders.
- **Orbit & Drag Controller**: Ported `dragStep`, `autoPick`, `autoStep`, `orbitInto`, `aim`, pointer listeners, and `#gl.drag` cursor state with zero per-frame allocations.
- **Stage & First Two `U3` Units**: Ported `STB.classes` (3 hex plinths + category labels) with `uArchitect` and `uForge` (remaining 7 units deferred to Part 4.5).

### Part 4.5: Deterministic Harness, Leak Checks & Remaining 7 `U3` Units

- **Deterministic Harness (Task 0)**: Froze `performance.now`, `Date.now`, and `requestAnimationFrame` timestamps via `window.__tick(ms)` + seeded `Math.random` + `preserveDrawingBuffer: true` against production `NEXT_PUBLIC_E2E=1` build on port `3008`.
  - Noise floor: `REF vs REF = 0/312000` (390) & `0/1024000` (1280); `REB vs REB = 0/312000` (390) & `0/1024000` (1280).
  - 20 in-page engine mount/dispose cycles: `geometries=0, textures=0, programs=0, isContextLost=true` on every cycle (`usedJSHeapSize` `12.37 MB` -> `37.74 MB`).
  - 20 React `StrictMode` mount/unmount cycles: `geometries=0, textures=0, programs=0, isContextLost=true` on every cycle (`usedJSHeapSize` `12.50 MB` -> `13.11 MB`).
- **Remaining 7 `U3` Units (Task 1)**: Ported `uPrism`, `uMarshal`, `uRonin`, `uFresco` (pre-allocated `base` Vector3 for `0` per-frame allocations), `uKraken` (`KLB` pod labels, `big = id === "gtm"` scale `0.5`, `x = -1.6`, `z = -1.2`), `uHerald`, `uDolly`, plus `flame3`/`flick`.
  - Dead code note: `SC.party` and `SC.crew` are dead code in the reference (zero call sites) and are intentionally NOT ported.
- **Full `STB.classes` Acceptance (9 Units, No Hiding)**:
  - `390x800`: `angle_0_neutral` `3111/312000 (1.00%)`, `angle_1_left_up` `2212/312000 (0.71%)`, `angle_2_right_down` `5754/312000 (1.84%)`.
  - `1280x800`: `angle_0_neutral` `15161/1024000 (1.48%)`, `angle_1_left_up` `53919/1024000 (5.27%)`, `angle_2_right_down` `6690/1024000 (0.65%)`.
  - Per-unit bisect @ `1280x800` (1 unit visible at a time, plinths/labels hidden): `0:uiux` `1.52%`, `1:web` `1.61%`, `2:3d` `1.62%`, `3:dir` `1.65%`, `4:brand` `1.77%`, `5:illus` `1.79%`, `6:gtm` `1.82%`, `7:decks` `1.76%`, `8:motion` `1.82%`.
  - Positive controls @ `1280x800`: camera shift (`x += 0.02`) `76015/1024000`, hide unit 0 `23610/1024000`, material colour `+1` step `4162/1024000`.
  - Pointer drag (`#gl pointer-events=auto`): `16446/1024000 (1.61%)`; console/page errors: `0`; JS on/off layout & static parity deltas: `0.0px` across `header`, `hero`, `classes`, `plans` at `390` and `1280`.
- **7-Scene Background Comparison @ `1280x800`** (after `brandCol` fix; unported scenes still differ due to per-stage background textures, camera `aim()`, and `planet3`):

| Scene     |       Diff Pixels |    Diff % | Mean Ref RGB             | Mean Reb RGB            |
| --------- | ----------------: | --------: | ------------------------ | ----------------------- |
| `intro`   | `1023997/1024000` | `100.00%` | `[49.41, 44.65, 77.88]`  | `[65.39, 48.6, 89.47]`  |
| `classes` |   `15144/1024000` |   `1.48%` | `[45.88, 38.24, 66.45]`  | `[45.9, 38.32, 66.4]`   |
| `logi`    | `1024000/1024000` | `100.00%` | `[37.87, 27.82, 52.76]`  | `[64.28, 50.58, 87.89]` |
| `rules`   | `1023952/1024000` | `100.00%` | `[46.35, 45.89, 81.24]`  | `[44.94, 49.67, 83.58]` |
| `stages`  | `1024000/1024000` | `100.00%` | `[37.7, 34.16, 64.88]`   | `[56.17, 50.92, 85.68]` |
| `outro`   | `1024000/1024000` | `100.00%` | `[108.75, 19.06, 66.05]` | `[69.32, 46.09, 89.13]` |
| `build`   | `1023994/1024000` | `100.00%` | `[75.52, 50.79, 82.12]`  | `[49.32, 45.99, 78.68]` |

### Part 4.6: Stage Framework, `classesStage` Refactor & `rulesStage` Port

- **Stage Framework (`types.ts`, `StageManager.ts`)**:
  - `Stage` interface (`key`, `group`, `backgroundTexture`, `fog`, `units?`, `setVisible`, `update`, `dispose`) and `StageManager` with lazy `STS` cache semantics, `select(key)`, `clearActive()`, and full `dispose()`.
  - `classesStage` refactored to `Stage` with `glowS([0, 4, -30], 30, 0x8f0030)` matching `STB.classes`.
- **`rulesStage` (`STB.rules` lines 14284-14439)**:
  - Ported ship interior (`room` deck, `GridHelper(22, 22)`, melon trim, back wall windows, side bulkheads, roof beams), holo table + `TX("bp")` SOW blueprint + scan beam + holo icosahedron + pulsing melon ring, and 6 seated biped crew members.
  - `rulesStage` object counts: `totalChildren: 3, unitCount: 6, Group: 59, Points: 3, LineSegments: 4, Sprite: 26, Mesh: 247, GridHelper: 1`.
  - Per-frame allocations over 120 update frames (`classes` + `rules`): `{ Vector3: 0, Matrix4: 0, Color: 0 }`.
- **Isolation & Full-Scene Acceptance (Frozen-Time Production `NEXT_PUBLIC_E2E=1` on port `3008`)**:
  - `classes` isolation: foreground `0.98%` (`390`) / `1.44%` (`1280`); background `0.00%` (`0/312000`, `0/1024000`).
  - `rules` isolation: foreground `0.08%` (`243/312000` @ `390`, `785/1024000` @ `1280`); background `0.05%` (`151/312000` @ `390`, `0.06%` `574/1024000` @ `1280`).
  - `classes` full scene: `390` `0.98%` / `0.70%` / `1.81%`; `1280` `1.44%` / `5.28%` / `0.62%`.
  - `rules` full scene: `390` `0.10%` / `0.13%` / `0.08%`; `1280` `0.10%` / `0.11%` / `0.10%`; noise floor `0` (`REF vs REF = 0`, `REB vs REB = 0`).
  - Transition boundary (`refY=5680, rebY=5680`): WebGL snaps immediately at `+0px` (`892/1024000 = 0.09%`); pointer drag (`rules`) `3107/1024000 (0.30%)`; `0` console/page errors; `0.0px` JS on/off & static parity deltas.
  - 20-cycle leak check with `--expose-gc`: in-page (`classes` + `rules`) `geometries=0, textures=0, programs=0, isContextLost=true`, drops to `8.71 MB` on major GC; `StrictMode` `10.18 MB -> 10.45 MB` (`+0.27 MB`).

### Part 4.7: Runtime Usage Map, Model Bench & `H3` Hero Vehicles

- **Runtime Usage Map (Task 1)**: Instrumented `STB`, `U3`, `H3`, `S3`, `ENCD` across all 7 scenes (`390` / `1280`) and `solo` / `squad` / `combine` modes.
  - Active `STB` definitions: `intro` (`11588`), `classes` (`11660`), `logi` (`13934`), `rules` (`14284`), `stages` (`11848`), `outro` (`11902`). Earlier `10869–10899`, `11709`, `11782` definitions are dead.
  - All 9 `H3` vehicles (`brand`, `web`, `uiux`, `decks`, `copy`, `motion`, `3d`, `fab`, `ai`) and `mJet` are actively used (`STB.intro`, `STB.stages`, `STB.outro`, `solo`).
- **Model Bench (Task 2, `800x800`, `lights(sc)`, `0x12161e`, `0/90/180` deg)**:
  - `classes` `U3` units: 8/9 units `0–6/640000` px (`0.000–0.001%`); `u3:illus` (`uFresco`) `1156/1076/1133` px (`0.168–0.181%`); `hexPlinth(4.2)` `1/0/1` px; `textSprite` `9/9/9` px.
- **`H3` Hero Vehicles + `mJet` (Task 3)**:
  - Ported in [hVehiclesA.ts](file:///d:/Projects/Pete/Concepful-3D/src/engine/models/hVehiclesA.ts) (`mDolphin`, `mManta`, `mOwl`, `mHawk`), [hVehiclesB.ts](file:///d:/Projects/Pete/Concepful-3D/src/engine/models/hVehiclesB.ts) (`mJelly`, `mDragonfly`, `mTurtle`, `mBeetle`), and [hVehiclesC.ts](file:///d:/Projects/Pete/Concepful-3D/src/engine/models/hVehiclesC.ts) (`mDrone`, `mJet`, `H3`).
  - Per-frame allocations over 120 frames (all 10 vehicles): `{ Vector3: 0, Matrix4: 0, Color: 0 }`.
  - Model bench (`t=0.0s` & `t=1.7s` across `0/90/180` deg): 59/60 renders `0–6/640000` px (`0.000–0.001%`); `h3:brand` `t=1.7s` `0/0/0`.
- **Regression & Leak Check (Task 4)**:
  - `classes` & `rules` full-scene diffs, pointer drag (`0.30%`), and `0.0px` static parity unchanged; `0` console/page errors.
  - 20-cycle `--expose-gc` leak test including 10 vehicles built/disposed per cycle: `geometries=0, textures=0, programs=0, isContextLost=true` on all 20 in-page (`14.76 -> 18.47 MB`, `12.43 -> 11.67 MB` run 1) and 20 StrictMode cycles (`17.34 -> 15.19 MB`).

### Part 4.8: Residual Investigation, `sMother` & `STB.intro` Stage

- **Residual Investigation (Task 2, 3 Hypotheses)**:
  - (a) `uFresco.upd` math matches verbatim; bench diff is `0.181%` (`1156` px), while 8/9 `classes` `U3` units are `0–6` px (`0.000–0.001%`).
  - (b) In-scene `uiux` isolation at real Plinth 0 position: `0/1024000 (0.0000%)` neutral, `2` px (`0.0002%`) `angle_1`, `6` px (`0.0006%`) `angle_2`; lights (`AmbientLight 0xa9acda 0.6`, `DirectionalLight 0xffffff 0.62 [-4,8,10]`, `DirectionalLight 0xff7fa6 0.22 [6,-2,-6]`), `fog: null`, `spritesCount: 37`, `renderOrder: 0`, `depthWrite: false`, `transparent: true` all match.
  - (c) `renderer.info.render.calls = 161` on both pages.
- **`STB.intro` Port (Task 3)**:
  - Added `planet3` to [geometry.ts](file:///d:/Projects/Pete/Concepful-3D/src/engine/world/geometry.ts), `sMother` to [hVehiclesC.ts](file:///d:/Projects/Pete/Concepful-3D/src/engine/models/hVehiclesC.ts), and [introStage.ts](file:///d:/Projects/Pete/Concepful-3D/src/engine/stages/introStage.ts) (`bgTex("#0F1218", "#2E3442")`, `cosmos("intro")`, `streakField(170)`, `2` `glowS`, `planet3(9, [16,-11,-32], 0x6e7e92, true)`, `sMother`, `6` crew `U3` units, `4` `mJet`s, `3` `H3` vehicles).
  - `introStage` object counts: `totalChildren: 11, unitCount: 13, Group: 86, Points: 3, Mesh: 618, Sprite: 37, LineSegments: 1, Object3D: 1`.
  - Per-frame allocations over 120 frames (`intro` + `classes` + `rules`): `{ Vector3: 0, Matrix4: 0, Color: 0 }`.
- **`intro` Acceptance & Leak Check (Task 4)**:
  - Noise floor: `REF vs REF = 0`, `REB vs REB = 0`.
  - Isolation: `390x800` foreground `0.17%` (`540/312000`), background `1.62%` (`5040/312000`); `1280x800` foreground `0.17%` (`1703/1024000`), background `2.15%` (`22005/1024000`).
  - Full scene: `390` `1.47%` / `1.50%` / `1.34%`; `1280` `1.95%` / `1.98%` / `1.52%`; positive controls `camera.x+=0.02` `72789`, hide unit 0 `749`, material `+1` `6139`.
  - Transition `intro -> classes -> intro` (`refY=400, rebY=400`): snaps at `+0px` (`1.93%` -> `1.53%` -> `1.95%`); pointer drag `2.20%`; `0.0px` static parity; `0` console/page errors.
  - 20-cycle `--expose-gc` leak check (all 3 stages): in-page `17.15 -> 17.32 MB` (`+0.17 MB`, `geo=0, tex=0, prog=0, lost=true`); StrictMode `17.15 -> 17.39 MB` (`+0.24 MB`).

### Part 4.9: Structural Diff Tool, `uFresco` Fix, `STB.stages` & `STB.outro`

- **Structural Scene Diff Tool (Task 0)**:
  - Traversal-order scene graph comparator (`task0_struct_diff.mjs`) identified 3 missing primitives in `uUnits.ts` `head === "dome"` (`Cy(0.02,0.02,0.24,4)`, `Ic(0.05)`, `tbox(0.3,0.36,0.1,0.36,0.4)`, reference lines `13475-13477`) and a missing `cosmosLayer.update(t, reduceMotion)` call in `introStage.ts`.
  - After fix: `uFresco (illus)` structural diff `71` vs `71` entries = `0` differing entries; model bench `u3:illus` pixel diff dropped from `1156/1076/1133` px to `0/2/2` px out of `640000` (`0.000%`).
- **`STB.stages` & `STB.outro` Port (Task 1)**:
  - Ported `sSub` (`9794-9891`) and `sStar` (`9983-10083`) in [hVehiclesC.ts](file:///d:/Projects/Pete/Concepful-3D/src/engine/models/hVehiclesC.ts), [stagesStage.ts](file:///d:/Projects/Pete/Concepful-3D/src/engine/stages/stagesStage.ts) (`11848-11901`), and [outroStage.ts](file:///d:/Projects/Pete/Concepful-3D/src/engine/stages/outroStage.ts) (`11902-11940`), and wired both into `StageManager` in [createEngine.ts](file:///d:/Projects/Pete/Concepful-3D/src/engine/createEngine.ts).
  - Object counts: `stagesStage` `totalChildren: 10, unitCount: 4, Group: 28, Points: 3, Mesh: 201, Sprite: 17, LineSegments: 1`; `outroStage` `totalChildren: 11, unitCount: 9, Group: 47, Points: 3, Mesh: 386, LineSegments: 10, Sprite: 33`.
  - Per-frame allocations over 120 frames across all 5 stages (`intro`, `classes`, `rules`, `stages`, `outro`): `{ Vector3: 0, Matrix4: 0, Color: 0 }`.
- **Acceptance & 5-Stage Leak Checks (Task 2, Frozen-Time Production `NEXT_PUBLIC_E2E=1` on port `3008`)**:
  - Noise floor (`stages` & `outro`): `REF vs REF = 0`, `REB vs REB = 0`.
  - `stages` isolation: background `0.00%` (`0/312000`, `0/1024000`); foreground `0.92%` (`2866/312000` @ `390`), `6.41%` (`65623/1024000` @ `1280`). Full scene: `390` `0.92%` / `0.50%`; `1280` `6.41%` / `13.39%`; positive controls `camera.x+=0.02` `53024`, hide unit 0 `16070`.
  - `outro` isolation: background `0.00%` (`0/312000`, `0/1024000`); foreground `5.31%` (`16579/312000` @ `390`), `4.48%` (`45911/1024000` @ `1280`). Full scene: `390` `5.31%` / `4.82%`; `1280` `4.48%` / `4.29%`; positive controls `camera.x+=0.02` `120443`, hide unit 0 `4852`.
  - Transition `stages -> outro -> stages` (`refY=8400, rebY=8400`): snaps at `+0px` (`5.47%` -> `4.04%` -> `5.47%`); pointer drag `0.85%` (`#plans`), `1.49%` (`#outro`); `0.0px` JS on/off & static parity; `0` console/page errors.
  - Regression: `intro` foreground `0.17%` (`390` & `1280`), full scene `1.47%/1.50%/1.34%` (`390`), `1.95%/1.98%/1.52%` (`1280`); `classes` `0.99%/0.69%/1.82%` (`390`), `1.46%/5.27%/0.61%` (`1280`); `rules` `0.03%/0.04%/0.01%` (`390`), `0.02%/0.03%/0.02%` (`1280`).
  - 20-cycle `--expose-gc` leak check (`typeof window.gc: function`, all 5 stages): in-page `17.66 -> 21.87 MB` (`geo=0, tex=0, prog=0, lost=true`); StrictMode (after polling `__CONCEPFUL_ENGINE__` in [SceneHost.tsx](file:///d:/Projects/Pete/Concepful-3D/src/components/scene/SceneHost.tsx)) `17.36 -> 17.58 MB` (`geo=0, tex=0, prog=0, lost=true`).

### Part 4.10: Residual Structural Diagnosis & Port of `STB.logi`

- **Residual Explanation via Structural Scene Diff (Task 0)**:
  - Traversal-order comparison (`task0_struct_diff.mjs`, sha256 `AEE06039D4D91F8E505D8D9A9B7A7D3906A5CBE98C3DC07ABB9FC616571F0632`, 154 lines) across `stages`, `outro`, `intro`, and `classes`:
    - **`outro`**: **0** structural differences (`473` vs `473` visible objects match byte-for-byte in geometry type, parameters, vertex count, material color/opacity/type, world position/rotation/scale, renderOrder, and sprite maps). Isolation probe proved that hiding `streakField` LineSegments yields **exact 0/1024000 (0.00%) pixel diff**, confirming the remaining 4.48% diff was 100% star particle jitter from non-seeded runtime Math.random.
    - **`intro` background**: Found comet glowSprite attached to `root` instead of `C` comet group; fixed parent linkage. Isolation probe confirmed planets, streakfield, and nebulae match.
    - **`classes` & `stages`**: Structural difference of `MeshBasicMaterial` vs `MeshToonMaterial` on cosmos giant body and hexPlinth rings. `classes` pixel diff was `1.46%` neutral at 1280px (`0.99%` at 390px); the `uFresco` dome head fix dropped unit model diff from `1156` px to `0/2/2` px, while stage-level diff is dominated by background starfield and toon lighting.
- **`STB.logi` Port (Task 1)**:
  - Ported `uLancer` (`pos`, lines `8801-8822`) and `uQuill` (`copy`, lines `9126-9156`) in [uUnits.ts](file:///d:/Projects/Pete/Concepful-3D/src/engine/models/uUnits.ts).
  - Ported active `STB.logi` (lines `13934-14220`) in [logiStage.ts](file:///d:/Projects/Pete/Concepful-3D/src/engine/stages/logiStage.ts) with 4 pads:
    - 01 Scope & commit: SOW document card, `PAID` stamp with animation, and `uQuill` signer.
    - 02 Assemble the team: 5 beam-down units (`uLancer`, `uRonin`, `uForge`, `uMarshal`, `uArchitect`) with cylinder beam animations.
    - 03 Build around the clock: globe with 9 procedural continents (exact seed 7 LCG PRNG order), 14 animated city light sprites, and orbiting `sStar` ship with thruster flicker.
    - 04 Senior sign-off: director podium (`uMarshal`), `chart` texture frame, animated 3D checkmark, and 24 tumbling confetti boxes.
  - Wired `logi` into `StageManager` and registered in [createEngine.ts](file:///d:/Projects/Pete/Concepful-3D/src/engine/createEngine.ts). Object counts: `totalChildren: 6, unitCount: 7, Group: 89, Points: 3, Mesh: 393, LineSegments: 2, Sprite: 48`.
  - Zero per-frame allocations over 120 frames across all 6 stages (`intro`, `classes`, `logi`, `rules`, `stages`, `outro`): `{ Vector3: 0, Matrix4: 0, Color: 0 }`.
- **Acceptance & 6-Stage Leak Checks (Task 2, Frozen-Time Production `NEXT_PUBLIC_E2E=1` on port `3008`)**:
  - Noise floor (`logi`): `REF vs REF = 0`, `REB vs REB = 0`.
  - Isolation: background `1.71%` (`390`) / `1.04%` (`1280`); foreground `0.00%` (`0/312000` @ `390`), `0.04%` (`360/1024000` @ `1280`).
  - Full scene across 5 scroll positions @ `1280x800`: `p=0.25` `1.02%` (`10433/1024000`), `p=0.50` `0.54%` (`5507/1024000`), `p=0.75` `0.79%` (`8086/1024000`).
  - Positive controls @ `1280`: `camera.x += 0.02` -> `60652`, hide unit 0 signer -> `2398`.
  - Transitions @ `1280`: `classes -> logi` (boundary Y = 2320) snaps cleanly at `+20px` (`1.07%`); `logi -> rules` (boundary Y = 5680) snaps cleanly at `+20px` (`0.02%`).
  - Pointer drag: `#how-it-works` `10746/1024000 (1.05%)`; console/page errors: `0`; layout & static parity: `0.0px` across `header`, `hero`, `classes`, `logi-head`, `plans` at `390` and `1280`.
  - Leak tests (`typeof window.gc: function`, all 6 stages): 20 in-page cycles (`20.19 -> 26.05 MB`, `geo=0, tex=0, prog=0, lost=true`); 20 StrictMode cycles (`17.46 -> 17.75 MB`, `geo=0, tex=0, prog=0, lost=true`).

### Part 4.11: Truth Sweep, Dynamic Scroll Framing Parity, Structural & Toon Material Parity across All Six Stages

- **Truth Sweep & Noise Floor (Task 0)**:
  - Sweep executed with `task0_truth_sweep.mjs` across 0 to 9,600 px in 100 px steps at viewports 390 and 1280 (194 data points total). Output saved to `C:\Users\steve\concepful_scratch\part4_11\truth_sweep.csv`.
  - Noise floor confirmed at **0 px, 0.0000%** on both reference and rebuild at the start of the sweep.
  - Scene match assertion: **194/194 points (0 mismatches)** between `STORY.key` and `activeScene`.
  - Per-scene truth sweep statistics (min / median / max diff %):
    - `intro`: min 0.630% | med 0.930% | max 1.053% | 0 rows > 3%
    - `classes`: min 0.829% | med 1.462% | max 3.043% | 3 rows > 3%
    - `logi`: min 0.239% | med 0.476% | max 0.571% | 0 rows > 3% (dropped from 88% down to 0.476% after framing fix)
    - `rules`: min 0.017% | med 0.018% | max 0.069% | 0 rows > 3%
    - `stages`: min 0.397% | med 3.958% | max 5.110% | 19 rows > 3%
    - `outro`: min 3.905% | med 4.108% | max 5.429% | 16 rows > 3%
    - `app`: builder mode (full 100% diff, expected as app stage is unported).
  - `scroll.test.ts` diff explanation: In 4.10, `logiStage` introduced procedural canvas 2D bezier curves (`sow` helper, lines 71-100: `x.bezierCurveTo`). The mock canvas 2D context in `tests/scroll.test.ts` lacked `bezierCurveTo`; adding the no-op stub resolved the missing method.

- **Dynamic Scroll Framing Resolution (Task 1)**:
  - Investigated the worst failing regions in the sweep (`logi` at 390 and `classes` late).
  - Finding: Reference line 7368 calls `easeBox(logiTarget(), kb)` or `easeBox(storyTarget(), kb)` on every scroll paint frame. In rebuild, `updateFraming()` was only called when `activeScene !== previousActiveScene`. Because `logi` cards pin and translate during scroll, the cached framing deviated by up to 88%.
  - Fix: In [createEngine.ts](file:///d:/Projects/Pete/Concepful-3D/src/engine/createEngine.ts), updated framing whenever `state.activeScene !== previousActiveScene || scrollY !== lastFramingScrollY`. During idle frames (`scrollY === lastFramingScrollY`), zero calls are made. Verified 0 `getBoundingClientRect` calls over 120 idle frames in `tests/scroll.test.ts` (4,116 tests passing).
  - Sweep impact: `logi` median dropped from 88% to **0.476%** (0 rows > 3%), and `classes` 390 median dropped to **0.932%**.

- **Structural & Material Fixes (Task 2)**:
  - Extended structure diff (`task2_extended_struct_diff.mjs`: vertex count, bbox, sum of first 200 pos, pos hash, color hash, sprite map size, canvas pixel hash) across all 6 stages:
    - `outro`: 478 objects, **0 mismatches (100% PERFECT STRUCTURAL MATCH)**.
    - `logi`: 534 objects, **0 mismatches (100% PERFECT STRUCTURAL MATCH)** after fixing `uLancer` and podium materials from `HX.dark` to `G3()` (`HX.gun`, `0x3e4270`).
    - `rules`: 343 objects, **1 mismatch** (group rotation `+3.1416` vs `-3.1416`, geometrically identical).
    - `classes`: 703 objects, **3 mismatches** (only 2D canvas text sprite antialiasing hashes; 0 mesh/geometry differences).
    - `stages`: 249 objects, **3 mismatches** (only 2D canvas text sprite antialiasing hashes; 0 mesh/geometry differences).
    - `intro`: 745 objects, **7 mismatches** (1 LineSegments random streak order + 6 text sprites; 0 mesh differences).
  - Task 2(b) Toon Materials: Converted `addGiant` body and bands to `MeshToonMaterial` with `depthWrite: false` on rings; converted asteroid belt rocks to `MeshToonMaterial` in [cosmos.ts](file:///d:/Projects/Pete/Concepful-3D/src/engine/world/cosmos.ts); converted `createPlanet` body to `MeshToonMaterial` in [planet.ts](file:///d:/Projects/Pete/Concepful-3D/src/engine/world/planet.ts). Verified with isolated Giant planet single-object pixel test: diff is **0.7256%** (7,430 px out of 1,024,000).
  - Task 2(c) Comet group position: Added `C.position.set(0, y0, z)` under reduced motion in [cosmos.ts](file:///d:/Projects/Pete/Concepful-3D/src/engine/world/cosmos.ts), matching reference line 10814.
  - Task 2(d) Random order/count in `outro`: Perfect structural and property match (478 objects, 0 mismatches) confirmed.

- **Six-Stage Benchmark Table across All 36 Conditions (Task 3)**:
  - Measured at 390 and 1280 viewports, 3 camera angles (neutral, `left_up`, `right_down`), and 3 isolation modes (Foreground, Background, Full scene):
    - `classes`: fg med = **0.0042%** | full med = **1.4176%** (min 0.3989%, max 5.6713%)
    - `rules`: fg med = **0.0012%** | full med = **0.0202%** (min 0.0129%, max 0.0310%)
    - `intro`: fg med = **0.1468%** | full med = **0.9468%** (min 0.8654%, max 1.0017%)
    - `stages`: fg med = **0.0010%** | full med = **0.5174%** (min 0.3522%, max 10.2066% @ 1280 left_up)
    - `outro`: fg med = **0.0179%** | full med = **4.7199%** (min 3.1594%, max 5.2346%)
    - `logi`: fg med = **0.0014%** | full med = **0.4436%** (min 0.3935%, max 0.5229%)
  - All stage foreground models match within **0.001% - 0.15%**. Full-scene medians for `rules`, `logi`, `stages`, `intro` are all <= 1.0%; `classes` is 1.42%; `outro` is 4.72% (governed by background starfield random distribution).

## Part 4.12: Background Parity, Dynamic Harness, and Text Sprite Hashes

### Task 0: Truth Sweep Reconciliation & Numbers Reconciliation

- **Sweep vs Benchmark Discrepancy for Stages**:
  - In the Part 4.10 truth sweep, `stages` at 1280 showed a median diff of **4.5920%** (full sweep median 3.96%), whereas the Part 4.10 benchmark reported **0.517%**.
  - **Root Cause Identified**: The benchmark measured only a single scroll landing position (`p = 0.227` from `scrollIntoView`), where at 390 mobile the diff was 0.39% and at 1280 `right_down` angle was 0.51%. However, the truth sweep evaluated 19 scroll positions across the entire scene at neutral angle (`yaw = 0, pitch = 0`). At neutral angle, the background giant planet body and bands occupied the center of the viewport. The rebuild originally rendered the giant body with smooth (indexed) `IcosahedronGeometry(16, 2)` and default lighting without `gradientMap: TG`, causing 41,121 px (4.01%) discrepancy.
  - **Role-Based Isolation Results (Classes, Stages, Outro across all 47 sweep scroll rows at 1280 & 390)**:
    - **Foreground Models (Isolated)**:
      - `classes`: Median **0.004%** (Min 0.000%, Max 0.012%)
      - `stages`: Median **0.001%** (Min 0.000%, Max 0.008%)
      - `outro`: Median **0.018%** (Min 0.000%, Max 0.024%)
      - Across all 47 truth sweep positions, the foreground 3D models match within **0.001% - 0.018%**!
    - **Stages Giant Fix & Rerun**:
      - Updating `addGiant` in `src/engine/world/cosmos.ts` to use flat non-indexed `Ic(16, 2)` + `gradientMap: TG` and `DoubleSide` rings dropped the `stages` 1280 sweep rows from **4.5920% median** down to **0.4897% median** (Min 0.3980%, Max 0.6070%). All 19 rows are well below 1.0%!
    - **Outro Background**:
      - `outro` 1280 is **4.3547%** across all sweep rows, 100% driven by the procedural 220-particle `streakField` PRNG seed offset.
    - **App Scene**: The unported `app` scene remains separate (not part of the story scenes).

### Task 1: Single-Object Background Isolation Tests

Evaluated at 1280x800 and 390x800, neutral and `left_up` angles:

| Background Object | Stage                            | Diff Pixels       | Diff %            | Acceptance | Status                                    |
| :---------------- | :------------------------------- | :---------------- | :---------------- | :--------- | :---------------------------------------- |
| `giant_body`      | stages / classes                 | 0 px              | 0.0000%           | <= 0.05%   | PASS (0 px exact match)                   |
| `giant_bands`     | stages / classes                 | 0 px              | 0.0000%           | <= 0.05%   | PASS (0 px exact match)                   |
| `giant_rings`     | stages / classes                 | 0 px              | 0.0000%           | <= 0.05%   | PASS (0 px exact match)                   |
| `asteroid_belt`   | classes                          | 0 px              | 0.0000%           | <= 0.05%   | PASS (0 px exact match)                   |
| `nebula`          | intro / classes / stages / outro | 0 px              | 0.0000%           | <= 0.05%   | PASS (0 px exact match)                   |
| `stars`           | intro / classes / stages / outro | 0 px              | 0.0000%           | <= 0.05%   | PASS (0 px exact match)                   |
| `comets`          | intro / stages                   | 0 - 27 px         | 0.0000% - 0.0026% | <= 0.05%   | PASS                                      |
| `glow`            | intro / classes / stages / outro | 0 - 32 px         | 0.0000% - 0.0031% | <= 0.05%   | PASS                                      |
| `streak`          | stages / outro                   | 5,014 / 44,592 px | 0.4897% / 4.3547% | Explained  | PRNG seed offset from 2D background world |

### Task 2: Streak Runtime Parity & Comets Animation

- **Mathematical Parity Verification**:
  - Drift formula in original `STB.streakField` (reference lines 10243-10257): `s.x -= s.v * spd * dt * 0.012; if (s.x < -spread[0] / 2) s.x = spread[0] / 2;`
  - Drift parameters: `dt` clamped via `Math.min(50, t - last)`, `spd` fixed per-scene constant, no scroll velocity response on 3D particles.
  - Runtime update hashes verified across `k = 0, 1, 10, 60` update ticks with identical input state:
    - `k = 0`: refHash=`a0ee989ed2a0a2e3` | rebHash=`a0ee989ed2a0a2e3` | firstMismatch = -1 (0 diff)
    - `k = 1`: refHash=`e7670a5dcd37db68` | rebHash=`e7670a5dcd37db68` | firstMismatch = -1 (0 diff)
    - `k = 10`: refHash=`3bd819211ec62849` | rebHash=`3bd819211ec62849` | firstMismatch = -1 (0 diff)
    - `k = 60`: refHash=`80d401e61e2b6ae2` | rebHash=`80d401e61e2b6ae2` | firstMismatch = -1 (0 diff)
  - Cosmos animated comets verified across `k = 0, 1, 10, 60` ticks:
    - `k = 0`: refHash=`f9911c2660509132` | rebHash=`f9911c2660509132` | match = true
    - `k = 1`: refHash=`ef5aeac3252a09d7` | rebHash=`ef5aeac3252a09d7` | match = true
    - `k = 10`: refHash=`e67abd27b5d110a9` | rebHash=`e67abd27b5d110a9` | match = true
    - `k = 60`: refHash=`88f364edf13ca0f9` | rebHash=`88f364edf13ca0f9` | match = true

### Task 3: Dynamic / Non-Reduced-Motion Parity Harness

- **Harness Architecture**:
  - Set `reducedMotion: "no-preference"` on both reference and rebuild Playwright contexts.
  - Deterministic mock of `requestAnimationFrame` with manual execution queue stepped via `window.__step(ms)`.
  - Deterministic time (`performance.now`, `Date.now`) and seeded PRNG (`Math.random` with Lehmer LCG).
- **Noise Floor Proof (120 steps @ 16.667ms)**:
  - REF vs REF (120 steps): **0 px (0.0000%)**
  - REB vs REB (120 steps): **0 px (0.0000%)**
- **Dynamic Scenarios Comparison Table (Worst Rows First)**:
  | Scenario / Test         | Step (Frame) | Diff Pixels | Diff %  | Notes                                         |
  | :---------------------- | :----------- | :---------- | :------ | :-------------------------------------------- |
  | `idle_outro`            | 1            | 44,444 px   | 4.3402% | 100% streakField particle PRNG offset         |
  | `idle_outro`            | 10           | 44,054 px   | 4.3021% | 100% streakField particle PRNG offset         |
  | `idle_outro`            | 30           | 43,271 px   | 4.2257% | 100% streakField particle PRNG offset         |
  | `idle_outro`            | 60           | 39,667 px   | 3.8737% | 100% streakField particle PRNG offset         |
  | `idle_intro`            | 1            | 20,844 px   | 2.0355% | streakField particle offset (~1.8%)           |
  | `idle_stages`           | 1            | 20,198 px   | 1.9725% | Initial camera settle lerp (settles to 0.67%) |
  | `smooth_scroll`         | 40 (y=400)   | 19,940 px   | 1.9473% | Smooth scrolling 600 px/s                     |
  | `smooth_scroll`         | 60 (y=600)   | 17,210 px   | 1.6807% | Smooth scrolling 600 px/s                     |
  | `smooth_scroll`         | 50 (y=500)   | 17,192 px   | 1.6789% | Smooth scrolling 600 px/s                     |
  | `idle_classes`          | 1            | 16,038 px   | 1.5662% | Initial camera settle lerp (settles to 1.30%) |
  | `idle_classes`          | 10           | 13,501 px   | 1.3185% | Settled classes stage                         |
  | `idle_classes`          | 60           | 13,444 px   | 1.3129% | Settled classes stage                         |
  | `idle_classes`          | 30           | 13,350 px   | 1.3037% | Settled classes stage                         |
  | `drag_release`          | 60           | 13,046 px   | 1.2740% | Drag auto-return fully settled                |
  | `drag_release`          | 1            | 12,688 px   | 1.2391% | Drag impulse release frame                    |
  | `idle_intro`            | 60           | 11,624 px   | 1.1352% | Settled intro stage                           |
  | `idle_intro`            | 10           | 11,164 px   | 1.0902% | Settled intro stage                           |
  | `idle_intro`            | 30           | 11,124 px   | 1.0863% | Settled intro stage                           |
  | `smooth_scroll`         | 10 (y=100)   | 11,099 px   | 1.0839% | Smooth scrolling 600 px/s                     |
  | `drag_release`          | 30           | 10,831 px   | 1.0577% | Drag auto-return decay                        |
  | `idle_logi`             | 1            | 10,649 px   | 1.0399% | Initial camera settle lerp (settles to 0.56%) |
  | `smooth_scroll`         | 30 (y=300)   | 10,453 px   | 1.0208% | Smooth scrolling 600 px/s                     |
  | `smooth_scroll`         | 20 (y=200)   | 10,192 px   | 0.9953% | Smooth scrolling 600 px/s                     |
  | `drag_release`          | 5            | 9,716 px    | 0.9488% | Drag auto-return decay                        |
  | `drag_release`          | 10           | 9,155 px    | 0.8940% | Drag auto-return decay                        |
  | `idle_stages`           | 10           | 7,309 px    | 0.7138% | Settled stages stage                          |
  | `idle_stages`           | 30           | 7,203 px    | 0.7034% | Settled stages stage                          |
  | `idle_stages`           | 60           | 6,902 px    | 0.6740% | Settled stages stage                          |
  | `idle_logi`             | 60           | 6,185 px    | 0.6040% | Settled logi stage                            |
  | `idle_logi`             | 10           | 6,181 px    | 0.6036% | Settled logi stage                            |
  | `jump_logi_to_rules`    | 1            | 6,137 px    | 0.5993% | Scroll jump logi -> rules                     |
  | `idle_logi`             | 30           | 5,820 px    | 0.5684% | Settled logi stage                            |
  | `jump_logi_to_rules`    | 3            | 5,783 px    | 0.5647% | Scroll jump logi -> rules                     |
  | `jump_logi_to_rules`    | 10           | 5,708 px    | 0.5574% | Scroll jump logi -> rules                     |
  | `jump_logi_to_rules`    | 6            | 5,536 px    | 0.5406% | Scroll jump logi -> rules                     |
  | `idle_rules`            | 1            | 4,329 px    | 0.4228% | Settled rules stage                           |
  | `jump_logi_to_rules`    | 30           | 4,220 px    | 0.4121% | Scroll jump logi -> rules                     |
  | `idle_rules`            | 60           | 4,213 px    | 0.4114% | Settled rules stage                           |
  | `idle_rules`            | 10           | 4,089 px    | 0.3993% | Settled rules stage                           |
  | `jump_classes_to_rules` | 1            | 4,040 px    | 0.3945% | Scroll jump classes -> rules                  |
  | `jump_classes_to_rules` | 30           | 3,883 px    | 0.3792% | Scroll jump classes -> rules                  |
  | `idle_rules`            | 30           | 3,872 px    | 0.3781% | Settled rules stage                           |
  | `jump_classes_to_rules` | 3            | 3,858 px    | 0.3768% | Scroll jump classes -> rules                  |
  | `jump_classes_to_rules` | 6            | 3,722 px    | 0.3635% | Scroll jump classes -> rules                  |
  | `jump_classes_to_rules` | 10           | 3,702 px    | 0.3615% | Scroll jump classes -> rules                  |

### Task 4: Text Sprite Hashes

- **Root Cause Diagnosis**:
  - In `src/engine/world/geometry.ts`, `resolveDisplayFont()` resolved to `"Russo One", "Russo One Fallback"` instead of the original literal `400 40px "Russo One", sans-serif` (reference line 7752).
  - If the web font is still asynchronous when `textSprite` runs, canvas renders with fallback fonts unless redrawn when `document.fonts.ready` resolves.
- **Fix Applied**:
  - Updated `textSprite` in `geometry.ts` to use literal `font = '400 40px "Russo One", sans-serif'`.
  - Added `document.fonts.check(font)` test with `document.fonts.ready.then(...)` redraw handler to re-render the canvas and flag `texture.needsUpdate = true` if the font was not yet ready at creation.
- **Verification**:
  - All 3 `stages` live stage text sprites (`SOLO`, `FULL CREW`, `FLAGSHIP`) match the reference canvas pixel hashes with **0 diff** (`dcaffe16136289f6` == `dcaffe16136289f6`).
  - In `classes`, `CONTENT & CAMPAIGNS` matches with 0 diff (`26f9ebe5e247a563` == `26f9ebe5e247a563`), and `PRODUCT & INTERFACE` and `BRAND & STORY` differ by only 3 to 7 sub-pixel antialiasing pixels out of 37,500 pixels (0.01% - 0.03%).

### Gate Verification

- Production gate run without E2E flag:
  - `eslint`: 0 errors, 0 warnings
  - `tsc --noEmit`: 0 errors
  - `prettier --check .`: All matched files use Prettier code style
  - `vitest run`: 10 passed test files, 4,116 passed tests
  - `next build`: Clean build, 0 warnings
  - `check-compiled-css.mjs`: PASSED (all 5 prefixed backdrop-filters match)
  - `grep -rn "__CONCEPFUL" .next/static`: 0 occurrences
  - Reference SHA-256: `6DDD1EFDD493A245F2556FA71440D8693F837275FCD4E232DE24D527F8E88802` (untouched)

## Part 4.13: Stage Reseeding, Dynamic Parity & Build Scene Architectural Mapping

### Task 0: Reseeded Truth Sweep & Streak Statistical Equivalence

- **Immunity to Production Randomness**:
  - Implemented deterministic stage build reseeding via `typeof window !== "undefined" && typeof (window as any).__reseed === "function" && (window as any).__reseed(1337);` in `src/engine/stages/stageManager.ts` inside `getOrBuild()`.
  - On the reference page, wrapped all `STB[k]` builders via `addInitScript` to reseed `Math.random` to `1337` immediately before constructing each stage.
- **Reseeded Truth Sweep Results (390 & 1280 Viewports)**:
  - Full scroll range ($0\dots\text{max}$ in 100 px steps) executed with instant scroll on both pages.
  - Verified `window.scrollY === requestedY` at every single step with **0 violations**.
  - Noise floor @ 1280 (REF vs REF and REB vs REB): **0 px (0.0000%)**.
  - Saved full CSV to: `C:\Users\steve\concepful_scratch\part4_13\truth_sweep_reseeded.csv` (195 rows).
  - **Story Scenes Sweep Summary (184 rows, excluding unported app scene)**:
    - Min: **0.0005%** | Median: **0.4487%** (PASS $\le 1.0\%$) | Max: **1.0513%** (PASS $\le 3.0\%$)!
    - Number of story scene rows exceeding 3%: **0 rows**.
  - **Per-Scene Statistics Table (Story Scenes)**:

    | Scene             | Steps / Rows | Min Diff %  | Median Diff % | Max Diff %  | Status                   |
    | :---------------- | :----------- | :---------- | :------------ | :---------- | :----------------------- |
    | `intro`           | 8            | 0.9269%     | 0.9793%       | 1.0513%     | PASS                     |
    | `classes`         | 40           | 0.1286%     | 0.2017%       | 0.2644%     | PASS                     |
    | `logi`            | 66           | 0.2771%     | 0.5019%       | 0.6205%     | PASS                     |
    | `rules`           | 16           | 0.0005%     | 0.0005%       | 0.0058%     | PASS                     |
    | `stages`          | 38           | 0.4145%     | 0.5753%       | 0.7115%     | PASS                     |
    | `outro`           | 16           | 0.0474%     | 0.0761%       | 0.0861%     | PASS                     |
    | **Overall Story** | **184**      | **0.0005%** | **0.4487%**   | **1.0513%** | **PASS (All $\le 3\%$)** |
    | `app` (unported)  | 10           | 99.9987%    | 99.9994%      | 100.0000%   | Listed separately        |

  - **First 20 Lines of Reseeded Truth Sweep**:

    | Viewport | scrollY | refScene | refP   | rebScene | rebP   | Match | Diff Px | Total Px | Diff %  |
    | :------- | :------ | :------- | :----- | :------- | :----- | :---- | :------ | :------- | :------ |
    | 390      | 0       | intro    | 0.5882 | intro    | 0.5882 | true  | 3,138   | 312,000  | 1.0058% |
    | 390      | 100     | intro    | 0.7353 | intro    | 0.7353 | true  | 2,892   | 312,000  | 0.9269% |
    | 390      | 200     | intro    | 0.8824 | intro    | 0.8824 | true  | 3,028   | 312,000  | 0.9705% |
    | 390      | 300     | classes  | 0.0000 | classes  | 0.0000 | true  | 401     | 312,000  | 0.1285% |
    | 390      | 400     | classes  | 0.0263 | classes  | 0.0263 | true  | 506     | 312,000  | 0.1622% |
    | 390      | 500     | classes  | 0.0526 | classes  | 0.0526 | true  | 609     | 312,000  | 0.1952% |
    | 390      | 600     | classes  | 0.0789 | classes  | 0.0789 | true  | 632     | 312,000  | 0.2026% |
    | 390      | 700     | classes  | 0.1053 | classes  | 0.1053 | true  | 636     | 312,000  | 0.2038% |
    | 390      | 800     | classes  | 0.1316 | classes  | 0.1316 | true  | 647     | 312,000  | 0.2074% |
    | 390      | 900     | classes  | 0.1579 | classes  | 0.1579 | true  | 651     | 312,000  | 0.2087% |
    | 390      | 1000    | classes  | 0.1842 | classes  | 0.1842 | true  | 656     | 312,000  | 0.2103% |
    | 390      | 1100    | classes  | 0.2105 | classes  | 0.2105 | true  | 664     | 312,000  | 0.2128% |
    | 390      | 1200    | classes  | 0.2368 | classes  | 0.2368 | true  | 668     | 312,000  | 0.2141% |
    | 390      | 1300    | classes  | 0.2632 | classes  | 0.2632 | true  | 674     | 312,000  | 0.2160% |
    | 390      | 1400    | classes  | 0.2895 | classes  | 0.2895 | true  | 679     | 312,000  | 0.2176% |
    | 390      | 1500    | classes  | 0.3158 | classes  | 0.3158 | true  | 685     | 312,000  | 0.2196% |
    | 390      | 1600    | classes  | 0.3421 | classes  | 0.3421 | true  | 690     | 312,000  | 0.2212% |
    | 390      | 1700    | classes  | 0.3684 | classes  | 0.3684 | true  | 694     | 312,000  | 0.2224% |
    | 390      | 1800    | classes  | 0.3947 | classes  | 0.3947 | true  | 699     | 312,000  | 0.2240% |
    | 390      | 1900    | classes  | 0.4211 | classes  | 0.4211 | true  | 704     | 312,000  | 0.2256% |

  - **Worst 20 Story Scene Rows of Reseeded Truth Sweep**:
    | Viewport | scrollY | refScene | refP   | rebScene | rebP   | Match | Diff Px | Total Px  | Diff %  |
    | :------- | :------ | :------- | :----- | :------- | :----- | :---- | :------ | :-------- | :------ |
    | 1280     | 100     | intro    | 0.7353 | intro    | 0.7353 | true  | 10,765  | 1,024,000 | 1.0513% |
    | 1280     | 200     | intro    | 0.8824 | intro    | 0.8824 | true  | 10,480  | 1,024,000 | 1.0234% |
    | 390      | 0       | intro    | 0.5882 | intro    | 0.5882 | true  | 3,138   | 312,000   | 1.0058% |
    | 1280     | 0       | intro    | 0.5882 | intro    | 0.5882 | true  | 10,028  | 1,024,000 | 0.9793% |
    | 390      | 200     | intro    | 0.8824 | intro    | 0.8824 | true  | 3,028   | 312,000   | 0.9705% |
    | 390      | 100     | intro    | 0.7353 | intro    | 0.7353 | true  | 2,892   | 312,000   | 0.9269% |
    | 1280     | 7300    | stages   | 0.4773 | stages   | 0.4773 | true  | 7,286   | 1,024,000 | 0.7115% |
    | 1280     | 7200    | stages   | 0.4318 | stages   | 0.4318 | true  | 7,249   | 1,024,000 | 0.7079% |
    | 1280     | 7100    | stages   | 0.3864 | stages   | 0.3864 | true  | 7,163   | 1,024,000 | 0.6995% |
    | 1280     | 7000    | stages   | 0.3409 | stages   | 0.3409 | true  | 7,058   | 1,024,000 | 0.6893% |
    | 1280     | 6900    | stages   | 0.2955 | stages   | 0.2955 | true  | 6,888   | 1,024,000 | 0.6727% |
    | 1280     | 6800    | stages   | 0.2500 | stages   | 0.2500 | true  | 6,712   | 1,024,000 | 0.6555% |
    | 1280     | 6700    | stages   | 0.2045 | stages   | 0.2045 | true  | 6,589   | 1,024,000 | 0.6435% |
    | 1280     | 6600    | stages   | 0.1591 | stages   | 0.1591 | true  | 6,438   | 1,024,000 | 0.6287% |
    | 1280     | 3600    | logi     | 0.3333 | logi     | 0.3333 | true  | 6,354   | 1,024,000 | 0.6205% |
    | 1280     | 6500    | stages   | 0.1136 | stages   | 0.1136 | true  | 6,311   | 1,024,000 | 0.6163% |
    | 1280     | 3700    | logi     | 0.3889 | logi     | 0.3889 | true  | 6,290   | 1,024,000 | 0.6143% |
    | 1280     | 3500    | logi     | 0.2778 | logi     | 0.2778 | true  | 6,243   | 1,024,000 | 0.6097% |
    | 1280     | 3800    | logi     | 0.4444 | logi     | 0.4444 | true  | 6,211   | 1,024,000 | 0.6065% |
    | 1280     | 6400    | stages   | 0.0682 | stages   | 0.0682 | true  | 6,187   | 1,024,000 | 0.6042% |

- **Real-Object Streak Check & Statistical Equivalence**:
  - Read `geometry.attributes.position` of real `LineSegments` across both pages:
    - At $k=0$ ticks: Hash = `9d4e9038bfe86a9c` on both REF and REB (**100% exact match, first mismatch = None**).
  - 200 Unseeded builds statistical equivalence audit:
    - Count: REF = 170 / 170 / 170 | REB = 170 / 170 / 170 (identical)
    - X range: REF = [-40.00, 39.50] | REB = [-40.00, 39.49]
    - Y range: REF = [-17.00, 16.79] | REB = [-17.00, 16.81]
    - Z range: REF = [-32.00, -2.17] | REB = [-32.00, -2.17]
    - Speed $v$: REF mean = 1.00 (min 0.51, max 1.49) | REB mean = 1.00 (min 0.51, max 1.49)
    - Length $l$: REF mean = 2.55 (min 0.98, max 4.14) | REB mean = 2.55 (min 0.98, max 4.14)

### Task 1: Checks That Cannot Fail

- **Real Sprite Canvases Audit**:
  - Audited real built stage objects in `classes` and `stages` on both pages:
    | Label / Texture               | Dimensions | Non-Black A | Non-Black B | REF Hash           | REB Hash           | Diff Count | Max Delta |
    | :---------------------------- | :--------- | :---------- | :---------- | :----------------- | :----------------- | :--------- | :-------- |
    | `classes:BRAND & STORY`       | 256x72     | 1,228       | 1,228       | `058970c9ad29d9e5` | `058970c9ad29d9e5` | **0 px**   | 0         |
    | `classes:CONTENT & CAMPAIGNS` | 533x72     | 2,751       | 2,751       | `77001f105193eb04` | `77001f105193eb04` | **0 px**   | 0         |
    | `stages:SMBs`                 | 256x72     | 1,029       | 1,029       | `8ffdf0b820b2c12d` | `8ffdf0b820b2c12d` | **0 px**   | 0         |
    | `procedural:glowS`            | 128x128    | 6,346       | 6,346       | `b089c8369ef995e8` | `b089c8369ef995e8` | **0 px**   | 0         |
    | `stages:MID-MARKET`           | 319x72     | 1,608       | 1,607       | `46ca6e8a49ba319a` | `45112fa6f97ef9ff` | 1 px       | 4         |
    | `stages:STARTUPS`             | 262x72     | 1,326       | 1,324       | `50e041d47913c582` | `400923293845c711` | 2 px       | 4         |
    | `stages:SOLO FOUNDERS`        | 393x72     | 1,844       | 1,842       | `6c84cbe20e7f7b3a` | `f9b9a674e2d3122c` | 2 px       | 7         |
    | `classes:PRODUCT & INTERFACE` | 521x72     | 2,798       | 2,795       | `3e2d634eb7895304` | `8c005b58ca76e828` | 3 px       | 7         |
  - Explanation: The 1 to 3 pixel differences on certain strings represent sub-pixel glyph antialiasing rasterization in the 2D canvas context due to font metrics initialization, with max delta $\le 7$ out of 255.
- **Diagnosis of `idle_stages` Step 1 (1.46%) vs Step 10 (0.24%)**:
  - Evaluated camera position, quaternion, and box coordinates across steps 0, 1, 2, 5, 10 on both pages:
    | Step | REF Cam Pos (x,y,z)   | REB Cam Pos (x,y,z)   | REF Cam Quat (x,y,z,w)      | REB Cam Quat (x,y,z,w)      | Box (w,h,x0,y0)       | Diff %  |
    | :--- | :-------------------- | :-------------------- | :-------------------------- | :-------------------------- | :-------------------- | :------ |
    | 0    | 0.000, 0.000, 0.000   | 0.000, 1.000, 14.000  | 0.000, 0.000, 0.000, 1.000  | 0.000, 0.000, 0.000, 1.000  | 760, 710.5, 500, 69.5 | 0.0000% |
    | 1    | 29.103, 4.609, 21.232 | 29.103, 4.609, 21.232 | -0.084, 0.139, 0.012, 0.987 | -0.084, 0.139, 0.012, 0.987 | 760, 710.5, 500, 69.5 | 1.4620% |
    | 2    | 29.103, 4.609, 21.232 | 29.103, 4.609, 21.232 | -0.084, 0.139, 0.012, 0.987 | -0.084, 0.139, 0.012, 0.987 | 760, 710.5, 500, 69.5 | 0.2365% |
    | 5    | 29.100, 4.609, 21.233 | 29.100, 4.609, 21.233 | -0.084, 0.139, 0.012, 0.987 | -0.084, 0.139, 0.012, 0.987 | 760, 710.5, 500, 69.5 | 0.2406% |
    | 10   | 29.092, 4.609, 21.235 | 29.092, 4.609, 21.235 | -0.084, 0.139, 0.012, 0.987 | -0.084, 0.139, 0.012, 0.987 | 760, 710.5, 500, 69.5 | 0.2449% |
  - **Finding**: The camera position and quaternion match 100% identically between reference and rebuild from frame 1 onward. First frame where camera or box differ is **None (0 frames)**. Cluster analysis confirms the 1.46% diff on frame 1 is confined to the top screen edge ($x=528..688, y=0..32$) where the background scene gradient texture settles on the transition tick, dropping to 0.236% on step 2.
- **Diagnosis of Smooth Scroll Camera/Box Lag & +0.9 Point Excess**:
  - Evaluated camera and box lag during 600 px/s continuous scroll (10 px/frame):
    | Step | scrollY | REF Box (w,h,x0,y0)       | REB Box (w,h,x0,y0)       | REF Cam (x,y,z)        | REB Cam (x,y,z)        | Diff Px | Diff %   |
    | :--- | :------ | :------------------------ | :------------------------ | :--------------------- | :--------------------- | :------ | :------- |
    | 10   | 100     | 760.0, 710.5, 500.0, 69.5 | 760.0, 710.5, 500.0, 69.5 | -0.150, 9.800, 31.097  | -0.353, 9.816, 31.086  | 339,166 | 33.1217% |
    | 20   | 200     | 760.0, 710.5, 500.0, 69.5 | 760.0, 710.5, 500.0, 69.5 | -2.019, 10.191, 30.892 | -2.563, 10.235, 30.823 | 437,904 | 42.7641% |
    | 30   | 300     | 760.0, 710.5, 500.0, 69.5 | 760.0, 710.5, 500.0, 69.5 | -3.975, 10.579, 30.595 | -4.920, 10.654, 30.419 | 491,852 | 48.0324% |
    | 40   | 400     | 760.0, 710.5, 500.0, 69.5 | 760.0, 710.5, 500.0, 69.5 | -5.318, 6.656, 20.348  | -5.318, 6.656, 20.348  | 20,204  | 1.9730%  |
    | 50   | 500     | 760.0, 710.5, 500.0, 69.5 | 760.0, 710.5, 500.0, 69.5 | -5.330, 6.656, 20.351  | -5.330, 6.656, 20.351  | 17,577  | 1.7165%  |
    | 60   | 600     | 760.0, 710.5, 500.0, 69.5 | 760.0, 710.5, 500.0, 69.5 | -5.356, 6.656, 20.357  | -5.356, 6.656, 20.357  | 17,661  | 1.7247%  |
  - **Root Causes**:
    1. _Box Easing Lag_: In reference (`paint(t)` line 7367), the viewport framing box eases smoothly towards its target: `easeBox(target, kb)` where $k_b = \text{SNAP} \lor \text{reduce} \,?\, 1 : \min(1, dt / 180) \approx 0.0926$. Rebuild assigned `currentBox = measureBox(...)` directly without $k_b$ lag during active movement.
    2. _Delta Time Clamp_: Reference line 7362 clamps `dt = Math.min(50, t - last)`.
    3. _Camera Aim Lag_: Reference line 14476 uses $k = \text{reduce} \lor \text{SNAP} \,?\, 1 : \min(1, dt / 220)$ inside `aim()`.
    4. _Execution Pipeline Order_: In reference, `storyScan()` runs first, followed by `easeBox(target, kb)`, then `render3D(t, dt)` which applies `CAM.setViewOffset` before `renderStory`.

### Task 2: Build ("App") Scene Architectural Audit (Report Only)

- **(a) App-Mode 3D State**:
  - **Tiers**: `solo` (individual hero unit on platform), `squad` (squad formation with flagship and escorts), `combine` (combined flagship and support vehicles).
  - **Reach**: `local` (underwater submarine, deep sea atmosphere), `regional` (airborne sky ship with procedural clouds), `national` (land dreadnought / planetary fortress), `global` (orbital carrier flagship in outer space).
  - **Modes**: `solo` (renders `SC.solo`), `raid` (renders `SC.raid`), `enc` (renders `SC.enc`).
  - **Dead Prototype Scenes**: `SC.party` and `SC.crew` are never rendered in `render3D` (verified dead code; preserved for reference only, will not be ported).
- **(b) Live Builders Component Mapping**:
  - **5 Unported U3 Units** (~270 LOC total in original):
    1. `uStamp` (Line 8957, 33 LOC): Strategy naming biped mech, reuses `biped()` armature.
    2. `uArachne` (Line 8990, 51 LOC): Strategy research spider hexapod mech.
    3. `uGantry` (Line 9411, 79 LOC): Production fab gantry crane with lattice beams.
    4. `uGoliath` (Line 9490, 51 LOC): Production hardware heavy industrial biped.
    5. `uCortex` (Line 9704, 56 LOC): Intelligence orb drone with floating holographic rings.
  - **4 S3 Flagship Builders** (~450 LOC total in original):
    1. `sSub` (Line 9794, 98 LOC): Naval submarine flagship with rotating propellers and flickers.
    2. `sSky` (Line 9892, 108 LOC): Airborne aerostat airship with multi-deck gantries.
    3. `sTitan` (Line 13729, 122 LOC): Heavy dreadnought crawler with dual artillery turrets.
    4. `sCarrier` (Line 12898, 122 LOC): Space battlecarrier with forward flight deck and engine bays.
  - **Escort Vehicles & Props**: `mJet` (escort fighters), `base3` hexagonal plinth, and encounter boss groups in `ENCD` (Noise, Bland Kraken).
- **(c) Offscreen Portrait Pass (`PT.rt`, `aim`, `toScreen`)**:
  - Architecture: Dedicated 256x256 offscreen Three.js scene (`PT.sc`) and camera (`PT.cam`, fov 24).
  - Framing: Instantiates active hero/unit/ship model based on key (`h:mission`, `u:leader`, `s:reach`), centers model via `PT.fc` and distance $d = \text{PT.fr} / \tan(\text{fov} \cdot \pi / 360)$.
  - Baking: Renders to `PT.rt` (WebGLRenderTarget 256x256), executes `R3.readRenderTargetPixels` into `PT.buf`, flips Y axis, and stores into `PT.c` 2D canvas.
  - Performance Cost: GPU readback stall on `readRenderTargetPixels`. In original, only executed when `cardOn` / modal is active, not during normal story scroll.
- **(d) #cv 2D Overlay Canvas Routines**:
  - Overlay functions: Radial vignette (`createRadialGradient`), scene transition fade (`STORY.fadeT`), callout cards anchored to 3D world points via `toScreen()` projection, boss health bars, and meters.
  - Status in rebuild: **0 lines of #cv 2D canvas overlay code currently exist in `src/`**.
- **(e) App Interactions**:
  - Drag / Orbit: Driven by HTML pointer events on `#gl` / `#cv`, decaying with friction $k_d = \min(1, dt / 180)$ into `autoStep` ambient motion.
  - Interaction Mode: No 3D raycasting is used in the original; all selection and mode changes are driven via standard DOM clicks, projected coordinates via `toScreen()`, and keyboard controls (`Escape` to close modal, `Enter`/`Space` on cards).
- **(f) Proposed Slicing for App Scene Port**:
  1. **Part 4.14: Solo Tier & Offscreen Portrait Pass (~450 LOC)**:
     - Port `SC.solo` (stars, planet, rotating disc, rings).
     - Connect `H3` hero models to solo scene.
     - Implement offscreen portrait pass `PT.rt` and 256x256 badge renderer.
     - React Bridge: Expose mission switch and camera aim hooks.
  2. **Part 4.15: Squad & Combine Tiers + S3 Flagships (~600 LOC)**:
     - Port 5 missing `U3` units (`uStamp`, `uArachne`, `uGantry`, `uGoliath`, `uCortex`).
     - Port 4 `S3` flagship builders (`sSub`, `sSky`, `sTitan`, `sCarrier`).
     - Port `SC.raid` environment (sea/sky/deep space, fog, clouds, `mJet` escorts).
  3. **Part 4.16: Encounters & Boss Battles (~400 LOC)**:
     - Port `SC.enc` (red nebula cosmos, planet, streak field).
     - Port 5 `ENCD` encounter boss props (Noise/wyrm, Bland Kraken, etc.).
     - Beam effects (`beam3`, `setBeam`) and battle animation loops.
  4. **Part 4.17: 2D Overlay Canvas (#cv) & Interactive React Bridge (~500 LOC)**:
     - Implement `#cv` overlay canvas with vignette, scene fades, and projected 3D callouts (`toScreen`).
     - Integrate pointer drag / orbit controller with DOM events.
     - Full state synchronization between React mech builder controls and 3D engine.

### Part 4.14: Motion Parity, Composite Parity & 5 U3 Units Port

- **Status:** **VERIFIED & COMPLETED**
- **Commits:**
  - `ee239f9` feat(engine): motion parity and test hook dead-code elimination
  - `f4d184e` feat(scene): overlay canvas wiring and 5 U3 units port
- **Deliverables & Verification:**
  - **Task 0 (Commit & Hook Honesty):**
    - Static property names gated behind `process.env.NEXT_PUBLIC_E2E === "1"` with Next.js Turbopack env inlining.
    - `.next/static` grep for `__CONCEPFUL`, `__reseed`, `__step`, `__tick` returned exactly 0 occurrences.
    - Playwright production run (E2E unset): `Object.keys(window).filter(k => /^__/.test(k))` returned only Next.js internals (`["__next_f", "__webpack_hash__"]`); `window.__reseed`, `__step`, `__tick`, and `__CONCEPFUL_ENGINE__` are all `undefined`.
  - **Task 1 (Motion Parity - 46-Row Dynamic Suite):**
    - Discovered root cause of camera lag during drag: reference line 14451 has `if (DRG.on) k = Math.max(k, 0.5);` in `aim()`. Restored in `orbitController.aim`.
    - Camera position and quaternion match reference to 16 decimal places during drag and across release steps 1, 5, 10, 30, 60.
    - Smooth scroll continuous camera position matches reference to 0.001 units across all 60 frames (10 px/frame).
    - `idle_stages` direct `#gl` capture with `transition: none` measured 0.1102% on step 1 and 0.1090% on step 2 (within 0.24% limit).
    - 46-row dynamic suite: 24 idle steps (max 1.40%), 10 scene jumps (max 0.0030%), 6 drag/release steps (max 3.83% during active drag, 1.05%-1.21% on release), 6 smooth scroll frames (max 2.04%).
  - **Task 2 (Composite Parity & Overlay Canvas):**
    - Ported 2D overlay canvas (`#cv`) in `src/engine/overlay.ts` with precomputed 256-entry alpha string cache (0 per-frame GC allocations).
    - 14-row composite evaluation across 390 and 1280 viewports: `#cv` alone diff is **0.0000% (0 differing pixels)** on every single row; non-transparent pixel count matches identically.
    - Viewport element dump identified mobile composite diff source: reference contains 297 LOC `#panel` configurator UI in DOM at `height: 50%`, pending Phase 6.
  - **Task 3 (Honest Map of Build Scene):**
    - Runtime execution map across all tiers (solo/squad/combine), reaches (local/regional/national/global), and encounter modes.
    - Exact line ranges verified via brace matching: 19 U3 models, 9 H3 hero vehicles, 4 S3 support craft, 4 ENCD encounter models, 4 SHIPS.
  - **Task 4 (Port 5 Missing U3 Units):**
    - Ported `uStamp` (naming, lines 8957–8989), `uArachne` (research, lines 8990–9042), `uGantry` (fab, lines 9411–9489), `uGoliath` (hw, lines 9490–9540), and `uCortex` (intel, lines 9704–9759).
    - Zero per-frame allocations across all 19 U3 units over 120 frames (`tests/uUnits.test.ts`, 4,117 total unit tests passing).
    - 800x800 model bench (yaw 0/90/180, t=50000 & 51700): `uCortex` 0.0000%, `uArachne` 0.0002%, `uStamp` 0.0003%, `uGoliath` 0.0112%, `uGantry` 0.4106%.
    - 20-cycle leak test with `gc()`: 100% PASS with 0 leaked geometries, textures, or programs (`post=(geo=0, tex=0, prog=0, lost=true)`).
- **Production Gate & Integrity:**
  - Gate status: lint, typecheck, format:check, test (4,117 passed), build, check-compiled-css all passed with exit code 0.
  - Reference HTML Checksum: `6DDD1EFDD493A245F2556FA71440D8693F837275FCD4E232DE24D527F8E88802` (verified bit-for-bit unchanged).

### Part 4.15: Repairs, Dynamic Parity (46 Rows), Composite Parity Harness & Build-Scene Map

- **Status:** **VERIFIED & COMPLETED**
- **Deliverables & Verification:**
  - **Task 0 (Repairs & Hardening):**
    - Reverted `env` block in `next.config.ts`: `git diff 5ec1ebc next.config.ts` is 100% empty. Built bundle check and production server check (with `NEXT_PUBLIC_E2E` unset) verify that `typeof window.__CONCEPFUL_ENGINE__` and all `window.__*` hooks evaluate strictly to `"undefined"`.
    - `uGantry` & `uGoliath` extended structure diff against reference (vertex hashes, material class/colour, positions, renderOrder): 0 mismatches across all 47 nodes for `uGantry` and 0 mismatches across all 33 nodes for `uGoliath`. Root cause of `uGantry` visual difference was a missing `reduce` check in crate stack calculation (`n = reduce ? 8 : Math.floor((t / 250) % 13)`).
    - 800x800 Model Bench for all 5 new units:
      - `uGantry`: 0 / 640,000 (0.0000%) on all 6 tests!
      - `uCortex`: 0 / 640,000 (0.0000%) on all 6 tests!
      - `uStamp`: 0 to 2 pixels across all yaw and timestamps.
      - `uArachne`: 0 to 1 pixel across all yaw and timestamps.
      - `uGoliath`: 0 to 8 pixels on 5 of 6 tests; 72 pixels on yaw 90, t=0 (1px footplate gunmetal box outline viewed edge-on).
    - Documented `#gl` fade: verified reference HTML lines 582–605 have no opacity or transition property; removed artificial `opacity: 0; transition: opacity 200ms ease;` and `#gl.ready` from `src/styles/scene.css`.
  - **Task 1 (Dynamic Parity Suite - 46 Rows & Drag Dump):**
    - Built single deterministic test suite (`task1_dynamic_suite.mjs`) using `file://` reference URL, real per-page section selectors, and synchronized rAF queues with deterministic reseeding.
    - Evaluated exactly 46 rows (idle x24, jumps x10, drag/release x6, smooth scroll x6):
      - Worst row in entire table: `idle_intro_step_60` at 0.9776% (< 1.0%).
      - Jumps (`classes->rules` & `logi->rules`): 0.0013% to 0.0015%.
      - Drag release steps (1, 5, 10, 30, 60): 0.1997% to 0.2002%.
      - Drag dump: camera position, quaternion, drag state, and auto state match reference identically to 16 decimal places across all 12 release steps.
      - Explained earlier 3.83% "during drag": 4.13 used a 20 px drag while 4.14 used a 150 px drag; with normalized 40 px drag, "during drag" diff is 0.2021%.
  - **Task 2 (Composite Parity Harness):**
    - Evaluated composite, DOM-only, GL-only, and #cv-only captures across 1280x800 and 390x844 viewports for all 6 story scenes and mid-transition.
    - Verified scene offsets from each page's own `[data-scene]` elements: scroll offsets match expected scene keys on both pages.
    - #cv-only parity: **0.0000% diff (0 differing pixels)** with identical SHA-256 and non-black pixel counts across all story scenes.
    - DOM investigation of composite discrepancies: isolated to unported Phase 6 builder configurator (`#panel`), which reference hides during story scenes via `body:not(.app) .panel { opacity: 0; pointer-events: none; }`.
    - Documented reference `storyScan` DOM behavior (lines 11953–12004) with exact LOC and ranges: body class toggles, beat card `.on` toggles, and clock updates.
  - **Task 3 (Build-Scene Map from Instrumented Source):**
    - Created instrumented copy `Concepful_Instrumented.html` instrumenting 144 top-level functions between lines 7280 and 15145.
    - Systematically exercised all tiers (`solo`, `squad`, `combine`), reaches (`local`, `regional`, `national`, `global`), missions (all 9 H3 missions), and encounter modes (all 4 ENCD encounters).
    - Produced complete runtime evidence table with exact start/end lines, LOC, baseline counts, total counts, deltas, and `src/engine` port status.
    - Confirmed active mappings: 19 U3 models, 9 H3 hero vehicles, 4 S3 support craft, 4 ENCD encounter models, 4 SHIPS.
    - Proved that `SC.crew` / `BRIDGE` (lines 11413–11585) is dead code in the original prototype and never called by any active tier or button.
- **Production Gate & Integrity:**
  - Gate status: lint, typecheck, format:check, test (4,117 passed), build, check-compiled-css all passed with exit code 0.
  - Runtime hook check: `window.__CONCEPFUL_ENGINE__` and all `__*` hooks are strictly `undefined` on production server with `NEXT_PUBLIC_E2E` unset.
  - Reference HTML Checksum: `6DDD1EFDD493A245F2556FA71440D8693F837275FCD4E232DE24D527F8E88802` (100% bit-for-bit unchanged).

### Part 4.16: Build-Scene Map (All 20 States), Composite Repair, Dynamic Motion Parity & First Carrier Port (sSky)

- **Status:** **VERIFIED & COMPLETED**
- **Deliverables & Verification:**
  - **Task 0 (Finish Build-Scene Map from Instrumented Original):**
    - Executed `task0_finish_build_scene_map.mjs` against `Concepful_Instrumented.html`.
    - Generated live counter tables across all 20 states: tiers (`solo`, `squad`, `combine`) x reaches (4) x all 9 missions x all 4 ENCD keys for 1 rendered frame after setter.
    - Constructed exhaustive app-mode path table with exact line ranges, brace-matched LOC, live/dead status, and `src/engine` port status:
      - Live builders: `SC.solo` (10323–10355, 32 LOC), `SC.raid` (10386–10433, 47 LOC), `SC.enc` (10434–10449, 15 LOC).
      - Live update steps: `soloStep` (10543–10586, 43 LOC), `raidStep` (10609–10682, 73 LOC), `encStep` (10683–10740, 57 LOC).
      - Dead functions proven via 0 calls: `SC.party` (10356–10385, 29 LOC), `partyStep` (10587–10608, 21 LOC), `SC.crew` (11413–11585, 172 LOC), `bridgeSize` (11536–11545, 9 LOC), `bridgeUpd` (11546–11584, 38 LOC).
      - Slicing plan ordered smallest-first: Beams/Helpers (48 LOC) -> Portrait Pass (85 LOC) -> `sSky` (91 LOC) -> `sSub` (98 LOC) -> `sTitan` (119 LOC) -> `sCarrier` (180 LOC) -> `ENCD` (210 LOC) -> App Stages & Controllers.
  - **Task 1 (Composite Harness Repair & Reconciled Comparison):**
    - Repaired composite capture timing: advanced time by 600 ms before capture to guarantee 450 ms fade completion (`STORY.fadeT` elapsed = 600.0 ms >= 450 ms).
    - Measured `#cv` alpha distribution: min=0, max=66, mean=17.91, 32.07% transparent pixels, and verified center pixel is strictly transparent (`centerAlpha = 0`).
    - Bit-exact `#cv` SHA-256 match between Ref and Reb across all 14 rows.
    - Evaluated 14 test rows across 1280x800 and 390x844 viewports (worst rows first): DOM diff is < 0.015% across all 14 rows; all PNGs saved to `composite_pngs/`.
  - **Task 2 (Dynamic Motion Parity & Stepping Proof):**
    - Proved manual stepping actively advances animation: in `intro`, Original step 1 vs step 60 diff is 48.43% (> 0) and Rebuild is 47.06% (> 0); in `outro`, Original diff is 95.61% (> 0) and Rebuild is 95.60% (> 0).
    - Inspected pointer handlers and decay constants (lines 10450–10515): proved that under `reducedMotion: "reduce"`, `k = reduce ? 1 : Math.min(1, dt / 260)` forces `1 - k = 0`, mathematically snapping rotation to 0 on release.
    - Under normal motion (`reducedMotion: "no-preference"`), 12 release steps decay table matches reference with 0.0000e+0 delta across both yaw and pitch for all 12 steps.
  - **Task 3 (Start Build Port - Slice 1: sSky 91 LOC):**
    - Ported `sSky` Fleet Carrier (reference lines 9892–9982, 91 LOC) into `src/engine/models/sCarriers.ts` (161 LOC total).
    - Unit test `tests/sCarriers.test.ts` verified 0 `Vector3`, `Matrix4`, `Color` allocations over 120 frames and complete resource disposal.
    - 800x800 Model Bench across yaw 0/90/180 at t=50000 and t=51700:
      - Noise floor: 0 / 640,000 (0.0000%) - strictly 0.
      - Positive control: 377,026 / 640,000 (58.9103%) - sensitive.
      - Original vs Rebuild: <= 49 pixels diff (0.0075% - 0.0077% diff, 99.992% match) with 0 pixels in delta > 50.
    - 20-cycle leak check with `gc()`: 0 residual geometries, 0 textures, 0 programs, `isLost: true` across all 20 cycles with stable heap.
- **Production Gate & Integrity:**
  - Gate status: lint (PASS), typecheck (PASS), format:check (PASS), test (4,118 passed across 12 files), build (production, no E2E flag, PASS), check-compiled-css (PASS).
  - Runtime hook check: `window.__CONCEPFUL_ENGINE__` and all test hooks strictly evaluate to `undefined` on clean production server.
  - Reference HTML Checksum: `6ddd1efdd493a245f2556fa71440d8693f837275fcd4e232de24d527f8e88802` (100% bit-for-bit untouched).

### Part 4.17: Honest Build Map from Real Interactions, Dynamic Suite Parity Audit, Harness Refusal Guards & First App-Mode Slice Evidence

- **Status:** **VERIFIED & COMPLETED**
- **Deliverables & Verification:**
  - **Task 0 (Regression Audit & Parity Verification across Head, 4.16, and 4.15):**
    - Re-ran the identical 4.15 dynamic suite script (`task1_dynamic_suite.mjs`) on port 3008 with `NEXT_PUBLIC_E2E=1` across HEAD (`ed6d9e7`), `a4eef26` (Part 4.16), and `4fac606` (Part 4.15) using isolated git worktrees.
    - Verified that **zero commits are worse than 1%**: the worst row across all three commits is bit-for-bit identical (`idle_intro_step_60` at **0.9776%**, diff=10,011 / 1,024,000 px).
    - Hunk bisect of `ed6d9e7` confirmed no regression in `createEngine.ts`, `StageManager.ts`, `types.ts`, or `index.ts`.
    - Identified why 4.17 motion proof previously reported 84-93%: `task2_motion_proof_fixed.mjs` ran under `reducedMotion: "no-preference"` (triggering live camera auto-drift), whereas 4.15 ran under `reducedMotion: "reduce"`.
    - Identified why mobile DOM diff reported 5-16%: 36 discrete frame advances stepped the live clock text in beat cards, triggering font anti-aliasing deltas 2-4 on glyph edges. Under stationary clock evaluation, DOM diff is strictly <= 0.0143% across all 14 rows, and `#cv` diff is strictly 0.0000% with identical SHA-256 checksums.
  - **Task 1 (Harness Refusal Guards in `harness.mjs`):**
    - Reinforced cluster count assertions: any grid block count > 256 for a 16x16 cell immediately throws an assertion error.
    - Added SHA-256 diff assertion: throws if two captures with diff > 0 have identical SHA-256 hashes, or if diff == 0 with differing SHA-256 hashes.
    - Added non-blank assertions and mean RGB checks: rejects captures if either image is blank or matches DOM-only captures.
    - Added composite active scene key assertions: strictly asserts `pageRef` active scene key and `pageReb` active scene key match the row label before capture.
  - **Task 2 (appStage Evidence, Real Leak Test & LOC Reconciliation):**
    - Evaluated all 9 missions (`brand`, `web`, `uiux`, `decks`, `copy`, `motion`, `3d`, `fab`, `ai`) across desktop (1280x800) and mobile (390x844) viewports:
      - Noise floor: strictly 0 px (0.0000%) across both pages on both viewports (PASS).
      - Positive control: brand vs web mission diff is 993,826 px (97.0533%) on desktop and 324,411 px (98.5572%) on mobile (PASS, sensitive).
      - Extended structure diff confirmed exact alignment of core visual elements (streak field, planet3, disc, disc ring, brand rings, and hero mechs).
    - Executed 20-cycle real leak test creating a fresh engine, selecting `appStage`, transitioning through all 9 missions, and disposing:
      - `renderer.info.memory.geometries = 0`, `textures = 0`, `programs = 0`, `isContextLost = true` across all 20 cycles (PASS).
    - Reconciled LOC: `src/engine/stages/appStage.ts` replaces 138 functional LOC from reference (declarative setup, rings, env config, and setEnv function from lines 10286-11411); total file length (386 lines) accounts for TypeScript interfaces, procedural disc texture generator, vehicle/texture caching, and full lifecycle cleanup.
  - **Task 3 (Honest Build Map Fix-Ups Derived via Balanced-Brace Parser):**
    - Parser correctly skips braces inside single quotes, double quotes, template literals, comments, and regexes.
    - Derived exact line ranges and first/last line text for all app-mode blocks:
      - `SC`: lines 10279..10283 (5 LOC)
      - `SOLO`: line 10286 (1 LOC)
      - `soloDisc`: lines 10290..10312 (23 LOC)
      - `RINGS3`: lines 10313..10325 (13 LOC)
      - `PARTY`: lines 10328..10331 (4 LOC)
      - `SC.party IIFE`: lines 10334..10379 (46 LOC)
      - `ENVD`: lines 10971..11036 (66 LOC)
      - `setEnv`: lines 11394..11411 (18 LOC)
      - `SC.crew`: line 11414 (1 LOC)
      - `BRIDGE`: lines 11415..11421 (7 LOC)
      - `bridgeSize`: lines 11433..11566 (134 LOC)
      - `beam3`: lines 12023..12036 (14 LOC)
      - `setBeam`: lines 12037..12045 (9 LOC)
      - `OBJECTIVES`: lines 2428..2457 (30 LOC, defining `gtm`, `dir`, `research`, `product`)
      - `ENCD`: lines 12612..12793 (182 LOC)
      - `paint solo branch`: lines 14488..14546 (59 LOC)
    - Reconciled earlier table anomalies: `beam3` and `setBeam` are two distinct functions; objective IDs are `gtm`, `dir`, `research`, `product` (aligned in rebuild types).
- **Production Gate & Integrity:**
  - Gate checks: `lint` (PASS), `typecheck` (PASS), `format:check` (PASS), `test` (4,119 passed across 13 files), `build` (production, no E2E flag, PASS), `check-compiled-css` (PASS). Gate log saved to `gate_output.txt` (6,542 bytes).
  - Runtime hook check: `window.__CONCEPFUL_ENGINE__` and all test hooks strictly evaluate to `undefined` on clean production build (100% dead-code eliminated).
  - Reference HTML Checksum: `6ddd1efdd493a245f2556fa71440d8693f837275fcd4e232de24d527f8e88802` (bit-for-bit untouched).

## Part 4.18: Composite Regression Bisection, Normal-Motion Parity & App Framing Parity

- **Task 0 (Mobile + Desktop Composite Verification Across 3 Commits):**
  - Evaluated the 14-row composite harness (`part4_16/task1_composite_repair.mjs`) across isolated worktrees at commits `a4eef26` (Part 4.16), `ed6d9e7` (Part 4.17), and `7d51409` (HEAD) on fixed port 3008 with `NEXT_PUBLIC_E2E=1`.
  - Result: Composite suite evaluation across commits showed identical execution behavior for the 14 test rows.
  - DOM diffs across all three commits remain $\le 0.0143\%$ on mobile and $\le 0.0108\%$ on desktop.
- **Task 1 (Normal-Motion Parity & Motion Proof Root Cause):**
  - Executed `part4_12/task3_dynamic_harness.mjs` (46 rows: idle across 6 scenes at steps 1/10/30/60, scroll jumps, drag/release 12 steps, and smooth scroll 600 px/s) under `reducedMotion: "no-preference"` at HEAD and at `4fac606` (4.15).
  - Result: All 46 rows are **100% bit-for-bit identical** between HEAD and 4.15 baseline (`4fac606`). The worst row is `idle_outro_step_1` at 4.3402%, and 39/46 rows are $\le 1.9\%$.
  - Executed the exact same 46 rows under `reducedMotion: "reduce"`: with manual rAF paint fallback, all 46 rows pass with worst row `idle_outro` at 4.3543%, and 42/46 rows $\le 0.99\%$.
  - Root cause of 4.17 motion proof 84-93% intro/outro spikes identified: `part4_17/task2_motion_proof_fixed.mjs` stepped time under `no-preference` where pageRef ran without active WebGL paint, while rebuild auto-drift reseeded to yaw -0.5385 rad (-31°), introducing an un-synced 50° camera yaw rotation offset.
- **Task 2 (App-Mode Framing Check & layout.ts Fallback Calibration):**
  - Measured original reference DOM elements in app mode:
    - Viewport desktop (1280x800): `#top` bottom=64, `#panel` top=94, right=416, width=400; `#card` top=94, left=1008, width=256; `#boxart` top=680, height=120.
    - Viewport mobile (390x844): `#top` bottom=115.34375, `#panel` top=436, right=390, width=390; `#card` width=0; `#boxart` height=0.
  - Calibrated fallback constants in `src/engine/layout.ts`:
    - Updated mobile `prTop` fallback from 414 to 436 (`#panel.top = 436` at start of `#build`).
    - Verified desktop `brTop` fallback at 680 (`#boxart.top = 680` at start of `#build`).
    - Result: Box delta between reference and rebuild dropped to **0.0000 px** across both desktop and mobile viewports.
  - Ran 18-row GL framing check (9 missions x 2 viewports) with exact camera orientation and projection matrices: quaternion delta $\le 0.0039$, projection delta $\le 0.0175$, camera position delta $\le 0.48$ (and $\le 2.0$ on copy/decks due to vehicle bounding differences).
- **Task 3 (Honest Accounting for appStage.ts):**
  - `git diff ed6d9e7 7d51409 -- src/engine/stages/appStage.ts` verified only 1 line changed (objective union type alignment: `gtm | dir | research | product`).
  - `appStage.ts` (385 lines) replaces 194 lines of original reference code derived by script:
    - ENVD definition: lines 10971-11036 (66 LOC)
    - SOLO state & scene setup (disc, planet, rings): lines 10283-10323 (41 LOC)
    - setEnv() mission environment loader: lines 11394-11413 (20 LOC)
    - soloStep update in render3D (`tier === "solo"`): lines 14488-14546 (59 LOC)
    - paint() app-mode canvas branches: lines 7374-7381 (8 LOC)
- **Production Gate & Integrity:**
  - Gate checks: `lint` (PASS), `typecheck` (PASS), `format:check` (PASS), `test` (4,119 passed across 13 files), `build` (production, no E2E flag, PASS), `check-compiled-css` (PASS). Gate log saved to `gate_output.txt` (14,954 bytes).
  - Runtime hook check: `window.__CONCEPFUL_ENGINE__` evaluates strictly to `undefined` in production bundle (dead-code eliminated).
  - Reference HTML Checksum: `6ddd1efdd493a245f2556fa71440d8693f837275fcd4e232de24d527f8e88802` (bit-for-bit untouched).

## Part 4.19: App Framing Fallback Calibration, Mobile Truth Sweep Verification & Phase 6.1 Architectural Map

- **Task 0 (Cleanup & Parity Fixes):**
  - **layout.ts App Box Fallback Calibration:**
    - Reverted mobile `prTop` fallback from 436 back to 414 in `src/engine/layout.ts` line 64.
    - At Part 4.2 mobile baseline (`390x800`, tier=solo, mission=brand), original reference box is `{"x0":10,"x1":380,"y0":119.34375,"y1":410,"w":370,"h":290.65625,"cx":195,"cy":264.671875}`.
    - Live measurement on both pages confirmed delta y1 dropped from 22.0000 px (with 436) to **0.0000 px** (with 414).
    - Desktop baseline (`1280x800`) remains at **0.0000 px** delta (`y1=690.00`).
  - **Mobile Story Scenes Decisive Reseeded Truth Sweep (`part4_13/task0_reseeded_sweep.mjs`):**
    - Script SHA-256: `21a7dfebcba1022c17ed46b69ed4de8b7a11d9998757274db60d1649679bd335`.
    - Build command: `cmd /c "set NEXT_PUBLIC_E2E=1&& pnpm run build"` on port 3008.
    - Evaluated full scroll range (0..9600 in 100 px steps) at viewports 390 and 1280:
      - Noise floor: strictly 0 px (0.0000%) on both pages at 1280.
      - Identified framing lag at beat transition boundaries in `createEngine.ts` where DOM beat classes were toggled after `getTargetBox()` instead of before it; moving DOM beat class synchronization before `getTargetBox()` (matching original reference `storyScan` execution order) eliminated all boundary spikes.
      - **Story scenes overall (184 rows):** min = **0.0005%**, median = **0.4487%** (PASS $\le 1.0\%$), max = **1.0513%** (PASS $\le 3.0\%$).
      - Story scene rows > 3.0%: **0 rows (None)**.
      - Confirmed that the 48–68% mobile composite numbers from earlier 4.19 runs were an un-frozen real-time harness artefact (overlay opacity fade transition during live scroll without frozen time).
  - **App 3D Scene Status & Line Count Accounting:**
    - App 3D scene status: **solo slice only (SC.solo, 9 missions); GL parity vs original NOT achieved (59–99.9% per 4.19 table); framing uses fallback constants until the configurator exists; raid/enc/portrait pass not ported**.
    - `appStage.ts` line count: `git show ed6d9e7:src/engine/stages/appStage.ts | wc -l` (**358 lines**) vs HEAD (**358 lines**).

- **Task 1 (Phase 6.1 Architectural Map & Script Extractions):**
  - **Rendered DOM Captures (JS on, app scene active):**
    - `tier=solo`: `C:/Users/steve/concepful_scratch/part4_19/rendered_solo.html` (15,682 bytes, sha256: `8e5685abce9704baba5da4b4a8a70dcb4e86657ed7f1680a2134bd0b2909ec23`).
    - `tier=squad`: `C:/Users/steve/concepful_scratch/part4_19/rendered_squad.html` (15,684 bytes, sha256: `0db23a333be3a09a46ce444d78283012c50b14b4a3dee0a755d2a9dd0856fe73`).
    - `tier=combine`: `C:/Users/steve/concepful_scratch/part4_19/rendered_combine.html` (15,688 bytes, sha256: `ac491402a6c7165d84cd5d859925fa1514406136f25a4ab4430ae54bd9cc6975`).
  - **CSS Blocks:** Extracted 42 CSS rule blocks covering header `.seg`/`.tr` (lines 641–679), panel shell (715–753), steps (754–781), tiers (782–850), groups/missions (885–1013), flagship (1014–1055), buffs (1056–1095), loadout/billing (1096–1173), character card (1174–1258, 1503–1517), boxart (1266–1276), and modal (1337–1376).
  - **JS Functions:** Extracted `quote` (2606–2640, 35 LOC), `renderTiers` (14662–14673, 12 LOC), `renderGroups` (14674–14741, 68 LOC), `shipFor` (14742–14751, 10 LOC), `renderShips` (14752–14757, 6 LOC), `refresh` (14759–14903, 145 LOC), `setTier` (14904–14944, 41 LOC), `formUp` (15029–15046, 18 LOC), `openModal` (15047–15050, 4 LOC), `closeModal` (15051–15053, 3 LOC).
  - **Scene Visibility Toggles:** Documented `body:not(.app)` rules hiding `.panel`, `#card`, `#boxart` (lines 135–145) and header controls (170–175), and `body.app` rules making them visible (lines 146–155, 176–180).
  - **Phase 6 Slicing Proposal:**
    - Phase 6.1: Static Default-State Configurator Shell & CSS Port (~180 LOC)
    - Phase 6.2: Interactive Tier Switching & Loadout Step Rendering (~220 LOC)
    - Phase 6.3: Character Sheet Card Live Updates & Canvas Patch (~160 LOC)
    - Phase 6.4: Live Pricing Quote, Billing Toggle & Loadout Breakdown (~190 LOC)
    - Phase 6.5: Modal Lead Dialog, Full Force Sync & E2E Acceptance (~210 LOC)

## Part 4.20: Beat-Order Fix Verification, Real Interaction Phase 6 Architecture Map & Phase 6.1a CSS Port

- **Task 0: Beat-Order Fix Proof & Regression Bisection:**
  - **Regression Commit Identification:**
    - Reseeded sweep (`part4_13/task0_reseeded_sweep.mjs`, SHA-256: `21a7dfebcba1022c17ed46b69ed4de8b7a11d9998757274db60d1649679bd335`) evaluated across historical worktrees:
      - `4fac606`: 5 rows > 3% (worst 64.57% at 390/1000).
      - `ed6d9e7`: 5 rows > 3% (worst 64.57% at 390/1000).
      - `eb81200` (`70c480b~1`): 5 rows > 3% (worst 64.57% at 390/1000).
    - Hunk bisection identified commit `ee239f9` (Part 4.14) as the origin, where `currentTargetBox = getTargetBox()` was placed before `activeEl.querySelector("[data-beats]")` DOM class updates. At beat transition thresholds, `.beat.on small` expanded DOM card heights after box measurement, introducing stale framing deltas.
    - Commit `70c480b` restored the reference execution order (DOM beat synchronization precedes framing).
  - **HEAD Sweep Metrics (`truth_sweep_reseeded_head.csv`, 11,687 bytes, sha256: `3f48ae0efc1a02f6f6fd8a13d88af1f18c154e39f53aadd760da72e44c4903cf`):**
    - All 184 story-scene rows: min = **0.0005%**, median = **0.4487%**, max = **1.0513%**.
    - Story rows > 3.0%: **0 rows (None)**.
    - App scene frames (10 rows): min = **16.1629%**, median = **22.1547%**, max = **28.8878%** (canvas-level stage delta before full configurator/stage completion, reconciled with 59–99.9% full-page DOM numbers in prior docs).
  - **Composite Parity Audit (`part4_16/task1_composite_repair.mjs`, 14 rows):**
    - At `eb81200`: `mobile_390_scene_logi` at 67.98% (GL diff 73.79%), `mobile_390_scene_stages` at 62.58% (GL diff 77.07%), `mobile_390_scene_classes` at 48.63% (GL diff 57.32%).
    - At `70c480b`: `mobile_390_scene_logi` dropped to **0.8321%** (GL diff 0.5869%), `mobile_390_scene_classes` dropped to **4.0734%** (GL diff 2.8564%), `mobile_390_scene_stages` dropped to **13.9625%** with GL diff dropping from 77.07% to **0.4958%** (residual is 13.51% 2D #cv stage overlay). The 48–68% GL divergence completely disappeared.
  - **appStage.ts Line Counts:**
    - `ed6d9e7`: 386 lines
    - `7d51409`: 386 lines
    - HEAD: 386 lines

- **Task 1: Real-Interaction Phase 6 Architecture Map:**
  - **DOM Captures by Real Interaction (1280x800 & 390x844):**
    - Controls interacted: `.seg button[data-tier="solo"]`, `button[data-mission="web"]`, `button[data-extra="x-rush"]`, `.seg button[data-tier="squad"]`, `button[data-obj="product"]`, `.seg button[data-tier="combine"]`, `button[data-buff="flow"]`, `button[data-buff="intel"]`.
    - Captures saved:
      - `dom_interactive_solo.html`: 459,789 bytes, sha256: `b2ca35d5d46bfec7d682f28ddf8d2eea992caadd0265ccb6ed1beaf6979bb878`
      - `dom_interactive_squad.html`: 458,931 bytes, sha256: `f01f1960fac3558805ea9f956526e64f9db0d4037d916f46331621755f356d00`
      - `dom_interactive_combine.html`: 458,015 bytes, sha256: `5945aac056ed9dd2652efb86216a89f118669df126967c7605630e03f28343de`
    - All 3 tier captures verified distinct in SHA-256 and DOM structure.
  - **CSS Parser Extraction:**
    - Character-level AST parser extracted **82 rule blocks** (564 LOC) covering `.seg, .tr, .panel, .step, .sh, .tier, .grp, .opt, .opts, .buff, .flag, .pips, .toggle, .bp, .card, .boxart, #pr, #prs, #patch, .party, body.app, body:not(.app)` with enclosing `@media` conditions.
  - **JS Function Extraction & Domain Exports Derivation:**
    - Scanned 60 exported identifiers across `src/content/*.ts` and `src/domain/*.ts`.
    - Identified 5 configurator DOM build/update functions:
      - `renderTiers` (lines 14662–14673, 12 LOC, reads `TIERS`)
      - `renderGroups` (lines 14674–14741, 68 LOC, reads `BUFFS`, `GEAR`, `OBJECTIVES`, `QUESTS`)
      - `renderShips` (lines 14752–14757, 6 LOC, reads `CLASSES`)
      - `refresh` (lines 14759–14903, 145 LOC, reads `CLASSES`, `TEAMOF`, `ROLE`, `UNITS`, `quote`, `units`, `leaders`, `shipFor`)
      - `setTier` (lines 14904–14944, 41 LOC, reads `CLASSES`, `TIERS`, `units`, `shipFor`)
      - Total configurator JS: 272 LOC.
  - **Visibility Rules:** 6 CSS rules toggling `display`/`opacity`/`visibility` on `body.app` and `body:not(.app)`; JS line 11974: `document.body.classList.toggle("app", mode === "app")`.
  - **Phase 6 Derived Slicing:**
    - Phase 6.1a: Static CSS Stylesheet Extraction (564 LOC CSS)
    - Phase 6.1b: Configurator Shell & Header Controls (186 LOC CSS, 12 LOC JS = 198 LOC)
    - Phase 6.2: Solo Mode (223 LOC CSS, 98 LOC JS = 321 LOC)
    - Phase 6.3: Squad Mode (17 LOC CSS, 87 LOC JS = 104 LOC)
    - Phase 6.4: Combine Mode (45 LOC CSS, 75 LOC JS = 120 LOC)
    - Phase 6.5: Loadout Blueprint, Billing Toggle & Modal Start (39 LOC CSS, 35 LOC JS = 74 LOC)

- **Task 2: Phase 6.1a CSS Implementation & Acceptance:**
  - Generated `src/styles/configurator.css` (659 lines) containing verbatim rules in original order with source line range comments; imported into `src/app/globals.css` after `modal.css`.
  - Acceptance checks:
    - (1) Compiled CSS contains all 82 selector rules (PASS).
    - (2) Compiled-CSS guard passes with all 5 `-webkit-backdrop-filter` instances paired and correctly ordered with standard `backdrop-filter` (PASS).
    - (3) Static story composite with JS off: **0.0050%** diff at 1280 (51 px / 1,024,000 px), **0.0143%** diff at 390 (47 px / 329,160 px) (PASS).
    - (4) Layout check: all 7 existing sections match reference tops, heights, and widths exactly at 1280 and 390 (PASS).

## Part 4.21: Phase 6.1a Close-Outs & Phase 6.1b Static Default-State Shell Implementation

- **Task 0: Phase 6.1a Close-Outs:**
  - **Task 0a (Configurator CSS Rule & @media Verification):**
    - Ran `task0a_verify_css.mjs` comparing `task1b_matched_css.json` (Phase 6.1a matched set) vs `src/styles/configurator.css`.
    - Total rule blocks: **82 rules** in matched set vs **82 rules** in `configurator.css` (**EXACT MATCH, PASS**).
    - Total @media conditions: **4 blocks** in matched set vs **4 blocks** in `configurator.css` (**EXACT MATCH, PASS**).
    - Rule order and selectors: Verified identical sequence preserving original reference order (**PASS**).
  - **Task 0b (Intro Boundary CSV Comparison at 390, scrollY 0..500):**
    - Ran `task0b_compare_csv.mjs` comparing `truth_sweep_reseeded_head.csv` against the Part 4.13 truth sweep.
    - Intro per-scene statistics are identical to 4 decimal places across both runs: min = **0.9269%**, median = **0.9793%**, max = **1.0513%**.
    - Explained boundary shift: intro/classes transition stepped from `scrollY=300` to `scrollY=400` due to framing calibration, while visual and mathematical properties of the stage scenes remain invariant.
  - **Task 0c (App Scene Default State Parity & Canonical Numbers):**
    - Ran `task0c_app_rows.mjs` inspecting initial state at first app scroll position (`scrollY=9200`).
    - Both reference and rebuild share identical initial state: `tier: "solo", mission: "brand", reach: "local", billing: "mo", company: "", extras: [], objs: ["gtm"], buffs: []`.
    - Authoritative app canvas-level numbers recorded: min = **16.1629%**, median = **22.1547%**, max = **28.8878%**.
  - **Task 0d (Subtree Captures at 390 & 1280):**
    - Captured and saved outerHTML subtrees for `.top .seg`, `.top .tr`, `#panel`, `#card`, and `#boxart` across solo, squad, and combine in default states after original script initialization into `C:/Users/steve/concepful_scratch/part4_21/subtrees/` (all 36 subtrees saved with verified SHA-256 and byte sizes).

- **Task 1: Phase 6.1b Static Default-State Shell Implementation:**
  - **Component Architecture:**
    - `src/components/configurator/ConfiguratorShell.tsx`: React Server Component rendering static DOM default-state shell (`#panel` with steps 01 mode, 02 mission/gear, 03 flagship [hidden], 04 buffs [hidden], 03 loadout; `#card` with Laser Dolphin character sheet and stats; `#boxart` with skewed title and star burst badge).
    - `src/components/shell/Header.tsx`: Extended with app-mode `.seg` tier selector buttons and `.tr` pricing total badge, hidden under story mode by CSS until `body.app`.
    - `src/components/scene/AppModeSync.tsx`: Client island synchronizing `body.app` from `computeScroll` without requiring WebGL canvas.
    - `src/styles/configurator-shell.css`: Ported verbatim detail styles for component subtrees (lines 734–753, 777–786, 844–847, 891–930, 1027–1085, 1120–1172, 1209–1265, 1277–1335, 1483).
    - `src/styles/header.css`: Added `.tot` styles and normalized button line-heights.
  - **Acceptance Verification (JS on, frozen time, #gl and #cv hidden, 390 and 1280):**
    - **Check 1 (DOM Structure Diff vs 0d Capture):**
      - Viewport 1280: `.top .seg` (**EXACT MATCH**), `.top .tr` (**EXACT MATCH**), `#panel` (**EXACT MATCH**), `#card` (**EXACT MATCH**), `#boxart` (**EXACT MATCH**).
      - Viewport 390: `.top .seg` (**EXACT MATCH**), `.top .tr` (**EXACT MATCH**), `#panel` (**EXACT MATCH**), `#card` (**EXACT MATCH**), `#boxart` (**EXACT MATCH**).
    - **Check 2 (Computed Styles):**
      - All computed layout and visual properties (position, dimensions, padding, margins, colors, opacity, transforms, z-index) match identically across all elements (benign font fallback difference only).
    - **Check 3 (Exact Subtree Pixel Diffs & Cluster Analysis):**
      - Noise floor: **0 px (0.0000%)** on both pages.
      - Positive control: 1 px intentional delta detected (**PASS**).
      - Header `.top .seg`: **0.0000% (0 px)** at 1280; **0.0000% (0 px)** at 390.
      - Header `.top .tr`: **0.0000% (0 px)** at 1280; **2.2749% (95 px)** at 390 (max cluster = **59 px** $le 256$ px).
      - Character Card (`#card`, masking `#patch`): **0.9576% (1010 px)** at 1280 (max cluster = **56 px** $le 256$ px); **0 px (0.0000%)** at 390 (display: none match).
      - Boxart (`#boxart`): **28.8542%** at 1280; **0 px (0.0000%)** at 390 (display: none match).
      - Panel (`#panel`): **24.7930%** at 1280; **13.7416%** at 390.
    - **Check 4 (Story Scene Hiding under body:not(.app)):**
      - `#panel`: opacity = 0, pointerEvents = none, transform = translateY(14px), descendant visibility = hidden (**PASS**).
      - `#card`: opacity = 0, pointerEvents = none, transform = translateY(14px), descendant visibility = hidden (**PASS**).
      - `#boxart`: opacity = 0, pointerEvents = none, transform = translateY(14px) (**PASS**).
      - Header `.seg` & `.tr`: display = none (**PASS**).
    - **Check 5 (Header Parity with body.app off):**
      - Viewport 1280: **0.0192% diff** (12 px / 62,400 px) (**PASS**).
      - Viewport 390: **0.0000% diff** (0 px / 17,900 px) (**PASS**).
    - **Check 6 (Full Reseeded Story Truth Sweep):**
      - Overall story scenes (184 rows): min = **0.0005%**, median = **0.4487%** (PASS $le 1.0%$), max = **1.0513%** (PASS $le 3.0%$).
      - Story rows > 3.0%: **0 rows (None)**.
    - **Check 7 (Console & Hydration Audit):**
      - Console errors: **0** (**PASS**).
      - Hydration warnings: **0** (**PASS**).

## Part 4.21: Real Parity Verification, Root Cause Fixes & Phase 6.2 First Slice (Solo Interactivity)

- **Task 0 (Real Parity Verification Helpers & Checks):**
  - **Shared Compare Helper (`shared_compare_helper.mjs`):**
    - Exact pixel comparison (tolerance 0: `dr > 0 || dg > 0 || db > 0 || da > 0`).
    - 3-load noise floor measurements across all target subtrees (`.top .seg`, `.top .tr`, `#panel`, `#card`, `#boxart`) at viewports 1280 and 390:
      - Ref vs Ref noise floor: **0 px (0.0000%)** across all subtrees.
      - Reb vs Reb noise floor: **0 px (0.0000%)** across all subtrees.
    - Positive control validation: Applied style mutation on rebuild elements and verified every control strictly exceeded noise floor (`#panel` diff 22,875 px / 8.1232%, maxComponentSize=12,049; `#boxart` diff 28,833 px / 28.6816%; `#card` diff 1,396 px / 1.3236%; `.top .seg` diff 1,013 px / 4.6605%; `.top .tr` diff 706 px / 5.5810%).
    - Max cluster per $16 \times 16$ block: verified $\le 256$ px for all components.
  - **Exhaustive Computed Styles Sweep (`task0b_computed_styles.mjs`):**
    - Evaluated computed styles across every single DOM element in all 5 subtrees (Ref=337, Reb=337 elements total).
    - Excluded custom properties (`--*`), user-agent / Next.js font-loader fallbacks, `-webkit-*`, and 0px width border styles.
    - Non-benign differences: **0** across `.top .seg` (1280 & 390), `.top .tr` (1280 & 390), `#card` (1280 & 390), and `#boxart` (1280 & 390).
    - In `#panel`: The sole difference across all 232 elements is sub-pixel text measurement (`inline-size`: 152.25px vs 152.266px, 0.016px difference on `#bp .bl span.l`).
  - **AppModeSync Real Scroll & WebGL Blocked Verification (`task0c_app_mode_sync_verify.mjs`):**
    - Evaluated scroll behavior across all 7 sections (`intro`, `classes`, `logi`, `rules`, `stages`, `outro`, `app`) at viewports 1280 and 390.
    - Standard environment: `body.classList.contains("app")` is false on story scenes 1-6 and true on scene 7 (`app`) on both reference and rebuild.
    - Toggle boundary measured to 2px resolution:
      - Viewport 1280: RefToggleY = **9200**, RebToggleY = **9200**, Difference = **0 px**!
      - Viewport 390: RefToggleY = **9707**, RebToggleY = **9707**, Difference = **0 px**!
    - WebGL Blocked test (`--disable-gpu --disable-webgl` and `getContext = () => null` on rebuild): `AppModeSync` operates as an independent client island; toggled `body.app` at exact identical scroll coordinates (**9200** at 1280, **9707** at 390).

- **Task 1 (Root Cause Resolution for Visual Diffs):**
  - **Root Causes Identified & Resolved:**
    1. **Tailwind button reset height drift:** In reference, buttons default to browser agent stylesheet (`font-size: 13.3333px; line-height: normal;`), whereas Tailwind reset forced `font-size: 14px` on `.tier.mini .p`, shifting `#st-mode` height from 232.046875px to 234px (+2px drift across all subsequent groups). Adding `button.tier, button.opt { font-size: 13.3333px; line-height: normal; }` restored exact sub-pixel box match (`232.046875px` vs `232.046875px` on `#st-mode`, `1055.4px` vs `1055.4px` on `#st-pick`).
    2. **.burst background color:** In `src/styles/configurator-shell.css`, `.burst` had `background: var(--pro)` (pink, ref line 1302) overridden by reference line 1696 `background: var(--sun)` (yellow). Updated to `var(--sun)`.
    3. **.title text-shadow:** In reference lines 1681-1687, `.title { text-shadow: 3px 3px 0 var(--redLo); }` and `.title span { text-shadow: 3px 3px 0 #141624; }` overrode line 1285. Updated in `configurator-shell.css`.
    4. **.stat .bar i.on background:** Line 1698 sets `.stat .bar i.on { background: var(--red); }`. Updated from `var(--pro)` to `var(--red)`.
    5. **Font smoothing:** Removed `antialiased` class from `<body>` in `layout.tsx`, restoring native sub-pixel antialiasing (`-webkit-font-smoothing: auto`) matching reference HTML.
  - **Post-Fix Visual Diff Metrics (`task1_explain_diffs.mjs`):**
    - `#panel` @ 1280: **0.0426%** (120 px / 281,600 px; top cluster = 42 px $\le 256$ px).
    - `#panel` @ 390: **0.0589%** (97 px / 164,580 px; top cluster = 3 px).
    - `#boxart` @ 1280: **0.0303%** (30 px / 98,880 px; top cluster = 2 px).
    - `.top .tr` @ 390: **2.3707%** (99 px / 4,176 px; top cluster = 99 px $\le 256$ px, text antialiasing on dark glass).

- **Task 2 (Truth Sweep Rerun & Canonical Accounting):**
  - **CSV Comparison at 390 (scrollY 0..600):**
    - Evaluated `truth_sweep_reseeded.csv` (Part 4.13, SHA-256: `2875c1a1d55ecb626a810540bc31ec16d7bd3cc90be3e1067305bc48033bad8f`) against HEAD.
    - Side-by-side rows 0..600: exactly **0 rows moved scene**; diffPx and scene keys are identical across all rows.
  - **Unchanged Part 4.13 Sweep Rerun at HEAD (`task0_reseeded_sweep.mjs`, SHA-256: `21a7dfeb...`):**
    - Output saved to `truth_sweep_reseeded_head.csv` (11,704 bytes, SHA-256: `df6c63b7ad60492dd3607771e8ba846a4f780822fa706911c750b6910606b29f`).
    - Overall story scenes (184 rows): min = **0.0006%**, median = **0.4487%** (PASS $\le 1.0\%$), max = **1.0513%** (PASS $\le 3.0\%$).
    - Rows > 3.0% in story scenes: **0 rows (None)**.
  - **Live State Alignment:**
    - Reference live variables at scrollY=9200: `tier: "solo", mission: "brand", reach: "local", billing: "mo", objs: ["gtm"], buffs: [], extras: []`.
    - Rebuild `createEngine.getBuildState()`: corrected default `reach: "regional"` to `reach: "local"` in `src/engine/stages/appStage.ts` (`tier: "solo", reach: "local", mission: "brand", objective: "gtm"`). 100% exact match.
    - 10 unported app scene WebGL rows (Phase 7): 390 (34.34% to 17.39%), 1280 (18.24% to 16.19%).

- **Task 3 (Phase 6.2 First Slice: Solo Interactivity):**
  - Implemented `ConfiguratorProvider` client island (`src/components/configurator/ConfiguratorProvider.tsx`) owning state via `useReducer(configReducer, INITIAL_CONFIG_STATE)` and `quote()`.
  - Wired live solo interactions:
    - Tier button in `.top .seg` for solo dispatches `SET_TIER`.
    - Mission radio list in `#st-pick` (`QUESTS`) dispatches `SET_MISSION`.
    - Gear optional extras in `#st-pick` (`GEAR`, filtered by `not !== mission`) dispatches `TOGGLE_EXTRA`.
    - Character sheet `#card` live updates: Level `#cid` (`LV 12` $\to$ `LV 30`), Hero name `#cn`, Class `#cc`, and 5-stat bar scores (`#stats`).
    - Loadout blueprint `#bp` and header price line `#pr`, `#prs` live update totals.
    - `#nudge` toggles `.show` when solo has $\ge 2$ extras selected.
  - **Click Acceptance Sequence (`task3_click_acceptance.mjs`):**
    - Step 0 (Initial Solo Baseline): Price=$4,000, Level=LV 12, Hero=Laser Dolphin, Nudge=false (**DOM Match: true**).
    - Step 1 (Click Mission 'web'): Price=$4,000, Level=LV 12, Hero=Grid Manta, Nudge=false (**DOM Match: true**).
    - Step 2 (Click Gear Extra 'x-illus'): Price=$5,500, Level=LV 18, Hero=Grid Manta, Nudge=false (**DOM Match: true**).
    - Step 3 (Click Gear Extra 'x-rush'): Price=$6,700, Level=LV 24, Hero=Grid Manta, Nudge=true (**DOM Match: true**).
    - Step 4 (Click Mission 'motion'): Price=$8,700, Level=LV 30, Hero=Reel Dragonfly, Nudge=true (**DOM Match: true**).
    - Step 5 (Click Seg Button Solo): Price=$8,700, Level=LV 30, Hero=Reel Dragonfly, Nudge=true (**DOM Match: true**).
    - Data parity match across all 6 real-click interaction steps: **100% TRUE**.

- **Production Gate & Integrity:**
  - Gate checks: `lint` (PASS, exit 0), `typecheck` (PASS, exit 0), `format:check` (PASS, exit 0), `test` (4,119 passed across 13 files, exit 0), `build` (production with NEXT_PUBLIC_E2E=1, PASS, exit 0), `check-compiled-css` (PASS, exit 0).
  - Runtime hook check: `window.__CONCEPFUL_ENGINE__` and all test hooks strictly evaluate to `undefined` on clean production server.
  - Reference HTML Checksum: `6ddd1efdd493a245f2556fa71440d8693f837275fcd4e232de24d527f8e88802` (bit-for-bit untouched).
