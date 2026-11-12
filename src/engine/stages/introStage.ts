import type * as THREE from "three";
import { bgTex } from "../world/materials";
import { flick, glowS, planet3 } from "../world/geometry";
import { createCosmos, type CosmosLayer } from "../world/cosmos";
import { createStreakField, type StreakField } from "../world/streakField";
import {
  uArchitect,
  uForge,
  uKraken,
  uMarshal,
  uNexus,
  uRonin,
  type UnitHandle,
} from "../models/uUnits";
import type { VehicleHandle } from "../models/hVehiclesA";
import { H3, mJet, sMother } from "../models/hVehiclesC";
import type { Stage, StageBuildContext, StageUpdateParams } from "./types";

const INTRO_CREW_BUILDERS = [
  uKraken,
  uRonin,
  uForge,
  uMarshal,
  uNexus,
  uArchitect,
] as const;

const INTRO_HERO_KEYS = ["brand", "decks", "ai"] as const;

/**
 * Faithful port of active reference STB.intro (lines 11588-11659):
 * bgTex("#0F1218", "#2E3442"), cosmos("intro"), streakField(170),
 * 2 glowS, planet3(9, [16, -11, -32], 0x6e7e92, true),
 * sMother + 6 crew U3 units + 4 orbiting mJets + 3 H3 hero vehicles.
 */
export function createIntroStage(ctx: StageBuildContext): Stage {
  const { three, scene: parentScene, mats, camera, orbitCtrl } = ctx;
  const group = new three.Group();
  group.visible = false;
  parentScene.add(group);

  const backgroundTexture = bgTex("#0F1218", "#2E3442", three);
  const cosmosLayer: CosmosLayer = createCosmos(three, group, "intro");
  const stars: StreakField = createStreakField(
    three,
    group,
    170,
    [80, 34, 30],
    3.2
  );
  glowS(three, mats, group, [-12, 6, -30], 30, 0x8f0030);
  glowS(three, mats, group, [14, -6, -34], 26, 0x4a5262);
  const planet: THREE.Group = planet3(
    three,
    mats,
    group,
    9,
    [16, -11, -32],
    0x6e7e92,
    true
  );

  const mother = sMother(three, mats);
  mother.g.scale.setScalar(0.85);
  group.add(mother.g);
  mother.g.position.set(-1, 0, -5);
  mother.g.rotation.y = -0.3;

  const crew: UnitHandle[] = INTRO_CREW_BUILDERS.map((build, i) => {
    const u = build(three, mats);
    u.g.scale.setScalar(0.24);
    u.g.position.set(-3 + i * 1.4, 0, (i % 2) * 1.1 - 0.5);
    mother.crew.add(u.g);
    return u;
  });

  const jets: VehicleHandle[] = [0, 1, 2, 3].map(() => {
    const j = mJet(three, mats);
    j.g.scale.setScalar(0.6);
    group.add(j.g);
    return j;
  });

  const heroes: VehicleHandle[] = INTRO_HERO_KEYS.map((k) => {
    const h = H3[k]!(three, mats);
    h.g.scale.setScalar(0.7);
    group.add(h.g);
    return h;
  });

  const units: UnitHandle[] = [
    ...crew,
    ...jets.map((j) => ({ g: j.g, w: j.w, h: j.h, upd: j.upd })),
    ...heroes.map((h) => ({ g: h.g, w: h.w, h: h.h, upd: h.upd })),
  ];

  function setVisible(visible: boolean): void {
    group.visible = visible;
  }

  function update(params: StageUpdateParams): void {
    const { t, dt, p, kk, box, viewportH, reduceMotion } = params;
    cosmosLayer.update(t, reduceMotion);
    stars.update(dt, 1.8, reduceMotion);
    planet.rotation.y = t / 30000;
    mother.upd(t);
    flick(mother.fl, t);
    mother.g.position.y = Math.sin(t / 1200) * 0.2;

    for (let i = 0; i < crew.length; i++) {
      crew[i]!.upd(t);
    }

    for (let i = 0; i < jets.length; i++) {
      const j = jets[i]!;
      const a = t / 2600 + i * 1.5;
      j.g.position.set(
        Math.cos(a) * 10 - 1,
        3.5 + Math.sin(a * 1.3) * 1.2,
        Math.sin(a) * 4 - 4
      );
      j.g.rotation.y = -a - Math.PI / 2;
      flick(j.fl, t);
    }

    for (let i = 0; i < heroes.length; i++) {
      const h = heroes[i]!;
      const q = (t / 7500 + i / 3) % 1;
      h.g.position.set(
        -15 + q * 30,
        -2.6 + i * 1.7 + Math.sin(t / 600 + i) * 0.2,
        3.5 + i * 0.5
      );
      h.upd(t, { reduceMotion });
      if (h.fl.length > 0) flick(h.fl, t);
    }

    orbitCtrl.aim(
      camera,
      0,
      0.6,
      -4,
      0.35 - p * 0.5,
      0.18 + p * 0.12,
      1,
      17,
      8,
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
    key: "intro",
    group,
    backgroundTexture,
    fog: null,
    units,
    setVisible,
    update,
    dispose,
  };
}
