import type * as THREE from "three";
import { HX, type MaterialRegistry } from "../../world/materials";
import {
  Bx,
  Cy,
  Ex,
  bake,
  flame3,
  glowS,
  mk,
  plane,
  rbx,
  slabYZ,
} from "../../world/geometry";
import { mJet } from "../../models/hVehiclesC";
import { mechParts } from "../../models/uUnits";
import { backEase } from "./raidStage";

const AX = -Math.PI / 2;
const BR_SLATE3 = 0x4a5262;

const EMB_C =
  "M54.006 66.1178C51.3948 66.1178 48.7561 65.4306 46.4197 64.0839C38.9984 59.7137 26.5471 52.4302 24.4581 51.3857C19.7579 49.022 19.1258 45.1741 19.0983 43.6074C18.9883 39.6771 21.5995 36.7362 24.0733 35.3069L46.4197 22.3889C50.0205 20.3276 54.6382 21.6743 56.5073 25.4398C58.2389 28.9029 56.7546 33.1356 53.4013 35.0871L39.4107 43.1677V43.2227C45.4302 46.7133 52.4668 50.8635 53.7036 51.5781C53.8686 51.6606 54.1159 51.6606 54.3358 51.5506L76.6823 38.6601C80.283 36.5987 84.9007 37.9455 86.7698 41.711C88.5014 45.1741 87.0172 49.4068 83.6638 51.3582L61.5648 64.1113C59.2284 65.4581 56.5897 66.1452 53.9785 66.1452L54.006 66.1178Z";

const EMB_S =
  "M87.1546 59.3289L72.9716 51.7155C72.4769 51.4407 71.8722 51.4682 71.4049 51.7155L67.062 54.2167C65.9626 54.8488 65.9901 56.443 67.117 57.0476L76.1051 61.8575C77.232 62.4622 77.2595 64.0563 76.16 64.6885L57.4143 75.5176C55.6002 76.5621 53.3463 76.5621 51.5597 75.5176C50.8176 75.0779 36.9644 66.9148 29.0759 62.4347C27.9764 61.8026 27.9764 60.2634 29.0759 59.6312L37.6791 54.6564C38.7511 54.0243 38.7511 52.4851 37.6791 51.8529C36.1948 51.0009 34.738 50.1489 33.4187 49.3793C32.9239 49.1044 32.2918 49.1044 31.797 49.3793L20.6925 55.8108C18.9334 56.8278 17.0918 58.8342 17.1742 61.3628C17.2017 62.5721 17.7515 64.8534 20.9124 66.4475C23.7985 67.8768 39.7406 77.2217 47.8216 81.9766C49.8831 83.1585 52.1919 83.7632 54.5008 83.7632C56.8096 83.7632 59.1185 83.1585 61.18 81.9766L87.3195 66.8873C88.6938 66.0902 89.5184 64.606 89.4909 63.0394C89.4909 61.4452 88.5839 60.016 87.1821 59.2464L87.1546 59.3289Z";

const EMB_H =
  "M96.6926 23.0486L62.3621 3.23182C56.7823 0.0160602 49.8283 0.0160602 44.2485 3.23182L9.89052 23.0486C4.31078 26.2643 0.820007 32.2836 0.820007 38.7426V78.4036C0.820007 84.8626 4.28329 90.8544 9.89052 94.0976L44.221 113.914C47.0246 115.536 50.1581 116.333 53.2915 116.333C56.425 116.333 59.5584 115.536 62.3621 113.914L96.6926 94.0976C102.272 90.8818 105.763 84.8626 105.763 78.4036V38.7426C105.763 32.2836 102.3 26.2918 96.6926 23.0486Z";

function svgShape(
  three: typeof THREE,
  d: string,
  sc: number,
  cx: number,
  cy: number
): THREE.Shape {
  const t = d.match(/[A-Za-z]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/g) ?? [];
  const S = new three.Shape();
  let i = 0;
  let c = "";
  let x = 0;
  let y = 0;
  const X = (v: number) => (v - cx) * sc;
  const Y = (v: number) => -(v - cy) * sc;
  const n = () => parseFloat(t[i++] ?? "0");
  while (i < t.length) {
    if (/[A-Za-z]/.test(t[i]!)) c = t[i++]!;
    if (c === "M") {
      x = n();
      y = n();
      S.moveTo(X(x), Y(y));
      c = "L";
    } else if (c === "L") {
      x = n();
      y = n();
      S.lineTo(X(x), Y(y));
    } else if (c === "H") {
      x = n();
      S.lineTo(X(x), Y(y));
    } else if (c === "V") {
      y = n();
      S.lineTo(X(x), Y(y));
    } else if (c === "C") {
      const a = n();
      const b = n();
      const e = n();
      const f = n();
      x = n();
      y = n();
      S.bezierCurveTo(X(a), Y(b), X(e), Y(f), X(x), Y(y));
    } else {
      if (i < t.length && !/[A-Za-z]/.test(t[i]!)) i++;
    }
  }
  return S;
}

