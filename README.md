# Concepful Mech Builder

A production Next.js rebuild of the **Concepful Mech Builder** prototype. Concepful is a scroll-driven story and interactive pricing configurator featuring a late-90s cel-shaded mecha MMO launcher aesthetic: bone armor, navy ink (`#141624`), hot red-magenta (`#EE004E`), dark glass HUD overlays, and flat slate skies.

---

## 1. Visual Source of Truth

- **Original Standalone HTML:** Archived for reference at [`reference/Concepful_Mech_Builder.html`](file:///d:/Projects/Pete/Concepful-3D/reference/Concepful_Mech_Builder.html) (SHA-256: `6DDD1EFDD493A245F2556FA71440D8693F837275FCD4E232DE24D527F8E88802`).
- **Baseline Capture Archive:** 36 high-resolution reference screenshots across four standard viewports (`390px`, `768px`, `1280px`, `1920px`) located in [`reference/baseline/`](file:///d:/Projects/Pete/Concepful-3D/reference/baseline/).

---

## 2. Project Status: Phase 1 Completed

The project is being developed across 10 structured phases:

- [x] **Part 1.1:** Project Foundation (Next.js, TypeScript strict, Tailwind v4, ESLint, Prettier) — _Approved_
- [x] **Part 1.2:** Reference Baseline Capture (36 Playwright screenshots across 4 viewports) — _Approved_
- [x] **Part 1.3:** Design Tokens Extraction (`src/styles/tokens.css`, `docs/design-system.md`) — _Approved_
- [x] **Part 1.4:** Font Integration (`next/font/google` for Russo One, Inter, JetBrains Mono) — _Approved_
- [x] **Part 1.5:** Documentation Skeleton (`docs/` suite and architectural decision records) — _Implemented (Awaiting User Review and Approval)_
- [ ] **Phases 2–10:** Content, Domain, Shell, 3D Engine, Configurator, Optimization, and Production — _Pending Approval_

Detailed tracking is maintained in [`docs/progress.md`](file:///d:/Projects/Pete/Concepful-3D/docs/progress.md).

---

## 3. Documentation Suite

The complete architectural documentation is organized in [`docs/`](file:///d:/Projects/Pete/Concepful-3D/docs/):

- [`docs/requirements.md`](file:///d:/Projects/Pete/Concepful-3D/docs/requirements.md) — Functional, visual, and non-functional requirements and scope boundaries.
- [`docs/architecture.md`](file:///d:/Projects/Pete/Concepful-3D/docs/architecture.md) — Next.js App Router boundaries, decoupled scene engine, and pure domain state.
- [`docs/design-system.md`](file:///d:/Projects/Pete/Concepful-3D/docs/design-system.md) — Design tokens, color cascade resolution, typography stacks, radii, and shadows.
- [`docs/implementation-roadmap.md`](file:///d:/Projects/Pete/Concepful-3D/docs/implementation-roadmap.md) — Phased 10-phase redevelopment breakdown and acceptance criteria.
- [`docs/progress.md`](file:///d:/Projects/Pete/Concepful-3D/docs/progress.md) — Milestone tracking, verification logs, and integrity checksums.
- **Architectural Decision Records (ADRs):**
  - [`docs/decisions/0001-no-r3f.md`](file:///d:/Projects/Pete/Concepful-3D/docs/decisions/0001-no-r3f.md) — Imperative Three.js scene engine instead of React Three Fiber.
  - [`docs/decisions/0002-pin-three-r128.md`](file:///d:/Projects/Pete/Concepful-3D/docs/decisions/0002-pin-three-r128.md) — Pin Three.js r128 initially for visual and mathematical parity.
  - [`docs/decisions/0003-no-animation-library.md`](file:///d:/Projects/Pete/Concepful-3D/docs/decisions/0003-no-animation-library.md) — Omit external animation libraries (GSAP, Motion) in favor of native rAF loop.

---

## 4. Prerequisites

- **Node.js**: `v20.x` or `v22.x` (tested on `v22.15.0`)
- **Package Manager**: [pnpm](https://pnpm.io/) (`v11.x`+)

---

## 5. Getting Started

### Installation

```bash
pnpm install
```

### Running the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
pnpm build
pnpm start
```

---

## 6. Available Scripts

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
