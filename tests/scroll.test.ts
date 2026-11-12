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

  it("engine-level test: scroll across all 7 scenes and verify 0 getBoundingClientRect calls over 120 idle frames", async () => {
    const THREE = await import("three");
    const { createEngine } = await import("@/engine/createEngine");

    const sceneKeys = [
      "intro",
      "classes",
      "logi",
      "rules",
      "stages",
      "outro",
      "build",
    ];

    let bcrCount = 0;
    const makeSpyRect = (rect: Partial<DOMRect>) => {
      return () => {
        bcrCount++;
        return {
          top: 0,
          bottom: 100,
          left: 0,
          right: 100,
          width: 100,
          height: 100,
          x: 0,
          y: 0,
          toJSON: () => ({}),
          ...rect,
        } as DOMRect;
      };
    };

    // 7 scene sections, each 1000px tall
    const sectionElements = sceneKeys.map((key, i) => ({
      getAttribute: (attr: string) => (attr === "data-scene" ? key : null),
      getBoundingClientRect: makeSpyRect({
        top: i * 1000,
        bottom: (i + 1) * 1000,
        height: 1000,
      }),
    }));

    // Header top
    const headerTop = {
      getBoundingClientRect: makeSpyRect({ bottom: 52 }),
    };

    // Story cards
    const storyCards = [
      {
        getBoundingClientRect: makeSpyRect({
          top: 100,
          bottom: 400,
          left: 20,
          right: 400,
          width: 380,
          height: 300,
        }),
      },
    ];

    let currentScrollY = 0;
    vi.stubGlobal("window", {
      innerWidth: 1280,
      innerHeight: 800,
      get scrollY() {
        return currentScrollY;
      },
      matchMedia: () => ({
        matches: false,
        addEventListener: () => {},
        removeEventListener: () => {},
      }),
      addEventListener: () => {},
      removeEventListener: () => {},
      requestAnimationFrame: (cb: FrameRequestCallback) => setTimeout(cb, 16),
      cancelAnimationFrame: (id: number) => clearTimeout(id),
    });

    vi.stubGlobal("Path2D", class {});
    vi.stubGlobal("document", {
      hidden: false,
      createElement: () => ({
        getContext: () => ({
          createLinearGradient: () => ({ addColorStop: () => {} }),
          createRadialGradient: () => ({ addColorStop: () => {} }),
          fillRect: () => {},
          strokeRect: () => {},
          beginPath: () => {},
          moveTo: () => {},
          lineTo: () => {},
          arc: () => {},
          save: () => {},
          restore: () => {},
          translate: () => {},
          scale: () => {},
          fill: () => {},
          stroke: () => {},
          measureText: () => ({ width: 100 }),
          strokeText: () => {},
          fillText: () => {},
        }),
      }),
      querySelector: (sel: string) => {
        if (sel === "header.top") return headerTop;
        if (sel === ".hz-head") return null;
        if (sel === ".hz-view") return null;
        return null;
      },
      querySelectorAll: (sel: string) => {
        if (sel === "[data-scene]") return sectionElements;
        if (sel === ".story .sc") return storyCards;
        return [];
      },
      getElementById: () => null,
      addEventListener: () => {},
      removeEventListener: () => {},
      fonts: { ready: Promise.resolve() },
    });

    const mockCanvas = {
      clientWidth: 1280,
      clientHeight: 800,
      parentElement: null,
    } as unknown as HTMLCanvasElement;

    const mockThree = {
      ...THREE,
      WebGLRenderer: class {
        setPixelRatio() {}
        setClearColor() {}
        setSize() {}
        render() {}
        dispose() {}
        forceContextLoss() {}
      },
      Clock: class {
        start() {}
        stop() {}
        getDelta() {
          return 0.016;
        }
      },
      PerspectiveCamera: class {
        position = new THREE.Vector3(0, 1, 14);
        fov = 30;
        aspect = 1;
        setViewOffset() {}
        updateProjectionMatrix() {}
        lookAt() {}
      },
      Scene: class {
        background = null;
        fog = null;
        add() {}
        remove() {}
        traverse() {}
      },
    } as unknown as typeof THREE;

    bcrCount = 0;
    const engine = createEngine(mockCanvas, mockThree);

    const initialBcrCount = bcrCount;
    console.log(
      `Engine init: ${initialBcrCount} getBoundingClientRect calls during initial measurement and framing.`
    );
    expect(initialBcrCount).toBeGreaterThan(0);

    // Scroll across all 7 scenes
    const sceneBcrCounts: Record<string, number> = {};
    for (let i = 0; i < sceneKeys.length; i++) {
      const scene = sceneKeys[i] ?? `scene-${i}`;
      // Midpoint of scene i: i * 1000 + 500. Midpoint of viewport: 800 / 2 = 400.
      // So scrollY = i * 1000 + 500 - 400 = i * 1000 + 100.
      currentScrollY = i * 1000 + 100;
      const bcrBefore = bcrCount;
      engine.render();
      const callsForScene = bcrCount - bcrBefore;
      sceneBcrCounts[scene] = callsForScene;
      expect(engine.getScrollState().activeScene).toBe(scene);
    }

    console.log(
      "getBoundingClientRect calls per scene transition:",
      sceneBcrCounts
    );

    // 120 idle frames at the current scroll position
    const idleStartCount = bcrCount;
    for (let f = 1; f <= 120; f++) {
      engine.render();
    }
    const idleCalls = bcrCount - idleStartCount;
    console.log(
      `Over 120 idle frames: ${idleCalls} getBoundingClientRect calls.`
    );

    expect(idleCalls).toBe(0);

    engine.dispose();
    vi.unstubAllGlobals();
  });
});
