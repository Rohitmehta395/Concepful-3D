# Concepful Mech Builder — Redevelopment Progress Tracker

This document records the verification history, approved milestones, and live status of each phase in the redevelopment of **Concepful Mech Builder**.

---

## 1. Overall Progress Summary

|    Phase     | Title                                 | Parts  |                            Status                            |         Approval Date          |
| :----------: | :------------------------------------ | :----: | :----------------------------------------------------------: | :----------------------------: |
| **Phase 1**  | **Foundation and Baseline**           | 5 / 5  |                         **Approved**                         |          Oct 30, 2026          |
| **Phase 2**  | **Content and Domain Extraction**     | 2 / 2  |                         **Approved**                         |          Oct 30, 2026          |
| **Phase 3**  | **Static Page Shell**                 | 2 / 8  | **Part 3.2 Implemented (Awaiting User Review and Approval)** | Part 3.1 Approved Oct 30, 2026 |
| **Phase 4**  | **Scene Engine Core**                 | 0 / 8  |                           Pending                            |               —                |
| **Phase 5**  | **3D Content (Ships, Heroes, Units)** | 0 / 14 |                           Pending                            |               —                |
| **Phase 6**  | **Configurator & Interaction Wiring** | 0 / 7  |                           Pending                            |               —                |
| **Phase 7**  | **2D Overlay, Callouts, and Patch**   | 0 / 4  |                           Pending                            |               —                |
| **Phase 8**  | **Responsive & Accessibility Pass**   | 0 / 5  |                           Pending                            |               —                |
| **Phase 9**  | **Performance & Optimization**        | 0 / 4  |                           Pending                            |               —                |
| **Phase 10** | **Production, QA, and Deployment**    | 0 / 5  |                           Pending                            |               —                |

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

- **Status:** **IMPLEMENTED (Awaiting User Review and Approval)**
- **Deliverables:**
  - `src/components/shell/Logo.tsx`: Cel-shaded mecha crest SVG (`.mk`) and vector wordmark SVG (`.wm`) converted to valid JSX, marked with `aria-hidden="true"` and `focusable="false"`. Zero element IDs (no collision risk).
  - `src/components/shell/Header.tsx`: Fixed `<header id="top">` landmark housing `<a className="logo glass" href="#intro" aria-label="Concepful">` and `<nav className="navl glass" aria-label="Primary">` with `NAV_LINKS` and `NAV_CTA`. Zero hardcoded hrefs.
  - `src/styles/header.css` & `src/app/globals.css`: Glass backdrop filter (`-webkit-backdrop-filter` declared before `backdrop-filter` to prevent LightningCSS de-duplication), safe-area gutter positioning (`--gl`, `--gr`, `--st`), retro 3D tactile button shadow (`--redLo`), hover/active translations, media query (<=900px) hiding non-CTA links, reduced-motion bypass, and WCAG-compliant `--red` focus rings.
  - `src/content/story.ts`: Exported `BRAND` (`href: "#intro"`, `label: "Concepful"`).
  - `src/app/layout.tsx`: Mounted `<Header />` directly following `<SkipLink />`.
- **Verification:**
  - **Backdrop filter & Ancestors:** Both original and new app render `backdropFilter: blur(12px) saturate(1.1)` on `.logo` and `.navl` with identical background `rgba(20, 22, 40, 0.84)` across 1280px and 390px.
  - **Faux-Bold & Fonts:** Russo One verified at single weight 400 (`font-weight: 400` on `.wm`, no synthetic bolding applied). Inter weights verified (600 for links, 700 for CTA).
  - **Hover & Focus States:** Tested with Playwright at 1280px. Hover translation (`translateY(-1px)`), background color shifts, and focus visible outlines verified against source CSS.
  - **Client JavaScript Proof:** 0 bytes raw difference, 0 bytes gzip difference (568,669 raw / 174,719 gzip) across identical chunk hashes.
  - **Pixel Diff:** 0.000% difference at 1280px (89,600 pixels) and 0.000% difference at 390px (25,740 pixels) on flat `#141624` background.

---

## 5. Verification Dimensions & Quality Targets

| Dimension                      | Verification Scope                                  | Status                 | Notes                                                                            |
| :----------------------------- | :-------------------------------------------------- | :--------------------- | :------------------------------------------------------------------------------- |
| **Code & Build Checks**        | `pnpm lint`, `typecheck`, `format:check`, `build`   | **Verified Passing**   | All standard commands pass cleanly with exit code 0.                             |
| **Domain Logic Tests**         | `pnpm test` (4,100 test cases)                      | **Verified Passing**   | 100% parity against original JavaScript oracle.                                  |
| **Repository File Integrity**  | Checksum of `reference/Concepful_Mech_Builder.html` | **Verified Passing**   | SHA-256: `6DDD1EFDD493A245F2556FA71440D8693F837275FCD4E232DE24D527F8E88802`.     |
| **Visual Baseline Archive**    | 36 screenshots in `reference/baseline/`             | **Verified Passing**   | Intact across 4 viewports (Part 1.2).                                            |
| **Document Shell Parity**      | HTML head, skip link, keyboard focus                | **Verified Passing**   | Head metadata matches, skip link focuses main, fonts verified in browser engine. |
| **Static Header Parity**       | Logo, wordmark, nav links, CTA, glass styling       | **Verified Passing**   | Computed styles match across 4 viewports; mobile link collapsing matches.        |
| **Font Bundling (CLS = 0)**    | Build-time `.woff2` extraction                      | **Verified Passing**   | Local assets preloaded in head. Russo One, Inter, JetBrains Mono verified.       |
| **Visual Fidelity (Scene/UI)** | Reconstructed 3D mechas & HUD vs. baseline          | **Pending Phases 3–7** | Layout implementation in progress.                                               |
| **Accessibility (WCAG AA)**    | Keyboard navigation, focus rings, contrast          | **In Progress**        | Skip link and header focus rings verified; full audit scheduled for Phase 8.     |
| **Performance (60 FPS)**       | Profiling render loop & DPR governor                | **Pending Phase 9**    | Scheduled for Phase 9 profiling.                                                 |
| **E2E Test Suite**             | Full Playwright configurator flow                   | **Pending Phase 10**   | Scheduled for Phase 10 QA.                                                       |
