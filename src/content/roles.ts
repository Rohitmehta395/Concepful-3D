import type { RoleId, RoleTuple, UnitId } from "./types";

/**
 * Mapping of every unit identifier to its MMO discipline / team role.
 * Source: TEAMOF (lines 2544-2564 in reference/Concepful_Mech_Builder.html)
 */
export const TEAMOF = {
  pos: "strategy",
  gtm: "strategy",
  dir: "strategy",
  naming: "strategy",
  research: "strategy",
  brand: "design",
  uiux: "design",
  decks: "design",
  copy: "design",
  illus: "design",
  web: "production",
  motion: "production",
  "3d": "production",
  fab: "production",
  hw: "production",
  pm: "ops",
  ws: "ops",
  cmd: "ops",
  intel: "ops",
} as const satisfies Record<UnitId, RoleId>;

/**
 * Discipline definition tuples: [Role Name, Theme CSS Variable, Single-letter badge].
 * Source: ROLE (lines 2565-2570 in reference/Concepful_Mech_Builder.html)
 */
export const ROLE = {
  strategy: ["Leader", "var(--str)", "L"],
  design: ["DPS", "var(--des)", "D"],
  production: ["Tank", "var(--pro)", "T"],
  ops: ["Support", "var(--ops)", "S"],
} as const satisfies Record<RoleId, RoleTuple>;
