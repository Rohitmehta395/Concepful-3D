import { SECTION_IDS, STORY_SECTIONS } from "@/content";

/**
 * Static Classes Section (#s-classes in prototype).
 * Renders the capability introduction, sub-disciplines (beats), and delivery perks.
 *
 * Source: reference/Concepful_Mech_Builder.html (lines 2018-2057)
 */
export function Classes() {
  const { classes } = STORY_SECTIONS;

  return (
    <section
      id={SECTION_IDS.classes}
      className="st tall"
      data-scene="classes"
      aria-labelledby="classes-heading"
    >
      <div className="in">
        <div className="sc">
          <div className="eyebrow">{classes.eyebrow}</div>
          {/* h2 element matches original prototype line 2022. aria-labelledby and id added by the rewrite. */}
          <h2 id="classes-heading" className="mid">
            {classes.heading}
          </h2>
          <p>{classes.description}</p>
          <div className="beats" data-beats>
            {classes.beats.map((beat, index) => (
              <div key={index} className="beat">
                <b>{beat.title}</b>
                <small>{beat.desc}</small>
              </div>
            ))}
          </div>
          <div className="perks">
            {classes.perks.map((perk, index) => (
              <span key={index}>{perk}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
