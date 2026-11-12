import type * as THREE from "three";
import { bgTex } from "../world/materials";
import { flick, glowS, textSprite } from "../world/geometry";
import { createCosmos, type CosmosLayer } from "../world/cosmos";
import { createStreakField, type StreakField } from "../world/streakField";
import { mDrone, sMother, sStar, sSub } from "../models/hVehiclesC";
import type { UnitHandle } from "../models/uUnits";
import type { Stage, StageBuildContext, StageUpdateParams } from "./types";

const STAGE_X = [0, 11, 23, 38] as const;
const STAGE_W = [5, 7, 7, 10] as const;

interface StageItem {
  readonly g: THREE.Group;
  readonly fl: THREE.Group[];
  readonly upd: (t: number, opts?: { reduceMotion?: boolean }) => void;
}

/**
 * Faithful port of active reference STB.stages (lines 11848-11901):
 * bgTex("#12151C", "#3A2A30"), cosmos("stages"), streakField(150),
 * glowS([10, 4, -30], 30, 0x8f0030), 4 progression ships (mDrone, sSub, sStar, sMother)
 * with textSprite labels.
 */
export function createStagesStage(ctx: StageBuildContext): Stage {
  const { three, scene: parentScene, mats, camera, orbitCtrl } = ctx;
  const group = new three.Group();
  group.visible = false;
  parentScene.add(group);

  const backgroundTexture = bgTex("#12151C", "#3A2A30", three);
  const cosmosLayer: CosmosLayer = createCosmos(three, group, "stages");
  const stars: StreakField = createStreakField(
    three,
    group,
    150,
    [100, 34, 30],
    2.6
  );
  glowS(three, mats, group, [10, 4, -30], 30, 0x8f0030);

  const specs: readonly [
    () => StageItem & { h: number },
    number,
    number,
    string,
  ][] = [
    [() => mDrone(three, mats), 0.9, 0, "SOLO FOUNDERS"],
    [() => sSub(three, mats), 0.4, 11, "STARTUPS"],
    [() => sStar(three, mats), 0.38, 23, "SMBs"],
    [() => sMother(three, mats), 0.42, 38, "MID-MARKET"],
  ];

  const items: StageItem[] = specs.map(([build, k, x, label]) => {
    const m = build();
    m.g.scale.setScalar(k);
    m.g.position.set(x, 0, 0);
    group.add(m.g);
    const lb = textSprite(three, label, "#FFFFFF", 0.6);
    lb.position.set(x, (m.h || 1.6) * k + 1.6, 0);
    group.add(lb);
    return m;
  });

  const units: UnitHandle[] = items.map((it) => ({
    g: it.g,
    w: 2,
    h: 2,
    upd: it.upd,
  }));

  function setVisible(visible: boolean): void {
    group.visible = visible;
  }

  function update(params: StageUpdateParams): void {
    const { t, dt, p, kk, box, viewportH, reduceMotion } = params;
    cosmosLayer.update(t, reduceMotion);
    stars.update(dt, 1.6, reduceMotion);

    for (let i = 0; i < items.length; i++) {
      const it = items[i]!;
      it.g.position.y = Math.sin(t / 1200 + i) * 0.2;
      it.upd(t, { reduceMotion });
      if (it.fl.length > 0) flick(it.fl, t);
    }

    const gq = Math.max(0, Math.min(3.999, p * 4.15 - 0.05));
    const gi = Math.floor(gq);
    const gf = gq - gi;
    const ge = Math.max(0, (gf - 0.62) / 0.38);
    const f = Math.min(3, gi + ge * ge * (3 - 2 * ge));
    const i0 = Math.floor(f);
    const fr = f - i0;
    const i1 = Math.min(3, i0 + 1);
    const tx = STAGE_X[i0]! + (STAGE_X[i1]! - STAGE_X[i0]!) * fr;
    const ww = STAGE_W[i0]! + (STAGE_W[i1]! - STAGE_W[i0]!) * fr;

    orbitCtrl.aim(
      camera,
      tx,
      0.8,
      0,
      0.3,
      0.18,
      1,
      ww * 1.5,
      ww * 0.9,
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
    key: "stages",
    group,
    backgroundTexture,
    fog: null,
    units,
    setVisible,
    update,
    dispose,
  };
}
