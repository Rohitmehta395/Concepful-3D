"use client";

import { useEffect } from "react";
import { computeScroll, type SectionBounds } from "@/engine/scroll";

/**
 * AppModeSync Client Island
 *
 * Toggles `body.app` based on active scene key exactly like original storyScan
 * (reference/Concepful_Mech_Builder.html line 11974:
 * `document.body.classList.toggle("app", mode === "app");`).
 *
 * Operates purely on its own scroll/resize listener using pure `computeScroll`,
 * ensuring it works even when WebGL is unavailable.
 */
export function AppModeSync() {
  useEffect(() => {
    let sections: SectionBounds[] = [];

    const measureSections = () => {
      const elements = Array.from(
        document.querySelectorAll<HTMLElement>("[data-scene]")
      );
      sections = elements.map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          sceneId: el.getAttribute("data-scene") || "",
          top: rect.top + window.scrollY,
          height: rect.height,
        };
      });
    };

    const updateMode = () => {
      if (sections.length === 0) measureSections();
      const state = computeScroll(sections, window.scrollY, window.innerHeight);
      const isApp = state.activeScene === "app";
      document.body.classList.toggle("app", isApp);
    };

    measureSections();
    updateMode();

    const handleScroll = () => {
      updateMode();
    };

    const handleResize = () => {
      measureSections();
      updateMode();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return null;
}
