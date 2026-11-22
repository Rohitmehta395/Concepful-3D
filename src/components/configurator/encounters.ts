import type { ObjectiveId } from "@/content/types";

export interface EncounterData {
  readonly team: string;
  readonly boss: string;
}

/**
 * Encounter metadata mapped per squad objective.
 * Source: ENCD (lines 12612-12790 in reference/Concepful_Mech_Builder.html)
 */
export const ENCD: Record<ObjectiveId, EncounterData> = {
  gtm: {
    team: "Thunder Horde",
    boss: "The Noise",
  },
  dir: {
    team: "Space Menagerie",
    boss: "The Bland Kraken",
  },
  research: {
    team: "Science Corps",
    boss: "The Unknown Audience",
  },
  product: {
    team: "Maze Runners",
    boss: "Scope Creep",
  },
} as const;
