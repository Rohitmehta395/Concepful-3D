import type * as THREE from "three";

/**
 * Shared hex colour palette matching reference lines 7394-7411.
 */
export const HX = {
  bone: 0xffffff,
  bone2: 0xc9cadd,
  gun: 0x3e4270,
  dark: 0x1c1e36,
  red: 0xee004e,
  yel: 0xf2b33a,
  blu: 0x8c93e6,
  teal: 0x55c2b8,
  glass: 0x2a3060,
  chrome: 0xcdd0e4,
  holo: 0xb8c2ff,
  ink: 0x141624,
  cloud: 0xf1f1f8,
  navy: 0x141624,
  melon: 0xee004e,
  melonLo: 0xa8003a,
} as const;

const EMB_S =
  "M87.1546 59.3289L72.9716 51.7155C72.4769 51.4407 71.8722 51.4682 71.4049 51.7155L67.062 54.2167C65.9626 54.8488 65.9901 56.443 67.117 57.0476L76.1051 61.8575C77.232 62.4622 77.2595 64.0563 76.16 64.6885L57.4143 75.5176C55.6002 76.5621 53.3463 76.5621 51.5597 75.5176C50.8176 75.0779 36.9644 66.9148 29.0759 62.4347C27.9764 61.8026 27.9764 60.2634 29.0759 59.6312L37.6791 54.6564C38.7511 54.0243 38.7511 52.4851 37.6791 51.8529C36.1948 51.0009 34.738 50.1489 33.4187 49.3793C32.9239 49.1044 32.2918 49.1044 31.797 49.3793L20.6925 55.8108C18.9334 56.8278 17.0918 58.8342 17.1742 61.3628C17.2017 62.5721 17.7515 64.8534 20.9124 66.4475C23.7985 67.8768 39.7406 77.2217 47.8216 81.9766C49.8831 83.1585 52.1919 83.7632 54.5008 83.7632C56.8096 83.7632 59.1185 83.1585 61.18 81.9766L87.3195 66.8873C88.6938 66.0902 89.5184 64.606 89.4909 63.0394C89.4909 61.4452 88.5839 60.016 87.1821 59.2464L87.1546 59.3289Z";
const EMB_D =
  "M83.8011 80.5475C83.1415 80.5475 82.5368 80.2177 82.1795 79.613C81.6572 78.706 81.9596 77.5791 82.8666 77.0569L84.4883 76.1224C85.3954 75.6002 86.5223 75.9025 87.0445 76.8095C87.5668 77.7165 87.2644 78.8434 86.3574 79.3656L84.7357 80.3001C84.4333 80.465 84.131 80.5475 83.8011 80.5475ZM53.0713 96.8462C52.4392 96.8462 51.7795 96.7912 51.1473 96.6813C50.1303 96.5163 49.4431 95.5269 49.6081 94.5099C49.773 93.493 50.735 92.8059 51.7795 92.9708C52.7965 93.1357 53.841 93.1082 54.8305 92.8883C55.8475 92.6409 56.837 93.2731 57.0844 94.2901C57.3042 95.307 56.6995 96.2965 55.6826 96.5438C54.8305 96.7362 53.9509 96.8462 53.0988 96.8462H53.0713ZM43.9184 93.0532C43.5885 93.0532 43.2862 92.9708 42.9838 92.8059L39.6855 90.8819C38.7784 90.3597 38.4761 89.2053 38.9983 88.3258C39.5205 87.4188 40.675 87.1164 41.5545 87.6387L44.8529 89.5626C45.76 90.0848 46.0623 91.2392 45.5401 92.1187C45.1827 92.7234 44.5506 93.0532 43.9184 93.0532ZM62.6641 92.7784C62.0044 92.7784 61.3997 92.4485 61.0424 91.8439C60.5202 90.9369 60.8225 89.81 61.7296 89.2878L65.0279 87.3638C65.935 86.8416 67.0619 87.1439 67.5842 88.0509C68.1064 88.9579 67.8041 90.0848 66.897 90.6071L63.5986 92.531C63.2963 92.6959 62.9939 92.7784 62.6641 92.7784ZM33.3086 86.924C32.9788 86.924 32.6764 86.8416 32.3741 86.6767L29.0757 84.7802C28.1687 84.258 27.8663 83.1311 28.3886 82.2241C28.9108 81.3171 30.0377 81.0147 30.9448 81.537L34.2432 83.4609C35.1502 83.9831 35.4526 85.1375 34.9303 86.017C34.573 86.6217 33.9408 86.9515 33.3086 86.9515V86.924ZM73.2189 86.6492C72.5592 86.6492 71.9545 86.3194 71.5972 85.7147C71.0749 84.8077 71.3773 83.6808 72.2843 83.1586L75.5827 81.2346C76.4898 80.7124 77.6167 81.0147 78.1389 81.9217C78.6612 82.8288 78.3588 83.9556 77.4518 84.4779L74.1534 86.4018C73.8511 86.5667 73.5487 86.6492 73.2189 86.6492ZM22.7813 80.8224C22.4515 80.8224 22.1491 80.7399 21.8468 80.575L20.2251 79.6405C19.318 79.1183 19.0157 77.9914 19.5379 77.0844C20.0602 76.1774 21.1871 75.875 22.0942 76.3973L23.7159 77.3317C24.6229 77.854 24.9253 79.0083 24.403 79.8879C24.0457 80.4925 23.4135 80.8224 22.7813 80.8224Z";
