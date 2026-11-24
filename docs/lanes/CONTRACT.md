# Parallel-Lane Multi-Agent Architecture Contract

This document defines the interface boundaries, file ownership rules, and synchronization contracts allowing multiple autonomous lanes to implement Concepful 3D stages, panels, and features in parallel without merge conflicts.

---

## 1. Directory & File Ownership Matrix

| Lane | Owns (read/write) |
| combine | src/components/configurator/panels/**, ConfiguratorShell.tsx, ConfiguratorProvider.tsx, src/components/shell/Header.tsx, configurator.css (only for a measured pixel difference), tests/combine-_, tests/fixtures/combine-_, new src/domain/combine\*.ts |
| modal | src/components/modal/**, modal.css, new src/domain/lead*.ts, tests/modal-_, tests/fixtures/modal-_ |
| enc | src/engine/stages/enc/**, src/engine/stages/slots/enc.ts, tests/enc-\* |
| raid | src/engine/stages/raid/**, src/engine/stages/slots/raid.ts, tests/raid-* |
| overlay | src/engine/overlay/**, src/engine/stages/slots/overlay.ts, tests/overlay-* |
| next | merged; owned package.json, pnpm-lock.yaml, next.config.ts |
| prod / prod2 | src/app/layout.tsx (metadata and viewport exports only), src/app/error.tsx, global-error.tsx, not-found.tsx, robots.ts, sitemap.ts, README.md, docs/deploy.md, .env.example, docs/lanes/prod* |
| integrator | merges, applies docs/lanes/*-requests.md, docs/progress.md; no feature work |

Every lane also owns its own docs/lanes/<lane>-report.md and docs/lanes/<lane>-requests.md.

---

## 2. Configurator Panels Decomposition Contract

Configurator panels are decomposed into discrete, single-responsibility components in `src/components/configurator/panels/`:

1. **`TierPicker.tsx`**:
   - Element: `nav#seg` (mobile segmented controls) & desktop tier buttons.
   - Dispatches `SET_TIER` (`"solo" | "squad" | "combine"`).
2. **`SoloPanel.tsx`**:
   - Element: `#st-pick` when `state.tier === "solo"`.
   - Handles mission selection (`data-mission`), extras (`data-extra`), and `#nudge` display.
3. **`SquadPanel.tsx`**:
   - Element: `#st-pick` when `state.tier === "squad"`.
   - Handles multi-objective toggles (`data-obj`) adhering to minimum-1 invariant.
4. **`CombinePanel.tsx`**:
   - Element: `#st-pick` (placeholder), `#st-ship`, and `#st-buffs`.
   - Dedicated ownership by lane `combine`.
5. **`LoadoutStep.tsx`**:
   - Element: `#st-load` (billing toggle `#bill`, price breakdown `#bp`, CTA button `button.fu[data-formup]`).
   - Wired to `LeadModalContext.open()`.
6. **`CardSheet.tsx`**:
   - Element: `#card` (sticky summary card, stats list `#stats`, party `#party`, motto `#motto`).

`ConfiguratorShell.tsx` serves purely as an orchestrator composing these subcomponents.

---

## 3. Lead Modal Contract

The lead capture modal is isolated from the configurator state into `src/components/modal/`:

```typescript
export interface LeadModalContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}
```

- **Provider**: Mounted at the root of `src/app/layout.tsx` (`<LeadModalProvider>`).
- **Trigger**: Any UI element needing to launch the lead modal invokes `const { open } = useLeadModal()`:
  - Header: `button.fu[data-formup]`
  - LoadoutStep: `button.fu[data-formup]`
- **LeadModal**: Renders `#modal` with `hidden={!isOpen}`. Clicking `button#mx` invokes `close()`.

---

## 4. 3D Engine Stage Slots Contract

To prevent concurrent writes to `src/engine/createEngine.ts` and `StageManager.ts`, lifecycle extension slots are registered via `src/engine/stages/slots/`:

- **`registerEncStage(manager, ctx)`**: Invoked during engine initialization. Lane `enc` adds its encounter stage here.
- **`registerRaidStage(manager, ctx)`**: Invoked during engine initialization. Lane `raid` adds its flagship raid stage here.
- **`registerOverlay(manager, ctx)`**: Invoked during engine initialization. Lane `overlay` attaches overlay render passes here.

---

## 5. BuildState Interface Contract

The engine build state interface is extracted to `src/engine/buildState.ts`:

```typescript
export interface BuildState {
  tier: "solo" | "squad" | "combine";
  reach: "local" | "regional" | "national" | "global";
  mission:
    | "brand"
    | "web"
    | "uiux"
    | "decks"
    | "copy"
    | "motion"
    | "3d"
    | "fab"
    | "ai";
  objective: "gtm" | "dir" | "research" | "product";
  objectives: readonly ObjectiveId[];
  buffs: readonly BuffId[];
}
```

This prevents cross-lane imports of stage types.

---

## 6. Forbidden for all lanes (read-only)

src/engine/createEngine.ts, src/engine/buildState.ts, src/engine/stages/slots/index.ts, any other existing src/engine/** file outside the owned folders, existing files in src/domain/**, src/content/**, tokens.css, story.ts, reference/**, tests/fixtures/reference-states.json, docs/progress.md, docs/lanes/CONTRACT.md, docs/lanes/README.md.

---

## 7. Requests protocol

A lane that needs a change in a file it does not own writes the exact change and the reason in docs/lanes/<lane>-requests.md and continues; the integrator applies requests in one commit.
