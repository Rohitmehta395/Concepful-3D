import type * as THREE from "three";
import { HX, type MaterialRegistry } from "../world/materials";
import {
  Bx,
  Co,
  Cy,
  Ex,
  Ic,
  Tor,
  eye3,
  flame3,
  glowS,
  mk,
  plane,
} from "../world/geometry";
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

export interface MothershipHandle {
  readonly g: THREE.Group;
  readonly len: number;
  readonly h: number;
  readonly fl: THREE.Group[];
  readonly crew: THREE.Group;
  upd(t: number): void;
}

/**
 * Mothership flagship (sMother).
 * Source: reference lines 10084-10195.
 */
export function sMother(
  three: typeof THREE,
  mats: MaterialRegistry
): MothershipHandle {
  const g = new three.Group();
  const fl: THREE.Group[] = [];
  const B3 = mats.tm(HX.bone);
  const G3 = mats.tm(HX.gun);

  mk(
    three,
    mats,
    g,
    Ex(
      three,
      [
        [7.6, 0.2],
        [6.2, -1.7],
        [-6.2, -1.7],
        [-7.6, -0.8],
        [-7.6, 0.2],
      ],
      4.2
    ),
    G3
  );
  mk(
    three,
    mats,
    g,
    Ex(
      three,
      [
        [7.8, 0.2],
        [7.1, 1.05],
        [-6.9, 1.05],
        [-7.6, 0.2],
      ],
      4.2
    ),
    B3
  );
  mk(
    three,
    mats,
    g,
    Bx(three, 15.2, 0.14, 4.0),
    mats.tm(HX.dark),
    [0, 1.12, 0]
  );
  for (let x = -6; x < 7; x += 0.9) {
    mk(
      three,
      mats,
      g,
      Bx(three, 0.45, 0.03, 0.12),
      mats.tm(HX.yel),
      [x, 1.2, 0],
      null,
      null,
      false
    );
  }
  mk(
    three,
    mats,
    g,
    Bx(three, 15.2, 0.16, 4.24),
    mats.tm(HX.red),
    [0.1, 0.25, 0],
    null,
    null,
    false
  );
  for (let x = -6.5; x < 7; x += 0.55) {
    mk(
      three,
      mats,
      g,
      Bx(three, 0.3, 0.12, 0.05),
      mats.bm(HX.holo, 0.9, true),
      [x, 0.6, 2.12],
      null,
      null,
      false
    );
  }
  plane(three, g, 7.5, 0.7, mats.TX("hull"), [0, -0.75, 2.13]);
  mk(three, mats, g, Bx(three, 1.5, 2.3, 1.0), B3, [-4.6, 2.3, -1.3]);
  for (let i = 0; i < 3; i++) {
    mk(
      three,
      mats,
      g,
      Bx(three, 0.28, 0.2, 0.05),
      mats.tm(HX.glass),
      [-5.0 + i * 0.4, 2.9, -0.78],
      null,
      null,
      false
    );
  }
  mk(three, mats, g, Cy(three, 0.05, 0.05, 0.8, 4), G3, [-4.6, 3.8, -1.3]);
  const dish = mk(
    three,
    mats,
    g,
    Cy(three, 0.5, 0.1, 0.18, 8),
    B3,
    [-4.6, 4.3, -1.3],
    [0.7, 0, 0]
  );
  (
    [
      [0.9, 1.2],
      [0.9, -1.2],
      [-0.6, 1.2],
      [-0.6, -1.2],
    ] as const
  ).forEach(([y, z]) =>
    fl.push(flame3(three, mats, g, [-7.7, y - 0.3, z], 3.0, 0.4, "x-"))
  );
  const crew = new three.Group();
  crew.position.set(0, 1.2, 0);
  g.add(crew);

  (
    [
      [4.8, 1.6],
      [6.0, 1.0],
    ] as const
  ).forEach(([x, z]) => {
    const j = mJet(three, mats);
    j.g.scale.setScalar(0.45);
    j.g.position.set(x, 1.4, z);
    g.add(j.g);
  });

  return {
    g,
    len: 15.6,
    h: 6.5,
    fl,
    crew,
    upd: (t: number) => {
      dish.rotation.y = t / 600;
    },
  };
}

export interface FlagshipHandle {
  readonly g: THREE.Group;
  readonly len: number;
  readonly h: number;
  readonly fl: THREE.Group[];
  upd(t: number): void;
}

/**
 * Startup submarine flagship (sSub).
 * Source: reference lines 9794-9891.
 */
