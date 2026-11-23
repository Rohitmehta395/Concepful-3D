"use client";

import { OBJECTIVES } from "@/content";
import { useConfigurator } from "../ConfiguratorProvider";
import { ENCD } from "../encounters";

export function SquadPanel() {
  const { state, dispatch } = useConfigurator();

  return (
    <>
      <div className="grp">
        <div className="gh">
          <i style={{ background: "var(--red)" }}></i>
          <b>Objectives</b>
          <span>Pick one or more</span>
        </div>
        <div className="opts" id="squad-objs">
          {OBJECTIVES.map((o) => {
            const enc = ENCD[o.id];
            const on = state.objectives.has(o.id);
            return (
              <button
                key={o.id}
                type="button"
                className={`opt${on ? " on" : ""}`}
                data-obj={o.id}
                aria-pressed={on}
                onClick={() =>
                  dispatch({
                    type: "TOGGLE_OBJECTIVE",
                    objectiveId: o.id,
                  })
                }
              >
                <span className="ck" aria-hidden="true"></span>
                <span className="ot">
                  <b>{o.name}</b>
                  <span className="say">{o.say}</span>
                  <small>{o.desc}</small>
                  <em>{`Encounter · ${enc.team} vs ${enc.boss}`}</em>
                </span>
                <span className="op">incl.</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="grp">
        <div className="gh">
          <i style={{ background: "var(--ops)" }}></i>
          <b>Always in your party</b>
        </div>
        <div className="lock" style={{ borderStyle: "solid" }}>
          <span>
            <b>Nexus</b> runs project management. <b>Hub</b> runs your Context™
            workspace and links every unit.
          </span>
        </div>
      </div>
    </>
  );
}
