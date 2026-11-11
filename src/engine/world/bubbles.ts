import type * as THREE from "three";

export interface Bubbles {
  readonly points: THREE.Points;
  update(dt: number, reduceMotion?: boolean): void;
  dispose(): void;
}

/**
 * Procedural drifting underwater bubbles.
 * Source: reference lines 10416-10435.
 */
export function createBubbles(
  three: typeof THREE,
  parent: THREE.Object3D,
  rand: () => number = Math.random
): Bubbles {
  const n = 60;
  const pos = new Float32Array(n * 3);

  for (let i = 0; i < n; i++) {
    pos[i * 3 + 0] = (rand() - 0.5) * 40;
    pos[i * 3 + 1] = (rand() - 0.5) * 24;
    pos[i * 3 + 2] = -rand() * 10;
  }

  const geometry = new three.BufferGeometry();
  geometry.setAttribute("position", new three.BufferAttribute(pos, 3));

  const material = new three.PointsMaterial({
    color: 0xffffff,
    size: 0.18,
    transparent: true,
    opacity: 0.6,
  });

  const points = new three.Points(geometry, material);
  parent.add(points);

  return {
    points,
    update: (dt: number, reduceMotion = false) => {
      if (reduceMotion) return;
      for (let i = 0; i < n; i++) {
        const curY = pos[i * 3 + 1];
        if (curY !== undefined) {
          let y = curY + dt * 0.002;
          if (y > 12) {
            y = -12;
          }
          pos[i * 3 + 1] = y;
        }
      }
      const posAttr = geometry.getAttribute("position");
      if (posAttr) {
        posAttr.needsUpdate = true;
      }
    },
    dispose: () => {
      parent.remove(points);
      geometry.dispose();
      material.dispose();
    },
  };
}
