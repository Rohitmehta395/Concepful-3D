import type * as THREE from "three";
import type { Stage, StageBuildContext, StageUpdateParams } from "../types";
import { DEFAULT_BUILD_STATE, type BuildState } from "../../buildState";
import { bgTex, HX } from "../../world/materials";
import { createPlanet, type Planet } from "../../world/planet";
import { createStreakField, type StreakField } from "../../world/streakField";
import type { Clouds } from "../../world/clouds";
import { createBubbles, type Bubbles } from "../../world/bubbles";
import type { CosmosLayer } from "../../world/cosmos";
import { createRaidCosmos } from "./raidCosmos";
import { Ic, flick, mk } from "../../world/geometry";
import {
  mJet,
  sMother,
  sSub,
  sStar,
  type MothershipHandle,
  type FlagshipHandle,
} from "../../models/hVehiclesC";
import type { VehicleHandle } from "../../models/hVehiclesA";
import { sSky, type CarrierHandle } from "../../models/sCarriers";
import { U3, type UnitHandle } from "../../models/uUnits";
import {
  sCarrier,
  sTitan,
  type CarrierShipHandle,
  type TitanShipHandle,
} from "./raidShips";

export type RaidShipHandle =
  | CarrierHandle
  | FlagshipHandle
  | MothershipHandle
  | CarrierShipHandle
  | TitanShipHandle;

export const RBG_COLORS = {
  sea: { top: "#3A4A55", bot: "#12181F" },
  sky: { top: "#8692A2", bot: "#4C5664" },
  space: { top: "#141A26", bot: "#3A4556" },
  deep: { top: "#0B0E15", bot: "#1C1526" },
} as const;

export const SHIPS_CONFIG = {
  local: { bg: "sea" as const },
  regional: { bg: "sky" as const },
  national: { bg: "space" as const },
  global: { bg: "deep" as const },
} as const;

/**
 * Derives reach class from the active buff list.
 * Source: reference line 14757.
 */
export function shipFor(
  buffs: readonly string[] = []
): "local" | "regional" | "national" | "global" {
  const n = buffs.length;
  return n === 0
    ? "local"
    : n <= 2
      ? "regional"
      : n <= 4
        ? "national"
        : "global";
}

/**
 * Back easing function for ship arrival.
 * Source: reference line 5345.
 */
export function backEase(u: number): number {
  const c1 = 1.5;
  const c3 = c1 + 1; // 2.5
  return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2);
}

/**
 * Raid 3D stage for the COMBINE tier (Flagship, escorts, crew deck, dynamic environments).
 * Source: reference lines 10382-10445, 14545-14660, 14760-14775.
 */
