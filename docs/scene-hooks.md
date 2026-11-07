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

---

## 8. Plans / Stages Section (`s-stages`) Scene Hooks

| Attribute / Selector   | Element in Plans                          | Reference Line         | JS Reader / Handler      | Line in Script | Effect on 3D Scene / Engine                                                                                                                                                                                                                                                                          |
| :--------------------- | :---------------------------------------- | :--------------------- | :----------------------- | :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-scene="stages"`  | `<section class="st tall" id="s-stages">` | 2135                   | `storyScan()`            | 11954          | Queried via `document.querySelectorAll("[data-scene]")`. When its vertical midpoint crosses viewport center (`r.top <= mid && r.bottom > mid`), `STORY.key` is set to `"stages"`. Lazily initializes `STB.stages()` (lines 11848–11901), creating multi-vessel formation (Drone, Sub, Star, Mother). |
| `id="s-stages"`        | `<section class="st tall" id="s-stages">` | 2135                   | DOM Navigation Anchor    | 1870, 2183     | Navigation target for top navigation link `<a href="#s-stages">Plans</a>` (line 1870) and Outro CTA `<a class="ghost" href="#s-stages">Compare plans</a>` (line 2183). Target in rewrite is `#plans`.                                                                                                |
| `data-beats`           | `<div class="beats" data-beats>`          | 2140                   | `storyScan()`            | 11987–11993    | During scroll, reads `bs.children` count (4 stage beats) and scroll progress `p` (0.0 to 1.0). Calculates active beat index: `idx = Math.min(n - 1, Math.floor(p * n * 1.05))`. Toggles `c.classList.toggle("on", i === idx)`.                                                                       |
| `data-pick="..."` (x4) | `<div class="beat" data-pick="...">`      | 2141, 2147, 2153, 2160 | Click / Keydown Listener | 15092–15120    | Script dynamically injects `role="button"` and `tabIndex=0` (lines 15094–15095). Clicking calls `setTier(c.dataset.pick)` (line 15111) and smoothly scrolls the diorama (`go()`, line 15096–15108). In static server component, interaction is deferred to Phase 6.                                  |
| `.ctas a.fu`           | `<div class="ctas"><a class="fu" ...>`    | 2167                   | Static Anchor Link       | 2167           | Navigates to `#build` configurator section.                                                                                                                                                                                                                                                          |

### Plans Layout & Sticky Behavior

- **Container Height (`.st.tall`):**
  - **Desktop (>900px):** `min-height: 240vh; align-items: flex-start;` (scrollable runway allows scrubbing through 4 stage tiers).
  - **Mobile (<=900px):** `min-height: 240vh; align-items: flex-end;`.
- **Card Sticky Pinning (`.st.tall .sc`):**
  - **Desktop (>900px):** `position: sticky; top: calc(92px + var(--st)); max-width: 460px;` (pins card below header).
  - **Mobile (<=900px):** `position: sticky; top: auto; bottom: 12px; max-width: none;` (pins card to viewport bottom).
- **Default State in Static HTML:**
  - In original static markup (lines 2135–2170), all four `.beat` elements have `class="beat"` (no `.beat.on`). In CSS (lines 275–286), `.beat` has `opacity: 0.5`. On mobile (lines 539–541), `.beat small` is `display: none` unless `.beat.on` is added by script.

---

## 9. Outro Section (`s-outro`) Scene Hooks

