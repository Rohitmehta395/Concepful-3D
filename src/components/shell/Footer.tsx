import { FOOTER_LOGO_DATA_URI } from "@/content/assets";
import { STORY_SECTIONS } from "@/content/story";

/**
 * Global Watermark Footer.
 *
 * Source: reference/Concepful_Mech_Builder.html (lines 2196-2206)
 * Fixed viewport watermark banner displaying copyright, disclaimer,
 * and brand mark.
 */
export function Footer() {
  const [line1, line2] = STORY_SECTIONS.footer.lines;

  return (
    <footer className="wmark">
      <span>
        {line1}
        <br />
        {line2}
      </span>
      {/* Decorative inline base64 mark from prototype line 2201; unoptimizable by next/image (see ADR 0005) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={FOOTER_LOGO_DATA_URI} alt="" width={28} height={28} />
    </footer>
  );
}