const EMBG: Record<string, THREE.ExtrudeGeometry> = {};
function embGeo(
  three: typeof THREE,
  k: string,
  d: string,
  sz: number,
  depth: number
): THREE.ExtrudeGeometry {
  const key = k + sz + "_" + depth;
  return (
    EMBG[key] ||
    (EMBG[key] = new three.ExtrudeGeometry(
      svgShape(three, d, sz / 105, 53.3, 58.6),
      { depth, bevelEnabled: false, curveSegments: 8 }
    ))
  );
}

function emblem(
  three: typeof THREE,
  mats: MaterialRegistry,
  par: THREE.Object3D,
  size: number,
  o: { hex?: boolean; line?: boolean } = {}
): THREE.Group {
  const g = new three.Group();
  par.add(g);
  if (o.hex) {
    mk(
      three,
      mats,
      g,
      embGeo(three, "h", EMB_H, size, 0.05 * size),
      mats.tm(HX.melon),
      [0, 0, -0.05 * size],
      null,
      null,
      !!o.line
    );
  }
  mk(
    three,
    mats,
    g,
    embGeo(three, "s", EMB_S, size, 0.01 * size),
    mats.bm(HX.navy, 0.6),
    [0, 0, 0.002 * size],
    null,
    null,
    false
  );
  mk(
    three,
    mats,
    g,
    embGeo(three, "c", EMB_C, size, 0.03 * size),
    mats.bm(0xffffff),
    [0, 0, 0.004 * size],
    null,
    null,
    false
  );
  return g;
}

export interface CarrierShipHandle {
  readonly g: THREE.Group;
  readonly len: number;
  readonly h: number;
  readonly fl: THREE.Group[];
  readonly crew: THREE.Group;
  upd(
    t: number,
    opts?: { shipT0?: number | null; reduceMotion?: boolean }
  ): void;
}

export interface TitanShipHandle {
  readonly g: THREE.Group;
  readonly len: number;
  readonly h: number;
  readonly fl: THREE.Group[];
  readonly titan: true;
  upd(
    t: number,
    opts?: { shipT0?: number | null; reduceMotion?: boolean }
  ): void;
}

/**
 * Global-reach aircraft carrier flagship (sCarrier).
 * Source: reference lines 12898-13077.
 */