| Attribute / Selector | Element in Outro                     | Reference Line | JS Reader / Handler | Line in Script | Effect on 3D Scene / Engine                                                                                                                                                                                                                                                                 |
| :------------------- | :----------------------------------- | :------------- | :------------------ | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `data-scene="outro"` | `<section class="st" id="s-outro">`  | 2172           | `storyScan()`       | 11954          | Queried via `document.querySelectorAll("[data-scene]")`. When its vertical midpoint crosses viewport center (`r.top <= mid && r.bottom > mid`), `STORY.key` is set to `"outro"`. Lazily initializes `STB.outro()` (lines 11902–11940), rendering hyper-speed streak field and glowing core. |
| `id="s-outro"`       | `<section class="st" id="s-outro">`  | 2172           | Section Anchor      | —              | Section anchor identifier. Not read directly by scene JS.                                                                                                                                                                                                                                   |
| `.ctas a.fu`         | `<a class="fu" href="#build">`       | 2182           | Static Anchor Link  | 2182           | Primary CTA navigating to `#build`.                                                                                                                                                                                                                                                         |
| `.ctas a.ghost`      | `<a class="ghost" href="#s-stages">` | 2183           | Static Anchor Link  | 2183           | Secondary CTA navigating back to `#s-stages` (`#plans` in rewrite).                                                                                                                                                                                                                         |

### Outro Layout Behavior

- **Container Height (`.st`):**
  - **Desktop (>900px):** `min-height: 100vh; display: flex; align-items: center; padding-block: 96px 48px;`.
  - **Mobile (<=900px):** `align-items: flex-end; padding-block: 60px 16px;`.
- **Card Sizing (`.sc`):**
  - **Desktop (>900px):** `max-width: 460px; padding: 22px;`.
  - **Mobile (<=900px):** `max-width: none; padding: 16px;`.

---

## 10. Build Section Skeleton (`#build`) & Watermark Footer (`.wmark`) Scene Hooks

### Build Section (`#build`)

| Attribute / Selector | Element in Build                       | Reference Line | JS Reader / Handler | Line in Script         | Effect on 3D Scene / Engine                                                                                                                                                                                                                                  |
| :------------------- | :------------------------------------- | :------------- | :------------------ | :--------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-scene="app"`   | `<section class="app-sec" id="build">` | 2190           | `storyScan()`       | 11954–11974            | Queried via `document.querySelectorAll("[data-scene]")`. When scrolled into view, sets `mode = "app"`, toggling `document.body.classList.toggle("app", mode === "app")`. Transitions camera and UI from passive story mode to interactive configurator mode. |
| `id="build"`         | `<section class="app-sec" id="build">` | 2191           | DOM Anchor Target   | 1871, 2006, 2167, 2182 | Global destination anchor for all "Start your build" / "Build yours" / "Choose your plan" CTAs in Header, Character Card, Plans, and Outro.                                                                                                                  |
| `aria-label="..."`   | `<section ... aria-label="Build ...">` | 2192           | Accessibility Tree  | —                      | Accessible landmark naming: `"Build your department"`.                                                                                                                                                                                                       |

### Watermark Footer (`.wmark`)

| Attribute / Selector | Element in Footer                        | Reference Line | JS Reader / Handler | Line in Script | Effect on 3D Scene / Engine                                                                                                                                                                           |
| :------------------- | :--------------------------------------- | :------------- | :------------------ | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `class="wmark"`      | `<footer class="wmark">`                 | 2196           | CSS Cascade         | 1741–1786      | Fixed watermark banner at viewport bottom right (`z-index: 5; pointer-events: none`). In `body.app`, opacity shifts from `0.6` to `0.45` on desktop, and hides (`display: none`) on mobile `<=900px`. |
| `<span>`             | `<footer class="wmark"><span>...</span>` | 2197–2200      | CSS Media Query     | 1773–1775      | Copyright & disclaimer text. Hidden via `display: none` at `<=900px`.                                                                                                                                 |
| `<img>`              | `<footer class="wmark"><img ...>`        | 2201–2205      | CSS Media Query     | 1780–1783      | Base64 PNG mark (28x28px desktop with 7px border-radius, scaled to 20x20px with 5px border-radius on mobile `<=900px`).                                                                               |

### Element Classification Table (Static vs. Configurator vs. Modal)

| Element / Selector               | Prototype Range (Lines) | Classification                     | Implementation Target                        |
| :------------------------------- | :---------------------- | :--------------------------------- | :------------------------------------------- |
| `<section class="app-sec">`      | 2189–2194               | **Static Skeleton**                | Part 3.7 (`src/components/story/Build.tsx`)  |
| `<footer class="wmark">`         | 2196–2206               | **Static Shell Footer**            | Part 3.7 (`src/components/shell/Footer.tsx`) |
| `#gl`, `#cv` (Canvases)          | 1803–1806               | **Phase 4 Scene Engine**           | Phase 4 (`src/components/scene/`)            |
| `#card` (Configurator Card)      | 1966–2014               | **Phase 6 Configurator Wireframe** | Phase 6 (`src/components/configurator/`)     |
| `<div class="modal" id="modal">` | 2209–2283               | **Part 3.8 Static Modal Shell**    | Part 3.8 (`src/components/shell/Modal.tsx`)  |

