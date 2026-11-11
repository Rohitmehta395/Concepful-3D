export interface SectionBounds {
  sceneId: string;
  top: number;
  height: number;
}

export interface ScrollState {
  activeScene: string;
  progress: Record<string, number>;
  activeProgress: number;
  velocity: number;
}

/**
 * Pure calculation of active scene and scroll progress.
 * Formula from original prototype lines 11953-11970:
 * mid = H * 0.5;
 * if (r.top <= mid && r.bottom > mid) {
 *   key = s.dataset.scene;
 *   p = Math.max(0, Math.min(1, (mid - r.top) / Math.max(1, r.height - H * 0.2)));
 * }
 */
export function computeScroll(
  sections: SectionBounds[],
  scrollY: number,
  innerHeight: number,
  lastScrollY = scrollY,
  deltaTimeMs = 16.67
): ScrollState {
  const mid = innerHeight * 0.5;
  let activeScene = "intro";
  let activeProgress = 0;
  const progress: Record<string, number> = {};

  for (const s of sections) {
    // Current viewport position of section top and bottom
    const rTop = s.top - scrollY;
    const rBottom = rTop + s.height;

    // Default per-scene progress normalized relative to middle
    const denominator = Math.max(1, s.height - innerHeight * 0.2);
    const p = Math.max(0, Math.min(1, (mid - rTop) / denominator));
    progress[s.sceneId] = p;

    if (rTop <= mid && rBottom > mid) {
      activeScene = s.sceneId;
      activeProgress = p;
    }
  }

  const dtSec = Math.max(0.001, deltaTimeMs / 1000);
  const velocity = (scrollY - lastScrollY) / dtSec;

  return {
    activeScene,
    progress,
    activeProgress,
    velocity,
  };
}

export interface ScrollDriver {
  measureSections: () => void;
  update: (now?: number) => ScrollState;
  getState: () => ScrollState;
}

export function createScrollDriver(): ScrollDriver {
  let cachedSections: SectionBounds[] = [];
  let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
  let lastTime = typeof performance !== "undefined" ? performance.now() : 0;
  let currentState: ScrollState = {
    activeScene: "intro",
    progress: {},
    activeProgress: 0,
    velocity: 0,
  };

  function measureSections(): void {
    if (typeof document === "undefined") return;
    const scrollY = window.scrollY || 0;
    const elements = document.querySelectorAll("[data-scene]");
    const bounds: SectionBounds[] = [];
    elements.forEach((el) => {
      const sceneId = el.getAttribute("data-scene");
      if (!sceneId) return;
      const rect = el.getBoundingClientRect();
      bounds.push({
        sceneId,
        top: rect.top + scrollY,
        height: rect.height,
      });
    });
    cachedSections = bounds;
  }

  function update(now = performance.now()): ScrollState {
    if (typeof window === "undefined") return currentState;
    const scrollY = window.scrollY || 0;
    const innerHeight = window.innerHeight || 1;
    const dt = Math.min(100, Math.max(1, now - lastTime));

    currentState = computeScroll(
      cachedSections,
      scrollY,
      innerHeight,
      lastScrollY,
      dt
    );

    lastScrollY = scrollY;
    lastTime = now;
    return currentState;
  }

  return {
    measureSections,
    update,
    getState: () => currentState,
  };
}
