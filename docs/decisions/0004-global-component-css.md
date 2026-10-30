# ADR 0004: Global Component CSS Architecture for Ported Prototype Styles

- **Status:** Approved
- **Date:** October 30, 2026
- **Context:** Phase 3, Part 3.2 (Static Header Implementation)

---

## Context

In Phase 3 Part 3.2, header styling was initially ported into a local CSS Module (`src/components/shell/Header.module.css`) and imported into `Header.tsx`. Two critical issues occurred:

1. **Turbopack Loader Conflict with CSS Modules:**
   In `next.config.ts`, Turbopack was configured with `loaders: ["@tailwindcss/turbopack"]` matching `"*.css"`. When `Header.module.css` was imported, Turbopack ran the Tailwind preprocessor over the file rather than generating scoped CSS Module class maps. As a result, the default import `styles` was an empty object, causing class references like `styles.logo` to evaluate to `undefined` in the JSX output (`class="undefined undefined logo glass"`).

2. **LightningCSS Minification of `backdrop-filter`:**
   When CSS declared `backdrop-filter: blur(12px) saturate(1.1);` followed by `-webkit-backdrop-filter: blur(12px) saturate(1.1);`, the LightningCSS minifier treated standard `backdrop-filter` as superseded by the vendor prefix and omitted standard `backdrop-filter` from the final chunk. Consequently, in Chromium, `window.getComputedStyle(el).backdropFilter` computed to `'none'`.

3. **Global Class Naming in Original Prototype:**
   The original authoritative prototype (`reference/Concepful_Mech_Builder.html`) uses global, semantic class names (`.top`, `.logo`, `.glass`, `.navl`, `.fu`, `.mk`, `.wm`) that are shared across header, cards, and modal components.

---

## Decision

We adopt a **Global Component CSS Architecture** for ported prototype styles:

1. **Dedicated Component Style Files:**
   Ported CSS for prototype components lives in `src/styles/<component>.css` (e.g. `src/styles/header.css`, `src/styles/base.css`, `src/styles/tokens.css`).
2. **Central Import in `globals.css`:**
   Component style files are imported directly into `src/app/globals.css` beneath `@import "tailwindcss";` and `@import "../styles/tokens.css";`.
3. **Preserve Original Class Names:**
   Components use original global class names (`.top`, `.logo`, `.glass`, `.navl`, `.fu`, etc.) verbatim without hash munging or CSS Module indirection.
4. **Tailwind Utilities for New/Supplemental Code:**
   New utility enhancements (such as responsive layout adjustments or layout spacers) use standard Tailwind v4 utility classes.
5. **Vendor Prefix Ordering for `backdrop-filter`:**
   To guarantee both declarations are emitted into compiled chunks, vendor prefixes must be declared _before_ standard properties:
   ```css
   .glass {
     background: var(--glass);
     border: 1px solid var(--line);
     -webkit-backdrop-filter: blur(12px) saturate(1.1);
     backdrop-filter: blur(12px) saturate(1.1);
   }
   ```

---

## Compiled Output Verification

### Compiled `.glass` Rule in Current Production Build

From `.next/static/chunks/1vgfrxio1yytr.css` (current build output):

```css
.glass {
  background: var(--glass);
  border: 1px solid var(--line);
  -webkit-backdrop-filter: blur(12px) saturate(1.1);
  backdrop-filter: blur(12px) saturate(1.1);
}
```

### Previous Failing CSS-Module Build Output

In the initial CSS-module attempt with standard `backdrop-filter` placed after `-webkit-backdrop-filter`:
The compiled chunk emitted only `-webkit-backdrop-filter:blur(12px)saturate(1.1)` without `backdrop-filter`, causing Chromium's computed `backdropFilter` property to return `'none'`. (The exact ephemeral chunk has been replaced by the working build, but the reproduction was logged in Task 832).

---

## Consequences

1. **Global Class Namespace:**
   All ported classes reside in the global CSS namespace. To prevent unintended collisions, every ported class must be documented in `docs/design-system.md`.
2. **Deterministic Build & SSR Hydration:**
   Direct global imports through `globals.css` integrate smoothly with `@tailwindcss/turbopack`, emit zero runtime JS class map lookups, maintain 0 bytes added client JS, and ensure consistent server-rendered and hydrated markup.
3. **Collision Governance:**
   If style collisions occur as additional components (cards, configurator, modal) are ported, specificity scoping (e.g., `.top .glass` vs `.card .glass`) or explicit prefixed wrappers will be adopted.
