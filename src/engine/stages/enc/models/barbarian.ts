import * as THREE from "three";
import type { MaterialRegistry } from "../../../world/materials";
import { Co, Ic, Cy, Ex, mk, glowS } from "../../../world/geometry";
import { HX } from "../../../world/materials";
import { biped } from "../../../models/uUnits";

export interface BarbarianHandle {
  readonly g: THREE.Group;
  readonly arms: THREE.Group[];
  readonly upd: (t: number) => void;
}

/**
 * barbarian: Horned biped warrior with glowing red battleaxe.
 * Source: reference lines 12092-12129.
 */
export function barbarian(
  three: typeof THREE,
  mats: MaterialRegistry,
  axeCol?: number
): BarbarianHandle {
  const b = biped(three, mats, {
    acc: HX.red,
    torso: [1.05, 1.0, 0.7],
    stance: 0.22,
  });
  const h = b.head;
  const B3 = mats.tm(HX.bone);
  const G3 = mats.tm(HX.gun);

  [-1, 1].forEach((s) =>
    mk(
      three,
      mats,
      h,
      Co(three, 0.1, 0.5, 4),
      B3,
      [s * 0.42, 0.5, 0],
      [0, 0, -s * 0.9]
    )
  );

  mk(
    three,
    mats,
    b.g,
    Ic(three, 0.55),
    G3,
    [0, b.shY + 0.05, -0.1],
    null,
    [1.5, 0.5, 1.1]
  );

  if (b.arms[1]) {
    b.arms[1].rotation.set(-0.2, 0, 2.6);
    const ax = new three.Group();
    ax.position.set(0, -1.2, 0);
    b.arms[1].add(ax);

    mk(three, mats, ax, Cy(three, 0.05, 0.05, 1.6, 5), G3, [0, -0.6, 0]);
    mk(
      three,
      mats,
      ax,
      Ex(
        three,
        [
          [0, 0],
          [0.55, 0.25],
          [0.6, -0.45],
          [0, -0.25],
        ],
        0.06
      ),
      mats.bm(axeCol || 0xff6b78),
      [0.05, -1.35, 0],
      null,
      null,
      false
    );
    glowS(three, mats, ax, [0.35, -1.4, 0], 1.0, HX.red);
  }

  return {
    g: b.g,
    arms: b.arms,
    upd: (t: number) => {
      if (b.arms[1]) {
        b.arms[1].rotation.z = 2.6 + Math.sin(t / 260) * 0.35;
      }
    },
  };
}
