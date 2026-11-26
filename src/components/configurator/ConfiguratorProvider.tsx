"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
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
import { units } from "@/domain/roster";
import { shipFor } from "@/domain/ship";
import {
  BUFFS,
  CLASSES,
  GEAR,
  OBJECTIVES,
  QUESTS,
  ROLE,
  TEAMOF,
  TIERS,
  UNITS,
} from "@/content";
import type { GearId, Quest } from "@/content/types";
import { getActiveEngine, onEngineReady } from "@/engine/createEngine";
import { useLeadModal } from "@/components/modal";
import wiringMessages from "../../../tests/wiring-messages.json";
import { ENCD } from "./encounters";

function formatTemplate(
  template: string,
  values: readonly (string | number)[]
): string {
  let idx = 0;
  return template.replace(/\$\{[^}]+\}/g, () => String(values[idx++] ?? ""));
}

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
  hasVisitedCombine: boolean;
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
  const [hasVisitedCombine, setHasVisitedCombine] = useState(false);
  const { registerFormUp } = useLeadModal();
  const prevPartyRef = useRef<Set<string>>(new Set());
  const bootedHudRef = useRef(false);
  const stateRef = useRef(state);

  const dispatch = useCallback((action: ConfigAction) => {
    const curState = stateRef.current;
    const nextState = configReducer(curState, action);
    stateRef.current = nextState;
    const eng = getActiveEngine();
    const hud = eng?.hud ?? null;

    if (action.type === "SET_TIER") {
      if (action.tier !== curState.tier) {
        setHasChangedTier(true);
        prevPartyRef.current = new Set();
        if (hud) {
          const t = TIERS[action.tier];
          hud.call(
            formatTemplate(wiringMessages.tierChanged.template, [
              t.name,
              t.sub.split(" · ")[0] ?? "",
            ]),
            "sys"
          );
          if (action.tier === "combine") {
            const nextReach = shipFor(curState.buffs);
            const c =
              CLASSES.find((item) => item.id === nextReach) ?? CLASSES[0]!;
            const us = units(nextState);
            hud.call(
              formatTemplate(wiringMessages.combineUnderway.template, [
                c.ship,
                c.code,
                us.length,
              ]),
              "sys",
              400
            );
          }
        }
      }
      if (action.tier === "combine") {
        setHasVisitedCombine(true);
      }
    } else if (action.type === "SET_MISSION") {
      if (hud) {
        const qItem =
          QUESTS.find((item) => item.id === action.mission) ?? QUESTS[0]!;
        hud.call(
          formatTemplate(wiringMessages.missionAccepted.template, [
            qItem.name,
            qItem.hero,
          ]),
          "quest"
        );
      }
    } else if (action.type === "TOGGLE_EXTRA") {
      if (hud && !curState.extras.has(action.gearId)) {
        const x = GEAR.find((e) => e.id === action.gearId);
        if (x) {
          hud.call(
            formatTemplate(wiringMessages.extraReceived.template, [
              x.name,
              x.fx,
            ]),
            "loot"
          );
          hud.ring("veh");
        }
      }
    } else if (action.type === "TOGGLE_OBJECTIVE") {
      if (hud) {
        if (
          curState.tier === "squad" &&
          curState.objectives.size === 1 &&
          curState.objectives.has(action.objectiveId)
        ) {
          hud.call(wiringMessages.objectiveMinOne.template, "sys");
          if (
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
          ) {
            eng?.render();
          }
        } else {
          if (!curState.objectives.has(action.objectiveId)) {
            const o = OBJECTIVES.find((item) => item.id === action.objectiveId);
            if (o) {
              hud.call(
                formatTemplate(wiringMessages.objectiveSet.template, [o.name]),
                "quest"
              );
            }
            if (curState.tier === "squad") {
              const d = ENCD[action.objectiveId];
              hud.call(
                formatTemplate(wiringMessages.encounterStarted.template, [
                  d.team,
                  d.boss,
                ]),
                "party",
                300
              );
            }
          }
          if (curState.tier === "combine") {
            hud.ring("ship");
          }
        }
      }
    } else if (action.type === "TOGGLE_BUFF") {
      if (hud) {
        if (!curState.buffs.has(action.buffId)) {
          const x = BUFFS.find((e) => e.id === action.buffId);
          if (x) {
            hud.call(
              formatTemplate(wiringMessages.buffActive.template, [
                x.name,
                x.fx,
              ]),
              "loot"
            );
            hud.ring("ship");
          }
        }
        if (curState.tier === "combine") {
          const nextReach = shipFor(nextState.buffs);
          if (nextReach !== curState.reach) {
            const up =
              CLASSES.findIndex((c) => c.id === nextReach) >
              CLASSES.findIndex((c) => c.id === curState.reach);
            const c =
              CLASSES.find((item) => item.id === nextReach) ?? CLASSES[0]!;
            hud.call(
              formatTemplate(wiringMessages.flagshipChanged.template, [
                up ? "upgraded" : "resized",
                c.ship,
                c.code,
              ]),
              "sys"
            );
          }
        }
      }
    } else if (action.type === "SET_REACH") {
      if (hud) {
        const c =
          CLASSES.find((item) => item.id === action.reach) ?? CLASSES[0]!;
        hud.call(
          formatTemplate(wiringMessages.reachChanged.template, [
            c.ship,
            c.code,
            c.zone.toLowerCase(),
          ]),
          "sys"
        );
      }
    }

    // Party joined/left side-effects matching reference refresh() lines 14883-14901
    const curParty = new Set<string>(
      nextState.tier === "squad" ? units(nextState) : []
    );
    if (hud) {
      let k = 0;
      curParty.forEach((id) => {
        if (!prevPartyRef.current.has(id)) {
          const unit = UNITS[id as keyof typeof UNITS];
          const team = TEAMOF[id as keyof typeof TEAMOF];
          const role = ROLE[team];
          hud.call(
            formatTemplate(wiringMessages.partyJoined.template, [
              unit.name,
              role[0],
            ]),
            "party",
            k * 120 + 400
          );
          k++;
        }
      });
      prevPartyRef.current.forEach((id) => {
        if (!curParty.has(id) && nextState.tier === "squad") {
          const unit = UNITS[id as keyof typeof UNITS];
          hud.call(
            formatTemplate(wiringMessages.partyLeft.template, [unit.name]),
            "party"
          );
        }
      });
    }
    prevPartyRef.current = curParty;

    rawDispatch(action);
  }, []);

  // Register formUp handler for [data-formup] buttons
  useEffect(() => {
    return registerFormUp(() => {
      const curState = stateRef.current;
      const reduce =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      const eng = getActiveEngine();
      if (eng?.hud) {
        if (!reduce) {
          eng.hud.triggerForm(0);
        }
        const msg =
          curState.tier === "solo"
            ? wiringMessages.formUpSolo.template
            : curState.tier === "squad"
              ? wiringMessages.formUpSquad.template
              : wiringMessages.formUpCombine.template;
        eng.hud.call(msg, "sys");
        if (reduce) {
          eng.render();
        }
      }
      return { delayMs: reduce ? 0 : 1900 };
    });
  }, [registerFormUp]);

  // Sync state to 3D engine in all environments (dev, E2E, and production)
  useEffect(() => {
    stateRef.current = state;
    const syncToEngine = (eng: ReturnType<typeof getActiveEngine>) => {
      if (!eng) return;
      const s = stateRef.current;
      eng.setBuildState({
        tier: s.tier,
        reach: s.reach,
        mission: s.mission,
        objective: Array.from(s.objectives)[0] ?? "gtm",
        objectives: Array.from(s.objectives),
        buffs: Array.from(s.buffs),
      });
      eng.setHudMeta({ cardName: heroNameFor(s) });
      if (!bootedHudRef.current && eng.hud) {
        bootedHudRef.current = true;
        eng.hud.call(wiringMessages.bootWelcome.template, "sys", 0);
        eng.hud.call(wiringMessages.bootMission.template, "quest", 300);
        if (
          typeof window !== "undefined" &&
          window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
        ) {
          eng.render();
        }
      }
    };

    const unsub = onEngineReady(syncToEngine);
    syncToEngine(getActiveEngine());
    return unsub;
  }, [state]);

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
      hasVisitedCombine,
    };
  }, [state, dispatch, hasChangedTier, hasVisitedCombine]);

  return (
    <ConfiguratorContext.Provider value={value}>
      {children}
    </ConfiguratorContext.Provider>
  );
}
