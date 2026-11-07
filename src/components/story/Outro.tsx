import { SECTION_IDS, STORY_SECTIONS } from "@/content";

/**
 * Static Outro Section (#s-outro in prototype).
 * Renders the concluding narrative hero card and primary/secondary deployment CTAs.
 *
 * Source: reference/Concepful_Mech_Builder.html (lines 2172-2187)
 */
export function Outro() {
  const { outro } = STORY_SECTIONS;

  return (
    <section
      id={SECTION_IDS.outro}
      className="st"
      data-scene="outro"
      aria-labelledby="outro-heading"
    >
      <div className="in">
        <div className="sc hero">
          <div className="eyebrow">{outro.eyebrow}</div>
          {/* h2 element matches original prototype line 2176. aria-labelledby and id added by the rewrite. */}
          <h2 id="outro-heading" className="big">
            {outro.heading.map((segment, index) =>
              "em" in segment && segment.em ? (
                <span key={index}>{segment.text}</span>
              ) : (
                segment.text
              )
            )}
          </h2>
          <p>{outro.description}</p>
          <div className="ctas">
            <a className="fu" href={`#${SECTION_IDS.build}`}>
              {outro.ctas.primary}
            </a>
            {/* Original href="#s-stages" (line 2183) mapped to canonical SECTION_IDS.plans */}
            <a className="ghost" href={`#${SECTION_IDS.plans}`}>
              {outro.ctas.secondary}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