export function createRaidStage(ctx: StageBuildContext): Stage {
  const {
    three,
    scene: parentScene,
    mats,
    camera,
    orbitCtrl,
    getBuildState,
  } = ctx;

  const group = new three.Group();
  group.visible = false;
  parentScene.add(group);

  // Background textures cache
  const bgCache = new Map<string, THREE.CanvasTexture>();
  function getBg(key: keyof typeof RBG_COLORS): THREE.CanvasTexture {
    let tex = bgCache.get(key);
    if (!tex) {
      const cfg = RBG_COLORS[key];
      tex = bgTex(cfg.top, cfg.bot, three);
      bgCache.set(key, tex);
    }
    return tex;
  }

  let activeBg = getBg("sea");
  const fog = new three.Fog(0x1e2244, 10, 60);
  let activeFog: THREE.Fog | null = null;

  // Environment objects
  const stars: StreakField = createStreakField(
    three,
    group,
    140,
    [70, 34, 30],
    2.5
  );
  const planet: Planet = createPlanet(
    three,
    group,
    10,
    [14, -14, -30],
    0x6e7e92,
    true
  );
  // Clouds matching reference lines 10394-10413 (tm(HX.cloud), mk(..., false))
  const cloudsRoot = new three.Group();
  group.add(cloudsRoot);
  const cloudMat = mats.tm(HX.cloud);
  const cloudGroups: THREE.Group[] = [];
  for (let i = 0; i < 9; i++) {
    const c = new three.Group();
    for (let k = 0; k < 4; k++) {
      mk(
        three,
        mats,
        c,
        Ic(three, 0.8 + Math.random() * 0.8),
        cloudMat,
        [k * 1.1 - 1.6, Math.random() * 0.6, Math.random() * 0.8],
        null,
        [1, 0.6, 1],
        false
      );
    }
    c.position.set(
      -30 + i * 7,
      -6 + Math.random() * 12,
      -6 - Math.random() * 14
    );
    cloudsRoot.add(c);
    cloudGroups.push(c);
  }
  const clouds: Clouds = {
    group: cloudsRoot,
    update: (dt: number, reduceMotion = false) => {
      if (reduceMotion) return;
      for (const c of cloudGroups) {
        c.position.x -= dt * 0.004;
        if (c.position.x < -32) {
          c.position.x = 32;
        }
      }
    },
    dispose: () => {
      group.remove(cloudsRoot);
      for (const c of cloudGroups) {
        c.traverse((o) => {
          const m = o as THREE.Mesh;
          if (m.geometry) m.geometry.dispose();
        });
      }
    },
  };
  const bubbles: Bubbles = createBubbles(three, group);
  const cosmos: CosmosLayer = createRaidCosmos(three, group);

  // Escort jets (6 instances of mJet at scale 0.6)
  const esc: VehicleHandle[] = [];
  for (let i = 0; i < 6; i++) {
    const j = mJet(three, mats);
    j.g.scale.setScalar(0.6);
    j.g.visible = false;
    group.add(j.g);
    esc.push(j);
  }

  // Ships cache
  const shipsCache = new Map<string, RaidShipHandle>();
  function getOrCreateShip(
    reachKey: "local" | "regional" | "national" | "global"
  ): RaidShipHandle {
    let ship = shipsCache.get(reachKey);
    if (!ship) {
      if (reachKey === "local") {
        ship = sSub(three, mats);
      } else if (reachKey === "regional") {
        ship = sSky(three, mats);
      } else if (reachKey === "national") {
        ship = sTitan(three, mats);
      } else {
        ship = sCarrier(three, mats);
      }
      shipsCache.set(reachKey, ship);
    }
    return ship;
  }

  let currentReach: "local" | "regional" | "national" | "global" | null = null;
  let currentShip: RaidShipHandle | null = null;
  let shipT0: number | null = null;
  let lastCrewSig: string | null = null;
  let crewHandles: UnitHandle[] = [];

  function setReach(
    targetReach: "local" | "regional" | "national" | "global",
    t: number,
    reduceMotion: boolean
  ): void {
    if (currentReach === targetReach && currentShip) return;

    if (currentShip) {
      group.remove(currentShip.g);
    }

    const nextShip = getOrCreateShip(targetReach);
    currentShip = nextShip;
    group.add(currentShip.g);

    if (currentReach !== null && !reduceMotion) {
      shipT0 = t;
    } else {
      shipT0 = -1;
    }

    currentReach = targetReach;
    lastCrewSig = null;
  }

  // Initialize with local reach
  setReach("local", 0, true);

  function setVisible(visible: boolean): void {
    group.visible = visible;
    if (visible) {
      parentScene.background = activeBg;
      parentScene.fog = activeFog;
    }
  }

  function update(params: StageUpdateParams): void {
    const { t, dt, kk, box, viewportH, reduceMotion } = params;
    const bState = (getBuildState
      ? getBuildState()
      : DEFAULT_BUILD_STATE) as unknown as Partial<BuildState>;
    const buffs = (bState.buffs || []) as readonly string[];
    const targetReach = shipFor(buffs);

    if (currentReach !== targetReach || !currentShip) {
      setReach(targetReach, t, reduceMotion);
    }

    const ship = currentShip!;
    const reachKey = currentReach || "local";
    const bgKey = SHIPS_CONFIG[reachKey].bg;
    activeBg = getBg(bgKey);
    parentScene.background = activeBg;

    if (bgKey === "sea") {
      const dd = camera.position.length();
      fog.near = dd * 0.9;
      fog.far = dd * 3.2;
      activeFog = fog;
    } else {
      activeFog = null;
    }
    parentScene.fog = activeFog;

    // Environmental elements
    clouds.group.visible = bgKey === "sky";
    clouds.update(dt, reduceMotion);

    bubbles.points.visible = bgKey === "sea";
    bubbles.update(dt, reduceMotion);

    const showSpace = bgKey === "space" || bgKey === "deep";
    planet.group.visible = showSpace;
    cosmos.group.visible = showSpace;
    planet.group.scale.setScalar(bgKey === "deep" ? 1.4 : 1);
    planet.update(t);
    cosmos.update(t, reduceMotion);

    stars.mesh.visible = bgKey !== "sea";
    stars.update(dt, bgKey === "sky" ? 1.8 : 1.2, reduceMotion);

    // Crew deck (on sCarrier / sMother when global reach)
    if ("crew" in ship && ship.crew) {
      const mCarrier = ship as CarrierShipHandle;
      const distinctUnits = new Set<string>();
      const objRosters = [
        ["gtm", "decks", "copy", "motion", "illus"],
        ["dir", "brand", "naming", "uiux", "illus"],
        ["pos", "research", "copy"],
        ["web", "uiux", "motion"],
      ];
      for (const r of objRosters) {
        for (const u of r) distinctUnits.add(u);
      }
      distinctUnits.add("pm");
      distinctUnits.add("ws");

      const companionBuffs = ["3d", "fab", "hw", "cmd", "intel"];
      for (const b of companionBuffs) {
        if (buffs.includes(b)) {
          distinctUnits.add(b);
        }
      }

      const allUnits = Array.from(distinctUnits);
      const sig = allUnits.join(",");
      if (lastCrewSig !== sig) {
        mCarrier.crew.clear();
        crewHandles = [];
        const us = allUnits.slice(0, 12);
        for (let i = 0; i < us.length; i++) {
          const id = us[i]!;
          const builder = U3[id];
          if (builder) {
            const uObj = builder(three, mats);
            uObj.g.scale.setScalar(0.28);
            uObj.g.position.set(
              -3 + i * (9 / Math.max(1, us.length)),
              0,
              (i % 2) * 1.1 - 0.5
            );
            mCarrier.crew.add(uObj.g);
            crewHandles.push(uObj);
          }
        }
        lastCrewSig = sig;
      }

      for (let i = 0; i < crewHandles.length; i++) {
        crewHandles[i]?.upd?.(t);
      }
    }

    // Ship arrival and idle animation
    const u =
      reduceMotion || shipT0 === null || shipT0 < 0
        ? 1
        : Math.max(0, Math.min(1, (t - shipT0) / 650));
    const e = backEase(u);

    ship.g.position.set(
      (1 - e) * -30,
      reduceMotion ? 0 : Math.sin(t / 1100) * 0.2,
      0
    );
    ship.g.rotation.z = reduceMotion ? 0 : Math.sin(t / 1600) * 0.02;
    if ("titan" in ship && ship.titan) {
      ship.upd(t, { shipT0: shipT0 && shipT0 >= 0 ? shipT0 : 0, reduceMotion });
    } else {
      ship.upd(t);
    }

    const hasRush = buffs.includes("rush");
    if (ship.fl && ship.fl.length > 0) {
      flick(ship.fl, t, hasRush ? 0.3 : 0.15);
    }

    // Escort jets
    const ne = { local: 0, regional: 2, national: 3, global: 6 }[reachKey];
    for (let i = 0; i < esc.length; i++) {
      const j = esc[i]!;
      const isVisible = i < ne;
      j.g.visible = isVisible;
      if (isVisible) {
        const a = t / 2600 + i * 1.05;
        j.g.position.set(
          Math.cos(a) * ship.len * 0.62,
          ship.h * 0.6 + Math.sin(a * 1.3) * 0.8,
          Math.sin(a) * 3
        );
        j.g.rotation.y = -a - Math.PI / 2;
        j.upd(t, { reduceMotion });
        if (j.fl.length > 0) {
          flick(j.fl, t);
        }
      }
    }

    // Camera aim & framing
    const fitL = Math.max(ship.len * 0.6 + 15.6 * 0.4, ship.len * 1.22);
    const dx = 0.28 + Math.sin(t / 6000) * 0.1;
    orbitCtrl.aim(
      camera,
      0,
      0.4,
      0,
      dx,
      0.22,
      1,
      fitL * 1.1,
      ship.h * 1.6,
      kk,
      box,
      viewportH,
      t,
      reduceMotion
    );

    planet.group.position.set(
      14 - orbitCtrl.drag.yaw * 6,
      -14 + orbitCtrl.drag.pitch * 4,
      -30
    );
    orbitCtrl.bgShift(parentScene);

    if (
      process.env.NEXT_PUBLIC_E2E === "1" &&
      typeof window !== "undefined" &&
      (window as unknown as { __RAID_HIDE_ACTORS__?: boolean })
        .__RAID_HIDE_ACTORS__
    ) {
      ship.g.visible = false;
      for (let i = 0; i < esc.length; i++) {
        esc[i]!.g.visible = false;
      }
    } else {
      ship.g.visible = true;
    }
  }

  function dispose(): void {
    stars.dispose();
    planet.dispose();
    clouds.dispose();
    bubbles.dispose();
    cosmos.dispose();

    for (const tex of bgCache.values()) {
      tex.dispose();
    }
    bgCache.clear();

    for (const j of esc) {
      group.remove(j.g);
      j.g.traverse((c: THREE.Object3D) => {
        const renderable = c as unknown as {
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

    for (const s of shipsCache.values()) {
      group.remove(s.g);
      s.g.traverse((c) => {
        const renderable = c as unknown as {
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
    shipsCache.clear();

    for (const u of crewHandles) {
      u.g.traverse((c) => {
        const renderable = c as unknown as {
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
    crewHandles = [];

    while (group.children.length > 0) {
      group.remove(group.children[0]!);
    }
    parentScene.remove(group);
  }

  function triggerEntry(t: number, reduceMotion: boolean): void {
    shipT0 = reduceMotion ? -1 : t;
  }

  return {
    key: "raid",
    group,
    get backgroundTexture() {
      return activeBg;
    },
    get fog() {
      return activeFog;
    },
    setVisible,
    update,
    dispose,
    triggerEntry,
  } as Stage & { triggerEntry: (t: number, reduceMotion: boolean) => void };
}

/**
 * Model bench renderer for E2E verification of raid models.
 * Renders an isolated model in an 800x800 bench scene.
 */
export function renderRaidModelBench(
  ctx: StageBuildContext,
  model: string,
  yawDeg: number,
  t: number
): void {
  const { three, mats } = ctx;
  const sc = new three.Scene();
  sc.background = new three.Color(0x12161e);
  sc.add(new three.AmbientLight(0xa9acda, 0.6));
  const d1 = new three.DirectionalLight(0xffffff, 0.62);
  d1.position.set(-4, 8, 10);
  sc.add(d1);
  const d2 = new three.DirectionalLight(0xff7fa6, 0.22);
  d2.position.set(6, -2, -6);
  sc.add(d2);

  const cam = new three.PerspectiveCamera(30, 1, 0.1, 600);
  cam.position.set(0, 2.5, 11);
  cam.lookAt(0, 2.0, 0);

  let obj: THREE.Object3D;
  if (model === "sSub") {
    const s = sSub(three, mats);
    s.upd(t);
    if (s.fl && s.fl.length > 0) flick(s.fl, t);
    obj = s.g;
  } else if (model === "sSky") {
    const s = sSky(three, mats);
    s.upd(t);
    if (s.fl && s.fl.length > 0) flick(s.fl, t);
    obj = s.g;
  } else if (model === "sStar") {
    const s = sStar(three, mats);
    s.upd(t);
    if (s.fl && s.fl.length > 0) flick(s.fl, t);
    obj = s.g;
  } else if (model === "sMother") {
    const s = sMother(three, mats);
    s.upd(t);
    if (s.fl && s.fl.length > 0) flick(s.fl, t);
    obj = s.g;
  } else if (model === "sCarrier") {
    const s = sCarrier(three, mats);
    s.upd(t);
    if (s.fl && s.fl.length > 0) flick(s.fl, t);
    obj = s.g;
  } else if (model === "sTitan") {
    const s = sTitan(three, mats);
    s.upd(t, { shipT0: 0, reduceMotion: true });
    if (s.fl && s.fl.length > 0) flick(s.fl, t);
    obj = s.g;
  } else if (model === "mJet") {
    const j = mJet(three, mats);
    j.upd(t, { reduceMotion: true });
    if (j.fl && j.fl.length > 0) flick(j.fl, t);
    obj = j.g;
  } else if (model === "uPrism") {
    const u = U3["3d"]!(three, mats);
    u.upd(t);
    obj = u.g;
  } else if (model === "uGantry") {
    const u = U3["fab"]!(three, mats);
    u.upd(t);
    obj = u.g;
  } else if (model === "uGoliath") {
    const u = U3["hw"]!(three, mats);
    u.upd(t);
    obj = u.g;
  } else if (model === "uWatch") {
    const u = U3["cmd"]!(three, mats);
    u.upd(t);
    obj = u.g;
  } else if (model === "uCortex") {
    const u = U3["intel"]!(three, mats);
    u.upd(t);
    obj = u.g;
  } else {
    throw new Error(`Unknown model: ${model}`);
  }

  obj.position.set(0, 1.5, 0);
  obj.rotation.y = (yawDeg * Math.PI) / 180;
  sc.add(obj);

  const win = window as unknown as {
    __CONCEPFUL_ENGINE__?: {
      renderer: THREE.WebGLRenderer;
    };
    __RAID_BENCH_LAST__?: {
      scene: THREE.Scene;
      obj: THREE.Object3D;
      camera: THREE.PerspectiveCamera;
    };
  };
  if (process.env.NEXT_PUBLIC_E2E === "1") {
    win.__RAID_BENCH_LAST__ = { scene: sc, obj, camera: cam };
  }
  const renderer = win.__CONCEPFUL_ENGINE__?.renderer;
  if (renderer) {
    renderer.setSize(800, 800, false);
    renderer.render(sc, cam);
  }
}
