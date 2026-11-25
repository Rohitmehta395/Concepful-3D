import * as THREE from "three";
import type { MaterialRegistry } from "../../../world/materials";
import { Co, mk } from "../../../world/geometry";
import { HX } from "../../../world/materials";
import { uGoliath } from "../../../models/uUnits";
import type { UnitHandle } from "../../../models/uUnits";

/**
 * bossMino: Horned minotaur boss unit variant of uGoliath mech.
 * Source: reference lines 12594-12611.
 */
export function bossMino(
  three: typeof THREE,
  mats: MaterialRegistry
): UnitHandle {
  const U = uGoliath(three, mats);
  const h = new three.Group();
  h.position.set(0, 2.85, 0.6);
  U.g.add(h);

  const boneMat = mats.tm(HX.bone);
  [-1, 1].forEach((s) =>
    mk(
      three,
      mats,
      h,
      Co(three, 0.16, 0.9, 4),
      boneMat,
      [s * 0.5, 0.3, 0],
      [0, 0, -s * 1.1]
    )
  );

  U.g.scale.setScalar(0.75);
  return U;
}
