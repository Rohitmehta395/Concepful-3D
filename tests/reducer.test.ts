import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { describe, expect, it } from "vitest";
import {
  type ConfigAction,
  type ConfigState,
  INITIAL_CONFIG_STATE,
  configReducer,
} from "@/domain";

// VM setup to run the original script's logic and event handlers
function createOriginalVM() {
  const htmlPath = path.resolve(
    __dirname,
    "..",
    "reference",
    "Concepful_Mech_Builder.html"
  );
  const html = fs.readFileSync(htmlPath, "utf8");
  const lines = html.split("\n");

  const part1 = lines.slice(2287, 2640).join("\n");
  const part2 = lines.slice(14741, 14751).join("\n");

  const harness = `
${part1}
${part2}

globalThis.getState = () => ({
  tier,
  mission,
  reach,
  billing,
  company,
  extras: Array.from(extras),
  objectives: Array.from(objs),
  buffs: Array.from(buffs),
});

// Emulate original click handlers
globalThis.setTier = function(id) {
  if (id === tier) return;
  tier = id;
  if (id === "combine") reach = shipFor();
};

globalThis.setMission = function(m) {
  mission = m;
};

globalThis.toggleExtra = function(id) {
  if (extras.has(id)) extras.delete(id);
  else extras.add(id);
};

globalThis.toggleObjective = function(id) {
  if (tier === "squad" && objs.size === 1 && objs.has(id)) {
    return;
  }
  if (objs.has(id)) objs.delete(id);
  else objs.add(id);
};

globalThis.toggleBuff = function(id) {
  if (buffs.has(id)) buffs.delete(id);
  else buffs.add(id);
  if (tier === "combine") {
    reach = shipFor();
  }
};

globalThis.setBilling = function(b) {
  billing = b;
};

globalThis.setCompany = function(c) {
  company = c.trim();
};

globalThis.setReach = function(r) {
  reach = r;
};
`;

  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(harness, sandbox);
  return sandbox as {
    getState: () => {
      tier: string;
      mission: string;
      reach: string;
      billing: string;
      company: string;
      extras: string[];
      objectives: string[];
      buffs: string[];
    };
    setTier: (id: string) => void;
    setMission: (m: string) => void;
    toggleExtra: (id: string) => void;
    toggleObjective: (id: string) => void;
    toggleBuff: (id: string) => void;
    setBilling: (b: string) => void;
    setCompany: (c: string) => void;
    setReach: (r: string) => void;
  };
}

