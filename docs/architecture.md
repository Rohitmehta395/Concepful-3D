# Concepful Mech Builder — Architecture Specification

This document details the architectural design and structural patterns for the Next.js rebuild of **Concepful Mech Builder**, establishing clean boundaries between React DOM UI, the Three.js 3D engine, and the 2D HUD canvas.

**Plan Citations:** Derived from `concepful-redevelopment-plan.md` Deliverable 3 (_Technology decisions_, lines 166–185) and Deliverable 4 (_Proposed architecture_, lines 188–224).

---

## 1. Directory Structure: Current State vs. Planned Target

To maintain strict discipline, the architecture distinguishes what has been implemented in **Phase 1** from planned architectural targets scheduled for **Phases 2–7**:

```
Concepful-3D/
├── reference/                         # [Implemented - Phase 1.1 & 1.2]
│   ├── Concepful_Mech_Builder.html     # Authoritative standalone prototype (read-only)
│   ├── capture-baseline.mjs           # Automated baseline capture script (Playwright)
│   └── baseline/                      # 36 reference screenshots across 4 viewports
├── src/
│   ├── app/                           # [Implemented - Phase 1.1 & 1.4]
│   │   ├── layout.tsx                 # Root layout with next/font setup & font-sans
│   │   ├── page.tsx                   # Minimal placeholder page
│   │   └── globals.css                # Global CSS importing Tailwind v4 and tokens.css
│   ├── styles/                        # [Implemented - Phase 1.3 & 1.4]
│   │   └── tokens.css                 # Authoritative CSS design tokens & Tailwind @theme
│   ├── content/                       # [Planned - Phase 2.1] Typed content data tables
│   ├── domain/                        # [Planned - Phase 2.2] Pure quote() engine & reducer
│   ├── components/                    # [Planned - Phase 3 & 6] Component hierarchy
│   │   ├── shell/                     # Header, Footer, SkipLink (Phase 3)
│   │   ├── story/                     # Story sections, Narrative beats (Phase 3)
│   │   ├── configurator/              # Loadout panel, Tier selectors (Phase 6)
│   │   ├── card/                      # CharacterCard, StatPolygon, PatchGraphic (Phase 6)
│   │   ├── modal/                     # GuildModal with accessible focus trap (Phase 3.8)
│   │   └── scene/SceneHost.tsx        # Client island mounting WebGL & 2D canvas (Phase 4.1)
│   ├── scene/                         # [Planned - Phase 4 & 5] Imperative scene engine
│   │   ├── engine.ts                  # Renderer, Camera, rAF loop, resize, dispose (Phase 4)
│   │   ├── state.ts                   # Read-only snapshot bridging config & scroll state
│   │   ├── scroll.ts                  # Scroll observer with cached section offsets
│   │   ├── backgrounds/               # Procedural Sea, Sky, and Space backgrounds
│   │   ├── ships/                     # Procedural flagships (Submarine, Cruiser, Carrier)
│   │   ├── heroes/                    # 8 procedural hero mecha models
│   │   ├── units/                     # Companion units, drones, and jets
│   │   ├── materials/                 # Toon shaders, ink line materials, holo grids
│   │   └── overlay2d/                 # 2D canvas targeting reticles and callouts (Phase 7)
│   └── lib/                           # [Planned - Phase 4] Utilities & WebGL feature detection
├── tests/                             # [Planned - Phase 2 & 10] Unit domain tests & e2e
└── docs/                              # [Implemented - Phase 1.3 & 1.5]
    ├── requirements.md                # Functional, visual, and non-functional requirements
    ├── architecture.md                # This document: system architecture and boundaries
    ├── design-system.md               # Design tokens, color cascade, fonts, and radii
    ├── implementation-roadmap.md      # 10-phase redevelopment plan
    ├── progress.md                    # Phase completion and verification tracker
    └── decisions/                     # Architectural Decision Records (ADRs)
```

---

## 2. Core Architectural Decisions & Verification Status

| Decision          | Proposed Architectural Choice                  | Plan Citation                       | Status / Verification Horizon                                |
| :---------------- | :--------------------------------------------- | :---------------------------------- | :----------------------------------------------------------- |
| **Framework**     | Next.js App Router (React 19, TS strict)       | Plan Deliverable 3 (line 170)       | **Established & Verified** in Part 1.1                       |
| **Styling**       | Tailwind CSS v4 + CSS variables (`tokens.css`) | Plan Deliverable 3 (line 172)       | **Established & Verified** in Part 1.3                       |
| **Font Loading**  | `next/font/google` with local build bundling   | Plan Deliverable 3 (line 180)       | **Established & Verified** in Part 1.4                       |
| **3D Rendering**  | Imperative Three.js engine (exclude R3F)       | Plan Deliverable 3 (line 173)       | **Proposed choice** (ADR 0001); to be validated in Phase 4   |
| **Three Version** | Pin `three@0.128.0` initially for parity       | Plan Deliverables 3 & 10 (line 445) | **Proposed choice** (ADR 0002); to be validated in Phase 4/5 |
| **Animation Lib** | Omit GSAP / Motion (native rAF + CSS)          | Plan Deliverable 3 (line 175)       | **Proposed choice** (ADR 0003); to be validated in Phase 3   |
| **State Layer**   | Pure reducer in `domain/` without Zustand      | Plan Deliverable 3 (line 176)       | **Proposed choice**; to be validated in Phase 2 & 6          |

