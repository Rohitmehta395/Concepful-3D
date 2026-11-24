import * as THREE from "three";
import type { MaterialRegistry } from "../../../world/materials";
import { Cy, Ic, Co, Tor, eye3, mk, textSprite } from "../../../world/geometry";
import { HX } from "../../../world/materials";
import { BR } from "./br";

export interface PopPlanetHandle {
  readonly g: THREE.Group;
  readonly center: THREE.Vector3;
  readonly upd: (t: number) => void;
}

interface FolkEntry {
  m: THREE.Group;
  a: number;
  b: number;
  s: number;
}

/**
 * popPlanet: Planetary diorama with orbiting inhabitants, question mark textSprites, and glowing halo.
 * Preallocates scratch vectors so 0 objects are allocated per frame in upd(t).
 * Source: reference lines 12455-12545.
 */
export function popPlanet(
  three: typeof THREE,
  mats: MaterialRegistry
): PopPlanetHandle {
  const g = new three.Group();
  const G3 = mats.tm(HX.gun);
  mk(three, mats, g, Cy(three, 0.5, 0.9, 1.4, 8), G3, [0, 0.7, 0]);

  const pl = new three.Group();
  pl.position.y = 3.4;
  g.add(pl);
  mk(three, mats, pl, Ic(three, 2.0, 1), mats.tm(BR.slate3));

  const boneMat = mats.tm(HX.bone);
  const redMat = mats.tm(HX.red);

  for (let i = 0; i < 7; i++) {
    const a = i * 0.9;
    const b = Math.sin(i * 1.7) * 0.8;
    const px = Math.cos(a) * Math.cos(b) * 1.9;
    const py = Math.sin(b) * 1.9;
    const pz = Math.sin(a) * Math.cos(b) * 1.9;
    mk(
      three,
      mats,
      pl,
      Ic(three, 0.55 + (i % 3) * 0.15),
      boneMat,
      [px, py, pz],
      null,
      [1, 0.4, 1],
      false
    ).lookAt(0, 0, 0);
  }

  const folk: FolkEntry[] = [];
  for (let i = 0; i < 18; i++) {
    const m = new three.Group();
    pl.add(m);
    mk(
      three,
      mats,
      m,
      Co(three, 0.1, 0.28, 4),
      i % 4 ? boneMat : redMat,
      [0, 0.14, 0]
    );
    eye3(three, mats, m, [0, 0.22, 0.07], 0.02);
    folk.push({
      m,
      a: Math.random() * 6,
      b: (Math.random() - 0.5) * 2.6,
      s: 0.2 + Math.random() * 0.4,
    });
  }

  const qs = [0, 1, 2].map(() => {
    const s = textSprite(three, "?", "#FFFFFF", 0.5);
    g.add(s);
    return s;
  });

  const ring = mk(
    three,
    mats,
    g,
    Tor(three, 2.6, 0.03, 3, 48),
    mats.bm(HX.holo, 0.5, true),
    [0, 3.4, 0],
    [Math.PI / 2, 0, 0],
    null,
    false
  );

  const scratchP = new three.Vector3();
  const scratchTarget = new three.Vector3();

  return {
    g,
    center: new three.Vector3(0, 3.4, 0),
    upd: (t: number) => {
      pl.rotation.y = t / 9000;
      folk.forEach((f) => {
        f.a += 0.0015 * f.s * 16;
        const cosB = Math.cos(f.b);
        scratchP.set(
          Math.cos(f.a) * cosB * 2.0,
          Math.sin(f.b) * 2.0,
          Math.sin(f.a) * cosB * 2.0
        );
        f.m.position.copy(scratchP);
        scratchTarget.copy(scratchP).multiplyScalar(2);
        f.m.lookAt(scratchTarget);
        f.m.rotateX(Math.PI / 2);
      });
      qs.forEach((s, i) => {
        const q = (t / 1600 + i / 3) % 1;
        s.position.set(
          Math.cos(i * 2.1) * 1.6,
          5.3 + q * 1.4,
          Math.sin(i * 2.1) * 1.6
        );
        s.material.opacity = 1 - q;
      });
      ring.rotation.z = t / 1200;
      ring.position.y = 3.4 + Math.sin(t / 700) * 0.8;
    },
  };
}
