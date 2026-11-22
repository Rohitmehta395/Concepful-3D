import { CLASSES } from "@/content/classes";
import { GEAR } from "@/content/gear";
import { QUESTS } from "@/content/quests";
import { ROLE, TEAMOF } from "@/content/roles";
import { UNITS } from "@/content/roster";
import type { BuffId, GearId, RoleId } from "@/content/types";
import { type ConfigStateInput, normalizeConfigState } from "./config";
import type { Quote } from "./quote";
import { quote } from "./quote";
import { leaders, units } from "./roster";
import { shipFor } from "./ship";

/**
 * Formats a currency amount with US dollar sign and thousands separator.
 * Source: fmt(), line 2577 in reference/Concepful_Mech_Builder.html
 *
 * @param n - Numeric dollar amount
 * @returns Formatted currency string, e.g. "$7,200"
 */
export function fmt(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

/**
 * Derives the billing period / savings subtitle label for the #prs element.
 * Source: refresh(), lines 14782-14786 in reference/Concepful_Mech_Builder.html:
 * $("prs").textContent = T.one ? "fixed fee" : q.disc ? `annual · saves ${fmt(q.disc)}/mo` : "per month";
 *
 * @param quoteOrState - Quote object or ConfigStateInput
 * @returns Billing label ("fixed fee" | "annual · saves $X/mo" | "per month")
 */
export function prsLabelFor(quoteOrState: Quote | ConfigStateInput): string {
  const q: Quote = "total" in quoteOrState ? quoteOrState : quote(quoteOrState);
  if (q.T.one) {
    return "fixed fee";
  }
  if (q.disc > 0) {
    return "annual · saves " + fmt(q.disc) + "/mo";
  }
  return "per month";
}

/**
 * Derives hero or flagship name for the #cn element.
 * Source: refresh(), lines 14818-14822 in reference/Concepful_Mech_Builder.html:
 * $("cn").textContent = solo ? qq.hero : tier === "squad" ? "Full Crew" : cls.ship;
 *
 * @param state - Current configurator state
 * @returns Hero or ship display name
 */
export function heroNameFor(state: ConfigStateInput): string {
  const s = normalizeConfigState(state);
  if (s.tier === "solo") {
    const qq = QUESTS.find((q) => q.id === s.mission);
    return qq ? qq.hero : "";
  }
  if (s.tier === "squad") {
    return "Full Crew";
  }
  const reach = s.tier === "combine" ? shipFor(s.buffs) : s.reach;
  const cls = CLASSES.find((c) => c.id === reach);
  return cls ? cls.ship : "";
}

/**
 * Derives the formatted price string with optional monthly suffix for the #pr element.
 * Source: refresh(), lines 14778-14781 in reference/Concepful_Mech_Builder.html:
 * const per = T.one ? "" : "/mo";
 * $("pr").textContent = fmt(q.total) + per;
 *
 * @param quoteOrState - Quote object or ConfigStateInput
 * @returns Formatted price, e.g. "$7,200/mo" or "$12,200"
 */
export function priceLabelFor(quoteOrState: Quote | ConfigStateInput): string {
  const q: Quote = "total" in quoteOrState ? quoteOrState : quote(quoteOrState);
  const per = q.T.one ? "" : "/mo";
  return fmt(q.total) + per;
}

/**
 * Derives card header description for #chd.
 * Source: refresh(), lines 14812-14816 in reference/Concepful_Mech_Builder.html:
 * $("chd").textContent = solo ? "Character" : tier === "squad" ? "Crew · " + us.length : "Raid · " + us.length;
 */
export function cardHeaderDescFor(state: ConfigStateInput): string {
  const s = normalizeConfigState(state);
  if (s.tier === "solo") return "Character";
  const us = units(s);
  return s.tier === "squad" ? `Crew · ${us.length}` : `Raid · ${us.length}`;
}

/**
 * Derives card class/leadership description for #cc.
 * Source: refresh(), lines 14823-14828 in reference/Concepful_Mech_Builder.html:
 * $("cc").textContent = solo ? `Class: ${qq.cls} · ${qq.name}` : tier === "squad" ? [...leaders()].map((id) => UNITS[id].name).join(" · ") + " leading" : `${cls.code} · ${cls.zone}`;
 */
export function cardClassDescFor(state: ConfigStateInput): string {
  const s = normalizeConfigState(state);
  if (s.tier === "solo") {
    const qq = QUESTS.find((q) => q.id === s.mission);
    return qq ? `Class: ${qq.cls} · ${qq.name}` : "";
  }
  if (s.tier === "squad") {
    const lead = leaders(s);
    return [...lead].map((id) => UNITS[id].name).join(" · ") + " leading";
  }
  const reach = s.tier === "combine" ? shipFor(s.buffs) : s.reach;
  const cls = CLASSES.find((c) => c.id === reach);
  return cls ? `${cls.code} · ${cls.zone}` : "";
}

/**
 * Derives the 5 stat tuples for #stats.
 * Source: refresh(), lines 14829-14856 in reference/Concepful_Mech_Builder.html
 */
export function statsFor(
  state: ConfigStateInput
): readonly [string, string, number][] {
  const s = normalizeConfigState(state);
  const solo = s.tier === "solo";
  const us = units(s);
  const reach = s.tier === "combine" ? shipFor(s.buffs) : s.reach;
  const cls = CLASSES.find((c) => c.id === reach);
  const clsIdx = cls ? CLASSES.indexOf(cls) : 0;
  const cnt = (k: RoleId) => us.filter((id) => TEAMOF[id] === k).length;
  const desQ = ["brand", "uiux", "decks", "copy"].includes(s.mission);
  const exOn = (id: GearId) =>
    solo &&
    s.extras.has(id) &&
    GEAR.find((e) => e.id === id)?.not !== s.mission;
  const bfOn = (id: BuffId) => s.tier === "combine" && s.buffs.has(id);

  if (solo) {
    return [
      ["INT", "Strategy", 2],
      ["DEX", "Design", (desQ ? 7 : 2) + (exOn("x-illus") ? 2 : 0)],
      ["STR", "Production", (desQ ? 2 : 7) + (exOn("x-motion") ? 2 : 0)],
      ["STA", "Operations", 2],
      ["SPD", "Speed", exOn("x-rush") ? 10 : 6],
    ];
  }
  return [
    ["INT", "Strategy", Math.min(10, cnt("strategy") * 3)],
    ["DEX", "Design", Math.min(10, cnt("design") * 2)],
    ["STR", "Production", Math.min(10, cnt("production") * 3)],
    [
      "STA",
      "Operations",
      Math.min(10, cnt("ops") * 2 + (bfOn("flow") ? 2 : 0)),
    ],
    ["RNG", "Reach", s.tier === "combine" ? ([3, 5, 8, 10][clsIdx] ?? 2) : 2],
  ];
}

export interface PartyFrame {
  readonly id: string;
  readonly name: string;
  readonly roleName: string;
  readonly badge: string;
  readonly badgeBg: string;
  readonly hp: number;
  readonly mp: number;
}

export interface PartyData {
  readonly total: number;
  readonly frames: readonly PartyFrame[];
  readonly moreCount: number;
}

/**
 * Derives party frames metadata for #party.
 * Source: refresh(), lines 14863-14881 in reference/Concepful_Mech_Builder.html
 */
export function partyFor(state: ConfigStateInput): PartyData | null {
  const s = normalizeConfigState(state);
  if (s.tier === "solo") return null;
  const us = units(s);
  const lead = leaders(s);
  const list = us
    .slice()
    .sort((a, b) => (lead.has(b) ? 1 : 0) - (lead.has(a) ? 1 : 0));

  const frames: PartyFrame[] = list.slice(0, 4).map((id, i) => {
    const roleKey = TEAMOF[id];
    const r = ROLE[roleKey];
    const hp = 72 + ((id.length * 17 + i * 13) % 28);
    const mp = 40 + ((id.length * 29 + i * 7) % 60);
    return {
      id,
      name: UNITS[id].name,
      roleName: r[0],
      badge: lead.has(id) ? "★" : r[2],
      badgeBg: r[1],
      hp,
      mp,
    };
  });

  return {
    total: us.length,
    frames,
    moreCount: list.length > 4 ? list.length - 4 : 0,
  };
}
