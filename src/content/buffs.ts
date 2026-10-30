import type { Buff } from "./types";

/**
 * Raid buff definitions.
 * Source: BUFFS (lines 2459-2509 in reference/Concepful_Mech_Builder.html)
 */
export const BUFFS: readonly Buff[] = [
  {
    id: "3d",
    name: "3D visualization",
    desc: "Modeling, renders, product visuals.",
    fx: "Prism joins the raid",
    p: 3000,
  },
  {
    id: "fab",
    name: "Print & fabrication",
    desc: "3D-printed prototypes, physical mockups.",
    fx: "Gantry joins the raid",
    p: 2000,
  },
  {
    id: "hw",
    name: "Robotics & hardware UI",
    desc: "Robotics, spatial, installations.",
    fx: "Goliath joins the raid",
    p: 12000,
  },
  {
    id: "flow",
    name: "Workflow automation",
    desc: "Agent-driven briefing, scheduling, approvals.",
    fx: "Courier drone swarm",
    p: 2500,
  },
  {
    id: "cmd",
    name: "Brand command center",
    desc: "Live brand and competitive monitoring.",
    fx: "Watchtower joins",
    p: 4000,
  },
  {
    id: "intel",
    name: "AI intelligence system",
    desc: "Brand memory, multi-model pipeline, auto-QA.",
    fx: "Cortex joins",
    p: 6000,
  },
  {
    id: "rush",
    name: "Priority rush",
    desc: "12-hour turnaround on any request.",
    fx: "Haste on every unit",
    p: 1500,
  },
] as const;
