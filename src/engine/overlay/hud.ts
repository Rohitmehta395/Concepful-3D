import { TIERS } from "@/content/tiers";
import { OBJECTIVES } from "@/content/objectives";
import { ENCD } from "@/components/configurator/encounters";
import type { Box } from "../layout";
import type { HudManager } from "./types";

interface ChatCall {
  readonly txt: string;
  readonly kind: "sys" | "party" | "loot" | "quest";
  readonly t0: number;
}

interface RingItem {
  readonly key: string;
  readonly t0: number;
}

const KIND: Record<string, readonly [string, string]> = {
  sys: ["[System]", "#FF7FA6"],
  party: ["[Party]", "#5FD39B"],
  loot: ["[Loot]", "#F2B33A"],
  quest: ["[Mission]", "#B8C2FF"],
};

function resolveFont(cssVar: string, fallback: string): string {
  if (
    typeof document === "undefined" ||
    typeof getComputedStyle !== "function"
  ) {
    return fallback;
  }
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(cssVar)
    .trim();
  return v || fallback;
}

export function createHudManager(): HudManager {
  const calls: ChatCall[] = [];
  const rings: RingItem[] = [];
  let formT = 0;
  let encT0 = 0;
  let encCur: string | null = null;
  let lastObjsSig = "";

  function call(
    txt: string,
    kind: "sys" | "party" | "loot" | "quest" = "sys",
    delay = 0
  ): void {
    const t0 =
      (typeof performance !== "undefined" ? performance.now() : 0) + delay;
    calls.push({ txt, kind, t0 });
    if (calls.length > 14) {
      calls.shift();
    }
  }

  function ring(key: string): void {
    const t0 = typeof performance !== "undefined" ? performance.now() : 0;
    rings.push({ key, t0 });
    if (rings.length > 6) {
      rings.shift();
    }
  }

  function triggerForm(offsetMs = 0): void {
    formT =
      (typeof performance !== "undefined" ? performance.now() : 0) - offsetMs;
  }

  function getFormT(): number {
    return formT;
  }

  function render(
    ctx: CanvasRenderingContext2D,
    time: number,
    box: Box,
    width: number,
    height: number,
    tier: string,
    company?: string,
    cardName?: string,
    objectives?: readonly string[],
    reduceMotion = false
  ): void {
    // 1. Chat log
    const vis = calls
      .filter((c) => time >= c.t0 && time - c.t0 < 5000)
      .slice(width < 900 ? -2 : -5);

    const objsSet = new Set(
      objectives && objectives.length > 0 ? objectives : ["gtm"]
    );
    const sel = OBJECTIVES.filter((o) => objsSet.has(o.id));
    const objsSig = sel.map((o) => o.id).join(",");
    if (tier === "squad" && sel.length > 0) {
      if (objsSig !== lastObjsSig || !encCur || !objsSet.has(encCur)) {
        lastObjsSig = objsSig;
        encCur = sel[0]!.id;
        encT0 = time;
      } else if (sel.length > 1 && time - encT0 > 11000 && !reduceMotion) {
        const idx = sel.findIndex((o) => o.id === encCur);
        encCur = sel[(idx + 1) % sel.length]!.id;
        encT0 = time;
      }
    }

    // Draw boss bar in squad mode (reference drawBoss lines 12859-12895)
    if (tier === "squad" && encCur && encCur in ENCD) {
      const d = ENCD[encCur as keyof typeof ENCD];
      const idx = Math.max(
        0,
        sel.findIndex((o) => o.id === encCur)
      );
      const bwBoss = Math.min(440, box.w * 0.62);
      const bx = box.cx - bwBoss / 2;
      const by = box.y0 + (width < 900 ? 10 : 16);
      const cyc = ((time - encT0) / 11000) % 1;
      const hp = Math.max(0.06, 1 - cyc * 0.9);
      const hit = Math.sin(time / 180) > 0.85;
      const russoBoss = resolveFont("--font-russo-one", '"Russo One"');
      const monoBoss = resolveFont("--font-jetbrains-mono", '"JetBrains Mono"');
      ctx.textAlign = "center";
      ctx.font = `400 15px ${russoBoss}, sans-serif`;
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#0B0E15";
      ctx.strokeText(d.boss.toUpperCase(), box.cx, by + 12);
      ctx.fillStyle = "#F2EFE8";
      ctx.fillText(d.boss.toUpperCase(), box.cx, by + 12);
      ctx.fillStyle = "rgba(11,14,21,.85)";
      ctx.fillRect(bx - 3, by + 19, bwBoss + 6, 16);
      ctx.fillStyle = "#3A1A20";
      ctx.fillRect(bx, by + 22, bwBoss, 10);
      ctx.fillStyle = hit ? "#FFFFFF" : "#EE004E";
      ctx.fillRect(bx, by + 22, bwBoss * hp, 10);
      ctx.fillStyle = "rgba(255,255,255,.25)";
      ctx.fillRect(bx, by + 22, bwBoss * hp, 3);
      ctx.strokeStyle = "#ECE6D6";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(bx - 3, by + 19, bwBoss + 6, 16);
      ctx.font = `700 10px ${monoBoss}, monospace`;
      ctx.fillStyle = "#F2B33A";
      ctx.fillText(
        `${d.team.toUpperCase()} · ENCOUNTER ${idx + 1}/${sel.length}`,
        box.cx,
        by + 50
      );
    }

    const oy = tier === "squad" && encCur ? 62 : 0;

    if (vis.length > 0) {
      const monoFont = resolveFont("--font-jetbrains-mono", '"JetBrains Mono"');
      ctx.font = `600 11px ${monoFont}, monospace`;
      ctx.textAlign = "left";
      const lh = 17;
      const bw = Math.min(420, box.w - 16);

      ctx.fillStyle = "rgba(12,14,20,.62)";
      ctx.fillRect(box.x0 + 2, box.y0 + 4 + oy, bw, vis.length * lh + 10);

      for (let i = 0; i < vis.length; i++) {
        const c = vis[i]!;
        const age = time - c.t0;
        ctx.globalAlpha = age > 4300 ? Math.max(0, 1 - (age - 4300) / 700) : 1;
        const [tag, col] = KIND[c.kind] || KIND.sys!;
        const y = box.y0 + 20 + oy + i * lh;

        ctx.fillStyle = col;
        ctx.fillText(tag, box.x0 + 10, y);
        const tw = ctx.measureText(tag + " ").width;
        ctx.fillStyle = "#F2EFE8";
        ctx.fillText(c.txt, box.x0 + 10 + tw, y);
      }
      ctx.globalAlpha = 1;
    }

    // 2. Part rings
    for (let i = 0; i < rings.length; i++) {
      const r = rings[i]!;
      const age = time - r.t0;
      if (age <= 650) {
        const a = 1 - age / 650;
        ctx.strokeStyle = `rgba(242,179,58,${a})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(box.cx, box.cy, 16 + age * 0.1, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // 3. Form Big Moments
    if (formT > 0) {
      const s = time - formT;
      if (s > 0 && s < 1000) {
        const a = (1 - s / 1000) * 0.3;
        const r2 = Math.hypot(width, height);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        for (let i = 0; i < 40; i++) {
          const an = (i * Math.PI) / 20 + s / 2000;
          const r1 = Math.min(box.w, box.h) * 0.42;
          ctx.beginPath();
          ctx.moveTo(box.cx + Math.cos(an) * r1, box.cy + Math.sin(an) * r1);
          ctx.lineTo(
            box.cx + Math.cos(an - 0.012) * r2,
            box.cy + Math.sin(an - 0.012) * r2
          );
          ctx.lineTo(
            box.cx + Math.cos(an + 0.012) * r2,
            box.cy + Math.sin(an + 0.012) * r2
          );
          ctx.closePath();
          ctx.fill();
        }
      }

      if (s > 1050 && s < 1350) {
        ctx.fillStyle = `rgba(255,255,255,${(1 - (s - 1050) / 300) * 0.55})`;
        ctx.fillRect(0, 0, width, height);
      }

      if (s > 1100 && s < 4300) {
        const a = s < 1350 ? (s - 1100) / 250 : s > 3600 ? (4300 - s) / 700 : 1;
        const word =
          TIERS[tier as keyof typeof TIERS]?.word ?? tier.toUpperCase();
        const fs = Math.min(96, box.w / (word.length * 0.62));
        ctx.save();
        ctx.globalAlpha = Math.max(0, a);
        ctx.translate(box.cx, box.y0 + box.h * 0.86);
        ctx.transform(1, 0, -0.16, 1, 0, 0);
        const russoFont = resolveFont("--font-russo-one", '"Russo One"');
        const monoFont = resolveFont(
          "--font-jetbrains-mono",
          '"JetBrains Mono"'
        );
        ctx.font = `400 ${fs}px ${russoFont}, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillStyle = "#8F0030";
        ctx.fillText(word, 5, 5);
        ctx.lineJoin = "round";
        ctx.lineWidth = fs * 0.08;
        ctx.strokeStyle = "#141624";
        ctx.strokeText(word, 0, 0);
        ctx.fillStyle = "#F2EDE1";
        ctx.fillText(word, 0, 0);
        ctx.font = `700 12px ${monoFont}, monospace`;
        ctx.fillStyle = "#5FD39B";
        ctx.fillText(
          `${cardName || tier.toUpperCase()} · Guild: ${company || "your company"}`,
          0,
          26
        );
        ctx.restore();
      }
    }
  }

  function dispose(): void {
    calls.length = 0;
    rings.length = 0;
    formT = 0;
  }

  return {
    call,
    ring,
    triggerForm,
    getFormT,
    render,
    dispose,
  };
}