---

## 11. Phase 6: Configurator DOM Hooks (Pre-Main Elements)

Between `</nav>` in `<header class="top">` (line 1872) and `<main class="story">` (line 1993), the original prototype contains the markup for the interactive 3D configurator, live character sheet card, mode switchers, and boxart headline.

### Element Hierarchy Tree

```
header.top#top (lines 1808-1890)
├── div.seg.glass#seg (lines 1873-1883)
│   ├── button[type="button"][data-tier="solo"]
│   ├── button[type="button"][data-tier="squad"]
│   └── button[type="button"][data-tier="combine"]
└── div.tr.glass (lines 1884-1889)
    ├── div.tot
    │   ├── b#pr
    │   └── small#prs
    └── button.fu[type="button"][data-formup]

aside.panel.glass#panel (lines 1892-1964)
├── div.intro (lines 1893-1902)
│   ├── div.eyebrow
│   ├── div.mt
│   └── p#intro-p
├── section.step#st-mode (lines 1903-1910)
│   ├── div.sh (span.n, h2)
│   ├── p.hint
│   └── div.tiers#tiers
├── section.step#st-pick (lines 1911-1922)
│   ├── div.sh (span.n, h2#lo-h)
│   ├── p.hint#lo-hint
│   ├── div#groups
│   └── div.nudge#nudge (span, button[type="button"][data-tier="squad"])
├── section.step#st-ship (lines 1923-1933)
│   ├── div.sh (span.n, h2)
│   ├── p.hint
│   └── div#ships
├── section.step#st-buffs (lines 1934-1943)
│   ├── div.sh (span.n, h2)
│   ├── p.hint
│   └── div.opts#buffs
└── section.step#st-load (lines 1944-1963)
    ├── div.sh (span.n, h2)
    ├── p.hint
    ├── div.toggle#bill
    │   ├── button#b-mo.on
    │   └── button#b-yr
    ├── div.bp#bp
    ├── button.fu.wide[type="button"][data-formup]
    └── p.fine

section.card.glass#card[aria-label="Character sheet"] (lines 1966-1978)
├── div.hd (lines 1967-1969)
│   ├── span#chd
│   └── span#cid
└── div.bd (lines 1970-1977)
    ├── canvas#patch[aria-hidden="true"]
    ├── div.cn#cn
    ├── div.cc#cc
    ├── div.stats#stats
    ├── div.party#party
    └── div.motto (span, q#motto)

div.boxart#boxart (lines 1980-1991)
├── div
│   ├── h1.title
│   └── div.fp
└── div.burst
```

### Element Classification & Script Reference Catalog

