import type * as THREE from "three";
import { createCRND } from "../../world/prng";
import { brandCol, texC, createGlowTexture } from "../../world/materials";
import type { CosmosLayer } from "../../world/cosmos";

const MEL = "#EE004E";
const VIO = "#5B47D6";

/**
 * Raid cosmos preset (exact port of reference lines 10864-10918, key = "raid").
 * Added in raid/ because src/engine/world/cosmos.ts omits the "raid" preset and falls back to "intro".
 */
export function createRaidCosmos(
  three: typeof THREE,
  parent: THREE.Object3D
): CosmosLayer {
  const root = new three.Group();
  parent.add(root);

  const disposables: { dispose: () => void }[] = [];
  const animators: ((t: number) => void)[] = [];

  const glowTex = createGlowTexture(three);
  disposables.push(glowTex);

  function glowSprite(
    parentGroup: THREE.Object3D,
    p: [number, number, number],
    size: number,
    col: number
  ) {
    const mat = new three.SpriteMaterial({
      map: glowTex,
      color: brandCol(col, three),
      transparent: true,
      blending: three.AdditiveBlending,
      depthWrite: false,
    });
    disposables.push(mat);
    const sprite = new three.Sprite(mat);
    sprite.position.set(p[0], p[1], p[2]);
    sprite.scale.set(size, size, 1);
    parentGroup.add(sprite);
    return sprite;
  }

  function nebTex(a: string, b: string, seed: number): THREE.CanvasTexture {
    const r = createCRND(seed);
    const t = texC(
      512,
      256,
      (ctx, w, h) => {
        ctx.globalCompositeOperation = "lighter";
        for (let i = 0; i < 70; i++) {
          const u = r();
          const cx = u * w;
          const cy =
            h * 0.5 +
            Math.sin(u * 6.3 + seed) * h * 0.18 +
            (r() - 0.5) * h * 0.3;
          const rad = 18 + r() * 70 * (1 - Math.abs(u - 0.5));
          const col = r() < 0.55 ? a : b;
          const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
          grad.addColorStop(0, col + "2E");
          grad.addColorStop(1, col + "00");
          ctx.fillStyle = grad;
          ctx.fillRect(cx - rad, cy - rad, rad * 2, rad * 2);
        }
        for (let i = 0; i < 120; i++) {
          ctx.fillStyle = "rgba(255,255,255," + (0.2 + r() * 0.6) + ")";
          const s = r() < 0.1 ? 2 : 1;
          ctx.fillRect(r() * w, h * 0.5 + (r() - 0.5) * h * 0.6, s, s);
        }
      },
      three
    );
    disposables.push(t);
    return t;
  }

  function tailTex(): THREE.CanvasTexture {
    const t = texC(
      256,
      16,
      (ctx, w, h) => {
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(1, "rgba(255,230,238,.9)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, h / 2);
        ctx.lineTo(w, 1);
        ctx.lineTo(w, h - 1);
        ctx.fill();
      },
      three
    );
    disposables.push(t);
    return t;
  }

  function addStars(n: number, R: number, seed: number) {
    const r = createCRND(seed);
    const layers: [number, number][] = [
      [0.55, 1.4],
      [0.8, 2.2],
      [1, 3.2],
    ];
    layers.forEach(([op, sz], L) => {
      const m = Math.round(n / (L + 1.6));
      const pos = new Float32Array(m * 3);
      const col = new Float32Array(m * 3);
      for (let i = 0; i < m; i++) {
        const u = r() * 2 - 1;
        const th = r() * Math.PI * 2;
        const rr = R * (1 + r() * 0.4);
        const q = Math.sqrt(1 - u * u);
        pos.set(
          [
            Math.cos(th) * q * rr,
            u * rr * 0.7,
            Math.sin(th) * q * rr - R * 0.25,
          ],
          i * 3
        );
        const c = r();
        col.set(
          c < 0.15 ? [1, 0.55, 0.72] : c < 0.3 ? [0.75, 0.78, 1] : [1, 1, 1],
          i * 3
        );
      }
      const geo = new three.BufferGeometry();
      geo.setAttribute("position", new three.BufferAttribute(pos, 3));
      geo.setAttribute("color", new three.BufferAttribute(col, 3));
      disposables.push(geo);

      const mat = new three.PointsMaterial({
        size: sz,
        sizeAttenuation: false,
        vertexColors: true,
        transparent: true,
        opacity: op,
        depthWrite: false,
      });
      disposables.push(mat);

      const points = new three.Points(geo, mat);
      root.add(points);

      if (L > 0) {
        animators.push((t) => {
          mat.opacity =
            op * (0.7 + 0.3 * Math.sin(t / (900 + L * 700) + L * 2));
        });
      }
    });
  }

  function addNebula(
    p: [number, number, number],
    w: number,
    a: string,
    b: string,
    seed: number,
    rot = 0,
    op = 0.75
  ) {
    const baseOp = op ?? 0.75;
    const scaledOp = baseOp * 0.55;
    const geo = new three.PlaneGeometry(w, w * 0.5);
    disposables.push(geo);

    const mat = new three.MeshBasicMaterial({
      map: nebTex(a, b, seed),
      transparent: true,
      opacity: scaledOp,
      blending: three.AdditiveBlending,
      depthWrite: false,
    });
    disposables.push(mat);

    const mesh = new three.Mesh(geo, mat);
    mesh.position.set(p[0], p[1], p[2]);
    mesh.rotation.z = rot;
    root.add(mesh);

    animators.push((t) => {
      mat.opacity = scaledOp * (0.85 + 0.15 * Math.sin(t / 4000 + seed));
    });
  }

  function addComets(n: number, area: [number, number, number], seed: number) {
    const r = createCRND(seed);
    const tailT = tailTex();

    for (let i = 0; i < n; i++) {
      const C = new three.Group();
      root.add(C);

      const geo = new three.PlaneGeometry(14, 0.5);
      const mat = new three.MeshBasicMaterial({
        map: tailT,
        transparent: true,
        blending: three.AdditiveBlending,
        depthWrite: false,
        opacity: 0.45,
      });
      disposables.push(geo, mat);

      const tail = new three.Mesh(geo, mat);
      tail.position.x = -7;
      C.add(tail);

      glowSprite(C, [0, 0, 0], 0.7, 0xffffff);

      C.rotation.z = -0.35 - r() * 0.3;
      const z = area[2] - r() * 20;
      const y0 = area[1] * (r() - 0.2);
      const sp = 0.6 + r() * 0.6;
      const ph = r();

      C.position.set(0, y0, z);

      animators.push((t) => {
        const q = ((t / 26000) * sp + ph) % 1;
        C.position.set(-area[0] + q * area[0] * 2, y0 - q * area[0] * 0.45, z);
      });
    }
  }

  // Reference lines 10911-10915: raid preset
  addStars(700, 160, 81);
  addNebula([10, 16, -110], 220, MEL, VIO, 47, 0.1, 0.55);
  addComets(2, [100, 30, -80], 29);

  return {
    group: root,
    update: (time: number, reduceMotion = false) => {
      if (reduceMotion) return;
      for (const anim of animators) {
        anim(time);
      }
    },
    dispose: () => {
      parent.remove(root);
      disposables.forEach((d) => d.dispose());
    },
  };
}
