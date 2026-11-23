# Parallel Lanes Architecture & Integration Guide

## Overview

Lane `p0` restructures the Concepful-3D codebase so five parallel feature lanes can execute concurrently without file collisions or merge contention.

## Recommended Merge & Integration Sequence

1. **p0** (Baseline restructuring, panels extraction, modal contract, engine buildState contract & slot placeholders)
2. **next** (Next.js config & platform updates)
3. **prod** (Production hardening)
4. **combine** (Full Force Combine department tier UI in `CombinePanel.tsx`)
5. **modal** (Lead intake form validation & submission handling in `LeadModal.tsx`)
6. **enc** (3D encounter scenes in `src/engine/stages/enc/`)
7. **raid** (3D raid carrier visualization in `src/engine/stages/raid/`)
8. **overlay** (3D overlay HUD elements in `src/engine/overlay/`)
9. **integrator** (Integration audit, full gate validation, release tagging)

## Contracts Established by Lane p0

- **Panels Decomposition**: `src/components/configurator/panels/` contains discrete sub-panels (`TierPicker`, `SoloPanel`, `SquadPanel`, `CombinePanel`, `LoadoutStep`, `CardSheet`).
- **Modal Contract**: `LeadModalProvider` provides React Context `{ isOpen, open, close }`. `Header` and `LoadoutStep` wire `open()` to `[data-formup]`.
- **Engine Build State Contract**: `BuildState` defines `tier`, `reach`, `mission`, `objective`, `objectives`, `buffs`. `createEngine` supports partial updates without mutating other properties.
- **Engine Stage Slots**: Slot hooks (`registerEncStage`, `registerRaidStage`, `registerOverlay`) allow lanes `enc`, `raid`, and `overlay` to register stages without modifying `createEngine.ts`.
