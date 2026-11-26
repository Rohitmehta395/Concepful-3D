# Concepful Mech Builder

A production Next.js rebuild of the **Concepful Mech Builder** prototype. Concepful is a scroll-driven story and interactive pricing configurator featuring a late-90s cel-shaded mecha MMO launcher aesthetic: bone armor, navy ink (`#141624`), hot red-magenta (`#EE004E`), dark glass HUD overlays, and flat slate skies.

---

## 1. Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) `16.4.3` (App Router, Turbopack)
- **UI & Runtime:** [React](https://react.dev/) `19.3.0` & React DOM `19.3.0`
- **3D Graphics:** [Three.js](https://threejs.org/) `0.128.0` (pinned for exact mathematical and shader parity)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) `v4` with CSS design tokens (`src/styles/tokens.css`)
- **Typography:** `next/font/google` loading Russo One, Inter, and JetBrains Mono
- **Testing & Verification:** [Playwright](https://playwright.dev/) `1.64.1` & [Vitest](https://vitest.dev/) `3.2.7`
- **Language & Tooling:** TypeScript `5.9.3` (strict mode), ESLint `9.x`, Prettier `3.9.x`, pnpm `11.9.x`

---

## 2. Visual Source of Truth

- **Original Standalone HTML:** Archived for reference at [`reference/Concepful_Mech_Builder.html`](file:///d:/Projects/Pete/Concepful-3D/reference/Concepful_Mech_Builder.html) (SHA-256: `6DDD1EFDD493A245F2556FA71440D8693F837275FCD4E232DE24D527F8E88802`).
- **Baseline Capture Archive:** 36 high-resolution reference screenshots across four standard viewports (`390px`, `768px`, `1280px`, `1920px`) located in [`reference/baseline/`](file:///d:/Projects/Pete/Concepful-3D/reference/baseline/).

---

## 3. Available Scripts

All scripts in `package.json`:

| Command             | Action                                                                    |
| :------------------ | :------------------------------------------------------------------------ |
| `pnpm dev`          | Starts the Next.js development server at `http://localhost:3000`          |
| `pnpm build`        | Compiles the production build with Turbopack                              |
| `pnpm start`        | Runs the production-built application server                              |
| `pnpm lint`         | Runs ESLint to verify code quality and Next.js rules                      |
| `pnpm typecheck`    | Executes TypeScript type-checking without emitting files (`tsc --noEmit`) |
| `pnpm format`       | Formats all source files and markdown documents with Prettier             |
| `pnpm format:check` | Verifies formatting compliance against Prettier rules                     |
| `pnpm test`         | Runs unit and integration tests with Vitest                               |

---

## 4. Environment Variables & E2E Build Flag

Configuration options supported across development, test, and production:

| Variable               | Description                                                                                                                                                                                                                                                                                 | Default          |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :--------------- |
| `NEXT_PUBLIC_SITE_URL` | Optional canonical site base URL. **When set:** populates `metadataBase`, `<link rel="canonical">`, `Allow: /` + `Sitemap:` in `/robots.txt`, and the `/` entry in `/sitemap.xml`. **When unset:** omits canonical, sets `Disallow: /` in `/robots.txt`, and emits an empty `/sitemap.xml`. | _(unset / none)_ |
| `NEXT_PUBLIC_E2E`      | Test hook gate flag. When set to `"1"`, diagnostic runtime hooks (`__CONCEPFUL*`) are mounted on `window` for automation harnesses. In production builds (`NEXT_PUBLIC_E2E="0"` or unset), all hooks are omitted.                                                                           | `0`              |

---

## 5. Harness Overview

The project relies on multiple automated test and verification harnesses to ensure strict parity against the reference prototype:

1. **Click Parity Harness (`click_parity_harness.mjs`):**
   - Drives interactive sequences across Solo and Squad configurator tiers on both desktop (`1280x800`) and mobile (`390x800`).
   - Extracts 14 DOM state properties per step (price labels, cycle rate, encounter header, selected objectives/extras, card items, stats, motto, and active controls).
   - Validates 0 mismatches against `reference/Concepful_Mech_Builder.html`.

2. **Pixel Protocol Harness (`measure_protocol.mjs`):**
   - Headless Playwright capture protocol executing settling loops (100ms screenshots until consecutive identical frames) under auto-scroll and disabled canvas backgrounds (`#gl`, `#cv`, `#patch`).
   - Evaluates `.top`, `.hero`, and `#card` across viewports.

3. **Golden Snapshot Differential Suite (`tests/differential.test.ts`):**
   - Automated Vitest snapshot regression test suite comparing DOM state representations across tiers against pre-generated reference fixtures (`tests/fixtures/reference-states.json`).

4. **Compiled CSS Token Guard (`scripts/check-compiled-css.mjs`):**
   - Verifies the compiled CSS artifact contains zero unresolved CSS custom properties or illegal overrides.

---

## 6. Known Residuals

Documented differences from baseline measurements (Parts 4.28–4.30):

1. **Sub-pixel Font Rasterization:**
   - Chrome headless font antialiasing differences between native inline SVG/DOM text and canvas rendering account for small sub-pixel border smoothing deltas on high-DPI displays.
2. **Mobile Configurator Card Visibility:**
   - At mobile breakpoints (`<= 1023px`, e.g. `390px`), the right-hand `#card` is styled with `display: none` per original prototype CSS rules (lines 1449–1449). Configurator telemetry is instead surfaced via the mobile summary overlay (`.mcard`).

---

## 7. Getting Started

### Installation

```bash
pnpm install --frozen-lockfile
```

### Running the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Launch

```bash
pnpm build
pnpm start
```

For detailed deployment instructions, see [`docs/deploy.md`](file:///d:/Projects/Pete/lanes/prod/docs/deploy.md).
