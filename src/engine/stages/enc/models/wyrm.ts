import * as THREE from "three";
import type { MaterialRegistry } from "../../../world/materials";
import { Tor, Ic, Co, eye3, mk, glowS } from "../../../world/geometry";
import { HX } from "../../../world/materials";

export interface WyrmHandle {
  readonly g: THREE.Group;
  readonly head: THREE.Group;
  readonly upd: (t: number) => void;
}

/**
 * wyrm: Cosmic portal wyrm boss with 13 body segments, horned head, eyes, and orbiting glowing particles.
 * Preallocates points array so 0 Vector3 objects are allocated per frame in upd(t).
 * Source: reference lines 12185-12454.
 */
export function wyrm(three: typeof THREE, mats: MaterialRegistry): WyrmHandle {
  const g = new three.Group();
  const portal = mk(
    three,
    mats,
    g,
    Tor(three, 2.2, 0.18, 4, 24),
    mats.bm(HX.red, 0.9, true),
    [0, 0.6, 0],
    [Math.PI / 2, 0, 0],
    null,
    false
  );
  glowS(three, mats, g, [0, 0.6, 0], 5, HX.red);

  const G3 = mats.tm(HX.gun);
  const redMat = mats.tm(HX.red);
  const boneMat = mats.tm(HX.bone);

  const seg: THREE.Mesh[] = [];
  for (let i = 0; i < 13; i++) {
    seg.push(
      mk(
        three,
        mats,
        g,
        Ic(three, 0.75 - i * 0.02, 0),
        i % 3 === 0 ? redMat : G3
      )
    );
  }

  const head = new three.Group();
  g.add(head);
  mk(three, mats, head, Ic(three, 1.0, 0), G3, [0, 0, 0], null, [1.3, 0.9, 1]);
  mk(
    three,
    mats,
    head,
    Co(three, 0.5, 1.2, 4),
    boneMat,
    [0.9, -0.35, 0],
    [0, 0, -1.9]
  );
  mk(
    three,
    mats,
    head,
    Co(three, 0.4, 1.0, 4),
    boneMat,
    [0.9, 0.35, 0],
    [0, 0, -1.2]
  );
  [-1, 1].forEach((s) =>
    mk(
      three,
      mats,
      head,
      Co(three, 0.18, 0.9, 4),
      boneMat,
      [-0.3, 0.75, s * 0.4],
      [s * 0.4, 0, 0.6]
    )
  );
  eye3(three, mats, head, [0.75, 0.25, 0.55], 0.14);
  eye3(three, mats, head, [0.75, 0.25, -0.55], 0.14);

  const st: THREE.Sprite[] = [];
  for (let i = 0; i < 10; i++) {
    st.push(glowS(three, mats, g, [0, 0, 0], 0.5, 0xffffff));
  }

  // Preallocate 14 Vector3 points to prevent per-frame allocations
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= 13; i++) {
    pts.push(new three.Vector3());
  }

  return {
    g,
    head,
    upd: (t: number) => {
      for (let i = 0; i <= 13; i++) {
        const u = i / 13;
        pts[i]!.set(
          Math.sin(u * 2.6 + t / 700) * 0.9 - u * 0.5,
          0.6 + u * 5.2 - u * u * 1.2,
          Math.cos(u * 3 + t / 900) * 0.7
        );
      }
      seg.forEach((m, i) => m.position.copy(pts[i]!));
      head.position.copy(pts[13]!);
      head.rotation.set(0, Math.PI, Math.sin(t / 400) * 0.25 - 0.35);
      st.forEach((s, i) => {
        const a = t / 300 + i * 2.1;
        s.position.set(
          Math.cos(a) * 2.4,
          1 + ((t / 500 + i * 0.3) % 4),
          Math.sin(a) * 2.4
        );
        const mat = s.material as THREE.Material & { opacity: number };
        if (mat) {
          mat.opacity = 0.4 + 0.4 * Math.sin(t / 60 + i);
        }
      });
      portal.rotation.z = t / 800;
    },
  };
}
