import type * as THREE from "three";

export function brandCol(h: number | string, three: typeof THREE): number {
  const col = typeof h === "string" ? parseInt(h.replace("#", ""), 16) : h;
  if (typeof col !== "number" || isNaN(col)) return 0xffffff;
  const c = new three.Color(col);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  const hue = hsl.h * 360;
  if (hue > 210 && hue < 265 && hsl.s > 0.25) {
    const k = new three.Color();
    k.setHSL(234 / 360, 0.45, Math.min(0.85, hsl.l * 0.95));
    return k.getHex();
  } else if ((hue < 16 || hue > 333) && hsl.s > 0.3) {
    const k = new three.Color();
    k.setHSL(340 / 360, 1, Math.min(0.9, hsl.l * 0.82));
    return k.getHex();
  }
  return col;
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

export function createGlowTexture(three: typeof THREE): THREE.CanvasTexture {
  return texC(
    128,
    128,
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
