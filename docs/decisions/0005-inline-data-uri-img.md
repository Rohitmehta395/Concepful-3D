# ADR 0005: Scoped Exception for Inline Data-URI Image in Footer

- **Status:** Approved
- **Date:** November 8, 2026
- **Context:** Phase 3, Part 3.7 (Static Ending — Watermark Footer)

---

## Context

In `reference/Concepful_Mech_Builder.html` (lines 2201–2205), the watermark footer (`.wmark`) embeds an inline base64-encoded PNG image mark (`data:image/png;base64,...`, 3,422 bytes).

1. **Unoptimizable by next/image:**
   The Next.js image component (`next/image`) is designed to optimize remote or local file assets via build-time image optimization, resizing, format conversion (WebP/AVIF), and srcSet generation. For a pre-rasterized 28x28px inline base64 data URI, passing it to `next/image` introduces unnecessary client JavaScript hydration overhead and image optimization pipeline processing for an already fully embedded asset.
2. **Prototype Parity:**
   The original prototype directly renders `<img src="data:image/png;base64,..." alt="" width="28" height="28">`. A standard HTML `<img>` tag matches the reference DOM structure and CSS layout rules (`.wmark img`) byte-for-byte, adding 0 bytes of client JS runtime overhead.
3. **Linter Rule:**
   ESLint rule `@next/next/no-img-element` flags native `<img>` usage to encourage `<Image />` adoption for general content images.

---

## Decision

We grant a **single scoped lint exception** via `/* eslint-disable-next-line @next/next/no-img-element */` exclusively on the footer image element in `src/components/shell/Footer.tsx`:

1. **Extracted Constant in Content:**
   The data URI is extracted to `src/content/assets.ts` as `FOOTER_LOGO_DATA_URI` to prevent component bloat and separate static binary data from presentation logic.
2. **Explicit Comment Required:**
   The eslint-disable directive must always carry a descriptive inline comment citing this ADR.
3. **Zero Runtime Overhead:**
   Using native `<img>` preserves the pure server-component nature of `Footer.tsx` (0 bytes of client JS).

---

## Consequences

1. **Zero Client Bundle Bloat:**
   No Next.js image optimization runtime or wrapper elements are injected into the DOM.
2. **Strict Scope:**
   This exception applies strictly to the static inline base64 mark in `Footer.tsx`. All user-facing content images across the application will continue to adhere to `@next/next/no-img-element`.
3. **Parity Maintained:**
   The rendered HTML and layout match the original prototype with 0 pixel difference at mobile viewports and $\le 4\text{px}$ subpixel AA at desktop.
