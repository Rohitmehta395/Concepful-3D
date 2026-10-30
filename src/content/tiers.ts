import type { Tier, TierId } from "./types";

/**
 * Game modes & pricing tiers definition.
 * Source: TIERS (lines 2288-2328 in reference/Concepful_Mech_Builder.html)
 */
export const TIERS = {
  solo: {
    pitch:
      "One mission, one hero. Pick the job and watch who answers the call.",
    name: "Mission",
    sub: "Solo · Project",
    base: 4000,
    one: true,
    d: "One mission, one hero. Fixed fee, about two weeks.",
    motto: "One mission. No grinding.",
    fu: "Start mission",
    word: "MISSION START",
  },
  squad: {
    pitch:
      "Tell us what you’re trying to do. The party forms around it and takes on the encounter.",
    name: "Full Crew",
    sub: "Party · Engagement",
    base: 7200,
    one: false,
    popular: true,
    min: "2-month minimum",
    d: "Pick the strategy; the party forms around it. 1–3 months, 2-month minimum.",
    motto: "Bring the right crew.",
    fu: "Ready check",
    word: "PARTY READY",
  },
  combine: {
    pitch:
      "The whole department, every objective at once. Add raid buffs and the flagship grows.",
    name: "Full Force",
    sub: "Raid · Department",
    base: 9500,
    one: false,
    min: "3-month minimum",
    d: "The whole department for large-scale work. Flagship included. 3-month minimum.",
    motto: "Bring the whole guild.",
    fu: "Launch raid",
    word: "RAID LAUNCHED",
  },
} as const satisfies Record<TierId, Tier>;
