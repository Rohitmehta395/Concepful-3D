import type * as THREE from "three";
import { HX, type MaterialRegistry } from "../world/materials";
import {
  Bx,
  Co,
  Cy,
  Do,
  Ex,
  Hemi,
  Ic,
  Tor,
  bake,
  eye3,
  flame3,
  flick,
  glowS,
  holoEdges,
  mir,
  mk,
  plane,
  rbx,
  slabXY,
  slabYZ,
  tbox,
  textSprite,
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
  upd(t: number, opts?: { reduceMotion?: boolean }): void;
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
    mk(three, mats, head, Cy(three, 0.02, 0.02, 0.24, 4), N, [0.1, 0.38, 0]);
    mk(three, mats, head, Ic(three, 0.05), A, [0.1, 0.5, 0]);
    mk(
      three,
      mats,
      head,
      tbox(three, 0.3, 0.36, 0.1, 0.36, 0.4),
      N,
      [0, -0.2, 0]
    );
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

const KLB = ["SEO", "SOCIAL", "PAID", "EMAIL", "PR", "EVENTS"] as const;

export interface KrakenOptions {
  boss?: boolean;
}

/**
 * Unit in STB.classes (gtm - Plinth 0 "POSITIONING & LAUNCH").
 * Source: reference lines 8824-8915.
 */
export function uKraken(
  three: typeof THREE,
  mats: MaterialRegistry,
  opt: KrakenOptions = {}
): UnitHandle & { readonly eyeRef: THREE.Object3D } {
  const g = new three.Group();
  const top = new three.Group();
  g.add(top);
  const eyeRef = new three.Object3D();
  eyeRef.position.set(0, 2.9, 1.08);
  top.add(eyeRef);

  const G3 = mats.tm(HX.gun);
  const B3 = mats.tm(HX.bone);
  mk(three, mats, top, Cy(three, 1.35, 1.05, 0.45, 8), G3, [0, 1.9, 0]);
  mk(
    three,
    mats,
    top,
    Hemi(three, 1.3, 8, 3),
    B3,
    [0, 2.1, 0],
    null,
    [1, 1.55, 1]
  );
  mk(
    three,
    mats,
    top,
    Tor(three, 1.32, 0.08, 3, 8),
    mats.tm(HX.blu),
    [0, 2.45, 0],
    [Math.PI / 2, 0, 0]
  );
  eye3(three, mats, top, [0, 2.9, 1.08], opt.boss ? 0.42 : 0.24);
  if (!opt.boss) {
    eye3(three, mats, top, [-0.6, 3.15, 0.85], 0.08);
    eye3(three, mats, top, [0.6, 3.15, 0.85], 0.08);
  } else {
    mk(
      three,
      mats,
      top,
      Tor(three, 1.32, 0.08, 3, 8),
      mats.tm(HX.red),
      [0, 2.2, 0],
      [Math.PI / 2, 0, 0]
    );
  }

  const T = [
    { x: -0.5, a: 200, c: -7 },
    { x: -0.85, a: 170, c: -8 },
    { x: -1.0, a: 140, c: -3 },
    { x: 0.5, a: -20, c: 7 },
    { x: 0.85, a: 10, c: 8 },
    { x: 1.0, a: 40, c: 3 },
  ].map((o, i) => {
    const ch: THREE.Mesh[] = [];
    for (let k = 0; k < 10; k++) {
      ch.push(
        mk(
          three,
          mats,
          g,
          Cy(three, 0.15 - k * 0.009, 0.15 - k * 0.009, 0.46, 5),
          k % 2 ? G3 : B3
        )
      );
    }
    const pod = new three.Group();
    g.add(pod);
    mk(three, mats, pod, Bx(three, 0.75, 0.45, 0.55), B3);
    mk(
      three,
      mats,
      pod,
      Bx(three, 0.77, 0.08, 0.57),
      mats.tm(HX.blu),
      [0, -0.05, 0],
      null,
      null,
      false
    );
    eye3(three, mats, pod, [0.2, 0.05, 0.3], 0.05);
    [-0.18, 0.08].forEach((x) =>
      mk(three, mats, pod, Ic(three, 0.1), B3, [x, 0.32, 0.05])
    );
    const lb = textSprite(three, KLB[i]!, "#FFFFFF", 0.38);
    lb.position.set(0, 0.62, 0);
    pod.add(lb);
    if (opt.boss) pod.visible = false;
    return { ...o, ch, pod, z: ((i % 3) - 1) * 0.3 };
  });

  return {
    g,
    eyeRef,
    w: 7,
    h: 5.4,
    upd: (t: number) => {
      top.position.y = Math.sin(t / 900) * 0.12;
      T.forEach((o, i) => {
        let x = o.x;
        let y = 1.75 + top.position.y;
        let ang = o.a;
        o.ch.forEach((m, k) => {
          ang += -o.c * -1 + Math.sin(t / 650 + i * 1.3 + k * 0.45) * 5 * 0.4;
          const r = (ang * Math.PI) / 180;
          const nx = x + Math.cos(r) * 0.44;
          const ny = y - Math.sin(r) * 0.44;
          m.position.set((x + nx) / 2, (y + ny) / 2, o.z);
          m.rotation.set(0, 0, Math.atan2(ny - y, nx - x) - Math.PI / 2);
          x = nx;
          y = ny;
        });
        o.pod.position.set(x, y + 0.2, o.z);
      });
    },
  };
}

/**
 * Unit in STB.classes (dir - Plinth 0 "POSITIONING & LAUNCH").
 * Source: reference lines 8916-8956.
 */
export function uMarshal(
  three: typeof THREE,
  mats: MaterialRegistry
): UnitHandle {
  const b = biped(three, mats, {
    acc: HX.blu,
    torso: [1.05, 1.1, 0.65],
    stance: 0.18,
  });
  const g = b.g;
  mk(
    three,
    mats,
    g,
    Ex(
      three,
      [
        [-0.55, 0],
        [0.55, 0],
        [0.75, -1.6],
        [0, -1.85],
        [-0.75, -1.6],
      ],
      0.05
    ),
    mats.tm(HX.blu),
    [0, b.shY + 0.05, -0.36]
  );
  b.arms[1]!.rotation.set(-0.3, 0, 0.35);
  b.arms[0]!.rotation.set(0, 0, -0.5);
  const pole = new three.Group();
  pole.position.set(1.05, 0, 0.25);
  g.add(pole);
  mk(
    three,
    mats,
    pole,
    Cy(three, 0.05, 0.05, 4.6, 5),
    mats.tm(HX.gun),
    [0, 2.3, 0]
  );
  const flag = plane(three, pole, 1.5, 1.05, mats.TX("flag"), [0.78, 4.0, 0]);
  mk(three, mats, pole, Ic(three, 0.12), mats.tm(HX.yel), [0, 4.65, 0]);
  return {
    g,
    w: 2.8,
    h: 4.8,
    upd: (t: number) => {
      flag.rotation.y = Math.sin(t / 400) * 0.35;
      flag.position.x = 0.78 * Math.cos(flag.rotation.y);
      flag.position.z = -0.78 * Math.sin(flag.rotation.y);
    },
  };
}

/**
 * Unit in STB.classes (brand - Plinth 1 "BRAND & IDENTITY").
 * Source: reference lines 9044-9075.
 */
export function uRonin(
  three: typeof THREE,
  mats: MaterialRegistry
): UnitHandle {
  const b = biped(three, mats, {
    acc: HX.red,
    torso: [0.85, 1.0, 0.55],
    stance: 0.24,
  });
  const g = b.g;
  b.arms[1]!.rotation.set(0, 0, 2.5);
  b.arms[0]!.rotation.set(-0.4, 0, -0.35);
  const bl = new three.Group();
  bl.position.set(0, -1.25, 0);
  b.arms[1]!.add(bl);
  mk(three, mats, bl, Bx(three, 0.32, 0.08, 0.32), mats.tm(HX.yel));
  mk(
    three,
    mats,
    bl,
    Bx(three, 0.09, 2.6, 0.18),
    mats.bm(0xffe3e6),
    [0, -1.35, 0],
    null,
    null,
    false
  );
  [-0.6, -1.4, -2.2].forEach((y) =>
    glowS(three, mats, bl, [0, y, 0], 1.0, HX.red)
  );
  return {
    g,
    w: 2.4,
    h: 4.6,
    upd: (t: number) => {
      b.arms[1]!.rotation.z = 2.5 + Math.sin(t / 900) * 0.08;
    },
  };
}

/**
 * Unit in STB.classes (decks - Plinth 1 "BRAND & IDENTITY").
 * Source: reference lines 9100-9125.
 */
export function uHerald(
  three: typeof THREE,
  mats: MaterialRegistry
): UnitHandle {
  const b = biped(three, mats, {
    acc: HX.red,
    torso: [1.0, 1.05, 0.65],
    stance: 0.16,
  });
  const g = b.g;
  b.arms[0]!.rotation.set(-0.5, 0, -0.2);
  b.arms[1]!.rotation.set(-0.5, 0, 0.2);
  const G3 = mats.tm(HX.gun);
  [-0.45, 0.45].forEach((x) =>
    mk(three, mats, g, Cy(three, 0.04, 0.04, 1.5, 4), G3, [
      x,
      b.shY + 0.75,
      -0.4,
    ])
  );
  const bb = new three.Group();
  bb.position.set(0, b.shY + 1.9, -0.45);
  g.add(bb);
  mk(three, mats, bb, Bx(three, 2.7, 1.55, 0.12), G3);
  plane(three, bb, 2.5, 1.38, mats.TX("chart"), [0, 0, 0.07]);
  return {
    g,
    w: 2.8,
    h: 5.2,
    upd: (t: number) => {
      bb.rotation.z = Math.sin(t / 800) * 0.03;
    },
  };
}

/**
 * Unit in STB.classes (illus - Plinth 1 "BRAND & IDENTITY").
 * Source: reference lines 9157-9234.
 * Note: `base` Vector3 is hoisted outside `upd` for zero per-frame allocations.
 */
export function uFresco(
  three: typeof THREE,
  mats: MaterialRegistry
): UnitHandle {
  const b = biped(three, mats, {
    acc: HX.red,
    legH: 0.85,
    torso: [1.05, 0.95, 0.75],
    stance: 0.2,
    head: "dome",
  });
  const g = b.g;
  mk(three, mats, g, Cy(three, 0.3, 0.3, 1.0, 8), mats.tm(HX.yel), [
    -0.25,
    b.ty + 0.1,
    -0.6,
  ]);
  b.arms[1]!.rotation.set(-1.4, 0, 0.6);
  const nz = new three.Group();
  nz.position.set(0, -1.3, 0);
  b.arms[1]!.add(nz);
  mk(
    three,
    mats,
    nz,
    Cy(three, 0.07, 0.1, 0.5, 5),
    mats.tm(HX.gun),
    [0, -0.2, 0]
  );
  const cols = [HX.red, HX.yel, HX.blu, HX.teal] as const;
  const dots: THREE.Mesh[] = [];
  for (let k = 0; k < 14; k++) {
    dots.push(
      mk(
        three,
        mats,
        g,
        Ic(three, 0.08 + (k % 3) * 0.03),
        mats.bm(cols[k % 4]!),
        [0, 0, 0],
        null,
        null,
        false
      )
    );
  }
  const groundSplatters: [number, number, number, number][] = [
    [-0.9, 0.02, 0.3, 0],
    [0.9, 0.02, 0.5, 1],
    [0, 0.02, 1.0, 2],
  ];
  groundSplatters.forEach(([x, y, z, c]) =>
    mk(
      three,
      mats,
      g,
      Cy(three, 0.32, 0.32, 0.02, 8),
      mats.bm(cols[c]!),
      [x, y, z],
      null,
      null,
      false
    )
  );
  const torsoSplatters: [number, number, number, number][] = [
    [-0.2, b.ty, 0.39, 0],
    [0.25, b.ty - 0.25, 0.39, 2],
  ];
  torsoSplatters.forEach(([x, y, z, c]) =>
    mk(
      three,
      mats,
      g,
      Cy(three, 0.1, 0.1, 0.02, 6),
      mats.bm(cols[c]!),
      [x, y, z],
      [Math.PI / 2, 0, 0],
      null,
      false
    )
  );

  const base = new three.Vector3();
  return {
    g,
    w: 2.6,
    h: 3.2,
    upd: (t: number) => {
      nz.getWorldPosition(base);
      g.worldToLocal(base);
      dots.forEach((d, k) => {
        const u = (t / 650 + k / 14) % 1;
        d.position.set(
          base.x + u * 2.2,
          base.y + 0.1 + u * 0.9 - u * u * 1.6,
          base.z + u * 0.8
        );
        d.scale.setScalar(1 - u * 0.5);
      });
    },
  };
}

/**
 * Unit in STB.classes (motion - Plinth 2 "PRODUCT & INTERFACE").
 * Source: reference lines 9288-9354.
 */
export function uDolly(
  three: typeof THREE,
  mats: MaterialRegistry
): UnitHandle {
  const g = new three.Group();
  const G3 = mats.tm(HX.gun);
  const B3 = mats.tm(HX.bone);
  const wh = new three.Group();
  wh.position.set(0, 0.72, 0);
  g.add(wh);
  mk(three, mats, wh, Cy(three, 0.72, 0.72, 0.26, 12), mats.tm(HX.dark), null, [
    Math.PI / 2,
    0,
    0,
  ]);
  mk(three, mats, wh, Cy(three, 0.45, 0.45, 0.3, 8), G3, null, [
    Math.PI / 2,
    0,
    0,
  ]);
  mk(three, mats, wh, Bx(three, 0.85, 0.08, 0.34), B3, null, null, null, false);
  [-1, 1].forEach((s) =>
    mk(three, mats, g, Bx(three, 0.08, 1.0, 0.08), G3, [s * 0.2, 1.3, 0])
  );
  mk(three, mats, g, Bx(three, 0.8, 0.8, 0.55), B3, [0, 2.15, 0]);
  mk(
    three,
    mats,
    g,
    Bx(three, 0.82, 0.12, 0.57),
    mats.tm(HX.yel),
    [0, 1.95, 0],
    null,
    null,
    false
  );
  [-1, 1].forEach((s) => {
    mk(
      three,
      mats,
      g,
      Bx(three, 0.14, 0.5, 0.14),
      G3,
      [s * 0.52, 2.0, 0.1],
      [0, 0, s * 0.3]
    );
  });
  mk(three, mats, g, Bx(three, 0.9, 0.6, 0.6), G3, [0, 2.9, 0]);
  mk(
    three,
    mats,
    g,
    Cy(three, 0.24, 0.28, 0.5, 8),
    G3,
    [0, 2.9, 0.5],
    [Math.PI / 2, 0, 0]
  );
  mk(
    three,
    mats,
    g,
    Cy(three, 0.2, 0.2, 0.04, 10),
    mats.tm(HX.glass),
    [0, 2.9, 0.77],
    [Math.PI / 2, 0, 0],
    null,
    false
  );
  glowS(three, mats, g, [0.06, 2.96, 0.8], 0.3, 0xffffff);
  const reels = [-0.25, 0.25].map((x) => {
    const r = new three.Group();
    r.position.set(x, 3.5, 0);
    g.add(r);
    mk(three, mats, r, Cy(three, 0.3, 0.3, 0.1, 10), G3, null, [
      Math.PI / 2,
      0,
      0,
    ]);
    mk(three, mats, r, Bx(three, 0.5, 0.06, 0.12), B3, null, null, null, false);
    return r;
  });
  const rec = eye3(three, mats, g, [-0.35, 3.1, 0.32], 0.06);
  return {
    g,
    w: 1.9,
    h: 3.9,
    upd: (t: number) => {
      wh.rotation.z = -t / 300;
      reels.forEach((r) => (r.rotation.z = -t / 200));
      rec.visible = Math.sin(t / 300) > 0;
      g.rotation.z = Math.sin(t / 700) * 0.04;
    },
  };
}

/**
 * Unit in STB.classes ("3d" - Plinth 2 "PRODUCT & INTERFACE").
 * Source: reference lines 9355-9410.
 */
export function uPrism(
  three: typeof THREE,
  mats: MaterialRegistry
): UnitHandle {
  const g = new three.Group();
  const body = new three.Group();
  g.add(body);
  const fl: THREE.Group[] = [];
  const G3 = mats.tm(HX.gun);
  const B3 = mats.tm(HX.bone);
  mk(
    three,
    mats,
    body,
    Co(three, 0.5, 0.7, 6),
    G3,
    [0, 1.0, 0],
    [Math.PI, 0, 0]
  );
  fl.push(flame3(three, mats, body, [0, 0.65, 0], 0.9, 0.22));
  mk(three, mats, body, Bx(three, 0.9, 1.0, 0.6), B3, [0, 1.85, 0]);
  mk(
    three,
    mats,
    body,
    Bx(three, 0.92, 0.12, 0.62),
    mats.tm(HX.yel),
    [0, 1.6, 0],
    null,
    null,
    false
  );
  [-1, 1].forEach((s) => {
    mk(
      three,
      mats,
      body,
      Bx(three, 0.18, 0.6, 0.2),
      B3,
      [s * 0.55, 1.9, 0.25],
      [-0.9, 0, 0]
    );
  });
  mk(three, mats, body, Bx(three, 0.42, 0.36, 0.4), B3, [0, 2.55, 0]);
  eye3(three, mats, body, [0, 2.57, 0.21], 0.055);
  const cube = new three.Group();
  cube.position.set(0, 3.4, 0.3);
  body.add(cube);
  holoEdges(three, cube, Bx(three, 0.6, 0.6, 0.6));
  holoEdges(three, cube, Ic(three, 0.42));
  const beam = new three.Mesh(
    Co(three, 0.45, 0.8, 6),
    new three.MeshBasicMaterial({
      color: HX.holo,
      transparent: true,
      opacity: 0.15,
      depthWrite: false,
    })
  );
  beam.position.set(0, 2.95, 0.3);
  body.add(beam);
  return {
    g,
    w: 1.9,
    h: 4,
    upd: (t: number) => {
      body.position.y = Math.sin(t / 700) * 0.15;
      cube.rotation.set(t / 1400, t / 900, 0);
      flick(fl, t);
    },
  };
}

/**
 * Unit in STB.rules (pm).
 * Source: reference lines 9522-9591.
 */
export function uNexus(
  three: typeof THREE,
  mats: MaterialRegistry
): UnitHandle {
  const g = new three.Group();
  const G3 = mats.tm(HX.gun);
  const B3 = mats.tm(HX.bone);

  const legConfigs: [number, number][] = [
    [-1.3, 1],
    [-1.3, -1],
    [1.3, 1],
    [1.3, -1],
  ];
  const legs = legConfigs.map(([x, z]) => {
    const k = mk(three, mats, g, Cy(three, 0.09, 0.09, 1.1, 4), G3);
    const f = mk(three, mats, g, Cy(three, 0.08, 0.05, 1.9, 4), B3);
    return { x, z, k, f };
  });

  mk(three, mats, g, Bx(three, 3.4, 0.7, 1.4), B3, [0, 2.0, 0]);
  mk(
    three,
    mats,
    g,
    Bx(three, 3.42, 0.12, 1.42),
    mats.tm(HX.teal),
    [0, 1.85, 0],
    null,
    null,
    false
  );
  mk(three, mats, g, Bx(three, 0.8, 0.75, 1.2), B3, [1.95, 2.15, 0]);
  mk(
    three,
    mats,
    g,
    Bx(three, 0.05, 0.4, 0.9),
    mats.tm(HX.glass),
    [2.36, 2.25, 0],
    null,
    null,
    false
  );
  eye3(three, mats, g, [2.37, 1.95, 0.35], 0.06);
  [HX.teal, HX.yel, HX.bone, HX.blu, HX.red].forEach((c, i) =>
    mk(
      three,
      mats,
      g,
      Bx(three, 0.58, 0.42 + (i % 2) * 0.12, 1.1),
      mats.tm(c),
      [-1.35 + i * 0.62, 2.6 + (i % 2) * 0.06, 0]
    )
  );

  return {
    g,
    w: 4.4,
    h: 3.0,
    upd: (t: number) => {
      legs.forEach((l, i) => {
        const ph = Math.sin(t / 260 + i * 1.6) * 0.12;
        const hx = l.x * 0.9;
        const hy = 1.8;
        const kx = l.x * 1.25;
        const ky = 2.35 + ph;
        const fx = l.x * 1.45;
        const fy = 0;
        l.k.position.set((hx + kx) / 2, (hy + ky) / 2, l.z * 0.8);
        l.k.rotation.set(0, 0, Math.atan2(ky - hy, kx - hx) - Math.PI / 2);
        l.f.position.set((kx + fx) / 2, (ky + fy) / 2, l.z * 0.9);
        l.f.rotation.set(0, 0, Math.atan2(fy - ky, fx - kx) - Math.PI / 2);
      });
    },
  };
}

/**
 * Unit in STB.rules (ws).
 * Source: reference lines 9592-9654.
 */
export function uHub(three: typeof THREE, mats: MaterialRegistry): UnitHandle {
  const g = new three.Group();
  const G3 = mats.tm(HX.gun);
  const B3 = mats.tm(HX.bone);

  mk(three, mats, g, Bx(three, 3.0, 0.3, 1.4), G3, [0, 0.55, 0]);
  const body = new three.Mesh(Bx(three, 2.0, 1.5, 1.4), [
    B3,
    B3,
    B3,
    B3,
    new three.MeshBasicMaterial({ map: mats.TX("ctx") }),
    B3,
  ]);
  body.position.set(-0.5, 1.45, 0);
  g.add(body);
  const o = new three.Mesh(body.geometry, mats.INK);
  o.scale.set(1.04, 1.05, 1.06);
  body.add(o);

  mk(
    three,
    mats,
    g,
    Bx(three, 2.02, 0.12, 1.42),
    mats.tm(HX.teal),
    [-0.5, 0.8, 0],
    null,
    null,
    false
  );
  mk(three, mats, g, Bx(three, 1.0, 1.1, 1.4), B3, [1.0, 1.25, 0]);
  mk(
    three,
    mats,
    g,
    Bx(three, 0.05, 0.5, 1.1),
    mats.tm(HX.glass),
    [1.52, 1.45, 0],
    null,
    null,
    false
  );
  [-1.0, 0.1, 1.0].forEach((x) =>
    mk(
      three,
      mats,
      g,
      Cy(three, 0.38, 0.38, 0.3, 10),
      mats.tm(HX.dark),
      [x, 0.38, 0.6],
      [Math.PI / 2, 0, 0]
    )
  );
  mk(three, mats, g, Cy(three, 0.04, 0.04, 0.9, 4), G3, [-1.2, 2.6, 0]);
  const dish = mk(
    three,
    mats,
    g,
    Cy(three, 0.4, 0.08, 0.14, 8),
    B3,
    [-1.2, 3.1, 0],
    [0.7, 0, 0]
  );
  const bc = eye3(three, mats, g, [0.9, 1.9, 0], 0.07);

  return {
    g,
    w: 3.4,
    h: 3.4,
    upd: (t: number) => {
      dish.rotation.y = t / 600;
      bc.visible = Math.sin(t / 260) > 0;
    },
  };
}

/**
 * Unit in STB.rules (cmd).
 * Source: reference lines 9655-9703.
 */
export function uWatch(
  three: typeof THREE,
  mats: MaterialRegistry
): UnitHandle {
  const g = new three.Group();
  const G3 = mats.tm(HX.gun);
  const B3 = mats.tm(HX.bone);

  const legCoords: [number, number][] = [
    [-1, 0.6],
    [1, 0.6],
    [0, -0.9],
  ];
  legCoords.forEach(([x, z]) => {
    const m = mk(
      three,
      mats,
      g,
      Cy(three, 0.08, 0.06, 3.4, 4),
      z < 0 ? B3 : G3
    );
    m.position.set(x * 0.5, 1.6, z * 0.5);
    m.rotation.set(-z * 0.33, 0, x * 0.3);
  });
  mk(three, mats, g, Bx(three, 1.3, 0.8, 1.1), B3, [0, 3.4, 0]);
  mk(
    three,
    mats,
    g,
    Bx(three, 1.32, 0.12, 1.12),
    mats.tm(HX.teal),
    [0, 3.2, 0],
    null,
    null,
    false
  );
  eye3(three, mats, g, [0.3, 3.45, 0.57], 0.1);
  mk(three, mats, g, Cy(three, 0.06, 0.06, 0.6, 4), G3, [0, 4.05, 0]);
  const dish = new three.Group();
  dish.position.set(0, 4.5, 0);
  g.add(dish);
  mk(three, mats, dish, Cy(three, 1.0, 0.2, 0.35, 8), B3, null, [1.1, 0, 0]);
  mk(
    three,
    mats,
    dish,
    Cy(three, 0.04, 0.04, 0.7, 4),
    G3,
    [0, 0.1, 0.3],
    [1.1, 0, 0]
  );
  const cone = new three.Mesh(
    Co(three, 0.8, 4, 8),
    new three.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.07,
      depthWrite: false,
    })
  );
  cone.position.set(1.8, 3.4, 0.6);
  cone.rotation.z = Math.PI / 2 + 0.2;
  g.add(cone);

  return {
    g,
    w: 2.4,
    h: 5.4,
    upd: (t: number) => {
      dish.rotation.y = t / 650;
    },
  };
}

