import { SECTION_IDS, STORY_SECTIONS } from "@/content";

/**
 * Static Mission Log Section (#s-logi in prototype, canonical id #how-it-works).
 * Renders the logistics header card and the 4-step pipeline telemetry slide cards.
 *
 * Source: reference/Concepful_Mech_Builder.html (lines 2058-2101)
 */
export function Logistics() {
  const { logistics } = STORY_SECTIONS;

  return (
    <section
      id={SECTION_IDS.howItWorks}
      className="hz-sec"
      data-scene="logi"
      aria-labelledby="how-it-works-heading"
    >
      <div className="hz">
        <div className="hz-head sc">
          <div className="eyebrow">{logistics.eyebrow}</div>
          {/* h2 element matches original prototype line 2062. aria-labelledby and id added by the rewrite. */}
          <h2 id="how-it-works-heading" className="mid">
            {logistics.heading}
          </h2>
          <p>{logistics.description}</p>
        </div>
        <div className="hz-view">
          <div className="hz-track" id="hzt" data-beats>
            {logistics.slides.map((slide) => (
              <div key={slide.num} className="beat slide">
                <i>{slide.num}</i>
                <b>{slide.title}</b>
                <small>{slide.desc}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
