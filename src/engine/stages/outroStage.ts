import { bgTex } from "../world/materials";
import { flick, glowS } from "../world/geometry";
import { createCosmos, type CosmosLayer } from "../world/cosmos";
import { createStreakField, type StreakField } from "../world/streakField";
import type { VehicleHandle } from "../models/hVehiclesA";
import { H3 } from "../models/hVehiclesC";
import type { UnitHandle } from "../models/uUnits";
import type { Stage, StageBuildContext, StageUpdateParams } from "./types";

const OUTRO_HERO_KEYS = [
  "brand",
  "web",
  "uiux",
  "decks",
  "copy",
  "motion",
  "3d",
  "fab",
  "ai",
] as const;

/**
 * Faithful port of active reference STB.outro (lines 11902-11940):
 * bgTex("#14171E", "#8F0030"), cosmos("outro"), streakField(220),
 * glowS([0, 0, -30], 36, 0xece6d6), and all 9 orbiting H3 hero vehicles.
 */
export function createOutroStage(ctx: StageBuildContext): Stage {
  const { three, scene: parentScene, mats, camera, orbitCtrl } = ctx;
  const group = new three.Group();
  group.visible = false;
  parentScene.add(group);

  const backgroundTexture = bgTex("#14171E", "#8F0030", three);
  const cosmosLayer: CosmosLayer = createCosmos(three, group, "outro");
  const stars: StreakField = createStreakField(
    three,
    group,
    220,
    [80, 40, 30],
    5
  );
  glowS(three, mats, group, [0, 0, -30], 36, 0xece6d6);

  const heroes: VehicleHandle[] = OUTRO_HERO_KEYS.map((k) => {
    const h = H3[k]!(three, mats);
    h.g.scale.setScalar(0.55);
    group.add(h.g);
    return h;
  });

  const units: UnitHandle[] = heroes.map((h) => ({
    g: h.g,
    w: h.w,
    h: h.h,
    upd: h.upd,
  }));

  function setVisible(visible: boolean): void {
    group.visible = visible;
  }

  function update(params: StageUpdateParams): void {
    const { t, dt, kk, box, viewportH, reduceMotion } = params;
    cosmosLayer.update(t, reduceMotion);
    stars.update(dt, 4, reduceMotion);

    for (let i = 0; i < heroes.length; i++) {
      const h = heroes[i]!;
      const a = (i / 9) * Math.PI * 2 + t / 6000;
      h.g.position.set(
        Math.cos(a) * 7,
        Math.sin(a) * 3.2 + 0.5,
        Math.sin(a) * 2 - 2
      );
      h.upd(t, { reduceMotion });
      if (h.fl.length > 0) flick(h.fl, t);
    }

    orbitCtrl.aim(
      camera,
      0,
      0.5,
      0,
      0.1,
      0.1,
      1,
      18,
      9,
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
    key: "outro",
    group,
    backgroundTexture,
    fog: null,
    units,
    setVisible,
    update,
    dispose,
  };
}
