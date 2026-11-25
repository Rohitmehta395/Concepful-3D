import type * as THREE from "three";
import type { Box } from "../layout";

export interface OverlayBuildState {
  readonly tier?: string;
  readonly mission?: string;
  readonly reach?: string;
  readonly objective?: string;
  readonly objectives?: readonly string[];
  readonly buffs?: readonly string[];
  readonly leader?: string;
}

export interface PatchManager {
  readonly canvas: HTMLCanvasElement;
  renderPatch: (
    time: number,
    buildState: OverlayBuildState,
    reduceMotion?: boolean
  ) => void;
  drawPatch: (
    targetCanvas: HTMLCanvasElement,
    time: number,
    buildState: OverlayBuildState
  ) => void;
  update: (
    time: number,
    buildState: OverlayBuildState,
    reduceMotion?: boolean
  ) => void;
  getPortraitCanvas: () => HTMLCanvasElement;
  getPortraitBuffer: () => Uint8Array;
  isReady: () => boolean;
  dispose: () => void;
}

export interface EnvbManager {
  readonly group: THREE.Group;
  setMission: (missionKey: string) => void;
  update: (t: number, dt: number, reduceMotion: boolean) => void;
  dispose: () => void;
}

export interface HudManager {
  call: (
    txt: string,
    kind?: "sys" | "party" | "loot" | "quest",
    delay?: number
  ) => void;
  ring: (key: string) => void;
  triggerForm: () => void;
  render: (
    ctx: CanvasRenderingContext2D,
    time: number,
    box: Box,
    width: number,
    height: number,
    tier: string,
    company?: string
  ) => void;
  dispose: () => void;
}
