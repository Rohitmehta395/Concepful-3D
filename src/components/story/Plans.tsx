import { SECTION_IDS, STORY_SECTIONS } from "@/content";

/**
 * Static Plans Section (#s-stages in prototype).
 * Renders the stage scale selection card, tier beats, and CTA link.
 *
 * Source: reference/Concepful_Mech_Builder.html (lines 2135-2170)
 */
export function Plans() {
  const { stages } = STORY_SECTIONS;

  return (
    <section
      id={SECTION_IDS.plans}
      className="st tall"
      data-scene="stages"
      aria-labelledby="plans-heading"
    >
      <div className="in">
        <div className="sc">
          <div className="eyebrow">{stages.eyebrow}</div>
          {/* h2 element matches original prototype line 2139. aria-labelledby and id added by the rewrite. */}
          <h2 id="plans-heading" className="mid">
            {stages.heading}
          </h2>
          <div className="beats" data-beats>
            {stages.beats.map((beat, index) => (
              <div key={index} className="beat" data-pick={beat.targetTier}>
                <b>
                  {beat.title} <em>{beat.tier}</em>
                </b>
                <small>{beat.desc}</small>
              </div>
            ))}
          </div>
          <div className="ctas">
            <a className="fu" href={`#${SECTION_IDS.build}`}>
              {stages.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
