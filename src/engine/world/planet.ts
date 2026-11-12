import type * as THREE from "three";
import { brandCol } from "./materials";

export interface Planet {
  readonly group: THREE.Group;
  update(time: number): void;
  dispose(): void;
}

/**
 * Procedural low-poly planet with optional ring.
 * Source: reference lines 10261-10275.
 */
export function createPlanet(
  three: typeof THREE,
  parent: THREE.Object3D,
  r: number,
  p: [number, number, number],
  col: number,
  ring = true
): Planet {
  const group = new three.Group();
  group.position.set(p[0], p[1], p[2]);
  parent.add(group);

  // Planet body
  const bodyGeo = new three.IcosahedronGeometry(r, 1);
  const bodyMat = new three.MeshToonMaterial({
    color: brandCol(col, three),
  });
  const bodyMesh = new three.Mesh(bodyGeo, bodyMat);
  group.add(bodyMesh);

  // Optional ring
  let ringGeo: THREE.TorusGeometry | null = null;
  let ringMat: THREE.MeshBasicMaterial | null = null;
  let ringMesh: THREE.Mesh | null = null;

  if (ring) {
    ringGeo = new three.TorusGeometry(r * 1.5, r * 0.03, 3, 32);
    ringMat = new three.MeshBasicMaterial({
      color: brandCol(0xece6d6, three),
      transparent: true,
      opacity: 0.35,
      side: three.DoubleSide,
    });
    ringMesh = new three.Mesh(ringGeo, ringMat);
    ringMesh.rotation.set(1.25, 0.2, 0);
    group.add(ringMesh);
  }

  return {
    group,
    update: (time: number) => {
      group.rotation.y = time / 30000;
    },
    dispose: () => {
      parent.remove(group);
      bodyGeo.dispose();
      bodyMat.dispose();
      if (ringGeo) ringGeo.dispose();
      if (ringMat) ringMat.dispose();
    },
  };
}
