# ADR 0003: Omit External Animation Libraries (GSAP, Framer Motion)

- **Status:** Proposed in Redevelopment Plan (Deliverables 3 & 8) / Pending Validation in Phase 3 (Part 3.5)
- **Date:** October 30, 2026
- **Source Plan Reference:** `concepful-redevelopment-plan.md` Deliverable 3 (line 175) and Deliverable 8 (line 362)

---

## Context

Many rich scroll-driven web experiences utilize heavy third-party animation libraries like **GSAP (GreenSock)** with ScrollTrigger, or **Framer Motion** (Motion).

In `concepful-redevelopment-plan.md` Deliverable 3, whether to include external animation libraries in the Next.js rebuild of **Concepful Mech Builder** was evaluated.

---

## Proposed Decision

As proposed in Deliverable 3 of the redevelopment plan, the project plans to **omit GSAP, Framer Motion, and third-party animation libraries** initially.

All 3D camera transitions, layout morphs, and canvas animations will be driven by the centralized `requestAnimationFrame` loop with custom mathematical easing functions (`easeBox`) matching the prototype. DOM transitions will use standard CSS transitions and CSS sticky positioning.

The plan notes: _"Revisit only if the horizontal 'mission log' needs something CSS sticky cannot do."_

---

## Rationale (from Redevelopment Plan)

1. **Original Architecture Matching:**
   The original prototype achieved all of its fluid, scroll-driven visual effects using a single native `requestAnimationFrame` loop that coordinates with section positions via custom easing algorithms. It does not use GSAP or Motion.
2. **Bundle Size & Performance Budget:**
   Omitting GSAP and Motion saves over 50–100 KB of minified JavaScript, keeping the client bundle lean and ensuring fast load times on mobile devices.
3. **Scroll & Canvas Synchronization:**
   External scroll libraries frequently compete with custom WebGL render loops, causing micro-stuttering or out-of-sync frames. Coordinating camera interpolation directly inside the render loop guarantees that canvas updates and layout transitions remain synchronized on every frame tick.
4. **CSS Sticky for Horizontal Tracks:**
   The "Mission Log" section uses a horizontal track that can be achieved cleanly with native CSS `position: sticky` and horizontal overflow scrolling without requiring external scroll-jacking plugins.

---

## Consequences & Validation Criteria

### Expected Advantages

- Smaller client bundle size and lower JavaScript execution overhead.
- Direct alignment with the original prototype's proven rendering logic.
- No licensing concerns associated with commercial animation libraries.

### Trade-offs & Validation Requirements

- Must be validated during Phase 3, Part 3.5 (Mission Log): if native CSS sticky horizontal tracking proves inadequate to match the baseline interaction, an animation utility will be formally evaluated.
- Complex DOM timeline sequencing (if requested in the future beyond the original prototype) would require custom implementation rather than plug-and-play library primitives.
