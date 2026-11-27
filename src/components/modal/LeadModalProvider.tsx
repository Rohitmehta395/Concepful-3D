"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type FormUpHandler = () => { delayMs: number } | void;

export interface LeadModalContextValue {
  isOpen: boolean;
  tier: string | null;
  open: (tier?: string) => void;
  close: () => void;
  registerFormUp: (handler: FormUpHandler) => () => void;
  lastFocusedElementRef: React.MutableRefObject<HTMLElement | null>;
}

const LeadModalContext = createContext<LeadModalContextValue | null>(null);

export function LeadModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tier, setTier] = useState<string | null>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);
  const formUpHandlerRef = useRef<FormUpHandler | null>(null);
  const formUpTimerRef = useRef<number | null>(null);

  const registerFormUp = useCallback((handler: FormUpHandler) => {
    formUpHandlerRef.current = handler;
    return () => {
      if (formUpHandlerRef.current === handler) {
        formUpHandlerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (formUpTimerRef.current !== null) {
        window.clearTimeout(formUpTimerRef.current);
      }
    };
  }, []);

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
    if (formUpTimerRef.current !== null) {
      window.clearTimeout(formUpTimerRef.current);
      formUpTimerRef.current = null;
    }
    if (formUpHandlerRef.current) {
      const res = formUpHandlerRef.current();
      const delayMs = res && typeof res.delayMs === "number" ? res.delayMs : 0;
      if (delayMs <= 0) {
        setIsOpen(true);
      } else {
        formUpTimerRef.current = window.setTimeout(() => {
          formUpTimerRef.current = null;
          setIsOpen(true);
        }, delayMs);
      }
    } else {
      setIsOpen(true);
    }
  }, []);

  const close = useCallback(() => {
    if (formUpTimerRef.current !== null) {
      window.clearTimeout(formUpTimerRef.current);
      formUpTimerRef.current = null;
    }
    setIsOpen(false);
  }, []);

  return (
    <LeadModalContext.Provider
      value={{
        isOpen,
        tier,
        open,
        close,
        registerFormUp,
        lastFocusedElementRef,
      }}
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
