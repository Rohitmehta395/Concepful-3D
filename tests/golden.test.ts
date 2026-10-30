import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { leaders, quote, shipFor, units } from "@/domain";
import type { ConfigStateInput, Quote } from "@/domain";

interface GoldenCase {
  readonly state: ConfigStateInput;
  readonly quote: Quote;
  readonly shipFor: string;
  readonly units: readonly string[];
  readonly leaders: readonly string[];
}

const goldenPath = path.resolve(__dirname, "fixtures", "golden.json");
const goldenCases: readonly GoldenCase[] = JSON.parse(
  fs.readFileSync(goldenPath, "utf8")
);

describe("Golden test suite (exhaustive state space against original source)", () => {
  it(`successfully loaded all ${goldenCases.length} golden fixtures`, () => {
    expect(goldenCases.length).toBeGreaterThan(0);
  });

  it.each(
    goldenCases.map((c, index) => ({
      index,
      tier: c.state.tier,
      billing: c.state.billing,
      mission: c.state.mission,
      extrasCount: Array.isArray(c.state.extras) ? c.state.extras.length : 0,
      buffsCount: Array.isArray(c.state.buffs) ? c.state.buffs.length : 0,
      expectedQuote: c.quote,
      expectedShip: c.shipFor,
      expectedUnits: c.units,
      expectedLeaders: c.leaders,
      fixture: c,
    }))
  )(
    "case #$index ($tier, mission=$mission, bill=$billing, extras=$extrasCount, buffs=$buffsCount) matches original outputs",
    ({ fixture }) => {
      const q = quote(fixture.state);
      expect(q).toEqual(fixture.quote);

      const sf = shipFor(fixture.state.buffs ?? []);
      expect(sf).toBe(fixture.shipFor);

      const u = units(fixture.state);
      expect(u).toEqual(fixture.units);

      const l = Array.from(leaders(fixture.state));
      expect(l).toEqual(fixture.leaders);
    }
  );
});
