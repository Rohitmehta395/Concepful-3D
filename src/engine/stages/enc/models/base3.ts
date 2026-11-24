import type * as THREE from "three";
import type { MaterialRegistry } from "../../../world/materials";
import { Cy, Tor, Co, Ic, mk, glowS } from "../../../world/geometry";
import { HX } from "../../../world/materials";
import { BR } from "./br";

/**
 * base3: Creates circular diorama arena plinth with torus ring, inverted cone, debris rocks, and glow.
 * Source: reference lines 12046-12091.
 */
export function base3(
  three: typeof THREE,
  mats: MaterialRegistry,
  g: THREE.Group,
  r: number
): void {
  mk(
    three,
    mats,
    g,
    Cy(three, r, r + 0.4, 0.6, 12),
    mats.tm(BR.slate),
    [0, -0.3, 0],
    null,
    null,
    false
  );
  mk(
    three,
    mats,
    g,
    Tor(three, r + 0.05, 0.07, 3, 64),
    mats.bm(HX.red),
    [0, 0.01, 0],
    [Math.PI / 2, 0, 0],
    null,
    false
  );
  mk(
    three,
    mats,
    g,
    Co(three, r * 0.85, 3, 10),
    mats.tm(0x23272f),
    [0, -2.1, 0],
    [Math.PI, 0, 0],
    null,
    false
  );
  for (let i = 0; i < 5; i++) {
    const a = i * 1.3;
    mk(
      three,
      mats,
      g,
      Ic(three, 0.4 + (i % 2) * 0.3),
      mats.tm(BR.slate2),
      [Math.cos(a) * (r + 1.5), -1.5 - (i % 3) * 0.6, Math.sin(a) * (r + 1.5)],
      null,
      null,
      false
    );
  }
  glowS(three, mats, g, [0, -2.6, 0], r * 1.6, HX.red);
}