describe("Config Reducer (isolated pure logic & VM replay comparison)", () => {
  it("initial state exactly matches original script defaults (Source: lines 2573-2580)", () => {
    const original = createOriginalVM();
    const origState = original.getState();

    expect(INITIAL_CONFIG_STATE.tier).toBe(origState.tier);
    expect(INITIAL_CONFIG_STATE.mission).toBe(origState.mission);
    expect(INITIAL_CONFIG_STATE.reach).toBe(origState.reach);
    expect(INITIAL_CONFIG_STATE.billing).toBe(origState.billing);
    expect(INITIAL_CONFIG_STATE.company).toBe(origState.company);
    expect(Array.from(INITIAL_CONFIG_STATE.extras)).toEqual(origState.extras);
    expect(Array.from(INITIAL_CONFIG_STATE.objectives)).toEqual(
      origState.objectives
    );
    expect(Array.from(INITIAL_CONFIG_STATE.buffs)).toEqual(origState.buffs);
  });

  it("SET_TIER: updates tier and updates reach to shipFor() only when tier is combine (Source: lines 14904-14910)", () => {
    let state = INITIAL_CONFIG_STATE;

    // Solo -> Squad: reach stays local
    state = configReducer(state, { type: "SET_TIER", tier: "squad" });
    expect(state.tier).toBe("squad");
    expect(state.reach).toBe("local");

    // Add 3 buffs in squad (reach not updated yet in squad)
    state = configReducer(state, { type: "TOGGLE_BUFF", buffId: "3d" });
    state = configReducer(state, { type: "TOGGLE_BUFF", buffId: "fab" });
    state = configReducer(state, { type: "TOGGLE_BUFF", buffId: "hw" });
    expect(state.reach).toBe("local");

    // Switch to combine: reach updates to shipFor(3 buffs) = "national" (Source: line 14910)
    state = configReducer(state, { type: "SET_TIER", tier: "combine" });
    expect(state.tier).toBe("combine");
    expect(state.reach).toBe("national");

    // Setting same tier returns unchanged state (Source: line 14905)
    const sameState = configReducer(state, {
      type: "SET_TIER",
      tier: "combine",
    });
    expect(sameState).toBe(state);

    // Switch back to squad: reach is preserved (Source: line 14906)
    state = configReducer(state, { type: "SET_TIER", tier: "squad" });
    expect(state.tier).toBe("squad");
    expect(state.reach).toBe("national");
  });

  it("SET_MISSION: changes mission without clearing conflicting extras (Source: lines 14960-14971)", () => {
    let state = INITIAL_CONFIG_STATE;
    // Select companion pet (x-motion)
    state = configReducer(state, { type: "TOGGLE_EXTRA", gearId: "x-motion" });
    expect(state.extras.has("x-motion")).toBe(true);

    // Switch mission to motion (which conflicts with x-motion via not: "motion")
    state = configReducer(state, { type: "SET_MISSION", mission: "motion" });
    expect(state.mission).toBe("motion");
    // Original retains x-motion in the set; suppression occurs dynamically in exOn()
    expect(state.extras.has("x-motion")).toBe(true);
  });

  it("TOGGLE_OBJECTIVE: prevents removing the last active objective in squad mode (Source: line 14982)", () => {
    let state = configReducer(INITIAL_CONFIG_STATE, {
      type: "SET_TIER",
      tier: "squad",
    });
    expect(state.objectives.size).toBe(1);
    expect(state.objectives.has("gtm")).toBe(true);

    // Attempting to toggle off the last objective in squad mode is blocked
    const blockedState = configReducer(state, {
      type: "TOGGLE_OBJECTIVE",
      objectiveId: "gtm",
    });
    expect(blockedState).toBe(state);
    expect(blockedState.objectives.has("gtm")).toBe(true);

    // Add another objective, then remove gtm -> allowed
    state = configReducer(state, {
      type: "TOGGLE_OBJECTIVE",
      objectiveId: "dir",
    });
    expect(state.objectives.size).toBe(2);

    state = configReducer(state, {
      type: "TOGGLE_OBJECTIVE",
      objectiveId: "gtm",
    });
    expect(state.objectives.size).toBe(1);
    expect(state.objectives.has("dir")).toBe(true);
  });

  it("TOGGLE_BUFF: dynamically updates reach via shipFor() when in combine tier (Source: lines 14760-14766)", () => {
    let state = configReducer(INITIAL_CONFIG_STATE, {
      type: "SET_TIER",
      tier: "combine",
    });
    expect(state.reach).toBe("local");

    // 1 buff -> regional
    state = configReducer(state, { type: "TOGGLE_BUFF", buffId: "3d" });
    expect(state.reach).toBe("regional");

    // 2 buffs -> regional
    state = configReducer(state, { type: "TOGGLE_BUFF", buffId: "fab" });
    expect(state.reach).toBe("regional");

    // 3 buffs -> national
    state = configReducer(state, { type: "TOGGLE_BUFF", buffId: "hw" });
    expect(state.reach).toBe("national");

    // 5 buffs -> global
    state = configReducer(state, { type: "TOGGLE_BUFF", buffId: "flow" });
    state = configReducer(state, { type: "TOGGLE_BUFF", buffId: "cmd" });
    expect(state.reach).toBe("global");

    // Remove buff -> back to 4 buffs (national)
    state = configReducer(state, { type: "TOGGLE_BUFF", buffId: "cmd" });
    expect(state.reach).toBe("national");
  });

  it("SET_BILLING & SET_COMPANY: mutate billing cycle and trimmed company name (Source: lines 15061-15078)", () => {
    let state = INITIAL_CONFIG_STATE;
    state = configReducer(state, { type: "SET_BILLING", billing: "yr" });
    expect(state.billing).toBe("yr");

    state = configReducer(state, {
      type: "SET_COMPANY",
      company: "  Acme Corp  ",
    });
    expect(state.company).toBe("Acme Corp");
  });

  it("SET_REACH: manually overrides reach (Source: lines 15008-15023)", () => {
    const state = configReducer(INITIAL_CONFIG_STATE, {
      type: "SET_REACH",
      reach: "global",
    });
    expect(state.reach).toBe("global");
  });

  it("Replays a complex sequence of 15 user actions against the original Node VM execution", () => {
    const original = createOriginalVM();
    let state: ConfigState = INITIAL_CONFIG_STATE;

    const actionSequence: readonly ConfigAction[] = [
      { type: "SET_TIER", tier: "squad" },
      { type: "TOGGLE_OBJECTIVE", objectiveId: "dir" },
      { type: "TOGGLE_OBJECTIVE", objectiveId: "research" },
      { type: "TOGGLE_OBJECTIVE", objectiveId: "gtm" },
      { type: "SET_BILLING", billing: "yr" },
      { type: "SET_COMPANY", company: "  Omega Protocol  " },
      { type: "SET_TIER", tier: "combine" },
      { type: "TOGGLE_BUFF", buffId: "3d" },
      { type: "TOGGLE_BUFF", buffId: "intel" },
      { type: "TOGGLE_BUFF", buffId: "hw" },
      { type: "SET_TIER", tier: "solo" },
      { type: "SET_MISSION", mission: "copy" },
      { type: "TOGGLE_EXTRA", gearId: "x-rush" },
      { type: "TOGGLE_EXTRA", gearId: "x-illus" },
      { type: "SET_BILLING", billing: "mo" },
    ];

    for (const action of actionSequence) {
      state = configReducer(state, action);

      switch (action.type) {
        case "SET_TIER":
          original.setTier(action.tier);
          break;
        case "SET_MISSION":
          original.setMission(action.mission);
          break;
        case "TOGGLE_EXTRA":
          original.toggleExtra(action.gearId);
          break;
        case "TOGGLE_OBJECTIVE":
          original.toggleObjective(action.objectiveId);
          break;
        case "TOGGLE_BUFF":
          original.toggleBuff(action.buffId);
          break;
        case "SET_BILLING":
          original.setBilling(action.billing);
          break;
        case "SET_COMPANY":
          original.setCompany(action.company);
          break;
        case "SET_REACH":
          original.setReach(action.reach);
          break;
      }

      const orig = original.getState();
      expect(state.tier).toBe(orig.tier);
      expect(state.mission).toBe(orig.mission);
      expect(state.reach).toBe(orig.reach);
      expect(state.billing).toBe(orig.billing);
      expect(state.company).toBe(orig.company);
      expect(Array.from(state.extras).sort()).toEqual(orig.extras.sort());
      expect(Array.from(state.objectives).sort()).toEqual(
        orig.objectives.sort()
      );
      expect(Array.from(state.buffs).sort()).toEqual(orig.buffs.sort());
    }
  });
});
