# Concepful Mech Builder — Implementation Roadmap

This document outlines the 10-phase redevelopment plan for transitioning **Concepful Mech Builder** from the standalone HTML prototype into a production Next.js application, derived from Deliverables 5 & 6 of the approved redevelopment plan.

---

## 1. High-Level Phase Overview

| Phase  | Description                           |  Dependencies  | Exit Criteria                                                                                           |  Complexity   |
| :----: | :------------------------------------ | :------------: | :------------------------------------------------------------------------------------------------------ | :-----------: |
| **1**  | **Foundation and Baseline**           |      None      | Next.js scaffolded, baseline captured at 4 viewports, tokens extracted, fonts bundled.                  |    **Low**    |
| **2**  | **Content and Domain Extraction**     |    Phase 1     | Typed content modules and pure `quote()` reducer validated by unit test tables.                         |  **Medium**   |
| **3**  | **Static Page Shell**                 |  Phases 1, 2   | All sections, header, footer, and modal render semantically without WebGL; responsive.                  |  **Medium**   |
| **4**  | **Scene Engine Core**                 |  Phases 1, 3   | Canvas mounts and disposes cleanly; rAF loop, camera, visibility pause, and backgrounds active.         |   **High**    |
| **5**  | **3D Content (Ships, Heroes, Units)** |    Phase 4     | Every procedural mecha model visually matches reference screenshots with reported triangle budgets.     | **Very High** |
| **6**  | **Configurator & Interaction Wiring** | Phases 2, 3, 4 | Tier, mission, and buffs dynamically update price, character card, and 3D mecha scene.                  |   **High**    |
| **7**  | **2D Overlay, Callouts, and Patch**   |  Phases 4, 6   | Targeting reticles, telemetry labels, and procedural guild patch render cleanly.                        |   **High**    |
| **8**  | **Responsive & Accessibility Pass**   |   Phases 3–7   | Verified across 390, 768, 1280, 1920px viewports; keyboard navigable, WCAG AA contrast met.             |  **Medium**   |
| **9**  | **Performance & Optimization**        |   Phases 5–8   | 60 FPS animation frame intervals maintained; bundle size and DPR governor active; WebGL fallback ready. |   **High**    |
| **10** | **Production, QA, and Deployment**    |   All Phases   | Full metadata, e2e test suite passing, final documentation, and Vercel preview deployment.              |  **Medium**   |

---

## 2. Detailed Phase & Part Breakdown

### Phase 1: Foundation and Baseline (Completed)

- **1.1 Project Foundation:** Scaffold Next.js with pnpm, strict TypeScript, Tailwind v4, ESLint, Prettier, folder skeleton, and archived reference file. _(Approved)_
- **1.2 Reference Baseline:** Capture 36 high-resolution screenshots at 390px, 768px, 1280px, and 1920px viewports; record baseline metrics. _(Approved)_
- **1.3 Design Tokens:** Extract CSS custom properties and Tailwind `@theme` bindings; reconcile two-red inconsistency and cascade order; author `docs/design-system.md`. _(Approved)_
- **1.4 Font Integration:** Integrate `Russo One`, `Inter`, and `JetBrains Mono` via `next/font/google`; eliminate circular theme references; verify local build-time bundling. _(Approved)_
- **1.5 Documentation Skeleton:** Establish baseline architecture documentation, requirements, decision records, and progress tracking. _(Implemented, Awaiting User Review and Approval)_

### Phase 2: Content and Domain Extraction

- **2.1 Typed Content Modules:** Extract data tables (tiers, missions, gear, buffs, classes, copy) into strongly-typed TypeScript modules (`src/content/`).
- **2.2 Pure Domain Logic & Quote Engine:** Implement `quote()` calculation and configurator reducer as pure functions (`src/domain/`); verify parity against prototype test cases.

### Phase 3: Static Page Shell

- **3.1 Root Layout & Metadata:** Establish document head, semantic landmarks, skip links, and language attributes.
- **3.2 Header & Navigation:** Build accessible top bar with logo SVG, anchor navigation, and live price badge.
- **3.3 Hero Section:** Implement "Your creative department, on demand" hero copy and CTAs.
- **3.4 Classes & Rules Sections:** Build discipline cards (STR, DES, PRO, OPS) and engagement rules containers.
- **3.5 Mission Log:** Implement sticky horizontal telemetry track.
- **3.6 Plans & Outro Sections:** Build pricing plan selector and final call-to-action blocks.
- **3.7 Footer:** Implement footer links, status watermark, and copyright notice.
- **3.8 Modal Dialog:** Implement "Create Your Guild" modal with focus trapping and form UI.

