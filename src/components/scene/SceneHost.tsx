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

        // Gated test hook: exposed only when NEXT_PUBLIC_E2E === "1"
        if (
          process.env.NEXT_PUBLIC_E2E === "1" &&
          typeof window !== "undefined"
        ) {
          const k = window ? "CONCEPFUL" : "";
          (window as unknown as Record<string, unknown>)[`__${k}_ENGINE__`] =
            engine;
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
