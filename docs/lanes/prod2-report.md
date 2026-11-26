Numbers that got worse than before: None.

# Lane PROD2 Final Report

**Lane:** `prod2`  
**Working Directory:** `D:\Projects\Pete\lanes\prod2`  
**Branch:** `lane/prod2`  
**Assigned Port:** `3102`  
**Base Commit:** `ee37225` (integration-c)  
**Execution Date:** 2026-11-26

---

## 1. Commits & Files Changed

### Files Owned & Modified / Created

- `src/app/layout.tsx` — Removed invented fallback domain (`https://concepful.com`); `metadataBase`, `alternates.canonical`, and `openGraph.url` are emitted only when `NEXT_PUBLIC_SITE_URL` is set.
- `src/app/robots.ts` — When `NEXT_PUBLIC_SITE_URL` is set: `Allow: /` + `Sitemap: <url>/sitemap.xml`. When unset: `User-Agent: *` + `Disallow: /` and no `Sitemap` line.
- `src/app/sitemap.ts` — Removed `lastModified`; emits single entry for `NEXT_PUBLIC_SITE_URL` when set, and `[]` (no entries) when unset.
- `.env.example` — Removed invented domain; documented both set and unset modes of `NEXT_PUBLIC_SITE_URL`.
- `README.md` — Documented both `NEXT_PUBLIC_SITE_URL` modes with no default domain.
- `docs/deploy.md` — Documented both `NEXT_PUBLIC_SITE_URL` modes with no default domain.
- `tests/prod2-site-url.test.ts` — New Vitest unit tests for `robots()` and `sitemap()` in unset, whitespace, and set modes.
- `docs/lanes/prod-a11y-audit.md` — Rewritten from automated Playwright measurements (focus traversal, transparent-text median-background contrast, and reduced-motion animations/CSS/source hits).
- `docs/lanes/prod2-requests.md` — Cross-lane request for pixel-neutral `<h1>` -> `<h2>` fix in `src/components/configurator/ConfiguratorShell.tsx:120`, verified with 3-load noise-floor pixel check.
- `docs/lanes/prod2-report.md` — This report.

---

## 2. Gate Verification Exit Codes (A1–A4, A9)

- **A1 Build Attempts:**
  - Attempt 1 (`pnpm build`): exited `1` due to TypeScript error in our new test file: `tests/prod2-site-url.test.ts(59,30): error TS2532: Object is possibly 'undefined'.`
  - Fixed `tests/prod2-site-url.test.ts` and rebuilt. Final `pnpm build` exited `0`.
- **A2 Format & Tests:** Base contains `2828633` (integration-a); `pnpm format:check` and plain `pnpm test` both exit `0`.

| Gate Step              | Command                               | Exit Code | Status | Notes                                                                                                  |
| :--------------------- | :------------------------------------ | :-------- | :----- | :----------------------------------------------------------------------------------------------------- |
| **Lint**               | `pnpm lint`                           | `0`       | PASS   | 0 errors, 0 warnings                                                                                   |
| **Typecheck**          | `pnpm typecheck`                      | `0`       | PASS   | `tsc --noEmit` clean                                                                                   |
| **Format Check**       | `pnpm format:check`                   | `0`       | PASS   | Prettier verified across all files                                                                     |
| **Unit Tests**         | `pnpm test`                           | `0`       | PASS   | 25 test files, 4,163 tests passed (incl. `tests/prod2-site-url.test.ts`, `tests/error-pages.test.tsx`) |
| **Build**              | `pnpm build`                          | `0`       | PASS   | Next.js 16.4.6 (Turbopack), `NEXT_PUBLIC_E2E` unset                                                    |
| **Check Compiled CSS** | `node scripts/check-compiled-css.mjs` | `0`       | PASS   | 5/5 backdrop-filter rules paired                                                                       |
| **Runtime Hook Check** | `verify_prod_hooks.mjs`               | `0`       | PASS   | 0 `__CONCEPFUL*` hooks on `window`, `GET /nope` = 404                                                  |
| **Reference SHA-256**  | `Get-FileHash -Algorithm SHA256`      | `0`       | PASS   | `6ddd1efdd493a245f2556fa71440d8693f837275fcd4e232de24d527f8e88802`                                     |
| **Line Endings (EOL)** | `git ls-files --eol`                  | `0`       | PASS   | All changed files `lf`                                                                                 |

---

## 3. Raw Acceptance Tables

### A. Dual `<h1>` Pixel-Neutrality Verification (`h1_pixel_diff.json`)

Temporarily applied `<h2 className="title">` in `src/components/configurator/ConfiguratorShell.tsx:120`, rebuilt, ran 3-load noise-floor protocol across `.top`, `.hero`, and `#panel` at `1280` and `390`, then reverted via `git checkout -- src/components/configurator/ConfiguratorShell.tsx`.