export function sCarrier(
  three: typeof THREE,
  mats: MaterialRegistry
): CarrierShipHandle {
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
        [8.3, 1.0],
        [7.6, -0.2],
        [6.2, -1.5],
        [-6.0, -1.6],
        [-7.5, -0.9],
        [-7.7, 1.0],
      ],
      3.4
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
        [8.4, 1.0],
        [7.9, 0.45],
        [-7.6, 0.45],
        [-7.7, 1.0],
      ],
      3.6
    ),
    B3
  );

  const deck = Ex(
    three,
    [
      [8.6, 1.7],
      [8.6, -1.7],
      [-7.8, -1.8],
      [-7.8, 1.8],
      [-2.2, 3.3],
      [3.4, 3.3],
      [5.6, 1.9],
    ],
    0.18
  );
  mk(
    three,
    mats,
    g,
    deck,
    mats.tm(0x2a2d35),
    [0, 1.1, 0],
    [-Math.PI / 2, 0, 0]
  );

  const ang = -0.16;
  for (let i = 0; i < 9; i++) {
    const x = -6 + i * 1.3;
    mk(
      three,
      mats,
      g,
      Bx(three, 0.6, 0.03, 0.1),
      mats.tm(HX.yel),
      [x, 1.21, 0.8 - (x + 6) * Math.sin(ang) * 0.9],
      [0, ang, 0],
      null,
      false
    );
  }
  for (let i = 0; i < 14; i++) {
    mk(
      three,
      mats,
      g,
      Bx(three, 0.5, 0.03, 0.07),
      mats.tm(HX.bone),
      [-6.8 + i * 1.1, 1.21, -1.25],
      null,
      null,
      false
    );
  }
  (
    [
      [-3, -0.2],
      [2.5, 0.3],
    ] as const
  ).forEach(([x, z]) =>
    mk(
      three,
      mats,
      g,
      Bx(three, 1.2, 0.02, 1.2),
      mats.tm(BR_SLATE3),
      [x, 1.21, z],
      null,
      null,
      false
    )
  );

  const isl = new three.Group();
  isl.position.set(1.4, 1.2, -1.55);
  g.add(isl);
  mk(three, mats, isl, Bx(three, 2.6, 1.3, 0.8), B3, [0, 0.65, 0]);
  mk(three, mats, isl, Bx(three, 1.8, 0.9, 0.7), B3, [-0.2, 1.75, 0]);
  mk(
    three,
    mats,
    isl,
    Bx(three, 2.62, 0.18, 0.82),
    mats.tm(HX.red),
    [0, 0.35, 0],
    null,
    null,
    false
  );
  mk(
    three,
    mats,
    isl,
    Bx(three, 1.6, 0.22, 0.05),
    mats.tm(HX.glass),
    [-0.2, 1.85, 0.36],
    null,
    null,
    false
  );
  (
    [
      [-0.8, 0.25],
      [0.6, -0.25],
    ] as const
  ).forEach(([x, r]) =>
    mk(
      three,
      mats,
      isl,
      Bx(three, 0.06, 0.6, 0.5),
      mats.tm(BR_SLATE3),
      [x, 1.75, 0.36],
      [0, r, 0],
      null,
      false
    )
  );
  mk(three, mats, isl, Cy(three, 0.06, 0.08, 1.4, 4), G3, [0.1, 2.9, 0]);
  const dish = mk(
    three,
    mats,
    isl,
    Cy(three, 0.45, 0.08, 0.14, 8),
    B3,
    [0.1, 3.6, 0],
    [0.7, 0, 0]
  );
  mk(
    three,
    mats,
    isl,
    Bx(three, 1.0, 0.06, 0.06),
    G3,
    [0.1, 3.2, 0],
    null,
    null,
    false
  );

  for (let x = -6.8; x < 7.2; x += 0.6) {
    mk(
      three,
      mats,
      g,
      Bx(three, 0.32, 0.12, 0.05),
      mats.bm(HX.holo, 0.9, true),
      [x, 0.0, 1.72],
      null,
      null,
      false
    );
  }
  mk(
    three,
    mats,
    g,
    Bx(three, 15.2, 0.14, 3.5),
    mats.tm(HX.red),
    [0.2, -0.55, 0],
    null,
    null,
    false
  );
  plane(three, g, 6.4, 0.6, mats.TX("hull"), [0, -1.0, 1.71]);
  (
    [
      [0.2, 1.0],
      [0.2, -1.0],
      [-0.9, 0],
    ] as const
  ).forEach(([y, z]) => {
    mk(
      three,
      mats,
      g,
      Cy(three, 0.55, 0.65, 1.2, 8),
      G3,
      [-8.1, y, z],
      [0, 0, AX]
    );
    fl.push(flame3(three, mats, g, [-8.7, y, z], 3.2, 0.42, "x-"));
  });

  const crew = new three.Group();
  crew.position.set(-1, 1.2, 0.6);
  g.add(crew);

  (
    [
      [5.2, 1.0],
      [6.4, 0.4],
      [4.2, 2.1],
    ] as const
  ).forEach(([x, z]) => {
    const j = mJet(three, mats);
    j.g.scale.setScalar(0.42);
    j.g.position.set(x, 1.42, z);
    j.g.rotation.y = -0.16;
    g.add(j.g);
  });

  return {
    g,
    len: 16.5,
    h: 6,
    fl,
    crew,
    upd: (t: number) => {
      dish.rotation.y = t / 600;
    },
  };
}

/**
 * National-reach giant Titan mech flagship (sTitan).
 * Source: reference lines 13729-13847.
 */
