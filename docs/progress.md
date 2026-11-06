# Concepful Mech Builder — Redevelopment Progress Tracker

This document records the verification history, approved milestones, and live status of each phase in the redevelopment of **Concepful Mech Builder**.

---

## 1. Overall Progress Summary

|    Phase     | Title                                 | Parts  |                               Status                                |            Approval Date             |
| :----------: | :------------------------------------ | :----: | :-----------------------------------------------------------------: | :----------------------------------: |
| **Phase 1**  | **Foundation and Baseline**           | 5 / 5  |                            **Approved**                             |             Oct 30, 2026             |
| **Phase 2**  | **Content and Domain Extraction**     | 2 / 2  |                            **Approved**                             |             Oct 30, 2026             |
| **Phase 3**  | **Static Page Shell**                 | 3 / 8  | **Part 3.3 + 3.3c Implemented (Awaiting User Review and Approval)** | Part 3.1 & 3.2 Approved Oct 30, 2026 |
| **Phase 4**  | **Scene Engine Core**                 | 0 / 8  |                               Pending                               |                  —                   |
| **Phase 5**  | **3D Content (Ships, Heroes, Units)** | 0 / 14 |                               Pending                               |                  —                   |
| **Phase 6**  | **Configurator & Interaction Wiring** | 0 / 7  |                               Pending                               |                  —                   |
| **Phase 7**  | **2D Overlay, Callouts, and Patch**   | 0 / 4  |                               Pending                               |                  —                   |
| **Phase 8**  | **Responsive & Accessibility Pass**   | 0 / 5  |                               Pending                               |                  —                   |
| **Phase 9**  | **Performance & Optimization**        | 0 / 4  |                               Pending                               |                  —                   |
| **Phase 10** | **Production, QA, and Deployment**    | 0 / 5  |                               Pending                               |                  —                   |

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

- **Status:** **Implemented (Awaiting User Review and Approval)**
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

- **Status:** **IMPLEMENTED (Awaiting User Review and Approval)**
- **Commit:** `fix(hero): size card to fit heading`
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

> **Part 3.4 Note:** Before porting other `.sc` cards (Classes, Logistics, Rules, Plans, Outro), run the same overflow measurement on each. Do not widen them without first measuring their heading overflow at all ≥901px viewports.

---

## 5. Accessibility Backlog

The following items were identified during the Part 3.2 review and are tracked for remediation in Phase 8 (Responsive & Accessibility Pass) without regressing visual parity with the reference prototype:

1. **CTA Text Contrast (`#ffffff` on `--red`):**
   White text on `--red` (`#ee004e`) measures at 4.425:1. This matches the original prototype exactly, but falls slightly below the WCAG AA requirement of 4.5:1 for small text (<18pt / 24px non-bold).
2. **Text Contrast on Background (`--red` on `--bg`):**
   `--red` (`#ee004e`) on `--bg` (`#141624`) measures at 4.056:1 if any regular text uses it (WCAG AA requires 4.5:1 for small text).
3. **Synthetic / Faux-Bold Display Font (`Russo One` at weight 600):**
   `Russo One` is a single-weight font (400). In the original prototype, `.navl a.fu` inherits `font-weight: 600` from `.navl a`, causing browser synthetic bolding. Kept for visual parity with original prototype; Phase 8 will evaluate explicit font-weight overrides or typography styling.
4. **Header Text-Edge Subpixel Difference (22px at 1280px):**
   At 1280px viewport width, an exact tolerance 0 diff identified 22 isolated edge pixels on nav link text anti-aliasing against the reference prototype. Cause is unproven (potential difference between Google Fonts woff2 generation vs system-level font rasterization). Tolerance 10 diff is 0.000%.
5. **Mobile Navigation Link Accessibility (<900px):**
   Below 900px, `.navl a:not(.fu)` is hidden via `display: none` in the original prototype, leaving no accessible hamburger menu or navigation list alternative on small screens. Phase 8 will provide an accessible responsive navigation drawer.

---

## 6. Verification Dimensions & Quality Targets

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
