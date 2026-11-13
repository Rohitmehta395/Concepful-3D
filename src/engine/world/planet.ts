import type * as THREE from "three";
import { brandCol, createToonGradient } from "./materials";
import { Ic, Tor } from "./geometry";

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
  const TG = createToonGradient(three);
  const bodyGeo = Ic(three, r, 1);
  const bodyMat = new three.MeshToonMaterial({
    color: brandCol(col, three),
    gradientMap: TG,
  });
  const bodyMesh = new three.Mesh(bodyGeo, bodyMat);
  group.add(bodyMesh);

  // Optional ring
  let ringGeo: THREE.BufferGeometry | null = null;
  let ringMat: THREE.MeshBasicMaterial | null = null;
  let ringMesh: THREE.Mesh | null = null;

  if (ring) {
    ringGeo = Tor(three, r * 1.6, 0.04, 2, 64);
    ringMat = new three.MeshBasicMaterial({
      color: brandCol(0xece6d6, three),
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
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
      TG.dispose();
      if (ringGeo) ringGeo.dispose();
      if (ringMat) ringMat.dispose();
    },
  };
}
