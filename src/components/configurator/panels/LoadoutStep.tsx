"use client";

import { fmt } from "@/domain/labels";
import { useConfigurator } from "../ConfiguratorProvider";
import { useLeadModal } from "@/components/modal";

export function LoadoutStep() {
  const { state, dispatch, q, currentQuest, priceLabel } = useConfigurator();
  const { open } = useLeadModal();

  const solo = state.tier === "solo";
  const raid = state.tier === "combine";

  const baseLineItem = solo
    ? `Mission · ${currentQuest.hero}`
    : `${q.T.name} · ${q.T.sub.split(" · ")[1]}`;

  return (
    <section className="step" id="st-load">
      <div className="sh">
        <span className="n">{raid ? "05" : "03"}</span>
        <h2>Loadout</h2>
      </div>
      <p className="hint">
        Itemized, and a ceiling. No hidden microtransactions. We confirm the
        final number after reviewing your materials.
      </p>
      <div className="toggle" id="bill" hidden={solo}>
        <button
          type="button"
          id="b-mo"
          className={state.billing === "mo" ? "on" : ""}
          onClick={() => dispatch({ type: "SET_BILLING", billing: "mo" })}
        >
          Monthly
        </button>
        <button
          type="button"
          id="b-yr"
          className={state.billing === "yr" ? "on" : ""}
          onClick={() => dispatch({ type: "SET_BILLING", billing: "yr" })}
        >
          Annual <em>−10%</em>
        </button>
      </div>
      <div className="bp" id="bp">
        <div className="bl">
          <span className="l">
            <i style={{ background: "var(--fg)" }}></i>
            {baseLineItem}
          </span>
          <span className="n">{fmt(q.T.base) + (q.T.one ? "" : "/mo")}</span>
        </div>
        <div className="bl mut">
          <span className="l">
            <i style={{ background: "var(--dim)" }}></i>
            {solo
              ? "Mission included"
              : raid
                ? "Objectives, support & flagship included"
                : "Objectives & support included"}
          </span>
          <span className="n">incl.</span>
        </div>
        {q.lines.map((l) => (
          <div key={l.name} className="bl">
            <span className="l">
              <i style={{ background: l.c }}></i>
              {l.name}
            </span>
            <span className="n">{"+" + fmt(l.p) + (q.T.one ? "" : "/mo")}</span>
          </div>
        ))}
        {q.disc > 0 && (
          <div className="bl save">
            <span>Annual billing</span>
            <span className="n">−{fmt(q.disc)}/mo</span>
          </div>
        )}
        <div className="bl total">
          <span>Estimated {q.T.one ? "fixed fee" : "monthly"}</span>
          <span className="n">{priceLabel}</span>
        </div>
        {q.T.min && (
          <div className="bl mut">
            <span>{q.T.min}</span>
            <span className="n">{raid ? "flagship incl." : ""}</span>
          </div>
        )}
      </div>
      <button
        className="fu wide"
        type="button"
        data-formup=""
        onClick={() => open()}
      >
        {q.T.fu}
      </button>
      <p className="fine">
        Fast kickoff · Senior lead on every build · IP transfers on delivery.
        <br />
        Prototype: prices illustrative, nothing is sent.
      </p>
    </section>
  );
}