/**
 * uLancer ("pos"): Biped with lance arm + holo eye/glow.
 * Reference lines 8801-8822.
 */
export function uLancer(
  three: typeof THREE,
  mats: MaterialRegistry
): UnitHandle {
  const b = biped(three, mats, {
    acc: HX.blu,
    torso: [0.8, 1.0, 0.55],
    stance: 0.1,
  });
  const g = b.g;
  b.arms[0]!.rotation.set(-1.3, 0, -0.5);
  b.arms[1]!.rotation.set(-1.25, 0, 0.25);
  const r = new three.Group();
  r.position.set(0.1, b.shY - 0.25, 0.75);
  g.add(r);
  const G3 = mats.tm(HX.gun);
  mk(three, mats, r, Bx(three, 2.8, 0.14, 0.16), G3, [0.4, 0, 0]);
  mk(three, mats, r, Bx(three, 0.6, 0.2, 0.16), G3, [-0.9, -0.12, 0]);
  mk(three, mats, r, Bx(three, 0.7, 0.16, 0.16), G3, [0.4, 0.18, 0]);
  eye3(three, mats, r, [0.78, 0.18, 0], 0.06);
  glowS(three, mats, r, [1.85, 0, 0], 0.5, HX.holo);
  return {
    g,
    w: 2.6,
    h: 3.4,
    upd: (t: number) => {
      r.rotation.y = Math.sin(t / 1400) * 0.15;
    },
  };
}

