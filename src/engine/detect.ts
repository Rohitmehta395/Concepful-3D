/**
 * WebGL Detection and Support Helper
 */

/**
 * Checks whether WebGL rendering context is available and functional.
 * Verifies that WebGL can be acquired and shader precision queries succeed,
 * which guards against broken/headless GPU environments where getShaderPrecisionFormat
 * returns null.
 */
export function hasWebGL(targetCanvas?: HTMLCanvasElement | null): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    const canvas = targetCanvas ?? document.createElement("canvas");
    if (!window.WebGLRenderingContext) {
      return false;
    }

    const gl = (canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")) as
      WebGLRenderingContext | WebGL2RenderingContext | null;

    if (!gl) {
      return false;
    }

    // Three.js WebGLCapabilities queries getShaderPrecisionFormat.
    // If the driver or virtualization returns null, Three.js WebGLRenderer throws:
    // TypeError: Cannot read properties of null (reading 'precision')
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

    return true;
  } catch {
    return false;
  }
}
