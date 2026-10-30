import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const refPath = path.resolve(__dirname, "Concepful_Mech_Builder.html");
const fileUrl = `file:///${refPath.replace(/\\/g, "/")}`;
const baselineDir = path.resolve(__dirname, "baseline");

const viewports = [
  { name: "390", width: 390, height: 844, dsf: 1, label: "Mobile (iPhone 12/13/14)" },
  { name: "768", width: 768, height: 1024, dsf: 1, label: "Tablet (iPad Portrait)" },
  { name: "1280", width: 1280, height: 800, dsf: 1, label: "Desktop Standard" },
  { name: "1920", width: 1920, height: 1080, dsf: 1, label: "Desktop Wide / Full HD" },
];

const sections = [
  { id: "s-intro", filename: "01-intro.png", desc: "Hero section: Your Creative Department On Demand, flagship CS-99" },
  { id: "s-classes", filename: "02-classes.png", desc: "Hero mechs roster & units" },
  { id: "s-logi", filename: "03-logi.png", desc: "Horizontal mission log & 24h timeline" },
  { id: "s-rules", filename: "04-rules.png", desc: "Rules of engagement & async principles" },
  { id: "s-stages", filename: "05-stages.png", desc: "Choose your flagship / Pricing plans" },
  { id: "s-outro", filename: "06-outro.png", desc: "Outro CTA & Ready to launch" },
];

console.log("Starting reference baseline capture...");
console.log("Reference file:", fileUrl);
console.log("Output directory:", baselineDir);

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: [
    "--use-gl=angle",
    "--use-angle=default",
    "--enable-webgl",
    "--ignore-gpu-blocklist",
    "--disable-web-security",
  ],
});

const frameMetrics = {};
const networkAudit = { requests: [], failed: [] };
const consoleLogs = [];

for (const vp of viewports) {
  console.log(`\n========================================`);
  console.log(`Capturing Viewport: ${vp.name}px (${vp.label})`);
  console.log(`========================================`);

  const outDir = path.join(baselineDir, vp.name);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dsf,
  });

  const page = await context.newPage();

  page.on("request", (req) => {
    if (vp.name === "1280") {
      networkAudit.requests.push({ url: req.url(), method: req.method() });
    }
  });

  page.on("requestfailed", (req) => {
    networkAudit.failed.push({ url: req.url(), failure: req.failure()?.errorText });
  });

  page.on("console", (msg) => {
    if (vp.name === "1280") {
      consoleLogs.push({ type: msg.type(), text: msg.text() });
    }
  });

  await page.goto(fileUrl, { waitUntil: "networkidle" });
  // Wait for initial render, fonts, procedural textures, and WebGL
  await page.waitForTimeout(2000);

  // Measure frame cost (only at 1280px desktop baseline)
  if (vp.name === "1280") {
    console.log("Measuring frame rendering performance (180 frames)...");
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const deltas = [];
        let count = 0;
        let last = performance.now();
        const max = 180;
        function frame(now) {
          const dt = now - last;
          last = now;
          if (count > 0) deltas.push(dt);
          count++;
          if (count <= max) {
            requestAnimationFrame(frame);
          } else {
            const avg = deltas.reduce((a, b) => a + b, 0) / deltas.length;
            const min = Math.min(...deltas);
            const maxVal = Math.max(...deltas);
            const sorted = [...deltas].sort((a, b) => a - b);
            const p95 = sorted[Math.floor(sorted.length * 0.95)];
            resolve({
              sampleFrames: deltas.length,
              avgCallbackIntervalMs: parseFloat(avg.toFixed(2)),
              estimatedReciprocalFps: parseFloat((1000 / avg).toFixed(1)),
              minCallbackIntervalMs: parseFloat(min.toFixed(2)),
              maxCallbackIntervalMs: parseFloat(maxVal.toFixed(2)),
              p95CallbackIntervalMs: parseFloat(p95.toFixed(2)),
            });
          }
        }
        requestAnimationFrame(frame);
      });
    });
    frameMetrics.storyMode = metrics;
    console.log("Story mode frame metrics:", metrics);
  }

  // 1. Capture Full Page
  console.log(`[${vp.name}] Capturing 00-fullpage.png...`);
  await page.screenshot({
    path: path.join(outDir, "00-fullpage.png"),
    fullPage: true,
  });

  // 2. Capture Each Story Section
  for (const sec of sections) {
    console.log(`[${vp.name}] Capturing ${sec.filename} (${sec.id})...`);
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ block: "center", behavior: "instant" });
      }
    }, sec.id);

    // Let the rAF loop ease the 3D camera and canvas overlays to the target
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: path.join(outDir, sec.filename),
    });
  }

  // 3. Capture Configurator View (#build / body.app)
  console.log(`[${vp.name}] Capturing 07-configurator.png (#build)...`);
  await page.evaluate(() => {
    const buildEl = document.getElementById("build");
    if (buildEl) {
      buildEl.scrollIntoView({ block: "start", behavior: "instant" });
    }
  });
  await page.waitForTimeout(1200);

  // Measure configurator frame cost at 1280
  if (vp.name === "1280") {
    console.log("Measuring configurator mode frame performance...");
    const appMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const deltas = [];
        let count = 0;
        let last = performance.now();
        const max = 120;
        function frame(now) {
          const dt = now - last;
          last = now;
          if (count > 0) deltas.push(dt);
          count++;
          if (count <= max) {
            requestAnimationFrame(frame);
          } else {
            const avg = deltas.reduce((a, b) => a + b, 0) / deltas.length;
            resolve({
              sampleFrames: deltas.length,
              avgCallbackIntervalMs: parseFloat(avg.toFixed(2)),
              estimatedReciprocalFps: parseFloat((1000 / avg).toFixed(1)),
              minCallbackIntervalMs: parseFloat(Math.min(...deltas).toFixed(2)),
              maxCallbackIntervalMs: parseFloat(Math.max(...deltas).toFixed(2)),
            });
          }
        }
        requestAnimationFrame(frame);
      });
    });
    frameMetrics.configuratorMode = appMetrics;
    console.log("Configurator frame metrics:", appMetrics);
  }

  await page.screenshot({
    path: path.join(outDir, "07-configurator.png"),
  });

  // 4. Capture Guild Modal Dialog (#modal)
  console.log(`[${vp.name}] Capturing 08-modal.png (#modal)...`);
  await page.evaluate(() => {
    const modal = document.getElementById("modal");
    if (modal) {
      modal.hidden = false;
      const co = document.getElementById("co");
      if (co) co.focus();
    }
  });
  await page.waitForTimeout(600);

  await page.screenshot({
    path: path.join(outDir, "08-modal.png"),
  });

  await context.close();
}

