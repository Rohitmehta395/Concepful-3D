/**
 * Canonical Section Anchor IDs for Concepful Mech Builder.
 *
 * Maps modern, clean semantic anchor IDs to their original prototype counterparts.
 * Line citations reference reference/Concepful_Mech_Builder.html.
 */
export const SECTION_IDS = {
  /** Replaces original #s-intro (line 1809, 1994) */
  intro: "intro",
  /** Replaces original #s-classes (line 1826, 2018) */
  classes: "classes",
  /** Replaces original #s-logi (line 1826, 2058) */
  howItWorks: "how-it-works",
  /** Replaces original #s-stages (line 1826, 2135) */
  plans: "plans",
  /** Matches original #build (line 1826, 2191) */
  build: "build",
} as const;

export type SectionKey = keyof typeof SECTION_IDS;
export type SectionId = (typeof SECTION_IDS)[SectionKey];
