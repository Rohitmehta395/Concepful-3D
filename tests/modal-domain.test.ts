import { describe, expect, it } from "vitest";
import { formatWelcomeHeading, validateLeadSubmission } from "@/domain/lead";

describe("lead domain validation (reference lines 15075-15087)", () => {
  it("formats welcome heading with empty company name", () => {
    expect(formatWelcomeHeading("")).toBe("Welcome to the server");
    expect(formatWelcomeHeading("   ")).toBe("Welcome to the server");
  });

  it("formats welcome heading with company name", () => {
    expect(formatWelcomeHeading("Apex Foundry")).toBe(
      "Welcome to the server, Apex Foundry"
    );
    expect(formatWelcomeHeading("  Harbor & Vane  ")).toBe(
      "Welcome to the server, Harbor & Vane"
    );
  });

  it("validates empty submission without errors matching reference behavior", () => {
    const result = validateLeadSubmission({ company: "" });
    expect(result.valid).toBe(true);
    expect(result.company).toBe("");
    expect(result.welcomeHeading).toBe("Welcome to the server");
    expect(result.errors).toEqual({});
  });

  it("validates populated submission matching reference behavior", () => {
    const result = validateLeadSubmission({
      company: "Apex Foundry",
      start: "This week",
      mission: "Rebrand ahead of Series A",
    });
    expect(result.valid).toBe(true);
    expect(result.company).toBe("Apex Foundry");
    expect(result.welcomeHeading).toBe("Welcome to the server, Apex Foundry");
    expect(result.errors).toEqual({});
  });
});
