"use client";

import { useEffect, useRef } from "react";
import { createEngine, hasWebGL, type Engine } from "@/engine";

export function SceneHost() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!hasWebGL()) {
      console.warn("WebGL is not supported or disabled in this browser.");
      return;
    }

    let engine: Engine | null = null;
    let isMounted = true;

    // Dynamically import Three.js r128 after hydration so it is not in the initial bundle
    import("three")
      .then((three) => {
        if (!isMounted || !canvasRef.current) return;
        engine = createEngine(canvasRef.current, three, {
          overlayCanvas: overlayRef.current,
        });
        engine.start();

        // Gated test hooks: exposed only when NEXT_PUBLIC_E2E === "1"
        if (
          process.env.NEXT_PUBLIC_E2E === "1" &&
          typeof window !== "undefined"
        ) {
          const win = window as unknown as Record<string, unknown>;
          win.__CONCEPFUL_ENGINE__ = engine;
          win.__CONCEPFUL_CREATE__ = (c: HTMLCanvasElement) =>
            createEngine(c, three);
          win.__CONCEPFUL_STRICT_CYCLE__ = async () => {
            const [{ StrictMode, createElement }, { createRoot }] =
              await Promise.all([import("react"), import("react-dom/client")]);
            const host = document.createElement("div");
            host.style.cssText =
              "position:fixed;inset:0;width:1280px;height:800px;pointer-events:none;opacity:0;";
            document.body.appendChild(host);
            const root = createRoot(host);
            const prevEng = win.__CONCEPFUL_ENGINE__;
            root.render(
              createElement(StrictMode, null, createElement(SceneHost))
            );
            for (let w = 0; w < 50; w++) {
              await new Promise((r) => setTimeout(r, 10));
              if (
                win.__CONCEPFUL_ENGINE__ &&
                win.__CONCEPFUL_ENGINE__ !== prevEng
              ) {
                break;
              }
            }
            const activeEng = win.__CONCEPFUL_ENGINE__ as Engine | undefined;
            const pre = activeEng
              ? {
                  geometries: activeEng.renderer.info.memory.geometries,
                  textures: activeEng.renderer.info.memory.textures,
                }
              : null;
            root.unmount();
            host.remove();
            const post = activeEng
              ? {
                  isContextLost: activeEng.renderer
                    .getContext()
                    .isContextLost(),
                  geometries: activeEng.renderer.info.memory.geometries,
                  textures: activeEng.renderer.info.memory.textures,
                  programs: activeEng.renderer.info.programs?.length ?? -1,
                }
              : null;
            return { pre, post };
          };
          win.__CONCEPFUL_BENCH__ = async (
            kind: "u3" | "h3" | "mjet" | "plinth" | "label",
            id: string,
            yawDeg: number,
            t: number
          ) => {
            const [uMod, hCMod, gMod, mMod] = await Promise.all([
              import("@/engine/models/uUnits"),
              import("@/engine/models/hVehiclesC"),
              import("@/engine/world/geometry"),
              import("@/engine/world/materials"),
            ]);
            const sc = new three.Scene();
            sc.background = new three.Color(0x12161e);
            sc.add(new three.AmbientLight(0xa9acda, 0.6));
            const d1 = new three.DirectionalLight(0xffffff, 0.62);
            d1.position.set(-4, 8, 10);
            sc.add(d1);
            const d2 = new three.DirectionalLight(0xff7fa6, 0.22);
            d2.position.set(6, -2, -6);
            sc.add(d2);
            const cam = new three.PerspectiveCamera(30, 1, 0.1, 600);
            cam.position.set(0, 2.5, 11);
            cam.lookAt(0, 2.0, 0);
            const mats = mMod.createMaterialRegistry(three);
            let obj: import("three").Object3D;
            if (kind === "plinth") {
              const g = new three.Group();
              gMod.hexPlinth(three, mats, g, 4.2);
              obj = g;
            } else if (kind === "label") {
              const sp = gMod.textSprite(
                three,
                "PRODUCT & INTERFACE",
                "#FFFFFF",
                0.55
              );
              sp.position.set(0, 2.0, 0);
              obj = sp;
            } else if (kind === "h3" || kind === "mjet") {
              const v =
                kind === "mjet"
                  ? hCMod.mJet(three, mats)
                  : hCMod.H3[id]!(three, mats);
              v.upd(t, { reduceMotion: true });
              if (v.fl.length > 0) gMod.flick(v.fl, t);
              obj = v.g;
              obj.position.set(0, 1.5, 0);
            } else {
              const map: Record<
                string,
                (
                  th: typeof three,
                  m: import("@/engine/world/materials").MaterialRegistry
                ) => import("@/engine/models/uUnits").UnitHandle
              > = {
                uiux: uMod.uArchitect,
                web: uMod.uForge,
                "3d": uMod.uPrism,
                dir: uMod.uMarshal,
                brand: uMod.uRonin,
                illus: uMod.uFresco,
                gtm: uMod.uKraken,
                decks: uMod.uHerald,
                motion: uMod.uDolly,
                naming: uMod.uStamp,
                research: uMod.uArachne,
                fab: uMod.uGantry,
                hw: uMod.uGoliath,
                intel: uMod.uCortex,
                stamp: uMod.uStamp,
                arachne: uMod.uArachne,
                gantry: uMod.uGantry,
                goliath: uMod.uGoliath,
                cortex: uMod.uCortex,
              };
              const u = map[id]!(three, mats);
              u.upd(t);
              obj = u.g;
            }
            obj.rotation.y = (yawDeg * Math.PI) / 180;
            sc.add(obj);
            engine!.renderer.setSize(800, 800, false);
            engine!.renderer.render(sc, cam);
            sc.traverse((o) => {
              const r = o as unknown as {
                geometry?: { dispose?: () => void };
                material?:
                  { dispose?: () => void } | { dispose?: () => void }[];
              };
              if (r.geometry?.dispose) r.geometry.dispose();
              if (Array.isArray(r.material)) {
                r.material.forEach((m) => m.dispose?.());
              } else if (r.material?.dispose) {
                r.material.dispose();
              }
            });
            mats.dispose();
          };
        }
      })
      .catch((err) => {
        console.warn("Failed to initialize WebGL engine:", err);
      });

    return () => {
      isMounted = false;
      if (
        process.env.NEXT_PUBLIC_E2E === "1" &&
        typeof window !== "undefined"
      ) {
        const win = window as unknown as Record<string, unknown>;
        if (win.__CONCEPFUL_ENGINE__ === engine) {
          delete win.__CONCEPFUL_ENGINE__;
          delete win.__CONCEPFUL_CREATE__;
          delete win.__CONCEPFUL_STRICT_CYCLE__;
          delete win.__CONCEPFUL_BENCH__;
        }
      }
      if (engine) {
        engine.dispose();
        engine = null;
      }
    };
  }, []);

  return (
    <>
      <canvas id="gl" ref={canvasRef} aria-hidden="true" />
      <canvas
        id="cv"
        ref={overlayRef}
        aria-label="Animated scene of your build: a hero on a solo mission, a party, or a raid flagship carrying the whole team"
      />
    </>
  );
}
