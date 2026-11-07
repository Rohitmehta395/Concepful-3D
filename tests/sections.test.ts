import { describe, expect, it } from "vitest";
import { BRAND, NAV_CTA, NAV_LINKS, SECTION_IDS } from "../src/content";

describe("Section IDs and Navigation Link Consistency", () => {
  it("BRAND href points to the intro section", () => {
    expect(BRAND.href).toBe(`#${SECTION_IDS.intro}`);
  });

  it("NAV_LINKS point to their corresponding canonical section IDs", () => {
    expect(NAV_LINKS).toHaveLength(3);
    expect(NAV_LINKS[0]?.href).toBe(`#${SECTION_IDS.classes}`);
    expect(NAV_LINKS[1]?.href).toBe(`#${SECTION_IDS.howItWorks}`);
    expect(NAV_LINKS[2]?.href).toBe(`#${SECTION_IDS.plans}`);
  });

  it("NAV_CTA points to the build section", () => {
    expect(NAV_CTA.href).toBe(`#${SECTION_IDS.build}`);
  });

  it("SECTION_IDS map to unique, non-empty anchor slugs including rules, plans, and outro", () => {
    expect(SECTION_IDS.rules).toBe("rules");
    expect(SECTION_IDS.plans).toBe("plans");
    expect(SECTION_IDS.outro).toBe("outro");
    const ids = Object.values(SECTION_IDS);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
    ids.forEach((id) => {
      expect(typeof id).toBe("string");
      expect(id.length).toBeGreaterThan(0);
      expect(id).not.toContain("#");
      expect(id).not.toContain(" ");
    });
  });
});
