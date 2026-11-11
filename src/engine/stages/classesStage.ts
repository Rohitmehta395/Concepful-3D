import type * as THREE from "three";
import type { Box } from "../layout";
import type { OrbitController } from "../camera/orbitController";
import { bgTex, type MaterialRegistry } from "../world/materials";
import { hexPlinth, textSprite } from "../world/geometry";
import { createCosmos, type CosmosLayer } from "../world/cosmos";
import { createStreakField, type StreakField } from "../world/streakField";
import { uArchitect, uForge, type UnitHandle } from "../models/uUnits";

export interface ClassesStage {
  readonly group: THREE.Group;
  readonly backgroundTexture: THREE.CanvasTexture;
  readonly units: UnitHandle[];
  setVisible(visible: boolean): void;
  update(
    t: number,
    dt: number,
    p: number,
    kk: number,
    orbitCtrl: OrbitController,
    camera: THREE.PerspectiveCamera,
    box: Box,
    viewportH: number,
    reduceMotion: boolean
  ): void;
  dispose(): void;
}

interface PlinthSpec {
  ids: string[];
  label: string;
}

const PLINTH_SPECS: PlinthSpec[] = [
  { ids: ["uiux", "web", "3d"], label: "PRODUCT & INTERFACE" },
  { ids: ["dir", "brand", "illus"], label: "BRAND & STORY" },
  { ids: ["gtm", "decks", "motion"], label: "CONTENT & CAMPAIGNS" },
];

/**
 * Faithful port of reference STB.classes (lines 11660-11708):
 * 3 hex plinths, cosmos("classes"), streakField(110), category textSprites,
 * and the first 2 U3 biped units (uArchitect, uForge). Remaining 7 U3 units
 * are deferred to Part 4.5.
 */
export function createClassesStage(
  three: typeof THREE,
  parentScene: THREE.Scene,
  mats: MaterialRegistry
): ClassesStage {
  const group = new three.Group();
  group.visible = false;
  parentScene.add(group);

  const backgroundTexture = bgTex("#12161E", "#2E3442", three);
  const cosmosLayer: CosmosLayer = createCosmos(three, group, "classes");
  const stars: StreakField = createStreakField(
    three,
    group,
    110,
    [80, 30, 30],
    2
  );

  const plinthGroups: THREE.Group[] = [];
  const units: UnitHandle[] = [];

  PLINTH_SPECS.forEach((spec, i) => {
    const pg = new three.Group();
    pg.position.set((i - 1) * 10, 0, 0);
    group.add(pg);
    hexPlinth(three, mats, pg, 4.2);

    spec.ids.forEach((id, j) => {
      let u: UnitHandle | null = null;
      if (id === "uiux") u = uArchitect(three, mats);
      else if (id === "web") u = uForge(three, mats);

      if (u) {
        u.g.scale.setScalar(0.85);
        u.g.position.set((j - 1) * 2.5, 0, j === 1 ? -0.6 : 0.5);
        pg.add(u.g);
        units.push(u);
      }
    });

    const lb = textSprite(three, spec.label, "#FFFFFF", 0.55);
    lb.position.set(0, 5.4, 0);
    pg.add(lb);

    plinthGroups.push(pg);
  });

  function setVisible(visible: boolean): void {
    group.visible = visible;
  }

  function update(
    t: number,
    dt: number,
    p: number,
    kk: number,
    orbitCtrl: OrbitController,
    camera: THREE.PerspectiveCamera,
    box: Box,
    viewportH: number,
    reduceMotion: boolean
  ): void {
    stars.update(dt, 1, reduceMotion);

    for (let i = 0; i < plinthGroups.length; i++) {
      const pg = plinthGroups[i];
      if (pg) {
        pg.position.y = Math.sin(t / 1400 + i * 2) * 0.18;
      }
    }

    for (let i = 0; i < units.length; i++) {
      units[i]?.upd(t);
    }

    const tx = (Math.max(0, Math.min(2, p * 3.2 - 0.6)) - 1) * 10;
    orbitCtrl.aim(
      camera,
      tx,
      2.2,
      0,
      0.25,
      0.22,
      1,
      10,
      6.5,
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
    group,
    backgroundTexture,
    units,
    setVisible,
    update,
    dispose,
  };
}
