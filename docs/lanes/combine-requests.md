# Combine Lane Requests (Out-of-Scope `setTier` Side Effects)

In `reference/Concepful_Mech_Builder.html` (`setTier`, lines 14904–14944), switching tiers triggers several side effects outside the `combine` lane's file ownership (`src/components/configurator/panels/**`, `ConfiguratorShell.tsx`, `ConfiguratorProvider.tsx`, `Header.tsx`, `configurator-shell.css`):

1. **3D Engine Snap & Unit Diff State (`SNAP` / `prev`)**:
   - `SNAP = true;`
   - `prev = new Set();`
   - Owned by the 3D engine / overlay lanes (`src/engine/**`).

2. **3D Engine Entry Animations (`A.veh` / `A.ship`)**:
   - When `!reduce`:
     - `if (id === "solo") A.veh = n;`
     - `if (id === "combine") A.ship = n;`
   - Owned by the 3D engine lanes (`src/engine/**`).

3. **Radio / Toast Callouts (`call()`)**:
   - Always on tier switch:
     - `call(\`Game mode: ${TIERS[id].name} (${TIERS[id].sub.split(" · ")[0]}).\`, "sys");`
   - Additionally when `id === "combine"`:
     - `const c = CLASSES.find((c) => c.id === reach);`
     - `call(\`${c.ship} ${c.code} is underway. ${units().length} units aboard.\`, "sys", 400);`
   - Owned by the overlay / toast lane (`src/engine/overlay/**`).
