"use client";

import { GEAR, QUESTS } from "@/content";
import { useConfigurator } from "../ConfiguratorProvider";

export function SoloPanel() {
  const { state, dispatch, exOn } = useConfigurator();

  return (
    <>
      <div className="grp">
        <div className="gh">
          <i style={{ background: "var(--red)" }}></i>
          <b>Missions</b>
          <span>Pick one</span>
        </div>
        <div className="opts radio">
          {QUESTS.map((qItem) => {
            const on = state.mission === qItem.id;
            return (
              <button
                key={qItem.id}
                type="button"
                className={`opt${on ? " on" : ""}`}
                data-mission={qItem.id}
                aria-pressed={on}
                onClick={() =>
                  dispatch({ type: "SET_MISSION", mission: qItem.id })
                }
              >
                <span className="ck" aria-hidden="true"></span>
                <span className="ot">
                  <b>{qItem.name}</b>
                  <small>{qItem.desc}</small>
                  <em>
                    Summons · {qItem.hero}{" "}
                    <span className="dom">{qItem.cls.toUpperCase()}</span>
                  </em>
                </span>
                <span className="op">
                  {qItem.p > 0
                    ? `+$${qItem.p.toLocaleString("en-US")}`
                    : "incl."}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="grp">
        <div className="gh">
          <i style={{ background: "var(--sun)" }}></i>
          <b>Gear</b>
          <span>Optional</span>
        </div>
        <div className="opts">
          {GEAR.filter((e) => e.not !== state.mission).map((e) => {
            const on = exOn(e.id);
            return (
              <button
                key={e.id}
                type="button"
                className={`opt${on ? " on" : ""}`}
                data-extra={e.id}
                aria-pressed={on}
                onClick={() => dispatch({ type: "TOGGLE_EXTRA", gearId: e.id })}
              >
                <span className="ck" aria-hidden="true"></span>
                <span className="ot">
                  <b>{e.name}</b>
                  <small>{e.desc}</small>
                  <em>Adds · {e.fx}</em>
                </span>
                <span className="op">{"+$" + e.p.toLocaleString("en-US")}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
