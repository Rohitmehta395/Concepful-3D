"use client";

import { useEffect, useRef, useState } from "react";
import { MODAL_CONTENT } from "@/content/modal";
import { validateLeadSubmission } from "@/domain/lead";
import { getActiveEngine } from "@/engine/createEngine";
import wiringMessages from "../../../tests/wiring-messages.json";
import { useLeadModal } from "./LeadModalProvider";

/**
 * LeadModal renders the guild registration modal dialogue.
 * In lane modal, it mirrors reference/Concepful_Mech_Builder.html (lines 2208-2283, 15029-15087):
 * - Focus #co on open and restore previous focus on close
 * - Backdrop click to close (when click target is #modal itself)
 * - Escape key to close
 * - Close button #mx
 * - Pure validation logic in src/domain/lead.ts (no network request)
 * - Submitting transitions #m-form to hidden and #m-done to unhidden, setting #d-h
 */
export function LeadModal() {
  const { isOpen, close } = useLeadModal();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [welcomeHeading, setWelcomeHeading] = useState(
    MODAL_CONTENT.success.heading
  );
  const coInputRef = useRef<HTMLInputElement | null>(null);

  const {
    header,
    closeAriaLabel,
    formHeading,
    formDescription,
    fields,
    submitLabel,
    success,
  } = MODAL_CONTENT;

  // Focus #co on open matching reference openModal() ($("co").focus())
  useEffect(() => {
    if (isOpen) {
      if (coInputRef.current) {
        coInputRef.current.focus();
      } else {
        const co = document.getElementById("co");
        if (co) co.focus();
      }
    }
  }, [isOpen]);

  // Escape key handler: reference line 15058-15060
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const coVal = coInputRef.current?.value ?? "";
    const trimmed = coVal.trim();
    const result = validateLeadSubmission({ company: coVal });
    setWelcomeHeading(result.welcomeHeading);
    setIsSubmitted(true);

    const eng = getActiveEngine();
    if (eng) {
      eng.setHudMeta({ company: trimmed });
      const msg = wiringMessages.submitWorld.template.replace(
        /\$\{[^}]+\}/,
        trimmed || "Your guild"
      );
      eng.hud?.call(msg, "sys");
      const reduce =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      if (!reduce) {
        eng.hud?.triggerForm(900);
      } else {
        eng.render();
      }
    }
  };

  return (
    <div
      className="modal"
      id="modal"
      hidden={!isOpen}
      onClick={(e) => {
        // Reference line 15055-15057: $("modal").addEventListener("click", (e) => { if (e.target === $("modal")) closeModal(); });
        if (e.target === e.currentTarget) {
          close();
        }
      }}
    >
      <div
        className="mcard glass"
        role="dialog"
        aria-modal="true"
        aria-labelledby="m-h"
      >
        <div className="hd">{header}</div>
        <button
          className="x"
          type="button"
          id="mx"
          aria-label={closeAriaLabel}
          onClick={close}
        >
          ×
        </button>
        <div className="bd">
          <div id="m-form" hidden={isSubmitted}>
            <h3 id="m-h">{formHeading}</h3>
            <p>{formDescription}</p>
            <form className="form" id="pilot" onSubmit={handleSubmit}>
              <div className="fld">
                <label htmlFor={fields.company.id}>
                  {fields.company.label}
                </label>
                <input
                  ref={coInputRef}
                  id={fields.company.id}
                  type={fields.company.type}
                  maxLength={fields.company.maxLength}
                  placeholder={fields.company.placeholder}
                  autoComplete={fields.company.autoComplete}
                  onChange={(e) => {
                    const eng = getActiveEngine();
                    if (eng) {
                      eng.setHudMeta({ company: e.target.value.trim() });
                    }
                  }}
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
          <div className="done" id="m-done" hidden={!isSubmitted}>
            <canvas id="patch2" aria-hidden="true" />
            <div className="unl">{success.badge}</div>
            <h3 id="d-h" style={{ textAlign: "center", marginTop: "6px" }}>
              {welcomeHeading}
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
