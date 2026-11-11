import type * as THREE from "three";

export interface StarParticle {
  x: number;
  y: number;
  z: number;
  v: number;
  l: number;
}

export interface StreakField {
  readonly mesh: THREE.LineSegments;
  update(dt: number, speedMultiplier: number, reduceMotion?: boolean): void;
  dispose(): void;
}

/**
 * Procedural streak starfield.
 * Source: reference lines 10222-10260.
 */
export function createStreakField(
  three: typeof THREE,
  parent: THREE.Object3D,
  n: number,
  spread: [number, number, number],
  len: number,
  rand: () => number = Math.random
): StreakField {
  const pos = new Float32Array(n * 6);
  const particles: StarParticle[] = [];

  for (let i = 0; i < n; i++) {
    particles.push({
      x: (rand() - 0.5) * spread[0],
      y: (rand() - 0.5) * spread[1],
      z: -rand() * spread[2] - 2,
      v: 0.5 + rand(),
      l: len * (0.3 + rand()),
    });
  }

  const geometry = new three.BufferGeometry();
  geometry.setAttribute("position", new three.BufferAttribute(pos, 3));

  const material = new three.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.55,
  });

  const mesh = new three.LineSegments(geometry, material);
  parent.add(mesh);

  return {
    mesh,
    update: (dt: number, speedMultiplier: number, reduceMotion = false) => {
      for (let i = 0; i < n; i++) {
        const p = particles[i];
        if (!p) continue;
        if (!reduceMotion) {
          p.x -= p.v * speedMultiplier * dt * 0.012;
        }
        if (p.x < -spread[0] / 2) {
          p.x = spread[0] / 2;
        }
        pos.set(
          [p.x, p.y, p.z, p.x + p.l * speedMultiplier * 0.3 + 0.05, p.y, p.z],
          i * 6
        );
      }
      const posAttr = geometry.getAttribute("position");
      if (posAttr) {
        posAttr.needsUpdate = true;
      }
    },
    dispose: () => {
      parent.remove(mesh);
      geometry.dispose();
      material.dispose();
    },
  };
}
