import { SECTION_IDS, STORY_SECTIONS } from "@/content";

/**
 * Static Hero Section (s-intro in prototype).
 * Renders the introductory narrative card, headline, description, CTAs, and telemetry HUD specs.
 *
 * Source: reference/Concepful_Mech_Builder.html (lines 1994-2016)
 */
export function Hero() {
  const { hero } = STORY_SECTIONS;

  return (
    <section
      id={SECTION_IDS.intro}
      className="st"
      data-scene="intro"
      aria-labelledby="hero-heading"
    >
      <div className="in">
        <div className="sc hero">
          <div className="eyebrow">{hero.eyebrow}</div>
          <h1 id="hero-heading" className="big">
            {hero.heading.map((segment, index) =>
              "em" in segment && segment.em ? (
                <span key={index}>{segment.text}</span>
              ) : (
                segment.text
              )
            )}
          </h1>
          <p>{hero.description}</p>
          <div className="ctas">
            <a className="fu" href={`#${SECTION_IDS.build}`}>
              {hero.ctas.primary}
            </a>
            <a className="ghost" href={`#${SECTION_IDS.howItWorks}`}>
              {hero.ctas.secondary}
            </a>
          </div>
          <div className="hud">
            {hero.hud.map((item, index) => (
              <span key={index}>
                <b>{item.highlight}</b>
                {item.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
