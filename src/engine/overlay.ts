/**
 * Concepful Mech Builder — 2D Overlay (#cv) Manager
 * Source of truth: reference/Concepful_Mech_Builder.html (lines 582-592, 2645, 2728-2729, 7113-7132, 7371-7375)
 */

export interface OverlayManager {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D | null;
  resize: (width: number, height: number, maxPixelRatio?: number) => void;
  render: (time: number, fadeT: number | null) => void;
  dispose: () => void;
}

// Pre-computed table of 256 fade RGBA strings for strictly 0 per-frame allocations during transitions
const FADE_ALPHA_TABLE: string[] = Array.from({ length: 256 }, (_, i) => {
  return `rgba(11,14,21,${(i / 255).toFixed(4)})`;
});

export function createOverlay(canvas: HTMLCanvasElement): OverlayManager {
  const ctx = canvas.getContext("2d");

  let w = 0;
  let h = 0;
  let dpr = 1;
  let gradient: CanvasGradient | null = null;
  let isDisposed = false;

  function resize(
    width: number,
    height: number,
    maxPixelRatio: number = 2
  ): void {
    if (isDisposed || !ctx) return;
    w = width;
    h = height;
    dpr = Math.min(
      maxPixelRatio,
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1
    );

    // Reference lines 2728-2729: cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);

    // Cache radial gradient to guarantee 0 per-frame allocations
    // Reference lines 7114-7123:
    gradient = ctx.createRadialGradient(
      w / 2,
      h / 2,
      Math.min(w, h) * 0.4,
      w / 2,
      h / 2,
      Math.max(w, h) * 0.8
    );
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(1, "rgba(0,0,0,.42)");
  }

  function render(time: number, fadeT: number | null): void {
    if (isDisposed || !ctx || w === 0 || h === 0 || !gradient) return;

    // Reference lines 7373-7374: ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.clearRect(0, 0, W, H);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // Reference lines 7124-7125: vignette fill
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // Reference lines 7126-7129: scene transition fade
    if (fadeT !== null && time - fadeT < 450) {
      const alpha = Math.max(0, Math.min(1, 1 - (time - fadeT) / 450));
      const idx = Math.min(255, Math.max(0, Math.round(alpha * 255)));
      ctx.fillStyle = FADE_ALPHA_TABLE[idx]!;
      ctx.fillRect(0, 0, w, h);
    }
  }

  function dispose(): void {
    if (isDisposed) return;
    isDisposed = true;
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    canvas.width = 0;
    canvas.height = 0;
    gradient = null;
  }

  return {
    canvas,
    ctx,
    resize,
    render,
    dispose,
  };
}
