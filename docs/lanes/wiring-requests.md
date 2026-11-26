# Lane `wiring` Requests

## 1. Stage Entry Animations (`A.veh`, `A.ship`, `A[id]`)

Lane `wiring` does not own `src/engine/stages/appStage.ts`, `src/engine/stages/enc/EncStage.ts`, or `src/engine/stages/raid/raidStage.ts`.

### Requested changes:

1. **`src/engine/stages/types.ts` & `Stage` implementations (`appStage.ts`, `EncStage.ts`, `raidStage.ts`)**:
   - Add an optional `triggerEntry?: (kind: "veh" | "ship" | "party", t: number, reduceMotion?: boolean) => void` method to `Stage` (or `triggerFormEntry`).
   - In `appStage.ts`: track `vehT0` (`A.veh`) and apply `(1 - backEase(prog(vehT0, t))) * -14` to `M3.g.position.x` (matching `reference/Concepful_Mech_Builder.html` lines 14500-14502, 14912, 14962, 15033) when `!reduceMotion`.
   - In `EncStage.ts`: support per-unit stagger `A[id] = now + k * 120` on party join (line 14888) and `A[id] = now + i * 90` on `formUp` (line 15035) when `!reduceMotion`.
   - In `raidStage.ts`: expose `triggerEntry` to reset `shipT0 = t` on `SET_TIER("combine")`, `SET_REACH`, `shipFor()` change, and `formUp` (lines 14767, 14913, 15010, 15034) when `!reduceMotion`.
2. **Reason**:
   - `ConfiguratorProvider.tsx` and `createEngine.ts` trigger `hud.triggerForm()` and `hud.call()`, but the 3D stage entry animations (`A.veh`, `A[id]`, `A.ship`) live in stage files outside `wiring`'s owned paths.
