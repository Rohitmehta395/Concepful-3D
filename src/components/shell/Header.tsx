import { BRAND, NAV_CTA, NAV_LINKS, TIERS } from "@/content";
import { Logo } from "./Logo";

export function Header() {
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
        <button type="button" data-tier="solo" className="on">
          {TIERS.solo.name}
          <small>{TIERS.solo.sub}</small>
        </button>
        <button type="button" data-tier="squad">
          {TIERS.squad.name}
          <small>{TIERS.squad.sub}</small>
        </button>
        <button type="button" data-tier="combine">
          {TIERS.combine.name}
          <small>{TIERS.combine.sub}</small>
        </button>
      </div>
      <div className="tr glass">
        <div className="tot">
          <b id="pr">${TIERS.solo.base.toLocaleString("en-US")}</b>
          <small id="prs">fixed fee</small>
        </div>
        <button className="fu" type="button" data-formup="">
          {TIERS.solo.fu}
        </button>
      </div>
    </header>
  );
}
