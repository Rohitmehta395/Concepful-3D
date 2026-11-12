import type * as THREE from "three";
import { HX, type MaterialRegistry } from "../world/materials";
import {
  Bx,
  Co,
  Cy,
  Do,
  Ex,
  Ic,
  Tor,
  eye3,
  flame3,
  glowS,
  mk,
  plane,
} from "../world/geometry";

const AX = -Math.PI / 2;

export interface VehicleUpdateOptions {
  readonly rush?: boolean;
  readonly reduceMotion?: boolean;
}

export interface VehicleHandle {
  readonly g: THREE.Group;
  readonly w: number;
  readonly h: number;
  readonly fl: THREE.Group[];
  upd(t: number, o?: VehicleUpdateOptions): void;
}

/**
 * H3.brand (mDolphin).
 * Source: reference lines 7835-7948.
 */
export function mDolphin(
  three: typeof THREE,
  mats: MaterialRegistry
): VehicleHandle {
  const g = new three.Group();
  const body = new three.Group();
  g.add(body);
  const fl: THREE.Group[] = [];
  const B3 = mats.tm(HX.bone);
  const G3 = mats.tm(HX.gun);

  mk(
    three,
    mats,
    body,
    Cy(three, 0.24, 0.58, 1.8, 6),
    B3,
    [0.9, 0, 0],
    [0, 0, AX]
  );
  mk(
    three,
    mats,
    body,
    Cy(three, 0.58, 0.2, 2.1, 6),
    B3,
    [-1.05, 0, 0],
    [0, 0, AX]
  );
  mk(
    three,
    mats,
    body,
    Cy(three, 0.07, 0.2, 0.6, 6),
    B3,
    [2.05, -0.06, 0],
    [0, 0, AX]
  );
  mk(
    three,
    mats,
    body,
    Bx(three, 2.9, 0.12, 1.2),
    mats.tm(HX.red),
    [-0.15, -0.16, 0],
    null,
    null,
    false
  );
  mk(
    three,
    mats,
    body,
    Ex(
      three,
      [
        [0, 0],
        [0.55, 0],
        [-0.3, 0.95],
        [-0.52, 0.9],
      ],
      0.12
    ),
    mats.tm(HX.red),
    [-0.35, 0.45, 0]
  );
  [-1, 1].forEach((s) =>
    mk(
      three,
      mats,
      body,
      Ex(
        three,
        [
          [0, 0],
          [0.4, 0],
          [-0.3, -0.6],
          [-0.46, -0.55],
        ],
        0.08
      ),
      mats.tm(HX.bone2),
      [0.45, -0.36, s * 0.5],
      [s * 0.6, s * 0.3, 0]
    )
  );
  const tail = new three.Group();
  tail.position.set(-2.05, 0, 0);
  body.add(tail);
  mk(
    three,
    mats,
    tail,
    Ex(
      three,
      [
        [0, 0],
        [-0.6, 0.65],
        [-0.85, 0.6],
        [-0.5, 0],
        [-0.85, -0.6],
        [-0.6, -0.65],
      ],
      0.08
    ),
    B3,
    [0, 0, 0],
    [Math.PI / 2, 0, 0]
  );
  fl.push(flame3(three, mats, tail, [-0.45, 0, 0], 1.7, 0.24, "x-"));
  mk(three, mats, body, Bx(three, 0.55, 0.2, 0.34), G3, [0.45, 0.52, 0]);
  mk(
    three,
    mats,
    body,
    Cy(three, 0.1, 0.13, 1.0, 6),
    G3,
    [0.9, 0.64, 0],
    [0, 0, AX]
  );
  const beamM = new three.MeshBasicMaterial({
    color: HX.red,
    transparent: true,
    opacity: 0.45,
    blending: three.AdditiveBlending,
    depthWrite: false,
  });
  const beam = new three.Group();
  beam.position.set(1.42, 0.64, 0);
  beam.rotation.z = 0.12;
  body.add(beam);
  mk(
    three,
    mats,
    beam,
    Cy(three, 0.05, 0.05, 16, 6),
    mats.bm(0xffe6e9, 0.95, true),
    [8, 0, 0],
    [0, 0, AX],
    null,
    false
  );
  mk(
    three,
    mats,
    beam,
    Cy(three, 0.17, 0.17, 16, 6),
    beamM,
    [8, 0, 0],
    [0, 0, AX],
    null,
    false
  );
  glowS(three, mats, beam, [0, 0, 0], 1.1, HX.red);
  [-1, 1].forEach((s) => eye3(three, mats, body, [1.5, 0.14, s * 0.37], 0.07));

  return {
    g,
    w: 4.6,
    h: 2.2,
    fl,
    upd: (t: number) => {
      body.rotation.z = Math.sin(t / 500) * 0.07;
      tail.rotation.z = Math.sin(t / 220) * 0.3;
      beamM.opacity = 0.3 + 0.25 * Math.sin(t / 45);
    },
  };
}

/**
 * H3.web (mManta).
 * Source: reference lines 7949-8033.
 */
