"use client";

import { BRAND, NAV_CTA, NAV_LINKS, TIERS } from "@/content";
import { useConfigurator } from "@/components/configurator/ConfiguratorProvider";
import { Logo } from "./Logo";

export function Header() {
  const { state, dispatch, q, priceLabel, prsLabel } = useConfigurator();

  return (
    <header className="top" id="top">
      <a className="logo glass" href={BRAND.href} aria-label={BRAND.label}>
        <Logo />
      </a>
      <nav className="navl glass" aria-label="Primary">
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
        <a className="fu" href={NAV_CTA.href}>
          {NAV_CTA.label}
        </a>
      </nav>
      <div className="seg glass" id="seg">
        <button
          type="button"
          data-tier="solo"
          className={state.tier === "solo" ? "on" : ""}
          onClick={() => dispatch({ type: "SET_TIER", tier: "solo" })}
        >
          {TIERS.solo.name}
          <small>{TIERS.solo.sub}</small>
        </button>
        <button
          type="button"
          data-tier="squad"
          className={state.tier === "squad" ? "on" : ""}
          onClick={() => dispatch({ type: "SET_TIER", tier: "squad" })}
        >
          {TIERS.squad.name}
          <small>{TIERS.squad.sub}</small>
        </button>
        <button
          type="button"
          data-tier="combine"
          className={state.tier === "combine" ? "on" : ""}
          onClick={() => dispatch({ type: "SET_TIER", tier: "combine" })}
        >
          {TIERS.combine.name}
          <small>{TIERS.combine.sub}</small>
        </button>
      </div>
      <div className="tr glass">
        <div className="tot">
          <b id="pr">{priceLabel}</b>
          <small id="prs">{prsLabel}</small>
        </div>
        <button className="fu" type="button" data-formup="">
          {q.T.fu}
        </button>
      </div>
    </header>
  );
}
