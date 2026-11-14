import type * as THREE from "three";
import { HX, type MaterialRegistry } from "../world/materials";
import {
  Bx,
  Cy,
  Ex,
  eye3,
  flame3,
  mk,
  type Vec2Tuple,
} from "../world/geometry";

const AX = -Math.PI / 2;

export interface CarrierHandle {
  readonly g: THREE.Group;
  readonly len: number;
  readonly h: number;
  readonly fl: THREE.Group[];
  upd(t: number): void;
}

/**
 * S3.regional fleet carrier (sSky).
 * Source: reference lines 9892-9982.
 */
export function sSky(
  three: typeof THREE,
  mats: MaterialRegistry
): CarrierHandle {
  const g = new three.Group();
  const fl: THREE.Group[] = [];
  const B3 = mats.tm(HX.bone);
  const G3 = mats.tm(HX.gun);

  const hullPoly: Vec2Tuple[] = [
    [4.6, 0],
    [3.6, -0.9],
    [-3.5, -1.0],
    [-4.6, -0.4],
    [-4.6, 0.5],
    [-3.6, 0.9],
    [3.3, 0.8],
  ];
  mk(three, mats, g, Ex(three, hullPoly, 1.9), B3);

  mk(
    three,
    mats,
    g,
    Bx(three, 8.2, 0.16, 1.92),
    mats.tm(HX.red),
    [-0.2, -0.55, 0],
    null,
    null,
    false
  );

  mk(three, mats, g, Bx(three, 2.4, 0.9, 1.3), B3, [1.2, 1.3, 0]);

  mk(
    three,
    mats,
    g,
    Bx(three, 0.05, 0.4, 1.0),
    mats.tm(HX.glass),
    [2.42, 1.45, 0],
    null,
    null,
    false
  );

  const finPoly: Vec2Tuple[] = [
    [0, 0],
    [-0.9, 0],
    [-1.4, 1.2],
    [-1.1, 1.2],
  ];
  mk(three, mats, g, Ex(three, finPoly, 0.1), mats.tm(HX.red), [-3.3, 0.8, 0]);

  const rot: THREE.Group[] = [];
  (
    [
      [-2.2, 1.0, 2.4],
      [0.2, 1.6, 2.6],
      [2.6, 0.9, 1.6],
    ] as const
  ).forEach(([x, y, r]) => {
    mk(three, mats, g, Cy(three, 0.08, 0.08, 1.3, 4), G3, [x, y + 0.6, 0]);
    const R = new three.Group();
    R.position.set(x, y + 1.3, 0);
    g.add(R);
    mk(
      three,
      mats,
      R,
      Cy(three, r, r, 0.01, 14),
      mats.bm(0xffffff, 0.2),
      null,
      null,
      null,
      false
    );
    mk(
      three,
      mats,
      R,
      Bx(three, r * 2, 0.05, 0.18),
      mats.tm(HX.dark),
      null,
      null,
      null,
      false
    );
    rot.push(R);
  });

  ([-1, 1] as const).forEach((s) => {
    const P = new three.Group();
    P.position.set(-1, -0.9, s * 1.1);
    g.add(P);
    mk(three, mats, P, Cy(three, 0.3, 0.3, 0.9, 6), G3, null, [0, 0, AX]);
    rot.push(P);
  });

  fl.push(
    flame3(three, mats, g, [-4.7, 0.1, 0.5], 1.6, 0.25, "x-"),
    flame3(three, mats, g, [-4.7, 0.1, -0.5], 1.6, 0.25, "x-")
  );

  eye3(three, mats, g, [4.3, 0.1, 0.5], 0.08);

  return {
    g,
    len: 9.6,
    h: 5,
    fl,
    upd: (t: number) => {
      for (let i = 0; i < rot.length; i++) {
        const R = rot[i]!;
        if (i < 3) R.rotation.y = t / (60 + i * 10);
        else R.rotation.x = t / 90;
      }
    },
  };
}

export const S3: Record<
  string,
  ((three: typeof THREE, mats: MaterialRegistry) => CarrierHandle) | undefined
> = {
  regional: sSky,
};
