# Lane `next` Report: Next.js 16.4.6 Upgrade & Verification

Numbers that got worse than before: Initial JS bundle size increased by 1,164 bytes (from 705,965 bytes to 707,129 bytes, +0.16%).

## 1. Commits & Files Changed

### Commits
- `77963b1` chore(deps): upgrade next and eslint-config-next to 16.4.6
- Subsequent commit: docs(lanes): add next-report.md

### Files Changed
- `package.json` (modified)
- `pnpm-lock.yaml` (modified)
- `docs/lanes/next-report.md` (new file)

### Full `package.json` Diff
```diff
diff --git a/package.json b/package.json
index b1c8c8d..c38fcd2 100644
--- a/package.json
+++ b/package.json
@@ -13,7 +13,7 @@
     "test": "vitest run"
   },
   "dependencies": {
-    "next": "16.4.3",
+    "next": "16.4.6",
     "react": "19.3.0",
     "react-dom": "19.3.0",
     "three": "0.128.0"
@@ -25,7 +25,7 @@
     "@types/react-dom": "^19",
     "@types/three": "0.128.0",
     "eslint": "^9",
-    "eslint-config-next": "16.4.3",
+    "eslint-config-next": "16.4.6",
     "eslint-config-prettier": "^10.1.8",
     "playwright": "^1.64.1",
     "prettier": "^3.9.10",
```

### `next.config.ts` Status
- Status: Untouched (0 changes).
- Reason: Neither the Next.js 16.4.5/16.4.6 release notes nor the Turbopack build diagnostics required any configuration modifications.

---

## 2. Next.js 16.4.x Security Advisory Analysis

### Query & Identification
Queried the official npm bulk security advisory endpoint (`https://registry.npmjs.org/-/npm/v1/security/advisories/bulk`) for `next@16.4.3`:
- **Advisory IDs & Vulnerability Details**:
  1. `GHSA-mfr8-8qww-v76h`: Information disclosure across root params when `'use cache'` function is called through `unstable_cache()` (vulnerable: `>=16.3.0 <=16.4.4`, fixed: `16.4.5`)
  2. `GHSA-vc7v-qv4w-wrv8`: Cache leak across root param values in nested `'use cache'` functions via delayed inner stream metadata (vulnerable: `>=16.2.0 <=16.4.4`, fixed: `16.4.5`)
  3. `GHSA-7qx7-33qx-rqx2`: SVG rejection bypass in image optimization (vulnerable: `>=16.0.0 <=16.4.4`, fixed: `16.4.5`)
  4. `GHSA-f3mh-rxg3-f5g2`: HttpOnly cookie exposure through internal response header on Edge runtime routes (vulnerable: `>=16.0.0 <=16.4.4`, fixed: `16.4.5`)
  5. `GHSA-pc58-hwjq-p385`: Cross-client response injection and disclosure in self-hosted applications forwarding fetched responses (vulnerable: `>=16.0.0 <=16.4.4`, fixed: `16.4.5`)
  6. `GHSA-rhh4-g77r-r9qj`: Cross-user cache disclosure and poisoning in `use cache` with binary arguments (vulnerable: `>=16.0.0 <=16.4.4`, fixed: `16.4.5`)
  7. `GHSA-vvgp-ww4w-46vf`: Cache poisoning of shared fallback shells in Cache Components via request-supplied placeholder route params (vulnerable: `>=16.4.0 <=16.4.4`, fixed: `16.4.5`)

### Applicability to this App
- None of the vulnerabilities directly exploit this application runtime: the app is an App Router client-heavy static landing page and 3D configurator built with Turbopack, Tailwind v4 postcss, and React 19. It does not use `'use cache'`, `unstable_cache()`, Cache Components, Edge runtime routes, or image optimization SVGs.
- However, Next.js's internal upgrade advisory evaluator (`assessUpgrade`) triggered `SecurityFatalError` during CLI production builds when on versions `<= 16.4.4`.
- Upgrading to `16.4.6` completely resolved all advisories (0 reported vulnerabilities on `16.4.6`) and removed `SecurityFatalError`.

---

## 3. Baseline vs Upgraded 6-Run Build Matrix