### Phase 4: Scene Engine Core

- **4.1 SceneHost Component:** Client component mounting WebGL canvas; lifecycle management (mount, resize, dispose; StrictMode-safe).
- **4.2 Render Loop:** Centralized `requestAnimationFrame` loop with visibility pause and reduced-motion static repaint.
- **4.3 Camera & Layout Targets:** Camera controller managing smooth transitions between narrative target coordinates.
- **4.4 Scroll Driver:** Scroll observer utilizing cached section offsets instead of per-frame `getBoundingClientRect`.
- **4.5 Shaders & Materials:** Port toon shader materials, outline ink line shaders, and holographic vector grids.
- **4.6 Procedural Texture Factory:** Canvas-generated procedural textures for armor weathering and tech patterns.
- **4.7 Background Environments:** Implement procedural Sea, Sky, and Space backgrounds.
- **4.8 WebGL Fallback:** Graceful fallback shell for environments lacking WebGL hardware acceleration.

### Phase 5: 3D Content (Procedural Mecha Models)

- **5.1 Geometry Primitives:** Shared mathematical builders and procedural geometry helpers.
- **5.2 Flagship Submarine:** Deep-sea carrier procedural mesh.
- **5.3 Flagship Sky Cruiser:** Atmospheric cruiser procedural mesh.
- **5.4 Flagship Star Carrier:** Space battle-carrier procedural mesh.
- **5.5–5.8 Hero Mechs:** Port 8 hero mechas in pairs (Dolphin & Manta, Owl & Hawk, Jellyfish & Dragonfly, Turtle & Beetle).
- **5.9–5.12 Companion Units:** Port modular support units and tactical squad members.
- **5.13 Tactical Drones & Jets:** Procedural interceptor drones and support fighters.
- **5.14 Particle & Lighting Effects:** Thruster flames, particle sparks, and red eye beacon flickers.

### Phase 6: Configurator & Interaction Wiring

- **6.1 Panel Steps 1 & 2:** Tier selector and mission parameter controls.
- **6.2 Flagship & Buffs:** Interactive add-on selections.
- **6.3 Loadout & Billing Toggle:** Monthly/Annual billing switch with dynamic discount calculation.
- **6.4 Character Card:** Real-time stat polygon and squad roster sync.
- **6.5 Scene Integration:** Configurator choices dynamically spawn or reposition 3D mechas.
- **6.6 Header Price Sync:** Global price readout updates immediately upon configuration adjustments.
- **6.7 Modal Lead Submission:** Wire form to `submitLead()` adapter stub.

### Phase 7: 2D Overlay, Callouts, and Patch

- **7.1 HUD Overlay Canvas:** Procedural targeting reticles, connecting lead-lines, and telemetry labels.
- **7.2 Guild Patch Graphic:** Procedural vector emblem generator (`drawPatch`).
- **7.3 Boxart Title Block:** Retro 3D title lockup and sunburst background.
- **7.4 2D Asset Optimization:** Review and retire legacy prototype helper functions.

### Phase 8: Responsive & Accessibility Pass

- **8.1 Mobile Sheet Layout:** Bottom sheet drawer transformation for screens `<= 900px`.
- **8.2 Tablet Layout:** Adaptive layout preserving canvas visibility for screens `<= 1023px`.
- **8.3 WCAG Contrast & Focus Audit:** Ensure AA contrast across glass surfaces; visible focus rings.
- **8.4 Screen Reader Verification:** ARIA live regions for price changes; proper role landmarks.
- **8.5 Touch & Gesture Handling:** Smooth touch panning for mobile 3D scene inspection.

### Phase 9: Performance & Optimization

- **9.1 Frame Interval Profiling:** Verify steady 60 FPS animation callback intervals.
- **9.2 Dynamic DPR Governor:** Automatic resolution scaling on low-power devices.
- **9.3 Bundle Optimization:** Code-splitting and tree-shaking verification.
- **9.4 Three.js Upgrade Assessment:** Evaluate upgrade feasibility beyond r128 against breaking shader changes.

### Phase 10: Production, QA, and Deployment

- **10.1 Metadata & SEO:** OpenGraph, Twitter cards, sitemap, robots.txt, and JSON-LD schema.
- **10.2 Global Error Boundaries:** Graceful error handling and retry mechanisms.
- **10.3 Playwright E2E Suite:** Automated regression testing covering configurator flows across 4 viewports.
- **10.4 Final Documentation Handover:** Technical maintenance guides and architectural summary.
- **10.5 Deployment:** Production deployment on Vercel with zero-configuration setup.
