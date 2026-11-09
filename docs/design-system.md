# Concepful Mech Builder — Design System & Tokens

This document provides the authoritative provenance, cascade audit, and reference catalog for all design tokens extracted from the original prototype ([`reference/Concepful_Mech_Builder.html`](file:///d:/Projects/Pete/Concepful-3D/reference/Concepful_Mech_Builder.html)).

All tokens are defined in [`src/styles/tokens.css`](file:///d:/Projects/Pete/Concepful-3D/src/styles/tokens.css) and exposed through Tailwind CSS v4's `@theme` directive where semantically appropriate.

---

## 1. Visual Identity & Cascade Architecture

The prototype's visual theme is a late-90s cel-shaded mecha MMO launcher characterized by:

- **Navy ink background**: `#141624`
- **Bone hull / white text accents**: `#ffffff` (active CSS `:root`), with `#ECE6D6` preserved in the 2D canvas sprite palette
- **Brand hot red-magenta / melon**: `#ee004e`
- **Discipline accents**: Periwinkle `#8c93e6` (Strategy), Pink `#ff7fa6` (Production), Teal `#55c2b8` (Operations), Gold `#f2b33a` (Sun), Green `#5fd39b` (Online status)
- **Dark HUD glass overlays**: `rgba(20, 22, 40, 0.84)` with `blur(12px)`
- **Display typography**: `Russo One`
- **UI body & specs**: `Inter` and `JetBrains Mono`

### The Two `:root` Blocks & Cascade Sorting

The original HTML contains two `:root` style declarations:

1. **Initial Draft Block (lines 51–76)**: Created during early development with a slate-sky background (`#4f5a68`), warm off-white text (`#f2efe8`), weathered bone armor (`#ece6d6`), and coral red (`#e2404f`).
2. **Active Brand Override Block (lines 1658–1679)**: Introduced under the comment `/* ===== Brand colours only: melon, navy, white ===== */`.

Because both rules target `:root` with identical specificity `(0, 1, 0)` in the same document, standard CSS Cascade rules (order of appearance) mean **the second block completely supersedes the first for all shared properties**.

> [!NOTE] Corrected Palette Finding
> The active palette is navy `#141624`, brand red `#ee004e`, periwinkle `#8c93e6`, pink `#ff7fa6`, and teal `#55c2b8`. The slate `#4f5a68` and coral `#e2404f` values belong exclusively to the overridden draft block. The draft values are obsolete and not exposed as tokens.

---

## 2. Color Tokens & Provenance Audit

### 2.1 Active CSS Tokens (Cascade Winners)

These are the exact properties and computed values active in the browser DOM from lines 1658–1679:

| Token          | CSS Variable | Active Value                | Source Line | Cascade / Source Role                                                  |
| :------------- | :----------- | :-------------------------- | :---------- | :--------------------------------------------------------------------- |
| Background     | `--bg`       | `#141624`                   | Line 1660   | Active navy background (overrides Line 52 `#4f5a68`)                   |
| Navy           | `--navy`     | `#141624`                   | Line 1661   | Active deep ink navy                                                   |
| Foreground     | `--fg`       | `#ffffff`                   | Line 1666   | Active primary text (overrides Line 57 `#f2efe8`)                      |
| Muted          | `--muted`    | `#afb1cb`                   | Line 1667   | Active secondary copy / labels (overrides Line 58 `#a7a9b2`)           |
| Dim            | `--dim`      | `#72759a`                   | Line 1668   | Active subtle copy / pips (overrides Line 59 `#6b6e7a`)                |
| Red            | `--red`      | `#ee004e`                   | Line 1669   | Active brand red-magenta / melon (overrides Line 60 `#e2404f`)         |
| Red Soft       | `--red-soft` | `rgba(238, 0, 78, 0.16)`    | Line 1670   | Active red glow backdrop (overrides Line 61 `rgba(226, 64, 79, 0.14)`) |
| Red Low        | `--redLo`    | `#8f0030`                   | Line 1671   | Active 3D tactile button shadow facet & headline drop                  |
| Bone           | `--bone`     | `#ffffff`                   | Line 1672   | Active CSS bone color (overrides Line 62 `#ece6d6`)                    |
| Production     | `--pro`      | `#ff7fa6`                   | Line 1673   | Active production discipline pink (overrides Line 65 `#f2b33a`)        |
| Sun            | `--sun`      | `#f2b33a`                   | Line 1674   | Active gold / star carrier accent (also Line 65)                       |
| Strategy       | `--str`      | `#8c93e6`                   | Line 1675   | Active strategy discipline periwinkle (overrides Line 63 `#6e8fcc`)    |
| Design         | `--des`      | `#ee004e`                   | Line 1676   | Active design discipline brand red (overrides Line 64 `#e2404f`)       |
| Operations     | `--ops`      | `#55c2b8`                   | Line 1677   | Active operations discipline teal (also Line 66)                       |
| Status OK      | `--ok`       | `#5fd39b`                   | Line 1678   | Active success status green (overrides Line 67 `#4cc58a`)              |
| Glass Surface  | `--glass`    | `rgba(20, 22, 40, 0.84)`    | Line 1662   | Active HUD surface backdrop (overrides Line 53 `0.82`)                 |
| Elevated Glass | `--glass2`   | `rgba(40, 43, 76, 0.62)`    | Line 1663   | Active elevated glass surface (overrides Line 54 `0.88`)               |
| Line Subtle    | `--line`     | `rgba(255, 255, 255, 0.08)` | Line 1664   | Active 1px HUD card border (overrides Line 55 `0.09`)                  |
| Line Medium    | `--line2`    | `rgba(255, 255, 255, 0.20)` | Line 1665   | Active interactive element border (overrides Line 56 `0.18`)           |

### 2.2 WebGL Scene & 2D Canvas Palette (JS Constants)

These values do **not** exist as CSS variables in the source HTML; they are JavaScript constants defined in the 3D scene engine and 2D canvas routines:

- **2D Canvas Palette `C` (lines 2776–2779)**:
  - `C.edge`: `#141624` (outline ink)
  - `C.bone`: `#ECE6D6` (2D sprite hull bone)
  - `C.boneLo`: `#A9A090` (2D sprite hull shadow)
  - `C.gun`: `#56545D` (2D sprite gunmetal hydraulics)
- **Three.js Material Palette `HX` (lines 7394–7409)**:
  - `HX.bone`: `0xffffff` (`#ffffff`, matches active `--bone`)
  - `HX.bone2`: `0xc9cadd` (`#c9cadd`, secondary hull highlight)
  - `HX.gun`: `0x3e4270` (`#3e4270`, hydraulics and weapon barrels)
  - `HX.dark`: `0x1c1e36` (`#1c1e36`, internal joints)
  - `HX.red` / `HX.melon`: `0xee004e` (`#ee004e`, red eye and laser)
  - `HX.yel`: `0xf2b33a` (`#f2b33a`, gold armor accents)
  - `HX.blu`: `0x8c93e6` (`#8c93e6`, periwinkle booster glow)
  - `HX.teal`: `0x55c2b8` (`#55c2b8`, teal telemetry)
  - `HX.glass`: `0x2a3060` (`#2a3060`, 3D canopy / glass material)
  - `HX.chrome`: `0xcdd0e4` (`#cdd0e4`, reflective metal)
  - `HX.holo`: `0xb8c2ff` (`#b8c2ff`, tactical vector callouts)
  - `HX.ink` / `HX.navy`: `0x141624` (`#141624`, ink outlines)
  - `HX.cloud`: `0xf1f1f8` (`#f1f1f8`, cloud background plane)

---

## 3. Typography & Tracking Tokens

### 3.1 Font Families & `next/font` Integration (Lines 41–47, 68–70)

The original prototype imports Google Fonts via external stylesheet link:
`Inter:wght@400;500;600;700;800`, `JetBrains+Mono:wght@500;700`, and `Russo+One` (weight 400).

In Next.js, these are integrated via `next/font/google` in [`src/app/layout.tsx`](file:///d:/Projects/Pete/Concepful-3D/src/app/layout.tsx), self-hosting and bundling `.woff2` font files locally at build time for zero network layout shift (CLS = 0) and zero runtime external CSS requests:

| Font Family        | `next/font` Module | Subsets & Weights                          | Generated Variable      | Design Token Connection                | Fallback Stack                         |
| :----------------- | :----------------- | :----------------------------------------- | :---------------------- | :------------------------------------- | :------------------------------------- |
| **Russo One**      | `Russo_One`        | `latin`, weight `400`                      | `--font-russo-one`      | `--display`, `--font-display`          | `"Arial Black", system-ui, sans-serif` |
| **Inter**          | `Inter`            | `latin`, weights `400, 500, 600, 700, 800` | `--font-inter`          | `--body`, `--font-body`, `--font-sans` | `system-ui, -apple-system, sans-serif` |
| **JetBrains Mono** | `JetBrains_Mono`   | `latin`, weights `500, 700`                | `--font-jetbrains-mono` | `--mono`, `--font-mono`                | `ui-monospace, Menlo, monospace`       |

> [!NOTE] Resolved: U+2192 Monospace Font Fallback Configuration
> In the original prototype, Google Fonts' `JetBrains Mono` latin subset does not include glyph U+2192 (rightwards arrow `→`). When rendering `<em>Mission → Full Crew</em>` in Plans, the prototype fell back to system monospace (`Consolas` on Windows), producing an `<em>` width of `122.265625px`.
> In Next.js, `next/font/google` by default creates an adjusted fallback font based on proportional `Arial`, expanding the arrow glyph to `13.56px` and total `<em>` width to `129.828125px`.
> By configuring `fallback: ["ui-monospace", "monospace"]` on `JetBrains_Mono` in `src/app/layout.tsx`, Next.js routes missing glyph fallbacks through system monospace (`Consolas`), restoring exact subpixel width parity (`122.265625px`) and 100% platform font matching (`Consolas 1 glyph`) with zero layout shift (CLS = 0).

In `:root`, the font stacks reference the `next/font` CSS variables prepended to authoritative source fallbacks (lines 68–70):

```css
:root {
  --display:
    var(--font-russo-one), "Russo One", "Arial Black", system-ui, sans-serif;
  --body: var(--font-inter), "Inter", system-ui, -apple-system, sans-serif;
  --mono:
    var(--font-jetbrains-mono), "JetBrains Mono", ui-monospace, Menlo, monospace;
}
```

In `@theme`, the Tailwind utility families reference `:root` directly:

```css
@theme {
  --font-display: var(--display);
  --font-body: var(--body);
  --font-mono: var(--mono);
  --font-sans: var(--body);
}
```

This guarantees a single point of definition for each font stack.

### 3.2 Tracking / Letter-Spacing

Direct values extracted from prototype CSS classes:

- `--tracking-tight: 0.02em;` (Lines 630, 773, 810, 1610 — stat labels, tab text)
- `--tracking-normal: 0.04em;` (Line 908 — spec descriptions)
- `--tracking-medium: 0.05em;` (Lines 701, 1626 — action buttons)
- `--tracking-wide: 0.06em;` (Lines 257, 337, 670, 879, 1222, 1552, 1753 — uppercase badges)
- `--tracking-wider: 0.08em;` (Lines 316, 817, 1009, 1031, 1297, 1501 — section subheadings)
- `--tracking-widest: 0.1em;` (Lines 920, 1251, 1405, 1512, 1653 — telemetry badges, code pills)
- `--tracking-caps: 0.14em;` (Lines 186, 737, 1188 — wide uppercase sci-fi title tags)

---

## 4. Surfaces, Radii, Shadows, & Blurs

### 4.1 Border Radii

Direct values extracted from prototype CSS, defined literally in `@theme`:

| Token / Utility | Value   | Source Line(s)      | Prototype Element Usage         |
| :-------------- | :------ | :------------------ | :------------------------------ |
| `--radius-xs`   | `3px`   | Line 1318           | `.chip`, progress tick pips     |
| `--radius-sm`   | `6px`   | Lines 380, 520, 689 | `.btn`, `.input`, small pills   |
| `--radius-md`   | `10px`  | Lines 440, 725      | `.hud-box`, inner loadout cards |
| `--radius-lg`   | `14px`  | Line 640            | `.top-inner` navigation capsule |
| `--radius-xl`   | `18px`  | Lines 230, 1345     | `.panel`, `.modal-box`          |
| `--radius-full` | `999px` | Lines 103, 111, 442 | Pill buttons, round status tags |

> [!NOTE] Tailwind v4 Radius Overrides
> Defining `--radius-xs` through `--radius-full` in `@theme` directly overrides Tailwind's built-in radius defaults with the prototype's exact pixel measurements. The duplicate `--radius-*` properties in `:root` have been eliminated to avoid circular self-references.

### 4.2 Backdrop Filter Blurs

Direct values extracted from prototype CSS:

- `--glass-blur: blur(12px);` (Line 436 — `.hud-pill`, `.bar`)
- `--glass-blur-saturate: blur(12px) saturate(1.1);` (Lines 171, 609 — `.topbar`, `.card`)

### 4.3 Tactile Shadows & Inset Rings

Direct values extracted from prototype CSS:

- `--shadow-btn: 0 3px 0 var(--redLo);` (Line 1689 — `.fu` primary button resting state)
- `--shadow-btn-active: 0 1px 0 var(--redLo);` (Line 1692 — `.fu:active` pressed state)
- `--shadow-text-headline: 3px 3px 0 var(--redLo);` (Line 1682 — `.big, .title` retro 3D drop-shadow)
- `--shadow-text-contrast: 3px 3px 0 #141624;` (Line 1686 — `.big span, .title span` contrast shadow)
- `--shadow-focus-ring: inset 0 0 0 1px var(--red);` (Line 805 — `.opt:focus-visible` ring)

---

## 5. Layer Stacking Hierarchy (Z-Index)

Direct z-index values defined across source CSS rules:

| Layer          | CSS Variable  | Value | Source Line & Selector | Role                                |
| :------------- | :------------ | :---- | :--------------------- | :---------------------------------- |
| Curtain        | `--z-curtain` | `4`   | Line 481: `.curtain`   | Scene transition fade overlay       |
| Watermark      | `--z-wmark`   | `5`   | Line 1743: `.wmark`    | Fixed footer watermark badge        |
| Story Scroll   | `--z-story`   | `6`   | Line 148: `.story`     | Narrative scrolling chapters        |
| Hero Lockup    | `--z-boxart`  | `7`   | Line 1268: `.boxart`   | Centered mecha title / logo lockup  |
| Tech-Spec Card | `--z-card`    | `8`   | Line 1176: `.card`     | Right character stats card          |
| Loadout Panel  | `--z-panel`   | `9`   | Line 717: `.panel`     | Left configurator HUD panel         |
| Top Nav        | `--z-top`     | `10`  | Line 615: `.top`       | Fixed header navigation bar         |
| Modal          | `--z-modal`   | `20`  | Line 1340: `.modal`    | Modal dialog backdrop and container |

---

## 6. Spacing Scale Audit & Mobile Safe Areas

### Spacing Scale Audit

A comprehensive audit of `reference/Concepful_Mech_Builder.html` confirms that **no reusable abstract spacing scale (e.g. `--space-1`, `--space-4`) exists in the source `:root`**. Component margins, paddings, and gaps use explicit pixel dimensions (e.g. `padding: 12px 16px;`, `gap: 8px;`, `margin-top: 6px;`). To remain strictly faithful to the source, no artificial spacing scale has been invented.

### Mobile Safe Area Insets (Lines 71–74)

The prototype declares safe-area insets in `:root` to support edge-to-edge layouts (`viewport-fit=cover`):

- `--gl: max(16px, env(safe-area-inset-left, 0px));` (Line 71: gutter left)
- `--gr: max(16px, env(safe-area-inset-right, 0px));` (Line 72: gutter right)
- `--st: env(safe-area-inset-top, 0px);` (Line 73: safe top inset)
- `--sb: env(safe-area-inset-bottom, 0px);` (Line 74: safe bottom inset)

---

## 7. Breakpoints

The prototype source code is **desktop-first** and relies exclusively on `max-width` media queries:

- `@media (max-width: 900px)` (Lines 485, 1453, 1772): Mobile phone layout adaptation. Top bar wraps, scene moves to top half, loadout panel switches to a bottom sheet.
- `@media (max-width: 1023px)` (Line 1448): Tablet layout adaptation. The right-hand character card collapses/hides to preserve canvas clearance.
- `@media (prefers-reduced-motion: reduce)` (Lines 90, 866, 1490): Disables smooth transforms and canvas animations.

> [!IMPORTANT] CSS Custom Properties in Media Queries
> CSS custom properties (variables) cannot be evaluated inside `@media` rule queries (e.g. `@media (max-width: var(--breakpoint))` is invalid CSS). Furthermore, Tailwind v4 `@theme` breakpoints generate `min-width` mobile-first variants. Therefore, no breakpoint tokens exist in CSS; media queries in Phase 3/4 responsive components will directly reference `max-width: 900px` and `max-width: 1023px` matching the source.

---

## 8. Ported Global Component Classes (ADR 0004)

Per ADR 0004, components ported from the original prototype retain their global class names in dedicated stylesheets (`src/styles/<component>.css`). All classes ported to date are cataloged below to ensure global namespace integrity:

### Header Component Classes (`src/styles/header.css`)

| Class Selector | Source Lines             | Description                        | Key Properties                                                                                                                                                    |
| :------------- | :----------------------- | :--------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.top`         | Lines 613–623, 1453–1458 | Fixed top navigation bar container | `position: fixed`, `z-index: var(--z-top, 10)`, `top: calc(12px + var(--st))`, `left: var(--gl)`, `right: var(--gr)`                                              |
| `.glass`       | Lines 606–611            | Translucent glass HUD surface      | `background: var(--glass)`, `border: 1px solid var(--line)`, `backdrop-filter: blur(12px) saturate(1.1)`                                                          |
| `.logo`        | Lines 624–633, 1701–1706 | Brand logo pill container anchor   | `font-family: var(--display)`, `font-size: 17px`, `border-radius: 999px`, `color: #fff`                                                                           |
| `.logo .mk`    | Lines 1707–1712          | Cel-shaded mecha crest SVG icon    | `width: 24px`, `height: 27px`, `display: block`                                                                                                                   |
| `.logo .wm`    | Lines 1713–1717          | Concepful vector wordmark SVG      | `height: 16px`, `width: auto`, `display: block`                                                                                                                   |
| `.navl`        | Lines 98–104             | Navigation pill wrapper            | `display: flex`, `gap: 6px`, `padding: 5px`, `border-radius: 999px`                                                                                               |
| `.navl a`      | Lines 105–115, 485–488   | Navigation text links              | `color: var(--muted)`, `font-size: 13px`, `font-weight: 600`, `padding: 7px 12px`, hidden on `<=900px`                                                            |
| `.fu`          | Lines 694–706, 1688–1690 | Tactile 3D button / CTA base       | `background: var(--red)`, `font-family: var(--display)`, `font-size: 14px`, `text-transform: uppercase`, `padding: 10px 18px`, `box-shadow: 0 3px 0 var(--redLo)` |
| `.navl a.fu`   | Lines 116–120            | Primary CTA link inside nav pill   | `color: #fff`, `padding: 9px 16px`, `font-size: 13px`, visible across all viewports                                                                               |

---

## 8. Hero Card Width (Part 3.3c)

The shared `.sc` card has `max-width: 460px`. At viewports ≥901px the hero's `h1` heading (Russo One, `skewX(-8deg)`, `clamp(36px, 5vw, 66px)`) overflowed the card's right padding edge — this is an **original prototype defect** present in the reference HTML.

The rebuild fixes this with a heading-relative override scoped to `.sc.hero`:

```css
.sc.hero {
  --hero-h1: clamp(36px, 5vw, 66px);
  max-width: calc(7.24 * var(--hero-h1) + 54px);
}
```

**Formula derivation (measured, not guessed):**

| Measurement                          | Value                          |
| ------------------------------------ | ------------------------------ |
| "DEPARTMENT," rendered width at 66px | 477.33px                       |
| "DEPARTMENT," rendered width at 64px | 462.86px                       |
| K = width / fontSize                 | 7.2322 (rounded up → **7.24**) |
| Padding: 2 × 22px                    | 44px                           |
| Breathing room                       | 10px                           |
| Total constant S = 44 + 10           | **54px**                       |

**Verification (overflowRight = max h1 line right − card paddingBox right):**

| Viewport | h1 fontSize | card max-width | overflowRight |
| -------- | ----------- | -------------- | ------------- |
| 1920px   | 66px        | 531.84px       | −17.0px ✓     |
| 1440px   | 66px        | 531.84px       | −17.0px ✓     |
| 1280px   | 64px        | 517.36px       | −16.7px ✓     |
| 1100px   | 55px        | 452.20px       | −15.6px ✓     |
| 1024px   | 51.2px      | 424.69px       | −15.2px ✓     |
| 901px    | 45.05px     | 380.16px       | −14.3px ✓     |
| ≤900px   | 34px        | none           | n/a ✓         |

The `.sc.hero` override is reset to `max-width: none` inside `@media (max-width: 900px)` to restore mobile behavior. The shared `.sc` rule is **not modified**.

---

## 9. Modular Component Stylesheet Cascade Order (ADR 0004)

Split stylesheets change cascade order relative to the original single stylesheet. Order in `globals.css`: tokens, base, header, story, hero, classes, rules, logistics, (next sections). Ported rules that rely on later-wins ordering must be verified by an exact diff; example: `.hz-head` `max-width` in `logistics.css` overrides the shared `.sc` mobile `max-width`, which needed an explicit `<=900px` rule.
