import * as THREE from "three";
import type { MaterialRegistry } from "../../../world/materials";
import { Ic, Co, Bx, Cy, eye3, mk, glowS } from "../../../world/geometry";
import { HX } from "../../../world/materials";

export interface FurballHandle {
  readonly g: THREE.Group;
  readonly muzzle: THREE.Group;
  readonly upd: (t: number) => void;
}

/**
 * furball: Spiky creature with big eyes, blaster rifle, and glowing muzzle.
 * Source: reference lines 12130-12176.
 */
export function furball(
  three: typeof THREE,
  mats: MaterialRegistry
): FurballHandle {
  const g = new three.Group();
  const G3 = mats.tm(HX.gun);
  mk(
    three,
    mats,
    g,
    Ic(three, 1.0, 1),
    mats.tm(HX.bone2),
    [0, 1.5, 0],
    null,
    [1, 1.25, 0.9]
  );

  for (let i = 0; i < 22; i++) {
    const a = i * 2.39996;
    const y = -1 + 2 * (i / 21);
    const r = Math.sqrt(1 - y * y);
    const px = Math.cos(a) * r;
    const py = y * 1.2;
    const pz = Math.sin(a) * r * 0.9;
    const m = mk(
      three,
      mats,
      g,
      Co(three, 0.16, 0.45, 3),
      mats.tm(HX.bone2),
      [px, 1.5 + py, pz],
      null,
      null,
      false
    );
    m.lookAt(px * 3, 1.5 + py * 3, pz * 3);
    m.rotateX(Math.PI / 2);
  }

  mk(
    three,
    mats,
    g,
    Bx(three, 0.9, 0.45, 0.1),
    G3,
    [0, 1.95, 0.88],
    null,
    null,
    false
  );
  eye3(three, mats, g, [-0.2, 1.97, 0.95], 0.08);
  eye3(three, mats, g, [0.2, 1.97, 0.95], 0.08);
  mk(
    three,
    mats,
    g,
    Bx(three, 0.25, 1.6, 0.2),
    mats.tm(HX.red),
    [0, 1.4, 0.85],
    [0, 0, 0.7],
    null,
    false
  );

  [-1, 1].forEach((s) => {
    mk(
      three,
      mats,
      g,
      Cy(three, 0.22, 0.18, 1.1, 5),
      mats.tm(HX.bone2),
      [s * 1.05, 1.1, 0.2],
      [0, 0, s * 0.4]
    );
    mk(three, mats, g, Cy(three, 0.25, 0.25, 0.5, 5), mats.tm(HX.bone2), [
      s * 0.45,
      0.25,
      0,
    ]);
  });

  const gun = new three.Group();
  gun.position.set(0.8, 1.1, 0.7);
  g.add(gun);
  mk(three, mats, gun, Bx(three, 1.4, 0.2, 0.22), G3, [0.4, 0, 0]);
  glowS(three, mats, gun, [1.15, 0, 0], 0.6, HX.red);

  return {
    g,
    muzzle: gun,
    upd: (t: number) => {
      g.position.y = Math.abs(Math.sin(t / 300)) * 0.08;
    },
  };
}
