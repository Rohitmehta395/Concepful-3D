"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import {
  type ConfigAction,
  type ConfigState,
  INITIAL_CONFIG_STATE,
  configReducer,
} from "@/domain/config";
import { type Quote, quote } from "@/domain/quote";
import { GEAR, QUESTS } from "@/content";
import type { Quest } from "@/content/types";

interface ConfiguratorContextValue {
  state: ConfigState;
  dispatch: React.Dispatch<ConfigAction>;
  q: Quote;
  currentQuest: Quest;
  level: number;
  stats: [string, string, number][];
  exOn: (id: string) => boolean;
}

const ConfiguratorContext = createContext<ConfiguratorContextValue | null>(
  null
);

export function useConfigurator(): ConfiguratorContextValue {
  const ctx = useContext(ConfiguratorContext);
  if (!ctx) {
    throw new Error(
      "useConfigurator must be used within a ConfiguratorProvider"
    );
  }
  return ctx;
}

export function ConfiguratorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(configReducer, INITIAL_CONFIG_STATE);

  // Sync state to 3D engine in test/E2E environment
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_E2E === "1" && typeof window !== "undefined") {
      const eng = (
        window as unknown as {
          __CONCEPFUL_ENGINE__?: { setBuildState?: (s: unknown) => void };
        }
      ).__CONCEPFUL_ENGINE__;
      if (eng && typeof eng.setBuildState === "function") {
        eng.setBuildState({
          tier: state.tier,
          reach: state.reach,
          mission: state.mission,
          objective: "gtm",
        });
      }
    }
  }, [state.tier, state.reach, state.mission]);

  const value = useMemo(() => {
    const q = quote(state);
    const currentQuest =
      QUESTS.find((item) => item.id === state.mission) ?? QUESTS[0]!;

    const exOn = (id: string) => {
      const item = GEAR.find((e) => e.id === id);
      return (
        state.tier === "solo" &&
        state.extras.has(id as never) &&
        item !== undefined &&
        item.not !== state.mission
      );
    };

    // Original lines 14804-14811:
    // const lv = solo ? 12 + [...extras].filter(exOn).length * 6 + (qq.p ? 6 : 0) : ...
    const activeExtrasCount = Array.from(state.extras).filter(exOn).length;
    const level = 12 + activeExtrasCount * 6 + (currentQuest.p ? 6 : 0);

    // Original lines 14829-14841:
    const desQ = ["brand", "uiux", "decks", "copy"].includes(state.mission);
    const stats: [string, string, number][] = [
      ["INT", "Strategy", 2],
      ["DEX", "Design", (desQ ? 7 : 2) + (exOn("x-illus") ? 2 : 0)],
      ["STR", "Production", (desQ ? 2 : 7) + (exOn("x-motion") ? 2 : 0)],
      ["STA", "Operations", 2],
      ["SPD", "Speed", exOn("x-rush") ? 10 : 6],
    ];

    return {
      state,
      dispatch,
      q,
      currentQuest,
      level,
      stats,
      exOn,
    };
  }, [state]);

  return (
    <ConfiguratorContext.Provider value={value}>
      {children}
    </ConfiguratorContext.Provider>
  );
}
