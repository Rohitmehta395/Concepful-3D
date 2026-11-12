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
  eye3,
  flame3,
  glowS,
  holoEdges,
  mk,
  textSprite,
} from "../world/geometry";
import type { VehicleHandle, VehicleUpdateOptions } from "./hVehiclesA";

const AX = -Math.PI / 2;

/**
 * H3.copy (mJelly).
 * Source: reference lines 8217-8307.
 */
export function mJelly(
  three: typeof THREE,
  mats: MaterialRegistry
): VehicleHandle {
  const g = new three.Group();
  const fl: THREE.Group[] = [];
  const bell = new three.Group();
  g.add(bell);
  const B3 = mats.tm(HX.bone);
  const G3 = mats.tm(HX.gun);

  mk(
    three,
    mats,
    bell,
    Hemi(three, 1.25, 8, 3),
    B3,
    [0, 0, 0],
    null,
    [1, 0.95, 1]
  );
  mk(
    three,
    mats,
    bell,
    Tor(three, 1.25, 0.08, 4, 8),
    mats.tm(HX.red),
    [0, 0.02, 0],
    [Math.PI / 2, 0, 0]
  );
  eye3(three, mats, bell, [-0.38, 0.6, 1.0], 0.1);
  eye3(three, mats, bell, [0.38, 0.6, 1.0], 0.1);
  eye3(three, mats, bell, [0, 0.88, 0.9], 0.07);
  mk(three, mats, bell, Cy(three, 0.03, 0.03, 0.7, 4), G3, [0, 1.5, 0]);
  const tip = eye3(three, mats, bell, [0, 1.9, 0], 0.08);

  const ten: { a: number; chain: THREE.Mesh[]; tg: THREE.Sprite }[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const chain: THREE.Mesh[] = [];
    for (let k = 0; k < 7; k++) {
      chain.push(
        mk(
          three,
          mats,
          g,
          Bx(three, 0.14, 0.34, 0.14),
          k % 2 ? G3 : mats.tm(HX.bone2),
          [0, 0, 0],
          null,
          null,
          true
        )
      );
    }
    const tg = glowS(three, mats, g, [0, 0, 0], 0.5, HX.holo);
    ten.push({ a, chain, tg });
  }

  const rings = [0, 1].map(() =>
    mk(
      three,
      mats,
      g,
      Tor(three, 1.5, 0.03, 3, 24),
      mats.bm(HX.holo, 0.6, true),
      [0, 0.3, 0],
      [Math.PI / 2, 0, 0],
      null,
      false
    )
  );
  const glyphs = ["Aa", "!", "#", "@"].map((s) => {
    const sp = textSprite(three, s, "#ECE6D6", 0.5);
    g.add(sp);
    return sp;
  });
  fl.push(flame3(three, mats, g, [0, -0.05, 0], 0.9, 0.25));

  return {
    g,
    w: 3.4,
    h: 4.4,
    fl,
    upd: (t: number) => {
      const p = Math.sin(t / 350);
      bell.scale.set(1 + p * 0.05, 1 - p * 0.06, 1 + p * 0.05);
      ten.forEach((T, i) => {
        let y = -0.05;
        T.chain.forEach((m, k) => {
          const r = 0.85 - k * 0.04;
          const sw = (Math.sin(t / 380 + i + k * 0.6) * 0.14 * k) / 6;
          m.position.set(Math.cos(T.a) * r + sw, y - 0.17, Math.sin(T.a) * r);
          y -= 0.36;
        });
        const L = T.chain[6]!.position;
        T.tg.position.set(L.x, L.y - 0.2, L.z);
      });
      rings.forEach((r, i) => {
        const q = (t / 1000 + i * 0.5) % 1;
        r.scale.set(1 + q * 1.4, 1 + q * 1.4, 1);
        (r.material as THREE.MeshBasicMaterial).opacity = 0.6 * (1 - q);
      });
      glyphs.forEach((s, i) => {
        const q = (t / 1800 + i / 4) % 1;
        s.position.set(1.4 + q * 1.8, 0.6 + q * 1.6 - i * 0.1, 0.3);
        (s.material as THREE.SpriteMaterial).opacity = 1 - q;
      });
      tip.visible = Math.sin(t / 220) > 0;
    },
  };
}

