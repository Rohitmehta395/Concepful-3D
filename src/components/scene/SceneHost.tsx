"use client";

import { useEffect, useRef } from "react";
import { createEngine, hasWebGL, type Engine } from "@/engine";

export function SceneHost() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
        engine = createEngine(canvasRef.current, three);
        engine.start();

        // Gated test hooks: exposed only when NEXT_PUBLIC_E2E === "1"
        if (
          process.env.NEXT_PUBLIC_E2E === "1" &&
          typeof window !== "undefined"
        ) {
          const k = window ? "CONCEPFUL" : "";
          const win = window as unknown as Record<string, unknown>;
          win[`__${k}_ENGINE__`] = engine;
          win[`__${k}_CREATE__`] = (c: HTMLCanvasElement) =>
            createEngine(c, three);
          win[`__${k}_STRICT_CYCLE__`] = async () => {
            const [{ StrictMode, createElement }, { createRoot }] =
              await Promise.all([import("react"), import("react-dom/client")]);
            const host = document.createElement("div");
            host.style.cssText =
              "position:fixed;inset:0;width:1280px;height:800px;pointer-events:none;opacity:0;";
            document.body.appendChild(host);
            const root = createRoot(host);
            root.render(
              createElement(StrictMode, null, createElement(SceneHost))
            );
            await new Promise((r) => setTimeout(r, 60));
            const activeEng = win[`__${k}_ENGINE__`] as Engine | undefined;
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
        const k = window ? "CONCEPFUL" : "";
        const hookKey = `__${k}_ENGINE__`;
        if (
          (window as unknown as Record<string, unknown>)[hookKey] === engine
        ) {
          delete (window as unknown as Record<string, unknown>)[hookKey];
        }
      }
      if (engine) {
        engine.dispose();
        engine = null;
      }
    };
  }, []);

  return <canvas id="gl" ref={canvasRef} aria-hidden="true" />;
}