| Viewport | Target       | Selector | Total Pixels | Diff Pixels | Noise Before | Noise After | Status |
| :------- | :----------- | :------- | :----------- | :---------- | :----------- | :---------- | :----- |
| `1280`   | `story_top`  | `.top`   | 62,400       | 0           | 0            | 0           | PASS   |
| `1280`   | `story_hero` | `.hero`  | 240,120      | 0           | 0            | 0           | PASS   |
| `1280`   | `app_top`    | `.top`   | 64,896       | 0           | 0            | 0           | PASS   |
| `1280`   | `app_panel`  | `#panel` | 281,600      | 0           | 0            | 0           | PASS   |
| `390`    | `story_top`  | `.top`   | 17,900       | 0           | 0            | 0           | PASS   |
| `390`    | `story_hero` | `.hero`  | 150,002      | 0           | 0            | 0           | PASS   |
| `390`    | `app_top`    | `.top`   | 38,664       | 0           | 0            | 0           | PASS   |
| `390`    | `app_panel`  | `#panel` | 156,000      | 0           | 0            | 0           | PASS   |

### B. Click-Parity Harness with Negative Control (`click_parity_results.json`)

| Check                | Suite / Viewport                        | Steps | Properties / Step | Mismatches | Status |
| :------------------- | :-------------------------------------- | :---- | :---------------- | :--------- | :----- |
| **Parity Run**       | Squad + Solo (`1280x800`, `390x800`)    | 38    | 14                | 0          | PASS   |
| **Negative Control** | `1280x800` (`#pr` mutated to `$99,999`) | 1     | 14                | 1 detected | PASS   |

### C. Evidence Artifacts (Scratch: `C:\Users\steve\concepful_scratch\lane_prod2\`)

| File                           | Size (bytes) | SHA-256                                                            |
| :----------------------------- | :----------- | :----------------------------------------------------------------- |
| `click_parity.mjs`             | 9,985        | `12c54477bc9210a8febbb6fceaa8e5dad5c2f60859f0f6d1ed126d3ad7b457aa` |
| `format_a11y_audit.mjs`        | 5,382        | `016e108bb9746a698162585237fd369d31fc3b9229bfb0ab5396c879d91fbcaa` |
| `pixel_check_h1.mjs`           | 9,815        | `981cf44ab440b1f412973d5523aacb2d3def41757661865cc13d18a0eb891097` |
| `run_a11y_audit.mjs`           | 13,648       | `d0023ac905acb2d222c8835f01fd317aebb4569055acd26037c1884d9b100311` |
| `verify_prod_hooks.mjs`        | 2,880        | `8b562316cf6740476d0b5c14f2622140a1547223a9e6fd66f86ea82ba46f0def` |
| `verify_site_url_modes.mjs`    | 3,151        | `ab8be39c167d5e38133e05ef68c0facdb2bde4a98be747d0341338372fd0fde6` |
| `a11y_audit_measurements.json` | 247,205      | `9213e13640b2fb3325c2818ed4b6efd815d9864d22c0e095e696e9847bc76df5` |
| `click_parity_results.json`    | 85,703       | `f74267be9de16a56b2a1fcf5bc05b8d4723e1fa1fb046b70461152a91`        |
| `h1_pixel_diff.json`           | 1,969        | `d6f1a848cbcf6d11880a0b66d2c025c53d3250a22ba61f992db686fb81289f4d` |
| `prod_hooks_check.json`        | 93           | `ad74e04bceca2a80a8aed5228c2a81295870062e562f6985e7f1c08dba80af05` |
| `mode_set_responses.txt`       | 2,962        | `809a868ff8e9b02fd39c236dd76d78e33ef42579bc76d89f4f53dad820509a36` |
| `mode_unset_responses.txt`     | 2,709        | `4b4fad488c78ad76193f13e3f8c009fbc2d6f1ac21a9a354c02ce71fb053070b` |

---

## 4. Open Issues & Requests to Other Lanes

- **Dual `<h1>` on Home Page:** Logged in `docs/lanes/prod2-requests.md` for the Configurator owner to update `<h1 className="title">` to `<h2 className="title">` in `src/components/configurator/ConfiguratorShell.tsx:120`.
- **Text Contrast Failures:** Documented in `docs/lanes/prod-a11y-audit.md` (e.g., `#EE004E` button backgrounds with white text at `4.43:1` and `#EE004E` index numbers at `~3.96:1`–`4.02:1`).

---

## 5. Full Accessibility Audit (`docs/lanes/prod-a11y-audit.md`)

