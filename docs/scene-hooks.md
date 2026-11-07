# Scene Hooks and DOM Interactions Documentation

This document inventories all DOM attributes, IDs, and classes read or manipulated by the Three.js 3D scene engine and interactive controllers in `reference/Concepful_Mech_Builder.html`.

---

## 1. Hero Section (`s-intro`) Scene Hooks

| Attribute / Selector | Element in Hero                     | Reference Line | JS Reader / Handler   | Line in Script | Effect on 3D Scene / Engine                                                                                                                                                                                                         |
| :------------------- | :---------------------------------- | :------------- | :-------------------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-scene="intro"` | `<section class="st" id="s-intro">` | 1994           | `storyScan()`         | 11954          | Queried via `document.querySelectorAll("[data-scene]")`. When its vertical midpoint crosses the viewport center (`r.top <= mid && r.bottom > mid`), `STORY.key` is set to `"intro"`. Lazily initializes `STB.intro()` (line 11588). |
| `p` (scroll ratio)   | Calculated from bounding rect       | —              | `storyScan()`         | 11961          | Progress `p` (0.0 to 1.0) is passed every frame to `STS["intro"].upd(t, dt, STORY.p)` to drive camera movement and diorama animation.                                                                                               |
| `id="s-intro"`       | `<section class="st" id="s-intro">` | 1994           | DOM Navigation Anchor | 1809           | Target for top logo brand link `<a class="logo glass" href="#s-intro">`. Not read directly by scene JS.                                                                                                                             |

---

## 2. Element Classification: Static vs. Interactive

All elements within `s-intro` are purely static server markup with the exception of the two CTA anchors:

| Element       | Selectors / Hierarchy | Classification  | Attributes / Targets                 | Interactive Behavior                                                                                         |
| :------------ | :-------------------- | :-------------- | :----------------------------------- | :----------------------------------------------------------------------------------------------------------- |
| `<section>`   | `.st#s-intro`         | **Static**      | `data-scene="intro"`, `id="s-intro"` | Scroll tracking anchor for Three.js diorama scene.                                                           |
| `<div>`       | `.in`                 | **Static**      | `class="in"`                         | Centered content boundary (`max-width: 1280px`).                                                             |
| `<div>`       | `.sc.hero`            | **Static**      | `class="sc hero"`                    | Glassmorphism card container. Pointer-events re-enabled (`pointer-events: auto`).                            |
| `<div>`       | `.eyebrow`            | **Static**      | `class="eyebrow"`                    | Monospace category label. No JS bindings.                                                                    |
| `<h1>`        | `h1.big`              | **Static**      | `class="big"`                        | Display title with highlighted `<span>`. No JS bindings.                                                     |
| `<p>`         | `.sc p`               | **Static**      | —                                    | Narrative copy text. No JS bindings.                                                                         |
| `<div>`       | `.ctas`               | **Static**      | `class="ctas"`                       | Flexbox container for action links.                                                                          |
| `<a>`         | `.ctas a.fu`          | **Interactive** | `class="fu"`, `href="#build"`        | Anchor navigating to the configurator/builder section (`#build`).                                            |
| `<a>`         | `.ctas a.ghost`       | **Interactive** | `class="ghost"`, `href="#s-logi"`    | Anchor navigating to the logistics/how-it-works section (`#s-logi`, line 2007; section starts at line 2058). |
| `<div>`       | `.hud`                | **Static**      | `class="hud"`                        | 3-column telemetry grid displaying 3 spec items. No JS bindings.                                             |
| `<span>` (x3) | `.hud span`           | **Static**      | —                                    | Telemetry item boxes (`1 lead`, `Fixed`, `Your IP`). No JS bindings.                                         |

---

## 3. Entrance Animations & Initial Visibility

- **Zero Opacity Masking:** Unlike lazy-loaded elements that use `opacity: 0` or JS reveal classes, `s-intro` and all child elements render immediately with initial opacity 1.
- **Zero CSS `@keyframes`:** No CSS entrance animation rules apply to the hero card or typography.
- **Zero JS Dependency for Display:** The static hero card is fully legible and interactive even if JavaScript is disabled.

---

## 4. Layout & Breakpoint Specifications

- **Container Height (`.st`):**
  - **Desktop (>900px):** `min-height: 100vh; display: flex; align-items: center; padding-block: 96px 48px;`
  - **Mobile (<=900px):** `align-items: flex-end; padding-block: 60px 16px;` (pushes card towards bottom of viewport so 3D background mechas remain visible above).