export function mManta(
  three: typeof THREE,
  mats: MaterialRegistry
): VehicleHandle {
  const g = new three.Group();
  const fl: THREE.Group[] = [];
  const B3 = mats.tm(HX.bone);
  const G3 = mats.tm(HX.gun);

  mk(three, mats, g, Do(three, 0.62), B3, [0, 0, 0], null, [1.5, 0.45, 0.95]);
  mk(
    three,
    mats,
    g,
    Bx(three, 1.6, 0.08, 1.0),
    mats.tm(HX.red),
    [0, 0.18, 0],
    null,
    null,
    false
  );
  [-1, 1].forEach((s) =>
    mk(
      three,
      mats,
      g,
      Co(three, 0.1, 0.55, 4),
      G3,
      [1.0, -0.05, s * 0.32],
      [0, 0, AX]
    )
  );
  mk(
    three,
    mats,
    g,
    Cy(three, 0.03, 0.06, 2.4, 4),
    G3,
    [-1.9, 0, 0],
    [0, 0, AX]
  );

  const wings = [-1, 1].map((s) => {
    const w = new three.Group();
    w.position.set(0, 0, s * 0.45);
    w.scale.z = s;
    g.add(w);
    mk(
      three,
      mats,
      w,
      Ex(
        three,
        [
          [0.7, 0],
          [-0.9, 0],
          [-1.5, 2.9],
          [-0.95, 3.0],
        ],
        0.1
      ),
      B3,
      [0, 0, 0],
      [-Math.PI / 2, 0, 0]
    );
    mk(
      three,
      mats,
      w,
      Ex(
        three,
        [
          [-1.35, 2.6],
          [-1.5, 2.9],
          [-0.95, 3.0],
          [-0.95, 2.7],
        ],
        0.12
      ),
      mats.tm(HX.red),
      [0, 0.02, 0],
      [-Math.PI / 2, 0, 0],
      null,
      false
    );
    const pts: number[] = [];
    for (let v = 0.4; v < 2.8; v += 0.45) {
      pts.push(0.6 - v * 0.55, 0.08, -v, -0.9 - v * 0.2, 0.08, -v);
    }
    for (let u = -0.6; u < 0.6; u += 0.4) {
      pts.push(u, 0.08, -0.1, u - 1.0, 0.08, -2.6);
    }
    const lg = new three.BufferGeometry();
    lg.setAttribute("position", new three.Float32BufferAttribute(pts, 3));
    w.add(
      new three.LineSegments(
        lg,
        new three.LineBasicMaterial({
          color: HX.holo,
          transparent: true,
          opacity: 0.75,
        })
      )
    );
    return w;
  });

  [-1, 1].forEach((s) => eye3(three, mats, g, [0.75, 0.14, s * 0.36], 0.07));
  fl.push(
    flame3(three, mats, g, [-0.6, -0.2, 0.25], 1.2, 0.16, "x-"),
    flame3(three, mats, g, [-0.6, -0.2, -0.25], 1.2, 0.16, "x-")
  );

  return {
    g,
    w: 4.2,
    h: 2.2,
    fl,
    upd: (t: number) => {
      const f = Math.sin(t / 420) * 0.38;
      wings[0]!.rotation.x = f;
      wings[1]!.rotation.x = -f;
      g.rotation.x = 0.25;
    },
  };
}

/**
 * H3.uiux (mOwl).
 * Source: reference lines 8034-8130.
 */