# Accessibility Audit Report (Home Page)

**Audit Date:** 2026-11-26T17:29:55.414Z  
**Target:** Home Page (`/`) on production build (`NEXT_PUBLIC_E2E` unset)  
**Viewports Tested:** `1280x800` and `390x800` (Story Mode `y=0` and App Mode `y=9240`)  
**Method:** Automated Playwright DOM & pixel-median measurements (`run_a11y_audit.mjs`).

---

## 1. Focus Visibility (Playwright `Tab` Traversal)

### 1280x800 — Story Mode (`y=0`)

- **Elements visited:** 12
- **Elements with no visible focus indicator:** 0

| #   | Tag       | ID      | Selector                                                    | Text / Aria-Label                                            | `outline`                      | `box-shadow`                      | Visible Indicator |
| :-- | :-------- | :------ | :---------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------- | :-------------------------------- | :---------------- |
| 1   | `<a>`     | `-`     | `body.font-sans > a.sr-only.focus:not-sr-only`              | SKIP TO MAIN CONTENT                                         | `solid 2px rgb(255, 127, 166)` | `none`                            | PASS              |
| 2   | `<a>`     | `-`     | `header#top > a.logo.glass`                                 | Concepful                                                    | `solid 2px rgb(255, 127, 166)` | `none`                            | PASS              |
| 3   | `<a>`     | `-`     | `header#top > nav.navl.glass > a`                           | Classes                                                      | `solid 2px rgb(255, 127, 166)` | `none`                            | PASS              |
| 4   | `<a>`     | `-`     | `header#top > nav.navl.glass > a`                           | How it works                                                 | `solid 2px rgb(255, 127, 166)` | `none`                            | PASS              |
| 5   | `<a>`     | `-`     | `header#top > nav.navl.glass > a`                           | Plans                                                        | `solid 2px rgb(255, 127, 166)` | `none`                            | PASS              |
| 6   | `<a>`     | `-`     | `header#top > nav.navl.glass > a.fu`                        | START YOUR BUILD                                             | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px` | PASS              |
| 7   | `<aside>` | `panel` | `aside#panel`                                               | Server: Concepful · Creative Department as a ServiceAssemble | `solid 2px rgb(255, 127, 166)` | `none`                            | PASS              |
| 8   | `<a>`     | `-`     | `section#intro > div.in > div.sc.hero > div.ctas > a.fu`    | START YOUR BUILD                                             | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px` | PASS              |
| 9   | `<a>`     | `-`     | `section#intro > div.in > div.sc.hero > div.ctas > a.ghost` | See how it works                                             | `solid 2px rgb(255, 127, 166)` | `none`                            | PASS              |
| 10  | `<a>`     | `-`     | `section#plans > div.in > div.sc > div.ctas > a.fu`         | BUILD YOURS                                                  | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px` | PASS              |
| 11  | `<a>`     | `-`     | `section#outro > div.in > div.sc.hero > div.ctas > a.fu`    | CHOOSE YOUR PLAN                                             | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px` | PASS              |
| 12  | `<a>`     | `-`     | `section#outro > div.in > div.sc.hero > div.ctas > a.ghost` | Compare plans                                                | `solid 2px rgb(255, 127, 166)` | `none`                            | PASS              |

### 1280x800 — App Mode (`y=9240`)

- **Elements visited:** 27
- **Elements with no visible focus indicator:** 0