- **Card Sizing (`.sc`):**
  - **Desktop (>900px):** `max-width: 460px; padding: 22px;`
  - **Mobile (<=900px):** `max-width: none; padding: 16px;`
- **Typography Sizing:**
  - `h1.big`: `clamp(36px, 5vw, 66px)` on desktop; capped at `34px` on mobile (<=900px).
  - `.sc p`: `14.5px` on desktop; `13px` on mobile (<=900px).
  - `.hud b`: `20px` on desktop; `16px` on mobile (<=900px).

---

## 5. Classes Section (`s-classes`) Scene Hooks

| Attribute / Selector   | Element in Classes                         | Reference Line   | JS Reader / Handler   | Line in Script | Effect on 3D Scene / Engine                                                                                                                                                                                                                                      |
| :--------------------- | :----------------------------------------- | :--------------- | :-------------------- | :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-scene="classes"` | `<section class="st tall" id="s-classes">` | 2018             | `storyScan()`         | 11954          | Queried via `document.querySelectorAll("[data-scene]")`. When its vertical midpoint crosses viewport center (`r.top <= mid && r.bottom > mid`), `STORY.key` is set to `"classes"`. Lazily initializes `STB.classes()` (line 11624).                              |
| `data-beats`           | `<div class="beats" data-beats>`           | 2024             | `storyScan()`         | 11987–11993    | During scroll, reads `bs.children` count (3 beats) and scroll progress `p` (0.0 to 1.0). Calculates active beat index: `idx = Math.min(bs.children.length - 1, Math.max(0, Math.floor(p * bs.children.length)))`. Toggles `c.classList.toggle("on", i === idx)`. |
| `.beat` (x3)           | `<div class="beat">`                       | 2025, 2030, 2035 | Click listener        | 15092–15121    | Interactive click listener on `.beat` elements. Clicking a beat updates active class selection and triggers unit camera focus in Three.js scene.                                                                                                                 |
| `id="s-classes"`       | `<section class="st tall" id="s-classes">` | 2018             | DOM Navigation Anchor | 1869           | Target for top navigation link `<a href="#s-classes">Classes</a>`. Not read directly by scene JS.                                                                                                                                                                |

### Classes Layout & Sticky Behavior

- **Container Height (`.st.tall`):**
  - **Desktop (>900px):** `min-height: 240vh; align-items: flex-start;` (tall scrollable runway allows scrolling through 3 sub-discipline beats).
  - **Mobile (<=900px):** `min-height: 240vh; align-items: flex-end;`.
- **Card Sticky Pinning (`.st.tall .sc`):**
  - **Desktop (>900px):** `position: sticky; top: calc(92px + var(--st)); max-width: 460px;` (pins card below header while background mecha showcases rotate).
  - **Mobile (<=900px):** `position: sticky; top: auto; bottom: 12px; max-width: none;` (pins card to viewport bottom).
- **Default State in Static HTML:**
  - In original static markup (lines 2018–2057), all three `.beat` elements have `class="beat"` (no `.beat.on`). In CSS (lines 275–286), `.beat` has `opacity: 0.5`. Phase 4 will wire scroll-driven active-beat toggling.

---

## 6. Server Rules Section (`s-rules`) Scene Hooks

| Attribute / Selector | Element in Rules                    | Reference Line | JS Reader / Handler   | Line in Script | Effect on 3D Scene / Engine                                                                                                                                                                                                     |
| :------------------- | :---------------------------------- | :------------- | :-------------------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `data-scene="rules"` | `<section class="st" id="s-rules">` | 2103           | `storyScan()`         | 11954          | Queried via `document.querySelectorAll("[data-scene]")`. When its vertical midpoint crosses viewport center (`r.top <= mid && r.bottom > mid`), `STORY.key` is set to `"rules"`. Lazily initializes `STB.rules()` (line 11720). |
| `id="s-rules"`       | `<section class="st" id="s-rules">` | 2103           | DOM Navigation Anchor | —              | Section anchor identifier. Target for navigation. No internal JS event bindings; pure static server-rendered presentation.                                                                                                      |

### Server Rules Layout Behavior

- **Container Height (`.st`):**
  - **Desktop (>900px):** `min-height: 100vh; display: flex; align-items: center; padding-block: 96px 48px;`.
  - **Mobile (<=900px):** `align-items: flex-end; padding-block: 60px 16px;`.
- **Card Sizing (`.sc`):**
  - **Desktop (>900px):** `max-width: 460px; padding: 22px;`.
  - **Mobile (<=900px):** `max-width: none; padding: 16px;`.

---

## 7. Mission Log / Logistics Section (`s-logi`) Scene Hooks

| Attribute / Selector | Element in Logistics                         | Reference Line | JS Reader / Handler   | Line in Script | Effect on 3D Scene / Engine                                                                                                                                                                                                                                             |
| :------------------- | :------------------------------------------- | :------------- | :-------------------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-scene="logi"`  | `<section class="hz-sec" id="s-logi">`       | 2058           | `storyScan()`         | 11954          | Queried via `document.querySelectorAll("[data-scene]")`. When its vertical midpoint crosses viewport center (`r.top <= mid && r.bottom > mid`), `STORY.key` is set to `"logi"`. Lazily initializes `STB.logi()` (line 11709 / 13934). Triggers `layout()` (line 11983). |
| `id="s-logi"`        | `<section class="hz-sec" id="s-logi">`       | 2058           | DOM Navigation Anchor | 1869, 2007     | Target for top navigation link `<a href="#s-logi">How it works</a>` (line 1869) and hero CTA `<a class="ghost" href="#s-logi">See how it works</a>` (line 2007). Target in canonical rewrite is `#how-it-works`.                                                        |
| `data-beats`         | `<div class="hz-track" id="hzt" data-beats>` | 2069           | `storyScan()`         | 11987–11993    | During scroll through the 420vh section runway, reads `p` (progress from 0.0 to 1.0) and calculates active slide index: `idx = Math.min(n - 1, Math.floor(p * n * 1.05))` where `n = 4`. Toggles `c.classList.toggle("on", i === idx)` on the 4 `.slide` elements.      |
| `#hzt` (`.hz-track`) | `<div class="hz-track" id="hzt">`            | 2069           | CSS Grid Layout       | —              | The track is not translated horizontally by JavaScript. Layout is pure CSS grid: 4 columns on desktop (`repeat(4, minmax(0, 1fr))`, line 425), 2x2 grid on mobile (`repeat(2, minmax(0, 1fr))`, line 520).                                                              |
| `#clk`, `#clk-l`     | Canvas HUD indicators                        | —              | `storyScan()`         | 11996–12002    | When `key === "logi"`, scroll progress `p` maps to timeline schedule array: `i = Math.min(CLK.length - 1, Math.floor(p * CLK.length))`, updating clock HUD text.                                                                                                        |

