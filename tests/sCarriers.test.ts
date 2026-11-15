import { describe, it, expect, vi } from "vitest";
import * as THREE from "three";
import { createMaterialRegistry } from "@/engine/world/materials";
import { flick } from "@/engine/world/geometry";
import { sSky } from "@/engine/models/sCarriers";

describe("Part 4.16: sSky Fleet Carrier model", () => {
  it("builds sSky and performs 0 Vector3 / Matrix4 / Color allocations per frame", () => {
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
    const carrier = sSky(trackedThree, mats);

    expect(carrier.len).toBe(9.6);
    expect(carrier.h).toBe(5);
    expect(carrier.fl.length).toBe(2);

    vec3Alloc = 0;
    mat4Alloc = 0;
    colorAlloc = 0;

    for (let f = 1; f <= 120; f++) {
      const t = 50000 + f * 16.67;
      carrier.upd(t);
      if (carrier.fl.length > 0) flick(carrier.fl, t);
    }

    console.log("sSky per-frame allocations over 120 frames:", {
      Vector3: vec3Alloc,
      Matrix4: mat4Alloc,
      Color: colorAlloc,
    });

    expect(vec3Alloc).toBe(0);
    expect(mat4Alloc).toBe(0);
    expect(colorAlloc).toBe(0);

    // Dispose test: traverse and dispose any created local geometries/materials
    carrier.g.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.geometry) {
        mesh.geometry.dispose();
      }
    });
    carrier.g.clear();

    mats.dispose();
    vi.unstubAllGlobals();
  });
});
