# Concepful Mech Builder — Reference Visual Baseline (Part 1.2)

This directory contains the visual baseline captures of the original standalone prototype (`reference/Concepful_Mech_Builder.html`), serving as the visual and interaction source of truth for the Next.js rebuild.

---

## 1. Capture Environment & Settings

- **Browser**: Google Chrome `155.0.8059.85` (launched headlessly via Playwright `1.64.1`)
- **GPU / WebGL Backend**: ANGLE Direct3D11 (`Intel(R) UHD Graphics`, WebGL 2.0, GLSL ES 3.00)
- **Device Scale Factor**: `1.0`
- **Capture URL**: Local `file:///` protocol pointing to `reference/Concepful_Mech_Builder.html`

### Viewport Matrix

| Viewport Folder | Width | Height | Target Device Class | Breakpoint Behavior |
|---|---|---|---|---|
| `390/` | 390 px | 844 px | Mobile (iPhone 12/13/14) | `< 900px`: Nav hidden, `.top` flex-wrapped, 3D scene on top half, loadout as bottom sheet |
| `768/` | 768 px | 1024 px | Tablet (iPad Portrait) | `< 900px`: Compact mobile layout, single-column story layout |
| `1280/` | 1280 px | 800 px | Desktop Standard | `> 1023px`: Full dual-panel HUD (left loadout + right character card), widescreen story sections |
| `1920/` | 1920 px | 1080 px | Desktop Wide (Full HD) | Full widescreen layout with max-width content constraints |

---

## 2. Screenshot Inventory

Each viewport folder contains 9 structured captures representing the full scroll narrative and interactive states:

| Filename | State / Target | Description |
|---|---|---|
| `00-fullpage.png` | Entire Page | Complete scrollable height document capture |
| `01-intro.png` | `#s-intro` (Story) | Hero scene: "YOUR CREATIVE DEPARTMENT, ON DEMAND.", CS-99 flagship carrier in space |
| `02-classes.png` | `#s-classes` (Story) | Hero mechs section & department unit roster |
| `03-logi.png` | `#s-logi` (Story) | Sticky mission log & 24h sprint delivery timeline |
| `04-rules.png` | `#s-rules` (Story) | "Raid Rules" / 5 operating principles (async-first, one lead, fixed cadence) |
| `05-stages.png` | `#s-stages` (Story) | "Choose your flagship" plan comparison (Scout, Vanguard, Dreadnought) |
| `06-outro.png` | `#s-outro` (Story) | Final story CTA ("Ready to launch?") |
| `07-configurator.png` | `#build` (App) | Active configurator view (`body.app` mode): 3D Laser Dolphin, loadout steps, character sheet |
| `08-modal.png` | `#modal` (Modal) | "Create your guild" dialog form with quote summary and lead input |

---

## 3. External Resources & Network Audit

During page load, the original HTML requested the following resources:
1. `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&family=Russo+One&display=swap` (`200 OK`)
2. `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js` (`200 OK`)
3. `https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2` (`200 OK`)
4. `https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPxDcwg.woff2` (`200 OK`)
5. `https://fonts.gstatic.com/s/russoone/v18/Z9XUDmZRWg6M1LvRYsHOz8mJ.woff2` (`200 OK`)

- **Failed network requests**: 0
- **Console errors / warnings**: 0

---

## 4. Animation-Frame Callback Timing & Performance Observations

Measurements were recorded using `requestAnimationFrame` delta tracking over continuous render sequences in headless Google Chrome.

> [!NOTE]
> **Measurement Scope & Terminology Notice**:  
> `requestAnimationFrame` timestamps measure callback execution intervals (`performance.now()` deltas between consecutive animation loop invocations) in headless Chromium. They do **not** measure hardware monitor refresh rates, display compositor presentation timestamps, or real-world display FPS. Calculated FPS figures (`1000 / avgInterval`) are **mathematical reciprocal estimates** of callback frequency under unthrottled headless execution, not verified display render capacity.

### Story Mode (`#s-intro` / 3D Space Scene)
- **Sample window**: 180 consecutive animation frames
- **Average callback interval**: **8.68 ms**
- **Mathematical reciprocal estimate**: ~115.2 FPS (theoretical reciprocal callback rate under test environment)
- **Minimum callback interval**: **6.70 ms**
- **Maximum callback interval**: **21.00 ms** (minor timing jitter during initial texture draw)
- **95th percentile (p95) interval**: **14.00 ms**

### Configurator Mode (`#build` / Active Mecha View)
- **Sample window**: 120 consecutive animation frames
- **Average callback interval**: **7.17 ms**
- **Mathematical reciprocal estimate**: ~139.4 FPS
- **Minimum callback interval**: **6.70 ms**
- **Maximum callback interval**: **13.90 ms**

### Architectural Observations from Prototype Execution
1. **Unconditional Loop Execution**: The prototype maintains an unthrottled `requestAnimationFrame` render loop (`loop()` -> `paint()`) indefinitely, repainting a full-screen WebGL canvas and a full-screen 2D canvas on every frame without pausing when hidden, off-screen, or inactive.
2. **Rebuild Optimization Opportunities**: Implementing Page Visibility API (`document.visibilityState`) pausing, IntersectionObserver-based off-screen throttling, and reduced-motion event-driven repainting will significantly reduce CPU and GPU utilization compared to the prototype.

### Nondeterministic Visual Factors
1. **Procedural Animation Loops**: Floating aircraft carriers, escort jets, particle thruster flames, and rotating 2D canvas callouts animate continuously via `requestAnimationFrame`. Subtle frame offsets (e.g. angle of floating escort jets) occur naturally between different capture runs.
2. **Procedural Textures**: Over 120 canvas-generated textures (`texC`) render deterministically upon canvas initialization.

---

## 5. How to Reproduce Captures

Prerequisites:
- Dependencies installed via `pnpm install` (includes `playwright` devDependency).
- Google Chrome installed on the host system.

Run the automated capture script from the project root:

```powershell
node reference/capture-baseline.mjs
```

The script will launch headless Chrome via Playwright, iterate over all 4 viewport configurations, scroll through each section, open the modal, measure animation frame callback intervals, and output fresh PNG captures into `reference/baseline/{390,768,1280,1920}/`.
