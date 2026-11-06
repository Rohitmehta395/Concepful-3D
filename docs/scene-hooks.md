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

| Element       | Selectors / Hierarchy | Classification  | Attributes / Targets                 | Interactive Behavior                                                              |
| :------------ | :-------------------- | :-------------- | :----------------------------------- | :-------------------------------------------------------------------------------- |
| `<section>`   | `.st#s-intro`         | **Static**      | `data-scene="intro"`, `id="s-intro"` | Scroll tracking anchor for Three.js diorama scene.                                |
| `<div>`       | `.in`                 | **Static**      | `class="in"`                         | Centered content boundary (`max-width: 1280px`).                                  |
| `<div>`       | `.sc.hero`            | **Static**      | `class="sc hero"`                    | Glassmorphism card container. Pointer-events re-enabled (`pointer-events: auto`). |
| `<div>`       | `.eyebrow`            | **Static**      | `class="eyebrow"`                    | Monospace category label. No JS bindings.                                         |
| `<h1>`        | `h1.big`              | **Static**      | `class="big"`                        | Display title with highlighted `<span>`. No JS bindings.                          |
| `<p>`         | `.sc p`               | **Static**      | —                                    | Narrative copy text. No JS bindings.                                              |
| `<div>`       | `.ctas`               | **Static**      | `class="ctas"`                       | Flexbox container for action links.                                               |
| `<a>`         | `.ctas a.fu`          | **Interactive** | `class="fu"`, `href="#build"`        | Anchor navigating to the configurator/builder section (`#build`).                 |
| `<a>`         | `.ctas a.ghost`       | **Interactive** | `class="ghost"`, `href="#s-logi"`    | Anchor navigating to the logistics/how-it-works section (`#s-logi`, line 1869).   |
| `<div>`       | `.hud`                | **Static**      | `class="hud"`                        | 3-column telemetry grid displaying 3 spec items. No JS bindings.                  |
| `<span>` (x3) | `.hud span`           | **Static**      | —                                    | Telemetry item boxes (`1 lead`, `Fixed`, `Your IP`). No JS bindings.              |

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
