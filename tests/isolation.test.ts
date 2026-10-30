import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("Domain isolation boundary tests", () => {
  const domainDir = path.resolve(__dirname, "..", "src", "domain");
  const files = fs
    .readdirSync(domainDir)
    .filter((file) => file.endsWith(".ts"));

  it("finds domain files to scan", () => {
    expect(files.length).toBeGreaterThan(0);
    expect(files).toContain("config.ts");
    expect(files).toContain("quote.ts");
    expect(files).toContain("ship.ts");
    expect(files).toContain("roster.ts");
    expect(files).toContain("index.ts");
  });

  it.each(files)(
    "file %s does not import react, three, next, or DOM globals",
    (file) => {
      const fullPath = path.join(domainDir, file);
      const content = fs.readFileSync(fullPath, "utf8");

      // Extract all import and export statements
      const importRegex =
        /(?:import|export)\s+(?:[\s\S]*?from\s+)?['"]([^'"]+)['"]/g;
      const importedModules: string[] = [];
      let match: RegExpExecArray | null;

      while ((match = importRegex.exec(content)) !== null) {
        if (match[1]) {
          importedModules.push(match[1]);
        }
      }

      // Assert no imports from react, three, next
      const forbiddenPackages = [
        "react",
        "react-dom",
        "three",
        "next",
        "next/navigation",
        "next/router",
        "next/server",
      ];

      for (const imported of importedModules) {
        for (const forbidden of forbiddenPackages) {
          const isDirect = imported === forbidden;
          const isSubpath = imported.startsWith(forbidden + "/");
          expect(
            isDirect || isSubpath,
            `${file} illegally imports forbidden package '${imported}'`
          ).toBe(false);
        }

        // Imports must only be relative (./) or from @/content
        const isAllowed =
          imported.startsWith("./") ||
          imported.startsWith("../") ||
          imported.startsWith("@/content");
        expect(
          isAllowed,
          `${file} imports external or unauthorized path '${imported}'`
        ).toBe(true);
      }

      // Assert no DOM globals are referenced in code
      const domGlobals = [
        /\bwindow\b/,
        /\bdocument\b/,
        /\bnavigator\b/,
        /\blocaction\b/,
        /\bHTMLElement\b/,
        /\blocalStorage\b/,
        /\bsessionStorage\b/,
        /\brequestAnimationFrame\b/,
      ];

      for (const pattern of domGlobals) {
        expect(
          pattern.test(content),
          `${file} references DOM global matching ${pattern}`
        ).toBe(false);
      }
    }
  );
});
