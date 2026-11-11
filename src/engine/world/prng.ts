/**
 * Deterministic PRNG utilities for 3D world reconstruction.
 * Source of truth: reference/Concepful_Mech_Builder.html (lines 10539-10545)
 */

export function createCRND(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

let globalSeed = 42;
export function setRandomSeed(seed: number): void {
  globalSeed = seed;
}

export function seededRandom(): number {
  globalSeed = (globalSeed * 16807) % 2147483647;
  return (globalSeed - 1) / 2147483646;
}