/**
 * H3.motion (mDragonfly).
 * Source: reference lines 8308-8419.
 */
export function mDragonfly(
  three: typeof THREE,
  mats: MaterialRegistry
): VehicleHandle {
  const g = new three.Group();
  const fl: THREE.Group[] = [];
  const B3 = mats.tm(HX.bone);
  const G3 = mats.tm(HX.gun);

  mk(three, mats, g, Ic(three, 0.42), B3, [0, 0, 0], null, [1.3, 1, 1]);
  mk(
    three,
    mats,
    g,
    Bx(three, 0.9, 0.06, 0.9),
    mats.tm(HX.red),
    [0, 0.1, 0],
    null,
    null,
    false
  );
  mk(
    three,
    mats,
    g,
    Cy(three, 0.4, 0.4, 0.34, 8),
    G3,
    [0.72, 0, 0],
    [0, 0, AX]
  );
  mk(
    three,
    mats,
    g,
    Cy(three, 0.26, 0.26, 0.08, 10),
    mats.tm(HX.glass),
    [0.92, 0, 0],
    [0, 0, AX],
    null,
    false
  );
  glowS(three, mats, g, [0.96, 0.06, 0], 0.4, 0xffffff);
  mk(
    three,
    mats,
    g,
    Cy(three, 0.2, 0.2, 0.24, 8),
    G3,
    [0.55, 0.32, 0.25],
    [0, 0, AX]
  );
  const rec = eye3(three, mats, g, [0.55, 0.45, -0.2], 0.06);

  const seg: THREE.Mesh[] = [];
  for (let k = 0; k < 8; k++) {
    seg.push(
      mk(
        three,
        mats,
        g,
        Bx(three, 0.34, 0.24 - k * 0.015, 0.24 - k * 0.015),
        k % 2 ? G3 : B3,
        [-0.55 - k * 0.34, 0, 0]
      )
    );
  }
  const strip: THREE.Mesh[] = [];
  for (let k = 0; k < 10; k++) {
    strip.push(
      mk(
        three,
        mats,
        g,
        Bx(three, 0.3, 0.18, 0.03),
        mats.tm(HX.dark),
        [0, 0, 0],
        null,
        null,
        false
      )
    );
  }
  const reel = new three.Group();
  reel.position.set(-0.05, 0.48, 0);
  g.add(reel);
  mk(
    three,
    mats,
    reel,
    Cy(three, 0.3, 0.3, 0.1, 10),
    G3,
    [0, 0, 0],
    [Math.PI / 2, 0, 0]
  );
  mk(
    three,
    mats,
    reel,
    Bx(three, 0.5, 0.06, 0.12),
    B3,
    [0, 0, 0.03],
    null,
    null,
    false
  );

  const wm = new three.MeshBasicMaterial({
    color: 0xddebf4,
    transparent: true,
    opacity: 0.35,
    side: three.DoubleSide,
    depthWrite: false,
  });
  const wing: THREE.Group[] = [];
  (
    [
      [0.1, 1],
      [-0.25, 1],
      [0.1, -1],
      [-0.25, -1],
    ] as const
  ).forEach(([x, s]) => {
    const w = new three.Group();
    w.position.set(x, 0.12, 0);
    w.scale.z = s;
    g.add(w);
    const sh = Ex(
      three,
      [
        [0, 0],
        [0.25, 0.6],
        [0.22, 1.8],
        [0, 2.1],
        [-0.2, 1.8],
        [-0.2, 0.6],
      ],
      0.02
    );
    const m = new three.Mesh(sh, wm);
    m.rotation.x = -Math.PI / 2;
    w.add(m);
    const e = holoEdges(three, w, sh, null, [-Math.PI / 2, 0, 0]);
    (e.material as THREE.LineBasicMaterial).transparent = true;
    (e.material as THREE.LineBasicMaterial).opacity = 0.7;
    wing.push(w);
  });
  fl.push(flame3(three, mats, g, [-3.3, 0, 0], 1.0, 0.1, "x-"));

  return {
    g,
    w: 6.4,
    h: 2.8,
    fl,
    upd: (t: number) => {
      const f = Math.sin(t / 22) * 0.5;
      wing.forEach(
        (w, i) => (w.rotation.x = (i % 2 ? -0.2 : 0.2) + (i < 2 ? f : -f))
      );
      seg.forEach((m, k) => {
        m.position.y = Math.sin(t / 300 + k * 0.6) * 0.06 * k;
      });
      const tail = seg[7]!.position;
      strip.forEach((m, k) => {
        m.position.set(
          tail.x - 0.36 - k * 0.32,
          tail.y - 0.05 + Math.sin(t / 260 + k * 0.7) * 0.16,
          0
        );
        m.rotation.z = Math.cos(t / 260 + k * 0.7) * 0.4;
      });
      reel.rotation.z = -t / 180;
      rec.visible = Math.sin(t / 300) > 0;
    },
  };
}