### Baseline (`next@16.4.3`)
| Run | Exit Code | Duration (ms) | Notes |
|:---|:---:|:---:|:---|
| 1 | 1 | 47,159 | Exit 1 with `SecurityFatalError` (nudge triggered) |
| 2 | 0 | 20,836 | Succeeded on immediate retry |
| 3 | 1 | 26,356 | Exit 1 with `SecurityFatalError` |
| 4 | 0 | 15,159 | Succeeded on immediate retry |
| 5 | 1 | 10,268 | Exit 1 with `SecurityFatalError` |
| 6 | 0 | 11,446 | Succeeded on immediate retry |

### Upgraded (`next@16.4.6`)
| Run | Exit Code | Duration (ms) | Notes |
|:---|:---:|:---:|:---|
| 1 | 0 | 20,903 | Succeeded (No `SecurityFatalError`) |
| 2 | 0 | 7,620 | Succeeded |
| 3 | 0 | 7,801 | Succeeded |
| 4 | 0 | 7,504 | Succeeded |
| 5 | 0 | 8,000 | Succeeded |
| 6 | 0 | 8,108 | Succeeded |

First 5 lines of Run 1 stdout:
```
▲ Next.js 16.4.6 (Turbopack)
✓ Running next.config.ts took 141ms

  Creating an optimized production build ...
✓ Compiled successfully in 8.1s
```

---

## 4. Bundle Size & Compiled CSS Comparison

| Metric | Baseline (`16.4.3`) | Upgraded (`16.4.6`) | Delta |
|:---|:---:|:---:|:---:|
| Initial Compiled CSS | 53,164 bytes | 53,164 bytes | 0 bytes (0.00%) |
| Initial JS Scripts | 705,965 bytes | 707,129 bytes | +1,164 bytes (+0.16%) |
| Compiled CSS Files | 1 | 1 | 0 |
| Backdrop-Filter Prefixes | 5 prefixed / 5 standard | 5 prefixed / 5 standard | 0 |

---

## 5. Gate Exit Codes Matrix

| Gate Check | Command / Target | Exit Code | Status |
|:---|:---|:---:|:---|
| `lint` | `pnpm lint` | 0 | PASS |
| `typecheck` | `pnpm typecheck` | 0 | PASS |
| `format:check` | `pnpm format:check` | 0 | PASS |
| `test` | `pnpm test` (4,127 tests in 15 suites) | 0 | PASS |
| `build` | `pnpm build` (production, no E2E) | 0 | PASS |
| `check-compiled-css` | `node scripts/check-compiled-css.mjs` | 0 | PASS |
| `reference-sha256` | `reference/Concepful_Mech_Builder.html` | 0 | PASS (`6ddd1efdd493a245f2556fa71440d8693f837275fcd4e232de24d527f8e88802`) |
| `git-eol` | `git ls-files --eol package.json pnpm-lock.yaml` | 0 | PASS (pure LF: `i/lf w/lf`) |
| `hook-check` | Production server window audit | 0 | PASS (no `__CONCEPFUL*` on window) |

---

## 6. Acceptance Suites: Part 4.13 Sweep & Part 6.3b Click Parity

### Part 4.13 Truth Sweep (E2E Build, Viewports 390 & 1280)
- **Rows Evaluated**: 184 story scene rows (0..9150 px scroll across 390 and 1280 viewports)
- **Measured Metrics**:
  - `min diff %`: **0.0005%** (baseline: 0.0005%)
  - `median diff %`: **0.4487%** (baseline: 0.4487%)
  - `max diff %`: **1.0513%** (baseline: 1.0513%)
  - Story rows > 3.0%: **0**

### Part 6.3b Click-Parity Harness (E2E Build, Viewports 390 & 1280)
- **Suites**: Squad suite (13 steps) + Solo suite (6 steps)
- **Snapshot Keys**: 14 per step (`pr`, `prs`, `cid`, `cn`, `cc`, `chd`, `nudgeText`, `nudgeDisp`, `billDisp`, `cardItemsRows`, `statsRows`, `partyText`, `motto`, `formupText`, `onControls`)
- **Negative Control**: 2 deliberate mutations detected immediately (assert equal: true)
- **Parity Mismatches**: **0 mismatches** across all steps and viewports.

---

## 7. Open Issues & Requests to Other Lanes
- **Open Issues**: None.
- **Requests to Other Lanes**: None.

---

## 8. What Could Not Be Verified
- Every specified acceptance check and gate in Rule L8 and prompt tasks 1–5 was executed and verified in full against the actual live reference page and fixtures. No items were skipped or left unverified.
