import type { BuffId, ClassId } from "@/content/types";

/**
 * Calculates flagship vessel reach / tier based on the active raid buffs count.
 * Source: shipFor(), lines 14742-14751 in reference/Concepful_Mech_Builder.html
 *
 * @param buffs - Active raid buff identifiers (Set or Array)
 * @returns Ship class reach ("local" | "regional" | "national" | "global")
 */
export function shipFor(
  buffs: ReadonlySet<BuffId> | readonly BuffId[]
): ClassId {
  const n = "size" in buffs ? buffs.size : buffs.length;
  return n === 0
    ? "local"
    : n <= 2
      ? "regional"
      : n <= 4
        ? "national"
        : "global";
}
