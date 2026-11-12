import type * as THREE from "three";
import { HX, type MaterialRegistry } from "../world/materials";
import { Bx, Co, Cy, Ex, Ic, Tor, eye3, flame3, mk } from "../world/geometry";
import {
  mDolphin,
  mHawk,
  mManta,
  mOwl,
  type VehicleHandle,
  type VehicleUpdateOptions,
} from "./hVehiclesA";
import { mBeetle, mDragonfly, mJelly, mTurtle } from "./hVehiclesB";

const AX = -Math.PI / 2;

/**
 * H3.ai (mDrone).
 * Source: reference lines 8611-8681.
 */
export function mDrone(
  three: typeof THREE,
  mats: MaterialRegistry
): VehicleHandle {
  const g = new three.Group();
  const fl: THREE.Group[] = [];
  const B3 = mats.tm(HX.bone);
  const G3 = mats.tm(HX.gun);

  const rotors: THREE.Group[] = [];
  (
    [
      [1.3, 1.0],
      [-1.3, 1.0],
      [1.3, -1.0],
      [-1.3, -1.0],
    ] as const
  ).forEach(([x, z], i) => {
    const a = Math.atan2(z, x);
    mk(
      three,
      mats,
      g,
      Bx(three, 1.5, 0.12, 0.16),
      i < 2 ? G3 : B3,
      [x / 2, 0, z / 2],
      [0, -a, 0]
    );
    mk(three, mats, g, Cy(three, 0.14, 0.14, 0.26, 6), G3, [x, 0.1, z]);
    const r = new three.Group();
    r.position.set(x, 0.26, z);
    g.add(r);
    mk(
      three,
      mats,
      r,
      Cy(three, 0.75, 0.75, 0.01, 12),
      mats.bm(0xffffff, 0.18),
      null,
      null,
      null,
      false
    );
    mk(
      three,
      mats,
      r,
      Bx(three, 1.5, 0.03, 0.12),
      mats.tm(HX.dark),
      null,
      null,
      null,
      false
    );
    rotors.push(r);
  });

  mk(three, mats, g, Cy(three, 0.62, 0.72, 0.38, 8), B3);
  mk(
    three,
    mats,
    g,
    Tor(three, 0.68, 0.05, 3, 8),
    mats.tm(HX.red),
    [0, 0, 0],
    [Math.PI / 2, 0, 0]
  );
  eye3(three, mats, g, [0, 0, 0.72], 0.14);
  mk(three, mats, g, Ic(three, 0.22), G3, [0, -0.36, 0.2]);
  const ring = mk(
    three,
    mats,
    g,
    Tor(three, 1.2, 0.025, 3, 24),
    mats.bm(HX.holo, 0.6, true),
    [0, 0, 0],
    [Math.PI / 2, 0, 0],
    null,
    false
  );

  return {
    g,
    w: 3.6,
    h: 1.6,
    fl,
    upd: (t: number, o?: VehicleUpdateOptions) => {
      rotors.forEach(
        (r, i) => (r.rotation.y = (t / (o?.rush ? 25 : 45)) * (i % 2 ? 1 : -1))
      );
      const q = (t / 1400) % 1;
      ring.scale.set(1 + q * 1.2, 1 + q * 1.2, 1);
      (ring.material as THREE.MeshBasicMaterial).opacity = 0.6 * (1 - q);
      g.rotation.x = 0.35;
    },
  };
}

/**
 * Escort fighter (mJet).
 * Source: reference lines 8682-8735.
 */
export function mJet(
  three: typeof THREE,
  mats: MaterialRegistry
): VehicleHandle {
  const g = new three.Group();
  const fl: THREE.Group[] = [];
  const B3 = mats.tm(HX.bone);

  mk(three, mats, g, Cy(three, 0.12, 0.3, 2.4, 6), B3, [0, 0, 0], [0, 0, AX]);
  mk(three, mats, g, Co(three, 0.12, 0.5, 6), B3, [1.45, 0, 0], [0, 0, AX]);
  mk(
    three,
    mats,
    g,
    Ex(
      three,
      [
        [0.4, 0],
        [-0.5, 0],
        [-0.9, 1.4],
        [-0.6, 1.45],
      ],
      0.05
    ),
    B3,
    [0, 0, 0],
    [-Math.PI / 2, 0, 0]
  );
  mk(
    three,
    mats,
    g,
    Ex(
      three,
      [
        [0.4, 0],
        [-0.5, 0],
        [-0.9, 1.4],
        [-0.6, 1.45],
      ],
      0.05
    ),
    B3,
    [0, 0, 0],
    [-Math.PI / 2, 0, 0],
    [1, -1, 1]
  );
  mk(
    three,
    mats,
    g,
    Ex(
      three,
      [
        [0, 0],
        [-0.45, 0.7],
        [-0.6, 0.7],
        [-0.4, 0],
      ],
      0.05
    ),
    mats.tm(HX.red),
    [-0.8, 0.15, 0]
  );
  mk(
    three,
    mats,
    g,
    Ic(three, 0.16),
    mats.tm(HX.glass),
    [0.5, 0.18, 0],
    null,
    [2, 1, 1],
    false
  );
  fl.push(flame3(three, mats, g, [-1.2, 0, 0], 0.9, 0.16, "x-"));

  return {
    g,
    w: 3,
    h: 1,
    fl,
    upd: () => {},
  };
}

export const H3: Record<
  string,
  (three: typeof THREE, mats: MaterialRegistry) => VehicleHandle
> = {
  brand: mDolphin,
  web: mManta,
  uiux: mOwl,
  decks: mHawk,
  copy: mJelly,
  motion: mDragonfly,
  "3d": mTurtle,
  fab: mBeetle,
  ai: mDrone,
};
