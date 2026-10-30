# ADR 0002: Pin Three.js r128 for Initial Parity

- **Status:** Proposed in Redevelopment Plan (Deliverables 3 & 8) / Pending Confirmation & Validation in Phase 4/5
- **Date:** October 30, 2026
- **Source Plan Reference:** `concepful-redevelopment-plan.md` Deliverable 3 (line 173), Deliverable 8 (line 362), and Deliverable 10 (line 445)

---

## Context

The original `reference/Concepful_Mech_Builder.html` prototype uses **Three.js r128** (`https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`), released in 2021.

Between r128 and modern Three.js releases (e.g., r160+), several substantial breaking changes were introduced, notably:

- Color management defaults changed from legacy linear sRGB to modern color-space conventions (affecting hex colors, diffuse reflection, and ambient light intensities).
- Deprecation and removal of legacy geometry classes (such as `Geometry` vs. `BufferGeometry`).
- Changes in material properties, shader chunk injections, texture formats (such as `LuminanceFormat`), and light attenuation calculations.

In `concepful-redevelopment-plan.md` Deliverable 10 (line 445), "pinning three r128 first" is explicitly identified as a decision pending confirmation during implementation.

---

## Proposed Decision

As proposed in Deliverable 3 of the redevelopment plan, when implementing Phase 4 and Phase 5, the plan proposes installing and pinning **`three@0.128.0`** (and `@types/three@0.128.0`) to complete the procedural model and scene port before evaluating any major Three.js version upgrades.

Evaluating an upgrade to a newer Three.js version is explicitly scheduled as a dedicated task in **Phase 9 (Performance & Optimization, Part 9.4)** after visual baseline parity is achieved.

_(Note: Three.js is not yet installed in the repository; dependencies will be added strictly within the scope of Phase 4)._

---

## Rationale (from Redevelopment Plan)

1. **Guaranteed Visual Parity:**
   Pinning the identical version ensures that toon shaders, custom ink materials, light calculations, and procedural geometry primitives render with 100% fidelity compared to the approved Part 1.2 baseline screenshots.
2. **Elimination of Debugging Ambiguity:**
   If a visual discrepancy arises during Phase 5 (recreating ~40 procedural models), developers can be certain it stems from mesh code rather than breaking changes in the Three.js rendering pipeline or color management.
3. **Controlled Scope:**
   Isolates the complex procedural reconstruction from engine upgrade migrations.

---

## Consequences & Validation Criteria

### Expected Advantages

- Predictable, faithful reproduction of the original visuals.
- Toon shaders and lighting math work without unexpected alterations.
- Simplifies validation against the approved baseline screenshots.

### Trade-offs & Validation Requirements

- Deprecated Three.js APIs from r128 must be accepted temporarily until Phase 9.4.
- Must be confirmed during Phase 4 implementation against TypeScript strict-mode compatibility and visual baseline diffs.
