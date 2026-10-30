import type { GearItem } from "./types";

/**
 * Optional gear / addon definitions for solo missions.
 * Source: GEAR (lines 2403-2426 in reference/Concepful_Mech_Builder.html)
 */
export const GEAR: readonly GearItem[] = [
  {
    id: "x-illus",
    name: "Custom skin",
    desc: "Custom illustration set.",
    fx: "Paint job",
    p: 1500,
  },
  {
    id: "x-motion",
    name: "Companion pet",
    desc: "A short animated cut of the work.",
    fx: "Camera drone follows",
    p: 2000,
    not: "motion",
  },
  {
    id: "x-rush",
    name: "Haste",
    desc: "Priority rush, 12-hour turnaround.",
    fx: "Afterburners",
    p: 1200,
  },
] as const;
