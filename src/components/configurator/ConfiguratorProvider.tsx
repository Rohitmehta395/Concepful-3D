"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import {
  type ConfigAction,
  type ConfigState,
  INITIAL_CONFIG_STATE,
  configReducer,
} from "@/domain/config";
import { type Quote, quote } from "@/domain/quote";
import { levelFor } from "@/domain/level";
import {
  cardClassDescFor,
  cardHeaderDescFor,
  heroNameFor,
  partyFor,
  type PartyData,
  priceLabelFor,
  prsLabelFor,
  statsFor,
} from "@/domain/labels";
import { GEAR, QUESTS, TIERS } from "@/content";
import type { GearId, Quest } from "@/content/types";

interface ConfiguratorContextValue {
  state: ConfigState;
  dispatch: React.Dispatch<ConfigAction>;
  q: Quote;
  currentQuest: Quest;
  level: number;
  stats: readonly [string, string, number][];
  exOn: (id: GearId) => boolean;
  prsLabel: string;
  heroName: string;
  priceLabel: string;
  cardHeaderDesc: string;
  cardClassDesc: string;
  party: PartyData | null;
  introText: string;
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
  const [state, rawDispatch] = useReducer(configReducer, INITIAL_CONFIG_STATE);
  const [hasChangedTier, setHasChangedTier] = useState(false);

  const dispatch = useCallback(
    (action: ConfigAction) => {
      if (action.type === "SET_TIER" && action.tier !== state.tier) {
        setHasChangedTier(true);
      }
      rawDispatch(action);
    },
    [state.tier]
  );

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
          objective: Array.from(state.objectives)[0] ?? "gtm",
          objectives: Array.from(state.objectives),
          buffs: Array.from(state.buffs),
        });
      }
    }
  }, [state.tier, state.reach, state.mission, state.objectives, state.buffs]);

  const value = useMemo(() => {
    const q = quote(state);
    const currentQuest =
      QUESTS.find((item) => item.id === state.mission) ?? QUESTS[0]!;

    const exOn = (id: GearId) => {
      const item = GEAR.find((e) => e.id === id);
      return (
        state.tier === "solo" &&
        state.extras.has(id) &&
        item !== undefined &&
        item.not !== state.mission
      );
    };

    const level = levelFor(state);
    const prsLabel = prsLabelFor(q);
    const heroName = heroNameFor(state);
    const priceLabel = priceLabelFor(q);
    const cardHeaderDesc = cardHeaderDescFor(state);
    const cardClassDesc = cardClassDescFor(state);
    const stats = statsFor(state);
    const party = partyFor(state);
    const introText = hasChangedTier
      ? TIERS[state.tier].pitch
      : "Choose a game mode, pick your mission, watch your build come online. Every part is priced before you commit.";

    return {
      state,
      dispatch,
      q,
      currentQuest,
      level,
      stats,
      exOn,
      prsLabel,
      heroName,
      priceLabel,
      cardHeaderDesc,
      cardClassDesc,
      party,
      introText,
    };
  }, [state, dispatch, hasChangedTier]);

  return (
    <ConfiguratorContext.Provider value={value}>
      {children}
    </ConfiguratorContext.Provider>
  );
}
