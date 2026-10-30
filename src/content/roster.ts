import type { UnitId, UnitMetadata } from "./types";

/**
 * Non-visual companion and hero unit roster metadata.
 * Source: UNITS (lines 4749-4769 in reference/Concepful_Mech_Builder.html)
 * Note: Procedural 2D render callback `f` is omitted as scene rendering code for Phase 4/5.
 */
export const UNITS = {
  pos: { id: "pos", name: "Lancer", size: 2, w: 240 },
  gtm: { id: "gtm", name: "Kraken", size: 3, w: 300 },
  dir: { id: "dir", name: "Marshal", size: 2, w: 210 },
  naming: { id: "naming", name: "Stamp", size: 1, w: 150 },
  research: { id: "research", name: "Arachne", size: 2, w: 280 },
  brand: { id: "brand", name: "Ronin", size: 2, w: 210 },
  uiux: { id: "uiux", name: "Architect", size: 2, w: 260 },
  decks: { id: "decks", name: "Herald", size: 2, w: 175 },
  copy: { id: "copy", name: "Quill", size: 1, w: 190 },
  illus: { id: "illus", name: "Fresco", size: 1, w: 200 },
  web: { id: "web", name: "Forge", size: 2, w: 260 },
  motion: { id: "motion", name: "Dolly", size: 1, w: 130 },
  "3d": { id: "3d", name: "Prism", size: 1, w: 120 },
  fab: { id: "fab", name: "Gantry", size: 3, w: 250 },
  hw: { id: "hw", name: "Goliath", size: 3, w: 260 },
  pm: { id: "pm", name: "Nexus", size: 3, w: 280 },
  ws: { id: "ws", name: "Hub", size: 2, w: 200 },
  cmd: { id: "cmd", name: "Watchtower", size: 2, w: 160 },
  intel: { id: "intel", name: "Cortex", size: 2, w: 165 },
} as const satisfies Record<UnitId, UnitMetadata>;
