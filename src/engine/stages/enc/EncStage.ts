import type * as THREE from "three";
import type { Stage, StageBuildContext, StageUpdateParams } from "../types";
import type { BuildState } from "../../buildState";
import { bgTex } from "../../world/materials";
import { createCosmos, type CosmosLayer } from "../../world/cosmos";
import { createStreakField, type StreakField } from "../../world/streakField";
import {
  glowS,
  planet3,
  Cy,
  Bx,
  Co,
  eye3,
  mk,
  plane,
} from "../../world/geometry";
import { HX } from "../../world/materials";
import { OBJECTIVES } from "@/content/objectives";
import { base3 } from "./models/base3";
import { face } from "./models/face";
import { beam3, setBeam } from "./models/beam";
import { wyrm } from "./models/wyrm";
import { barbarian } from "./models/barbarian";
import { furball } from "./models/furball";
import { popPlanet } from "./models/popPlanet";
import { maze } from "./models/maze";
import { bossMino } from "./models/bossMino";
import { H3 } from "../../models/hVehiclesC";
import { U3, uKraken, biped, uDolly } from "../../models/uUnits";
import { flick } from "../../world/geometry";

function back(u: number): number {
  const c1 = 1.5;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2);
}

interface EncDiorama {
  readonly g: THREE.Group;
  readonly upd: (t: number) => void;
}

