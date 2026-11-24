import { describe, expect, it } from "vitest";
import { configReducer, INITIAL_CONFIG_STATE } from "@/domain/config";
import { shipFor } from "@/domain/ship";
import { quote } from "@/domain/quote";

// Expected flagship reaches and pricing extracted from live reference/Concepful_Mech_Builder.html
// Source: lines 14742-14751 (shipFor) and 15000-15006 (tog buffs)
const referenceCombineRules = {
  initialReach: "local",
  afterBuff1: "regional", // 1 buff -> regional (n <= 2)
  afterBuff2: "regional", // 2 buffs -> regional (n <= 2)
  afterBuff3: "national", // 3 buffs -> national (n <= 4)
  afterBuff4: "national", // 4 buffs -> national (n <= 4)
  afterBuff5: "global", // 5 buffs -> global (n > 4)
  afterBuff6: "global", // 6 buffs -> global
  afterBuff7: "global", // 7 buffs -> global
};

describe("Combine Reducer & Flagship Parity Test Suite", () => {
  it("initial combine tier state sets reach to local and empty buffs", () => {
    const state = configReducer(INITIAL_CONFIG_STATE, {
      type: "SET_TIER",
      tier: "combine",
    });
    expect(state.tier).toBe("combine");
    expect(state.buffs.size).toBe(0);
    expect(state.reach).toBe(referenceCombineRules.initialReach);
  });

  it("dynamically upgrades flagship reach through cumulative raid buffs (Source: shipFor)", () => {
    let state = configReducer(INITIAL_CONFIG_STATE, {
      type: "SET_TIER",
      tier: "combine",
    });

    // Buff 1: 3d -> regional
    state = configReducer(state, { type: "TOGGLE_BUFF", buffId: "3d" });
    expect(state.buffs.size).toBe(1);
    expect(state.reach).toBe(referenceCombineRules.afterBuff1);
    expect(shipFor(state.buffs)).toBe("regional");

    // Buff 2: fab -> regional
    state = configReducer(state, { type: "TOGGLE_BUFF", buffId: "fab" });
    expect(state.buffs.size).toBe(2);
    expect(state.reach).toBe(referenceCombineRules.afterBuff2);
    expect(shipFor(state.buffs)).toBe("regional");

    // Buff 3: hw -> national
    state = configReducer(state, { type: "TOGGLE_BUFF", buffId: "hw" });
    expect(state.buffs.size).toBe(3);
    expect(state.reach).toBe(referenceCombineRules.afterBuff3);
    expect(shipFor(state.buffs)).toBe("national");

    // Buff 4: flow -> national
    state = configReducer(state, { type: "TOGGLE_BUFF", buffId: "flow" });
    expect(state.buffs.size).toBe(4);
    expect(state.reach).toBe(referenceCombineRules.afterBuff4);
    expect(shipFor(state.buffs)).toBe("national");

    // Buff 5: cmd -> global
    state = configReducer(state, { type: "TOGGLE_BUFF", buffId: "cmd" });
    expect(state.buffs.size).toBe(5);
    expect(state.reach).toBe(referenceCombineRules.afterBuff5);
    expect(shipFor(state.buffs)).toBe("global");

    // Buff 6: intel -> global
    state = configReducer(state, { type: "TOGGLE_BUFF", buffId: "intel" });
    expect(state.buffs.size).toBe(6);
    expect(state.reach).toBe(referenceCombineRules.afterBuff6);
    expect(shipFor(state.buffs)).toBe("global");

    // Buff 7: rush -> global
    state = configReducer(state, { type: "TOGGLE_BUFF", buffId: "rush" });
    expect(state.buffs.size).toBe(7);
    expect(state.reach).toBe(referenceCombineRules.afterBuff7);
    expect(shipFor(state.buffs)).toBe("global");
  });

  it("dynamically downscales flagship reach when removing buffs", () => {
    let state = configReducer(INITIAL_CONFIG_STATE, {
      type: "SET_TIER",
      tier: "combine",
    });

    // Add 5 buffs -> global
    const buffList = ["3d", "fab", "hw", "flow", "cmd"] as const;
    for (const b of buffList) {
      state = configReducer(state, { type: "TOGGLE_BUFF", buffId: b });
    }
    expect(state.reach).toBe("global");

    // Remove cmd -> 4 buffs left -> national
    state = configReducer(state, { type: "TOGGLE_BUFF", buffId: "cmd" });
    expect(state.buffs.size).toBe(4);
    expect(state.reach).toBe("national");

    // Remove flow and hw -> 2 buffs left -> regional
    state = configReducer(state, { type: "TOGGLE_BUFF", buffId: "flow" });
    state = configReducer(state, { type: "TOGGLE_BUFF", buffId: "hw" });
    expect(state.buffs.size).toBe(2);
    expect(state.reach).toBe("regional");

    // Remove fab and 3d -> 0 buffs left -> local
    state = configReducer(state, { type: "TOGGLE_BUFF", buffId: "fab" });
    state = configReducer(state, { type: "TOGGLE_BUFF", buffId: "3d" });
    expect(state.buffs.size).toBe(0);
    expect(state.reach).toBe("local");
  });

  it("properly computes quote in combine tier with monthly and annual billing", () => {
    let state = configReducer(INITIAL_CONFIG_STATE, {
      type: "SET_TIER",
      tier: "combine",
    });
    // Base monthly is $9,500
    let q = quote(state);
    expect(q.total).toBe(9500);
    expect(q.disc).toBe(0);

    // Switch to annual: 10% discount -> total = 8550, disc = 950
    state = configReducer(state, { type: "SET_BILLING", billing: "yr" });
    q = quote(state);
    expect(q.total).toBe(8550);
    expect(q.disc).toBe(950);

    // Add 3D visualization buff ($3,000/mo) in annual mode
    state = configReducer(state, { type: "TOGGLE_BUFF", buffId: "3d" });
    q = quote(state);
    // Base 9500 * 0.9 = 8550 + 3000 * 0.9 = 2700 -> total 11250, disc = 1250
    expect(q.total).toBe(11250);
    expect(q.disc).toBe(1250);
  });
});
