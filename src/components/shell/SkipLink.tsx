import { A11Y_STRINGS } from "@/content";

export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-[max(12px,var(--st))] focus:left-[max(16px,var(--gl))] focus:z-[var(--z-modal)] focus:rounded-sm focus:border focus:border-red focus:bg-bg focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:font-bold focus:uppercase focus:tracking-wider focus:text-fg focus:outline-2 focus:outline-red focus:outline-offset-2"
    >
      {A11Y_STRINGS.skipToMain}
    </a>
  );
}
