"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export interface LeadModalContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const LeadModalContext = createContext<LeadModalContextValue | null>(null);

export function LeadModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <LeadModalContext.Provider value={{ isOpen, open, close }}>
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
