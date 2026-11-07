import { SECTION_IDS } from "@/content/sections";

/**
 * Static Build Section Skeleton.
 *
 * Source: reference/Concepful_Mech_Builder.html (lines 2189-2194)
 * Serves as the landing anchor (#build) and scroll container for the
 * interactive configurator (Phase 6). In static story mode, this section
 * is an empty 100vh skeleton element.
 */
export function Build() {
  return (
    <section
      className="app-sec"
      data-scene="app"
      id={SECTION_IDS.build}
      aria-label="Build your department"
    />
  );
}
