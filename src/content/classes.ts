import type { ShipClass } from "./types";

/**
 * Flagship vessel tiers and reach definitions.
 * Source: CLASSES (lines 2510-2543 in reference/Concepful_Mech_Builder.html)
 */
export const CLASSES: readonly ShipClass[] = [
  {
    id: "local",
    ship: "Sub vessel",
    code: "ABYSS-01",
    zone: "Local zone",
    desc: "One city or one market. Runs deep and quiet.",
    p: 0,
  },
  {
    id: "regional",
    ship: "Sky cruiser",
    code: "SKY-07 Relay",
    zone: "Regional zone",
    desc: "Multi-city, state or territory.",
    p: 1000,
  },
  {
    id: "national",
    ship: "Titan mech",
    code: "TTN-12 Longitude",
    zone: "National zone",
    desc: "Coast to coast. Five vehicles combine into one titan.",
    p: 2500,
  },
  {
    id: "global",
    ship: "Mothership",
    code: "CS-99 Context",
    zone: "Global zone",
    desc: "Every market, every language, full fleet.",
    p: 5000,
  },
] as const;
