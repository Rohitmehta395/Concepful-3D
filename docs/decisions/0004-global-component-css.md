# ADR 0004: Global Component CSS Architecture for Ported Prototype Styles

- **Status:** Approved
- **Date:** October 30, 2026
- **Context:** Phase 3, Part 3.2 (Static Header Implementation)

---

## Context

In Phase 3 Part 3.2, header styling was initially ported into a local CSS Module (`src/components/shell/Header.module.css`) and imported into `Header.tsx`. Two critical issues were observed in the production build:

1. **Unmapped Class Names:**
   In the prerendered HTML output of the CSS-module build, class name references like `styles.logo` and `styles.glass` evaluated to `undefined`, rendering:

   ```html
   <header><a class="undefined undefined" href="#intro">...</a></header>
   ```

   The class names were not mapped to scoped CSS Module hashes.

2. **Omission of Unprefixed `backdrop-filter` in Compiled CSS:**
   When the source CSS declared `backdrop-filter: blur(12px) saturate(1.1);` followed by `-webkit-backdrop-filter: blur(12px) saturate(1.1);`, the compiled production chunk omitted standard `backdrop-filter` entirely, emitting only:

   ```css
   .glass{-webkit-backdrop-filter:blur(12px)saturate(1.1);...}
   ```

   Consequently, Chromium computed `backdropFilter` as `'none'`.

3. **Global Class Architecture in Original Prototype:**
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
   Declaring `-webkit-backdrop-filter` prior to `backdrop-filter` ensures minification preserves both declarations in the compiled chunk:
   ```css
   .glass {
     background: var(--glass);
     border: 1px solid var(--line);
     -webkit-backdrop-filter: blur(12px) saturate(1.1);
     backdrop-filter: blur(12px) saturate(1.1);
   }
   ```

---

## Empirical Reproduction & Build Verification (Option A)

To verify the CSS-module failure mode empirically, a clean build was run in a temporary worktree based on commit `d7435be` with `Header.module.css` imported into `Header.tsx`:

1. **Prerendered HTML Output:**

   ```html
   <header>
     <a class="undefined undefined" href="#intro"><span>Logo</span></a>
   </header>
   ```

   _Result:_ Class names were not mapped (`undefined`).

2. **Compiled CSS Chunk Output (`.next/static/chunks/*.css`):**

   ```css
   .top {
     z-index: 10;
     position: fixed;
     top: 12px;
   }
   .glass {
     -webkit-backdrop-filter: blur(12px) saturate(1.1);
     background: #141628d6;
     border: 1px solid #ffffff14;
   }
   .logo {
     display: flex;
   }
   ```

   _Result:_ The compiled `.glass` rule emitted global class selectors rather than scoped module hashes, and omitted standard `backdrop-filter`.

3. **Current Global Component CSS Build Output (`.next/static/chunks/1vgfrxio1yytr.css`):**
   ```css
   .glass {
     background: var(--glass);
     border: 1px solid var(--line);
     -webkit-backdrop-filter: blur(12px) saturate(1.1);
     backdrop-filter: blur(12px) saturate(1.1);
   }
   ```
   _Result:_ Both declarations are preserved and active. Chromium computes `backdropFilter: "blur(12px) saturate(1.1)"`.

---

## Consequences

1. **Global Class Namespace:**
   All ported classes reside in the global CSS namespace. To prevent unintended collisions, every ported class must be documented in `docs/design-system.md`.
2. **Deterministic Build & SSR Hydration:**
   Direct global imports through `globals.css` integrate smoothly with `@tailwindcss/turbopack`, emit zero runtime JS class map lookups, maintain 0 bytes added client JS, and ensure consistent server-rendered and hydrated markup.
3. **Collision Governance:**
   If style collisions occur as additional components (cards, configurator, modal) are ported, specificity scoping (e.g., `.top .glass` vs `.card .glass`) or explicit prefixed wrappers will be adopted.
