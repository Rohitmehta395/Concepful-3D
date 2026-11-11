import { describe, it, expect, vi } from "vitest";
import {
  computeScroll,
  type SectionBounds,
  createScrollDriver,
} from "@/engine/scroll";

// Original storyScan algorithm extracted directly from reference lines 11953-11970
function originalStoryScan(
  sections: { scene: string; top: number; bottom: number; height: number }[],
  H: number
) {
  let key = "intro";
  let p = 0;
  const mid = H * 0.5;

  sections.forEach((s) => {
    if (s.top <= mid && s.bottom > mid) {
      key = s.scene;
      p = Math.max(
        0,
        Math.min(1, (mid - s.top) / Math.max(1, s.height - H * 0.2))
      );
    }
  });

  return { key, p };
}

describe("Task 4: computeScroll Differential Unit Tests", () => {
  it("compares computeScroll against original storyScan on 1,000 randomized layouts and edge cases", () => {
    const sceneIds = [
      "intro",
      "classes",
      "logi",
      "rules",
      "stages",
      "outro",
      "app",
    ];
    const viewports = [390, 768, 1080, 1280, 1920];

    // Seeded pseudo-random generator for 100% reproducible fixtures
    let seed = 42;
    function rand() {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    }

    let iterations = 0;

    for (const H of viewports) {
      for (let testIdx = 0; testIdx < 200; testIdx++) {
        iterations++;
        // Construct a realistic sequential section layout
        const sectionBounds: SectionBounds[] = [];
        const originalSections: {
          scene: string;
          top: number;
          bottom: number;
          height: number;
        }[] = [];

        let currentY = 0;
        for (let i = 0; i < sceneIds.length; i++) {
          const height = Math.round(500 + rand() * 1500); // 500px to 2000px height
          const sceneId = sceneIds[i] ?? "intro";
          sectionBounds.push({
            sceneId,
            top: currentY,
            height,
          });
          currentY += height;
        }

        // Test at various scroll positions including section boundary edge cases
        const totalHeight = currentY;
        const scrollPositions = [
          0,
          1,
          totalHeight - H,
          totalHeight,
          // Exact section midpoint transitions:
          ...sectionBounds.map((s) => Math.max(0, s.top - H * 0.5)),
          ...sectionBounds.map((s) => Math.max(0, s.top + s.height - H * 0.5)),
          // Random positions:
          Math.round(rand() * totalHeight),
          Math.round(rand() * totalHeight),
        ];

        for (const scrollY of scrollPositions) {
          // Convert absolute bounds to relative getBoundingClientRect style rects as in prototype
          const refRects = sectionBounds.map((s) => ({
            scene: s.sceneId,
            top: s.top - scrollY,
            bottom: s.top - scrollY + s.height,
            height: s.height,
          }));

          const expected = originalStoryScan(refRects, H);
          const actual = computeScroll(sectionBounds, scrollY, H);

          expect(actual.activeScene).toBe(expected.key);
          expect(Math.abs(actual.activeProgress - expected.p)).toBeLessThan(
            1e-9
          );
        }
      }
    }

    expect(iterations).toBe(1000);
  });

  it("verifies section offsets are cached and NOT re-measured on every frame (120 frames test)", () => {
    const driver = createScrollDriver();

    // Mock DOM getBoundingClientRect
    const fakeRect = {
      top: 100,
      bottom: 600,
      height: 500,
      left: 0,
      right: 300,
      width: 300,
    };
    const spy = vi.fn().mockReturnValue(fakeRect);

    const fakeElements = [
      {
        getAttribute: (attr: string) =>
          attr === "data-scene" ? "intro" : null,
        getBoundingClientRect: spy,
      },
      {
        getAttribute: (attr: string) =>
          attr === "data-scene" ? "classes" : null,
        getBoundingClientRect: spy,
      },
    ];

    vi.stubGlobal("document", {
      querySelectorAll: () => fakeElements,
    });
    vi.stubGlobal("window", {
      scrollY: 150,
      innerHeight: 900,
    });

    // Initial mount measurement
    driver.measureSections();
    expect(spy).toHaveBeenCalledTimes(2);

    // Run 120 animation frames of update()
    for (let frame = 1; frame <= 120; frame++) {
      driver.update(1000 + frame * 16.67);
    }

    // getBoundingClientRect must NOT have been called during the 120 frames!
    expect(spy).toHaveBeenCalledTimes(2);

    vi.unstubAllGlobals();
  });
});
