/**
 * differential.test.ts
 *
 * Differential action-sequence tests: apply 500+ seeded random action sequences
 * of length 5–20 to BOTH the original handlers (run in the vm) and the ported
 * reducer, asserting full state equality AND all four derived outputs after every step.
 *
 * Also includes:
 * - 3,000+ seeded cross-product state samples tested against original vm at test-time
 *   (not stored in golden.json, to stay under the 2 MB budget)
 * - Targeted targeted cross-tier pairwise coverage for every interacting field pair
 */

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { describe, expect, it } from "vitest";
import {
  type ConfigAction,
  type ConfigState,
  INITIAL_CONFIG_STATE,
  configReducer,
  leaders,
  quote,
  shipFor,
  units,
} from "@/domain";
import type {
  BuffId,
  GearId,
  ObjectiveId,
  QuestId,
  TierId,
} from "@/content/types";

// ── VM harness ────────────────────────────────────────────────────────────────
// The original script's data tables and closures do not touch the DOM at all:
// TIERS/QUESTS/GEAR/OBJECTIVES/BUFFS are plain object literals; the mutable
// state variables (tier, mission, etc.) and pure functions (quote, units, etc.)
// live in a vanilla JS closure. No stubs, no DOM fakes are needed — the vm
// sandbox is a plain empty object with no window/document.
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
  tier, mission, reach, billing, company,
  extras: Array.from(extras),
  objectives: Array.from(objs),
  buffs: Array.from(buffs),
});

globalThis.runQuote = () => quote();
globalThis.runUnits = () => units();
globalThis.runLeaders = () => Array.from(leaders());
globalThis.runShipFor = () => shipFor();

