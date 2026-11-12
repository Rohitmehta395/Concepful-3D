import type * as THREE from "three";
import {
  HX,
  resolveDisplayFont,
  texC,
  type MaterialRegistry,
} from "./materials";

export type Vec3Tuple = [number, number, number];
export type Vec2Tuple = [number, number];

const OUT = 0.04;

export function flat(g: THREE.BufferGeometry): THREE.BufferGeometry {
  const n = g.index ? g.toNonIndexed() : g;
  n.computeVertexNormals();
  return n;
}

export function Bx(
  three: typeof THREE,
  w: number,
  h: number,
  d: number
): THREE.BoxGeometry {
  return new three.BoxGeometry(w, h, d);
}

export function Cy(
  three: typeof THREE,
  a: number,
  b: number,
  h: number,
  s = 6
): THREE.BufferGeometry {
  return flat(new three.CylinderGeometry(a, b, h, s));
}

export function Co(
  three: typeof THREE,
  r: number,
  h: number,
  s = 5
): THREE.BufferGeometry {
  return flat(new three.ConeGeometry(r, h, s));
}

export function Ic(
  three: typeof THREE,
  r: number,
  d = 0
): THREE.BufferGeometry {
  return flat(new three.IcosahedronGeometry(r, d));
}

export function Do(three: typeof THREE, r: number): THREE.BufferGeometry {
  return flat(new three.DodecahedronGeometry(r));
}

export function Hemi(
  three: typeof THREE,
  r: number,
  ws = 8,
  hs = 3
): THREE.BufferGeometry {
  return flat(
    new three.SphereGeometry(r, ws, hs, 0, Math.PI * 2, 0, Math.PI / 2)
  );
}

export function Tor(
  three: typeof THREE,
  r: number,
  t: number,
  rs = 4,
  ts = 12
): THREE.TorusGeometry {
  return new three.TorusGeometry(r, t, rs, ts);
}

export function Ex(
  three: typeof THREE,
  pts: Vec2Tuple[],
  depth: number
): THREE.ExtrudeGeometry {
  const s = new three.Shape(pts.map((p) => new three.Vector2(p[0], p[1])));
  const g = new three.ExtrudeGeometry(s, { depth, bevelEnabled: false });
  g.translate(0, 0, -depth / 2);
  return g;
}

export function rbx(
  three: typeof THREE,
  w: number,
  h: number,
  d: number,
  c: number
): THREE.ExtrudeGeometry {
  const ch = Math.max(0.005, Math.min(c, w / 3, h / 3, d / 3));
  const iw = w / 2 - ch;
  const ih = h / 2 - ch;
  const s = new three.Shape(
    [
      [-iw, -ih],
      [iw, -ih],
      [iw, ih],
      [-iw, ih],
    ].map((p) => new three.Vector2(p[0], p[1]))
  );
  const g = new three.ExtrudeGeometry(s, {
    depth: Math.max(0.005, d - 2 * ch),
    bevelEnabled: true,
    bevelThickness: ch,
    bevelSize: ch,
    bevelSegments: 1,
  });
  g.translate(0, 0, -(d - 2 * ch) / 2);
  return g;
}

export function tbox(
  three: typeof THREE,
  wt: number,
  wb: number,
  h: number,
  dt: number,
  db: number,
  lean = 0
): THREE.BufferGeometry {
  const g = new three.BoxGeometry(1, h, 1);
  const p = g.attributes.position;
  if (p) {
    for (let i = 0; i < p.count; i++) {
      const top = p.getY(i) > 0;
      p.setX(i, p.getX(i) * (top ? wt : wb));
      p.setZ(i, p.getZ(i) * (top ? dt : db) + (top ? lean : 0));
    }
  }
  return flat(g);
}

export function slabXY(
  three: typeof THREE,
  pts: Vec2Tuple[],
  depth: number,
  bev = 0
): THREE.ExtrudeGeometry {
  const s = new three.Shape(pts.map((p) => new three.Vector2(p[0], p[1])));
  const d = Math.max(0.005, depth - 2 * bev);
  const g = new three.ExtrudeGeometry(s, {
    depth: d,
    bevelEnabled: bev > 0,
    bevelThickness: bev,
    bevelSize: bev,
    bevelSegments: 1,
  });
  g.translate(0, 0, -d / 2);
  return g;
}

export function slabYZ(
  three: typeof THREE,
  pts: Vec2Tuple[],
  width: number,
  bev = 0
): THREE.ExtrudeGeometry {
  const g = slabXY(three, pts, width, bev);
  g.rotateY(-Math.PI / 2);
  return g;
}

export function mir(pts: Vec2Tuple[]): Vec2Tuple[] {
  return pts.map((p): Vec2Tuple => [-p[0], p[1]]).reverse();
}

