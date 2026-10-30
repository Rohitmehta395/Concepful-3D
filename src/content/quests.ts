import type { Quest } from "./types";

/**
 * Solo mission definitions.
 * Source: QUESTS (lines 2329-2402 in reference/Concepful_Mech_Builder.html)
 */
export const QUESTS: readonly Quest[] = [
  {
    id: "brand",
    name: "Brand identity",
    desc: "Logo, system, guidelines.",
    hero: "Laser Dolphin",
    cls: "Striker",
    p: 0,
  },
  {
    id: "web",
    name: "Website or landing page",
    desc: "Site, landing page, dashboard or docs.",
    hero: "Grid Manta",
    cls: "Builder",
    p: 0,
  },
  {
    id: "uiux",
    name: "UI/UX & product design",
    desc: "Flows, screens, clickable prototype.",
    hero: "Pixel Owl",
    cls: "Seer",
    p: 0,
  },
  {
    id: "decks",
    name: "Pitch or sales deck",
    desc: "Investor, sales or keynote deck.",
    hero: "Pitch Hawk",
    cls: "Herald",
    p: 0,
  },
  {
    id: "copy",
    name: "Campaign & copy",
    desc: "Messaging, headlines, campaign copy.",
    hero: "Broadcast Jelly",
    cls: "Bard",
    p: 0,
  },
  {
    id: "motion",
    name: "Motion piece",
    desc: "Animation, reel or launch video.",
    hero: "Reel Dragonfly",
    cls: "Ranger",
    p: 2000,
  },
  {
    id: "3d",
    name: "3D visualization",
    desc: "Models, renders, product visuals.",
    hero: "Prism Turtle",
    cls: "Conjurer",
    p: 3500,
  },
  {
    id: "fab",
    name: "Prototype & fabrication",
    desc: "3D-printed prototype or physical mockup.",
    hero: "Forge Beetle",
    cls: "Artisan",
    p: 2500,
  },
  {
    id: "ai",
    name: "AI workflow setup",
    desc: "One workflow, built and handed off.",
    hero: "Quad Drone",
    cls: "Technomancer",
    p: 3500,
  },
] as const;
