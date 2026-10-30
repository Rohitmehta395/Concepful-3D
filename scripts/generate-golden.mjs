/**
 * generate-golden.mjs
 * No external dependencies. Loads the original source into a Node vm sandbox,
 * runs ORIGINAL functions over the reachable state space, and writes
 * tests/fixtures/golden.json with recorded outputs.
 *
 * REACHABLE STATE SPACE RATIONALE
 * ─────────────────────────────────
 * Tier-gated exhaustive enumeration (430 cases):
 *   solo:    9 missions × 2^3 gear subsets × 2 billing = 144
 *   squad:   (2^4−1) nonempty obj subsets × 2 billing   = 30
 *   combine: 2^7 buff subsets × 2 billing, reach=shipFor()= 256
 *
 * Cross-tier targeted cases (all single-field deviations from default +
 * all pairwise combos of interacting fields per the dependency table).
 * These are the states that can be reached via cross-tier navigation
 * because state is NOT cleared on tier switch.
 *
 * Total: exhaustive 430 + targeted cross-tier cases (written below).
 * Cases > 2 MB are avoided; this file is ~600 KB.
 *
 * The 3,000+ seeded-sample cross-product states are NOT stored here;
 * they are generated at test-time inside tests/differential.test.ts by
 * running the original vm inline. This avoids blowing the fixture budget.
 */

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const htmlPath = path.join(rootDir, "reference", "Concepful_Mech_Builder.html");
const html = fs.readFileSync(htmlPath, "utf8");
const lines = html.split("\n");

// Locate quote(), units(), leaders(), and shipFor()
const quoteLineIdx = lines.findIndex((l) => l.includes("function quote()"));
const unitsLineIdx = lines.findIndex((l) => l.includes("function units()"));
const shipForLineIdx = lines.findIndex((l) =>
  l.includes("const shipFor = () =>")
);

if (quoteLineIdx === -1 || unitsLineIdx === -1 || shipForLineIdx === -1) {
  throw new Error(
    `Failed to locate original functions: quote=${quoteLineIdx}, units=${unitsLineIdx}, shipFor=${shipForLineIdx}`
  );
}

console.log(
  `Found original functions: units() at line ${unitsLineIdx + 1}, quote() at line ${quoteLineIdx + 1}, shipFor() at line ${shipForLineIdx + 1}`
);

// Extract lines 2288 through 2640 (pricing data, state, units, leaders, quote)
// Extract lines 14742 through 14751 (shipFor)
const part1 = lines.slice(2287, 2640).join("\n");
const part2 = lines.slice(14741, 14751).join("\n");

const bridge = `
globalThis.TIERS = TIERS;
globalThis.QUESTS = QUESTS;
globalThis.GEAR = GEAR;
globalThis.OBJECTIVES = OBJECTIVES;
globalThis.BUFFS = BUFFS;
globalThis.CLASSES = CLASSES;

globalThis.quote = quote;
globalThis.units = units;
globalThis.leaders = leaders;
globalThis.shipFor = shipFor;

globalThis.applyState = function(s) {
  tier = s.tier;
  mission = s.mission;
  billing = s.billing;
  reach = s.reach;
  company = s.company ?? "";

  extras.clear();
  if (s.extras) {
    for (const x of s.extras) extras.add(x);
  }

  objs.clear();
  if (s.objectives) {
    for (const o of s.objectives) objs.add(o);
  }

  buffs.clear();
  if (s.buffs) {
    for (const b of s.buffs) buffs.add(b);
  }
};
`;

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(part1 + "\n" + part2 + "\n" + bridge, sandbox);

// Helper for power sets
function powerSet(array) {
  const result = [[]];
  for (const element of array) {
    const len = result.length;
    for (let i = 0; i < len; i++) {
      result.push([...result[i], element]);
    }
  }
  return result;
}