| #   | Tag        | ID  | Selector                                                    | Text / Aria-Label                                            | `outline`                      | `box-shadow`                            | Visible Indicator |
| :-- | :--------- | :-- | :---------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------- | :-------------------------------------- | :---------------- |
| 1   | `<a>`      | `-` | `body.font-sans.app > a.sr-only.focus:not-sr-only`          | SKIP TO MAIN CONTENT                                         | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 2   | `<a>`      | `-` | `header#top > a.logo.glass`                                 | Concepful                                                    | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 3   | `<button>` | `-` | `div#seg > button.on`                                       | Mission SOLO · PROJECT                                       | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 4   | `<button>` | `-` | `div#seg > button`                                          | Full Crew PARTY · ENGAGEMENT                                 | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 5   | `<button>` | `-` | `div#seg > button`                                          | Full Force RAID · DEPARTMENT                                 | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 6   | `<button>` | `-` | `header#top > div.tr.glass > button.fu`                     | START MISSION                                                | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px`       | PASS              |
| 7   | `<button>` | `-` | `div#tiers > button.tier.on`                                | MISSIONSOLO · PROJECT $4,000 One mission, one hero. Fixed fe | `solid 2px rgb(255, 127, 166)` | `rgb(238, 0, 78) 0px 0px 0px 1px inset` | PASS              |
| 8   | `<button>` | `-` | `div#tiers > button.tier.mini`                              | MOST POPULAR FULL CREW from $7,200/mo                        | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 9   | `<button>` | `-` | `div#tiers > button.tier.mini`                              | FULL FORCE from $9,500/mo                                    | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 10  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt.on`     | Brand identity Logo, system, guidelines. SUMMONS · LASER DOL | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 11  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt`        | Website or landing page Site, landing page, dashboard or doc | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 12  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt`        | UI/UX & product design Flows, screens, clickable prototype.  | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 13  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt`        | Pitch or sales deck Investor, sales or keynote deck. SUMMONS | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 14  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt`        | Campaign & copy Messaging, headlines, campaign copy. SUMMONS | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 15  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt`        | Motion piece Animation, reel or launch video. SUMMONS · REEL | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 16  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt`        | 3D visualization Models, renders, product visuals. SUMMONS · | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 17  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt`        | Prototype & fabrication 3D-printed prototype or physical moc | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 18  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt`        | AI workflow setup One workflow, built and handed off. SUMMON | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 19  | `<button>` | `-` | `div#groups > div.grp > div.opts > button.opt`              | Custom skin Custom illustration set. ADDS · PAINT JOB +$1,50 | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 20  | `<button>` | `-` | `div#groups > div.grp > div.opts > button.opt`              | Companion pet A short animated cut of the work. ADDS · CAMER | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 21  | `<button>` | `-` | `div#groups > div.grp > div.opts > button.opt`              | Haste Priority rush, 12-hour turnaround. ADDS · AFTERBURNERS | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 22  | `<button>` | `-` | `section#st-load > button.fu.wide`                          | START MISSION                                                | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px`       | PASS              |
| 23  | `<a>`      | `-` | `section#intro > div.in > div.sc.hero > div.ctas > a.fu`    | START YOUR BUILD                                             | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px`       | PASS              |
| 24  | `<a>`      | `-` | `section#intro > div.in > div.sc.hero > div.ctas > a.ghost` | See how it works                                             | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 25  | `<a>`      | `-` | `section#plans > div.in > div.sc > div.ctas > a.fu`         | BUILD YOURS                                                  | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px`       | PASS              |
| 26  | `<a>`      | `-` | `section#outro > div.in > div.sc.hero > div.ctas > a.fu`    | CHOOSE YOUR PLAN                                             | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px`       | PASS              |
| 27  | `<a>`      | `-` | `section#outro > div.in > div.sc.hero > div.ctas > a.ghost` | Compare plans                                                | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |

### 390x800 — Story Mode (`y=0`)

- **Elements visited:** 9
- **Elements with no visible focus indicator:** 0

| #   | Tag       | ID      | Selector                                                    | Text / Aria-Label                                            | `outline`                      | `box-shadow`                      | Visible Indicator |
| :-- | :-------- | :------ | :---------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------- | :-------------------------------- | :---------------- |
| 1   | `<a>`     | `-`     | `body.font-sans > a.sr-only.focus:not-sr-only`              | SKIP TO MAIN CONTENT                                         | `solid 2px rgb(255, 127, 166)` | `none`                            | PASS              |
| 2   | `<a>`     | `-`     | `header#top > a.logo.glass`                                 | Concepful                                                    | `solid 2px rgb(255, 127, 166)` | `none`                            | PASS              |
| 3   | `<a>`     | `-`     | `header#top > nav.navl.glass > a.fu`                        | START YOUR BUILD                                             | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px` | PASS              |
| 4   | `<aside>` | `panel` | `aside#panel`                                               | Server: Concepful · Creative Department as a ServiceAssemble | `solid 2px rgb(255, 127, 166)` | `none`                            | PASS              |
| 5   | `<a>`     | `-`     | `section#intro > div.in > div.sc.hero > div.ctas > a.fu`    | START YOUR BUILD                                             | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px` | PASS              |
| 6   | `<a>`     | `-`     | `section#intro > div.in > div.sc.hero > div.ctas > a.ghost` | See how it works                                             | `solid 2px rgb(255, 127, 166)` | `none`                            | PASS              |
| 7   | `<a>`     | `-`     | `section#plans > div.in > div.sc > div.ctas > a.fu`         | BUILD YOURS                                                  | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px` | PASS              |
| 8   | `<a>`     | `-`     | `section#outro > div.in > div.sc.hero > div.ctas > a.fu`    | CHOOSE YOUR PLAN                                             | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px` | PASS              |
| 9   | `<a>`     | `-`     | `section#outro > div.in > div.sc.hero > div.ctas > a.ghost` | Compare plans                                                | `solid 2px rgb(255, 127, 166)` | `none`                            | PASS              |