const EMB_C =
  "M54.006 66.1178C51.3948 66.1178 48.7561 65.4306 46.4197 64.0839C38.9984 59.7137 26.5471 52.4302 24.4581 51.3857C19.7579 49.022 19.1258 45.1741 19.0983 43.6074C18.9883 39.6771 21.5995 36.7362 24.0733 35.3069L46.4197 22.3889C50.0205 20.3276 54.6382 21.6743 56.5073 25.4398C58.2389 28.9029 56.7546 33.1356 53.4013 35.0871L39.4107 43.1677V43.2227C45.4302 46.7133 52.4668 50.8635 53.7036 51.5781C53.8686 51.6606 54.1159 51.6606 54.3358 51.5506L76.6823 38.6601C80.283 36.5987 84.9007 37.9455 86.7698 41.711C88.5014 45.1741 87.0172 49.4068 83.6638 51.3582L61.5648 64.1113C59.2284 65.4581 56.5897 66.1452 53.9785 66.1452L54.006 66.1178Z";

const LOW_SAT_STOPS: [number, number][] = [
  [0, 0x0a0b17],
  [0.12, 0x161830],
  [0.25, 0x262a4e],
  [0.4, 0x42467a],
  [0.6, 0x8487b4],
  [0.8, 0xcbcce0],
  [0.92, 0xf3f3f9],
  [1.01, 0xffffff],
];

/**
 * Exact brand colour transform matching reference lines 7426-7466.
 * Folds neutral greys into the navy/indigo ramp and reds into melon.
 */
