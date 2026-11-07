# Concepful Mech Builder — Project Requirements & Scope

This document details the functional, visual, and non-functional requirements for rebuilding the **Concepful Mech Builder** prototype as a production Next.js application, with explicit provenance and verification tracking.

---

## 1. Source of Truth & Identity

- **Authoritative Source:** [`reference/Concepful_Mech_Builder.html`](file:///d:/Projects/Pete/Concepful-3D/reference/Concepful_Mech_Builder.html) is the authoritative visual and functional reference (`[Source HTML]`).
- **Visual Baseline:** 36 high-fidelity reference screenshots across four standard viewport widths (`390px`, `768px`, `1280px`, `1920px`) located in [`reference/baseline/`](file:///d:/Projects/Pete/Concepful-3D/reference/baseline/) (`[Approved Plan: Part 1.2]`).
- **Brand Identity & Spelling:** Spelled **Concepful** (as established in the prototype's title, navigation, SVG logo, and footer; `[Source HTML]`).
- **Core Experience:** A scroll-driven interactive narrative coupled with a real-time pricing configurator framed as a late-90s cel-shaded mecha MMO launcher (`[Source HTML]`).

---

## 2. Functional Requirements

All functional requirements below are derived directly from the source HTML prototype and confirmed in `concepful-redevelopment-plan.md` Deliverable 2 (_Requirements and scope_):

### 2.1 Navigation & Global Shell `[Source HTML: lines 613–660, 1808–1830]`

- **Fixed Top Header:** Contains brand logo SVG, anchor navigation links (`NAV_LINKS`: Classes `#classes`, How it works `#how-it-works`, Plans `#plans`), live pricing badge reflecting current configuration (`#chip`), and primary CTA link (`NAV_CTA`: Start your build `#build`). Rules is not in the navigation. (Source of truth: `src/content/story.ts`, verbatim from original lines 1808–1872).
- **Header Responsiveness:** On mobile viewports (`<= 900px`), navigation links `.navl a:not(.fu)` are hidden via media query, while logo, live pricing badge, and primary CTA remain visible.
- **Watermark:** Fixed bottom-right watermark badge (`.wmark`, lines 1741–1785, 2196–2206) with SVG/PNG icon, sound/environment status indicator, and branding ("BUILT WITH CONCEPFUL").

### 2.2 Scroll-Driven Narrative `[Source HTML: lines 146–160, 1993–2180]`

- **Story Chapters:** Six continuous story sections scrolling over the full-bleed canvas scene:
  1. Hero / Intro (`#s-intro` / `#hero`): "Creative Department-as-a-Service" · "Your creative department, on demand."
  2. Classes (`#s-classes` / `#classes`): "Choose your class" · "One goal: to provide a different perspective."
  3. Mission Log / Logistics (`#s-logi` / `#how-it-works`): "Mission log" · "How it actually works." (horizontal telemetry track)
  4. Server Rules (`#s-rules` / `#rules`): "Server rules" · "How we raid together."
  5. Plans & Pricing (`#s-stages` / `#plans`): "Hull sizes" · "Three ways to deploy." (Original section ID: `s-stages`)
  6. Outro (`#s-outro` / `#outro`): "Ready to deploy?" · "Enter the server."
- **Scene Coordination:** Canvas camera angle, background environment (Sea, Sky, Space), and active mecha assets adapt dynamically as narrative sections scroll into view.

### 2.3 Pricing Configurator & Character Card `[Source HTML: lines 715–1260, 1832–1990]`

- **Step-by-Step Configurator HUD:** Floating left glass panel allowing user customization:
  - **Step 1: Tier Selection (`TIERS`)** — Source of truth: `src/content/tiers.ts` (verbatim from the original).
  - **Step 2: Objectives & Quests** — Source of truth: `src/content/quests.ts` and `src/content/objectives.ts` (verbatim from the original).
  - **Step 3: Flagships, Gear & Buffs** — Source of truth: `src/content/classes.ts`, `src/content/gear.ts`, and `src/content/buffs.ts` (verbatim from the original).
  - **Billing Toggle** — Monthly vs. Annual (annual plan offers 12 months for the price of 10 months, providing a 2-month discount).
  - **Itemized Quote Breakdown** — Live calculation displaying base fee, mission modifier, flagship cost, active buffs/gear, subtotal, discount, and total.
- **Character Spec Card:** Floating right glass card displaying selected unit designation, class badge, stat polygon/bars, active party roster, and guild motto. Source of truth: `src/content/roster.ts` and `src/content/classes.ts` (verbatim from the original).
- **Mobile Adaptation:** On mobile (`<= 900px`), the loadout panel transitions into an interactive bottom sheet.

### 2.4 Modal Dialog `[Source HTML: lines 2208–2284]`

- **"Create Your Guild" Modal:** Accessible dialog triggered by the "START YOUR BUILD" CTA.
- **Form UI:** Source of truth: `src/content/story.ts` (modal copy and form field labels, verbatim from original lines 2208–2284).
- **Submission Feedback (`#m-done`):** Unlocks celebratory "Patch unlocked" graphic (`canvas#patch2`) and three-step onboarding briefing:
  1. Senior lead reviews brief and confirms the number.
  2. Client receives SOW and secure Stripe link; IP transfers on delivery.
  3. Context™ workspace opens with the build loaded and the mission begins.
     _(Note: Pure client-side prototype; no external API or data transmission occurs)._

---

## 2.5 Generated facts (script output)

Generated by `C:/Users/steve/concepful_scratch/task2_facts.mjs` directly from `reference/Concepful_Mech_Builder.html` and `src/content/*.ts`:

```text
=== Original section elements (grep -n "<section") ===
1903:<section class="step" id="st-mode">
1911:<section class="step" id="st-pick">
1923:<section class="step" id="st-ship">
1934:<section class="step" id="st-buffs">
1944:<section class="step" id="st-load">
1966:<section class="card glass" id="card" aria-label="Character sheet">
1994:<section class="st" data-scene="intro" id="s-intro">
2018:<section class="st tall" data-scene="classes" id="s-classes">
2058:<section class="hz-sec" data-scene="logi" id="s-logi">
2103:<section class="st" data-scene="rules" id="s-rules">
2135:<section class="st tall" data-scene="stages" id="s-stages">
2172:<section class="st" data-scene="outro" id="s-outro">
2188:<section

=== Original story section IDs (grep -n "id=\"s-") ===
1994:<section class="st" data-scene="intro" id="s-intro">
2018:<section class="st tall" data-scene="classes" id="s-classes">
2058:<section class="hz-sec" data-scene="logi" id="s-logi">
2103:<section class="st" data-scene="rules" id="s-rules">
2135:<section class="st tall" data-scene="stages" id="s-stages">
2172:<section class="st" data-scene="outro" id="s-outro">

=== Original Plans section element (grep -n "s-stages") ===
1870:><a href="#s-stages">Plans</a
2135:<section class="st tall" data-scene="stages" id="s-stages">
2183:><a class="ghost" href="#s-stages">Compare plans</a>

=== Original navigation markup (grep -n "<nav" and lines) ===
1868:      <nav class="navl glass" aria-label="Sections">
1869:        <a href="#s-classes">Classes</a><a href="#s-logi">How it works</a
1870:        ><a href="#s-stages">Plans</a
1871:        ><a class="fu" href="#build">Start your build</a>
1872:      </nav>

=== Content module item counts ===
TIERS: 3 (keys: solo, squad, combine)
QUESTS: 9
GEAR: 3
OBJECTIVES: 4
BUFFS: 7
CLASSES: 4
UNITS: 19 (keys: pos, gtm, dir, naming, research, brand, uiux, decks, copy, illus, web, motion, 3d, fab, hw, pm, ws, cmd, intel)

=== Navigation items (src/content/story.ts) ===
BRAND: label="Concepful", href="#intro"
NAV_LINKS:
  1. label="Classes", href="#classes"
  2. label="How it works", href="#how-it-works"
  3. label="Plans", href="#plans"
NAV_CTA: label="Start your build", href="#build"
```

---

## 3. Visual & Aesthetic Requirements

- **Color Palette Fidelity `[Source HTML: lines 1658–1679]`:** Faithful adherence to the active design tokens defined in [`src/styles/tokens.css`](file:///d:/Projects/Pete/Concepful-3D/src/styles/tokens.css) and documented in [`docs/design-system.md`](file:///d:/Projects/Pete/Concepful-3D/docs/design-system.md):
  - Navy ink background: `#141624`
  - Active bone hull / text: `#ffffff` (with `#ece6d6` preserved for 2D sprite rendering)
  - Brand red-magenta: `#ee004e`
  - Tactical glass HUD surfaces: `rgba(20, 22, 40, 0.84)` with `blur(12px)`
  - MMO discipline roles: Strategy (`#8c93e6`), Design (`#ee004e`), Production (`#ff7fa6`), Operations (`#55c2b8`), Sun/Gold (`#f2b33a`), OK (`#5fd39b`).
- **Typography `[Source HTML: lines 41–47, 68–70]`:** Self-hosted Google Fonts via `next/font`:
  - Display: `Russo One`
  - Body: `Inter`
  - Monospace: `JetBrains Mono`
- **3D Cel-Shaded World `[Source HTML: lines 7394–14200]`:** Procedural low-poly mecha models (ships, heroes, companion units) rendered with custom toon shading and ink outlines.
- **2D HUD Callouts `[Source HTML: lines 2770–7390]`:** Canvas-drawn targeting reticles, stat overlays, and telemetry labels floating above mecha models.

---

## 4. Quality & Non-Functional Requirements (Provenance & Status)

This section clearly distinguishes established implementation facts, planning quality targets that are verified, and planning targets that remain pending future phase validation:

| Requirement                         | Category             | Provenance / Plan Reference                                                  | Verification Status                                                                   |
| :---------------------------------- | :------------------- | :--------------------------------------------------------------------------- | :------------------------------------------------------------------------------------ |
| **Strict TypeScript**               | Core Architecture    | `concepful-redevelopment-plan.md` Deliverable 3 (line 170)                   | **Verified Passing** in Part 1.1 (`tsconfig.json`: `strict: true`, `noEmit` passes)   |
| **noUncheckedIndexedAccess**        | Quality Target       | Planning requirement introduced in Part 1.1                                  | **Verified Passing** in Part 1.1 (`tsconfig.json`)                                    |
| **Zero Layout Shift (CLS = 0)**     | Quality Target       | Planning requirement in Part 1.4 (`next/font` local bundling)                | **Verified Passing** in Part 1.4 (Preloaded `.woff2` bundled in `.next/static/media`) |
| **Visibility Pause**                | Engine Behavior      | `concepful-redevelopment-plan.md` Deliverable 1.6 & 4                        | **Pending Phase 4 Implementation** (`SceneHost` / render loop)                        |
| **Reduced Motion Compliance**       | Engine Behavior      | `concepful-redevelopment-plan.md` Deliverable 1.6 (`prefers-reduced-motion`) | **Pending Phase 4 Implementation** (static repaint on scroll)                         |
| **WebGL Fallback Shell**            | Reliability Target   | `concepful-redevelopment-plan.md` Deliverable 2 (line 156) & Part 4.8        | **Pending Phase 4 Implementation** (Part 4.8)                                         |
| **Target 60 FPS Callback Interval** | Performance Target   | Planning target; baseline callback intervals measured in Part 1.2            | **Pending Phase 9 Verification** (Profiling baseline vs. new implementation)          |
| **WCAG 2.2 AA for DOM UI**          | Accessibility Target | Planning quality target in Deliverable 2 (line 156)                          | **Pending Phase 8 Verification** (Accessibility audit in Phase 8)                     |

---

## 5. Scope Boundaries (Strictly Out of Scope)

Confirmed in `concepful-redevelopment-plan.md` Deliverable 2 (_Out of scope_, line 160):

1. Real payment processing (e.g., Stripe, PayPal).
2. Backend database or CRM integrations (form submissions route through a local stub).
3. User authentication, login systems, or persistent user accounts.
4. Content Management Systems (CMS) — all story and data tables remain statically typed.
5. Novel art, assets, or mecha models not present in the original reference file.