/**
 * uQuill ("copy"): Dome-headed biped holding a pen with textSprite bubble.
 * Reference lines 9126-9156.
 */
export function uQuill(
  three: typeof THREE,
  mats: MaterialRegistry
): UnitHandle {
  const b = biped(three, mats, {
    acc: HX.red,
    legH: 1.0,
    torso: [0.7, 0.8, 0.45],
    head: "dome",
  });
  const g = b.g;
  g.scale.setScalar(0.9);
  b.arms[0]!.rotation.set(-1.0, 0, 0.4);
  b.arms[1]!.rotation.set(-1.0, 0, -0.3);
  const pen = new three.Group();
  pen.position.set(0.1, 1.9, 0.55);
  pen.rotation.z = -0.75;
  g.add(pen);
  const B3 = mats.tm(HX.bone);
  mk(three, mats, pen, Cy(three, 0.08, 0.08, 3.6, 6), B3, [0, 0, 0]);
  mk(
    three,
    mats,
    pen,
    Co(three, 0.13, 0.6, 4),
    mats.tm(HX.chrome),
    [0, 2.1, 0]
  );
  eye3(three, mats, pen, [0, 2.42, 0], 0.06);
  mk(
    three,
    mats,
    pen,
    Bx(three, 0.22, 0.2, 0.22),
    mats.tm(HX.red),
    [0, 1.6, 0]
  );
  const bub = textSprite(three, "Aa", "#ECE6D6", 0.55);
  bub.position.set(1.9, 4.0, 0);
  g.add(bub);
  return {
    g,
    w: 2.6,
    h: 4.6,
    upd: (t: number) => {
      bub.position.y = 4.0 + Math.sin(t / 500) * 0.12;
    },
  };
}

