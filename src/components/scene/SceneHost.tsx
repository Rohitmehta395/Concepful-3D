"use client";

import { useEffect, useRef } from "react";
import { createEngine, hasWebGL, type Engine } from "@/engine";

declare global {
  interface Window {
    __CONCEPFUL_ENGINE__?: Engine;
  }
}

export function SceneHost() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!hasWebGL(canvas)) {
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
          window.__CONCEPFUL_ENGINE__ = engine;
        }
      })
      .catch((err) => {
        console.warn("Failed to initialize WebGL engine:", err);
      });

    return () => {
      isMounted = false;
      if (
        process.env.NEXT_PUBLIC_E2E === "1" &&
        typeof window !== "undefined" &&
        window.__CONCEPFUL_ENGINE__ === engine
      ) {
        delete window.__CONCEPFUL_ENGINE__;
      }
      if (engine) {
        engine.dispose();
        engine = null;
      }
    };
  }, []);

  return <canvas id="gl" ref={canvasRef} aria-hidden="true" />;
}
