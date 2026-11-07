# ADR 0004: Global Component CSS Architecture for Ported Prototype Styles

- **Status:** Approved
- **Date:** October 30, 2026
- **Context:** Phase 3, Part 3.2 (Static Header Implementation) & Part 3.3 (Empirical Probe Verification)

---

## Context

In Next.js under Turbopack with Tailwind v4, `next.config.ts` defines:

```ts
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};
```

This wildcard rule matches all CSS files, including `*.module.css`. A direct empirical probe was conducted using an isolated server component and `Probe.module.css` declaring `.probe { color: red; }`:

1. **Importing CSS Modules Produces an Empty Object:**
   Importing `styles` from `Probe.module.css` yields `{}` at runtime. Accessing `styles.probe` evaluates to `undefined`, and `JSON.stringify(styles)` emits `"{}"`.
2. **Compiled Rules Are Global, Not Scoped:**
   The compiled production CSS chunk emits `.probe{color:red}` without any module hash suffix or scoping.
3. **Root Cause:**
   The Turbopack loader configuration directs all `*.css` files through `@tailwindcss/turbopack` as standard global styles, bypassing the built-in Next.js CSS Module loader that would normally generate scoped class name mappings.
4. **Superseded Stand-in Repro & Unverified Claims:**
   An earlier draft of this ADR referenced a reproduction using a stand-in component; that stand-in is superseded by this direct probe. Any prior speculation that CSS Modules caused vendor prefix dropping on `backdrop-filter` is marked as **not verified** (vendor prefix retention was resolved by declaration ordering in global CSS).
5. **Prototype Architecture Alignment:**
   The original authoritative prototype (`reference/Concepful_Mech_Builder.html`) relies on semantic global class names (`.top`, `.logo`, `.glass`, `.navl`, `.fu`, `.mk`, `.wm`) shared across headers, cards, and modal components.

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

## Consequences

1. **Global Class Namespace:**
   All ported classes reside in the global CSS namespace. To prevent unintended collisions, every ported class must be documented in `docs/design-system.md`.
2. **Deterministic Build & SSR Hydration:**
   Direct global imports through `globals.css` integrate smoothly with `@tailwindcss/turbopack`, emit zero runtime JS class map lookups, maintain 0 bytes added client JS, and ensure consistent server-rendered and hydrated markup.
3. **Collision Governance & Cascade Order:**
   If style collisions occur as additional components (cards, configurator, modal) are ported, specificity scoping (e.g., `.top .glass` vs `.card .glass`) or explicit prefixed wrappers will be adopted.
   Split stylesheets change cascade order relative to the original single stylesheet. Order in globals.css: tokens, base, header, story, hero, classes, rules, logistics, (next sections). Ported rules that rely on later-wins ordering must be verified by an exact diff; example: `.hz-head` `max-width` in `logistics.css` overrides the shared `.sc` mobile `max-width`, which needed an explicit `<=900px` rule.