### Mission Log Layout & Track Behavior

- **Runway Section (`.hz-sec`):**
  - `position: relative; height: 420vh;` creates a 4.2x viewport height scrollable runway for scrubbed storytelling.
- **Sticky Viewport Frame (`.hz`):**
  - `position: sticky; top: 0; height: 100vh; display: flex; flex-direction: column; justify-content: space-between; max-width: 1280px; margin: 0 auto;`.
  - Desktop padding: `calc(84px + var(--st)) 0 calc(52px + var(--sb));`.
  - Mobile padding (<=900px): `padding-bottom: calc(24px + var(--sb));`.
- **Header Card (`.hz-head.sc`):**
  - Desktop (>900px): `max-width: 560px; width: calc(100% - 32px); padding: 18px 22px; margin: 0 auto; text-align: center;`.
  - Mobile (<=900px): `max-width: none; padding: 14px;` (paragraph `.hz-head p` hidden via `display: none`).
- **Telemetry Track (`.hz-track`):**
  - Desktop (>900px): `display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; max-width: 1180px; margin: 0 auto;`. All 4 slide cards are fully visible side-by-side; `small` description text is `display: block !important;`.
  - Mobile (<=900px): `display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px;`. Inactive slides have `small { display: none !important; }`, while the active slide (`.slide.on small`) expands to `display: block !important; font-size: 11.5px;`.
  - No-JS / Accessibility Note: At `<=900px`, step descriptions (`.slide small`) and the section paragraph (`.hz-head p`) are `display: none` unless `.on` is set by script; without JS they are invisible (same in the original). Measured with JS off at 390px: paragraph height 0px (`display: none`), slide 1..4 descriptions height 0px (`display: none`). When `.on` is forced, active slide description becomes `display: block` (height 83.36px on slide 1, 66.69px on slides 2–4). Decide at Phase 4/8.
- **Track Position Formula:**
  - Track translation formula: `None`. The track is statically positioned via CSS grid at both desktop and mobile viewports.
  - Active beat formula: `idx = Math.min(n - 1, Math.floor(p * n * 1.05))` (toggles `.on` on slide `idx`).
