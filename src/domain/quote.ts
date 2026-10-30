import { BUFFS } from "@/content/buffs";
import { GEAR } from "@/content/gear";
import { BASE, OBJECTIVES } from "@/content/objectives";
import { QUESTS } from "@/content/quests";
import { TIERS } from "@/content/tiers";
import type { GearId, ObjectiveId, Tier } from "@/content/types";
import { type ConfigStateInput, normalizeConfigState } from "./config";

/**
 * Line item in quote breakdown.
 */
export interface QuoteLine {
  readonly name: string;
  readonly p: number;
  readonly c: string;
}

/**
 * Output shape of quote calculation matching the original script exactly.
 * Source: quote(), line 2639 in reference/Concepful_Mech_Builder.html
 */
export interface Quote {
  readonly T: Tier;
  readonly lines: readonly QuoteLine[];
  readonly incl: number;
  readonly sub: number;
  readonly disc: number;
  readonly total: number;
}

/**
 * Calculates pricing breakdown, discounts, and included count for the given configurator state.
 * Source: quote(), lines 2606-2640 in reference/Concepful_Mech_Builder.html
 *
 * @param state - Current configurator state (or flexible state input)
 * @returns Pricing quote with line items and total
 */
export function quote(state: ConfigStateInput): Quote {
  const s = normalizeConfigState(state);

  // Source: quote(), line 2607: const T = TIERS[tier], lines = [];
  const T = TIERS[s.tier];
  const lines: QuoteLine[] = [];
  let incl = 0;

  // Source: objOn(), line 2589: const objOn = (id) => tier === "combine" || objs.has(id);
  const objOn = (id: ObjectiveId) =>
    s.tier === "combine" || s.objectives.has(id);

  // Source: exOn(), lines 2582-2585:
  // const exOn = (id) => tier === "solo" && extras.has(id) && GEAR.find((e) => e.id === id).not !== mission;
  const exOn = (id: GearId) => {
    const item = GEAR.find((e) => e.id === id);
    return (
      s.tier === "solo" &&
      s.extras.has(id) &&
      item !== undefined &&
      item.not !== s.mission
    );
  };

  // Source: quote(), lines 2610-2626
  if (s.tier === "solo") {
    // Source: Q(), line 2581: const Q = () => QUESTS.find((q) => q.id === mission);
    const q = QUESTS.find((item) => item.id === s.mission) ?? QUESTS[0];
    if (q !== undefined && q.p > 0) {
      lines.push({
        // Source: quote(), line 2614
        name: "Mission · " + q.name,
        p: q.p,
        // Source: quote(), line 2616
        c: "var(--bone)",
      });
    } else {
      incl++;
    }

    GEAR.forEach((e) => {
      if (exOn(e.id)) {
        lines.push({
          // Source: quote(), line 2622
          name: e.name + " · " + e.desc.replace(/\.$/, ""),
          p: e.p,
          // Source: quote(), line 2624
          c: "var(--pro)",
        });
      }
    });
  } else {
    // Source: quote(), line 2628
    incl = OBJECTIVES.filter((o) => objOn(o.id)).length + BASE.length;

    // Source: quote(), lines 2629-2635
    if (s.tier === "combine") {
      incl++;
      BUFFS.forEach((b) => {
        if (s.buffs.has(b.id)) {
          lines.push({
            // Source: quote(), line 2633
            name: b.name,
            p: b.p,
            // Source: quote(), line 2633
            c: "var(--ops)",
          });
        }
      });
    }
  }

  // Source: quote(), line 2637: const sub = T.base + lines.reduce((s, l) => s + l.p, 0)
  const sub = T.base + lines.reduce((acc, l) => acc + l.p, 0);

  // Source: quote(), line 2638: disc = !T.one && billing === "yr" ? Math.round(sub * 0.1) : 0;
  const disc = !T.one && s.billing === "yr" ? Math.round(sub * 0.1) : 0;

  // Source: quote(), line 2639: return { T, lines, incl, sub, disc, total: sub - disc };
  return {
    T,
    lines,
    incl,
    sub,
    disc,
    total: sub - disc,
  };
}