export function mk(
  three: typeof THREE,
  mats: MaterialRegistry,
  par: THREE.Object3D,
  g: THREE.BufferGeometry,
  mat: THREE.Material,
  p?: Vec3Tuple | null,
  r?: Vec3Tuple | null,
  s?: Vec3Tuple | null,
  line = true
): THREE.Mesh {
  const m = new three.Mesh(g, mat);
  if (p) m.position.set(p[0], p[1], p[2]);
  if (r) m.rotation.set(r[0], r[1], r[2]);
  if (s) m.scale.set(s[0], s[1], s[2]);
  par.add(m);
  if (line) {
    if (!g.boundingBox) g.computeBoundingBox();
    const b = g.boundingBox;
    if (b) {
      const z = new three.Vector3();
      const c = new three.Vector3();
      b.getSize(z);
      b.getCenter(c);
      const sc: Vec3Tuple = s || [1, 1, 1];
      const o = new three.Mesh(g, mats.INK);
      o.scale.set(
        1 + (2 * OUT) / Math.max(0.03, z.x * sc[0]),
        1 + (2 * OUT) / Math.max(0.03, z.y * sc[1]),
        1 + (2 * OUT) / Math.max(0.03, z.z * sc[2])
      );
      o.position.set(
        -c.x * (o.scale.x - 1),
        -c.y * (o.scale.y - 1),
        -c.z * (o.scale.z - 1)
      );
      m.add(o);
    }
  }
  return m;
}

export function bake(
  three: typeof THREE,
  mats: MaterialRegistry,
  par: THREE.Object3D
): THREE.Object3D {
  const groups = new Map<
    string,
    { mat: THREE.Material; list: THREE.BufferGeometry[] }
  >();
  const rm: THREE.Mesh[] = [];

  par.children.slice().forEach((child) => {
    const m = child as THREE.Mesh;
    if (!m.isMesh || Array.isArray(m.material)) return;
    const matWithMap = m.material as THREE.MeshBasicMaterial;
    if (matWithMap.map || m.userData.keep) return;

    const hasNonInkChild = m.children.some((c) => {
      const cm = c as THREE.Mesh;
      return !(cm.isMesh && cm.material === mats.INK);
    });
    if (hasNonInkChild) return;

    m.updateMatrix();
    const addMesh = (mesh: THREE.Mesh, mx: THREE.Matrix4) => {
      const mat = mesh.material as THREE.Material;
      const k = mat.uuid;
      if (!groups.has(k)) groups.set(k, { mat, list: [] });
      const q = mesh.geometry.index
        ? mesh.geometry.toNonIndexed()
        : mesh.geometry.clone();
      q.applyMatrix4(mx);
      groups.get(k)!.list.push(q);
    };

    addMesh(m, m.matrix);
    m.children.forEach((oChild) => {
      const o = oChild as THREE.Mesh;
      o.updateMatrix();
      addMesh(o, m.matrix.clone().multiply(o.matrix));
    });
    rm.push(m);
  });

  rm.forEach((m) => {
    par.remove(m);
    m.geometry.dispose();
  });

  groups.forEach(({ mat, list }) => {
    let n = 0;
    list.forEach((q) => {
      n += q.attributes.position ? q.attributes.position.count : 0;
    });
    const P = new Float32Array(n * 3);
    const N = new Float32Array(n * 3);
    let offset = 0;
    list.forEach((q) => {
      const posAttr = q.attributes.position;
      const normAttr = q.attributes.normal;
      if (posAttr) {
        P.set(posAttr.array as Float32Array, offset * 3);
        if (normAttr) {
          N.set(normAttr.array as Float32Array, offset * 3);
        }
        offset += posAttr.count;
      }
      q.dispose();
    });
    const bg = new three.BufferGeometry();
    bg.setAttribute("position", new three.BufferAttribute(P, 3));
    bg.setAttribute("normal", new three.BufferAttribute(N, 3));
    par.add(new three.Mesh(bg, mat));
  });

  return par;
}

export function glowS(
  three: typeof THREE,
  mats: MaterialRegistry,
  par: THREE.Object3D,
  p: Vec3Tuple,
  size: number,
  col: number
): THREE.Sprite {
  if (p[2] <= -14 && size >= 10) return new three.Sprite();
  const s = new three.Sprite(
    new three.SpriteMaterial({
      map: mats.GLOWT,
      color: mats.brand(col),
      blending: three.AdditiveBlending,
      depthWrite: false,
      transparent: true,
    })
  );
  s.position.set(p[0], p[1], p[2]);
  s.scale.set(size, size, 1);
  par.add(s);
  return s;
}

export function eye3(
  three: typeof THREE,
  mats: MaterialRegistry,
  par: THREE.Object3D,
  p: Vec3Tuple,
  r: number
): THREE.Sprite {
  const rad = r * 1.3;
  mk(
    three,
    mats,
    par,
    Ic(three, rad, 1),
    mats.bm(HX.red),
    p,
    null,
    null,
    false
  );
  mk(
    three,
    mats,
    par,
    Ic(three, rad * 0.36),
    mats.bm(0xffffff),
    [p[0] + rad * 0.35, p[1] + rad * 0.38, p[2] + rad * 0.6],
    null,
    null,
    false
  );
  return glowS(three, mats, par, p, rad * 7, HX.red);
}