export function brandCol(
  h: number | string,
  three: typeof THREE,
  cache?: Record<number, number>
): number {
  const col = typeof h === "string" ? parseInt(h.replace("#", ""), 16) : h;
  if (typeof col !== "number" || isNaN(col)) return 0xffffff;
  if (cache && cache[col] !== undefined) return cache[col];

  const c = new three.Color(col);
  const q = { h: 0, s: 0, l: 0 };
  c.getHSL(q);
  const hue = q.h * 360;
  let out = col;

  if (q.s > 0.85 && hue > 333 && hue < 347) {
    out = col;
  } else if (q.l > 0.78 && q.s < 0.55 && hue > 18 && hue < 62) {
    out = new three.Color(0xf6f6fb)
      .lerp(new three.Color(0xffffff), Math.min(1, (q.l - 0.78) / 0.15))
      .getHex();
  } else if (q.s < 0.24) {
    for (let i = 1; i < LOW_SAT_STOPS.length; i++) {
      const prev = LOW_SAT_STOPS[i - 1];
      const curr = LOW_SAT_STOPS[i];
      if (prev && curr && q.l <= curr[0]) {
        const [a, ca] = prev;
        const [b, cb] = curr;
        out = new three.Color(ca)
          .lerp(new three.Color(cb), (q.l - a) / (b - a))
          .getHex();
        break;
      }
    }
  } else if ((hue < 16 || hue > 333) && q.s > 0.3) {
    const k = new three.Color();
    k.setHSL(340 / 360, 1, Math.min(0.9, q.l * 0.82));
    out = k.getHex();
  }

  if (cache) cache[col] = out;
  return out;
}

export function hexS(h: number | string, three: typeof THREE): string {
  return "#" + brandCol(h, three).toString(16).padStart(6, "0");
}

export function createToonGradient(three: typeof THREE): THREE.DataTexture {
  const t = new three.DataTexture(
    new Uint8Array([85, 170, 255]),
    3,
    1,
    three.LuminanceFormat
  );
  t.minFilter = t.magFilter = three.NearestFilter;
  t.generateMipmaps = false;
  t.needsUpdate = true;
  return t;
}

export function texC(
  w: number,
  h: number,
  fn: (ctx: CanvasRenderingContext2D, width: number, height: number) => void,
  three: typeof THREE
): THREE.CanvasTexture {
  if (
    typeof document === "undefined" ||
    typeof document.createElement !== "function"
  ) {
    return new three.CanvasTexture({} as unknown as HTMLCanvasElement);
  }
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    fn(ctx, w, h);
  }
  const texture = new three.CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
}

export function bgTex(
  top: string,
  bot: string,
  three: typeof THREE
): THREE.CanvasTexture {
  return texC(
    4,
    256,
    (ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, hexS(top, three));
      g.addColorStop(1, hexS(bot, three));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    },
    three
  );
}

export function resolveDisplayFont(): string {
  if (
    typeof document !== "undefined" &&
    typeof getComputedStyle === "function"
  ) {
    const val = getComputedStyle(document.documentElement)
      .getPropertyValue("--font-russo-one")
      .trim();
    if (val) return val;
    const h = document.querySelector(".mid, h1, h2");
    if (h) {
      const ff = getComputedStyle(h).fontFamily;
      if (ff) return ff;
    }
  }
  return '"Russo One", "Arial Black", sans-serif';
}