### 390x800 — App Mode (`y=9240`)

- **Elements visited:** 26
- **Elements with no visible focus indicator:** 0

| #   | Tag        | ID  | Selector                                                    | Text / Aria-Label                                            | `outline`                      | `box-shadow`                            | Visible Indicator |
| :-- | :--------- | :-- | :---------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------- | :-------------------------------------- | :---------------- |
| 1   | `<a>`      | `-` | `body.font-sans.app > a.sr-only.focus:not-sr-only`          | SKIP TO MAIN CONTENT                                         | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 2   | `<a>`      | `-` | `header#top > a.logo.glass`                                 | Concepful                                                    | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 3   | `<button>` | `-` | `div#seg > button.on`                                       | Mission SOLO · PROJECT                                       | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 4   | `<button>` | `-` | `div#seg > button`                                          | Full Crew PARTY · ENGAGEMENT                                 | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 5   | `<button>` | `-` | `div#seg > button`                                          | Full Force RAID · DEPARTMENT                                 | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 6   | `<button>` | `-` | `div#tiers > button.tier.on`                                | MISSIONSOLO · PROJECT $4,000 One mission, one hero. Fixed fe | `solid 2px rgb(255, 127, 166)` | `rgb(238, 0, 78) 0px 0px 0px 1px inset` | PASS              |
| 7   | `<button>` | `-` | `div#tiers > button.tier.mini`                              | MOST POPULAR FULL CREW from $7,200/mo                        | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 8   | `<button>` | `-` | `div#tiers > button.tier.mini`                              | FULL FORCE from $9,500/mo                                    | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 9   | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt.on`     | Brand identity Logo, system, guidelines. SUMMONS · LASER DOL | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 10  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt`        | Website or landing page Site, landing page, dashboard or doc | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 11  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt`        | UI/UX & product design Flows, screens, clickable prototype.  | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 12  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt`        | Pitch or sales deck Investor, sales or keynote deck. SUMMONS | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 13  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt`        | Campaign & copy Messaging, headlines, campaign copy. SUMMONS | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 14  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt`        | Motion piece Animation, reel or launch video. SUMMONS · REEL | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 15  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt`        | 3D visualization Models, renders, product visuals. SUMMONS · | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 16  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt`        | Prototype & fabrication 3D-printed prototype or physical moc | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 17  | `<button>` | `-` | `div#groups > div.grp > div.opts.radio > button.opt`        | AI workflow setup One workflow, built and handed off. SUMMON | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 18  | `<button>` | `-` | `div#groups > div.grp > div.opts > button.opt`              | Custom skin Custom illustration set. ADDS · PAINT JOB +$1,50 | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 19  | `<button>` | `-` | `div#groups > div.grp > div.opts > button.opt`              | Companion pet A short animated cut of the work. ADDS · CAMER | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 20  | `<button>` | `-` | `div#groups > div.grp > div.opts > button.opt`              | Haste Priority rush, 12-hour turnaround. ADDS · AFTERBURNERS | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 21  | `<button>` | `-` | `section#st-load > button.fu.wide`                          | START MISSION                                                | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px`       | PASS              |
| 22  | `<a>`      | `-` | `section#intro > div.in > div.sc.hero > div.ctas > a.fu`    | START YOUR BUILD                                             | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px`       | PASS              |
| 23  | `<a>`      | `-` | `section#intro > div.in > div.sc.hero > div.ctas > a.ghost` | See how it works                                             | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |
| 24  | `<a>`      | `-` | `section#plans > div.in > div.sc > div.ctas > a.fu`         | BUILD YOURS                                                  | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px`       | PASS              |
| 25  | `<a>`      | `-` | `section#outro > div.in > div.sc.hero > div.ctas > a.fu`    | CHOOSE YOUR PLAN                                             | `solid 2px rgb(255, 127, 166)` | `rgb(143, 0, 48) 0px 3px 0px 0px`       | PASS              |
| 26  | `<a>`      | `-` | `section#outro > div.in > div.sc.hero > div.ctas > a.ghost` | Compare plans                                                | `solid 2px rgb(255, 127, 166)` | `none`                                  | PASS              |

---

## 2. Text Contrast (Transparent-Text Screenshot Median Background)

All text was made transparent (`color: transparent !important`), each text node's bounding box was screenshotted against the composited page (including WebGL `#gl` and backdrop-filter), the median RGB of the box pixels was computed, and WCAG 2.1 contrast ratio was calculated against the node's real computed `color`. Failures are `< 4.5:1` (`< 3.0:1` for large text: `>= 24px` or `>= 18.66px` bold).

### 1280x800 — Story Mode (`y=0`)

- **Visible text nodes measured:** 81
- **Contrast failures:** 4