const allMissions = sandbox.QUESTS.map((q) => q.id);
const allGear = sandbox.GEAR.map((g) => g.id);
const allObjectives = sandbox.OBJECTIVES.map((o) => o.id);
const allBuffs = sandbox.BUFFS.map((b) => b.id);
const gearSubsets = powerSet(allGear);
const buffSubsets = powerSet(allBuffs);
// Objective subsets: non-empty
const objectiveSubsets = powerSet(allObjectives).filter((s) => s.length > 0);
const billings = ["mo", "yr"];

/** Record outputs from original vm for a given state descriptor. */
function capture(state) {
  sandbox.applyState(state);
  return {
    state,
    quote: sandbox.quote(),
    shipFor: sandbox.shipFor(),
    units: sandbox.units(),
    leaders: Array.from(sandbox.leaders()),
  };
}

const cases = [];
const seen = new Set();

function addCase(state) {
  // Stable dedup key
  const key = JSON.stringify({
    tier: state.tier,
    mission: state.mission ?? "brand",
    billing: state.billing ?? "mo",
    reach: state.reach ?? "local",
    extras: (state.extras ?? []).slice().sort(),
    objectives: (state.objectives ?? ["gtm"]).slice().sort(),
    buffs: (state.buffs ?? []).slice().sort(),
  });
  if (seen.has(key)) return;
  seen.add(key);
  cases.push(capture(state));
}

// ── SECTION 1: Tier-gated exhaustive enumeration ─────────────────────────────

// Solo: 9 missions × 8 gear subsets × 2 billing = 144
for (const mission of allMissions) {
  for (const gear of gearSubsets) {
    for (const billing of billings) {
      addCase({
        tier: "solo",
        mission,
        reach: "local",
        billing,
        company: "",
        extras: gear,
        objectives: ["gtm"],
        buffs: [],
      });
    }
  }
}

// Squad: 15 nonempty obj subsets × 2 billing = 30
for (const objs of objectiveSubsets) {
  for (const billing of billings) {
    addCase({
      tier: "squad",
      mission: "brand",
      reach: "local",
      billing,
      company: "",
      extras: [],
      objectives: objs,
      buffs: [],
    });
  }
}

// Combine: 128 buff subsets × 2 billing, reach=shipFor() = 256
for (const bList of buffSubsets) {
  for (const billing of billings) {
    // Apply with reach=local first to determine shipFor result
    sandbox.applyState({
      tier: "combine",
      mission: "brand",
      reach: "local",
      billing,
      company: "",
      extras: [],
      objectives: ["gtm"],
      buffs: bList,
    });
    const ship = sandbox.shipFor();
    addCase({
      tier: "combine",
      mission: "brand",
      reach: ship,
      billing,
      company: "",
      extras: [],
      objectives: ["gtm"],
      buffs: bList,
    });
  }
}

const exhaustiveCount = cases.length;
console.log(`Exhaustive cases: ${exhaustiveCount}`);

// ── SECTION 2: Targeted cross-tier cases ─────────────────────────────────────
//
// State persists across tier switches. So after switching tiers, a user can
// have non-default values in fields the current tier doesn't render.
// These test that quote(), units(), leaders(), shipFor() each behave correctly
// when "foreign" state fields carry non-default values.
//
// Dependency table (from original source):
//   quote():   tier, mission, extras (via exOn), objectives (via objOn), buffs, billing
//              reads: tier, mission, extras, objectives, buffs, billing
//              ignores: reach, company
//   units():   tier, objectives (via objOn), buffs (companion units in combine)
//              ignores: mission, extras, billing, reach, company
//   leaders(): tier, objectives (via objOn)
//              ignores: mission, extras, buffs, billing, reach, company
//   shipFor(): buffs (count only)
//              ignores: all other fields
//
// Interacting field pairs:
//   quote × solo:  (mission, extras) — exOn checks both
//   quote × squad: (objectives, billing)
//   quote × combine: (buffs, billing)
//   units × combine: (objectives, buffs) — combine unions all obj rosters + companion buffs
//   leaders × tier: (tier, objectives)

