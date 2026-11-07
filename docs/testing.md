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
