# Testing & Verification Guide

This document records automated and manual testing procedures for the Concepful Mech Builder rebuild.

## Automated Gates

- **Lint:** `pnpm lint` (ESLint 9 flat config)
- **Typecheck:** `pnpm typecheck` (`tsc --noEmit`)
- **Format Check:** `pnpm format:check` (`prettier --check .`)
- **Unit & Property Tests:** `pnpm test` (Vitest)
  - `tests/isolation.test.ts`: Component style isolation and container safety
  - `tests/reducer.test.ts`: Pure state transition tests for configurator reducer
  - `tests/sections.test.ts`: Section ID and navigation consistency assertions
  - `tests/golden.test.ts`: Pricing engine golden calculations
  - `tests/differential.test.ts`: Differential fuzz testing against original reference logic
  - `tests/css-prefix-order.test.ts`: Enforces vendor prefix declaration order (`-webkit-backdrop-filter` before `backdrop-filter`) and pairing across all `src/styles/*.css`

## Manual Post-Build Checks

### Compiled CSS Vendor Prefix Audit

LightningCSS / Turbopack minification requires vendor-prefixed properties to be declared before standard properties in source stylesheets to avoid stripping the standard rule in compiled production chunks.

Run the following post-build verification script after `pnpm build`:

```bash
node scripts/check-compiled-css.mjs
```

This script verifies:

1. Every `-webkit-backdrop-filter` occurrence in `.next/static/chunks/*.css` is matched by a standard `backdrop-filter` property in the same rule block.
2. Standard `backdrop-filter` occurrences are preceded by the vendor prefix.
3. Exits with code 1 if any rule contains the prefix without the standard property.

---

## Global Computed Property Sweep & Exact Canvas Diffs

To guarantee pixel-perfect visual parity and styling fidelity against `reference/Concepful_Mech_Builder.html`, all static subtrees are verified through automated Playwright automation scripts:

### 1. In-Browser Exact Canvas Pixel Diffs (Tolerance 0)

1. **Exact 0 Tolerance:** Every visual comparison runs via in-browser `<canvas>` pixel matching with tolerance 0.
2. **Dimension Guards:** Diff scripts strictly fail if screenshots have any dimension mismatch (`width` or `height`).
3. **Isolation:** WebGL canvases (`#gl, #cv`) are hidden to avoid 3D scene randomness.
4. **Clean Execution Context:** Fresh browser context per page per viewport width with JavaScript disabled (unless testing forced interactive states).

### 2. Global Computed Property Sweep Methodology

The global sweep script extracts computed styles for every element in each paired subtree:

1. `header.top` (`header#top`)
2. `#intro` (`#s-intro` vs `#intro`)
3. `#classes` (`#s-classes` vs `#classes`)
4. `#how-it-works` (`#s-logi` vs `#how-it-works`)
5. `#rules` (`#s-rules` vs `#rules`)
6. `#plans` (`#s-stages` vs `#plans`)
7. `#outro` (`#s-outro` vs `#outro`)
8. `#build` (`#build` vs `#build`)
9. `footer.wmark` (`footer.wmark`)
10. `#modal` (`#modal`)

Across 4 canonical viewports: **390px, 768px, 1280px, 1920px**.

#### Property Comparison & Categorization

All computed CSS properties (excluding custom properties `--*`) are compared in lockstep. Differences are strictly categorized into:

- **Benign Reset Properties:** Universal modern framework resets that do not impact visual fidelity:
  - `tab-size`: `4` (Tailwind preflight) vs `8` (UA default)
  - `text-size-adjust`: `100%` vs `auto`
  - `-webkit-font-smoothing`: `antialiased` vs `auto`
  - `-webkit-locale`: `"en"` vs `auto`
  - `-webkit-tap-highlight-color`: `rgba(0,0,0,0)` vs `rgba(0,0,0,0.18)`
  - `vertical-align`: `middle` on SVG vs `baseline`
  - Zero-width border styles (`none` vs `solid` where `border-width: 0px`)
  - Next.js font-face fallback font family strings (`"Russo One Fallback"`, `"Inter Fallback"`)
- **Non-Benign Differences:** Any differences in layout, geometry, margins, padding, line-height, cursor, colors, or list markers are audited, traced to prototype source lines, and reconciled.
