import type * as THREE from "three";
import type { Box } from "../layout";

export interface CalloutItem {
  readonly at: readonly [number, number, number];
  readonly h: string;
  readonly d: string;
}

export const STAGE_C: readonly (readonly CalloutItem[])[] = [
  [
    {
      at: [0, 0, 0.72],
      h: "Mission · $4,000 fixed",
      d: "One job, one price, about two weeks.",
    },
    {
      at: [1.3, 0.26, 1.0],
      h: "One senior lead",
      d: "The same expert from brief to delivery.",
    },
    {
      at: [0, -0.36, 0.2],
      h: "A hero matched to the job",
      d: "Brand, site, deck, motion, 3D or an AI workflow.",
    },
    {
      at: [-1.3, 0.26, -1.0],
      h: "Yours on delivery",
      d: "Files and IP transfer when it ships.",
    },
  ],
  [
    {
      at: [0.6, 1.6, 0],
      h: "Start with a Mission",
      d: "Prove the fit on one fixed-price job.",
    },
    {
      at: [4.5, 0, 0],
      h: "Upgrade when it stacks up",
      d: "Move to Full Crew without starting over.",
    },
    {
      at: [-1, 0.15, 1],
      h: "Same lead, same standard",
      d: "Your brand stays consistent as you grow.",
    },
    {
      at: [-4.75, 0, 0],
      h: "Gear as you need it",
      d: "Add illustration, a motion cut or rush per mission.",
    },
  ],
  [
    {
      at: [-1.8, 2.0, 0],
      h: "Full Crew · from $7,200/mo",
      d: "1–3 months, 2-month minimum.",
    },
    {
      at: [5.3, 0.15, 0.4],
      h: "A party built around the goal",
      d: "Launch, rebrand, story or product. Specialists confirmed at kickoff.",
    },
    {
      at: [-0.3, -0.1, 1.2],
      h: "Project management included",
      d: "Nexus runs the plan, the queue and the check-ins.",
    },
    {
      at: [-6, 0.2, 0],
      h: "Context™ workspace",
      d: "Status, files and feedback in one place.",
    },
  ],
  [
    {
      at: [-4.6, 2.6, -1.3],
      h: "Full Force · from $9,500/mo",
      d: "The whole department. 3-month minimum.",
    },
    {
      at: [5, 1.5, 1.4],
      h: "Every objective at once",
      d: "Launch, brand, story and product run in parallel.",
    },
    {
      at: [0, 1.3, 0],
      h: "Flagship included",
      d: "Scales from sub to mothership as you add buffs.",
    },
    {
      at: [2, 0.6, 2.12],
      h: "Raid buffs on demand",
      d: "3D, fabrication, hardware UI and AI systems.",
    },
  ],
];

export function toScreen(
  v: THREE.Vector3,
  cam: THREE.Camera,
  _box: Box,
  width: number,
  height: number
): [number, number] {
  const p = v.clone().project(cam);
  return [(p.x * 0.5 + 0.5) * width, (-p.y * 0.5 + 0.5) * height];
}

function wrapT(
  ctx: CanvasRenderingContext2D,
  str: string,
  mw: number
): string[] {
  const out: string[] = [];
  let ln = "";
  str.split(" ").forEach((w) => {
    const tt = ln ? ln + " " + w : w;
    if (ctx.measureText(tt).width > mw && ln) {
      out.push(ln);
      ln = w;
    } else {
      ln = tt;
    }
  });
  if (ln) out.push(ln);
  return out;
}

