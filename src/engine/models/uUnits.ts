import type * as THREE from "three";
import { HX, type MaterialRegistry } from "../world/materials";
import {
  Bx,
  Cy,
  Ic,
  bake,
  eye3,
  glowS,
  mir,
  mk,
  plane,
  rbx,
  slabXY,
  slabYZ,
  tbox,
  type Vec2Tuple,
  type Vec3Tuple,
} from "../world/geometry";

const AX = -Math.PI / 2;

export interface BipedOptions {
  acc: number;
  col?: number;
  legH?: number;
  torso?: [number, number, number];
  stance?: number;
  head?: "dome" | "crest";
  headK?: number;
}

export interface BipedHandle {
  readonly g: THREE.Group;
  readonly arms: THREE.Group[];
  readonly head: THREE.Group;
  readonly shY: number;
  readonly ty: number;
}

export interface UnitHandle {
  readonly g: THREE.Group;
  readonly w: number;
  readonly h: number;
  upd(t: number): void;
}

/**
 * Parametric anime-mech frame parts (feet at y=0, facing +z).
 * Source: reference lines 13185-13548.
 */
export function mechParts(
  three: typeof THREE,
  mats: MaterialRegistry,
  o: BipedOptions
) {
  const A = mats.tm(o.acc);
  const W = mats.tm(o.col ?? HX.bone);
  const N = mats.tm(HX.gun);
  const D = mats.tm(HX.dark);
  const Y = mats.tm(HX.yel);

  const hy = (o.legH ?? 1.05) * 1.12;
  const tw = o.torso ? o.torso[0] : 0.95;
  const th = o.torso ? o.torso[1] : 0.95;
  const td = o.torso ? o.torso[2] : 0.65;
  const st = (o.stance ?? 0.12) * 0.8;

  const legs = [-1, 1].map((s) => {
    const L = new three.Group();
    const x = s * (tw * 0.2 + st * 0.6);
    const xf = x + s * st * 0.45;
    const xk = x + s * st * 0.2;

    mk(three, mats, L, Ic(three, 0.15, 1), N, [x, hy + 0.02, 0]);
    mk(three, mats, L, Cy(three, 0.12, 0.1, hy * 0.42, 6), N, [
      x,
      hy * 0.78,
      0,
    ]);
    mk(three, mats, L, tbox(three, 0.3, 0.25, hy * 0.36, 0.17, 0.14), W, [
      x,
      hy * 0.8,
      0.07,
    ]);
    mk(three, mats, L, Ic(three, 0.12, 1), N, [xk, hy * 0.55, 0]);
    mk(three, mats, L, tbox(three, 0.3, 0.43, hy * 0.48, 0.3, 0.45, 0.03), W, [
      xf,
      hy * 0.28,
      0,
    ]);
    mk(
      three,
      mats,
      L,
      slabYZ(
        three,
        [
          [-0.04, -0.13],
          [0.17, -0.1],
          [0.26, 0.05],
          [0.12, 0.18],
          [-0.04, 0.13],
        ],
        0.27,
        0.02
      ),
      A,
      [xk, hy * 0.56, 0.12]
    );
    mk(
      three,
      mats,
      L,
      tbox(three, 0.2, 0.28, hy * 0.2, 0.03, 0.03),
      A,
      [xf, hy * 0.2, 0.22],
      [0.12, 0, 0],
      null,
      false
    );
    mk(
      three,
      mats,
      L,
      slabYZ(
        three,
        [
          [-0.26, 0],
          [0.36, 0],
          [0.47, 0.06],
          [0.26, 0.18],
          [-0.18, 0.2],
          [-0.3, 0.1],
        ],
        0.37,
        0.03
      ),
      N,
      [xf, 0, 0.05]
    );
    mk(
      three,
      mats,
      L,
      slabYZ(
        three,
        [
          [0.24, 0],
          [0.49, 0.05],
          [0.38, 0.15],
          [0.2, 0.12],
        ],
        0.3
      ),
      A,
      [xf, 0.004, 0.05],
      null,
      null,
      false
    );
    return L;
  });

  const hips = new three.Group();
  mk(
    three,
    mats,
    hips,
    tbox(three, tw * 0.72, tw * 0.6, 0.22, td * 0.72, td * 0.66),
    W,
    [0, hy + 0.04, 0]
  );
  mk(
    three,
    mats,
    hips,
    rbx(three, 0.17, 0.14, 0.06, 0.02),
    A,
    [0, hy + 0.04, td * 0.36 + 0.02],
    null,
    null,
    false
  );
  [-1, 1].forEach((s) => {
    mk(
      three,
      mats,
      hips,
      tbox(three, 0.26, 0.31, 0.34, 0.07, 0.07),
      W,
      [s * 0.155, hy - 0.17, td * 0.37],
      [-0.22, 0, s * 0.1]
    );
    mk(
      three,
      mats,
      hips,
      tbox(three, 0.2, 0.24, 0.05, 0.02, 0.02),
      A,
      [s * 0.16, hy - 0.31, td * 0.42],
      [-0.22, 0, s * 0.1],
      null,
      false
    );
    mk(
      three,
      mats,
      hips,
      tbox(three, 0.09, 0.09, 0.36, 0.3, 0.36),
      W,
      [s * tw * 0.4, hy - 0.1, 0],
      [0, 0, s * 0.18]
    );
  });

  const cy = hy + 0.36;
  const ch = th * 0.92;
  const torso = new three.Group();

  mk(three, mats, torso, Cy(three, tw * 0.2, tw * 0.24, 0.36, 8), N, [
    0,
    hy + 0.2,
    0,
  ]);
  mk(
    three,
    mats,
    torso,
    tbox(three, tw * 0.46, tw * 0.4, 0.3, td * 0.58, td * 0.52),
    N,
    [0, hy + 0.3, 0]
  );
  mk(
    three,
    mats,
    torso,
    slabXY(
      three,
      [
        [-tw * 0.27, 0],
        [tw * 0.27, 0],
        [tw * 0.5, ch * 0.46],
        [tw * 0.52, ch * 0.78],
        [tw * 0.34, ch],
        [-tw * 0.34, ch],
        [-tw * 0.52, ch * 0.78],
        [-tw * 0.5, ch * 0.46],
      ],
      td,
      0.06
    ),
    W,
    [0, cy, 0]
  );
  mk(
    three,
    mats,
    torso,
    slabXY(
      three,
      [
        [-tw * 0.49, ch * 0.6],
        [0, ch * 0.34],
        [tw * 0.49, ch * 0.6],
        [tw * 0.43, ch * 0.78],
        [0, ch * 0.55],
        [-tw * 0.43, ch * 0.78],
      ],
      0.08,
      0.015
    ),
    A,
    [0, cy, td / 2 + 0.01]
  );
  [-1, 1].forEach((s) =>
    mk(
      three,
      mats,
      torso,
      rbx(three, 0.16, 0.09, 0.05, 0.02),
      Y,
      [s * tw * 0.2, cy + ch * 0.85, td / 2 + 0.02],
      [0, 0, -s * 0.3],
      null,
      false
    )
  );
  mk(
    three,
    mats,
    torso,
    rbx(three, 0.13, 0.13, 0.05, 0.02),
    mats.bm(HX.melon),
    [0, cy + ch * 0.33, td / 2 + 0.05],
    [0, 0, Math.PI / 4],
    null,
    false
  );
  mk(
    three,
    mats,
    torso,
    slabXY(
      three,
      [
        [-tw * 0.3, 0],
        [tw * 0.3, 0],
        [tw * 0.2, 0.13],
        [-tw * 0.2, 0.13],
      ],
      td * 0.72,
      0.03
    ),
    W,
    [0, cy + ch - 0.01, -0.03]
  );
  mk(three, mats, torso, Cy(three, 0.1, 0.12, 0.2, 6), N, [
    0,
    cy + ch + 0.14,
    0,
  ]);

  const pack = new three.Group();
  const bz = -td / 2 - 0.12;
  mk(three, mats, pack, rbx(three, tw * 0.6, ch * 0.62, 0.26, 0.06), N, [
    0,
    cy + ch * 0.5,
    bz,
  ]);
  [-1, 1].forEach((s) => {
    mk(three, mats, pack, Cy(three, 0.07, 0.12, 0.2, 8), D, [
      s * tw * 0.16,
      cy + ch * 0.13,
      bz - 0.02,
    ]);
    const fin: Vec2Tuple[] = [
      [0, 0],
      [0.13, 0],
      [0.36, 0.6],
      [0.26, 0.64],
    ];
    mk(
      three,
      mats,
      pack,
      slabXY(three, s > 0 ? fin : mir(fin), 0.06, 0.015),
      W,
      [s * tw * 0.2, cy + ch * 0.72, bz - 0.08]
    );
  });

  const shY = cy + ch * 0.82;
  const pd: Vec2Tuple[] = [
    [-0.15, -0.2],
    [0.22, -0.24],
    [0.31, 0.02],
    [0.2, 0.21],
    [-0.12, 0.22],
    [-0.21, 0.04],
  ];
  const tf: Vec2Tuple[] = [
    [-0.04, 0],
    [0.13, 0],
    [0.05, 0.16],
  ];

  const arms = [-1, 1].map((s) => {
    const a = new three.Group();
    a.position.set(s * (tw / 2 + 0.17), shY, 0);
    mk(three, mats, a, Ic(three, 0.13, 1), N, [0, 0, 0]);
    mk(three, mats, a, slabXY(three, s > 0 ? pd : mir(pd), 0.5, 0.05), A, [
      s * 0.05,
      0.06,
      0,
    ]);
    mk(three, mats, a, slabXY(three, s > 0 ? tf : mir(tf), 0.32, 0.02), W, [
      s * 0.06,
      0.27,
      0,
    ]);
    mk(three, mats, a, Cy(three, 0.09, 0.08, 0.42, 6), N, [0, -0.36, 0]);
    mk(three, mats, a, Ic(three, 0.1, 1), N, [0, -0.6, 0]);
    mk(
      three,
      mats,
      a,
      tbox(three, 0.2, 0.27, 0.48, 0.22, 0.3),
      W,
      [0, -0.88, 0]
    );
    mk(
      three,
      mats,
      a,
      tbox(three, 0.28, 0.28, 0.07, 0.31, 0.31),
      A,
      [0, -1.13, 0],
      null,
      null,
      false
    );
    mk(three, mats, a, rbx(three, 0.2, 0.2, 0.21, 0.05), N, [0, -1.26, 0]);
    return a;
  });

  const head = new three.Group();
  head.position.set(0, shY + 0.36, 0);
  head.scale.setScalar(o.headK ?? 1.28);

  if (o.head === "dome") {
    mk(
      three,
      mats,
      head,
      Ic(three, 0.27, 1),
      W,
      [0, 0.06, 0],
      null,
      [1, 0.92, 1]
    );
    mk(
      three,
      mats,
      head,
      rbx(three, 0.46, 0.09, 0.12, 0.03),
      D,
      [0, 0.04, 0.2],
      null,
      null,
      false
    );
    eye3(three, mats, head, [0.07, 0.04, 0.27], 0.06);
  } else {
    mk(
      three,
      mats,
      head,
      slabYZ(
        three,
        [
          [-0.18, -0.13],
          [0.15, -0.13],
          [0.21, 0],
          [0.19, 0.12],
          [0.06, 0.23],
          [-0.15, 0.21],
          [-0.22, 0.06],
        ],
        0.38,
        0.03
      ),
      W,
      [0, 0, 0]
    );
    mk(
      three,
      mats,
      head,
      tbox(three, 0.22, 0.15, 0.13, 0.1, 0.08),
      N,
      [0, -0.08, 0.12]
    );
    mk(
      three,
      mats,
      head,
      rbx(three, 0.3, 0.07, 0.06, 0.02),
      D,
      [0, 0.04, 0.19],
      null,
      null,
      false
    );
    eye3(three, mats, head, [0.07, 0.04, 0.23], 0.05);
    mk(
      three,
      mats,
      head,
      slabYZ(
        three,
        [
          [0.08, 0.18],
          [0.17, 0.21],
          [-0.04, 0.5],
          [-0.17, 0.47],
        ],
        0.08,
        0.01
      ),
      A,
      [0, 0, 0]
    );
    [-1, 1].forEach((s) => {
      mk(
        three,
        mats,
        head,
        Cy(three, 0.06, 0.06, 0.06, 6),
        N,
        [s * 0.2, 0.02, 0],
        [0, 0, Math.PI / 2]
      );
      mk(
        three,
        mats,
        head,
        slabYZ(
          three,
          [
            [-0.03, 0],
            [0.03, 0],
            [-0.15, 0.22],
            [-0.2, 0.19],
          ],
          0.03
        ),
        W,
        [s * 0.215, 0.06, 0]
      );
    });
  }

  return { legs, hips, torso, pack, arms, head, shY, cy, ch, hy, tw, td };
}