| Element / Selector     | Prototype Lines | Classification                     | JS Readers / Writers (Lines) | Script Functionality & State Lifecycle                                                        |
| :--------------------- | :-------------- | :--------------------------------- | :--------------------------- | :-------------------------------------------------------------------------------------------- |
| `div#seg`              | 1873–1883       | **Static Shell / Script Classes**  | 14670                        | Iterates children to toggle `.on` class matching active tier `id`.                            |
| `b#pr`                 | 1886            | **Script-Driven**                  | 14781                        | Updates header price readout text with total and cadence suffix (`fmt(q.total) + per`).       |
| `small#prs`            | 1886            | **Script-Driven**                  | 14782                        | Updates header cadence note text (`"fixed fee"` vs `"billed monthly"` / `"billed annually"`). |
| `button[data-formup]`  | 1888, 1958      | **Static Markup / Script Event**   | 15077–15082                  | Click triggers guild modal opening (`openModal()`).                                           |
| `aside#panel`          | 1892–1964       | **Static Container / Script Rect** | 2731, 14936                  | Bounding rect measured during resize/layout (`pr = $("panel").getBoundingClientRect()`).      |
| `p#intro-p`            | 1898–1901       | **Script-Driven**                  | 14943                        | Replaced dynamically with active tier pitch string (`TIERS[id].pitch`).                       |
| `section#st-mode`      | 1903–1910       | **Static Step / Script Visible**   | 14721                        | Step 01 container; always visible across all modes.                                           |
| `div#tiers`            | 1909            | **Script-Driven**                  | 14663                        | Dynamic innerHTML injected with interactive tier selector cards.                              |
| `section#st-pick`      | 1911–1922       | **Static Step / Script Visible**   | 14721, 14937                 | Step 02 container; always visible across all modes.                                           |
| `h2#lo-h`              | 1914            | **Script-Driven**                  | 14677                        | Heading updated based on mode (`solo ? "Mission" : "Class"`).                                 |
| `p#lo-hint`            | 1916            | **Script-Driven**                  | 14682                        | Hint updated based on mode (`solo ? "Choose your assignment..." : "Pick your class..."`).     |
| `div#groups`           | 1917            | **Script-Driven**                  | 14688, 14706, 14716, 14930   | Injected with unit/class selection cards depending on tier mode.                              |
| `div#nudge`            | 1918–1921       | **Script-Driven**                  | 14799                        | Toggles `.show` class if in solo mode with 2 or more extras selected.                         |
| `section#st-ship`      | 1923–1933       | **Script-Driven Visibility**       | 14719, 14721, 14930          | Step 03 flagship container; displayed only in Full Force (raid) mode.                         |
| `div#ships`            | 1932            | **Script-Driven**                  | 14755, 15011                 | Injected with flagship cards; click updates selected flagship.                                |
| `section#st-buffs`     | 1934–1943       | **Script-Driven Visibility**       | 14719, 14721, 14930          | Step 04 raid buffs container; displayed only in Full Force (raid) mode.                       |
| `div#buffs`            | 1942            | **Script-Driven**                  | 14730                        | Injected with 6 raid buff selector cards from `BUFFS` array.                                  |
| `section#st-load`      | 1944–1963       | **Static Step / Script Visible**   | 14721                        | Step 05 summary container; always visible.                                                    |
| `div#bill`             | 1953–1956       | **Script-Driven Visibility**       | 14780                        | Hidden when tier is one-time fixed fee (`$("bill").hidden = T.one`).                          |
| `button#b-mo`, `#b-yr` | 1954–1955       | **Static Markup / Script Event**   | 15061–15072                  | Toggle buttons for Monthly / Annual billing with 10% discount calculation.                    |
| `div#bp`               | 1957            | **Script-Driven**                  | 14793                        | Injected with itemized price blueprint breakdown rows.                                        |
| `section#card`         | 1966–1978       | **Static Container / Script Rect** | 2661, 2732                   | Live character card; bounding rect measured during layout.                                    |
| `span#chd`             | 1968            | **Script-Driven**                  | 14812                        | Card header badge text (`solo ? "Character" : "Party"`).                                      |
| `span#cid`             | 1968            | **Script-Driven**                  | 14817                        | Level indicator text (`"LV " + lv`).                                                          |
| `canvas#patch`         | 1971            | **Script-Driven Canvas**           | 2764, 7379                   | 2D canvas drawing procedural unit patch emblem (`drawPatch($("patch"), t)`).                  |
| `div#cn`               | 1972            | **Script-Driven**                  | 14818                        | Character/unit name readout text.                                                             |
| `div#cc`               | 1973            | **Script-Driven**                  | 14823                        | Class/role title text.                                                                        |
| `div#stats`            | 1974            | **Script-Driven**                  | 14857                        | Injected with 4 stat progress bars (STR, DEF, SPD, ENG).                                      |
| `div#party`            | 1975            | **Script-Driven**                  | 14867                        | Injected with interactive party roster member chips.                                          |
| `q#motto`              | 1976            | **Script-Driven**                  | 14882                        | Injected with tier/role motto quotation text.                                                 |
| `div#boxart`           | 1980–1991       | **Static Container / Script Rect** | 2733                         | Hero title art banner; bounding rect measured during layout.                                  |

