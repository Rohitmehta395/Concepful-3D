import { describe, it, expect, vi } from "vitest";
import { measureBox } from "@/engine/layout";
import { createEngine } from "@/engine/createEngine";
import * as THREE from "three";

describe("layout framing box measurement", () => {
  it("uses measured DOM element bounds instead of Phase 6 fallback constants whenever real elements exist", () => {
    // 1. Mobile W=390 with real panelTop & header bottom (different from 414 and 119.34375)
    const mobBox = measureBox(390, 800, 52, [], "app", {
      panelTop: 500,
    });
    expect(mobBox.y0).toBe(56); // 52 + 4, NOT 119.34375
    expect(mobBox.y1).toBe(496); // 500 - 4, NOT 410

    // 2. Desktop W=1280 with real #panel, #card, #boxart (different from 416, 1008, 256, 120, 680, 70)
    const d1280 = measureBox(1280, 800, 60, [], "app", {
      panelRight: 300,
      cardLeft: 950,
      cardWidth: 200,
      boxartHeight: 90,
      boxartTop: 620,
    });
    expect(d1280.x0).toBe(312); // 300 + 12, NOT 428
    expect(d1280.x1).toBeCloseTo(950 + (1280 - 950) * 0.35, 6);
    expect(d1280.y0).toBe(66); // 60 + 6, NOT 70
    expect(d1280.y1).toBe(630); // 620 + 10, NOT 690

    // 3. Desktop W=1920 with real #panel, #card, #boxart (different from 416, W-272, 256, 120, H-122.53125, 70)
    const d1920 = measureBox(1920, 800, 55, [], "app", {
      panelRight: 360,
      cardLeft: 1500,
      cardWidth: 300,
      boxartHeight: 80,
      boxartTop: 640,
    });
    expect(d1920.x0).toBe(372);
    expect(d1920.x1).toBeCloseTo(1500 + (1920 - 1500) * 0.35, 6);
    expect(d1920.y0).toBe(61);
    expect(d1920.y1).toBe(650);
  });

  it("engine reads live DOM elements (#panel, #card, #boxart) when present in app scene", () => {
    vi.stubGlobal("window", {
      innerWidth: 1280,
      innerHeight: 800,
      scrollY: 100,
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

    const elRects: Record<string, DOMRect> = {
      panel: { right: 320, top: 100 } as DOMRect,
      card: { left: 960, width: 220 } as DOMRect,
      boxart: { height: 100, top: 600 } as DOMRect,
    };

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
          fill: () => {},
          stroke: () => {},
          measureText: () => ({ width: 100 }),
          strokeText: () => {},
          fillText: () => {},
        }),
      }),
      querySelector: (sel: string) => {
        if (sel === "header.top") {
          return { getBoundingClientRect: () => ({ bottom: 58 }) };
        }
        return null;
      },
      querySelectorAll: (sel: string) => {
        if (sel === "[data-scene]") {
          return [
            {
              getAttribute: (a: string) => (a === "data-scene" ? "app" : null),
              getBoundingClientRect: () => ({ top: 0, height: 1000 }),
            },
          ];
        }
        return [];
      },
      getElementById: (id: string) =>
        elRects[id] ? { getBoundingClientRect: () => elRects[id] } : null,
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

    const engine = createEngine(mockCanvas, mockThree);
    engine.render();
    const box = engine.getBox();
    // Measured values must be used instead of constants (416+12=428, 70, 690)
    expect(box.x0).toBe(332);
    expect(box.y0).toBe(64);
    expect(box.y1).toBe(610);

    engine.dispose();
    vi.unstubAllGlobals();
  });
});