export function createGlowTexture(three: typeof THREE): THREE.CanvasTexture {
  return texC(
    64,
    64,
    (ctx, w, h) => {
      const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.3, "rgba(255,255,255,.45)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    },
    three
  );
}

export type TXKey =
  "chart" | "haz" | "ui" | "name" | "ctx" | "flag" | "hull" | "disc";

export interface MaterialRegistry {
  readonly TG: THREE.DataTexture;
  readonly GLOWT: THREE.CanvasTexture;
  readonly INK: THREE.MeshBasicMaterial;
  brand(h: number | string): number;
  hex(h: number | string): string;
  tm(h: number): THREE.MeshToonMaterial;
  bm(h: number, op?: number, add?: boolean): THREE.MeshBasicMaterial;
  TX(name: TXKey): THREE.CanvasTexture;
  dispose(): void;
}

/**
 * Per-engine material, palette, and procedural texture registry.
 * Mirrors reference caches (BCC, MC, BC, TXC, TG, GLOWT, INK) lines 7412-7749,
 * scoped to the engine lifecycle so dispose() frees 100% of GPU resources.
 */
export function createMaterialRegistry(three: typeof THREE): MaterialRegistry {
  const BCC: Record<number, number> = {};
  const MC: Record<number, THREE.MeshToonMaterial> = {};
  const BC: Record<string, THREE.MeshBasicMaterial> = {};
  const TXC: Partial<Record<TXKey, THREE.CanvasTexture>> = {};

  const TG = createToonGradient(three);
  const GLOWT = createGlowTexture(three);
  const INK = new three.MeshBasicMaterial({
    color: HX.ink,
    side: three.BackSide,
  });

  function brand(h: number | string): number {
    return brandCol(h, three, BCC);
  }

  function hex(h: number | string): string {
    return "#" + brand(h).toString(16).padStart(6, "0");
  }

  function tm(h: number): THREE.MeshToonMaterial {
    const existing = MC[h];
    if (existing) return existing;
    const mat = new three.MeshToonMaterial({
      color: brand(h),
      gradientMap: TG,
    });
    MC[h] = mat;
    return mat;
  }

  function bm(h: number, op = 1, add = false): THREE.MeshBasicMaterial {
    const k = `${h}_${op}_${add}`;
    const existing = BC[k];
    if (existing) return existing;
    const mat = new three.MeshBasicMaterial({
      color: brand(h),
      transparent: op < 1 || add,
      opacity: op,
      blending: add ? three.AdditiveBlending : three.NormalBlending,
      depthWrite: !(op < 1 || add),
      side: three.DoubleSide,
    });
    BC[k] = mat;
    return mat;
  }

  function TX(name: TXKey): THREE.CanvasTexture {
    const existing = TXC[name];
    if (existing) return existing;
    const F = resolveDisplayFont();
    let tex: THREE.CanvasTexture;

    if (name === "chart") {
      tex = texC(
        256,
        144,
        (x, w, h) => {
          x.fillStyle = "#10161E";
          x.fillRect(0, 0, w, h);
          [0.3, 0.5, 0.45, 0.72, 0.95].forEach((v, i) => {
            x.fillStyle = i === 4 ? "#EE004E" : "#B8C2FF";
            x.fillRect(22 + i * 44, h - 14 - (h - 34) * v, 28, (h - 34) * v);
          });
          x.strokeStyle = "#F2B33A";
          x.lineWidth = 7;
          x.beginPath();
          x.moveTo(16, h * 0.72);
          x.lineTo(w - 28, 20);
          x.stroke();
          x.fillStyle = "#F2B33A";
          x.beginPath();
          x.moveTo(w - 12, 10);
          x.lineTo(w - 40, 14);
          x.lineTo(w - 22, 36);
          x.fill();
        },
        three
      );
    } else if (name === "haz") {
      tex = texC(
        128,
        16,
        (x, _w, h) => {
          x.fillStyle = "#1B1B20";
          x.fillRect(0, 0, 128, h);
          x.fillStyle = "#F2B33A";
          for (let i = -2; i < 12; i++) {
            x.beginPath();
            x.moveTo(i * 16, h);
            x.lineTo(i * 16 + 8, h);
            x.lineTo(i * 16 + 16, 0);
            x.lineTo(i * 16 + 8, 0);
            x.fill();
          }
        },
        three
      );
      tex.wrapS = three.RepeatWrapping;
      tex.repeat.set(3, 1);
    } else if (name === "ui") {
      tex = texC(
        160,
        112,
        (x, w, h) => {
          x.fillStyle = "rgba(184,194,255,.16)";
          x.fillRect(0, 0, w, h);
          x.strokeStyle = "#B8C2FF";
          x.lineWidth = 4;
          x.strokeRect(3, 3, w - 6, h - 6);
          x.strokeRect(12, 26, 52, 74);
          x.beginPath();
          x.moveTo(12, 14);
          x.lineTo(w - 12, 14);
          for (let k = 0; k < 4; k++) {
            x.moveTo(76, 32 + k * 18);
            x.lineTo(w - 14, 32 + k * 18);
          }
          x.stroke();
        },
        three
      );
    } else if (name === "name") {
      tex = texC(
        256,
        112,
        (x, w, h) => {
          x.fillStyle = "#ECE6D6";
          x.fillRect(0, 0, w, h);
          x.strokeStyle = "#EE004E";
          x.lineWidth = 10;
          x.strokeRect(12, 12, w - 24, h - 24);
          x.fillStyle = "#141624";
          x.font = "400 50px " + F;
          x.textAlign = "center";
          x.textBaseline = "middle";
          x.fillText("NAME™", w / 2, h / 2 + 3);
        },
        three
      );
    } else if (name === "ctx") {
      tex = texC(
        256,
        160,
        (x, w) => {
          x.fillStyle = "#10161E";
          x.fillRect(0, 0, w, 160);
          x.fillStyle = "#B8C2FF";
          x.font = "400 34px " + F;
          x.textAlign = "center";
          x.fillText("Context™", w / 2, 70);
          for (let i = 0; i < 4; i++) x.fillRect(30 + i * 52, 100, 36, 14);
        },
        three
      );
    } else if (name === "flag") {
      tex = texC(
        320,
        224,
        (x, w, h) => {
          x.fillStyle = "#EE004E";
          x.fillRect(0, 0, w, h);
          const k = 2.3;
          x.save();
          x.translate(w / 2 - 53.3 * k, h / 2 - 59 * k);
          x.scale(k, k);
          if (typeof Path2D !== "undefined") {
            x.fillStyle = "rgba(20,22,36,.6)";
            x.fill(new Path2D(EMB_S));
            x.fillStyle = "#141624";
            x.fill(new Path2D(EMB_D));
            x.fillStyle = "#FFFFFF";
            x.fill(new Path2D(EMB_C));
          }
          x.restore();
        },
        three
      );
    } else if (name === "hull") {
      tex = texC(
        1024,
        96,
        (x, w, h) => {
          x.font = "400 72px " + F;
          x.fillStyle = "#ECE6D6";
          x.textAlign = "center";
          x.textBaseline = "middle";
          x.fillText("CS-99  Context", w / 2, h / 2 + 4);
        },
        three
      );
    } else {
      tex = texC(
        512,
        512,
        (x, w, h) => {
          const c = w / 2;
          x.beginPath();
          x.arc(c, c, c - 4, 0, Math.PI * 2);
          const g = x.createLinearGradient(0, 0, 0, h);
          g.addColorStop(0, "#EA5260");
          g.addColorStop(1, "#B42637");
          x.fillStyle = g;
          x.fill();
          x.save();
          x.clip();
          for (let yy = 0; yy < h; yy += 9) {
            for (let xx = ((yy / 9) % 2) * 4.5; xx < w; xx += 9) {
              const k = Math.max(0, (yy - h * 0.45) / (h * 0.55));
              if (k > 0) {
                x.fillStyle = "rgba(20,10,16,.55)";
                x.beginPath();
                x.arc(xx, yy, 1 + k * 2.6, 0, Math.PI * 2);
                x.fill();
              }
            }
          }
          x.strokeStyle = "rgba(255,255,255,.14)";
          x.lineWidth = 18;
          [0.5, 0.68, 0.86].forEach((r, i) => {
            x.beginPath();
            x.arc(c, c, c * r, i, i + 1.5);
            x.stroke();
          });
          x.restore();
        },
        three
      );
    }

    TXC[name] = tex;
    return tex;
  }

  function dispose(): void {
    TG.dispose();
    GLOWT.dispose();
    INK.dispose();
    Object.values(MC).forEach((m) => m.dispose());
    Object.values(BC).forEach((m) => m.dispose());
    Object.values(TXC).forEach((t) => t?.dispose());
  }

  return {
    TG,
    GLOWT,
    INK,
    brand,
    hex,
    tm,
    bm,
    TX,
    dispose,
  };
}
