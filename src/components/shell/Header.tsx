import { BRAND, NAV_CTA, NAV_LINKS } from "@/content";
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
    </header>
  );
}
