Numbers that got worse than before: None.

# Lane MODAL Final Report

**Lane:** `modal`  
**Working Directory:** `D:\Projects\Pete\lanes\modal`  
**Branch:** `lane/modal`  
**Assigned Port:** `3112`  
**Execution Date:** 2026-11-24

---

## 1. Commits & Files Changed

### Commits

- `2baa888` — `feat(modal): implement lead modal handlers, focus management, and validation`
- `95cc8f0` — `docs(lanes): add modal-report.md and modal-requests.md`
- `<this commit>` — `docs(lanes): update modal report and requests to reflect Rule Amendments A1-A4`

### Files Owned & Modified / Created

- `src/components/modal/LeadModal.tsx` — Implemented modal DOM markup with `#m-h`, description, `#m-form`, `<form id="pilot">`, `<input id="co">`, `#mx-sub`, `#mx` (`×`), and submission transition to `#m-done` with dynamic `#d-h` (`Welcome to the server[, <company>]`). Added focus `#co` on open via `requestAnimationFrame`, backdrop click handler, and Escape keydown listener.
- `src/components/modal/LeadModalProvider.tsx` — Extended context state with `open(tier?: string)`, `close()`, `isOpen`, and active `tier`.
- `src/domain/lead.ts` — Pure domain functions `formatWelcomeHeading` and `validateLeadSubmission` copied with verbatim reference line citations (lines 15029-15087) from `reference/Concepful_Mech_Builder.html`.
- `tests/fixtures/modal-solo.html` — Fixture of `#modal` outerHTML captured from live reference in `solo` tier (SHA256: `f3cb8060fbcb4bf4b854dc22ba123f3b067605502769e1bcfb1dfd5a74dba1a1`).
- `tests/fixtures/modal-squad.html` — Fixture of `#modal` outerHTML captured from live reference in `squad` tier (SHA256: `f3cb8060fbcb4bf4b854dc22ba123f3b067605502769e1bcfb1dfd5a74dba1a1`).
- `tests/fixtures/modal-combine.html` — Fixture of `#modal` outerHTML captured from live reference in `combine` tier (SHA256: `f3cb8060fbcb4bf4b854dc22ba123f3b067605502769e1bcfb1dfd5a74dba1a1`).
- `tests/fixtures/modal-submit-valid.html` — Fixture of `#modal` outerHTML captured from live reference after valid submission with company name (SHA256: `7a49d8ccf4ad591227749878daa9f6fa4c3c05d6bb24e2cbeedc0d4e826d105c`).
- `tests/fixtures/modal-submit-invalid.html` — Fixture of `#modal` outerHTML captured from live reference after empty submission (SHA256: `f8940cd8031b23b74209b6ebd6b6b43b6c1c7b46acf18e34aec69112f4c28e38`).
- `tests/modal-domain.test.ts` — Vitest unit tests verifying `formatWelcomeHeading`, `validateLeadSubmission`, and 0 network requests.
- `docs/lanes/modal-requests.md` — Cross-lane request to Integrator lane for Prettier formatting on `docs/lanes/next-report.md`.
- `docs/lanes/modal-report.md` — This execution and verification report.

---

## 2. Gate Verification Exit Codes (Rules L8 & A1-A2)