/**
 * uStamp ("naming"): Biped carrying NAME™ sign board.
 * Reference lines 8957-8989.
 */
export function uStamp(
  three: typeof THREE,
  mats: MaterialRegistry
): UnitHandle {
  const b = biped(three, mats, {
    acc: HX.blu,
    legH: 0.8,
    torso: [1.15, 0.95, 0.75],
    stance: 0.18,
    head: "dome",
  });
  const g = b.g;
  b.arms[0]!.rotation.z = -2.75;
  b.arms[1]!.rotation.z = 2.75;

  const B3 = mats.tm(HX.bone);
  const signGeom = Bx(three, 2.4, 1.05, 0.12);
  const signMat = [
    B3,
    B3,
    B3,
    B3,
    new three.MeshBasicMaterial({ map: mats.TX("name") }),
    B3,
  ];
  const sign = new three.Mesh(signGeom, signMat);
  sign.position.set(0, b.shY + 1.75, 0);
  g.add(sign);

  const o = new three.Mesh(signGeom, mats.INK);
  o.scale.set(1.04, 1.08, 1.6);
  sign.add(o);

  const baseShY = b.shY + 1.75;
  return {
    g,
    w: 2.6,
    h: 3.9,
    upd: (t: number) => {
      sign.position.y = baseShY + Math.sin(t / 500) * 0.08;
    },
  };
}

