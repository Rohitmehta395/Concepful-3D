import type {
  BuffId,
  ClassId,
  GearId,
  ObjectiveId,
  QuestId,
  TierId,
} from "@/content/types";
import { shipFor } from "./ship";

export type BillingCycle = "mo" | "yr";

/**
 * Immutable configuration state representing the configurator inputs.
 * Source: lines 2573-2580 in reference/Concepful_Mech_Builder.html
 */
export interface ConfigState {
  readonly tier: TierId;
  readonly mission: QuestId;
  readonly reach: ClassId;
  readonly billing: BillingCycle;
  readonly company: string;
  readonly extras: ReadonlySet<GearId>;
  readonly objectives: ReadonlySet<ObjectiveId>;
  readonly buffs: ReadonlySet<BuffId>;
}

/**
 * Flexible input shape for state consumers, supporting either Sets or readonly arrays.
 */
export interface ConfigStateInput {
  readonly tier: TierId;
  readonly mission?: QuestId;
  readonly reach?: ClassId;
  readonly billing?: BillingCycle;
  readonly company?: string;
  readonly extras?: ReadonlySet<GearId> | readonly GearId[];
  readonly objectives?: ReadonlySet<ObjectiveId> | readonly ObjectiveId[];
  readonly buffs?: ReadonlySet<BuffId> | readonly BuffId[];
}

/**
 * Initial configurator state matching the original script defaults.
 * Source: lines 2573-2580
 *
 * let tier = "solo",
 *   mission = "brand",
 *   reach = "local",
 *   billing = "mo",
 *   company = "";
 * const extras = new Set(),
 *   objs = new Set(["gtm"]),
 *   buffs = new Set();
 */
export const INITIAL_CONFIG_STATE: ConfigState = {
  tier: "solo",
  mission: "brand",
  reach: "local",
  billing: "mo",
  company: "",
  extras: new Set<GearId>(),
  objectives: new Set<ObjectiveId>(["gtm"]),
  buffs: new Set<BuffId>(),
};

/**
 * Normalizes a ConfigStateInput into a canonical ConfigState with Sets.
 */
export function normalizeConfigState(input: ConfigStateInput): ConfigState {
  const extras =
    input.extras instanceof Set
      ? input.extras
      : new Set<GearId>(input.extras ?? []);
  const objectives =
    input.objectives instanceof Set
      ? input.objectives
      : new Set<ObjectiveId>(input.objectives ?? ["gtm"]);
  const buffs =
    input.buffs instanceof Set
      ? input.buffs
      : new Set<BuffId>(input.buffs ?? []);

  return {
    tier: input.tier,
    mission: input.mission ?? "brand",
    reach: input.reach ?? "local",
    billing: input.billing ?? "mo",
    company: input.company ?? "",
    extras,
    objectives,
    buffs,
  };
}

/**
 * Discriminated union of actions corresponding to every state mutation in the original source.
 */
export type ConfigAction =
  | { readonly type: "SET_TIER"; readonly tier: TierId }
  | { readonly type: "SET_MISSION"; readonly mission: QuestId }
  | { readonly type: "TOGGLE_EXTRA"; readonly gearId: GearId }
  | { readonly type: "TOGGLE_OBJECTIVE"; readonly objectiveId: ObjectiveId }
  | { readonly type: "TOGGLE_BUFF"; readonly buffId: BuffId }
  | { readonly type: "SET_BILLING"; readonly billing: BillingCycle }
  | { readonly type: "SET_COMPANY"; readonly company: string }
  | { readonly type: "SET_REACH"; readonly reach: ClassId };

/**
 * Pure configuration state reducer replicating every mutation and guard from the original source.
 *
 * Source event handlers:
 * - SET_TIER: setTier(), lines 14904-14944 (updates reach to shipFor() on combine)
 * - SET_MISSION: click data-mission, lines 14960-14971
 * - TOGGLE_EXTRA: click data-extra, lines 14972-14980
 * - TOGGLE_OBJECTIVE: click data-obj, lines 14981-14998 (at least 1 objective guarded in squad mode)
 * - TOGGLE_BUFF: click data-buff, lines 14999-15007 & refresh(), lines 14760-14766
 * - SET_BILLING: click b-mo / b-yr, lines 15061-15074
 * - SET_COMPANY: input co, lines 15075-15078
 * - SET_REACH: click data-reach, lines 15008-15023
 */
export function configReducer(
  state: ConfigState,
  action: ConfigAction
): ConfigState {
  switch (action.type) {
    case "SET_TIER": {
      // Source: setTier(id), line 14905: if (id === tier) return;
      if (action.tier === state.tier) {
        return state;
      }
      // Source: setTier(id), line 14910: if (id === "combine") reach = shipFor();
      const reach =
        action.tier === "combine" ? shipFor(state.buffs) : state.reach;
      return {
        ...state,
        tier: action.tier,
        reach,
      };
    }

    case "SET_MISSION": {
      // Source: lines 14960-14971: mission = b.dataset.mission
      // Note: original does NOT clear extras or filter on mission switch.
      return {
        ...state,
        mission: action.mission,
      };
    }

    case "TOGGLE_EXTRA": {
      // Source: lines 14972-14980: tog(extras, b.dataset.extra)
      const nextExtras = new Set(state.extras);
      if (nextExtras.has(action.gearId)) {
        nextExtras.delete(action.gearId);
      } else {
        nextExtras.add(action.gearId);
      }
      return {
        ...state,
        extras: nextExtras,
      };
    }

    case "TOGGLE_OBJECTIVE": {
      // Source: lines 14981-14985:
      // if (tier === "squad" && objs.size === 1 && objs.has(b.dataset.obj)) return;
      if (
        state.tier === "squad" &&
        state.objectives.size === 1 &&
        state.objectives.has(action.objectiveId)
      ) {
        return state;
      }
      const nextObjectives = new Set(state.objectives);
      if (nextObjectives.has(action.objectiveId)) {
        nextObjectives.delete(action.objectiveId);
      } else {
        nextObjectives.add(action.objectiveId);
      }
      return {
        ...state,
        objectives: nextObjectives,
      };
    }

    case "TOGGLE_BUFF": {
      // Source: lines 15000-15006: tog(buffs, b.dataset.buff)
      const nextBuffs = new Set(state.buffs);
      if (nextBuffs.has(action.buffId)) {
        nextBuffs.delete(action.buffId);
      } else {
        nextBuffs.add(action.buffId);
      }
      // Source: refresh(), lines 14760-14766:
      // if (tier === "combine") { const r = shipFor(); if (r !== reach) reach = r; }
      const reach = state.tier === "combine" ? shipFor(nextBuffs) : state.reach;
      return {
        ...state,
        buffs: nextBuffs,
        reach,
      };
    }

    case "SET_BILLING": {
      // Source: lines 15061-15074: billing = "mo" / billing = "yr"
      return {
        ...state,
        billing: action.billing,
      };
    }

    case "SET_COMPANY": {
      // Source: lines 15075-15078: company = e.target.value.trim()
      return {
        ...state,
        company: action.company.trim(),
      };
    }

    case "SET_REACH": {
      // DEAD IN THE ORIGINAL UI: no element has data-reach. In the original, the handler (lines 15008-15023) ends with refresh(), which in combine mode would re-derive reach from shipFor() and overwrite this value. That re-derivation is NOT reproduced here. Do not dispatch this action from the app.
      return {
        ...state,
        reach: action.reach,
      };
    }
  }
}
