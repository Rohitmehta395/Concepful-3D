import type * as THREE from "three";

export interface Box {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
}

export interface CardRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
}

/**
 * Pure measurement of target framing box.
 * Matches original lines 2662-2720: storyTarget and logiTarget.
 */
export function measureBox(
  W: number,
  H: number,
  topBottom: number,
  cards: CardRect[] = [],
  isLogi = false,
  logiElements?: { hzHeadBottom?: number; hzViewTop?: number }
): Box {
  let x0: number;
  let x1: number;
  let y0: number;
  let y1: number;

  if (isLogi) {
    const hbBottom = logiElements?.hzHeadBottom ?? topBottom;
    const tbTop = logiElements?.hzViewTop ?? H;
    y0 = Math.max(topBottom + 4, Math.min(H * 0.6, hbBottom + 4));
    y1 = Math.max(y0 + H * 0.22, Math.min(H - 8, tbTop - 4));
    if (W < 900) {
      x0 = 8;
      x1 = W - 8;
    } else {
      x0 = 20;
      x1 = W - 20;
    }
  } else if (W >= 900) {
    let r = 16 + Math.min(460, W - 32);
    for (const q of cards) {
      if (q.height && q.bottom > 0 && q.top < H && q.left < W * 0.4) {
        r = Math.max(r, q.right);
      }
    }
    x0 = Math.min(W - 320, r + 24);
    x1 = W - 20;
    y0 = topBottom + 8;
    y1 = H - 20;
  } else {
    const top = topBottom + 4;
    const bot = H - 6;
    const occ: [number, number][] = [];
    for (const q of cards) {
      if (q.height && q.bottom > top && q.top < bot) {
        occ.push([Math.max(top, q.top - 8), Math.min(bot, q.bottom + 8)]);
      }
    }
    occ.sort((a, b) => a[0] - b[0]);
    const gaps: [number, number][] = [];
    let y = top;
    for (const [a, b] of occ) {
      if (a > y) gaps.push([y, a]);
      y = Math.max(y, b);
    }
    if (bot > y) gaps.push([y, bot]);
    let best: [number, number] | null = null;
    for (const g of gaps) {
      if (!best || g[1] - g[0] > best[1] - best[0]) best = g;
    }
    if (!best || best[1] - best[0] < H * 0.24) {
      best = [top, Math.max(top + H * 0.3, H * 0.46)];
    }
    x0 = 8;
    x1 = W - 8;
    y0 = best[0];
    y1 = best[1];
  }

  const w = x1 - x0;
  const h = Math.max(140, y1 - y0);
  const cx = (x0 + x1) / 2;
  const cy = y0 + h / 2;

  return { x0, x1, y0, y1, w, h, cx, cy };
}

/**
 * Applies projection matrix and viewport offset to camera.
 * Matches original lines 14471-14473:
 * CAM.aspect = W / H;
 * CAM.setViewOffset(W, H, -(box.cx - W / 2), -(box.cy - H / 2), W, H);
 * CAM.updateProjectionMatrix();
 */
export function applyCameraOffset(
  camera: THREE.PerspectiveCamera,
  box: Box,
  W: number,
  H: number
): void {
  camera.aspect = W / H;
  camera.setViewOffset(W, H, -(box.cx - W / 2), -(box.cy - H / 2), W, H);
  camera.updateProjectionMatrix();
}