---

## 12. Part 3.8: Static Guild Modal Hooks (`#modal`)

Source: `reference/Concepful_Mech_Builder.html` (lines 2208–2283).

### Modal Element Hierarchy

```
div.modal#modal[hidden] (lines 2208-2283)
└── div.mcard.glass[role="dialog"][aria-modal="true"][aria-labelledby="m-h"] (lines 2209-2282)
    ├── div.hd (line 2215: "Create your guild")
    ├── button.x#mx[type="button"][aria-label="Close"] (line 2216: "×")
    └── div.bd (lines 2217-2281)
        ├── div#m-form (lines 2218-2259)
        │   ├── h3#m-h (line 2219: "Your build is ready.")
        │   ├── p (lines 2220-2223)
        │   └── form.form#pilot (lines 2224-2258)
        │       ├── div.fld
        │       │   ├── label[for="co"] ("Guild (company)")
        │       │   └── input#co[type="text"][maxlength="18"][placeholder="Harbor & Vane"][autocomplete="organization"]
        │       ├── div.fld
        │       │   ├── label[for="ko"] ("Server start")
        │       │   └── select#ko
        │       │       ├── option ("This week")
        │       │       ├── option[selected] ("Within 2 weeks")
        │       │       ├── option ("This month")
        │       │       └── option ("Just exploring")
        │       ├── div.fld.full
        │       │   ├── label[for="mi"] ("Mission objective, in one line")
        │       │   └── input#mi[type="text"][placeholder="Rebrand ahead of our Series A launch"]
        │       ├── div.fld.full
        │       │   ├── label[for="br"] ("Attach intel: brief or materials (optional)")
        │       │   └── input#br[type="file"][multiple]
        │       └── button.fu[type="submit"] ("Enter world")
        └── div.done#m-done[hidden] (lines 2260-2280)
            ├── canvas#patch2[aria-hidden="true"]
            ├── div.unl ("Patch unlocked")
            ├── h3#d-h[style="text-align: center; margin-top: 6px"] ("Welcome to the server")
            └── ol (lines 2266-2279)
                ├── li ("First, a senior lead...")
                ├── li ("You get the SOW...")
                └── li ("Your Context™ workspace opens...")
```

### Element Classification Table