export function sSub(
  three: typeof THREE,
  mats: MaterialRegistry
): FlagshipHandle {
  const g = new three.Group();
  const fl: THREE.Group[] = [];
  const B3 = mats.tm(HX.bone);
  const G3 = mats.tm(HX.gun);

  mk(three, mats, g, Cy(three, 1.0, 1.0, 6.4, 8), B3, [0, 0, 0], [0, 0, AX]);
  mk(three, mats, g, Co(three, 1.0, 1.7, 8), B3, [4.05, 0, 0], [0, 0, AX]);
  mk(three, mats, g, Co(three, 1.0, 1.4, 8), B3, [-3.9, 0, 0], [0, 0, -AX]);
  mk(
    three,
    mats,
    g,
    Bx(three, 6.6, 0.16, 2.06),
    mats.tm(HX.red),
    [0, -0.35, 0],
    null,
    null,
    false
  );
  mk(three, mats, g, Bx(three, 1.8, 1.3, 0.6), B3, [0.6, 1.4, 0]);
  mk(
    three,
    mats,
    g,
    Bx(three, 1.82, 0.12, 0.62),
    mats.tm(HX.red),
    [0.6, 1.2, 0],
    null,
    null,
    false
  );
  mk(three, mats, g, Cy(three, 0.05, 0.05, 0.8, 4), G3, [1.1, 2.4, 0]);
  mk(three, mats, g, Bx(three, 0.3, 0.14, 0.14), G3, [1.2, 2.8, 0]);

  for (let i = 0; i < 6; i++) {
    mk(
      three,
      mats,
      g,
      Cy(three, 0.12, 0.12, 0.06, 8),
      mats.tm(HX.dark),
      [-2.2 + i * 0.85, 0.15, 0.98],
      [Math.PI / 2, 0, 0],
      null,
      false
    );
    glowS(three, mats, g, [-2.2 + i * 0.85, 0.15, 1.0], 0.35, HX.holo);
  }

  [-1, 1].forEach((s) =>
    mk(
      three,
      mats,
      g,
      Ex(
        three,
        [
          [0, 0],
          [-0.8, 0],
          [-1.2, 1.1],
          [-0.9, 1.1],
        ],
        0.08
      ),
      mats.tm(HX.red),
      [-3.1, 0, s * 0.2],
      [(s * Math.PI) / 2, 0, 0]
    )
  );
  mk(
    three,
    mats,
    g,
    Ex(
      three,
      [
        [0, 0],
        [-0.8, 0],
        [-1.2, 1.0],
        [-0.9, 1.0],
      ],
      0.08
    ),
    mats.tm(HX.red),
    [-3.1, 0.4, 0]
  );

  const prop = new three.Group();
  prop.position.set(-4.75, 0, 0);
  g.add(prop);
  for (let k = 0; k < 3; k++) {
    mk(
      three,
      mats,
      prop,
      Bx(three, 0.08, 1.1, 0.25),
      mats.tm(HX.chrome),
      null,
      [k * 2.09, 0, 0]
    );
  }
  eye3(three, mats, g, [4.6, 0.1, 0.3], 0.09);

  const light = new three.Mesh(
    Co(three, 1.6, 6, 8),
    new three.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.06,
      depthWrite: false,
    })
  );
  light.position.set(7.8, 0, 0);
  light.rotation.z = Math.PI / 2;
  g.add(light);

  return {
    g,
    len: 9.5,
    h: 3.5,
    fl,
    upd: (t: number) => {
      prop.rotation.x = t / 120;
    },
  };
}

/**
 * SMB starcruiser flagship (sStar).
 * Source: reference lines 9983-10083.
 */
export function sStar(
  three: typeof THREE,
  mats: MaterialRegistry
): FlagshipHandle {
  const g = new three.Group();
  const fl: THREE.Group[] = [];
  const B3 = mats.tm(HX.bone);
  const G3 = mats.tm(HX.gun);

  mk(
    three,
    mats,
    g,
    Ex(
      three,
      [
        [5.6, 0],
        [3.6, 0.95],
        [-3.6, 1.5],
        [-5.6, 1.1],
        [-5.6, -0.7],
        [-4.6, -1.2],
        [3.2, -1.0],
      ],
      2.4
    ),
    B3
  );
  mk(
    three,
    mats,
    g,
    Ex(
      three,
      [
        [5.0, -0.1],
        [3.2, -0.9],
        [-4.4, -1.1],
        [-5.5, -0.6],
        [-5.5, -0.1],
      ],
      2.42
    ),
    G3,
    [0, 0, 0],
    null,
    null,
    false
  );
  mk(
    three,
    mats,
    g,
    Bx(three, 4.2, 1.0, 0.05),
    mats.bm(HX.holo, 0.55, true),
    [-0.3, -0.1, 1.23],
    null,
    null,
    false
  );
  for (let i = 0; i < 8; i++) {
    mk(
      three,
      mats,
      g,
      Bx(three, 0.25, 0.06, 0.06),
      mats.tm(HX.yel),
      [-2.1 + i * 0.52, 0.35, 1.25],
      null,
      null,
      false
    );
  }
  mk(three, mats, g, Bx(three, 1.7, 1.4, 1.0), B3, [-1.8, 2.0, 0]);
  for (let i = 0; i < 4; i++) {
    mk(
      three,
      mats,
      g,
      Bx(three, 0.25, 0.18, 0.05),
      mats.tm(HX.glass),
      [-2.4 + i * 0.38, 2.25, 0.52],
      null,
      null,
      false
    );
  }
  mk(
    three,
    mats,
    g,
    Ex(
      three,
      [
        [0, 0],
        [-1.0, 0],
        [-1.6, 1.4],
        [-1.3, 1.4],
      ],
      0.12
    ),
    mats.tm(HX.red),
    [-3.8, 1.3, 0]
  );
  mk(
    three,
    mats,
    g,
    Bx(three, 5.0, 0.14, 2.44),
    mats.tm(HX.red),
    [1.8, 0.15, 0],
    null,
    null,
    false
  );
  mk(three, mats, g, Bx(three, 0.6, 2.0, 2.0), G3, [-5.85, 0.2, 0]);
  (
    [
      [0.7, 0.5],
      [-0.1, 0],
      [-0.7, -0.5],
    ] as const
  ).forEach(([y, z]) =>
    fl.push(flame3(three, mats, g, [-6.2, y, z], 2.4, 0.32, "x-"))
  );
  eye3(three, mats, g, [5.3, 0.15, 0.4], 0.09);

  return {
    g,
    len: 12,
    h: 4,
    fl,
    upd: () => {},
  };
}