export function mOwl(
  three: typeof THREE,
  mats: MaterialRegistry
): VehicleHandle {
  const g = new three.Group();
  const fl: THREE.Group[] = [];
  const B3 = mats.tm(HX.bone);
  const G3 = mats.tm(HX.gun);

  mk(three, mats, g, Ic(three, 1.0, 1), B3, [0, 0, 0], null, [1, 1.25, 0.85]);
  mk(
    three,
    mats,
    g,
    Cy(three, 0.78, 0.78, 0.2, 8),
    G3,
    [0, 0.42, 0.72],
    [Math.PI / 2, 0, 0]
  );
  [-1, 1].forEach((s) => {
    mk(three, mats, g, Tor(three, 0.27, 0.05, 4, 10), B3, [
      s * 0.31,
      0.48,
      0.84,
    ]);
    eye3(three, mats, g, [s * 0.31, 0.48, 0.86], 0.19);
    mk(
      three,
      mats,
      g,
      Co(three, 0.16, 0.55, 4),
      mats.tm(HX.red),
      [s * 0.5, 1.35, 0.1],
      [0, 0, -s * 0.4]
    );
  });
  mk(
    three,
    mats,
    g,
    Co(three, 0.1, 0.3, 4),
    mats.tm(HX.yel),
    [0, 0.2, 0.9],
    [Math.PI, 0, 0]
  );

  const wings = [-1, 1].map((s) => {
    const w = new three.Group();
    w.position.set(s * 0.75, 0.5, 0);
    w.scale.x = s;
    g.add(w);
    mk(
      three,
      mats,
      w,
      Ex(
        three,
        [
          [0, 0],
          [1.9, 0.55],
          [2.2, 0.15],
          [1.8, -0.2],
          [2.0, -0.6],
          [1.4, -0.75],
          [1.5, -1.05],
          [0, -0.65],
        ],
        0.12
      ),
      B3
    );
    mk(
      three,
      mats,
      w,
      Ex(
        three,
        [
          [1.2, 0.36],
          [1.9, 0.55],
          [2.0, 0.42],
          [1.25, 0.22],
        ],
        0.14
      ),
      mats.tm(HX.blu),
      null,
      null,
      null,
      false
    );
    return w;
  });

  mk(
    three,
    mats,
    g,
    Cy(three, 0.04, 0.04, 1.8, 5),
    mats.tm(HX.chrome),
    [0, -1.35, 0.4],
    [0, 0, Math.PI / 2 - 0.1]
  );
  [-1, 1].forEach((s) =>
    mk(three, mats, g, Cy(three, 0.05, 0.05, 0.4, 4), G3, [s * 0.2, -1.15, 0.3])
  );
  const uiTex = mats.TX("ui");
  const holos = (
    [
      [-2.7, 1.3, 0],
      [2.6, 1.6, -0.3],
    ] as const
  ).map((p, i) =>
    plane(
      three,
      g,
      1.1,
      0.78,
      uiTex,
      [p[0], p[1], p[2]],
      [0, i ? -0.35 : 0.35, 0],
      0.95
    )
  );
  fl.push(flame3(three, mats, g, [0, -1.2, -0.1], 1.0, 0.22));

  return {
    g,
    w: 5.5,
    h: 3.4,
    fl,
    upd: (t: number) => {
      const f = Math.sin(t / 240) * 0.45;
      wings[0]!.rotation.z = f;
      wings[1]!.rotation.z = f;
      holos.forEach((h, i) => {
        h.position.y = (i ? 1.6 : 1.3) + Math.sin(t / 600 + i) * 0.12;
        (h.material as THREE.MeshBasicMaterial).opacity =
          0.7 + 0.3 * Math.sin(t / 140 + i);
      });
    },
  };
}

/**
 * H3.decks (mHawk).
 * Source: reference lines 8131-8216.
 */
export function mHawk(
  three: typeof THREE,
  mats: MaterialRegistry
): VehicleHandle {
  const g = new three.Group();
  const fl: THREE.Group[] = [];
  const B3 = mats.tm(HX.bone);
  const G3 = mats.tm(HX.gun);

  mk(three, mats, g, Cy(three, 0.26, 0.46, 1.9, 6), B3, [0, 0, 0], [0, 0, AX]);
  mk(three, mats, g, Ic(three, 0.36), B3, [1.15, 0.18, 0]);
  mk(
    three,
    mats,
    g,
    Co(three, 0.12, 0.45, 4),
    mats.tm(HX.yel),
    [1.55, 0.12, 0],
    [0, 0, AX]
  );
  [-1, 1].forEach((s) => eye3(three, mats, g, [1.3, 0.3, s * 0.22], 0.05));
  mk(
    three,
    mats,
    g,
    Ex(
      three,
      [
        [0, 0],
        [-0.9, 0.5],
        [-1.05, 0.15],
        [-0.95, -0.15],
        [-1.05, -0.5],
        [-0.9, -0.5],
      ],
      0.08
    ),
    mats.tm(HX.red),
    [-0.9, 0, 0],
    [Math.PI / 2, 0, 0]
  );
  fl.push(flame3(three, mats, g, [-1.0, -0.05, 0], 1.3, 0.15, "x-"));

  const wings = [-1, 1].map((s) => {
    const w = new three.Group();
    w.position.set(0.1, 0.15, s * 0.3);
    w.scale.z = s;
    g.add(w);
    mk(
      three,
      mats,
      w,
      Ex(
        three,
        [
          [0.4, 0],
          [-0.5, 0],
          [-1.2, 2.8],
          [-0.55, 2.9],
          [0.0, 1.6],
        ],
        0.1
      ),
      B3,
      null,
      [-Math.PI / 2, 0, 0]
    );
    mk(
      three,
      mats,
      w,
      Ex(
        three,
        [
          [-1.05, 2.4],
          [-1.2, 2.8],
          [-0.55, 2.9],
          [-0.45, 2.5],
        ],
        0.12
      ),
      mats.tm(HX.red),
      [0, 0.02, 0],
      [-Math.PI / 2, 0, 0],
      null,
      false
    );
    return w;
  });

  [-1, 1].forEach((s) =>
    mk(three, mats, g, Cy(three, 0.04, 0.04, 0.9, 4), G3, [s * 0.25, -0.6, 0])
  );
  const bb = new three.Group();
  bb.position.set(0, -1.45, 0);
  g.add(bb);
  mk(three, mats, bb, Bx(three, 2.4, 1.35, 0.12), G3);
  plane(three, bb, 2.2, 1.2, mats.TX("chart"), [0, 0, 0.07]);

  return {
    g,
    w: 4.8,
    h: 4.2,
    fl,
    upd: (t: number) => {
      const f = Math.sin(t / 300) * 0.55;
      wings[0]!.rotation.x = f;
      wings[1]!.rotation.x = -f;
      bb.rotation.z = Math.sin(t / 700) * 0.05;
    },
  };
}