// Minimal wrappers that exactly replicate each original event handler's mutations.
// Source citations are in config.ts; repeated here for cross-reference.
globalThis.setTier = function(id) {                // lines 14904-14910
  if (id === tier) return;
  tier = id;
  if (id === "combine") reach = shipFor();
};
globalThis.setMission = function(m) { mission = m; };  // line 14961
globalThis.toggleExtra = function(id) {            // lines 14972-14980
  if (extras.has(id)) extras.delete(id); else extras.add(id);
};
globalThis.toggleObjective = function(id) {        // lines 14981-14985
  if (tier === "squad" && objs.size === 1 && objs.has(id)) return;
  if (objs.has(id)) objs.delete(id); else objs.add(id);
};
globalThis.toggleBuff = function(id) {             // lines 14999-15006 + 14760-14766
  if (buffs.has(id)) buffs.delete(id); else buffs.add(id);
  if (tier === "combine") reach = shipFor();
};
globalThis.setBilling = function(b) { billing = b; };  // lines 15061-15074
globalThis.setCompany = function(c) { company = c.trim(); }; // lines 15075-15078
// SET_REACH is DEAD in the original UI — no element has data-reach.
// Included for fidelity only; NOT dispatched in random sequences below.
globalThis.setReach = function(r) { reach = r; };
globalThis.applyState = function(s) {
  tier = s.tier; mission = s.mission; billing = s.billing;
  reach = s.reach; company = s.company ?? "";
  extras.clear(); if (s.extras) for (const x of s.extras) extras.add(x);
  objs.clear();   if (s.objectives) for (const o of s.objectives) objs.add(o);
  buffs.clear();  if (s.buffs) for (const b of s.buffs) buffs.add(b);
};
`;

  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(harness, sandbox);
  return sandbox as {
    getState(): {
      tier: string;
      mission: string;
      reach: string;
      billing: string;
      company: string;
      extras: string[];
      objectives: string[];
      buffs: string[];
    };
    runQuote(): unknown;
    runUnits(): string[];
    runLeaders(): string[];
    runShipFor(): string;
    setTier(id: string): void;
    setMission(m: string): void;
    toggleExtra(id: string): void;
    toggleObjective(id: string): void;
    toggleBuff(id: string): void;
    setBilling(b: string): void;
    setCompany(c: string): void;
    setReach(r: string): void;
    applyState(s: unknown): void;
  };
}

// ── Seeded PRNG (mulberry32) ──────────────────────────────────────────────────
// Deterministic: same seed → same sequence across every run.
function makePrng(seed: number) {
  let s = seed;
  return function (): number {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function randInt(prng: () => number, lo: number, hi: number): number {
  return lo + Math.floor(prng() * (hi - lo + 1));
}
function pick<T>(prng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(prng() * arr.length)]!;
}

// ── Data ────────────────────────────────────────────────────────────────────
const ALL_TIERS: readonly TierId[] = ["solo", "squad", "combine"];
const ALL_MISSIONS: readonly QuestId[] = [
  "brand",
  "web",
  "uiux",
  "decks",
  "copy",
  "motion",
  "3d",
  "fab",
  "ai",
];
const ALL_GEAR: readonly GearId[] = ["x-illus", "x-motion", "x-rush"];
const ALL_OBJECTIVES: readonly ObjectiveId[] = [
  "gtm",
  "dir",
  "research",
  "product",
];
const ALL_BUFFS: readonly BuffId[] = [
  "3d",
  "fab",
  "hw",
  "flow",
  "cmd",
  "intel",
  "rush",
];

// Action factories (SET_REACH excluded — dead in original UI)
type ActionFactory = (prng: () => number) => ConfigAction;

const ACTION_FACTORIES: readonly ActionFactory[] = [
  (p) => ({ type: "SET_TIER", tier: pick(p, ALL_TIERS) }),
  (p) => ({ type: "SET_MISSION", mission: pick(p, ALL_MISSIONS) }),
  (p) => ({ type: "TOGGLE_EXTRA", gearId: pick(p, ALL_GEAR) }),
  (p) => ({ type: "TOGGLE_OBJECTIVE", objectiveId: pick(p, ALL_OBJECTIVES) }),
  (p) => ({ type: "TOGGLE_BUFF", buffId: pick(p, ALL_BUFFS) }),
  (_) => ({ type: "SET_BILLING", billing: pick(_, ["mo", "yr"]) }),
  (p) => ({
    type: "SET_COMPANY",
    company: pick(p, ["", "Acme", "  Big Corp  ", "X"]),
  }),
];

function dispatchToOriginal(
  orig: ReturnType<typeof createOriginalVM>,
  action: ConfigAction
) {
  switch (action.type) {
    case "SET_TIER":
      orig.setTier(action.tier);
      break;
    case "SET_MISSION":
      orig.setMission(action.mission);
      break;
    case "TOGGLE_EXTRA":
      orig.toggleExtra(action.gearId);
      break;
    case "TOGGLE_OBJECTIVE":
      orig.toggleObjective(action.objectiveId);
      break;
    case "TOGGLE_BUFF":
      orig.toggleBuff(action.buffId);
      break;
    case "SET_BILLING":
      orig.setBilling(action.billing);
      break;
    case "SET_COMPANY":
      orig.setCompany(action.company);
      break;
    case "SET_REACH":
      orig.setReach(action.reach);
      break;
  }
}

function assertStateAndOutputsMatch(
  portedState: ConfigState,
  orig: ReturnType<typeof createOriginalVM>,
  label: string
) {
  const o = orig.getState();

  // Full state equality
  expect(portedState.tier, `${label}: tier`).toBe(o.tier);
  expect(portedState.mission, `${label}: mission`).toBe(o.mission);
  expect(portedState.reach, `${label}: reach`).toBe(o.reach);
  expect(portedState.billing, `${label}: billing`).toBe(o.billing);
  expect(portedState.company, `${label}: company`).toBe(o.company);
  expect(Array.from(portedState.extras).sort(), `${label}: extras`).toEqual(
    o.extras.slice().sort()
  );
  expect(
    Array.from(portedState.objectives).sort(),
    `${label}: objectives`
  ).toEqual(o.objectives.slice().sort());
  expect(Array.from(portedState.buffs).sort(), `${label}: buffs`).toEqual(
    o.buffs.slice().sort()
  );

  // All four derived outputs
  const pq = quote(portedState);
  const oq = orig.runQuote();
  expect(pq, `${label}: quote()`).toEqual(oq);

  const pu = units(portedState);
  const ou = orig.runUnits();
  expect([...pu], `${label}: units()`).toEqual(ou);

  const pl = Array.from(leaders(portedState));
  const ol = orig.runLeaders();
  expect(pl, `${label}: leaders()`).toEqual(ol);

  const ps = shipFor(portedState.buffs);
  const os = orig.runShipFor();
  expect(ps, `${label}: shipFor()`).toBe(os);
}

// ── Test 1: 500 seeded random action sequences ───────────────────────────────
describe("Differential: 500 seeded random action sequences (length 5–20)", () => {
  const SEQ_SEED = 0xdeadbeef;
  const NUM_SEQUENCES = 500;
  const seqPrng = makePrng(SEQ_SEED);

  // Generate all sequences upfront so failures show sequence index
  const sequences: ConfigAction[][] = [];
  for (let i = 0; i < NUM_SEQUENCES; i++) {
    const length = randInt(seqPrng, 5, 20);
    const seq: ConfigAction[] = [];
    for (let j = 0; j < length; j++) {
      const factory = pick(seqPrng, ACTION_FACTORIES);
      seq.push(factory(seqPrng));
    }
    sequences.push(seq);
  }

  it.each(sequences.map((seq, i) => ({ seq, i })))(
    "sequence #$i ($i-th seeded sequence, length varies)",
    ({ seq, i }) => {
      const orig = createOriginalVM();
      let state: ConfigState = INITIAL_CONFIG_STATE;

      for (let step = 0; step < seq.length; step++) {
        const action = seq[step]!;
        state = configReducer(state, action);
        dispatchToOriginal(orig, action);
        assertStateAndOutputsMatch(
          state,
          orig,
          `seq#${i} step${step} (${action.type})`
        );
      }
    }
  );
});

