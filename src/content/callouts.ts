import type { ObjectiveId, StageCallout } from "./types";

/**
 * Static non-visual metadata for squad encounters.
 * Source: ENCD (lines 12612-12790 in reference/Concepful_Mech_Builder.html)
 * Note: Procedural 3D scene construction function `build(g)` is omitted as scene code for Phase 5.
 */
export const ENCOUNTERS = {
  gtm: {
    team: "Thunder Horde",
    boss: "The Noise",
    cam: [0.55, 0.42, 1],
  },
  dir: {
    team: "Space Menagerie",
    boss: "The Bland Kraken",
    cam: [0.4, 0.4, 1],
  },
  research: {
    team: "Science Corps",
    boss: "The Unknown Audience",
    cam: [0.45, 0.38, 1],
  },
  product: {
    team: "Maze Runners",
    boss: "Scope Creep",
    cam: [0.3, 0.75, 1],
  },
} as const satisfies Record<
  ObjectiveId,
  { team: string; boss: string; cam: readonly [number, number, number] }
>;

/**
 * "Wherever you are" callouts: leader lines and descriptions for each scale tier.
 * Source: STAGE_C (lines 6910-7014 in reference/Concepful_Mech_Builder.html)
 */
export const STAGE_CALLOUTS: readonly (readonly StageCallout[])[] = [
  // 0: Mission (Solo)
  [
    {
      at: [0, 0, 0.72],
      h: "Mission · $4,000 fixed",
      d: "One job, one price, about two weeks.",
    },
    {
      at: [1.3, 0.26, 1.0],
      h: "One senior lead",
      d: "The same expert from brief to delivery.",
    },
    {
      at: [0, -0.36, 0.2],
      h: "A hero matched to the job",
      d: "Brand, site, deck, motion, 3D or an AI workflow.",
    },
    {
      at: [-1.3, 0.26, -1.0],
      h: "Yours on delivery",
      d: "Files and IP transfer when it ships.",
    },
  ],
  // 1: Scaling up / Gear
  [
    {
      at: [0.6, 1.6, 0],
      h: "Start with a Mission",
      d: "Prove the fit on one fixed-price job.",
    },
    {
      at: [4.5, 0, 0],
      h: "Upgrade when it stacks up",
      d: "Move to Full Crew without starting over.",
    },
    {
      at: [-1, 0.15, 1],
      h: "Same lead, same standard",
      d: "Your brand stays consistent as you grow.",
    },
    {
      at: [-4.75, 0, 0],
      h: "Gear as you need it",
      d: "Add illustration, a motion cut or rush per mission.",
    },
  ],
  // 2: Full Crew (Party)
  [
    {
      at: [-1.8, 2.0, 0],
      h: "Full Crew · from $7,200/mo",
      d: "1–3 months, 2-month minimum.",
    },
    {
      at: [5.3, 0.15, 0.4],
      h: "A party built around the goal",
      d: "Launch, rebrand, story or product. Specialists confirmed at kickoff.",
    },
    {
      at: [-0.3, -0.1, 1.2],
      h: "Project management included",
      d: "Nexus runs the plan, the queue and the check-ins.",
    },
    {
      at: [-6, 0.2, 0],
      h: "Context™ workspace",
      d: "Status, files and feedback in one place.",
    },
  ],
  // 3: Full Force (Raid)
  [
    {
      at: [-4.6, 2.6, -1.3],
      h: "Full Force · from $9,500/mo",
      d: "The whole department. 3-month minimum.",
    },
    {
      at: [5, 1.5, 1.4],
      h: "Every objective at once",
      d: "Launch, brand, story and product run in parallel.",
    },
    {
      at: [0, 1.3, 0],
      h: "Flagship included",
      d: "Scales from sub to mothership as you add buffs.",
    },
    {
      at: [2, 0.6, 2.12],
      h: "Raid buffs on demand",
      d: "3D, fabrication, hardware UI and AI systems.",
    },
  ],
] as const;

/**
 * System HUD chat log category labels and colors.
 * Source: KIND (lines 6891-6896 in reference/Concepful_Mech_Builder.html)
 */
export const CHAT_KINDS = {
  sys: ["[System]", "#FF7FA6"],
  party: ["[Party]", "#5FD39B"],
  loot: ["[Loot]", "#F2B33A"],
  quest: ["[Mission]", "#B8C2FF"],
} as const;
