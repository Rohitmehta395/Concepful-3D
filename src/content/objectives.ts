import type { Objective, UnitId } from "./types";

/**
 * Squad objectives definition.
 * Source: OBJECTIVES (lines 2428-2457 in reference/Concepful_Mech_Builder.html)
 */
export const OBJECTIVES: readonly Objective[] = [
  {
    id: "gtm",
    name: "Launch something",
    say: "“We have a launch coming and it has to land.”",
    desc: "Go-to-market plan, channels, launch calendar and campaign assets.",
    roster: ["gtm", "decks", "copy", "motion", "illus"],
  },
  {
    id: "dir",
    name: "Refresh the brand",
    say: "“Our brand doesn’t look like who we are anymore.”",
    desc: "Creative direction, identity and naming, held to one standard.",
    roster: ["dir", "brand", "naming", "uiux", "illus"],
  },
  {
    id: "research",
    name: "Sharpen the story",
    say: "“People don’t get what we do, or who it’s for.”",
    desc: "Audience and competitor research, positioning and messaging.",
    roster: ["pos", "research", "copy"],
  },
  {
    id: "product",
    name: "Build the product",
    say: "“We need to design and ship the app.”",
    desc: "Concept, UX and build for a digital product or platform.",
    roster: ["web", "uiux", "motion"],
  },
] as const;

/**
 * Baseline party units included in every squad or raid.
 * Source: BASE (line 2458 in reference/Concepful_Mech_Builder.html)
 */
export const BASE: readonly UnitId[] = ["pm", "ws"] as const;