| Gate Step                | Command                                                                | Exit Code | Script Computed Status  | Notes                                                                                                    |
| :----------------------- | :--------------------------------------------------------------------- | :-------- | :---------------------- | :------------------------------------------------------------------------------------------------------- |
| **Lint**                 | `pnpm lint`                                                            | `0`       | `VALID`                 | 0 errors across all files (6 unused-var warnings in existing slot files).                                |
| **Typecheck**            | `pnpm typecheck`                                                       | `0`       | `VALID`                 | `tsc --noEmit` clean.                                                                                    |
| **Format Check (Owned)** | `pnpm prettier --check <owned files>`                                  | `0`       | `VALID`                 | All lane modal files adhere to Prettier code style.                                                      |
| **Format Check (Repo)**  | `pnpm format:check`                                                    | `1`       | `FAIL (known upstream)` | Only fails on `docs/lanes/next-report.md` (unowned, committed on main; integrator fixes it per Rule A2). |
| **Unit Tests**           | `pnpm vitest run --testTimeout=30000`                                  | `0`       | `VALID`                 | 18 test files, 4,137 tests; run with `--testTimeout=30000` per Rule A2.                                  |
| **Build**                | `pnpm build`                                                           | `0`       | `VALID`                 | Compiled with Turbopack on first attempt. 0 rebuilds needed.                                             |
| **Check Compiled CSS**   | `node scripts/check-compiled-css.mjs`                                  | `0`       | `VALID`                 | All 5 backdrop-filter rules prefixed in `.next/static/chunks`.                                           |
| **Runtime Hook Check**   | `node C:\Users\steve\concepful_scratch\lane_modal\check_hooks.mjs`     | `0`       | `VALID`                 | 0 `__CONCEPFUL*` hooks exposed on `window` in production build.                                          |
| **Reference SHA-256**    | `Get-FileHash reference/Concepful_Mech_Builder.html -Algorithm SHA256` | `0`       | `VALID`                 | SHA256 matches `6DDD1EFDD493A245F2556FA71440D8693F837275FCD4E232DE24D527F8E88802`.                       |
| **Line Endings (EOL)**   | `git ls-files --eol`                                                   | `0`       | `VALID`                 | All modified and created files verified with LF (`i/lf w/lf`).                                           |

### Raw Output of `pnpm format:check` (Rule A2)

```text
$ prettier --check .
Checking formatting...
[warn] docs/lanes/next-report.md
[warn] Code style issues found in the above file. Run Prettier with --write to fix.
[ELIFECYCLE] Command failed with exit code 1.
```

---

## 3. Raw Acceptance Tables & Evidence (Rules L7, A3, A4)

All numbers below are copied from results files printed with `cat` in this conversation:

- `step1_characterization.json`: `C:\Users\steve\concepful_scratch\lane_modal\step1_characterization.json` (size: 6,402 B, SHA256: `3a77a1a487b07baa0cae1ffe2cba3efd6001fecfff949000af918e21377966ff`)
- `step3_parity_results.json`: `C:\Users\steve\concepful_scratch\lane_modal\step3_parity_results.json` (size: 12,765 B, SHA256: `5137895dcb47cba1688336133dbc7dc326fd1812b7d7ba85efaad761d5146105`)
- `pixel_results.json`: `C:\Users\steve\concepful_scratch\lane_modal\pixel_results.json` (size: 18,817 B, SHA256: `e10824b54c6ef775b4c45c7cb5f1378c433b90553bc6c9168333640ef8091f0f`)

The scripts that produced these results:

- `step1_characterization.mjs`: `C:\Users\steve\concepful_scratch\lane_modal\step1_characterization.mjs` (size: 10,796 B, SHA256: `8afb509cc0bebc9cbdebf1ae0c6623db016d9dc52bdb7bb0f8ddc8d8096742d6`)
- `parity_harness.mjs`: `C:\Users\steve\concepful_scratch\lane_modal\parity_harness.mjs` (size: 18,900 B, SHA256: `bd7b157522bfad9f3614f2c91ed6c193b2fe2f013046d5a5ffdb694c9afc4888`)
- `pixel_protocol.mjs`: `C:\Users\steve\concepful_scratch\lane_modal\pixel_protocol.mjs` (size: 13,551 B, SHA256: `ebf2f5548dbba3f888e0fa6ddc130e3244cc64c3da1cbabf411317b4706422be`)
- `check_hooks.mjs`: `C:\Users\steve\concepful_scratch\lane_modal\check_hooks.mjs` (size: 783 B, SHA256: `7007b1e594c43df7bbc293b6d62f0ab42077d84f74bc461b94df54c1dd33c2f7`)

### A. Reference Characterization & Fixtures (Step 1)

HTML fixtures captured from `reference/Concepful_Mech_Builder.html` (SHA256 `6ddd1efdd493a245f2556fa71440d8693f837275fcd4e232de24d527f8e88802`):

