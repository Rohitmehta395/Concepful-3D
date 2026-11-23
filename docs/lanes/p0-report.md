# Lane p0 Verification & Restructuring Report

## Verification Summary

- **12 Baseline States OuterHTML SHA256**: All 12 states (`solo_0..3`, `squad_0..3`, `combine_0..3`) matched `baseline.json` bit-for-bit across `#panel`, `#card`, `.top`, and `#modal` (`allStatesMatched: true`).
- **Click Parity Harness**: 0 mismatches across 19 action steps on both 1280x800 and 390x800 viewports. Negative control verified.
- **Modal Contract Verification**:
  - Initial state: `#modal` is hidden (`hidden=true`).
  - Clicking `[data-formup]` in `LoadoutStep`: `#modal` opens (`hidden=false`).
  - Clicking `#modal #mx`: `#modal` closes (`hidden=true`).
  - Clicking `[data-formup]` in `Header`: `#modal` opens (`hidden=false`).
  - Clicking `#modal #mx`: `#modal` closes (`hidden=true`).
- **Engine BuildState Contract**:
  - `src/engine/buildState.ts` extracts `BuildState` and `DEFAULT_BUILD_STATE` with full 6 fields (`tier`, `reach`, `mission`, `objective`, `objectives`, `buffs`).
  - `tests/buildState.test.ts` passes, verifying partial updates from legacy 4-field callers and full 6-field updates.
- **Pixel Parity**: Verified against baseline pixel protocol.

## Files Created & Owned

- `src/components/configurator/panels/TierPicker.tsx`
- `src/components/configurator/panels/SoloPanel.tsx`
- `src/components/configurator/panels/SquadPanel.tsx`
- `src/components/configurator/panels/CombinePanel.tsx`
- `src/components/configurator/panels/LoadoutStep.tsx`
- `src/components/configurator/panels/CardSheet.tsx`
- `src/components/modal/LeadModalProvider.tsx`
- `src/components/modal/LeadModal.tsx`
- `src/components/modal/index.ts`
- `src/engine/buildState.ts`
- `src/engine/stages/slots/enc.ts`
- `src/engine/stages/slots/raid.ts`
- `src/engine/stages/slots/overlay.ts`
- `src/engine/stages/slots/index.ts`
- `src/engine/stages/enc/.gitkeep`
- `src/engine/stages/raid/.gitkeep`
- `src/engine/overlay/.gitkeep`
- `tests/buildState.test.ts`
- `docs/lanes/CONTRACT.md`
- `docs/lanes/README.md`
- `docs/lanes/p0-report.md`
