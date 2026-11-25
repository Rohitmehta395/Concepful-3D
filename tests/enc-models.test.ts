import { describe, it, expect, vi } from "vitest";
import * as THREE from "three";
import { createMaterialRegistry } from "@/engine/world/materials";
import { base3 } from "@/engine/stages/enc/models/base3";
import { wyrm } from "@/engine/stages/enc/models/wyrm";
import { barbarian } from "@/engine/stages/enc/models/barbarian";
import { furball } from "@/engine/stages/enc/models/furball";
import { popPlanet } from "@/engine/stages/enc/models/popPlanet";
import { maze } from "@/engine/stages/enc/models/maze";
import { bossMino } from "@/engine/stages/enc/models/bossMino";
import { beam3, setBeam } from "@/engine/stages/enc/models/beam";

describe("Encounter Models: Allocation and Geometry Verification", () => {
  it("builds all 7 new encounter models and performs 0 Vector3 / Matrix4 / Color allocations per frame over 120 frames", () => {
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

    // 1. base3
    const baseG = new trackedThree.Group();
    base3(trackedThree, mats, baseG, 7.2);
    expect(baseG.children.length).toBeGreaterThan(0);

    // 2. wyrm
    const w = wyrm(trackedThree, mats);
    expect(w.g.children.length).toBeGreaterThan(0);

    // 3. barbarian
    const b = barbarian(trackedThree, mats);
    expect(b.g.children.length).toBeGreaterThan(0);

    // 4. furball
    const fb = furball(trackedThree, mats);
    expect(fb.g.children.length).toBeGreaterThan(0);

    // 5. popPlanet
    const pp = popPlanet(trackedThree, mats);
    expect(pp.g.children.length).toBeGreaterThan(0);

    // 6. maze
    const mz = maze(trackedThree, mats);
    expect(mz.g.children.length).toBeGreaterThan(0);
    expect(mz.path.length).toBe(180);

    // 7. bossMino
    const bm = bossMino(trackedThree, mats);
    expect(bm.g.children.length).toBeGreaterThan(0);

    // 8. beam3 & setBeam
    const beamMesh = beam3(trackedThree, baseG, 0xff6b78);
    const p1 = new trackedThree.Vector3(0, 0, 0);
    const p2 = new trackedThree.Vector3(5, 5, 5);

    // Reset allocation counters after setup
    vec3Alloc = 0;
    mat4Alloc = 0;
    colorAlloc = 0;

    // Simulate 120 animation frames
    for (let f = 1; f <= 120; f++) {
      const t = 50000 + f * 16.67;
      w.upd(t);
      b.upd(t);
      fb.upd(t);
      pp.upd(t);
      bm.upd(t);
      setBeam(beamMesh, p1, p2, f % 2 === 0);
    }

    expect(vec3Alloc).toBe(0);
    expect(mat4Alloc).toBe(0);
    expect(colorAlloc).toBe(0);
  });
});