/**
 * uArachne ("research"): Hexapod spider research mech with rotating dish.
 * Reference lines 8990-9042.
 */
export function uArachne(
  three: typeof THREE,
  mats: MaterialRegistry
): UnitHandle {
  const g = new three.Group();
  const B3 = mats.tm(HX.bone);
  const G3 = mats.tm(HX.gun);

  interface ArachneLeg {
    s: number;
    z: number;
    i: number;
    k: THREE.Mesh;
    f: THREE.Mesh;
  }

  const legs: ArachneLeg[] = [];
  [-1, 1].forEach((s) => {
    [-0.5, 0, 0.5].forEach((z, i) => {
      const k = mk(
        three,
        mats,
        g,
        Cy(three, 0.07, 0.07, 1.0, 4),
        i % 2 ? G3 : B3
      );
      const f = mk(three, mats, g, Cy(three, 0.06, 0.03, 1.25, 4), G3);
      legs.push({ s, z, i, k, f });
    });
  });

  mk(three, mats, g, Do(three, 0.7), B3, [0, 1.25, 0], null, [1.4, 0.62, 1.05]);
  mk(
    three,
    mats,
    g,
    Bx(three, 1.7, 0.08, 1.25),
    mats.tm(HX.blu),
    [0, 1.32, 0],
    null,
    null,
    false
  );
  mk(three, mats, g, Ic(three, 0.38), G3, [0, 1.15, 0.75]);
  eye3(three, mats, g, [0, 1.18, 1.08], 0.14);
  eye3(three, mats, g, [-0.24, 1.36, 0.95], 0.05);
  eye3(three, mats, g, [0.24, 1.36, 0.95], 0.05);
  mk(three, mats, g, Cy(three, 0.04, 0.04, 0.6, 4), G3, [0, 1.85, 0]);
  const dish = mk(
    three,
    mats,
    g,
    Cy(three, 0.45, 0.1, 0.18, 8),
    B3,
    [0, 2.2, 0],
    [0.6, 0, 0]
  );

  return {
    g,
    w: 3.2,
    h: 2.6,
    upd: (t: number) => {
      for (let j = 0; j < legs.length; j++) {
        const L = legs[j]!;
        const ph = Math.sin(t / 220 + L.i * 2 + L.s) * 0.18;
        const hx = L.s * 0.55;
        const hy = 1.2;
        const kx = L.s * 1.25;
        const ky = 1.75 + ph;
        const fx = L.s * 1.8;
        const fy = 0;
        L.k.position.set((hx + kx) / 2, (hy + ky) / 2, L.z * 1.3);
        L.k.rotation.set(0, 0, Math.atan2(ky - hy, kx - hx) - Math.PI / 2);
        L.f.position.set((kx + fx) / 2, (ky + fy) / 2, L.z * 1.6);
        L.f.rotation.set(0, 0, Math.atan2(fy - ky, fx - kx) - Math.PI / 2);
      }
      dish.rotation.y = t / 600;
    },
  };
}

