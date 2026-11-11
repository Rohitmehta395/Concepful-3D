"use client";

import { useEffect, useRef } from "react";
import { createEngine, hasWebGL, type Engine } from "@/engine";

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
    try {
      engine = createEngine(canvas);
      engine.start();
    } catch (err) {
      console.warn("Failed to initialize WebGL engine:", err);
      return;
    }

    return () => {
      if (engine) {
        engine.dispose();
        engine = null;
      }
    };
  }, []);

  return <canvas id="gl" ref={canvasRef} aria-hidden="true" />;
}