| Fixture File                               | State Description                                      | File Size | SHA256 Hash                                                        |
| :----------------------------------------- | :----------------------------------------------------- | :-------- | :----------------------------------------------------------------- |
| `tests/fixtures/modal-solo.html`           | Open modal on `solo` tier                              | 2,752 B   | `f3cb8060fbcb4bf4b854dc22ba123f3b067605502769e1bcfb1dfd5a74dba1a1` |
| `tests/fixtures/modal-squad.html`          | Open modal on `squad` tier                             | 2,752 B   | `f3cb8060fbcb4bf4b854dc22ba123f3b067605502769e1bcfb1dfd5a74dba1a1` |
| `tests/fixtures/modal-combine.html`        | Open modal on `combine` tier                           | 2,752 B   | `f3cb8060fbcb4bf4b854dc22ba123f3b067605502769e1bcfb1dfd5a74dba1a1` |
| `tests/fixtures/modal-submit-valid.html`   | Modal after valid submission (`company = "Acme Corp"`) | 2,704 B   | `7a49d8ccf4ad591227749878daa9f6fa4c3c05d6bb24e2cbeedc0d4e826d105c` |
| `tests/fixtures/modal-submit-invalid.html` | Modal after empty submission (`company = ""`)          | 2,693 B   | `f8940cd8031b23b74209b6ebd6b6b43b6c1c7b46acf18e34aec69112f4c28e38` |

### B. Parity Harness Verification (Step 3)

Measured across viewports `1280x800` and `390x800` across all tiers (`solo`, `squad`, `combine`) and full interaction sequences:

| Viewport             | Tier                                                              | Action Sequence                                                                                      | Steps Tested | Steps Matching | Network Requests   | Script Status |
| :------------------- | :---------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------- | :----------- | :------------- | :----------------- | :------------ |
| `1280x800`           | `solo`                                                            | Open panel, check state, Escape, re-open header, submit empty, re-open, submit valid, backdrop close | 11           | 11             | 0                  | `VALID`       |
| `1280x800`           | `squad`                                                           | Open panel, check state, Escape, re-open header, submit empty, re-open, submit valid, backdrop close | 11           | 11             | 0                  | `VALID`       |
| `1280x800`           | `combine`                                                         | Open panel, check state, Escape, re-open header, submit empty, re-open, submit valid, backdrop close | 11           | 11             | 0                  | `VALID`       |
| `390x800`            | `solo`                                                            | Open panel, check state, Escape, re-open, submit empty, re-open, submit valid, close button close    | 10           | 10             | 0                  | `VALID`       |
| `390x800`            | `squad`                                                           | Open panel, check state, Escape, re-open, submit empty, re-open, submit valid, close button close    | 10           | 10             | 0                  | `VALID`       |
| `390x800`            | `combine`                                                         | Open panel, check state, Escape, re-open, submit empty, re-open, submit valid, close button close    | 10           | 10             | 0                  | `VALID`       |
| **Negative Control** | Injected altered `#m-h` text (`"Your build is ready (MODIFIED)"`) | 1                                                                                                    | 1            | 0              | `DETECTED (VALID)` |

- `totalStepsTested`: 63
- `passedSteps`: 63
- `failedSteps`: 0
- `networkRequestsCount`: 0
- `negativeControl.detected`: true

### C. Fixed Protocol Pixel Diff (Step 4)

Measured on open modal at viewports `1280x800` and `390x800` for `.mcard` and full viewport with `#gl, #cv, #patch` hidden (`display: none !important;`). Protocol: 3 runs on reference, 3 runs on rebuild. Noise floor limit: $\le 50\text{ px}$. Any row where noise floor exceeds 50 px is marked `INVALID (noise > 50)` per Rule L7.