| Tag   | ID  | Class | Text             | Font       | Real Color           | Median Bg         | Ratio      | Threshold | Status |
| :---- | :-- | :---- | :--------------- | :--------- | :------------------- | :---------------- | :--------- | :-------- | :----- |
| `<a>` | `-` | `fu`  | Start your build | 13px / 600 | `rgb(255, 255, 255)` | `rgb(238, 0, 78)` | **4.43:1** | 4.5:1     | FAIL   |
| `<a>` | `-` | `fu`  | Start your build | 14px / 400 | `rgb(255, 255, 255)` | `rgb(238, 0, 78)` | **4.43:1** | 4.5:1     | FAIL   |
| `<a>` | `-` | `fu`  | Build yours      | 14px / 400 | `rgb(255, 255, 255)` | `rgb(238, 0, 78)` | **4.43:1** | 4.5:1     | FAIL   |
| `<a>` | `-` | `fu`  | Choose your plan | 14px / 400 | `rgb(255, 255, 255)` | `rgb(238, 0, 78)` | **4.43:1** | 4.5:1     | FAIL   |

### 1280x800 — App Mode (`y=9240`)

- **Visible text nodes measured:** 188
- **Contrast failures:** 21

| Tag      | ID  | Class   | Text                                             | Font         | Real Color           | Median Bg         | Ratio      | Threshold | Status |
| :------- | :-- | :------ | :----------------------------------------------- | :----------- | :------------------- | :---------------- | :--------- | :-------- | :----- |
| `<span>` | `-` | `n`     | 01                                               | 11px / 700   | `rgb(238, 0, 78)`    | `rgb(20, 21, 41)` | **4.06:1** | 4.5:1     | FAIL   |
| `<span>` | `-` | `badge` | Most popular                                     | 9.5px / 400  | `rgb(26, 18, 6)`     | `rgb(21, 22, 44)` | **1.04:1** | 4.5:1     | FAIL   |
| `<span>` | `-` | `n`     | 02                                               | 11px / 700   | `rgb(238, 0, 78)`    | `rgb(20, 21, 41)` | **4.06:1** | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Grid Manta                                       | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(23, 25, 45)` | **3.9:1**  | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Pixel Owl                                        | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(20, 22, 42)` | **4.01:1** | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Pitch Hawk                                       | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(20, 22, 42)` | **4.01:1** | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Broadcast Jelly                                  | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(20, 22, 42)` | **4.01:1** | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Reel Dragonfly                                   | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(20, 22, 42)` | **4.01:1** | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Prism Turtle                                     | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(20, 22, 42)` | **4.01:1** | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Forge Beetle                                     | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(20, 22, 42)` | **4.01:1** | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Quad Drone                                       | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(20, 22, 42)` | **4.01:1** | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Paint job                                        | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(24, 26, 46)` | **3.86:1** | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Camera drone follows                             | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(20, 22, 42)` | **4.01:1** | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Afterburners                                     | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(20, 22, 42)` | **4.01:1** | 4.5:1     | FAIL   |
| `<span>` | `-` | `n`     | 03                                               | 11px / 700   | `rgb(238, 0, 78)`    | `rgb(20, 21, 42)` | **4.05:1** | 4.5:1     | FAIL   |
| `<span>` | `-` | `l`     | Mission · Laser Dolphin                          | 12.5px / 400 | `rgb(255, 255, 255)` | `rgb(238, 0, 78)` | **4.43:1** | 4.5:1     | FAIL   |
| `<p>`    | `-` | `fine`  | Prototype: prices illustrative, nothing is sent. | 11.5px / 400 | `rgb(114, 117, 154)` | `rgb(28, 30, 58)` | **3.65:1** | 4.5:1     | FAIL   |
| `<div>`  | `-` | `burst` | up front.                                        | 11px / 400   | `rgb(26, 18, 6)`     | `rgb(28, 31, 59)` | **1.15:1** | 4.5:1     | FAIL   |
| `<a>`    | `-` | `fu`    | Start your build                                 | 14px / 400   | `rgb(255, 255, 255)` | `rgb(238, 0, 78)` | **4.43:1** | 4.5:1     | FAIL   |
| `<a>`    | `-` | `fu`    | Build yours                                      | 14px / 400   | `rgb(255, 255, 255)` | `rgb(238, 0, 78)` | **4.43:1** | 4.5:1     | FAIL   |
| `<a>`    | `-` | `fu`    | Choose your plan                                 | 14px / 400   | `rgb(255, 255, 255)` | `rgb(238, 0, 78)` | **4.43:1** | 4.5:1     | FAIL   |

### 390x800 — Story Mode (`y=0`)

- **Visible text nodes measured:** 65
- **Contrast failures:** 8

| Tag   | ID  | Class | Text             | Font       | Real Color           | Median Bg         | Ratio      | Threshold | Status |
| :---- | :-- | :---- | :--------------- | :--------- | :------------------- | :---------------- | :--------- | :-------- | :----- |
| `<a>` | `-` | `fu`  | Start your build | 13px / 600 | `rgb(255, 255, 255)` | `rgb(238, 0, 78)` | **4.43:1** | 4.5:1     | FAIL   |
| `<a>` | `-` | `fu`  | Start your build | 14px / 400 | `rgb(255, 255, 255)` | `rgb(238, 0, 78)` | **4.43:1** | 4.5:1     | FAIL   |
| `<i>` | `-` | `-`   | 01               | 18px / 400 | `rgb(238, 0, 78)`    | `rgb(29, 23, 47)` | **3.9:1**  | 4.5:1     | FAIL   |
| `<i>` | `-` | `-`   | 02               | 18px / 400 | `rgb(238, 0, 78)`    | `rgb(21, 22, 42)` | **4.02:1** | 4.5:1     | FAIL   |
| `<i>` | `-` | `-`   | 03               | 18px / 400 | `rgb(238, 0, 78)`    | `rgb(21, 24, 44)` | **3.96:1** | 4.5:1     | FAIL   |
| `<i>` | `-` | `-`   | 04               | 18px / 400 | `rgb(238, 0, 78)`    | `rgb(21, 24, 44)` | **3.96:1** | 4.5:1     | FAIL   |
| `<a>` | `-` | `fu`  | Build yours      | 14px / 400 | `rgb(255, 255, 255)` | `rgb(238, 0, 78)` | **4.43:1** | 4.5:1     | FAIL   |
| `<a>` | `-` | `fu`  | Choose your plan | 14px / 400 | `rgb(255, 255, 255)` | `rgb(238, 0, 78)` | **4.43:1** | 4.5:1     | FAIL   |

### 390x800 — App Mode (`y=9240`)

- **Visible text nodes measured:** 156
- **Contrast failures:** 23

| Tag      | ID  | Class   | Text                                             | Font         | Real Color           | Median Bg         | Ratio      | Threshold | Status |
| :------- | :-- | :------ | :----------------------------------------------- | :----------- | :------------------- | :---------------- | :--------- | :-------- | :----- |
| `<span>` | `-` | `n`     | 01                                               | 11px / 700   | `rgb(238, 0, 78)`    | `rgb(21, 22, 43)` | **4.02:1** | 4.5:1     | FAIL   |
| `<span>` | `-` | `badge` | Most popular                                     | 9.5px / 400  | `rgb(26, 18, 6)`     | `rgb(21, 22, 43)` | **1.04:1** | 4.5:1     | FAIL   |
| `<span>` | `-` | `n`     | 02                                               | 11px / 700   | `rgb(238, 0, 78)`    | `rgb(21, 22, 43)` | **4.02:1** | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Grid Manta                                       | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(21, 22, 44)` | **4:1**    | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Pixel Owl                                        | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(21, 22, 44)` | **4:1**    | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Pitch Hawk                                       | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(21, 22, 44)` | **4:1**    | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Broadcast Jelly                                  | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(21, 22, 44)` | **4:1**    | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Reel Dragonfly                                   | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(21, 22, 44)` | **4:1**    | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Prism Turtle                                     | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(21, 22, 44)` | **4:1**    | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Forge Beetle                                     | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(21, 22, 44)` | **4:1**    | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Quad Drone                                       | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(21, 22, 44)` | **4:1**    | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Paint job                                        | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(21, 22, 44)` | **4:1**    | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Camera drone follows                             | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(21, 22, 44)` | **4:1**    | 4.5:1     | FAIL   |
| `<em>`   | `-` | `-`     | Afterburners                                     | 9.5px / 400  | `rgb(114, 117, 154)` | `rgb(21, 22, 44)` | **4:1**    | 4.5:1     | FAIL   |
| `<span>` | `-` | `n`     | 03                                               | 11px / 700   | `rgb(238, 0, 78)`    | `rgb(21, 22, 43)` | **4.02:1** | 4.5:1     | FAIL   |
| `<p>`    | `-` | `fine`  | Prototype: prices illustrative, nothing is sent. | 11.5px / 400 | `rgb(114, 117, 154)` | `rgb(26, 27, 53)` | **3.77:1** | 4.5:1     | FAIL   |
| `<a>`    | `-` | `fu`    | Start your build                                 | 14px / 400   | `rgb(255, 255, 255)` | `rgb(238, 0, 78)` | **4.43:1** | 4.5:1     | FAIL   |
| `<i>`    | `-` | `-`     | 01                                               | 18px / 400   | `rgb(238, 0, 78)`    | `rgb(23, 24, 48)` | **3.92:1** | 4.5:1     | FAIL   |
| `<i>`    | `-` | `-`     | 02                                               | 18px / 400   | `rgb(238, 0, 78)`    | `rgb(21, 23, 44)` | **3.99:1** | 4.5:1     | FAIL   |
| `<i>`    | `-` | `-`     | 03                                               | 18px / 400   | `rgb(238, 0, 78)`    | `rgb(21, 24, 44)` | **3.96:1** | 4.5:1     | FAIL   |
| `<i>`    | `-` | `-`     | 04                                               | 18px / 400   | `rgb(238, 0, 78)`    | `rgb(21, 24, 44)` | **3.96:1** | 4.5:1     | FAIL   |
| `<a>`    | `-` | `fu`    | Build yours                                      | 14px / 400   | `rgb(255, 255, 255)` | `rgb(238, 0, 78)` | **4.43:1** | 4.5:1     | FAIL   |
| `<a>`    | `-` | `fu`    | Choose your plan                                 | 14px / 400   | `rgb(255, 255, 255)` | `rgb(238, 0, 78)` | **4.43:1** | 4.5:1     | FAIL   |

---

## 3. Reduced Motion (`prefers-reduced-motion`)

### 1280x800 — `document.getAnimations()`

- **`reducedMotion: 'no-preference'` (1 animations):**
  - `swap` on `div#groups` (playState: `finished`)
