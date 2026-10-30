/**
 * Shared domain types for Concepful Mech Builder content modules.
 * Derived verbatim from data structures in reference/Concepful_Mech_Builder.html.
 */

/**
 * Tier identifier (game modes in configurator).
 * Source: TIERS (lines 2288-2328)
 */
export type TierId = "solo" | "squad" | "combine";

/**
 * Game mode / pricing tier definition.
 * Source: TIERS
 */
export interface Tier {
  readonly pitch: string;
  readonly name: string;
  readonly sub: string;
  readonly base: number;
  readonly one: boolean;
  readonly popular?: boolean;
  readonly min?: string;
  readonly d: string;
  readonly motto: string;
  readonly fu: string;
  readonly word: string;
}

/**
 * Quest / solo mission identifier.
 * Source: QUESTS (lines 2329-2402)
 */
export type QuestId =
  "brand" | "web" | "uiux" | "decks" | "copy" | "motion" | "3d" | "fab" | "ai";

/**
 * Solo mission item in QUESTS table.
 * Source: QUESTS
 */
export interface Quest {
  readonly id: QuestId;
  readonly name: string;
  readonly desc: string;
  readonly hero: string;
  readonly cls: string;
  readonly p: number;
}

/**
 * Gear / addon extra identifier for solo mode.
 * Source: GEAR (lines 2403-2426)
 */
export type GearId = "x-illus" | "x-motion" | "x-rush";

/**
 * Gear / addon extra item in GEAR table.
 * Source: GEAR
 */
export interface GearItem {
  readonly id: GearId;
  readonly name: string;
  readonly desc: string;
  readonly fx: string;
  readonly p: number;
  readonly not?: QuestId;
}

/**
 * Squad objective identifier.
 * Source: OBJECTIVES (lines 2428-2457)
 */
export type ObjectiveId = "gtm" | "dir" | "research" | "product";

/**
 * Squad objective item in OBJECTIVES table.
 * Source: OBJECTIVES
 */
export interface Objective {
  readonly id: ObjectiveId;
  readonly name: string;
  readonly say: string;
  readonly desc: string;
  readonly roster: readonly UnitId[];
}

/**
 * Raid buff identifier.
 * Source: BUFFS (lines 2459-2509)
 */
export type BuffId = "3d" | "fab" | "hw" | "flow" | "cmd" | "intel" | "rush";

/**
 * Raid buff item in BUFFS table.
 * Source: BUFFS
 */
export interface Buff {
  readonly id: BuffId;
  readonly name: string;
  readonly desc: string;
  readonly fx: string;
  readonly p: number;
}

/**
 * Ship class / scale reach identifier.
 * Source: CLASSES (lines 2510-2543)
 */
export type ClassId = "local" | "regional" | "national" | "global";

/**
 * Ship class item in CLASSES table.
 * Source: CLASSES
 */
export interface ShipClass {
  readonly id: ClassId;
  readonly ship: string;
  readonly code: string;
  readonly zone: string;
  readonly desc: string;
  readonly p: number;
}

/**
 * Unit identifier (across heroes, companions, base units, and buff units).
 * Source: TEAMOF (lines 2544-2564), UNITS (lines 4749-4769)
 */
export type UnitId =
  | "pos"
  | "gtm"
  | "dir"
  | "naming"
  | "research"
  | "brand"
  | "uiux"
  | "decks"
  | "copy"
  | "illus"
  | "web"
  | "motion"
  | "3d"
  | "fab"
  | "hw"
  | "pm"
  | "ws"
  | "cmd"
  | "intel";

/**
 * Discipline / MMO role identifier.
 * Source: ROLE (lines 2565-2570)
 */
export type RoleId = "strategy" | "design" | "production" | "ops";

/**
 * Role definition tuple: [Role title, CSS color variable, Role badge initial].
 * Source: ROLE
 */
export type RoleTuple = readonly [title: string, color: string, badge: string];

/**
 * Non-visual unit metadata extracted from UNITS.
 * Source: UNITS (lines 4749-4769)
 * Note: Procedural 2D render function `f` is omitted as scene code dependency for Phase 4/5.
 */
export interface UnitMetadata {
  readonly id: UnitId;
  readonly name: string;
  readonly size: number;
  readonly w: number;
}

/**
 * Encounter narrative metadata from ENCD.
 * Source: ENCD (lines 12612-12790)
 * Note: Procedural 3D scene build functions are omitted as scene code dependencies for Phase 5.
 */
export interface EncounterMetadata {
  readonly id: ObjectiveId;
  readonly team: string;
  readonly boss: string;
  readonly cam: readonly [x: number, y: number, z: number];
}

/**
 * 3D/2D callout annotation from STAGE_C.
 * Source: STAGE_C (lines 6910-7014)
 */
export interface StageCallout {
  readonly at: readonly [x: number, y: number, z: number];
  readonly h: string;
  readonly d: string;
}

/**
 * Text segment for markup with emphasis spans (e.g. <span>...</span>).
 */
export interface TextSegment {
  readonly text: string;
  readonly em?: boolean;
}

/**
 * Top navigation link definition.
 */
export interface NavLink {
  readonly href: string;
  readonly label: string;
}