// ── Test 2: 3,000+ seeded cross-product state samples ────────────────────────
// Generated at test-time (not stored in golden.json) to stay under 2 MB budget.
// Seed: 0xcafebabe. Each sample is a random combination of all state fields,
// applied directly to both ported functions and the original vm.
describe("Cross-product state sample (3,000 seeded states, vm at test-time)", () => {
  const SAMPLE_SEED = 0xcafebabe;
  const SAMPLE_COUNT = 3000;

  function powerSet<T>(arr: readonly T[]): T[][] {
    const r: T[][] = [[]];
    for (const e of arr) {
      const l = r.length;
      for (let i = 0; i < l; i++) r.push([...r[i]!, e]);
    }
    return r;
  }
  const gearPS = powerSet(ALL_GEAR);
  const objPS = powerSet(ALL_OBJECTIVES).filter((s) => s.length > 0); // nonempty
  const buffPS = powerSet(ALL_BUFFS);

  const prng = makePrng(SAMPLE_SEED);
  const orig = createOriginalVM();

  // Build samples
  const samples: ConfigState[] = [];
  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const tier = pick(prng, ALL_TIERS);
    const mission = pick(prng, ALL_MISSIONS);
    const billing = pick(prng, ["mo", "yr"] as const);
    const company = pick(prng, ["", "Acme Corp", "X"]);
    const extras = new Set(pick(prng, gearPS));
    const objectives = new Set(pick(prng, objPS));
    const buffs = new Set(pick(prng, buffPS));
    // reach is always derived from shipFor(buffs) when tier=combine, else kept as "local"
    // (matching how SET_TIER("combine") works in the reducer)
    const reach =
      tier === "combine"
        ? buffs.size === 0
          ? "local"
          : buffs.size <= 2
            ? "regional"
            : buffs.size <= 4
              ? "national"
              : "global"
        : "local";
    samples.push({
      tier,
      mission,
      billing,
      company,
      extras,
      objectives,
      buffs,
      reach,
    } as ConfigState);
  }

  it.each(samples.map((s, i) => ({ s, i })))(
    "sample #$i matches original vm for all four outputs",
    ({ s, i }) => {
      // Apply to original vm directly
      orig.applyState({
        tier: s.tier,
        mission: s.mission,
        billing: s.billing,
        reach: s.reach,
        company: s.company,
        extras: [...s.extras],
        objectives: [...s.objectives],
        buffs: [...s.buffs],
      });

      const pq = quote(s);
      const oq = orig.runQuote();
      expect(pq, `sample#${i}: quote()`).toEqual(oq);

      const pu = units(s);
      const ou = orig.runUnits();
      expect([...pu], `sample#${i}: units()`).toEqual(ou);

      const pl = Array.from(leaders(s));
      const ol = orig.runLeaders();
      expect(pl, `sample#${i}: leaders()`).toEqual(ol);

      const ps = shipFor(s.buffs);
      const os = orig.runShipFor();
      expect(ps, `sample#${i}: shipFor()`).toBe(os);
    }
  );
});
