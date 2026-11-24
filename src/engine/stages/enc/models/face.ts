import type * as THREE from "three";

/**
 * face: Rotates object to face target coordinate (x, z) on horizontal plane.
 * Source: reference lines 12020-12022.
 */
export function face(
  obj: { readonly g: THREE.Object3D },
  x: number,
  z: number
): void {
  obj.g.rotation.y = Math.atan2(x - obj.g.position.x, z - obj.g.position.z);
}
