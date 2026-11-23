# Deployment Guide

This document describes deployment architectures, configuration requirements, environment variables, and operation commands for the Concepful Mech Builder Next.js application.

---

## 1. Deployment Architecture Options

### A. Node.js Application Server (Recommended)

Next.js is designed by default to run on a Node.js runtime (`next start`).

- **Capabilities Supported:**
  - Dynamic App Router metadata routes (`/robots.txt`, `/sitemap.xml`).
  - Next.js dynamic routing and server components.
  - Proper HTTP status codes for error boundaries and 404 routes (`/not-found.tsx`).
  - Dynamic request inspection and headers.
- **Requirements:**
  - Node.js runtime (`v20.x` or `v22.x`).
  - Container host or platform (e.g. AWS ECS/App Runner, Google Cloud Run, Vercel, Railway, Fly.io).

### B. Static Output (`output: 'export'`)

If static hosting (e.g., S3 + CloudFront, GitHub Pages, Cloudflare Pages) is required:

- `next.config.ts` must configure `output: 'export'`.
- Running `pnpm build` generates pre-rendered HTML, CSS, and client-side JavaScript assets into the `out/` directory.
- **Trade-offs:**
  - Dynamic Node.js server routes and server-side request headers are unavailable.
  - Custom 404 responses are served as static `out/404.html` via the host web server's routing rules rather than runtime HTTP headers.

---

## 2. Environment Variables

| Variable               | Description                                                                                                                                                               | Default                 | Required in Production                |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :---------------------- | :------------------------------------ |
| `NEXT_PUBLIC_SITE_URL` | Base canonical URL used for canonical link tags, OpenGraph metadata, `robots.txt`, and `sitemap.xml`.                                                                     | `https://concepful.com` | Optional (defaults to production URL) |
| `NEXT_PUBLIC_E2E`      | Test automation flag. When set to `"1"`, internal diagnostic hooks (`__CONCEPFUL*`) are mounted on `window` for test harnesses. Must remain `"0"` or unset in production. | `0`                     | No (leave unset or `0`)               |
| `PORT`                 | Local network port for the Node.js server to bind to.                                                                                                                     | `3000`                  | Optional                              |

---

## 3. Verified Deployment Commands

Every command below has been tested and verified:

### 1. Dependency Installation

```bash
pnpm install --frozen-lockfile
```

### 2. Quality and Type Verification

```bash
# Code quality and style checks
pnpm lint
pnpm typecheck
pnpm format:check
pnpm test
```

### 3. Production Build

```bash
pnpm build
```

Compiles and generates the optimized production bundle with Turbopack.

### 4. Running the Production Server

```bash
# Default port (3000)
pnpm start

# Custom port (e.g. 3102)
pnpm start -- -p 3102
# or directly via Next CLI:
pnpm exec next start -p 3102
```

### 5. Health Check / Smoke Test

Verify the running server responds with HTTP 200:

```bash
curl -I http://localhost:3000/
curl -I http://localhost:3000/robots.txt
curl -I http://localhost:3000/sitemap.xml
curl -I http://localhost:3000/nope # Returns 404 with custom not-found page
```