/**
 * uGantry ("fab"): Gantry crane crawler with hazard stripes and moving stack.
 * Reference lines 9411-9489.
 */
export function uGantry(
  three: typeof THREE,
  mats: MaterialRegistry
): UnitHandle {
  const g = new three.Group();
  const B3 = mats.tm(HX.bone);
  const G3 = mats.tm(HX.gun);

  mk(three, mats, g, Bx(three, 3.2, 0.62, 1.4), G3, [0, 0.31, 0]);
  const wh: THREE.Mesh[] = [];
  for (let i = 0; i < 6; i++) {
    const w = mk(
      three,
      mats,
      g,
      Cy(three, 0.22, 0.22, 0.08, 8),
      mats.tm(HX.dark),
      [-1.25 + i * 0.5, 0.31, 0.72],
      [Math.PI / 2, 0, 0]
    );
    wh.push(w);
  }

  mk(three, mats, g, Bx(three, 3.0, 0.5, 1.3), B3, [0, 0.87, 0]);

  const hzMatDark = mats.tm(HX.dark);
  const hzMatHaz = new three.MeshBasicMaterial({ map: mats.TX("haz") });
  const hz = new three.Mesh(Bx(three, 3.02, 0.16, 1.32), [
    hzMatDark,
    hzMatDark,
    hzMatDark,
    hzMatDark,
    hzMatHaz,
    hzMatHaz,
  ]);
  hz.position.set(0, 0.75, 0);
  g.add(hz);

  mk(three, mats, g, Bx(three, 0.9, 0.9, 1.2), B3, [-1.0, 1.57, 0]);
  mk(
    three,
    mats,
    g,
    Bx(three, 0.7, 0.4, 0.04),
    mats.tm(HX.glass),
    [-1.0, 1.65, 0.62],
    null,
    null,
    false
  );
  eye3(three, mats, g, [-1.3, 1.9, 0.62], 0.05);
  mk(
    three,
    mats,
    g,
    Cy(three, 0.12, 0.12, 3.0, 6),
    mats.tm(HX.yel),
    [0.1, 2.6, 0]
  );
  mk(
    three,
    mats,
    g,
    Bx(three, 2.0, 0.16, 0.16),
    mats.tm(HX.yel),
    [1.0, 4.05, 0]
  );

  const cab = mk(
    three,
    mats,
    g,
    Cy(three, 0.015, 0.015, 1, 3),
    mats.tm(HX.dark),
    [1.75, 3.5, 0],
    null,
    null,
    false
  );

  const head = new three.Group();
  g.add(head);
  mk(three, mats, head, Bx(three, 0.35, 0.3, 0.35), G3);
  eye3(three, mats, head, [0, -0.2, 0], 0.05);

  const stack: THREE.Mesh[] = [];
  for (let i = 0; i < 12; i++) {
    stack.push(
      mk(
        three,
        mats,
        g,
        Bx(three, 0.55 - i * 0.02, 0.08, 0.55 - i * 0.02),
        i % 2 ? mats.tm(HX.bone2) : B3,
        [1.75, 1.16 + i * 0.085, 0],
        null,
        null,
        false
      )
    );
  }

  return {
    g,
    w: 3.6,
    h: 4.4,
    upd: (t: number, opts?: { reduceMotion?: boolean }) => {
      const hy = 2.6 + Math.sin(t / 500) * 0.15;
      head.position.set(1.75, hy, 0);
      cab.scale.y = 4.0 - hy;
      cab.position.y = (4.0 + hy) / 2;
      const reduce =
        opts?.reduceMotion ??
        (typeof window !== "undefined" && window.matchMedia
          ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
          : false);
      const n = reduce ? 8 : Math.floor((t / 250) % 13);
      for (let i = 0; i < stack.length; i++) {
        stack[i]!.visible = i < n;
      }
      for (let i = 0; i < wh.length; i++) {
        wh[i]!.rotation.y = t / 300;
      }
    },
  };
}

