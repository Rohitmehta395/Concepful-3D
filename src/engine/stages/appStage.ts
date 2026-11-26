import type * as THREE from "three";
import { bgTex, texC, HX } from "../world/materials";
import { planet3, Tor, mk, flick } from "../world/geometry";
import { createStreakField, type StreakField } from "../world/streakField";
import { H3 } from "../models/hVehiclesC";
import type { VehicleHandle } from "../models/hVehiclesA";
import type { Stage, StageBuildContext, StageUpdateParams } from "./types";
import { DEFAULT_BUILD_STATE } from "../buildState";
export { type BuildState, DEFAULT_BUILD_STATE } from "../buildState";

export interface EnvConfig {
  readonly name: string;
  readonly top: string;
  readonly bot: string;
  readonly disc: readonly [string, string];
  readonly planet?: boolean;
  readonly stars: number;
}

export const ENVD: Record<string, EnvConfig> = {
  brand: {
    name: "Nebula",
    top: "#12151C",
    bot: "#2E3442",
    disc: ["#E9505E", "#B42637"],
    planet: true,
    stars: 1,
  },
  web: {
    name: "Grid Canyon",
    top: "#1C1517",
    bot: "#3E2A2E",
    disc: ["#ECE6D6", "#B9B0A0"],
    stars: 0.5,
  },
  uiux: {
    name: "Moonlit Pixels",
    top: "#0F1218",
    bot: "#262B36",
    disc: ["#E9505E", "#B42637"],
    stars: 1,
  },
  decks: {
    name: "Day Flight",
    top: "#7C8898",
    bot: "#4A5262",
    disc: ["#ECE6D6", "#B9B0A0"],
    stars: 0.6,
  },
  copy: {
    name: "Abyss Broadcast",
    top: "#12151C",
    bot: "#2A2F3A",
    disc: ["#E9505E", "#B42637"],
    stars: 0.35,
  },
  motion: {
    name: "Open Meadow",
    top: "#8A93A0",
    bot: "#4A5262",
    disc: ["#E9505E", "#B42637"],
    stars: 0.45,
  },
  "3d": {
    name: "Crystal Reef",
    top: "#1A2028",
    bot: "#36404C",
    disc: ["#ECE6D6", "#B9B0A0"],
    stars: 0.3,
  },
  fab: {
    name: "Dust Canyon",
    top: "#5A5862",
    bot: "#2C2A30",
    disc: ["#E9505E", "#B42637"],
    stars: 0.45,
  },
  ai: {
    name: "Night Grid City",
    top: "#0B0E15",
    bot: "#2A2230",
    disc: ["#E9505E", "#B42637"],
    stars: 0.8,
  },
};

