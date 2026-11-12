import type * as THREE from "three";
import { createCRND } from "./prng";
import { brandCol, texC, createGlowTexture } from "./materials";

const MEL = "#EE004E";
const VIO = "#5B47D6";
const PER = "#8C93E6";

export interface CosmosLayer {
  readonly group: THREE.Group;
  update(time: number, reduceMotion?: boolean): void;
  dispose(): void;
}

export function createCosmos(
  three: typeof THREE,
  parent: THREE.Object3D,
  key: string
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

  function addGiant(
    p: [number, number, number],
    r: number,
    col: number,
    ring: number | null = null,
    band: number | null = null
  ) {
    const P = new three.Group();
    P.position.set(p[0], p[1], p[2]);
    root.add(P);

    const bodyGeo = new three.IcosahedronGeometry(r, 2);
    const bodyMat = new three.MeshToonMaterial({
      color: brandCol(col, three),
    });
    disposables.push(bodyGeo, bodyMat);
    const bodyMesh = new three.Mesh(bodyGeo, bodyMat);
    P.add(bodyMesh);

    if (band !== null) {
      for (let i = -2; i <= 2; i++) {
        const bandGeo = new three.TorusGeometry(
          r * Math.cos(i * 0.32) * 1.002,
          r * 0.035,
          3,
          40
        );
        const bandMat = new three.MeshToonMaterial({
          color: brandCol(band, three),
        });
        disposables.push(bandGeo, bandMat);
        const bandMesh = new three.Mesh(bandGeo, bandMat);
        bandMesh.position.set(0, Math.sin(i * 0.32) * r, 0);
        bandMesh.rotation.set(Math.PI / 2, 0, 0);
        P.add(bandMesh);
      }
    }

    if (ring !== null) {
      const R = new three.Group();
      R.rotation.set(1.25, 0.25, 0);
      P.add(R);

      const ringGeo1 = new three.TorusGeometry(r * 1.55, r * 0.05, 2, 64);
      const ringMat1 = new three.MeshBasicMaterial({
        color: brandCol(ring, three),
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      });
      disposables.push(ringGeo1, ringMat1);
      R.add(new three.Mesh(ringGeo1, ringMat1));

      const ringGeo2 = new three.TorusGeometry(r * 1.75, r * 0.025, 2, 64);
      const ringMat2 = new three.MeshBasicMaterial({
        color: brandCol(ring, three),
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
      });
      disposables.push(ringGeo2, ringMat2);
      R.add(new three.Mesh(ringGeo2, ringMat2));
    }

    animators.push((t) => {
      P.rotation.y = t / 40000;
    });
  }

  function addBelt(
    c: [number, number, number],
    R: number,
    n: number,
    seed: number,
    tilt = 0.25
  ) {
    const r = createCRND(seed);
    const B = new three.Group();
    B.position.set(c[0], c[1], c[2]);
    B.rotation.set(tilt, 0, 0.12);
    root.add(B);

    for (let i = 0; i < n; i++) {
      const a = r() * Math.PI * 2;
      const rr = R * (0.85 + r() * 0.3);
      const geo = new three.IcosahedronGeometry(0.3 + r() * 1.1, 0);
      const mat = new three.MeshToonMaterial({
        color: brandCol(r() < 0.3 ? 0x4a4f86 : 0x2e3256, three),
      });
      disposables.push(geo, mat);
      const mesh = new three.Mesh(geo, mat);
      mesh.position.set(Math.cos(a) * rr, (r() - 0.5) * 2, Math.sin(a) * rr);
      mesh.rotation.set(r() * 3, r() * 3, 0);
      B.add(mesh);
    }

    animators.push((t) => {
      B.rotation.y = t / 70000;
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

  function addConstellation(
    c: [number, number, number],
    s: number,
    seed: number
  ) {
    const r = createCRND(seed);
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 7; i++) {
      pts.push(
        new three.Vector3(
          c[0] + (r() - 0.5) * s,
          c[1] + (r() - 0.5) * s * 0.6,
          c[2] + (r() - 0.5) * 4
        )
      );
    }

    const seg: THREE.Vector3[] = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const pA = pts[i];
      const pB = pts[i + 1];
      if (pA && pB) seg.push(pA, pB);
    }
    const p2 = pts[2];
    const p5 = pts[5];
    if (p2 && p5) seg.push(p2, p5);

    const geo = new three.BufferGeometry().setFromPoints(seg);
    const mat = new three.LineBasicMaterial({
      color: 0xb8c2ff,
      transparent: true,
      opacity: 0.28,
    });
    disposables.push(geo, mat);

    const ln = new three.LineSegments(geo, mat);
    root.add(ln);

    pts.forEach((p, i) =>
      glowSprite(
        root,
        [p.x, p.y, p.z],
        i % 3 ? 0.6 : 0.9,
        i % 3 ? 0xffffff : 0xff7fa6
      )
    );
  }

  // Presets matching reference lines 10866-10920
  const presets: Record<string, () => void> = {
    intro: () => {
      addStars(700, 150, 11);
      addNebula([-30, 22, -95], 170, MEL, VIO, 3, 0.25);
      addNebula([40, -30, -110], 150, VIO, PER, 8, -0.2, 0.5);
      addComets(2, [70, 30, -80], 5);
    },
    classes: () => {
      addStars(600, 150, 21);
      addNebula([0, -10, -100], 210, VIO, MEL, 12, 0.05, 0.55);
      addBelt([0, -14, -55], 46, 60, 7, 0.18);
      addGiant([-62, 26, -120], 14, 0x3a3f78, 0xff7fa6, 0x2b2f5e);
    },
    logi: () => {
      addStars(700, 160, 31);
      addNebula([20, 20, -110], 230, MEL, VIO, 17, -0.08, 0.6);
      addConstellation([60, 18, -90], 26, 3);
      addComets(2, [110, 30, -80], 13);
    },
    rules: () => {
      addStars(900, 140, 41);
      addConstellation([-26, 14, -80], 24, 8);
      addConstellation([30, -8, -85], 22, 15);
      addNebula([0, 5, -120], 200, PER, VIO, 23, 0.15, 0.4);
    },
    stages: () => {
      addStars(600, 160, 51);
      addGiant([-26, 22, -90], 16, 0x30346a, null, 0xee004e);
      addNebula([50, -6, -110], 190, MEL, VIO, 29, 0.2, 0.6);
      addComets(4, [90, 28, -70], 21);
    },
    outro: () => {
      addStars(800, 150, 61);
      addNebula([0, 0, -100], 200, MEL, MEL, 31, 0, 0.6);
      addNebula([-20, 18, -115], 160, VIO, PER, 37, 0.3, 0.45);
    },
    app: () => {
      addStars(700, 150, 71);
      addNebula([-10, 14, -100], 210, VIO, MEL, 41, -0.12, 0.55);
      addGiant([34, 18, -100], 9, 0x4a4f86, 0xb8c2ff);
      addGiant([-44, -20, -95], 5, 0x2e3256, null, 0x5b47d6);
      addBelt([0, -20, -70], 52, 40, 19, 0.12);
    },
  };

  const builder = presets[key] ?? presets.intro;
  if (builder) builder();

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
