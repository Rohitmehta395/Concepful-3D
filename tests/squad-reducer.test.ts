import { describe, expect, it } from "vitest";
import { configReducer, INITIAL_CONFIG_STATE } from "@/domain/config";

// Expected states extracted dynamically from live reference/Concepful_Mech_Builder.html
const referenceExpected = {
  initialObjs: ["gtm"],
  initialBilling: "mo",
  afterBlockedClickObjs: ["gtm"],
  afterAddDirObjs: ["gtm", "dir"],
  afterRemoveGtmObjs: ["dir"],
  afterBlockedDirObjs: ["dir"],
  billingYr: "yr",
  billingMo: "mo",
};

describe("Squad Reducer Rules Parity (Part 6.3b)", () => {
  it("initial squad tier state matches reference baseline", () => {
    const state = configReducer(INITIAL_CONFIG_STATE, {
      type: "SET_TIER",
      tier: "squad",
    });
    expect(Array.from(state.objectives)).toEqual(referenceExpected.initialObjs);
    expect(state.billing).toBe(referenceExpected.initialBilling);
  });

  it("blocks deselecting the last objective in squad tier (Source: lines 14981-14985)", () => {
    const state = configReducer(INITIAL_CONFIG_STATE, {
      type: "SET_TIER",
      tier: "squad",
    });
    // Attempt to toggle off the single active objective
    const blockedState = configReducer(state, {
      type: "TOGGLE_OBJECTIVE",
      objectiveId: "gtm",
    });
    expect(blockedState).toBe(state);
    expect(Array.from(blockedState.objectives)).toEqual(
      referenceExpected.afterBlockedClickObjs
    );
  });

  it("allows adding second objective and removing the first (multi-select)", () => {
    let state = configReducer(INITIAL_CONFIG_STATE, {
      type: "SET_TIER",
      tier: "squad",
    });
    state = configReducer(state, {
      type: "TOGGLE_OBJECTIVE",
      objectiveId: "dir",
    });
    expect(Array.from(state.objectives).sort()).toEqual(
      referenceExpected.afterAddDirObjs.sort()
    );

    state = configReducer(state, {
      type: "TOGGLE_OBJECTIVE",
      objectiveId: "gtm",
    });
    expect(Array.from(state.objectives)).toEqual(
      referenceExpected.afterRemoveGtmObjs
    );

    // Now 'dir' is the only objective; deselecting it must be blocked
    const blockedDir = configReducer(state, {
      type: "TOGGLE_OBJECTIVE",
      objectiveId: "dir",
    });
    expect(blockedDir).toBe(state);
    expect(Array.from(blockedDir.objectives)).toEqual(
      referenceExpected.afterBlockedDirObjs
    );
  });

  it("toggles billing between monthly and annual (Source: lines 15061-15074)", () => {
    let state = configReducer(INITIAL_CONFIG_STATE, {
      type: "SET_TIER",
      tier: "squad",
    });
    state = configReducer(state, { type: "SET_BILLING", billing: "yr" });
    expect(state.billing).toBe(referenceExpected.billingYr);

    state = configReducer(state, { type: "SET_BILLING", billing: "mo" });
    expect(state.billing).toBe(referenceExpected.billingMo);
  });
});
