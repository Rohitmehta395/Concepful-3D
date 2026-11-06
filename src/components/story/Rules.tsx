import { SECTION_IDS, STORY_SECTIONS } from "@/content";

/**
 * Static Rules Section (#s-rules in prototype).
 * Renders the commitment fine print and operational guidelines list.
 *
 * Source: reference/Concepful_Mech_Builder.html (lines 2103-2134)
 */
export function Rules() {
  const { rules } = STORY_SECTIONS;

  return (
    <section
      id={SECTION_IDS.rules}
      className="st"
      data-scene="rules"
      aria-labelledby="rules-heading"
    >
      <div className="in">
        <div className="sc">
          <div className="eyebrow">{rules.eyebrow}</div>
          {/* h2 element matches original prototype line 2107. aria-labelledby and id added by the rewrite. */}
          <h2 id="rules-heading" className="mid">
            {rules.heading}
          </h2>
          <ul className="rules">
            {rules.items.map((item, index) => (
              <li key={index}>
                <b>{item.bold}</b>
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
