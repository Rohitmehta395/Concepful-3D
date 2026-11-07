import { MODAL_CONTENT } from "@/content/modal";

/**
 * Static Guild Creation Modal Shell.
 *
 * Source: reference/Concepful_Mech_Builder.html (lines 2208-2283)
 * Renders the guild registration modal in its initial hidden state.
 * Contains the consultation brief intake form and the post-submission
 * success card skeleton (#m-done, hidden).
 *
 * All interaction wiring (open/close, form submission, focus trapping)
 * is deferred to Phase 6.
 */
export function GuildModal() {
  const {
    header,
    closeAriaLabel,
    formHeading,
    formDescription,
    fields,
    submitLabel,
    success,
  } = MODAL_CONTENT;

  return (
    <div className="modal" id="modal" hidden>
      <div
        className="mcard glass"
        role="dialog"
        aria-modal="true"
        aria-labelledby="m-h"
      >
        <div className="hd">{header}</div>
        <button className="x" type="button" id="mx" aria-label={closeAriaLabel}>
          ×
        </button>
        <div className="bd">
          <div id="m-form">
            <h3 id="m-h">{formHeading}</h3>
            <p>{formDescription}</p>
            <form className="form" id="pilot">
              <div className="fld">
                <label htmlFor={fields.company.id}>
                  {fields.company.label}
                </label>
                <input
                  id={fields.company.id}
                  type={fields.company.type}
                  maxLength={fields.company.maxLength}
                  placeholder={fields.company.placeholder}
                  autoComplete={fields.company.autoComplete}
                />
              </div>
              <div className="fld">
                <label htmlFor={fields.start.id}>{fields.start.label}</label>
                <select
                  id={fields.start.id}
                  defaultValue={fields.start.defaultSelected}
                >
                  {fields.start.options.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="fld full">
                <label htmlFor={fields.mission.id}>
                  {fields.mission.label}
                </label>
                <input
                  id={fields.mission.id}
                  type={fields.mission.type}
                  placeholder={fields.mission.placeholder}
                />
              </div>
              <div className="fld full">
                <label htmlFor={fields.intel.id}>{fields.intel.label}</label>
                <input
                  id={fields.intel.id}
                  type={fields.intel.type}
                  multiple={fields.intel.multiple}
                />
              </div>
              <button className="fu" type="submit">
                {submitLabel}
              </button>
            </form>
          </div>
          <div className="done" id="m-done" hidden>
            <canvas id="patch2" aria-hidden="true" />
            <div className="unl">{success.badge}</div>
            <h3 id="d-h" style={{ textAlign: "center", marginTop: "6px" }}>
              {success.heading}
            </h3>
            <ol>
              {success.steps.map((step, idx) => (
                <li key={idx}>
                  <b>{step.lead}</b>
                  {step.text}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
