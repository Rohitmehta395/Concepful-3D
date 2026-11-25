"use client";

import { useState } from "react";
import { BUFFS, CLASSES, OBJECTIVES } from "@/content";
import { shipFor } from "@/domain/ship";
import { useConfigurator } from "../ConfiguratorProvider";

export function CombineGroups() {
  return (
    <div className="collapsed">
      <div className="lock" style={{ borderStyle: "solid" }}>
        <span>
          <b>Everything in Full Crew, all at once.</b> All four objectives, plus
          Nexus and Hub.
        </span>
      </div>
      <div className="incl">
        {OBJECTIVES.map((o) => (
          <span key={o.id}>
            <i>✓</i>
            {o.name}
          </span>
        ))}
        <span>
          <i>✓</i>Project management
        </span>
        <span>
          <i>✓</i>Context™ workspace
        </span>
      </div>
    </div>
  );
}

export function CombinePanel() {
  const { state, dispatch } = useConfigurator();
  const raid = state.tier === "combine";
  const [hasVisitedCombine, setHasVisitedCombine] = useState(raid);

  if (raid && !hasVisitedCombine) {
    setHasVisitedCombine(true);
  }

  const reach = shipFor(state.buffs);
  const activeClassIndex = CLASSES.findIndex((c) => c.id === reach);
  const currentClass = CLASSES[activeClassIndex] ?? CLASSES[0]!;

  return (
    <>
      <section className="step" id="st-ship" hidden={!raid}>
        <div className="sh">
          <span className="n">03</span>
          <h2>Flagship</h2>
        </div>
        <p className="hint">
          Included with Full Force. It upgrades on its own as you add raid
          buffs.
        </p>
        <div id="ships">
          {hasVisitedCombine && (
            <div className="flag">
              <div className="fl-top">
                <b>{currentClass.ship}</b>
                <span>{currentClass.code} · included</span>
              </div>
              <div className="pips">
                {CLASSES.map((k, j) => (
                  <span
                    key={k.id}
                    className={`${j <= activeClassIndex ? "on" : ""}${j === activeClassIndex ? " cur" : ""}`}
                  >
                    <i />
                    {k.ship}
                  </span>
                ))}
              </div>
              <p>{currentClass.desc} Add raid buffs and it grows.</p>
            </div>
          )}
        </div>
      </section>

      {/* Step 04: Raid buffs (visible only in combine/raid) */}
      <section className="step" id="st-buffs" hidden={!raid}>
        <div className="sh">
          <span className="n">04</span>
          <h2>Raid buffs</h2>
        </div>
        <p className="hint">
          Specialist gear and AI systems. Each one brings a new unit or effect.
        </p>
        <div className="opts" id="buffs">
          {BUFFS.map((b) => (
            <button
              key={b.id}
              type="button"
              className={`opt${state.buffs.has(b.id) ? " on" : ""}`}
              data-buff={b.id}
              aria-pressed={state.buffs.has(b.id)}
              onClick={() => dispatch({ type: "TOGGLE_BUFF", buffId: b.id })}
            >
              <span className="ck" aria-hidden="true"></span>
              <span className="ot">
                <b>{b.name}</b>
                <small>{b.desc}</small>
                <em>{b.fx}</em>
              </span>
              <span className="op">+${b.p.toLocaleString("en-US")}/mo</span>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
