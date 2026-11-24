import type * as THREE from "three";
import type { MaterialRegistry } from "../world/materials";
import { HX } from "../world/materials";
import { Bx, Cy, Co, Ic, flat, glowS, holoEdges, mk } from "../world/geometry";
import { createCRND } from "../world/prng";
import type { EnvbManager } from "./types";

interface DrifterItem {
  readonly m: THREE.Object3D;
  readonly v?: number;
  readonly ph?: number;
}

function drifters(
  list: readonly DrifterItem[],
  dt: number,
  spd: number,
  span: number,
  reduceMotion = false
): void {
  if (reduceMotion) return;
  for (let i = 0; i < list.length; i++) {
    const d = list[i]!;
    d.m.position.x -= dt * 0.0016 * spd * (d.v || 1);
    if (d.m.position.x < -span) {
      d.m.position.x += span * 2;
    }
  }
}

function gridH(
  three: typeof THREE,
  a: number,
  b: number,
  c: number,
  d: number
): THREE.GridHelper {
  return new three.GridHelper(a, b, c, d);
}

export function createEnvbManager(
  three: typeof THREE,
  mats: MaterialRegistry,
  parentGroup: THREE.Group
): EnvbManager {
  const root = new three.Group();
  parentGroup.add(root);

  const envGroups: Record<
    string,
    {
      g: THREE.Group;
      upd: (t: number, dt: number, reduceMotion: boolean) => void;
    }
  > = {};

  let activeMission: string | null = null;
  let isDisposed = false;

  function buildMissionEnv(missionKey: string) {
    const g = new three.Group();
    g.visible = false;
    root.add(g);

    // Seeded random matching reference (RND starting with seed 7)
    const RND = createCRND(7 + missionKey.length);

    switch (missionKey) {
      case "brand": {
        glowS(three, mats, g, [-7, 3, -14], 16, 0x8f0030);
        glowS(three, mats, g, [8, -3, -16], 18, 0x4a5262);
        const o: DrifterItem[] = [];
        for (let i = 0; i < 10; i++) {
          const m = holoEdges(
            three,
            g,
            new three.OctahedronGeometry(0.25 + RND() * 0.3),
            [(RND() - 0.5) * 22, (RND() - 0.5) * 10, -4 - RND() * 8]
          );
          o.push({ m, v: 0.6 + RND() });
        }
        return {
          g,
          upd: (t: number, dt: number, reduceMotion: boolean) => {
            if (!reduceMotion) {
              for (let i = 0; i < o.length; i++) {
                o[i]!.m.rotation.set(t / 900 + i, t / 700, 0);
              }
            }
            drifters(o, dt, 2, 13, reduceMotion);
          },
        };
      }

      case "web": {
        const gr = gridH(three, 90, 45, 0xee004e, 0x4a5262);
        gr.position.set(0, -3.4, -6);
        g.add(gr);
        const p: DrifterItem[] = [];
        for (let i = 0; i < 7; i++) {
          const m = mk(
            three,
            mats,
            g,
            Co(three, 1.5 + RND() * 2, 2.5 + RND() * 2.5, 4),
            mats.tm(0x2a2f38),
            [-24 + i * 8, -2.2, -14 - RND() * 6],
            null,
            null,
            false
          );
          p.push({ m, v: 0.4 });
        }
        glowS(three, mats, g, [0, -1.5, -20], 14, 0xf2b33a);
        return {
          g,
          upd: (t: number, dt: number, reduceMotion: boolean) => {
            if (!reduceMotion) {
              gr.position.x = -((t * 0.004) % 2);
            }
            drifters(p, dt, 1.5, 28, reduceMotion);
          },
        };
      }

      case "uiux": {
        const moon = new three.Group();
        moon.position.set(-8, 4.5, -16);
        g.add(moon);
        mk(
          three,
          mats,
          moon,
          Ic(three, 3, 1),
          mats.tm(0xe9e4d8),
          null,
          null,
          null,
          false
        );
        const craterCoords: [number, number, number][] = [
          [1, 1, 2.6],
          [-1.2, 0.4, 2.7],
          [0.3, -1.4, 2.75],
        ];
        for (let i = 0; i < craterCoords.length; i++) {
          mk(
            three,
            mats,
            moon,
            Ic(three, 0.5),
            mats.tm(0xc9c3b5),
            craterCoords[i]!,
            null,
            null,
            false
          );
        }
        glowS(three, mats, moon, [0, 0, 0], 12, 0x8e93a0);
        const mt: DrifterItem[] = [];
        for (let i = 0; i < 9; i++) {
          const m = mk(
            three,
            mats,
            g,
            Co(three, 2.5 + RND() * 2, 3 + RND() * 3, 4),
            mats.tm(0x262b35),
            [-28 + i * 7, -4.2, -12 - RND() * 4],
            null,
            null,
            false
          );
          mt.push({ m, v: 0.3 });
        }
        return {
          g,
          upd: (t: number, dt: number, reduceMotion: boolean) => {
            drifters(mt, dt, 1, 32, reduceMotion);
            if (!reduceMotion) {
              moon.rotation.y = t / 20000;
            }
          },
        };
      }

      case "decks": {
        const cl: DrifterItem[] = [];
        for (let i = 0; i < 8; i++) {
          const c = new three.Group();
          for (let k = 0; k < 4; k++) {
            mk(
              three,
              mats,
              c,
              Ic(three, 0.9 + RND() * 0.9),
              mats.tm(0xece6d6),
              [k * 1.2 - 1.8, RND() * 0.6, RND() * 0.8],
              null,
              [1, 0.6, 1],
              false
            );
          }
          c.position.set(-28 + i * 7, -1 + RND() * 8, -8 - RND() * 10);
          g.add(c);
          cl.push({ m: c, v: 0.6 + RND() * 0.6 });
        }
        const bars: DrifterItem[] = [];
        for (let i = 0; i < 14; i++) {
          const h = 1 + ((i * 7) % 9) * 0.6;
          const m = mk(
            three,
            mats,
            g,
            Bx(three, 1.4, h, 1.4),
            mats.tm(i % 3 ? 0xc4bba8 : 0xee004e),
            [-28 + i * 4, -5 + h / 2, -10],
            null,
            null,
            false
          );
          bars.push({ m, v: 0.6 });
        }
        glowS(three, mats, g, [6, 3, -20], 14, 0xece6d6);
        return {
          g,
          upd: (_t: number, dt: number, reduceMotion: boolean) => {
            drifters(cl, dt, 2.2, 30, reduceMotion);
            drifters(bars, dt, 1.4, 30, reduceMotion);
          },
        };
      }

      case "copy": {
        const n = 90;
        const pos = new Float32Array(n * 3);
        for (let i = 0; i < n; i++) {
          pos.set(
            [(RND() - 0.5) * 36, (RND() - 0.5) * 20, -2 - RND() * 12],
            i * 3
          );
        }
        const geo = new three.BufferGeometry();
        geo.setAttribute("position", new three.BufferAttribute(pos, 3));
        const ptsMat = new three.PointsMaterial({
          color: 0xece6d6,
          size: 0.16,
          transparent: true,
          opacity: 0.85,
        });
        const pts = new three.Points(geo, ptsMat);
        g.add(pts);

        const kelp: Array<DrifterItem & { ph: number }> = [];
        for (let i = 0; i < 12; i++) {
          const k = new three.Group();
          k.position.set(-22 + i * 4, -5, -6 - RND() * 6);
          g.add(k);
          for (let j = 0; j < 6; j++) {
            mk(
              three,
              mats,
              k,
              Bx(three, 0.18, 0.8, 0.18),
              mats.tm(j % 2 ? 0x3a414c : 0x5a5862),
              [0, j * 0.75, 0],
              null,
              null,
              false
            );
          }
          kelp.push({ m: k, v: 0.5, ph: RND() * 6 });
        }
        glowS(three, mats, g, [5, 2, -14], 12, 0x8f0030);

        return {
          g,
          upd: (t: number, dt: number, reduceMotion: boolean) => {
            if (!reduceMotion) {
              for (let i = 0; i < n; i++) {
                let y = pos[i * 3 + 1]! + dt * 0.0012;
                if (y > 10) y = -10;
                pos[i * 3 + 1] = y;
              }
              geo.attributes.position!.needsUpdate = true;
              for (let i = 0; i < kelp.length; i++) {
                const k = kelp[i]!;
                for (let j = 0; j < k.m.children.length; j++) {
                  k.m.children[j]!.position.x =
                    Math.sin(t / 700 + k.ph + j * 0.5) * 0.12 * j;
                }
              }
            }
            drifters(kelp, dt, 1, 24, reduceMotion);
          },
        };
      }

      case "motion": {
        mk(
          three,
          mats,
          g,
          Bx(three, 90, 0.4, 24),
          mats.tm(0x4a5262),
          [0, -4.4, -8],
          null,
          null,
          false
        );
        const gr: DrifterItem[] = [];
        for (let i = 0; i < 70; i++) {
          const m = mk(
            three,
            mats,
            g,
            Co(three, 0.12, 0.7 + RND() * 0.6, 3),
            mats.tm(i % 3 ? 0x3a414c : 0x6a707c),
            [(RND() - 0.5) * 60, -3.9, -2 - RND() * 12],
            null,
            null,
            false
          );
          gr.push({ m, v: 1.2 });
        }
        const reels: DrifterItem[] = [];
        for (let i = 0; i < 4; i++) {
          const r = new three.Group();
          r.position.set(-12 + i * 8, 2 + RND() * 4, -8 - RND() * 4);
          g.add(r);
          mk(
            three,
            mats,
            r,
            Cy(three, 0.9, 0.9, 0.2, 10),
            mats.tm(0xee004e),
            null,
            [Math.PI / 2, 0, 0]
          );
          mk(
            three,
            mats,
            r,
            Bx(three, 1.5, 0.15, 0.25),
            mats.tm(HX.bone),
            null,
            null,
            null,
            false
          );
          reels.push({ m: r, v: 0.6 });
        }
        const cl: DrifterItem[] = [];
        for (let i = 0; i < 5; i++) {
          const c = new three.Group();
          for (let k = 0; k < 3; k++) {
            mk(
              three,
              mats,
              c,
              Ic(three, 0.9 + RND() * 0.6),
              mats.tm(0xffffff),
              [k * 1.1 - 1.1, RND() * 0.5, 0],
              null,
              [1, 0.6, 1],
              false
            );
          }
          c.position.set(-20 + i * 9, 6 + RND() * 2, -16);
          g.add(c);
          cl.push({ m: c, v: 0.4 });
        }
        return {
          g,
          upd: (t: number, dt: number, reduceMotion: boolean) => {
            drifters(gr, dt, 3, 30, reduceMotion);
            drifters(reels, dt, 1.4, 20, reduceMotion);
            drifters(cl, dt, 0.8, 26, reduceMotion);
            if (!reduceMotion) {
              for (let i = 0; i < reels.length; i++) {
                reels[i]!.m.rotation.z = -t / 400;
              }
            }
          },
        };
      }

      case "3d": {
        const cr: DrifterItem[] = [];
        for (let i = 0; i < 12; i++) {
          const m = mk(
            three,
            mats,
            g,
            flat(new three.OctahedronGeometry(0.4 + RND() * 0.7)),
            mats.tm(i % 2 ? 0xee004e : 0xece6d6),
            [(RND() - 0.5) * 26, (RND() - 0.5) * 10, -4 - RND() * 10],
            null,
            [1, 1.6, 1]
          );
          cr.push({ m, v: 0.6 + RND() * 0.6 });
        }
        const co: DrifterItem[] = [];
        for (let i = 0; i < 16; i++) {
          const col = [0xee004e, 0xc4bba8, 0x5a5862, 0xece6d6][i % 4]!;
          const m = mk(
            three,
            mats,
            g,
            i % 2
              ? Co(three, 0.5 + RND() * 0.4, 1.2 + RND(), 5)
              : Ic(three, 0.6 + RND() * 0.4),
            mats.tm(col),
            [-28 + i * 3.6, -4.4, -6 - RND() * 5],
            null,
            null,
            true
          );
          co.push({ m, v: 1 });
        }
        return {
          g,
          upd: (t: number, dt: number, reduceMotion: boolean) => {
            if (!reduceMotion) {
              for (let i = 0; i < cr.length; i++) {
                cr[i]!.m.rotation.set(0, t / 1200 + i, 0);
              }
            }
            drifters(cr, dt, 1.2, 14, reduceMotion);
            drifters(co, dt, 1.6, 30, reduceMotion);
          },
        };
      }

      case "fab": {
        glowS(three, mats, g, [-6, 4, -22], 16, 0xece6d6);
        const ms: DrifterItem[] = [];
        for (let i = 0; i < 9; i++) {
          const h = 2.5 + RND() * 3;
          const m = mk(
            three,
            mats,
            g,
            Cy(three, 1.8 + RND(), 2.4 + RND(), h, 6),
            mats.tm(i % 2 ? 0x5a5862 : 0x4a5262),
            [-30 + i * 7.5, -5 + h / 2, -8 - RND() * 8],
            null,
            null,
            true
          );
          ms.push({ m, v: 1 });
        }
        const n = 60;
        const pos = new Float32Array(n * 3);
        for (let i = 0; i < n; i++) {
          pos.set(
            [(RND() - 0.5) * 40, (RND() - 0.5) * 12, -2 - RND() * 8],
            i * 3
          );
        }
        const geo = new three.BufferGeometry();
        geo.setAttribute("position", new three.BufferAttribute(pos, 3));
        g.add(
          new three.Points(
            geo,
            new three.PointsMaterial({
              color: 0xece6d6,
              size: 0.1,
              transparent: true,
              opacity: 0.7,
            })
          )
        );
        return {
          g,
          upd: (_t: number, dt: number, reduceMotion: boolean) => {
            drifters(ms, dt, 1.6, 34, reduceMotion);
            if (!reduceMotion) {
              for (let i = 0; i < n; i++) {
                let x = pos[i * 3]! - dt * 0.006;
                if (x < -20) x = 20;
                pos[i * 3] = x;
              }
              geo.attributes.position!.needsUpdate = true;
            }
          },
        };
      }

      case "ai":
      default: {
        const gr = gridH(three, 90, 45, 0xee004e, 0x3a414c);
        gr.position.set(0, -4.2, -6);
        g.add(gr);
        glowS(three, mats, g, [7, 4, -22], 12, 0x8f0030);
        const bl: DrifterItem[] = [];
        for (let i = 0; i < 16; i++) {
          const h = 2 + RND() * 6;
          const b = new three.Group();
          b.position.set(-32 + i * 4.2, -4.2, -9 - RND() * 6);
          g.add(b);
          mk(
            three,
            mats,
            b,
            Bx(three, 2.2, h, 2),
            mats.tm(i % 2 ? 0x1e222b : 0x2a2f38),
            [0, h / 2, 0]
          );
          const steps = Math.floor(h / 0.9);
          for (let k = 0; k < steps; k++) {
            mk(
              three,
              mats,
              b,
              Bx(three, 1.6, 0.18, 0.05),
              mats.bm(k % 3 ? 0xece6d6 : 0xee004e, 0.85),
              [0, 0.6 + k * 0.9, 1.03],
              null,
              null,
              false
            );
          }
          bl.push({ m: b, v: 1 });
        }
        return {
          g,
          upd: (t: number, dt: number, reduceMotion: boolean) => {
            if (!reduceMotion) {
              gr.position.x = -((t * 0.006) % 2);
            }
            drifters(bl, dt, 1.6, 34, reduceMotion);
          },
        };
      }
    }
  }

  function setMission(missionKey: string): void {
    if (isDisposed || activeMission === missionKey) return;
    for (const key of Object.keys(envGroups)) {
      envGroups[key]!.g.visible = false;
    }
    let target = envGroups[missionKey];
    if (!target) {
      target = buildMissionEnv(missionKey);
      envGroups[missionKey] = target;
    }
    target.g.visible = true;
    activeMission = missionKey;
  }

  function update(t: number, dt: number, reduceMotion: boolean): void {
    if (isDisposed || !activeMission) return;
    const current = envGroups[activeMission];
    if (current) {
      current.upd(t, dt, reduceMotion);
    }
  }

  function dispose(): void {
    if (isDisposed) return;
    isDisposed = true;
    activeMission = null;
    while (root.children.length > 0) {
      root.remove(root.children[0]!);
    }
    parentGroup.remove(root);
  }

  return {
    get group() {
      return root;
    },
    setMission,
    update,
    dispose,
  };
}