/**
 * H3["3d"] (mTurtle).
 * Source: reference lines 8420-8497.
 */
export function mTurtle(
  three: typeof THREE,
  mats: MaterialRegistry
): VehicleHandle {
  const g = new three.Group();
  const fl: THREE.Group[] = [];
  const B3 = mats.tm(HX.bone);
  const G3 = mats.tm(HX.gun);

  mk(
    three,
    mats,
    g,
    Cy(three, 1.1, 1.0, 0.24, 8),
    G3,
    [0, 0, 0],
    null,
    [1.35, 1, 1]
  );
  mk(
    three,
    mats,
    g,
    Tor(three, 1.1, 0.06, 3, 8),
    mats.tm(HX.red),
    [0, 0.08, 0],
    [Math.PI / 2, 0, 0],
    [1.35, 1, 1]
  );
  const sh = Hemi(three, 1.08, 7, 3);
  const shell = new three.Mesh(
    sh,
    new three.MeshBasicMaterial({
      color: HX.holo,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
      side: three.DoubleSide,
    })
  );
  shell.position.y = 0.1;
  shell.scale.set(1.3, 0.95, 1);
  g.add(shell);
  holoEdges(three, shell, sh);

  const cube = new three.Group();
  cube.position.set(0, 0.6, 0);
  g.add(cube);
  holoEdges(three, cube, Bx(three, 0.6, 0.6, 0.6));
  holoEdges(three, cube, Ic(three, 0.42));
  mk(three, mats, g, Ic(three, 0.32), B3, [1.75, 0.12, 0], null, [1.3, 1, 1]);
  [-1, 1].forEach((s) => eye3(three, mats, g, [2.05, 0.22, s * 0.14], 0.05));

  const fins = (
    [
      [1.0, 0.9],
      [1.0, -0.9],
      [-1.0, 0.9],
      [-1.0, -0.9],
    ] as const
  ).map(([x, z]) => {
    const f = new three.Group();
    f.position.set(x, -0.05, z);
    g.add(f);
    mk(
      three,
      mats,
      f,
      Ex(
        three,
        [
          [0, 0],
          [0.35, 0.15],
          [0.55, 0.95],
          [0.15, 0.9],
          [-0.15, 0.15],
        ],
        0.08
      ),
      B3,
      null,
      [Math.PI / 2, 0, 0],
      [1, z > 0 ? 1 : -1, 1]
    );
    return f;
  });
  fl.push(flame3(three, mats, g, [-1.55, 0, 0], 1.4, 0.2, "x-"));

  return {
    g,
    w: 4.6,
    h: 2.0,
    fl,
    upd: (t: number) => {
      cube.rotation.set(t / 1400, t / 900, 0);
      fins.forEach(
        (f, i) =>
          (f.rotation.y = Math.sin(t / 500 + (i < 2 ? 0 : Math.PI)) * 0.4)
      );
    },
  };
}

/**
 * H3.fab (mBeetle).
 * Source: reference lines 8498-8610.
 */
