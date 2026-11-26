# Cross-Lane Requests from Lane PROD2

## 1. Request to Configurator Lane: Single `<h1>` on Home Page (Pixel-Neutral Fix)

- **Issue:** The home page renders two `<h1>` elements:
  1. `src/components/story/Hero.tsx:22` — selector path: `main#main > section#intro > div.in > div.sc.hero > h1#hero-heading.big` (`YOUR CREATIVE DEPARTMENT, ON DEMAND.`)
  2. `src/components/configurator/ConfiguratorShell.tsx:120` — selector path: `div#boxart.boxart > div > h1.title` (`Assemble your creative department.`)
- **CSS Selector Audit:**
  - `src/styles/base.css:44` and `src/styles/configurator.css:97` both use `h1, h2, h3 { margin: 0; text-wrap: balance; }`.
  - No CSS selector targets `h1` uniquely without also targeting `h2`.
  - `src/engine/world/materials.ts:160` uses `document.querySelector(".mid, h1, h2")`, which matches `h2` identically.
- **Exact Pixel-Neutral Change in `src/components/configurator/ConfiguratorShell.tsx` (lines 120–124):**

```tsx
// Before:
          <h1 className="title">
            Assemble your
            <br />
            <span>creative</span> department.
          </h1>

// After:
          <h2 className="title">
            Assemble your
            <br />
            <span>creative</span> department.
          </h2>
```

- **Local Pixel-Neutrality Verification (`pixel_check_h1.mjs`, 3-load noise-floor protocol, reverted via `git checkout -- src/components/configurator/ConfiguratorShell.tsx`):**

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
