import type { BuffId, ObjectiveId } from "@/content";

export interface BuildState {
  tier: "solo" | "squad" | "combine";
  reach: "local" | "regional" | "national" | "global";
  mission:
    | "brand"
    | "web"
    | "uiux"
    | "decks"
    | "copy"
    | "motion"
    | "3d"
    | "fab"
    | "ai";
  objective: "gtm" | "dir" | "research" | "product";
  objectives: readonly ObjectiveId[];
  buffs: readonly BuffId[];
}

export const DEFAULT_BUILD_STATE: BuildState = {
  tier: "solo",
  reach: "local",
  mission: "brand",
  objective: "gtm",
  objectives: ["gtm"],
  buffs: [],
};