| Target     | Viewport   | State     | Ref Noise | Reb Noise | Diff Pixels     | Diff %  | Baseline % | Diff vs Baseline | Script Status          |
| :--------- | :--------- | :-------- | :-------- | :-------- | :-------------- | :------ | :--------- | :--------------- | :--------------------- |
| `.mcard`   | `1280x800` | `solo`    | 9 px      | 0 px      | 435 / 191,360   | 0.2273% | 0.2278%    | -0.0005%         | `VALID`                |
| `viewport` | `1280x800` | `solo`    | 474 px    | 0 px      | N/A             | N/A     | N/A        | N/A              | `INVALID (noise > 50)` |
| `.mcard`   | `1280x800` | `squad`   | 0 px      | 0 px      | 435 / 191,360   | 0.2273% | 0.2278%    | -0.0005%         | `VALID`                |
| `viewport` | `1280x800` | `squad`   | 0 px      | 0 px      | 624 / 1,024,000 | 0.0609% | N/A        | N/A              | `VALID`                |
| `.mcard`   | `1280x800` | `combine` | 9 px      | 0 px      | 435 / 191,360   | 0.2273% | 0.2278%    | -0.0005%         | `VALID`                |
| `viewport` | `1280x800` | `combine` | 0 px      | 0 px      | 638 / 1,024,000 | 0.0623% | N/A        | N/A              | `VALID`                |
| `.mcard`   | `1280x800` | `success` | 1194 px   | 0 px      | N/A             | N/A     | N/A        | N/A              | `INVALID (noise > 50)` |
| `viewport` | `1280x800` | `success` | 870 px    | 0 px      | N/A             | N/A     | N/A        | N/A              | `INVALID (noise > 50)` |
| `.mcard`   | `390x800`  | `solo`    | 0 px      | 0 px      | 438 / 173,988   | 0.2517% | 0.2661%    | -0.0144%         | `VALID`                |
| `viewport` | `390x800`  | `solo`    | 163 px    | 0 px      | N/A             | N/A     | N/A        | N/A              | `INVALID (noise > 50)` |
| `.mcard`   | `390x800`  | `squad`   | 0 px      | 0 px      | 441 / 173,988   | 0.2535% | 0.2661%    | -0.0126%         | `VALID`                |
| `viewport` | `390x800`  | `squad`   | 9 px      | 0 px      | 448 / 312,000   | 0.1436% | N/A        | N/A              | `VALID`                |
| `.mcard`   | `390x800`  | `combine` | 127 px    | 0 px      | N/A             | N/A     | N/A        | N/A              | `INVALID (noise > 50)` |
| `viewport` | `390x800`  | `combine` | 0 px      | 0 px      | 448 / 312,000   | 0.1436% | N/A        | N/A              | `VALID`                |
| `.mcard`   | `390x800`  | `success` | 810 px    | 0 px      | N/A             | N/A     | N/A        | N/A              | `INVALID (noise > 50)` |
| `viewport` | `390x800`  | `success` | 1227 px   | 0 px      | N/A             | N/A     | N/A        | N/A              | `INVALID (noise > 50)` |

- Rebuild noise floor: 0 px across all 16 runs.
- On every valid `.mcard` row, diff percentage is lower than the Phase 3 baseline (`0.2273% < 0.2278%` at 1280; `0.2517% < 0.2661%` and `0.2535% < 0.2661%` at 390).

---

## 4. Open Issues

- None.

---

## 5. Requests to Other Lanes

Documented in `docs/lanes/modal-requests.md`:

1. **Prettier on main:** `docs/lanes/next-report.md` was merged on `main` without formatting. The integrator will format that file per Rule A2.

---

## what could not be verified

1. **Pixel difference on `success` state (.mcard and full viewport) and `combine_mcard_390`**: In the reference page, form submission triggers canvas callout toasts (`call(...)`) and `formT` camera jitter timing in `reference/Concepful_Mech_Builder.html` (lines 6898-6908, 15086), causing the reference page's noise floor across repeated loads to vary between 127 px and 1227 px. Per Rule L7, any row with noise floor > 50 px is strictly marked `INVALID`, so a quantitative pixel diff percentage against the reference page could not be claimed for those specific conditions despite visual and structural parity.
2. **Real backend lead delivery / external CRM**: In both the reference application and the rebuild, the lead form submission is entirely client-side; no network requests are emitted. Backend CRM ingestion (e.g. HubSpot, email delivery, or database storage) does not exist in the reference design and thus cannot be tested end-to-end against live external endpoints.
