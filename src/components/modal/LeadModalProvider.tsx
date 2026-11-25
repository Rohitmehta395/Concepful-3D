"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

export interface LeadModalContextValue {
  isOpen: boolean;
  tier: string | null;
  open: (tier?: string) => void;
  close: () => void;
  lastFocusedElementRef: React.MutableRefObject<HTMLElement | null>;
}

const LeadModalContext = createContext<LeadModalContextValue | null>(null);

export function LeadModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tier, setTier] = useState<string | null>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  const open = useCallback((selectedTier?: string) => {
    if (
      typeof document !== "undefined" &&
      document.activeElement instanceof HTMLElement
    ) {
      lastFocusedElementRef.current = document.activeElement;
    }
    if (selectedTier) {
      setTier(selectedTier);
    }
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <LeadModalContext.Provider
      value={{ isOpen, tier, open, close, lastFocusedElementRef }}
    >
      {children}
    </LeadModalContext.Provider>
  );
}

export function useLeadModal(): LeadModalContextValue {
  const ctx = useContext(LeadModalContext);
  if (!ctx) {
    throw new Error("useLeadModal must be used within a LeadModalProvider");
  }
  return ctx;
}