export function drawCallouts(
  three: typeof THREE,
  ctx: CanvasRenderingContext2D,
  _t: number,
  cam: THREE.PerspectiveCamera,
  box: Box,
  width: number,
  height: number,
  stageIndex: number,
  stageGroup?: THREE.Group,
  reduceMotion = false
): void {
  const i = Math.max(0, Math.min(3, stageIndex));
  const C = STAGE_C[i];
  if (!C) return;

  const mob = width < 900;
  const bw = Math.min(mob ? (box.w - 16) / 2 : 232, 240);
  const fs = mob ? 10.5 : 12;
  const pad = mob ? 8 : 10;

  ctx.font = `500 ${fs}px Inter, sans-serif`;

  const pts = C.map((c) => {
    const worldVec = new three.Vector3(c.at[0], c.at[1], c.at[2]);
    if (stageGroup) {
      stageGroup.localToWorld(worldVec);
    }
    return {
      c,
      p: toScreen(worldVec, cam, box, width, height),
    };
  });

  const L = pts.map((o) => wrapT(ctx, o.c.d, bw - pad * 2 - 4));
  const hOf = (k: number) => pad * 2 + 14 + (L[k]?.length || 1) * (fs + 3);

  const byY = pts.map((o, k) => ({ ...o, k })).sort((p, q) => p.p[1] - q.p[1]);
  const top = byY.slice(0, 2).sort((p, q) => p.p[0] - q.p[0]);
  const bot = byY.slice(2).sort((p, q) => p.p[0] - q.p[0]);

  const xl = box.x0 + (mob ? 4 : 16);
  const xr = box.x1 - (mob ? 4 : 16) - bw;
  const yT = box.y0 + (mob ? 4 : 12);

  const slots = [
    [top[0]!, xl, yT, 0],
    [top[1]!, xr, yT, 1],
    [bot[0]!, xl, null, 0],
    [bot[1]!, xr, null, 1],
  ] as const;

  const rise = reduceMotion ? 1 : 1;
  ctx.save();
  ctx.globalAlpha = 1;

  const sx0 = Math.min(...pts.map((o) => o.p[0])) - 18;
  const sx1 = Math.max(...pts.map((o) => o.p[0])) + 18;
  const scx = (sx0 + sx1) / 2;
  const scy = pts.reduce((q, o) => q + o.p[1], 0) / 4;

  slots.forEach(([o, initialLx, initialLy, right]) => {
    let lx = initialLx;
    let ly = initialLy;
    const h = hOf(o.k);
    if (ly === null) {
      ly = box.y1 - h - (mob ? 6 : 56);
    }
    if (!mob) {
      const k = 0.6;
      lx += (scx - (lx + bw / 2)) * k;
      ly += (scy - (ly + h / 2)) * k;
      if (right) lx = Math.max(lx, sx1 + 10);
      else lx = Math.min(lx, sx0 - 10 - bw);
      lx = Math.max(box.x0 + 6, Math.min(box.x1 - 6 - bw, lx));
      ly = Math.max(box.y0 + 6, Math.min(box.y1 - h - 6, ly));
    }
    ly += (1 - rise) * 8;

    const ex = right ? lx : lx + bw;
    const ey = ly + h / 2;
    const [ax, ay] = o.p;
    const mx = ex + (right ? -1 : 1) * Math.min(40, Math.abs(ax - ex) * 0.4);

    // Leader line
    ctx.strokeStyle = "rgba(255,255,255,.55)";
    ctx.lineWidth = 1.25;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(mx, ey);
    ctx.lineTo(ex, ey);
    ctx.stroke();
    ctx.setLineDash([]);

    // Anchor point circles
    ctx.beginPath();
    ctx.arc(ax, ay, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = "#EE004E";
    ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(ex, ey, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();

    // Box background
    ctx.fillStyle = "rgba(8,9,20,.45)";
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(lx, ly + 3, bw, h, 10);
    } else {
      ctx.rect(lx, ly + 3, bw, h);
    }
    ctx.fill();

    ctx.fillStyle = "#EE004E";
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(lx, ly, bw, h, 10);
    } else {
      ctx.rect(lx, ly, bw, h);
    }
    ctx.fill();

    // Box text
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font = `700 ${mob ? 9.5 : 10.5}px "JetBrains Mono", monospace`;
    ctx.fillStyle = "rgba(255,255,255,.78)";
    ctx.fillText(o.c.h.toUpperCase(), lx + pad + 4, ly + pad, bw - pad * 2);

    ctx.font = `500 ${fs}px Inter, sans-serif`;
    ctx.fillStyle = "#FFFFFF";
    const lines = L[o.k] || [];
    for (let j = 0; j < lines.length; j++) {
      ctx.fillText(lines[j]!, lx + pad + 4, ly + pad + 16 + j * (fs + 3));
    }
  });

  ctx.restore();
  ctx.textBaseline = "alphabetic";
}
