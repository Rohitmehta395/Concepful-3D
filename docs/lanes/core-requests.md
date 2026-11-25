# Cross-Lane Requests from Lane CORE

## 1. `src/engine/stages/raid/raidStage.ts` — Remove `reduceMotion` guard on camera `dx`

- **Target File**: `src/engine/stages/raid/raidStage.ts` (line 333)
- **Reason**: Per the user decision to match the reference on camera/aim math that the reference does not guard: `raidStage.ts` line 333 has `const dx = 0.28 + (reduceMotion ? 0 : Math.sin(t / 6000) * 0.1);`, whereas `reference/Concepful_Mech_Builder.html` line 14638 has `orbit(new THREE.Vector3(0.28 + Math.sin(t / 6000) * 0.1, 0.22, 1))` without a `reduce` guard.
- **Requested Change**:

```diff
-    const dx = 0.28 + (reduceMotion ? 0 : Math.sin(t / 6000) * 0.1);
+    const dx = 0.28 + Math.sin(t / 6000) * 0.1;
```
