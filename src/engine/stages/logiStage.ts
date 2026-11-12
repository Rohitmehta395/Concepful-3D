import type * as THREE from "three";
import { HX, bgTex, texC, type MaterialRegistry } from "../world/materials";
import {
  Bx,
  Co,
  Cy,
  Ex,
  Ic,
  Tor,
  flick,
  glowS,
  hexPlinth,
  mk,
  plane,
  rbx,
} from "../world/geometry";
import { createCosmos, type CosmosLayer } from "../world/cosmos";
import { createStreakField, type StreakField } from "../world/streakField";
import { sStar } from "../models/hVehiclesC";
import {
  uLancer,
  uQuill,
  uMarshal,
  uRonin,
  uForge,
  uArchitect,
  type UnitHandle,
} from "../models/uUnits";
import type { Stage, StageBuildContext, StageUpdateParams } from "./types";

const X = [0, 17, 34, 51] as const;

function back(u: number): number {
  const c1 = 1.5;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2);
}

/**
 * Faithful port of active reference STB.logi (lines 13934-14220):
 * cosmos("logi"), streakField(170), glowS(20,4,-40, 50, 0x8f0030),
 * 4 logistical pads/steps:
 * 01 Scope & commit (SOW hologram, stamp, seal, uQuill/copy)
 * 02 Assemble the team (5 biped units beaming down with beams)
 * 03 Build around the clock (globe with continents + 14 city lights + orbiting sStar)
 * 04 Senior sign-off (director on podium, chart, checkmark, 24 confetti boxes)
 */
