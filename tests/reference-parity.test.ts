import { describe, expect, it } from "vitest";
import { CLASSES } from "@/content/classes";
import { GEAR } from "@/content/gear";
import { OBJECTIVES } from "@/content/objectives";
import { QUESTS } from "@/content/quests";
import { TEAMOF } from "@/content/roles";
import { TIERS } from "@/content/tiers";
import type {
  BuffId,
  GearId,
  ObjectiveId,
  QuestId,
  RoleId,
  TierId,
} from "@/content/types";
import type { BillingCycle } from "@/domain/config";
import { fmt, heroNameFor, priceLabelFor, prsLabelFor } from "@/domain/labels";
import { cidLabelFor, levelFor } from "@/domain/level";
import { quote } from "@/domain/quote";
import { units } from "@/domain/roster";
import { shipFor } from "@/domain/ship";
import fixtureData from "./fixtures/reference-states.json";

interface MismatchRecord {
  readonly index: number;
  readonly tier: string;
  readonly field: string;
  readonly expected: unknown;
  readonly actual: unknown;
  readonly selected: unknown;
}

describe("Reference Parity Test Suite (Part 6.3a)", () => {
  it("asserts all domain functions and content tables are defined", () => {
    expect(quote).toBeDefined();
    expect(shipFor).toBeDefined();
    expect(units).toBeDefined();
    expect(levelFor).toBeDefined();
    expect(cidLabelFor).toBeDefined();
    expect(prsLabelFor).toBeDefined();
    expect(heroNameFor).toBeDefined();
    expect(priceLabelFor).toBeDefined();
    expect(fmt).toBeDefined();
    expect(CLASSES).toBeDefined();
    expect(GEAR).toBeDefined();
    expect(OBJECTIVES).toBeDefined();
    expect(QUESTS).toBeDefined();
    expect(TEAMOF).toBeDefined();
    expect(TIERS).toBeDefined();
    expect(Array.isArray(fixtureData)).toBe(true);
    expect(fixtureData.length).toBe(358);
  });

  it("verifies 0 mismatches across all 358 reference fixture states", () => {
    const mismatches: MismatchRecord[] = [];
    let checkedCount = 0;

    for (let i = 0; i < fixtureData.length; i++) {
      const row = fixtureData[i]!;
      checkedCount++;

      const tier = row.tier as TierId;
      const mission = (row.selected.missions[0] as QuestId) ?? "brand";
      const extras = new Set<GearId>(row.selected.extras as GearId[]);
      const objectives = new Set<ObjectiveId>(
        row.selected.objectives as ObjectiveId[]
      );
      const buffs = new Set<BuffId>(row.selected.buffs as BuffId[]);
      const billing = row.selected.billing as BillingCycle;
      const reach = tier === "combine" ? shipFor(buffs) : "local";

      const state = {
        tier,
        mission,
        reach,
        billing,
        extras,
        objectives,
        buffs,
      };

      const q = quote(state);
      const computedReach = shipFor(buffs);
      const lv = levelFor(state);
      const cid = cidLabelFor(state);
      const prs = prsLabelFor(q);
      const cn = heroNameFor(state);
      const pr = priceLabelFor(q);

      // Verify cid matches "LV " + lv
      if (cid !== `LV ${lv}`) {
        mismatches.push({
          index: i,
          tier,
          field: "cidLabelFor !== LV + levelFor",
          expected: `LV ${lv}`,
          actual: cid,
          selected: row.selected,
        });
      }

      // 1. #pr price
      if (pr !== row.pr) {
        mismatches.push({
          index: i,
          tier,
          field: "#pr",
          expected: row.pr,
          actual: pr,
          selected: row.selected,
        });
      }

      // 2. #prs billing subtitle
      if (prs !== row.prs) {
        mismatches.push({
          index: i,
          tier,
          field: "#prs",
          expected: row.prs,
          actual: prs,
          selected: row.selected,
        });
      }

      // 3. #cn hero or flagship name (case-insensitive comparison because original DOM uses CSS uppercase or raw)
      if (cn.toUpperCase() !== row.cn.toUpperCase()) {
        mismatches.push({
          index: i,
          tier,
          field: "#cn",
          expected: row.cn,
          actual: cn,
          selected: row.selected,
        });
      }

      // 4. #cid level badge
      if (cid !== row.cid) {
        mismatches.push({
          index: i,
          tier,
          field: "#cid",
          expected: row.cid,
          actual: cid,
          selected: row.selected,
        });
      }

      // 5. #bp line count
      // Reference lines 14793-14798:
      // Base line (1) + Included line (1) + quote lines (q.lines.length) + discount line (1 if disc) + total line (1) + min commitment line (1 if T.min)
      const expectedLineCount =
        2 + q.lines.length + (q.disc > 0 ? 1 : 0) + 1 + (q.T.min ? 1 : 0);
      if (expectedLineCount !== row.cardItems.length) {
        mismatches.push({
          index: i,
          tier,
          field: "#bp line count",
          expected: row.cardItems.length,
          actual: expectedLineCount,
          selected: row.selected,
        });
      }

      // 6. Stats validation
      const usList = units(state);
      const cls = CLASSES.find((c) => c.id === computedReach);
      const clsIdx = cls ? CLASSES.indexOf(cls) : 0;
      const cnt = (k: RoleId) => usList.filter((id) => TEAMOF[id] === k).length;
      const desQ = ["brand", "uiux", "decks", "copy"].includes(mission);
      const exOn = (id: GearId) =>
        tier === "solo" &&
        extras.has(id) &&
        GEAR.find((e) => e.id === id)?.not !== mission;
      const bfOn = (id: BuffId) => tier === "combine" && buffs.has(id);

      const expectedStats: { label: string; val: string }[] =
        tier === "solo"
          ? [
              { label: "INT · Strategy", val: "2" },
              {
                label: "DEX · Design",
                val: String((desQ ? 7 : 2) + (exOn("x-illus") ? 2 : 0)),
              },
              {
                label: "STR · Production",
                val: String((desQ ? 2 : 7) + (exOn("x-motion") ? 2 : 0)),
              },
              { label: "STA · Operations", val: "2" },
              { label: "SPD · Speed", val: String(exOn("x-rush") ? 10 : 6) },
            ]
          : [
              {
                label: "INT · Strategy",
                val: String(Math.min(10, cnt("strategy") * 3)),
              },
              {
                label: "DEX · Design",
                val: String(Math.min(10, cnt("design") * 2)),
              },
              {
                label: "STR · Production",
                val: String(Math.min(10, cnt("production") * 3)),
              },
              {
                label: "STA · Operations",
                val: String(
                  Math.min(10, cnt("ops") * 2 + (bfOn("flow") ? 2 : 0))
                ),
              },
              {
                label: "RNG · Reach",
                val: String(tier === "combine" ? [3, 5, 8, 10][clsIdx] : 2),
              },
            ];

      for (let sIdx = 0; sIdx < expectedStats.length; sIdx++) {
        const exp = expectedStats[sIdx]!;
        const act = row.cardStats[sIdx];
        if (!act || act.val !== exp.val) {
          mismatches.push({
            index: i,
            tier,
            field: `stat[${exp.label}]`,
            expected: exp.val,
            actual: act ? act.val : undefined,
            selected: row.selected,
          });
        }
      }
    }

    // Print MISMATCH rows FIRST, then summary counts
    if (mismatches.length > 0) {
      console.error(`=== MISMATCHES DETECTED (${mismatches.length}) ===`);
      for (const m of mismatches) {
        console.error(
          `[MISMATCH] Row ${m.index} (${m.tier}) field ${m.field}: expected=${JSON.stringify(m.expected)} actual=${JSON.stringify(m.actual)} selected=${JSON.stringify(m.selected)}`
        );
      }
    }

    console.log("=== REFERENCE PARITY SUMMARY ===");
    console.log(`Total reference states checked: ${checkedCount}`);
    console.log(`Total mismatches: ${mismatches.length}`);

    expect(mismatches.length).toBe(0);
  });
});