| Element / Selector         | Prototype Lines | Classification             | Accessibility & State Lifecycle                                                                     | Wired In  |
| :------------------------- | :-------------- | :------------------------- | :-------------------------------------------------------------------------------------------------- | :-------- |
| `div.modal#modal`          | 2208–2283       | **Static Shell (Hidden)**  | Initial `hidden` boolean attribute; backdrop overlay (`rgba(5, 5, 10, 0.5)`).                       | Phase 6   |
| `div.mcard.glass`          | 2209–2214       | **Static Dialog Card**     | `role="dialog"`, `aria-modal="true"`, `aria-labelledby="m-h"`. Max width `min(460px, 100%)`.        | Part 3.8  |
| `div.hd`                   | 2215            | **Static Header**          | Category bar with `var(--red)` background and `var(--display)` font.                                | Part 3.8  |
| `button.x#mx`              | 2216            | **Static Button**          | Close button with `aria-label="Close"`; click calls `closeModal()`.                                 | Phase 6   |
| `div.bd`                   | 2217            | **Static Body**            | Inner padding container (`18px`).                                                                   | Part 3.8  |
| `div#m-form`               | 2218–2259       | **Static Form Wrapper**    | Visible while modal open; hidden when submission succeeds (`$("m-form").hidden = true`).            | Phase 6   |
| `h3#m-h`                   | 2219            | **Static Heading**         | Dialog accessible name target (`aria-labelledby="m-h"`).                                            | Part 3.8  |
| `p`                        | 2220–2223       | **Static Paragraph**       | Explanatory copy (`var(--muted)` font).                                                             | Part 3.8  |
| `form.form#pilot`          | 2224–2258       | **Static Form**            | 2-column CSS grid; submit intercepted by script (`e.preventDefault()`).                             | Phase 6   |
| `input#co`                 | 2227–2233       | **Static Input / State**   | Focused on modal open (`$("co").focus()`); input event updates `company` state.                     | Phase 6   |
| `select#ko`                | 2237–2242       | **Static Select**          | 4 scheduling options; "Within 2 weeks" default selected.                                            | Part 3.8  |
| `input#mi`                 | 2246–2250       | **Static Input**           | Single-line mission brief text input.                                                               | Part 3.8  |
| `input#br`                 | 2253–2256       | **Static File Input**      | Multiple file upload input (optional intel).                                                        | Part 3.8  |
| `button.fu[type="submit"]` | 2257            | **Static Submit Button**   | Full-width primary CTA ("Enter world").                                                             | Part 3.8  |
| `div.done#m-done`          | 2260–2280       | **Static Success State**   | Initial `hidden` boolean attribute; unhidden upon form submit.                                      | Phase 6   |
| `canvas#patch2`            | 2261            | **Script-Driven Canvas**   | Procedural 2D patch canvas animated by `drawPatch($("patch2"), t)` while modal visible.             | Phase 6/7 |
| `div.unl`                  | 2262            | **Static Monospace Label** | "Patch unlocked" uppercase badge.                                                                   | Part 3.8  |
| `h3#d-h`                   | 2263–2265       | **Script-Driven Heading**  | Displays personalized welcome message: `"Welcome to the server" + (company ? ", " + company : "")`. | Phase 6   |
| `ol`                       | 2266–2279       | **Static Ordered List**    | 3-step onboarding pipeline steps.                                                                   | Part 3.8  |

### Script Readers & Event Listeners

| Function / Handler      | Script Lines | Trigger / Behavior                                                                                                                               |
| :---------------------- | :----------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| `openModal()`           | 15047–15050  | Sets `$("modal").hidden = false;`, focuses first input `$("co").focus()`. Triggered after form-up CTA delay (1900ms or 0ms with reduced motion). |
| `closeModal()`          | 15051–15053  | Sets `$("modal").hidden = true;`.                                                                                                                |
| `#mx` click             | 15054        | Click on close button calls `closeModal()`.                                                                                                      |
| `#modal` backdrop click | 15055–15057  | Click directly on `#modal` backdrop (outside `.mcard`) calls `closeModal()`.                                                                     |
| `Escape` keydown        | 15058–15060  | Pressing `Escape` when modal is open calls `closeModal()`.                                                                                       |
| `#co` input             | 15075–15078  | Input on company field updates `company = e.target.value.trim(); repaint();`.                                                                    |
| `#pilot` submit         | 15079–15087  | Intercepts submit, hides `#m-form`, unhides `#m-done`, updates `#d-h` greeting with company name, logs system audio callout.                     |
| `drawPatch` render loop | 7376, 7380   | If `!$("modal").hidden`, runs `drawPatch($("patch2"), t)` each frame.                                                                            |
