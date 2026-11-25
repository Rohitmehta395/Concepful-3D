import type * as THREE from "three";
import type { MaterialRegistry } from "../../../world/materials";
import { hexPlinth } from "../../../world/geometry";

/**
 * base3: Arena plinth for encounter dioramas.
 * Reference lines 13724-13726 overwrite the earlier line 12046 base3 definition,
 * delegating directly to hexPlinth(g, r).
 */
export function base3(
  three: typeof THREE,
  mats: MaterialRegistry,
  g: THREE.Group,
  r: number
): void {
  hexPlinth(three, mats, g, r);
}
