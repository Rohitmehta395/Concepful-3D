import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

export interface Violation {
  file: string;
  ruleIndex: number;
  reason: string;
  snippet: string;
}

export function checkCssPrefixOrder(
  cssContent: string,
  filename: string
): Violation[] {
  const violations: Violation[] = [];
  // Match rule blocks: { ... }
  const blockRegex = /\{([^}]+)\}/g;
  let match: RegExpExecArray | null;
  let ruleIndex = 0;

  while ((match = blockRegex.exec(cssContent)) !== null) {
    ruleIndex++;
    const block = match[1] ?? "";
    const hasWebkit = /-webkit-backdrop-filter\s*:/.test(block);
    // Standard backdrop-filter: not preceded by a dash or other alphanumeric character
    const hasStandard = /(?<!-)\bbackdrop-filter\s*:/.test(block);

    if (!hasWebkit && !hasStandard) {
      continue;
    }

    if (hasWebkit && !hasStandard) {
      violations.push({
        file: filename,
        ruleIndex,
        reason:
          "Missing standard 'backdrop-filter' declaration (only -webkit-backdrop-filter present)",
        snippet: block.trim(),
      });
      continue;
    }

    if (!hasWebkit && hasStandard) {
      violations.push({
        file: filename,
        ruleIndex,
        reason:
          "Missing vendor-prefixed '-webkit-backdrop-filter' declaration (only backdrop-filter present)",
        snippet: block.trim(),
      });
      continue;
    }

    // Both are present, verify order: -webkit-backdrop-filter must precede backdrop-filter
    const webkitIdx = block.search(/-webkit-backdrop-filter\s*:/);
    const standardIdx = block.search(/(?<!-)\bbackdrop-filter\s*:/);

    if (standardIdx < webkitIdx) {
      violations.push({
        file: filename,
        ruleIndex,
        reason:
          "Unprefixed 'backdrop-filter' declared before vendor-prefixed '-webkit-backdrop-filter'",
        snippet: block.trim(),
      });
    }
  }

  return violations;
}

describe("CSS prefix order guard for backdrop-filter", () => {
  const stylesDir = path.resolve(__dirname, "../src/styles");

  it("all CSS files in src/styles declare -webkit-backdrop-filter before backdrop-filter and never declare only one", () => {
    const files = fs.readdirSync(stylesDir).filter((f) => f.endsWith(".css"));
    const allViolations: Violation[] = [];

    for (const file of files) {
      const fullPath = path.join(stylesDir, file);
      const content = fs.readFileSync(fullPath, "utf8");
      const fileViolations = checkCssPrefixOrder(content, file);
      allViolations.push(...fileViolations);
    }

    expect(allViolations).toEqual([]);
  });

  it("fails when backdrop-filter is declared before -webkit-backdrop-filter", () => {
    const badCss = `
      .card {
        background: rgba(0,0,0,0.5);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }
    `;
    const violations = checkCssPrefixOrder(
      badCss,
      "deliberately-wrong-order.css"
    );
    expect(violations.length).toBeGreaterThan(0);
    expect(violations[0]?.reason).toContain("declared before");
  });

  it("fails when only backdrop-filter is declared", () => {
    const badCss = `
      .card {
        backdrop-filter: blur(10px);
      }
    `;
    const violations = checkCssPrefixOrder(badCss, "only-standard.css");
    expect(violations.length).toBeGreaterThan(0);
    expect(violations[0]?.reason).toContain("Missing vendor-prefixed");
  });

  it("fails when only -webkit-backdrop-filter is declared", () => {
    const badCss = `
      .card {
        -webkit-backdrop-filter: blur(10px);
      }
    `;
    const violations = checkCssPrefixOrder(badCss, "only-webkit.css");
    expect(violations.length).toBeGreaterThan(0);
    expect(violations[0]?.reason).toContain("Missing standard");
  });
});