export function createEncStage(ctx: StageBuildContext): Stage {
  const { three, mats, camera, orbitCtrl } = ctx;
  const group = new three.Group();
  const parentScene = ctx.scene;
  parentScene.add(group);

  const bgTexture = bgTex("#11141B", "#2C313B", three);
  const cosmosLayer: CosmosLayer = createCosmos(three, group, "app"); // "app" cosmos uses lines 10910-10917 enc preset
  const streak: StreakField = createStreakField(
    three,
    group,
    150,
    [80, 34, 30],
    2.6
  );
  glowS(three, mats, group, [0, 2, -34], 34, 0x8f0030);
  const planet = planet3(
    three,
    mats,
    group,
    6,
    [-34, -24, -70],
    0x3a414c,
    true
  );

  // Cached diorama instances
  const cache: Record<string, EncDiorama> = {};

  let cur: string | null = null;
  let t0 = 0;
  let drop = 0;
  let lastKnownObjectiveCount = -1;
  let lastPrimaryObjective = "";

  const scratchV1 = new three.Vector3();
  const scratchV2 = new three.Vector3();
  const scratchV3 = new three.Vector3();
  const scratchAtPoint = new three.Vector3();

  const ENCD_CAM: Record<string, [number, number, number]> = {
    gtm: [0.55, 0.42, 1],
    dir: [0.4, 0.4, 1],
    research: [0.45, 0.38, 1],
    product: [0.3, 0.75, 1],
  };

  function buildDiorama(id: string, g: THREE.Group): (t: number) => void {
    if (id === "gtm") {
      base3(three, mats, g, 7.2);
      const w = wyrm(three, mats);
      w.g.position.set(3.2, 0, -1.6);
      g.add(w.g);

      const bs = [0, 1, 2].map((i) => {
        const b = barbarian(three, mats);
        b.g.position.set(-3.6 + i * 1.4, 0, 1.6 - i * 1.2);
        g.add(b.g);
        face(b, 3.2, -1.6);
        return b;
      });

      const fb = furball(three, mats);
      fb.g.position.set(-1.2, 0, 2.6);
      g.add(fb.g);
      face(fb, 3.2, -1.6);

      const fb2 = furball(three, mats);
      fb2.g.scale.setScalar(0.8);
      fb2.g.position.set(-4.4, 0, -1.2);
      g.add(fb2.g);
      face(fb2, 3.2, -1.6);

      const lz = [beam3(three, g, 0xff6b78), beam3(three, g, 0xff6b78)];

      return (t: number) => {
        w.upd(t);
        bs.forEach((b, i) => {
          b.upd(t + i * 170);
          b.g.position.y = Math.abs(Math.sin(t / 260 + i)) * 0.12;
        });
        fb.upd(t);
        fb2.upd(t + 200);

        scratchV1.set(0, 0, 0);
        const hp = w.head.getWorldPosition(scratchV1);
        g.worldToLocal(hp);

        scratchV2.set(0, 0, 0);
        const m1 = fb.muzzle.getWorldPosition(scratchV2);
        g.worldToLocal(m1);

        scratchV3.set(0, 0, 0);
        const m2 = fb2.muzzle.getWorldPosition(scratchV3);
        g.worldToLocal(m2);

        setBeam(lz[0]!, m1, hp, Math.sin(t / 180) > 0.2);
        setBeam(lz[1]!, m2, hp, Math.sin(t / 180 + 2) > 0.4);
      };
    }

    if (id === "dir") {
      base3(three, mats, g, 7.4);
      const K = uKraken(three, mats, { boss: true });
      K.g.scale.setScalar(1.25);
      K.g.position.set(1.6, 0, -2);
      g.add(K.g);

      const hs = ["brand", "web", "3d", "uiux"].map((k) => {
        const h = H3[k]!(three, mats);
        h.g.scale.setScalar(0.48);
        g.add(h.g);
        return h;
      });

      const lz = beam3(three, g, 0xff6b78);
      const hs0Pos = new three.Vector3();

      return (t: number) => {
        K.upd(t);
        hs.forEach((h, i) => {
          const a = t / 3200 + (i * Math.PI) / 2;
          h.g.position.set(
            1.6 + Math.cos(a) * 5.6,
            2.2 + Math.sin(a * 2) * 0.8 + i * 0.5,
            -2 + Math.sin(a) * 4
          );
          h.g.rotation.y = -a - Math.PI / 2 + (i === 0 ? 0.6 : 0);
          h.upd(t, {});
          if (h.fl && h.fl.length > 0) flick(h.fl, t);
        });

        scratchV1.set(0, 0, 0);
        const eye = K.eyeRef.getWorldPosition(scratchV1);
        g.worldToLocal(eye);

        hs0Pos.copy(hs[0]!.g.position);
        setBeam(lz, hs0Pos, eye, Math.sin(t / 200) > 0);
      };
    }

    if (id === "research") {
      base3(three, mats, g, 7.0);
      const pp = popPlanet(three, mats);
      pp.g.position.set(0.8, 0, -1);
      g.add(pp.g);

      const sci = [0, 1, 2].map((i) => {
        const b = biped(three, mats, {
          acc: HX.yel,
          head: "dome",
          torso: [0.95, 0.95, 0.65],
        });
        const a = Math.PI * 0.55 + i * 0.55;
        b.g.position.set(0.8 + Math.cos(a) * 4.3, 0, -1 + Math.sin(a) * 4.3);
        g.add(b.g);
        face(b, 0.8, -1);
        const arm = b.arms[1];
        if (arm) {
          arm.rotation.set(-1.5, 0, 0.2);
          const pr = new three.Group();
          pr.position.set(0, -1.2, 0);
          arm.add(pr);
          mk(
            three,
            mats,
            pr,
            Cy(three, 0.04, 0.04, 2.2, 4),
            mats.tm(HX.chrome),
            [0, -1.1, 0]
          );
          eye3(three, mats, pr, [0, -2.25, 0], 0.05);
        }
        return { g: b.g, arm };
      });

      const lab = new three.Group();
      lab.position.set(-4.4, 0, -2.4);
      lab.rotation.y = 0.7;
      g.add(lab);
      mk(
        three,
        mats,
        lab,
        Bx(three, 1.8, 1.0, 0.9),
        mats.tm(HX.gun),
        [0, 0.5, 0]
      );
      plane(
        three,
        lab,
        1.6,
        0.8,
        mats.TX("chart"),
        [0, 1.45, 0.2],
        [-0.3, 0, 0]
      );

      const scan = new three.Mesh(
        Co(three, 1.4, 3, 10),
        new three.MeshBasicMaterial({
          color: HX.holo,
          transparent: true,
          opacity: 0.08,
          depthWrite: false,
        })
      );
      scan.position.set(0.8, 6.2, -1);
      g.add(scan);

      return (t: number) => {
        pp.upd(t);
        sci.forEach((s, i) => {
          if (s.arm) {
            s.arm.rotation.x = -1.5 + Math.sin(t / 300 + i * 1.3) * 0.18;
          }
        });
        scan.rotation.y = t / 700;
      };
    }

    // product
    base3(three, mats, g, 7.0);
    const mz = maze(three, mats);
    g.add(mz.g);

    const B = bossMino(three, mats);
    B.g.position.set(0, 0, 0);
    g.add(B.g);

    const ld = uDolly(three, mats);
    ld.g.scale.setScalar(0.55);
    g.add(ld.g);

    const fol = ["web", "uiux"].map((uid) => {
      const U = U3[uid]!(three, mats);
      U.g.scale.setScalar(0.45);
      g.add(U.g);
      return U;
    });

    const at = (q: number, out: THREE.Vector3): THREE.Vector3 => {
      const P = mz.path;
      const f = (((q % 1) + 1) % 1) * (P.length - 1);
      const i = Math.floor(f);
      const r = f - i;
      const p1 = P[i]!;
      const p2 = P[Math.min(P.length - 1, i + 1)]!;
      return out.copy(p1).lerp(p2, r);
    };

    const nextP = new three.Vector3();

    return (t: number) => {
      B.upd(t);
      const q = t / 30000;
      const units = [ld, ...fol];
      units.forEach((u, i) => {
        const p = at(q - i * 0.025, scratchAtPoint);
        at(q - i * 0.025 + 0.004, nextP);
        u.g.position.copy(p);
        u.g.rotation.y = Math.atan2(nextP.x - p.x, nextP.z - p.z);
        u.upd(t);
      });
      face(B, ld.g.position.x, ld.g.position.z);
    };
  }

  function encPick(t: number, reduceMotion: boolean): string | null {
    const rawState = ctx.getBuildState ? ctx.getBuildState() : undefined;
    const bState = rawState as Partial<BuildState> | undefined;
    const objsList =
      bState?.objectives && bState.objectives.length > 0
        ? bState.objectives
        : bState?.objective
          ? [bState.objective]
          : ["gtm"];
    const objsSet = new Set(objsList);

    const sel = OBJECTIVES.map((o) => o.id).filter((id) =>
      objsSet.has(id as never)
    );
    if (!sel.length) {
      cur = null;
      return null;
    }

    // Detect user clicks / state changes: reset drop timer
    const primary = sel[0]!;
    if (
      lastKnownObjectiveCount !== sel.length ||
      lastPrimaryObjective !== primary
    ) {
      lastKnownObjectiveCount = sel.length;
      lastPrimaryObjective = primary;
      cur = primary;
      drop = t;
      t0 = t;
      return cur;
    }

    if (!cur || !objsSet.has(cur as never)) {
      cur = sel[0]!;
      drop = t;
      t0 = t;
    } else if (sel.length > 1 && t - t0 > 11000 && !reduceMotion) {
      cur = sel[(sel.indexOf(cur as never) + 1) % sel.length]!;
      t0 = t;
      drop = t;
    }
    return cur;
  }

  function setVisible(visible: boolean): void {
    group.visible = visible;
  }

  function update(params: StageUpdateParams): void {
    const { t, dt, kk, box, viewportH, reduceMotion } = params;

    const id = encPick(t, reduceMotion);
    for (const c of Object.values(cache)) {
      c.g.visible = false;
    }

    streak.update(dt, 1.3);
    planet.rotation.y = t / 30000;

    if (!id) {
      orbitCtrl.aim(
        camera,
        0,
        1,
        0,
        0.3,
        0.4,
        1,
        14,
        9,
        kk,
        box,
        viewportH,
        t,
        reduceMotion
      );
      return;
    }

    if (!cache[id]) {
      const g = new three.Group();
      group.add(g);
      cache[id] = { g, upd: buildDiorama(id, g) };
    }

    const C3 = cache[id]!;
    C3.g.visible = true;

    const u = reduceMotion ? 1 : Math.max(0, Math.min(1, (t - drop) / 700));
    const e = back(u);
    C3.g.position.y = (1 - e) * 8;
    C3.g.rotation.y = reduceMotion ? 0 : Math.sin(t / 7000) * 0.12;
    C3.upd(t);

    const c = ENCD_CAM[id] || [0.4, 0.4, 1];
    orbitCtrl.aim(
      camera,
      0,
      1.8,
      0,
      c[0],
      c[1],
      c[2],
      17,
      c[1] > 0.9 ? 15 : 11,
      kk,
      box,
      viewportH,
      t,
      reduceMotion
    );
  }

  function dispose(): void {
    streak.dispose();
    cosmosLayer.dispose();
    bgTexture.dispose();

    for (const c of Object.values(cache)) {
      group.remove(c.g);
      c.g.traverse((child) => {
        const renderable = child as unknown as {
          geometry?: THREE.BufferGeometry;
          material?: THREE.Material | THREE.Material[];
        };
        if (renderable.geometry) renderable.geometry.dispose();
        if (renderable.material) {
          if (Array.isArray(renderable.material)) {
            renderable.material.forEach((m) => m.dispose());
          } else {
            renderable.material.dispose();
          }
        }
      });
    }

    while (group.children.length > 0) {
      const child = group.children[0]!;
      group.remove(child);
      child.traverse((obj) => {
        const renderable = obj as unknown as {
          geometry?: THREE.BufferGeometry;
          material?: THREE.Material | THREE.Material[];
        };
        if (renderable.geometry) renderable.geometry.dispose();
        if (renderable.material) {
          if (Array.isArray(renderable.material)) {
            renderable.material.forEach((m) => m.dispose());
          } else {
            renderable.material.dispose();
          }
        }
      });
    }

    parentScene.remove(group);
  }

  return {
    key: "enc",
    group,
    get backgroundTexture() {
      return bgTexture;
    },
    fog: null,
    setVisible,
    update,
    dispose,
  };
}
