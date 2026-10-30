import { BASE, OBJECTIVES } from "@/content/objectives";
import type { BuffId, ObjectiveId, UnitId } from "@/content/types";
import { type ConfigStateInput, normalizeConfigState } from "./config";

/**
 * Derives the active roster units based on game mode tier, chosen objectives, base units, and combine buffs.
 * Source: units(), lines 2590-2602 in reference/Concepful_Mech_Builder.html
 * Source: objOn(), line 2589: const objOn = (id) => tier === "combine" || objs.has(id);
 *
 * @param state - Current configurator state
 * @returns Ordered array of unique unit identifiers
 */
export function units(state: ConfigStateInput): readonly UnitId[] {
  const s = normalizeConfigState(state);

  // Source: units(), line 2591: if (tier === "solo") return [];
  if (s.tier === "solo") {
    return [];
  }

  const sSet = new Set<UnitId>();
  const objOn = (id: ObjectiveId) =>
    s.tier === "combine" || s.objectives.has(id);

  // Source: units(), lines 2593-2595
  OBJECTIVES.forEach((o) => {
    if (objOn(o.id)) {
      o.roster.forEach((u) => sSet.add(u));
    }
  });

  // Source: units(), line 2596: BASE.forEach((u) => s.add(u));
  BASE.forEach((u) => sSet.add(u));

  // Source: units(), lines 2597-2600
  if (s.tier === "combine") {
    const companionBuffs: readonly (BuffId & UnitId)[] = [
      "3d",
      "fab",
      "hw",
      "cmd",
      "intel",
    ];
    companionBuffs.forEach((b) => {
      if (s.buffs.has(b)) {
        sSet.add(b);
      }
    });
  }

  // Source: units(), line 2601: return [...s];
  return [...sSet];
}

/**
 * Derives the leader unit identifiers for active objectives.
 * Note: Preserves original behaviour where tier === "solo" still checks objs.has(o.id) rather than returning empty.
 * Source: leaders(), lines 2603-2605 in reference/Concepful_Mech_Builder.html
 * Source: objOn(), line 2589
 *
 * @param state - Current configurator state
 * @returns Set of leader unit IDs
 */
export function leaders(state: ConfigStateInput): ReadonlySet<UnitId> {
  const s = normalizeConfigState(state);
  const objOn = (id: ObjectiveId) =>
    s.tier === "combine" || s.objectives.has(id);

  // Source: leaders(), lines 2603-2604:
  // new Set(OBJECTIVES.filter((o) => objOn(o.id)).map((o) => o.roster[0]))
  const leaderUnits: UnitId[] = [];
  for (const o of OBJECTIVES) {
    if (objOn(o.id)) {
      const leader = o.roster[0];
      if (leader !== undefined) {
        leaderUnits.push(leader);
      }
    }
  }

  return new Set(leaderUnits);
}