export function mBeetle(
  three: typeof THREE,
  mats: MaterialRegistry
): VehicleHandle {
  const g = new three.Group();
  const fl: THREE.Group[] = [];
  const B3 = mats.tm(HX.bone);
  const G3 = mats.tm(HX.gun);

  const wm = new three.MeshBasicMaterial({
    color: 0xddebf4,
    transparent: true,
    opacity: 0.3,
    side: three.DoubleSide,
    depthWrite: false,
  });
  const wings = [-1, 1].map((s) => {
    const w = new three.Group();
    w.position.set(-0.2, 0.5, s * 0.2);
    w.scale.z = s;
    g.add(w);
    const m = new three.Mesh(
      Ex(
        three,
        [
          [0, 0],
          [0.25, 0.4],
          [0.0, 2.2],
          [-0.3, 2.0],
          [-0.25, 0.4],
        ],
        0.02
      ),
      wm
    );
    m.rotation.set(-Math.PI / 2, 0, 0.6);
    w.add(m);
    return w;
  });

  [-1, 1].forEach((s) =>
    mk(
      three,
      mats,
      g,
      Ex(
        three,
        [
          [0, 0],
          [-1.5, 0.4],
          [-1.6, 0.15],
          [-0.1, -0.2],
        ],
        0.08
      ),
      mats.tm(HX.red),
      [0.2, 0.45, s * 0.45],
      [s * 0.35, 0, 0.35]
    )
  );
  mk(three, mats, g, Do(three, 0.72), B3, [0, 0, 0], null, [1.45, 0.72, 0.95]);
  const hazTex = mats.TX("haz");
  const hz = new three.Mesh(Bx(three, 2.1, 0.16, 1.42), [
    mats.tm(HX.dark),
    mats.tm(HX.dark),
    mats.tm(HX.dark),
    mats.tm(HX.dark),
    new three.MeshBasicMaterial({ map: hazTex }),
    new three.MeshBasicMaterial({ map: hazTex }),
  ]);
  hz.position.set(0, -0.12, 0);
  g.add(hz);

  [-0.5, 0, 0.5].forEach((x) =>
    [-1, 1].forEach((s) => {
      mk(
        three,
        mats,
        g,
        Cy(three, 0.035, 0.035, 0.6, 4),
        G3,
        [x, -0.45, s * 0.55],
        [s * 0.6, 0, 0]
      );
    })
  );
  mk(three, mats, g, Bx(three, 0.55, 0.5, 0.7), G3, [1.15, 0.05, 0]);
  [-1, 1].forEach((s) => eye3(three, mats, g, [1.42, 0.15, s * 0.22], 0.06));
  mk(
    three,
    mats,
    g,
    Co(three, 0.14, 1.4, 5),
    mats.tm(HX.yel),
    [1.75, 0.75, 0],
    [0, 0, -0.75]
  );
  const beam = mk(
    three,
    mats,
    g,
    Cy(three, 0.04, 0.04, 1.8, 4),
    mats.bm(HX.red, 0.85, true),
    [2.25, -0.15, 0],
    null,
    null,
    false
  );
  glowS(three, mats, g, [2.25, 1.0, 0], 0.6, HX.red);

  const stack: THREE.Mesh[] = [];
  for (let i = 0; i < 12; i++) {
    const m = mk(
      three,
      mats,
      g,
      Bx(three, 0.6 - i * 0.02, 0.08, 0.6 - i * 0.02),
      i % 2 ? mats.tm(HX.bone2) : B3,
      [2.25, -1.6 + i * 0.09, 0],
      null,
      null,
      false
    );
    stack.push(m);
  }
  fl.push(flame3(three, mats, g, [-1.0, 0, 0], 1.3, 0.2, "x-"));

  return {
    g,
    w: 5,
    h: 3.2,
    fl,
    upd: (t: number, o?: VehicleUpdateOptions) => {
      const f = Math.sin(t / 25) * 0.5;
      wings[0]!.rotation.x = f;
      wings[1]!.rotation.x = -f;
      const n = o?.reduceMotion ? 8 : Math.floor((t / 220) % 13);
      stack.forEach((m, i) => (m.visible = i < n));
      beam.scale.x = beam.scale.z = 0.8 + 0.4 * Math.sin(t / 60);
    },
  };
}