/**
 * Baked parametric biped unit (second hoisted biped definition at reference line 13549).
 */
export function biped(
  three: typeof THREE,
  mats: MaterialRegistry,
  o: BipedOptions
): BipedHandle {
  const g = new three.Group();
  const m = mechParts(three, mats, o);
  [...m.legs, m.hips, m.torso, m.pack, ...m.arms, m.head].forEach((p) => {
    g.add(p);
    bake(three, mats, p);
  });
  glowS(
    three,
    mats,
    m.torso,
    [0, m.cy + m.ch * 0.33, m.td / 2 + 0.1],
    0.5,
    HX.melon
  );
  return {
    g,
    arms: m.arms,
    head: m.head,
    shY: m.shY,
    ty: m.cy + m.ch * 0.5,
  };
}

const ARCH_PANELS: [number, number, number, number][] = [
  [-1.5, 3.5, 0.2, 0.4],
  [1.3, 3.9, -0.2, -0.35],
  [-0.1, 4.6, -0.4, 0],
];
const ARCH_BASE_Y: Vec3Tuple = [3.5, 3.9, 4.6];

/**
 * Unit #1 in STB.classes (uiux - Plinth 0 "PRODUCT & INTERFACE").
 * Source: reference lines 9076-9099.
 */
export function uArchitect(
  three: typeof THREE,
  mats: MaterialRegistry
): UnitHandle {
  const b = biped(three, mats, { acc: HX.red, torso: [0.85, 1.0, 0.55] });
  const g = b.g;
  if (b.arms[0]) b.arms[0].rotation.set(0, 0, -2.4);
  if (b.arms[1]) b.arms[1].rotation.set(-0.3, 0, 0.3);

  const panels = ARCH_PANELS.map((p) =>
    plane(
      three,
      g,
      1.15,
      0.8,
      mats.TX("ui"),
      [p[0], p[1], p[2]],
      [0, p[3], 0],
      0.95
    )
  );

  return {
    g,
    w: 3.2,
    h: 5,
    upd: (t: number) => {
      for (let i = 0; i < panels.length; i++) {
        const m = panels[i];
        const by = ARCH_BASE_Y[i];
        if (m && by !== undefined) {
          m.position.y = by + Math.sin(t / 600 + i) * 0.1;
          (m.material as THREE.MeshBasicMaterial).opacity =
            0.7 + 0.3 * Math.sin(t / 140 + i * 2);
        }
      }
    },
  };
}