/**
 * uGoliath ("hw"): Heavy industrial hardware biped mech.
 * Reference lines 9490-9540.
 */
export function uGoliath(
  three: typeof THREE,
  mats: MaterialRegistry
): UnitHandle {
  const g = new three.Group();
  const A = mats.tm(HX.yel);
  const B3 = mats.tm(HX.bone);
  const G3 = mats.tm(HX.gun);

  [-1, 1].forEach((s) => {
    mk(three, mats, g, Bx(three, 0.42, 0.7, 0.5), B3, [s * 0.45, 0.75, 0]);
    mk(three, mats, g, Bx(three, 0.5, 0.2, 0.7), G3, [s * 0.45, 0.1, 0.1]);
  });
  mk(three, mats, g, Bx(three, 2.1, 1.45, 1.25), B3, [0, 2.1, 0], [0.25, 0, 0]);
  mk(
    three,
    mats,
    g,
    Bx(three, 2.12, 0.16, 1.0),
    A,
    [0, 2.1, 0.4],
    [0.25, 0, 0],
    null,
    false
  );
  [-1, 1].forEach((s) => {
    mk(three, mats, g, Ic(three, 0.62), B3, [s * 1.15, 2.75, -0.1]);
    mk(
      three,
      mats,
      g,
      Cy(three, 0.32, 0.28, 1.2, 6),
      B3,
      [s * 1.45, 2.1, 0.1],
      [0, 0, s * 0.35]
    );
    mk(three, mats, g, Cy(three, 0.3, 0.45, 1.3, 6), A, [s * 1.62, 1.0, 0.2]);
    mk(three, mats, g, Bx(three, 0.75, 0.5, 0.75), G3, [s * 1.62, 0.25, 0.3]);
  });
  mk(three, mats, g, Bx(three, 0.6, 0.45, 0.55), G3, [0, 2.6, 0.65]);
  eye3(three, mats, g, [0, 2.62, 0.94], 0.09);

  return {
    g,
    w: 4.0,
    h: 3.4,
    upd: (t: number) => {
      g.position.y = Math.abs(Math.sin(t / 700)) * 0.05;
    },
  };
}

