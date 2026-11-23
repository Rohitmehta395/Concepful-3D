"use client";

import { TIERS, type TierId } from "@/content";
import { useConfigurator } from "../ConfiguratorProvider";

export function TierPicker() {
  const { state, dispatch } = useConfigurator();

  return (
    <section className="step" id="st-mode">
      <div className="sh">
        <span className="n">01</span>
        <h2>Game mode</h2>
      </div>
      <p className="hint">
        Solo, party or raid. Scale up whenever you&apos;re ready.
      </p>
      <div className="tiers" id="tiers">
        {(Object.entries(TIERS) as [TierId, (typeof TIERS)[TierId]][]).map(
          ([id, tItem]) => {
            const on = state.tier === id;
            const p =
              !tItem.one && state.billing === "yr"
                ? Math.round(tItem.base * 0.9)
                : tItem.base;
            const formattedPrice = `$${p.toLocaleString("en-US")}`;
            return (
              <button
                key={id}
                type="button"
                className={`tier${on ? " on" : " mini"}`}
                data-tier={id}
                aria-pressed={on}
                onClick={() => dispatch({ type: "SET_TIER", tier: id })}
              >
                {"popular" in tItem && tItem.popular && (
                  <span className="badge">Most popular</span>
                )}
                <span>
                  <span className="t">{tItem.name}</span>
                  <span className="k">{tItem.sub}</span>
                </span>
                <span className="p">
                  {tItem.one ? "" : "from "}
                  {formattedPrice}
                  <small>{tItem.one ? "" : "/mo"}</small>
                </span>
                <span className="d">{tItem.d}</span>
              </button>
            );
          }
        )}
      </div>
    </section>
  );
}