/**
 * Unit #2 in STB.classes (web - Plinth 0 "PRODUCT & INTERFACE").
 * Source: reference lines 9235-9287.
 */
export function uForge(
  three: typeof THREE,
  mats: MaterialRegistry
): UnitHandle {
  const b = biped(three, mats, {
    acc: HX.yel,
    legH: 1.05,
    torso: [1.55, 1.25, 0.95],
    stance: 0.24,
  });
  const g = b.g;

  const hazTex = mats.TX("haz");
  const hz = new three.Mesh(Bx(three, 1.58, 0.22, 0.98), [
    mats.tm(HX.dark),
    mats.tm(HX.dark),
    mats.tm(HX.dark),
    mats.tm(HX.dark),
    new three.MeshBasicMaterial({ map: hazTex }),
    new three.MeshBasicMaterial({ map: hazTex }),
  ]);
  hz.position.set(0, b.ty - 0.48, 0);
  g.add(hz);

  mk(
    three,
    mats,
    g,
    Bx(three, 0.8, 0.5, 0.06),
    mats.tm(HX.glass),
    [0, b.ty + 0.15, 0.5],
    null,
    null,
    false
  );
  glowS(three, mats, g, [0.25, b.ty + 0.28, 0.55], 0.3, 0xffffff);

  const can = new three.Group();
  can.position.set(0.95, b.shY + 0.35, 0);
  g.add(can);
  const G3 = mats.tm(HX.gun);
  mk(three, mats, can, Bx(three, 0.45, 0.35, 0.45), G3);
  mk(
    three,
    mats,
    can,
    Cy(three, 0.12, 0.14, 1.4, 6),
    G3,
    [0.6, 0.25, 0.2],
    [0, 0, AX + 0.5]
  );
  const mz = glowS(three, mats, can, [1.2, 0.6, 0.2], 0.6, HX.red);

  b.arms.forEach((a, i) => {
    a.scale.set(1.35, 1.1, 1.35);
    a.rotation.z = i ? 0.15 : -0.15;
  });

  return {
    g,
    w: 2.8,
    h: 3.9,
    upd: (t: number) => {
      (mz.material as THREE.SpriteMaterial).opacity =
        0.6 + 0.4 * Math.sin(t / 160);
    },
  };
}
