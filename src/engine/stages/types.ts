import type * as THREE from "three";
import type { Box } from "../layout";
import type { OrbitController } from "../camera/orbitController";
import type { MaterialRegistry } from "../world/materials";
import type { UnitHandle } from "../models/uUnits";

export interface StageUpdateParams {
  readonly t: number;
  readonly dt: number;
  readonly p: number;
  readonly kk: number;
  readonly box: Box;
  readonly viewportH: number;
  readonly reduceMotion: boolean;
}

export interface Stage {
  readonly key: string;
  readonly group: THREE.Group;
  readonly backgroundTexture: THREE.CanvasTexture;
  readonly fog: THREE.Fog | null;
  readonly units?: UnitHandle[];
  setVisible(visible: boolean): void;
  update(params: StageUpdateParams): void;
  dispose(): void;
}

export interface StageBuildContext {
  readonly three: typeof THREE;
  readonly scene: THREE.Scene;
  readonly mats: MaterialRegistry;
  readonly camera: THREE.PerspectiveCamera;
  readonly orbitCtrl: OrbitController;
}

export type StageBuilder = (ctx: StageBuildContext) => Stage;
