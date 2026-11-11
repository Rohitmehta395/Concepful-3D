import type * as THREE from "three";

export interface Clouds {
  readonly group: THREE.Group;
  update(dt: number, reduceMotion?: boolean): void;
  dispose(): void;
}

/**
 * Procedural low-poly drifting cloud groups.
 * Source: reference lines 10400-10415.
 */
export function createClouds(
  three: typeof THREE,
  parent: THREE.Object3D,
  rand: () => number = Math.random
): Clouds {
  const root = new three.Group();
  parent.add(root);

  const cloudColor = 0xf1f1f8;
  const cloudMat = new three.MeshBasicMaterial({ color: cloudColor });

  const geometries: THREE.BufferGeometry[] = [];
  const cloudGroups: THREE.Group[] = [];

  for (let i = 0; i < 9; i++) {
    const c = new three.Group();
    for (let k = 0; k < 4; k++) {
      const radius = 0.8 + rand() * 0.8;
      const geo = new three.IcosahedronGeometry(radius, 0);
      geometries.push(geo);
      const mesh = new three.Mesh(geo, cloudMat);
      mesh.position.set(k * 1.1 - 1.6, rand() * 0.6, rand() * 0.8);
      mesh.scale.set(1, 0.6, 1);
      c.add(mesh);
    }
    c.position.set(-30 + i * 7, -6 + rand() * 12, -6 - rand() * 14);
    root.add(c);
    cloudGroups.push(c);
  }

  return {
    group: root,
    update: (dt: number, reduceMotion = false) => {
      if (reduceMotion) return;
      for (const c of cloudGroups) {
        c.position.x -= dt * 0.004;
        if (c.position.x < -32) {
          c.position.x = 32;
        }
      }
    },
    dispose: () => {
      parent.remove(root);
      geometries.forEach((g) => g.dispose());
      cloudMat.dispose();
    },
  };
}
