"use client";

import { TIERS } from "@/content";
import { useConfigurator } from "./ConfiguratorProvider";
import { TierPicker } from "./panels/TierPicker";
import { SoloPanel } from "./panels/SoloPanel";
import { SquadPanel } from "./panels/SquadPanel";
import { CombinePanel, CombineGroups } from "./panels/CombinePanel";
import { LoadoutStep } from "./panels/LoadoutStep";
import { CardSheet } from "./panels/CardSheet";

/**
 * ConfiguratorShell Component (Phase p0 - Modular Decomposition)
 *
 * Composes sub-panels without changing DOM output:
 * - #panel:
 *   - intro
 *   - TierPicker (#st-mode)
 *   - Step 02 (#st-pick: SoloPanel | SquadPanel | CombineGroups + #nudge)
 *   - CombinePanel (#st-ship + #st-buffs)
 *   - LoadoutStep (#st-load)
 * - CardSheet (#card)
 * - #boxart
 */
export function ConfiguratorShell() {
  const { state, dispatch } = useConfigurator();

  const solo = state.tier === "solo";
  const raid = state.tier === "combine";

  return (
    <>
      <aside className="panel glass" id="panel">
        <div className="intro">
          <div className="eyebrow">
            Server: Concepful · Creative Department as a Service
          </div>
          <div className="mt">Assemble your creative department.</div>
          <p id="intro-p">
            {solo
              ? "Choose a game mode, pick your mission, watch your build come online. Every part is priced before you commit."
              : TIERS[state.tier].pitch}
          </p>
        </div>

        {/* Step 01: Game Mode */}
        <TierPicker />

        {/* Step 02: Pick Mission / Objective / Department */}
        <section className="step" id="st-pick">
          <div className="sh">
            <span className="n">02</span>
            <h2 id="lo-h">
              {solo ? "Mission" : raid ? "Department" : "Objective"}
            </h2>
          </div>
          <p className="hint" id="lo-hint">
            {solo
              ? "Pick a mission. It summons your hero."
              : raid
                ? "Full Force runs every objective at once. You and your lead set the priorities each month."
                : "Pick what you’re trying to do. The party forms around it, and specialists are confirmed at kickoff."}
          </p>
          <div id="groups" className="swap">
            {solo ? SoloPanel() : !raid ? SquadPanel() : CombineGroups()}
          </div>

          <div
            className={`nudge${solo && state.extras.size >= 2 ? " show" : ""}`}
            id="nudge"
          >
            <span>Bigger mission than one hero can carry? Bring a party.</span>
            <button
              type="button"
              data-tier="squad"
              onClick={() => dispatch({ type: "SET_TIER", tier: "squad" })}
            >
              Form a Full Crew
            </button>
          </div>
        </section>

        {/* Step 03 & 04: Flagship & Raid buffs (visible only in combine/raid) */}
        <CombinePanel />

        {/* Loadout & Blueprint (numbered 05 in raid, 03 in solo/squad) */}
        <LoadoutStep />
      </aside>

      {/* Character Sheet Card */}
      <CardSheet />

      {/* Boxart Visual Branding */}
      <div className="boxart" id="boxart">
        <div>
          <h1 className="title">
            Assemble your
            <br />
            <span>creative</span> department.
          </h1>
          <div className="fp">
            Server: Concepful · Senior lead on every build · Four encounters to
            clear
          </div>
        </div>
        <div className="burst">
          No pay
          <br />
          to win.
          <br />
          Priced
          <br />
          up front.
        </div>
      </div>
    </>
  );
}