- **`reducedMotion: 'reduce'` (0 animations):**
  - _(none)_

### 390x800 — `document.getAnimations()`

- **`reducedMotion: 'no-preference'` (1 animations):**
  - `swap` on `div#groups` (playState: `finished`)
- **`reducedMotion: 'reduce'` (0 animations):**
  - _(none)_

### Stylesheet `@media (prefers-reduced-motion)` Rules (6 rules)

```css
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}
@media (prefers-reduced-motion: reduce) {
  #gl {
    transition: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .fu,
  .navl a.fu {
    transition: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  #groups.swap {
    animation-duration: auto;
    animation-timing-function: ease;
    animation-delay: 0s;
    animation-iteration-count: 1;
    animation-direction: normal;
    animation-fill-mode: none;
    animation-play-state: running;
    animation-name: none;
    animation-range: normal;
    animation-timeline: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .fu,
  .tier,
  .opt {
    transition: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  #st-ship.swap,
  #st-buffs.swap {
    animation: auto ease 0s 1 normal none running none;
  }
}
```

### Source Hits for `prefers-reduced-motion` (`src/`)

```text
src/components/configurator/ConfiguratorShell.tsx:48:        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
src/engine/createEngine.ts:111:  // Reference line 2646: const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
src/engine/createEngine.ts:114:      ? window.matchMedia("(prefers-reduced-motion: reduce)")
src/engine/createEngine.ts:395:    // Respect prefers-reduced-motion:
src/engine/models/uUnits.ts:1841:          ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
src/engine/world/BackgroundManager.ts:177:      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
src/styles/base.css:15:@media (prefers-reduced-motion: no-preference) {
src/styles/configurator-shell.css:26:@media (prefers-reduced-motion: reduce) {
src/styles/configurator.css:444:@media (prefers-reduced-motion: reduce) {
src/styles/configurator.css:1233:@media (prefers-reduced-motion: reduce) {
src/styles/header.css:158:@media (prefers-reduced-motion: reduce) {
src/styles/scene.css:29:@media (prefers-reduced-motion: reduce) {
```

### Source Hits for `matchMedia` (`src/`)

```text
src/components/configurator/ConfiguratorShell.tsx:48:        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
src/engine/createEngine.ts:111:  // Reference line 2646: const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
src/engine/createEngine.ts:113:    typeof window !== "undefined" && window.matchMedia
src/engine/createEngine.ts:114:      ? window.matchMedia("(prefers-reduced-motion: reduce)")
src/engine/models/uUnits.ts:1840:        (typeof window !== "undefined" && window.matchMedia
src/engine/models/uUnits.ts:1841:          ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
src/engine/world/BackgroundManager.ts:176:      window.matchMedia &&
src/engine/world/BackgroundManager.ts:177:      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
```

---

## 6. What Could Not Be Verified

- Live external domain DNS resolution and search engine crawler indexing on a public host (verified locally against `http://127.0.0.1:3102` for both `NEXT_PUBLIC_SITE_URL` unset and `https://example.org`).
- Physical screen reader audio output (NVDA / VoiceOver / JAWS); focus, contrast, and reduced-motion were verified via Playwright DOM and pixel measurements.
