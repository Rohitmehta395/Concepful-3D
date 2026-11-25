import * as THREE from "three";
import { Cy } from "../../../world/geometry";

export interface BeamHandle {
  readonly mesh: THREE.Mesh;
}

const scratchV = new THREE.Vector3();
const scratchD = new THREE.Vector3();
const upVector = new THREE.Vector3(0, 1, 0);

/**
 * beam3: Creates cylindrical laser beam mesh with additive blending.
 * Source: reference lines 12023-12036.
 */
export function beam3(
  three: typeof THREE,
  par: THREE.Object3D,
  col: number
): THREE.Mesh {
  const m = new three.Mesh(
    Cy(three, 0.05, 0.05, 1, 5),
    new three.MeshBasicMaterial({
      color: col,
      transparent: true,
      opacity: 0.9,
      blending: three.AdditiveBlending,
      depthWrite: false,
    })
  );
  par.add(m);
  return m;
}

/**
 * setBeam: Updates laser beam position, orientation, scale, and visibility.
 * Preallocates scratch vectors so 0 objects are allocated per frame.
 * Source: reference lines 12037-12045.
 */
export function setBeam(
  m: THREE.Mesh,
  a: THREE.Vector3,
  b: THREE.Vector3,
  on: boolean
): void {
  m.visible = on;
  if (!on) return;
  scratchD.subVectors(b, a);
  const L = scratchD.length();
  scratchV.copy(a).addScaledVector(scratchD, 0.5);
  m.position.copy(scratchV);
  m.scale.set(1, L, 1);
  if (L > 1e-6) {
    scratchD.multiplyScalar(1 / L);
    m.quaternion.setFromUnitVectors(upVector, scratchD);
  }
}