// Single-field deviations from initial default in each tier
const defaultState = {
  tier: "solo",
  mission: "brand",
  reach: "local",
  billing: "mo",
  company: "",
  extras: [],
  objectives: ["gtm"],
  buffs: [],
};

// Every tier × every mission
for (const tier of ["solo", "squad", "combine"]) {
  for (const mission of allMissions) {
    addCase({ ...defaultState, tier, mission });
  }
}

// Every tier × each single extra
for (const tier of ["solo", "squad", "combine"]) {
  for (const gear of allGear) {
    addCase({ ...defaultState, tier, extras: [gear] });
  }
}

// Every tier × each single objective
for (const tier of ["solo", "squad", "combine"]) {
  for (const obj of allObjectives) {
    addCase({ ...defaultState, tier, objectives: [obj] });
  }
}

// Every tier × each single buff
for (const tier of ["solo", "squad", "combine"]) {
  for (const buff of allBuffs) {
    addCase({ ...defaultState, tier, buffs: [buff] });
  }
}

// Every tier × both billing modes
for (const tier of ["solo", "squad", "combine"]) {
  for (const billing of billings) {
    addCase({ ...defaultState, tier, billing });
  }
}

// Pairwise: mission × extras in solo (exOn interaction)
for (const mission of allMissions) {
  for (const gear of allGear) {
    addCase({ ...defaultState, tier: "solo", mission, extras: [gear] });
  }
  // All gear on
  addCase({ ...defaultState, tier: "solo", mission, extras: allGear });
}

// Pairwise: objectives × billing in squad
for (const objs of objectiveSubsets) {
  for (const billing of billings) {
    addCase({ ...defaultState, tier: "squad", objectives: objs, billing });
  }
}

// Pairwise: buffs × billing in combine
for (const buff of allBuffs) {
  for (const billing of billings) {
    sandbox.applyState({ ...defaultState, tier: "combine", buffs: [buff] });
    const ship = sandbox.shipFor();
    addCase({
      ...defaultState,
      tier: "combine",
      buffs: [buff],
      billing,
      reach: ship,
    });
  }
}

// Cross-tier: squad objectives retained when switching to combine
// (units() and leaders() see them in combine because objOn always returns true)
for (const objs of objectiveSubsets) {
  for (const buff of allBuffs) {
    addCase({
      tier: "combine",
      mission: "brand",
      reach: "regional",
      billing: "mo",
      company: "",
      extras: [],
      objectives: objs,
      buffs: [buff],
    });
  }
}

// Cross-tier: solo extras retained in squad (exOn won't fire since tier != solo)
for (const gear of gearSubsets) {
  addCase({
    ...defaultState,
    tier: "squad",
    extras: gear,
    objectives: allObjectives,
    billing: "yr",
  });
}

// Full state: everything active in combine
addCase({
  tier: "combine",
  mission: "3d",
  reach: "global",
  billing: "yr",
  company: "Omega Corp",
  extras: allGear,
  objectives: allObjectives,
  buffs: allBuffs,
});

const targetedCount = cases.length - exhaustiveCount;
console.log(`Targeted cross-tier cases: ${targetedCount}`);
console.log(`Total cases: ${cases.length}`);

// ── WRITE golden.json ─────────────────────────────────────────────────────────
const fixturesDir = path.join(rootDir, "tests", "fixtures");
fs.mkdirSync(fixturesDir, { recursive: true });
const goldenPath = path.join(fixturesDir, "golden.json");
const json = JSON.stringify(cases, null, 2);
fs.writeFileSync(goldenPath, json, "utf8");

const stats = fs.statSync(goldenPath);
const sizeKB = (stats.size / 1024).toFixed(2);
const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
console.log(`Saved ${goldenPath}: ${sizeKB} KB (${sizeMB} MB).`);

if (stats.size > 2 * 1024 * 1024) {
  throw new Error(`golden.json exceeds 2 MB (${sizeMB} MB). Reduce cases.`);
}
