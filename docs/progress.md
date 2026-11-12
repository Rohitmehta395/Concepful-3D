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