function createDiscTexture(
  three: typeof THREE,
  topCol: string,
  botCol: string
): THREE.CanvasTexture {
  return texC(
    512,
    512,
    (ctx, w, h) => {
      const c = w / 2;
      ctx.beginPath();
      ctx.arc(c, c, c - 4, 0, Math.PI * 2);
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, topCol);
      grad.addColorStop(1, botCol);
      ctx.fillStyle = grad;
      ctx.fill();
      if (typeof ctx.save === "function") ctx.save();
      if (typeof ctx.clip === "function") ctx.clip();
      for (let yy = 0; yy < h; yy += 9) {
        for (let xx = ((yy / 9) % 2) * 4.5; xx < w; xx += 9) {
          const k2 = Math.max(0, (yy - h * 0.45) / (h * 0.55));
          if (k2 > 0) {
            ctx.fillStyle = "rgba(20,10,16,.4)";
            ctx.beginPath();
            ctx.arc(xx, yy, 1 + k2 * 2.6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.strokeStyle = "rgba(255,255,255,.18)";
      ctx.lineWidth = 18;
      [0.5, 0.68, 0.86].forEach((r, i) => {
        ctx.beginPath();
        ctx.arc(c, c, c * r, i, i + 1.5);
        ctx.stroke();
      });
      if (typeof ctx.restore === "function") ctx.restore();
    },
    three
  );
}

function backEase(u: number): number {
  const c1 = 1.5;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2);
}

export function createAppStage(ctx: StageBuildContext): Stage {
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

  // Background and textures cache
  const bgCache = new Map<string, THREE.CanvasTexture>();
  const discTexCache = new Map<string, THREE.CanvasTexture>();

  function getBg(top: string, bot: string): THREE.CanvasTexture {
    const k = `${top}_${bot}`;
    let t = bgCache.get(k);
    if (!t) {
      t = bgTex(top, bot, three);
      bgCache.set(k, t);
    }
    return t;
  }

  function getDisc(top: string, bot: string): THREE.CanvasTexture {
    const k = `${top}_${bot}`;
    let t = discTexCache.get(k);
    if (!t) {
      t = createDiscTexture(three, top, bot);
      discTexCache.set(k, t);
    }
    return t;
  }

  const initialEnv = ENVD.brand!;
  let activeBg = getBg(initialEnv.top, initialEnv.bot);

  // Background starfield and planet
  const stars: StreakField = createStreakField(
    three,
    group,
    140,
    [60, 30, 30],
    2.5
  );
  const planet = planet3(
    three,
    mats,
    group,
    7,
    [-14, -10, -22],
    0x5c6a7c,
    true
  );

  // Solo Disc & Ring
  const discGeo = new three.CircleGeometry(3.4, 48);
  const discMat = new three.MeshBasicMaterial({
    map: getDisc(initialEnv.disc[0], initialEnv.disc[1]),
    transparent: true,
    depthWrite: false,
  });
  const disc = new three.Mesh(discGeo, discMat);
  disc.position.set(0.3, 0, -3.2);
  group.add(disc);

  const ringGeo = Tor(three, 3.85, 0.025, 3, 64);
  const ringMat = mats.bm(0xf2ede1, 0.35);
  mk(three, mats, group, ringGeo, ringMat, [0.3, 0, -3.25], null, null, false);

  // Brand mission rings
  const brandRings = [0, 1, 2].map((i) => {
    const r = mk(
      three,
      mats,
      group,
      Tor(three, 0.75, 0.06, 4, 20),
      mats.bm(HX.holo, 0.9, true),
      [6 - i * 6, 0.2, -0.5],
      [0, Math.PI / 2, 0],
      null,
      false
    );
    r.visible = false;
    return r;
  });

  // Cached hero vehicles
  const heroes = new Map<string, VehicleHandle>();
  let currentMission: string | null = null;
  let currentHero: VehicleHandle | null = null;
  let vehT0: number | null = null;

  function setEnv(missionKey: string, t = 0, reduceMotion = true): void {
    if (currentMission === missionKey) return;
    const isInitial = currentMission === null;
    const env = ENVD[missionKey] || ENVD.brand!;
    activeBg = getBg(env.top, env.bot);
    parentScene.background = activeBg;

    discMat.map = getDisc(env.disc[0], env.disc[1]);
    discMat.needsUpdate = true;
    planet.visible = !!env.planet;
    (stars.mesh.material as THREE.PointsMaterial).opacity = 0.55 * env.stars;

    // Switch hero mech
    if (currentHero) {
      group.remove(currentHero.g);
    }
    let nextHero = heroes.get(missionKey);
    if (!nextHero) {
      const builder = (H3[missionKey] || H3.brand)!;
      nextHero = builder(three, mats);
      heroes.set(missionKey, nextHero);
    }
    currentHero = nextHero;
    group.add(currentHero.g);
    currentMission = missionKey;
    if (!isInitial && !reduceMotion) {
      vehT0 = t;
    }
  }

  // Pre-seed default hero
  setEnv(DEFAULT_BUILD_STATE.mission);

  function setVisible(visible: boolean): void {
    group.visible = visible;
    if (visible) {
      parentScene.background = activeBg;
    }
  }

  function update(params: StageUpdateParams): void {
    const { t, dt, kk, box, viewportH, reduceMotion } = params;
    const bState = getBuildState ? getBuildState() : DEFAULT_BUILD_STATE;
    if (bState.mission !== currentMission) {
      setEnv(bState.mission, t, reduceMotion);
    }

    if (currentHero) {
      const M3 = currentHero;
      const u =
        reduceMotion || vehT0 === null
          ? 1
          : Math.max(0, Math.min(1, (t - vehT0) / 650));
      const e = backEase(u);
      M3.g.position.set(
        (1 - e) * -14 + (reduceMotion ? 0 : Math.sin(t / 1300) * 0.3),
        reduceMotion ? 0 : Math.sin(t / 700) * 0.18,
        0
      );
      M3.g.rotation.z = reduceMotion ? 0 : Math.sin(t / 900) * 0.05;
      M3.upd(t, { rush: false, reduceMotion });
      if (M3.fl.length > 0) {
        flick(M3.fl, t, 0.15);
      }

      // Disc, stars, planet motion
      disc.rotation.z = t / 12000;
      stars.update(dt, 1.4);
      planet.rotation.y = t / 20000;
      planet.position.set(
        -14 - orbitCtrl.drag.yaw * 4,
        -10 + orbitCtrl.drag.pitch * 3,
        -22
      );

      // Brand rings
      const isBrand = currentMission === "brand";
      for (let i = 0; i < brandRings.length; i++) {
        const r = brandRings[i]!;
        r.visible = isBrand;
        if (!reduceMotion && isBrand) {
          r.position.x -= dt * 0.006;
          if (r.position.x < -9) r.position.x = 9;
        }
      }

      // Aim camera (reference line 14536: unguarded by reduce)
      const dx = 0.15 + Math.sin(t / 4000) * 0.12;
      orbitCtrl.aim(
        camera,
        0,
        0,
        0,
        dx,
        0.12,
        1,
        M3.w * 1.45,
        M3.h * 1.4 + 0.8,
        kk,
        box,
        viewportH,
        t,
        reduceMotion
      );
    }
  }

  function dispose(): void {
    stars.dispose();
    discGeo.dispose();
    discMat.dispose();
    for (const tex of discTexCache.values()) tex.dispose();
    for (const tex of bgCache.values()) tex.dispose();
    for (const h of heroes.values()) {
      group.remove(h.g);
      h.g.traverse((child) => {
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
    heroes.clear();
    while (group.children.length > 0) {
      group.remove(group.children[0]!);
    }
    parentScene.remove(group);
  }

  function triggerEntry(t: number, reduceMotion: boolean): void {
    vehT0 = reduceMotion ? null : t;
  }

  return {
    key: "app",
    group,
    get backgroundTexture() {
      return activeBg;
    },
    fog: null,
    setVisible,
    update,
    dispose,
    triggerEntry,
  } as Stage & { triggerEntry: (t: number, reduceMotion: boolean) => void };
}