/**
 * uCortex ("intel"): Intelligence orb drone with floating holographic rings and flames.
 * Reference lines 9704-9759.
 */
export function uCortex(
  three: typeof THREE,
  mats: MaterialRegistry
): UnitHandle {
  const g = new three.Group();
  const body = new three.Group();
  g.add(body);
  const fl: THREE.Group[] = [];
  const B3 = mats.tm(HX.bone);
  const G3 = mats.tm(HX.gun);

  mk(three, mats, body, Ic(three, 1.0, 1), B3, [0, 2.5, 0]);
  mk(
    three,
    mats,
    body,
    Tor(three, 1.02, 0.05, 3, 10),
    mats.tm(HX.teal),
    [0, 2.5, 0],
    [Math.PI / 2, 0, 0]
  );
  mk(
    three,
    mats,
    body,
    Cy(three, 0.42, 0.42, 0.2, 8),
    G3,
    [0, 2.5, 0.92],
    [Math.PI / 2, 0, 0]
  );
  eye3(three, mats, body, [0, 2.5, 1.03], 0.24);

  const r1 = mk(
    three,
    mats,
    body,
    Tor(three, 1.55, 0.04, 3, 24),
    mats.bm(HX.holo, 0.8, true),
    [0, 2.5, 0],
    null,
    null,
    false
  );
  const r2 = mk(
    three,
    mats,
    body,
    Tor(three, 1.38, 0.04, 3, 24),
    mats.bm(HX.red, 0.8, true),
    [0, 2.5, 0],
    null,
    null,
    false
  );

  fl.push(
    flame3(three, mats, body, [-0.35, 1.55, 0], 0.8, 0.12),
    flame3(three, mats, body, [0.35, 1.55, 0], 0.8, 0.12)
  );

  return {
    g,
    w: 3.2,
    h: 4.2,
    upd: (t: number) => {
      body.position.y = Math.sin(t / 800) * 0.15;
      r1.rotation.set(1.2 + Math.sin(t / 900) * 0.2, t / 700, 0);
      r2.rotation.set(0.4, -t / 500, 0.6);
      flick(fl, t);
    },
  };
}

export const U3: Record<
  string,
  (three: typeof THREE, mats: MaterialRegistry) => UnitHandle
> = {
  pos: uLancer,
  gtm: uKraken,
  dir: uMarshal,
  naming: uStamp,
  research: uArachne,
  brand: uRonin,
  uiux: uArchitect,
  decks: uHerald,
  copy: uQuill,
  illus: uFresco,
  web: uForge,
  motion: uDolly,
  "3d": uPrism,
  fab: uGantry,
  hw: uGoliath,
  pm: uNexus,
  ws: uHub,
  cmd: uWatch,
  intel: uCortex,
};
