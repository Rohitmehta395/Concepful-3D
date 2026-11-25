import { describe, it, expect, vi } from "vitest";
import * as THREE from "three";
import { createStageManager } from "@/engine/stages/StageManager";
import { createOverlay } from "@/engine/overlay";
import { createMaterialRegistry } from "@/engine/world/materials";
import { createOrbitController } from "@/engine/camera/orbitController";
import { createAppStage } from "@/engine/stages/appStage";
import type { Stage, StageBuildContext } from "@/engine/stages/types";

describe("core engine contracts", () => {
  it("StageManager.registerStage registers and selects a dynamic stage", () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 600);
    const mats = createMaterialRegistry(THREE);
    const canvas = {
      clientWidth: 800,
      clientHeight: 600,
      addEventListener: () => {},
      removeEventListener: () => {},
    } as unknown as HTMLCanvasElement;
    const orbitCtrl = createOrbitController(THREE, canvas, () => {});
    const ctx: StageBuildContext = {
      three: THREE,
      scene,
      mats,
      camera,
      orbitCtrl,
    };

    const manager = createStageManager(scene, ctx, {});
    expect(manager.hasBuilder("dynamic")).toBe(false);

    const group = new THREE.Group();
    const setVisible = vi.fn((v: boolean) => {
      group.visible = v;
    });
    const dispose = vi.fn();
    const mockStage: Stage = {
      key: "dynamic",
      group,
      backgroundTexture: null as unknown as THREE.CanvasTexture,
      fog: null,
      setVisible,
      update: () => {},
      dispose,
    };

    manager.registerStage("dynamic", () => mockStage);
    expect(manager.hasBuilder("dynamic")).toBe(true);

    const selected = manager.select("dynamic");
    expect(selected).toBe(mockStage);
    expect(setVisible).toHaveBeenCalledWith(true);

    manager.dispose();
    expect(dispose).toHaveBeenCalledTimes(1);
    orbitCtrl.dispose();
    mats.dispose();
  });

  it("createOverlay exposes ctx on OverlayManager", () => {
    const fakeCtx = {
      createRadialGradient: () => ({ addColorStop: () => {} }),
      setTransform: () => {},
      clearRect: () => {},
      fillRect: () => {},
      fillStyle: "",
    } as unknown as CanvasRenderingContext2D;

    const fakeCanvas = {
      width: 0,
      height: 0,
      getContext: () => fakeCtx,
    } as unknown as HTMLCanvasElement;

    const ov = createOverlay(fakeCanvas);
    expect(ov.ctx).toBe(fakeCtx);
    ov.dispose();
  });

  it("appStage aims camera with unguarded dx wave even when reduceMotion is true", () => {
    vi.stubGlobal("Path2D", class {});
    vi.stubGlobal("document", {
      createElement: () => ({
        getContext: () => ({
          createLinearGradient: () => ({ addColorStop: () => {} }),
          createRadialGradient: () => ({ addColorStop: () => {} }),
          fillRect: () => {},
          strokeRect: () => {},
          beginPath: () => {},
          closePath: () => {},
          moveTo: () => {},
          lineTo: () => {},
          setLineDash: () => {},
          arc: () => {},
          save: () => {},
          restore: () => {},
          translate: () => {},
          scale: () => {},
          fill: () => {},
          stroke: () => {},
          measureText: () => ({ width: 100 }),
          strokeText: () => {},
          fillText: () => {},
          bezierCurveTo: () => {},
          clip: () => {},
        }),
      }),
    });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1.6, 0.1, 600);
    const mats = createMaterialRegistry(THREE);
    const canvas = {
      clientWidth: 1280,
      clientHeight: 800,
      addEventListener: () => {},
      removeEventListener: () => {},
    } as unknown as HTMLCanvasElement;
    const orbitCtrl = createOrbitController(THREE, canvas, () => {});
    const aimSpy = vi.spyOn(orbitCtrl, "aim");

    const stage = createAppStage({
      three: THREE,
      scene,
      mats,
      camera,
      orbitCtrl,
    });

    const box = {
      x0: 0,
      x1: 1280,
      y0: 0,
      y1: 800,
      w: 1280,
      h: 800,
      cx: 640,
      cy: 400,
    };
    const t = 6283; // Math.sin(6283 / 4000) ~= 1
    stage.update({
      t,
      dt: 0,
      p: 0,
      kk: 1,
      box,
      viewportH: 800,
      reduceMotion: true,
    });

    expect(aimSpy).toHaveBeenCalledTimes(1);
    const dxArg = aimSpy.mock.calls[0]![4];
    expect(dxArg).toBeCloseTo(0.15 + Math.sin(t / 4000) * 0.12, 6);

    stage.dispose();
    orbitCtrl.dispose();
    mats.dispose();
    vi.unstubAllGlobals();
  });
});
