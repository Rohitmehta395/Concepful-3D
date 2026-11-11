/**
 * WebGL Detection and Support Helper
 */

/**
 * Probes whether WebGL is functional using a detached canvas,
 * and immediately releases the context with WEBGL_lose_context
 * so no resources or contexts leak.
 * SceneHost must not pre-create a context on the real #gl canvas.
 */
export function hasWebGL(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    if (!window.WebGLRenderingContext) {
      return false;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;

    const gl = (canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")) as
      WebGLRenderingContext | WebGL2RenderingContext | null;

    if (!gl) {
      return false;
    }

    // Verify shader precision format (guards against virtualized/headless null return)
    if (typeof gl.getShaderPrecisionFormat === "function") {
      const vPrec = gl.getShaderPrecisionFormat(
        gl.VERTEX_SHADER,
        gl.HIGH_FLOAT
      );
      const fPrec = gl.getShaderPrecisionFormat(
        gl.FRAGMENT_SHADER,
        gl.HIGH_FLOAT
      );
      if (!vPrec || !fPrec || typeof vPrec.precision !== "number") {
        return false;
      }
    }

    // Immediately release the context on the detached probe canvas
    const loseContext = gl.getExtension("WEBGL_lose_context");
    if (loseContext) {
      loseContext.loseContext();
    }

    return true;
  } catch {
    return false;
  }
}
