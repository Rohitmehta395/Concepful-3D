import fs from "node:fs";
import path from "node:path";

const chunksDir = path.resolve(process.cwd(), ".next/static/chunks");

if (!fs.existsSync(chunksDir)) {
  console.error(`Directory not found: ${chunksDir}. Run 'pnpm build' first.`);
  process.exit(1);
}

function findCssFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findCssFiles(full));
    } else if (entry.isFile() && entry.name.endsWith(".css")) {
      results.push(full);
    }
  }
  return results;
}

const cssFiles = findCssFiles(chunksDir);
console.log(
  `Scanning ${cssFiles.length} compiled CSS file(s) in ${chunksDir}...`
);

let totalWebkitCount = 0;
let totalStandardCount = 0;
let totalNotPrecededCount = 0;
let missingStandardViolations = 0;

for (const file of cssFiles) {
  const content = fs.readFileSync(file, "utf8");
  const ruleRegex = /\{([^}]+)\}/g;
  let match;
  let ruleIdx = 0;

  while ((match = ruleRegex.exec(content)) !== null) {
    ruleIdx++;
    const rule = match[1];

    const hasWebkit = /-webkit-backdrop-filter\s*:/.test(rule);
    const hasStandard = /(?<!-)\bbackdrop-filter\s*:/.test(rule);

    if (hasWebkit) totalWebkitCount++;
    if (hasStandard) totalStandardCount++;

    if (hasWebkit && !hasStandard) {
      missingStandardViolations++;
      console.error(
        `[ERROR] File ${path.relative(process.cwd(), file)} Rule #${ruleIdx}: has -webkit-backdrop-filter but missing standard backdrop-filter!`
      );
      console.error(`  Snippet: {${rule.slice(0, 100)}...}`);
    }

    if (hasStandard) {
      if (!hasWebkit) {
        totalNotPrecededCount++;
      } else {
        const webkitIdx = rule.search(/-webkit-backdrop-filter\s*:/);
        const standardIdx = rule.search(/(?<!-)\bbackdrop-filter\s*:/);
        if (standardIdx < webkitIdx) {
          totalNotPrecededCount++;
        }
      }
    }
  }
}

console.log(`\n=== Compiled CSS Backdrop-Filter Summary ===`);
console.log(`Total -webkit-backdrop-filter occurrences: ${totalWebkitCount}`);
console.log(
  `Total standard backdrop-filter occurrences: ${totalStandardCount}`
);
console.log(
  `Standard backdrop-filter occurrences NOT preceded by vendor prefix in rule: ${totalNotPrecededCount}`
);
console.log(
  `Rules with prefix but missing standard property: ${missingStandardViolations}`
);

if (missingStandardViolations > 0) {
  console.error(
    `\nFAILED: Found ${missingStandardViolations} rule(s) with vendor prefix but missing standard backdrop-filter.`
  );
  process.exit(1);
} else {
  console.log(
    `\nPASSED: All prefixed backdrop-filter rules have standard backdrop-filter.`
  );
  process.exit(0);
}