// Extract WebGL context info
const testContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const testPage = await testContext.newPage();
await testPage.goto(fileUrl, { waitUntil: "networkidle" });
await testPage.waitForTimeout(1000);

const webglDetails = await testPage.evaluate(() => {
  const gl = document.getElementById("gl")?.getContext("webgl2");
  if (!gl) return null;
  const ext = gl.getExtension("WEBGL_debug_renderer_info");
  return {
    contextType: "webgl2",
    vendor: ext ? gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR),
    renderer: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
    version: gl.getParameter(gl.VERSION),
    shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
  };
});
await testContext.close();
await browser.close();

console.log("\n========================================");
console.log("All baseline screenshots captured!");
console.log("WebGL Details:", webglDetails);
console.log("Frame Metrics:", frameMetrics);
console.log("Network Audit:", {
  totalRequests: networkAudit.requests.length,
  failedCount: networkAudit.failed.length,
  failed: networkAudit.failed,
});
console.log("Console Logs Count:", consoleLogs.length);
console.log("========================================");

// Write metadata and frame metrics summary
const reportData = {
  timestamp: new Date().toISOString(),
  browser: "Google Chrome 155.0.8059.85 (via Playwright 1.64.1)",
  webglDetails,
  frameMetrics: {
    measurementMethod:
      "requestAnimationFrame delta tracking in headless browser (animation-frame callback intervals)",
    note:
      "Callback intervals measure script execution and rAF pacing in headless Chromium, not physical monitor refresh rate or hardware display FPS. estimatedReciprocalFps is purely a mathematical reciprocal estimate (1000 / avgCallbackIntervalMs).",
    ...frameMetrics,
  },
  networkAudit,
  consoleLogs,
};

fs.writeFileSync(
  path.join(baselineDir, "capture-metadata.json"),
  JSON.stringify(reportData, null, 2)
);
console.log("Wrote capture-metadata.json");
