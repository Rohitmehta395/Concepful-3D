import { describe, it, expect, vi } from "vitest";
import * as THREE from "three";
import { createMaterialRegistry } from "@/engine/world/materials";
import { U3 } from "@/engine/models/uUnits";

describe("Part 4.14: U3 unit models (including 5 ported units)", () => {
  it("builds all 19 U3 models and performs 0 Vector3 / Matrix4 / Color allocations per frame", () => {
    vi.stubGlobal("Path2D", class {});
    vi.stubGlobal("document", {
      createElement: () => ({
        getContext: () => ({
          createLinearGradient: () => ({ addColorStop: () => {} }),
          createRadialGradient: () => ({ addColorStop: () => {} }),
          fillRect: () => {},
          strokeRect: () => {},
          beginPath: () => {},
          closePath: () => {},
          moveTo: () => {},
          lineTo: () => {},
          setLineDash: () => {},
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
    });

    let vec3Alloc = 0;
    let mat4Alloc = 0;
    let colorAlloc = 0;

    const trackedThree = {
      ...THREE,
      Vector3: class extends THREE.Vector3 {
        constructor(x?: number, y?: number, z?: number) {
          super(x, y, z);
          vec3Alloc++;
        }
      },
      Matrix4: class extends THREE.Matrix4 {
        constructor() {
          super();
          mat4Alloc++;
        }
      },
      Color: class extends THREE.Color {
        constructor(c?: THREE.Color | string | number) {
          super(c);
          colorAlloc++;
        }
      },
    } as unknown as typeof THREE;

    const mats = createMaterialRegistry(trackedThree);
    const keys = Object.keys(U3);
    expect(keys.length).toBe(19);

    const units = keys.map((k) => U3[k]!(trackedThree, mats));
    expect(units.length).toBe(19);

    vec3Alloc = 0;
    mat4Alloc = 0;
    colorAlloc = 0;

    for (let f = 1; f <= 120; f++) {
      const t = 50000 + f * 16.67;
      for (const u of units) {
        if (u.upd) {
          u.upd(t);
        }
      }
    }

    console.log("U3 (all 19 units) per-frame allocations over 120 frames:", {
      Vector3: vec3Alloc,
      Matrix4: mat4Alloc,
      Color: colorAlloc,
    });

    expect(vec3Alloc).toBe(0);
    expect(mat4Alloc).toBe(0);
    expect(colorAlloc).toBe(0);

    // Dispose test: traverse and dispose any created local geometries/materials
    for (const u of units) {
      u.g.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) {
          mesh.geometry.dispose();
        }
      });
      u.g.clear();
    }

    mats.dispose();
    vi.unstubAllGlobals();
  });
});
