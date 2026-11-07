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

- **Fixed Top Header:** Contains brand logo SVG, anchor navigation links (`#classes`, `#how-it-works` [original `#s-logi`], `#rules` [original `#s-rules`], `#plans` [original `#s-plans`]), live pricing badge reflecting current configuration (`#chip`), and primary CTA link ("START YOUR BUILD", `#build`, lines 1870, 2006).
- **Header Responsiveness:** On mobile viewports (`<= 900px`), navigation links `.navl a:not(.fu)` are hidden via media query, while logo, live pricing badge, and primary CTA remain visible.
- **Watermark:** Fixed bottom-right watermark badge (`.wmark`, lines 1741–1785, 2196–2206) with SVG/PNG icon, sound/environment status indicator, and branding ("BUILT WITH CONCEPFUL").

### 2.2 Scroll-Driven Narrative `[Source HTML: lines 146–160, 1993–2180]`

- **Story Chapters:** Six continuous story sections scrolling over the full-bleed canvas scene:
  1. Hero / Intro (`#s-intro` / `#hero`): "Creative Department-as-a-Service" · "Your creative department, on demand."
  2. Classes (`#s-classes` / `#classes`): "Choose your class" · "One goal: to provide a different perspective."
  3. Mission Log / Logistics (`#s-logi` / `#how-it-works`): "Mission log" · "How it actually works." (horizontal telemetry track)
  4. Server Rules (`#s-rules` / `#rules`): "Server rules" · "How we raid together."
  5. Plans & Pricing (`#s-plans` / `#plans`): "Hull sizes" · "Three ways to deploy."
  6. Outro (`#s-outro` / `#outro`): "Ready to deploy?" · "Enter the server."
- **Scene Coordination:** Canvas camera angle, background environment (Sea, Sky, Space), and active mecha assets adapt dynamically as narrative sections scroll into view.

### 2.3 Pricing Configurator & Character Card `[Source HTML: lines 715–1260, 1832–1990]`

- **Step-by-Step Configurator HUD:** Floating left glass panel allowing user customization:
  - **Step 1: Tier Selection (`TIERS`)** — Mission (`solo`, $4,200/mo), Full crew (`squad`, $8,900/mo), Full force (`combine`, $16,500/mo).
  - **Step 2: Objectives & Quests** —
    - Solo quests (`QUESTS`): Brand identity, Pitch deck, Landing page, Motion piece, Product MVP, Full overhaul.
    - Squad / Combine objectives (`OBJECTIVES`): Launch something, Scale up production, Shift perception, Keep shipping.
  - **Step 3: Flagships, Gear & Buffs** —
    - Flagship vessel tiers (`CLASSES`): Sub vessel (ABYSS-01 / Sea), Sky cruiser (NIMBUS-07 / Sky), Star carrier (ORBITAL-99 / Space).
    - Solo optional gear (`GEAR`): Custom skin (+$600), Afterburner (+$900), Overdrive (+$1,400).
    - Squad / Combine buffs (`BUFFS`): 3D visualization, Campaign assets, Frontend build, Sound design, Motion system.
  - **Billing Toggle** — Monthly vs. Annual (annual plan offers 12 months for the price of 10 months, providing a 2-month discount).
  - **Itemized Quote Breakdown** — Live calculation displaying base fee, mission modifier, flagship cost, active buffs/gear, subtotal, discount, and total.
- **Character Spec Card:** Floating right glass card displaying selected unit designation, class badge, stat polygon/bars, active party roster, and guild motto.
- **Mobile Adaptation:** On mobile (`<= 900px`), the loadout panel transitions into an interactive bottom sheet.

### 2.4 Modal Dialog `[Source HTML: lines 2208–2284]`

- **"Create Your Guild" Modal:** Accessible dialog triggered by the "START YOUR BUILD" CTA.
- **Form UI:**
  - Guild (company) input (`#co`, autocomplete `organization`, max 18 chars)
  - Server start timeline select (`#ko`: "This week", "Within 2 weeks", "This month", "Just exploring")
  - Mission objective input (`#mi`: "Mission objective, in one line")
  - Intel file attachment (`#br`, optional file upload)
  - Submit button: "Enter world"
- **Submission Feedback (`#m-done`):** Unlocks celebratory "Patch unlocked" graphic (`canvas#patch2`) and three-step onboarding briefing:
  1. Senior lead reviews brief and confirms the number.
  2. Client receives SOW and secure Stripe link; IP transfers on delivery.
  3. Context™ workspace opens with the build loaded and the mission begins.
     _(Note: Pure client-side prototype; no external API or data transmission occurs)._

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
