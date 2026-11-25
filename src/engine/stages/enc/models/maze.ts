import * as THREE from "three";
import type { MaterialRegistry } from "../../../world/materials";
import { Bx, mk } from "../../../world/geometry";
import { HX } from "../../../world/materials";

export interface MazeHandle {
  readonly g: THREE.Group;
  readonly path: readonly THREE.Vector3[];
}

/**
 * maze: Circular concentric labyrinth diorama matching reference line 13850.
 * Source: reference lines 13850-13933.
 */
export function maze(three: typeof THREE, mats: MaterialRegistry): MazeHandle {
  const g = new three.Group();
  const rings = [5.9, 4.5, 3.1, 1.7];
  const gaps = [0.35, 2.55, 4.6, 1.2];
  const corr = [6.6, 5.2, 3.8, 2.4];
  const G3 = mats.tm(HX.gun);
  const boneMat = mats.tm(HX.bone);

  rings.forEach((r, i) => {
    const n = Math.round(r * 4.2);
    const step = (Math.PI * 2) / n;
    for (let k = 0; k < n; k++) {
      const a = k * step + step / 2;
      const d = Math.atan2(Math.sin(a - gaps[i]!), Math.cos(a - gaps[i]!));
      if (Math.abs(d) < 0.42 / (r / 4)) continue;
      const len = r * step * 1.02;
      mk(
        three,
        mats,
        g,
        Bx(three, len, 1.0, 0.42),
        G3,
        [Math.cos(a) * r, 0.5, Math.sin(a) * r],
        [0, -a + Math.PI / 2, 0]
      );
      mk(
        three,
        mats,
        g,
        Bx(three, len * 0.98, 0.07, 0.44),
        boneMat,
        [Math.cos(a) * r, 1.03, Math.sin(a) * r],
        [0, -a + Math.PI / 2, 0],
        null,
        false
      );
    }
  });

  const radials: [number, number][] = [
    [5.2, 1.6],
    [3.8, 3.6],
    [2.4, 5.6],
    [3.8, 0.9],
  ];

  radials.forEach(([r, a]) => {
    mk(
      three,
      mats,
      g,
      Bx(three, 0.42, 1.0, 1.4),
      G3,
      [Math.cos(a) * r, 0.5, Math.sin(a) * r],
      [0, -a, 0]
    );
    mk(
      three,
      mats,
      g,
      Bx(three, 0.44, 0.07, 1.38),
      boneMat,
      [Math.cos(a) * r, 1.03, Math.sin(a) * r],
      [0, -a, 0],
      null,
      false
    );
  });

  const P: THREE.Vector3[] = [];
  const arc = (r: number, a0: number, a1: number) => {
    const d = a1 - a0;
    const n = Math.max(2, Math.ceil(Math.abs(d) / 0.12));
    for (let i = 0; i <= n; i++) {
      const a = a0 + (d * i) / n;
      P.push(new three.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
    }
  };

  const radial = (r0: number, r1: number, a: number) => {
    for (let i = 0; i <= 4; i++) {
      const r = r0 + ((r1 - r0) * i) / 4;
      P.push(new three.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
    }
  };

  radial(7.4, corr[0]!, gaps[0]!);
  radial(corr[0]!, corr[1]!, gaps[0]!);
  arc(corr[1]!, gaps[0]!, gaps[1]!);
  radial(corr[1]!, corr[2]!, gaps[1]!);
  arc(corr[2]!, gaps[1]!, gaps[2]!);
  radial(corr[2]!, corr[3]!, gaps[2]!);
  arc(corr[3]!, gaps[2]!, gaps[3]! + Math.PI * 2);
  radial(corr[3]!, 0.9, gaps[3]!);

  const backList = P.slice().reverse();
  P.push(...backList);

  return { g, path: P };
}
