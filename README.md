# Concepful Mech Builder

A production Next.js rebuild of the **Concepful Mech Builder** prototype. Concepful is a scroll-driven story and interactive pricing configurator featuring a low-poly toon-shaded mecha aesthetic: bone armor, navy ink (`#141624`), hot red-magenta (`#EE004E`), and slate sky.

The original standalone prototype is archived for reference in `/reference/Concepful_Mech_Builder.html`.

## Prerequisites

- **Node.js**: `v20.x` or `v22.x` (tested on Node `v22.15.0`)
- **Package Manager**: [pnpm](https://pnpm.io/) (`v11.x`+)

## Installation

```bash
pnpm install
```

## Running the Application

### Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
pnpm build
pnpm start
```

## Available Scripts

| Command             | Description                                                             |
| ------------------- | ----------------------------------------------------------------------- |
| `pnpm dev`          | Starts the Next.js development server at `http://localhost:3000`        |
| `pnpm build`        | Builds the application for production                                   |
| `pnpm start`        | Runs the production-built application                                   |
| `pnpm lint`         | Runs ESLint to check code quality and rules                             |
| `pnpm typecheck`    | Runs TypeScript compiler checks without emitting files (`tsc --noEmit`) |
| `pnpm format`       | Formats the codebase using Prettier                                     |
| `pnpm format:check` | Verifies code formatting against Prettier rules                         |