export function sTitan(
  three: typeof THREE,
  mats: MaterialRegistry
): TitanShipHandle {
  const g = new three.Group();
  const fl: THREE.Group[] = [];
  const parts: Array<{
    p: THREE.Object3D;
    to: THREE.Vector3;
    from: THREE.Vector3;
    r: THREE.Vector3;
    r0: THREE.Euler;
  }> = [];
  const body = new three.Group();
  body.scale.setScalar(3.3);
  body.position.y = -5.6;
  g.add(body);

  const m = mechParts(three, mats, {
    acc: HX.melon,
    torso: [1.05, 1.0, 0.7],
    stance: 0.16,
    legH: 1.08,
  });

  m.legs.forEach((L, i) => {
    const s = i ? 1 : -1;
    const x = s * (m.tw * 0.2 + 0.08);
    mk(
      three,
      mats,
      L,
      rbx(three, 0.2, 0.13, 0.05, 0.03),
      mats.tm(HX.glass),
      [x + s * 0.06, m.hy * 0.38, 0.24],
      [-0.12, 0, 0],
      null,
      false
    );
    glowS(three, mats, L, [x + s * 0.06, m.hy * 0.38, 0.27], 0.25, 0xffffff);
    mk(
      three,
      mats,
      L,
      slabYZ(
        three,
        [
          [-0.1, 0],
          [0.06, 0],
          [-0.2, 0.34],
          [-0.26, 0.3],
        ],
        0.04
      ),
      mats.tm(HX.melon),
      [x + s * 0.2, m.hy * 0.12, -0.12]
    );
    fl.push(flame3(three, mats, L, [x + s * 0.05, -0.02, 0.0], 0.9, 0.16));
  });

  emblem(three, mats, m.torso, 0.55).position.set(
    0,
    m.cy + m.ch * 0.7,
    m.td / 2 + 0.1
  );

  [-1, 1].forEach((s) =>
    fl.push(
      flame3(
        three,
        mats,
        m.pack,
        [s * m.tw * 0.16, m.cy + m.ch * 0.05, -m.td / 2 - 0.14],
        1.0,
        0.12
      )
    )
  );

  m.arms.forEach((a, i) => {
    const s = i ? 1 : -1;
    const j = mJet(three, mats);
    j.g.scale.setScalar(0.32);
    j.g.rotation.z = -Math.PI / 2;
    j.g.position.set(s * 0.2, -0.72, 0);
    a.add(j.g);
    fl.push(...j.fl);
  });

  m.arms[0]!.rotation.set(0, 0, -0.28);
  m.arms[1]!.rotation.set(-0.35, 0, 0.3);

  const P = (p: THREE.Object3D, from: [number, number, number]) => {
    body.add(p);
    parts.push({
      p,
      to: p.position.clone(),
      from: new three.Vector3(...from).add(p.position),
      r: new three.Vector3(
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3
      ),
      r0: p.rotation.clone(),
    });
  };

  P(m.legs[0]!, [-4, -2.5, 1.2]);
  P(m.legs[1]!, [4, -2.6, -1]);
  P(m.hips, [0, -4, 2]);
  P(m.torso, [0, 4.5, -1.4]);
  P(m.pack, [1.2, 3, -4.2]);
  P(m.arms[0]!, [-5, 2.5, 0.8]);
  P(m.arms[1]!, [5, 2.3, 0.6]);
  P(m.head, [-1.6, 5.5, 1.8]);

  [...m.legs, m.hips, m.torso, m.pack, ...m.arms, m.head].forEach((grp) =>
    bake(three, mats, grp)
  );

  const flash = glowS(three, mats, g, [0, 1.4, 2.4], 0.1, 0xffffff);

  return {
    g,
    len: 9.5,
    h: 12,
    fl,
    titan: true,
    upd: (
      t: number,
      opts?: { shipT0?: number | null; reduceMotion?: boolean }
    ) => {
      const t0 = opts?.shipT0 ?? 0;
      const reduce = opts?.reduceMotion ?? false;
      const ap = reduce ? 1 : Math.max(0, Math.min(1, (t - t0 - 300) / 2600));
      for (let i = 0; i < parts.length; i++) {
        const q = parts[i]!;
        const u = Math.max(0, Math.min(1, ap * 1.6 - i * 0.08));
        const e = backEase(u);
        q.p.position.copy(q.from).lerp(q.to, e);
        q.p.rotation.set(
          q.r0.x + q.r.x * (1 - e),
          q.r0.y + q.r.y * (1 - e),
          q.r0.z + q.r.z * (1 - e)
        );
      }
      const f = (t - t0 - 2600) / 600;
      flash.scale.setScalar(f > 0 && f < 1 ? Math.sin(f * Math.PI) * 14 : 0.01);
    },
  };
}
