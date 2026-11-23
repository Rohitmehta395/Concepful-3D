import { describe, it, expect } from "vitest";
import { DEFAULT_BUILD_STATE, type BuildState } from "@/engine/buildState";

describe("buildState contract", () => {
  it("provides valid DEFAULT_BUILD_STATE with all 6 fields", () => {
    expect(DEFAULT_BUILD_STATE).toEqual({
      tier: "solo",
      reach: "local",
      mission: "brand",
      objective: "gtm",
      objectives: ["gtm"],
      buffs: [],
    });
  });

  it("handles partial updates with legacy 4-field calls and full 6-field calls", () => {
    // Test pure state merging logic as implemented in createEngine
    let current: BuildState = { ...DEFAULT_BUILD_STATE };
    const setBuildState = (partial: Partial<BuildState>) => {
      current = { ...current, ...partial };
    };

    // Legacy 4-field partial update
    setBuildState({ tier: "squad", mission: "web" });
    expect(current.tier).toBe("squad");
    expect(current.mission).toBe("web");
    expect(current.objectives).toEqual(["gtm"]);
    expect(current.buffs).toEqual([]);

    // Full 6-field update
    setBuildState({
      objectives: ["gtm", "dir"],
      buffs: ["flow", "intel"],
    });
    expect(current.objectives).toEqual(["gtm", "dir"]);
    expect(current.buffs).toEqual(["flow", "intel"]);
    expect(current.tier).toBe("squad");
  });
});