export function plane(
  three: typeof THREE,
  par: THREE.Object3D,
  w: number,
  h: number,
  map: THREE.Texture,
  p?: Vec3Tuple | null,
  r?: Vec3Tuple | null,
  op = 1
): THREE.Mesh {
  const m = new three.Mesh(
    new three.PlaneGeometry(w, h),
    new three.MeshBasicMaterial({
      map,
      transparent: op < 1 || true,
      opacity: op,
      side: three.DoubleSide,
      depthWrite: op >= 1,
    })
  );
  if (p) m.position.set(p[0], p[1], p[2]);
  if (r) m.rotation.set(r[0], r[1], r[2]);
  par.add(m);
  return m;
}

export function textSprite(
  three: typeof THREE,
  txt: string,
  col: string,
  h: number
): THREE.Sprite {
  const font = `400 40px ${resolveDisplayFont()}`;
  let cw = 256;
  if (
    typeof document !== "undefined" &&
    typeof document.createElement === "function"
  ) {
    const mc = document.createElement("canvas").getContext("2d");
    if (mc) {
      mc.font = font;
      cw = Math.max(256, Math.ceil(mc.measureText(txt).width + 48));
    }
  }
  const t = texC(
    cw,
    72,
    (x, w) => {
      x.font = font;
      x.textAlign = "center";
      x.textBaseline = "middle";
      x.lineWidth = 9;
      x.strokeStyle = "#141624";
      x.strokeText(txt, w / 2, 38);
      x.fillStyle = col;
      x.fillText(txt, w / 2, 38);
    },
    three
  );
  const s = new three.Sprite(
    new three.SpriteMaterial({
      map: t,
      transparent: true,
      depthWrite: false,
    })
  );
  s.scale.set((h * cw) / 72, h, 1);
  return s;
}

export function holoEdges(
  three: typeof THREE,
  par: THREE.Object3D,
  g: THREE.BufferGeometry,
  p?: Vec3Tuple | null,
  r?: Vec3Tuple | null
): THREE.LineSegments {
  const l = new three.LineSegments(
    new three.EdgesGeometry(g),
    new three.LineBasicMaterial({ color: HX.holo })
  );
  if (p) l.position.set(p[0], p[1], p[2]);
  if (r) l.rotation.set(r[0], r[1], r[2]);
  par.add(l);
  return l;
}

export function hexPlinth(
  three: typeof THREE,
  mats: MaterialRegistry,
  g: THREE.Object3D,
  r: number
): THREE.Group {
  const P = new three.Group();
  g.add(P);
  mk(
    three,
    mats,
    P,
    Cy(three, r, r + 0.35, 0.5, 14),
    mats.tm(0x23264a),
    [0, -0.25, 0],
    null,
    null,
    false
  );
  mk(
    three,
    mats,
    P,
    Tor(three, r + 0.03, 0.07, 3, 64),
    mats.bm(HX.melon),
    [0, 0.01, 0],
    [Math.PI / 2, 0, 0],
    null,
    false
  );
  mk(
    three,
    mats,
    P,
    Co(three, r * 0.82, 2.6, 12),
    mats.tm(0x181a33),
    [0, -1.8, 0],
    [Math.PI, 0, 0],
    null,
    false
  );
  return P;
}

export function flame3(
  three: typeof THREE,
  mats: MaterialRegistry,
  par: THREE.Object3D,
  p: Vec3Tuple,
  len: number,
  r: number,
  dir?: "x-"
): THREE.Group {
  const g = new three.Group();
  g.position.set(p[0], p[1], p[2]);
  par.add(g);
  mk(
    three,
    mats,
    g,
    Co(three, r, len, 6),
    mats.bm(0xff8a3d, 0.8, true),
    [0, -len / 2, 0],
    [Math.PI, 0, 0],
    null,
    false
  );
  mk(
    three,
    mats,
    g,
    Co(three, r * 0.5, len * 0.6, 6),
    mats.bm(0xfff2c8, 0.95, true),
    [0, -len * 0.3, 0],
    [Math.PI, 0, 0],
    null,
    false
  );
  if (dir === "x-") g.rotation.z = -Math.PI / 2;
  return g;
}

export function flick(fl: THREE.Group[], t: number, amp = 0.15): void {
  fl.forEach((f, i) => {
    f.scale.y = 1 - amp + amp * Math.sin(t / 38 + i * 1.7);
  });
}

export function planet3(
  three: typeof THREE,
  mats: MaterialRegistry,
  sc: THREE.Object3D,
  r: number,
  p: Vec3Tuple,
  col: number,
  ring: boolean
): THREE.Group {
  const g = new three.Group();
  g.position.set(p[0], p[1], p[2]);
  sc.add(g);
  mk(three, mats, g, Ic(three, r, 1), mats.tm(col), null, null, null, false);
  if (ring) {
    mk(
      three,
      mats,
      g,
      Tor(three, r * 1.5, r * 0.03, 3, 32),
      mats.bm(0xece6d6, 0.35),
      null,
      [1.25, 0.2, 0],
      null,
      false
    );
  }
  return g;
}
