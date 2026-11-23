# Cross-Lane Requests from Lane PROD

## 1. Request to Configurator Lane: Single `<h1>` on Home Page

- **Target File:** `src/components/configurator/ConfiguratorShell.tsx` (line 512)
- **Issue:** The built home page contains two `<h1>` elements:
  1. Primary story hero heading: `<h1 id="hero-heading" className="big">` in `src/components/story/Hero.tsx`
  2. Boxart branding heading: `<h1 className="title">` in `src/components/configurator/ConfiguratorShell.tsx`
- **Specification Impact:** Lane Prod acceptance check 3 specifies that the built home page must have exactly one `<h1>`. Per Rule L4 and L5, Lane Prod cannot touch `ConfiguratorShell.tsx`.
- **Proposed Solution:** In `ConfiguratorShell.tsx`, change `<h1 className="title">` to:
  ```tsx
  <h2 className="title">
    Assemble your
    <br />
    <span>creative</span> department.
  </h2>
  ```
  Since CSS rules target `.boxart .title` or `.title`, this preserves 100% visual styling and zero-pixel parity while ensuring a single `<h1>` document outline.

---

## 2. Request to Configurator Lane: Accessibility Improvements (from A11y Audit)

- **Target Files:** `src/components/configurator/ConfiguratorShell.tsx`, `src/styles/configurator.css`
- **Issues Identified in `docs/lanes/prod-a11y-audit.md`:**
  1. Configurator tier buttons (`.tier`), objective/mission buttons (`.opt`), and action buttons (`.fu.wide`) lack explicit accessible names (`aria-label` or descriptive text nodes).
  2. Sequential keyboard navigation reveals that interactive buttons in `#panel` have no visible `:focus` or `:focus-visible` styling (`outline: none` without replacement).
  3. Brand red background `#EE004E` with white text yields `4.43:1` contrast, slightly below the WCAG 2.1 AA `4.5:1` threshold for normal body-size text.
