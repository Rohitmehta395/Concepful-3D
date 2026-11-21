import { CLASSES } from "@/content/classes";
import { QUESTS } from "@/content/quests";
import { type ConfigStateInput, normalizeConfigState } from "./config";
import type { Quote } from "./quote";
import { quote } from "./quote";
import { shipFor } from "./ship";

/**
 * Formats a currency amount with US dollar sign and thousands separator.
 * Source: fmt(), line 2577 in reference/Concepful_Mech_Builder.html
 *
 * @param n - Numeric dollar amount
 * @returns Formatted currency string, e.g. "$7,200"
 */
export function fmt(n: number): string {
  return "$" + n.toLocaleString("en-US");
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