---

## 3. Structural Patterns & Boundaries (Planned for Implementation)

### 3.1 Next.js App Router & Server/Client Boundaries (Plan Deliverable 4)

- **Server Components:** Copy-heavy narrative sections (`src/components/story/`) and shell landmarks (`Header`, `Footer`) are planned as Server Components for optimal SEO and fast static paint.
- **Client Islands:** Interactive controls and canvas surfaces are strictly isolated client islands:
  - `SceneHost.tsx`: Loaded dynamically with `{ ssr: false }` to prevent SSR canvas errors.
  - `Configurator`: Interactive loadout panel driving pricing state and character card.
  - `GuildModal`: Client dialog handling focus trapping and accessible keyboard interaction.

### 3.2 Framework-Agnostic Scene Engine Boundary (Plan Deliverable 4)

- **Decoupled Architecture:** Three.js and 2D canvas routines will live entirely in `src/scene/`, independent of React's component tree.
- **Lifecycle Contract:** `SceneHost.tsx` will mount the engine inside a `useEffect` hook, passing HTML `<canvas>` elements and a state subscription. The engine returns an explicit `dispose()` function to tear down geometries, textures, renderers, and event listeners.
- **StrictMode Safety:** Designed to support React 19 mount-unmount cycles cleanly without memory leaks or dangling WebGL contexts.

### 3.3 Single Centralized Animation Loop (Plan Deliverable 1.6 & 4)

- **Coordinated Rendering:** One primary `requestAnimationFrame` loop drives both the 3D WebGL renderer and 2D canvas callouts.
- **Visibility-Aware:** Pauses render execution when the tab loses visibility (`document.visibilityState === "hidden"`) to conserve battery and CPU resources.
- **Reduced Motion Compliance:** When `prefers-reduced-motion: reduce` is active, the continuous animation loop is suspended, and the scene repaints statically upon scroll updates only.

### 3.4 State Management & Domain Calculation (Plan Deliverable 3 & 4)

- **Pure Domain Engine:** All pricing rules, tier formulas, add-on costs, and discounts will be implemented as pure, side-effect-free TypeScript functions in `src/domain/quote.ts`.
- **Zero External State Dependencies:** Application state will be managed via React's built-in `useReducer`. No external global state library (such as Zustand, Redux, or MobX) is introduced, avoiding unnecessary bundle weight.
- **Bridge to 3D Scene:** The 3D engine will receive updates through a lightweight ref snapshot (`scene/state.ts`), ensuring UI interactions smoothly update 3D mecha loadouts without triggering React re-renders of the canvas.

### 3.5 Styling & Responsive Strategy (Plan Deliverable 1.4 & 3, ADR 0004)

- **Global Component CSS & Native Classes (ADR 0004):** Ported prototype component styles reside in dedicated files under `src/styles/<component>.css` (e.g. `header.css`, `base.css`), imported centrally via `src/app/globals.css`. Components preserve authoritative global class names (`.top`, `.logo`, `.glass`, `.navl`, `.fu`) without CSS Module name-munging, eliminating Turbopack CSS-loader conflicts and ensuring zero client JavaScript overhead.
- **Tailwind CSS v4 `@theme`:** Utility tokens (`font-display`, `font-body`, `font-mono`, `text-brand-red`, `bg-navy`) are exposed through modern Tailwind v4 `@theme` bindings in `src/styles/tokens.css`. Tailwind utilities supplement layouts and new markup.
- **Vendor-Prefix Order for Glass Filters:** Glass backdrop filters declare `-webkit-backdrop-filter` prior to `backdrop-filter` (`-webkit-backdrop-filter: blur(12px) saturate(1.1); backdrop-filter: blur(12px) saturate(1.1);`) to prevent minifiers (LightningCSS) from deduplicating and stripping the standard property.
- **Responsive Media Strategy:** The source prototype exclusively uses `max-width` queries at `900px` (mobile) and `1023px` (tablet). Responsive styles are handled via component CSS media rules and Tailwind arbitrary max-width utilities (`max-[900px]:`, `max-[1023px]:`) rather than inverted `min-width` breakpoints.
- **Safe Area Insets:** Full support for modern edge-to-edge mobile devices using CSS environment variables (`--gl`, `--gr`, `--st`, `--sb`).
