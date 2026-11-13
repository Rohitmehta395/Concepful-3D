import { HX, bgTex } from "../world/materials";
import { Bx, Co, Cy, Ic, Tor, holoEdges, mk, rbx } from "../world/geometry";
import { createCosmos, type CosmosLayer } from "../world/cosmos";
import { createStreakField, type StreakField } from "../world/streakField";
import { biped, type BipedHandle, type UnitHandle } from "../models/uUnits";
import type { Stage, StageBuildContext, StageUpdateParams } from "./types";

const SEATS: readonly [number, number, number, number][] = [
  [-4.3, -0.4, HX.blu, 0],
  [-3.0, 2.6, HX.melon, 1],
  [0, 3.2, HX.yel, 0],
  [3.0, 2.6, HX.melon, 0],
  [4.3, -0.4, HX.blu, 1],
  [0, -3.0, HX.teal, 0],
];

/**
 * Faithful port of active reference STB.rules (lines 14284-14439):
 * cosmos("rules"), streakField(90) at z=-20, ship deck + bulkheads + windows,
 * holo table + blueprintTex + scan beam + holo icosahedron + pulsing ring,
 * and 6 seated biped crew members leaning over the SOW blueprint.
 */
export function createRulesStage(ctx: StageBuildContext): Stage {
  const { three, scene: parentScene, mats, camera, orbitCtrl } = ctx;
  const group = new three.Group();
  group.visible = false;
  parentScene.add(group);

  const backgroundTexture = bgTex("#10141B", "#2E3442", three);
  const cosmosLayer: CosmosLayer = createCosmos(three, group, "rules");
  const stars: StreakField = createStreakField(
    three,
    group,
    90,
    [70, 30, 30],
    1.6
  );
  stars.mesh.position.z = -20;

  const room = new three.Group();
  group.add(room);

  // Deck, grid, melon trim, back wall with windows, side bulkheads, roof beams
  mk(
    three,
    mats,
    room,
    Bx(three, 22, 0.4, 15),
    mats.tm(0x22253f),
    [0, -0.2, 0],
    null,
    null,
    false
  );
  const gd = new three.GridHelper(
    22,
    22,
    mats.brand(0x3a3f6e),
    mats.brand(0x2a2e52)
  );
  gd.position.y = 0.01;
  room.add(gd);

  mk(
    three,
    mats,
    room,
    Bx(three, 22, 0.06, 0.25),
    mats.bm(HX.melon),
    [0, 0.03, -6.2],
    null,
    null,
    false
  );
  for (let i = 0; i <= 6; i++) {
    const x = -11 + (i * 22) / 6;
    mk(three, mats, room, Bx(three, 0.55, 8, 0.6), mats.tm(0x2e3256), [
      x,
      4,
      -7,
    ]);
  }
  mk(
    three,
    mats,
    room,
    Bx(three, 22.6, 0.8, 0.9),
    mats.tm(0x2e3256),
    [0, 8.2, -7]
  );
  mk(
    three,
    mats,
    room,
    Bx(three, 22.6, 1.2, 1.1),
    mats.tm(0x262a4e),
    [0, 0.6, -6.8]
  );

  const glass = new three.Mesh(
    new three.PlaneGeometry(22, 8),
    new three.MeshBasicMaterial({
      color: 0xb8c2ff,
      transparent: true,
      opacity: 0.05,
      depthWrite: false,
    })
  );
  glass.position.set(0, 4, -7.05);
  room.add(glass);

  [-1, 1].forEach((sd) => {
    mk(
      three,
      mats,
      room,
      Bx(three, 0.6, 8.6, 15),
      mats.tm(0x262a4e),
      [sd * 11.3, 4.1, 0],
      null,
      null,
      false
    );
  });
  for (let z = -5; z <= 3; z += 4) {
    mk(
      three,
      mats,
      room,
      Bx(three, 22.6, 0.35, 0.5),
      mats.tm(0x2a2e52),
      [0, 8.4, z],
      null,
      null,
      false
    );
  }

  // Holo table
  const table = new three.Group();
  room.add(table);
  mk(
    three,
    mats,
    table,
    Cy(three, 1.0, 1.3, 1.1, 8),
    mats.tm(HX.gun),
    [0, 0.55, 0]
  );
  mk(
    three,
    mats,
    table,
    rbx(three, 6.4, 0.28, 4.0, 0.1),
    mats.tm(0x1c1e36),
    [0, 1.24, 0]
  );
  mk(
    three,
    mats,
    table,
    Bx(three, 6.5, 0.06, 4.1),
    mats.bm(HX.melon),
    [0, 1.1, 0],
    null,
    null,
    false
  );
  const bp = new three.Mesh(
    new three.PlaneGeometry(6, 3.75),
    new three.MeshBasicMaterial({ map: mats.TX("bp") })
  );
  bp.rotation.x = -Math.PI / 2;
  bp.position.y = 1.39;
  table.add(bp);

  const scanMat = new three.MeshBasicMaterial({
    color: 0xb8c2ff,
    transparent: true,
    opacity: 0.35,
    blending: three.AdditiveBlending,
    depthWrite: false,
  });
  const scan = new three.Mesh(new three.PlaneGeometry(6, 0.18), scanMat);
  scan.rotation.x = -Math.PI / 2;
  scan.position.y = 1.4;
  table.add(scan);

  const holo = new three.Group();
  holo.position.set(0.2, 2.1, 0);
  table.add(holo);
  holoEdges(three, holo, Ic(three, 0.38, 1));
  const hb = new three.Mesh(
    Co(three, 0.9, 0.9, 8),
    new three.MeshBasicMaterial({
      color: 0xb8c2ff,
      transparent: true,
      opacity: 0.07,
      depthWrite: false,
    })
  );
  hb.position.y = -0.3;
  hb.rotation.x = Math.PI;
  holo.add(hb);

  const ringMat = mats.bm(HX.melon, 0.9, true);
  const ring = mk(
    three,
    mats,
    table,
    Tor(three, 0.55, 0.03, 3, 32),
    ringMat,
    [-0.7, 1.42, 0.0],
    [Math.PI / 2, 0, 0],
    null,
    false
  );

  // Crew leaning in, heads down
  const crew: { b: BipedHandle; i: number }[] = SEATS.map(
    ([x, z, acc, dome], i) => {
      const b = biped(three, mats, {
        acc,
        head: dome ? "dome" : undefined,
        torso: [0.95, 0.95, 0.65],
        stance: 0.14,
      });
      b.g.position.set(x, 0, z);
      room.add(b.g);
      b.g.rotation.y = Math.atan2(-x, -z);
      b.head.rotation.x = 0.5;
      b.arms[0]!.rotation.set(-0.75, 0, -0.12);
      b.arms[1]!.rotation.set(-0.75, 0, 0.12);
      b.g.rotation.x = 0;
      return { b, i };
    }
  );
  const ptr = crew[2]!.b;
  ptr.arms[1]!.rotation.set(-1.25, 0, 0.05);

  const units: UnitHandle[] = crew.map(({ b }) => ({
    g: b.g,
    w: 1,
    h: 2,
    upd: () => {},
  }));

  function setVisible(visible: boolean): void {
    group.visible = visible;
  }

  function update(params: StageUpdateParams): void {
    const { t, dt, kk, box, viewportH, reduceMotion } = params;
    stars.update(dt, 0.6, reduceMotion);
    cosmosLayer.update(t, reduceMotion);

    const q = (t / 3200) % 1;
    scan.position.z = -1.85 + q * 3.7;
    scanMat.opacity = 0.35 * (1 - Math.abs(q - 0.5) * 1.4);
    holo.rotation.y = t / 1600;
    ring.scale.setScalar(1 + 0.15 * Math.sin(t / 300));
    ringMat.opacity = 0.6 + 0.3 * Math.sin(t / 300);

    for (let idx = 0; idx < crew.length; idx++) {
      const item = crew[idx]!;
      item.b.head.rotation.x = 0.5 + Math.sin(t / 900 + item.i * 1.7) * 0.06;
      item.b.head.rotation.y = Math.sin(t / 2300 + item.i) * 0.18;
    }
    ptr.arms[1]!.rotation.x = -1.25 + Math.sin(t / 500) * 0.08;

    orbitCtrl.aim(
      camera,
      0,
      1.6,
      0,
      0.18,
      0.72,
      1,
      13,
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
    parentScene.remove(group);
  }

  return {
    key: "rules",
    group,
    backgroundTexture,
    fog: null,
    units,
    setVisible,
    update,
    dispose,
  };
}