export function createLogiStage(ctx: StageBuildContext): Stage {
  const { three, scene: parentScene, mats, camera, orbitCtrl } = ctx;
  const group = new three.Group();
  group.visible = false;
  parentScene.add(group);

  const backgroundTexture = bgTex("#0B0E15", "#262B36", three);
  const cosmosLayer: CosmosLayer = createCosmos(three, group, "logi");
  const stars: StreakField = createStreakField(
    three,
    group,
    170,
    [120, 34, 30],
    2.5
  );
  glowS(three, mats, group, [20, 4, -40], 50, 0x8f0030);

  const pad = (x: number, r: number) => {
    const g = new three.Group();
    g.position.x = x;
    group.add(g);
    hexPlinth(three, mats, g, r);
    return g;
  };

  // 01 Scope & commit
  const g1 = pad(X[0], 4.6);
  const sow = texC(
    320,
    420,
    (x, w, h) => {
      x.fillStyle = "#ECE6D6";
      x.fillRect(0, 0, w, h);
      x.fillStyle = "#141624";
      x.font = '400 26px "Russo One", sans-serif';
      x.fillText("STATEMENT", 24, 52);
      x.fillText("OF WORK", 24, 82);
      x.fillStyle = "#EE004E";
      x.fillRect(24, 96, 90, 6);
      x.fillStyle = "rgba(22,22,27,.55)";
      for (let i = 0; i < 9; i++) {
        x.fillRect(24, 124 + i * 24, i % 3 === 2 ? 150 : 260, 8);
      }
      x.font = '400 16px "JetBrains Mono", monospace';
      x.fillStyle = "#141624";
      x.fillText("SCOPE · PRICE · TIMELINE", 24, 350);
      x.strokeStyle = "#141624";
      x.lineWidth = 2;
      x.beginPath();
      x.moveTo(24, 396);
      x.bezierCurveTo(80, 370, 120, 410, 180, 384);
      x.stroke();
    },
    three
  );

  const doc = new three.Group();
  doc.position.set(-0.6, 2.2, 0);
  doc.rotation.x = -0.25;
  g1.add(doc);
  mk(three, mats, doc, rbx(three, 2.5, 3.2, 0.12, 0.04), mats.tm(HX.bone));
  plane(three, doc, 2.3, 3.0, sow, [0, 0, 0.07]);

  const sealTex = texC(
    128,
    128,
    (x) => {
      x.strokeStyle = "#EE004E";
      x.lineWidth = 10;
      x.beginPath();
      x.arc(64, 64, 52, 0, Math.PI * 2);
      x.stroke();
      x.fillStyle = "#EE004E";
      x.font = '400 24px "Russo One", sans-serif';
      x.textAlign = "center";
      x.fillText("PAID", 64, 74);
    },
    three
  );
  const seal = plane(
    three,
    doc,
    1.0,
    1.0,
    sealTex,
    [0.55, -0.8, 0.09],
    [0, 0, -0.3]
  );

  const stamp = new three.Group();
  g1.add(stamp);
  mk(
    three,
    mats,
    stamp,
    rbx(three, 1.0, 0.4, 1.0, 0.08),
    mats.tm(HX.red),
    [0, 0, 0]
  );
  mk(
    three,
    mats,
    stamp,
    Cy(three, 0.12, 0.14, 0.9, 6),
    mats.tm(HX.dark),
    [0, 0.65, 0]
  );
  mk(three, mats, stamp, Ic(three, 0.26, 1), mats.tm(HX.bone), [0, 1.2, 0]);

  const signer: UnitHandle = uQuill(three, mats);
  signer.g.scale.setScalar(0.8);
  signer.g.position.set(2.6, 0, 1.2);
  signer.g.rotation.y = -0.9;
  g1.add(signer.g);

  // 02 Assemble the team
  const g2 = pad(X[1], 5.2);
  const dropBuilders = [
    () => uLancer(three, mats),
    () => uRonin(three, mats),
    () => uForge(three, mats),
    () => uMarshal(three, mats),
    () => uArchitect(three, mats),
  ];

  const drops = dropBuilders.map((build, i) => {
    const U = build();
    U.g.scale.setScalar(0.75);
    const a = (i / 5) * Math.PI * 2 + 0.3;
    U.g.position.set(Math.cos(a) * 2.8, 0, Math.sin(a) * 2.0 + 0.6);
    U.g.rotation.y = Math.atan2(-U.g.position.x, 6 - U.g.position.z) * 0.6;
    g2.add(U.g);

    const bm2 = new three.Mesh(
      Cy(three, 0.55, 0.55, 9, 10),
      new three.MeshBasicMaterial({
        color: HX.red,
        transparent: true,
        opacity: 0,
        blending: three.AdditiveBlending,
        depthWrite: false,
      })
    );
    bm2.position.set(U.g.position.x, 4.5, U.g.position.z);
    g2.add(bm2);
    return { U, b: bm2, i };
  });

  // 03 Build around the clock
  const g3 = new three.Group();
  g3.position.set(X[2], 2, 0);
  group.add(g3);

  const pl = new three.Group();
  g3.add(pl);
  mk(
    three,
    mats,
    pl,
    Ic(three, 3.6, 2),
    mats.tm(0x4a5262),
    null,
    null,
    null,
    false
  );

  let rndSeed = 7;
  const rnd = () => {
    rndSeed = (rndSeed * 16807) % 2147483647;
    return (rndSeed - 1) / 2147483646;
  };

  for (let i = 0; i < 9; i++) {
    const a = rnd() * Math.PI * 2;
    const bAngle = (rnd() - 0.5) * 2.4;
    const v = new three.Vector3(
      Math.cos(a) * Math.cos(bAngle),
      Math.sin(bAngle),
      Math.sin(a) * Math.cos(bAngle)
    ).multiplyScalar(3.48);

    const m = mk(
      three,
      mats,
      pl,
      Ic(three, 0.8 + rnd() * 0.5),
      mats.tm(i % 3 ? 0x6a707c : 0xece6d6),
      [v.x, v.y, v.z],
      null,
      [1, 0.35, 1],
      false
    );
    m.lookAt(0, 0, 0);
  }

  const city: { l: THREE.Sprite; a: number }[] = [];
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    city.push({
      l: glowS(
        three,
        mats,
        pl,
        [Math.cos(a) * 3.65, ((i % 3) - 1) * 1.1, Math.sin(a) * 3.65],
        0.55,
        0xf2b33a
      ),
      a,
    });
  }

  mk(
    three,
    mats,
    g3,
    Tor(three, 5.6, 0.02, 3, 64),
    mats.bm(HX.bone, 0.3),
    [0, 0, 0],
    [Math.PI / 2.2, 0, 0],
    null,
    false
  );

  const ship = sStar(three, mats);
  ship.g.scale.setScalar(0.2);
  g3.add(ship.g);

  // 04 Senior sign-off
  const g4 = pad(X[3], 4.6);
  mk(
    three,
    mats,
    g4,
    rbx(three, 2.2, 1.0, 1.6, 0.12),
    mats.tm(HX.dark),
    [0, 0.5, -0.6]
  );

  const dir: UnitHandle = uMarshal(three, mats);
  dir.g.scale.setScalar(0.85);
  dir.g.position.set(0, 1.0, -0.6);
  g4.add(dir.g);

  const frame = new three.Group();
  frame.position.set(-2.4, 2.6, 0.6);
  frame.rotation.y = 0.5;
  g4.add(frame);
  mk(three, mats, frame, rbx(three, 2.4, 1.5, 0.12, 0.04), mats.tm(HX.dark));
  plane(three, frame, 2.2, 1.3, mats.TX("chart"), [0, 0, 0.07]);

  const chk = new three.Group();
  chk.position.set(2.4, 3.4, 0.6);
  g4.add(chk);
  mk(
    three,
    mats,
    chk,
    Ex(
      three,
      [
        [-0.9, 0.1],
        [-0.55, 0.45],
        [-0.25, 0.12],
        [0.6, 1.0],
        [0.95, 0.65],
        [-0.25, -0.55],
      ],
      0.3
    ),
    mats.tm(HX.red)
  );
  glowS(three, mats, chk, [0, 0.2, 0.3], 3, HX.red);

  const confColors = [HX.red, HX.bone, HX.yel];
  const conf: THREE.Mesh[] = [];
  for (let i = 0; i < 24; i++) {
    conf.push(
      mk(
        three,
        mats,
        g4,
        Bx(three, 0.12, 0.06, 0.03),
        mats.tm(confColors[i % 3]!),
        [0, 0, 0],
        null,
        null,
        false
      )
    );
  }

  const units: UnitHandle[] = [signer, ...drops.map((d) => d.U), dir];

  function setVisible(visible: boolean): void {
    group.visible = visible;
  }

  function update(params: StageUpdateParams): void {
    const { t, dt, p, kk, box, viewportH, reduceMotion } = params;
    cosmosLayer.update(t, reduceMotion);
    stars.update(dt, 1.4, reduceMotion);

    const sc = (t % 2400) / 2400;
    const down =
      sc < 0.18 ? sc / 0.18 : sc < 0.3 ? 1 : Math.max(0, 1 - (sc - 0.3) / 0.3);

    stamp.position.set(0.4, 4.6 - down * 2.0, 0.35);
    (seal.material as THREE.Material & { opacity: number }).opacity =
      sc > 0.18 ? Math.min(1, (sc - 0.18) * 6) : Math.max(0, 1 - sc * 8);

    doc.position.y = 2.2 + Math.sin(t / 900) * 0.08;
    signer.upd(t);

    for (let i = 0; i < drops.length; i++) {
      const d = drops[i]!;
      const ph = (t / 5200 + d.i * 0.12) % 1;
      const u = Math.min(1, ph * 3.2);
      d.U.g.position.y = (1 - back(u)) * 7;
      (d.b.material as THREE.Material & { opacity: number }).opacity =
        ph < 0.32 ? 0.45 * (1 - ph / 0.32) : 0;
      d.U.upd(t);
    }

    const rot = t / 9000;
    pl.rotation.y = rot;
    for (let i = 0; i < city.length; i++) {
      const c = city[i]!;
      c.l.visible = Math.sin(c.a + rot) > 0.15;
    }

    const a = t / 7000;
    ship.g.position.set(
      Math.cos(a) * 5.6,
      Math.sin(a) * 1.2,
      Math.sin(a) * 5.6
    );
    ship.g.rotation.y = -a - Math.PI / 2;
    ship.upd(t);
    if (ship.fl.length > 0) flick(ship.fl, t);

    dir.upd(t);
    chk.rotation.y = Math.sin(t / 900) * 0.5;
    chk.position.y = 3.4 + Math.sin(t / 600) * 0.15;

    for (let i = 0; i < conf.length; i++) {
      const c = conf[i]!;
      const q = (t / 2600 + i / 24) % 1;
      const an = i * 0.9;
      c.position.set(
        Math.cos(an) * (0.6 + q * 2.4) + 2.4,
        4.2 + q * 1.6 - q * q * 5,
        Math.sin(an) * (0.6 + q * 1.2) + 0.6
      );
      c.rotation.set(t / 200 + i, t / 150, 0);
    }

    const f = Math.max(0, Math.min(3, p * 4.2 - 0.6));
    const tx = f * 17;

    orbitCtrl.aim(
      camera,
      tx,
      1.8,
      0,
      0.22,
      0.22,
      1,
      11.5,
      8.5,
      kk,
      box,
      viewportH,
      t,
      reduceMotion
    );
  }

  function dispose(): void {
    stars.dispose();
    cosmosLayer.dispose();
    backgroundTexture.dispose();
    sow.dispose();
    sealTex.dispose();

    group.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    });
    group.clear();
    parentScene.remove(group);
  }

  return {
    key: "logi",
    group,
    backgroundTexture,
    fog: null,
    units,
    setVisible,
    update,
    dispose,
  };
}
