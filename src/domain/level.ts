import { CLASSES } from "@/content/classes";
import { GEAR } from "@/content/gear";
import { QUESTS } from "@/content/quests";
import type { GearId } from "@/content/types";
import { type ConfigStateInput, normalizeConfigState } from "./config";
import { units } from "./roster";
import { shipFor } from "./ship";

/**
 * Calculates display level for the given configurator state.
 * Source: refresh(), lines 14804-14811 in reference/Concepful_Mech_Builder.html:
 *
 * const us = units(),
 *   cls = CLASSES.find((c) => c.id === reach),
 *   qq = Q(),
 *   cnt = (k) => us.filter((id) => TEAMOF[id] === k).length;
 * const lv = solo
 *   ? 12 + [...extras].filter(exOn).length * 6 + (qq.p ? 6 : 0)
 *   : tier === "squad"
 *     ? 20 + us.length * 3
 *     : Math.min(
 *         99,
 *         48 + us.length * 2 + buffs.size * 5 + CLASSES.indexOf(cls) * 6,
 *       );
 *
 * @param state - Current configurator state (or flexible state input)
 * @returns Numerical level (12..99)
 */
export function levelFor(state: ConfigStateInput): number {
  const s = normalizeConfigState(state);
  const solo = s.tier === "solo";
  const us = units(s);
  const qq = QUESTS.find((q) => q.id === s.mission);
  const exOn = (id: GearId) =>
    solo &&
    s.extras.has(id) &&
    GEAR.find((e) => e.id === id)?.not !== s.mission;

  if (solo) {
    const activeExtras = [...s.extras].filter(exOn);
    return 12 + activeExtras.length * 6 + (qq?.p ? 6 : 0);
  }

  if (s.tier === "squad") {
    return 20 + us.length * 3;
  }

  const reach = s.tier === "combine" ? shipFor(s.buffs) : s.reach;
  const cls = CLASSES.find((c) => c.id === reach);
  const clsIndex = cls ? CLASSES.indexOf(cls) : 0;

  return Math.min(99, 48 + us.length * 2 + s.buffs.size * 5 + clsIndex * 6);
}

/**
 * Formatted level badge string matching DOM element #cid.
 * Source: line 14817 in reference/Concepful_Mech_Builder.html: $("cid").textContent = "LV " + lv;
 *
 * @param state - Current configurator state (or flexible state input)
 * @returns Level badge string, e.g. "LV 41"
 */
export function cidLabelFor(state: ConfigStateInput): string {
  return "LV " + levelFor(state);
}
