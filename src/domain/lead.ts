/**
 * Lead capture domain logic extracted verbatim from reference/Concepful_Mech_Builder.html
 *
 * Reference source lines 15029-15087:
 * Line 15029-15046:
 *   function formUp(tier) {
 *     if (tier) {
 *       state.tier = tier;
 *       syncTierButtons();
 *       update();
 *     }
 *     openModal();
 *   }
 * Line 15047-15050:
 *   function openModal() {
 *     $("modal").hidden = false;
 *     $("co").focus();
 *   }
 * Line 15051-15053:
 *   function closeModal() {
 *     $("modal").hidden = true;
 *   }
 * Line 15054-15060:
 *   $("mx").addEventListener("click", closeModal);
 *   $("modal").addEventListener("click", (e) => {
 *     if (e.target === $("modal")) closeModal();
 *   });
 *   Escape key triggers closeModal when !$("modal").hidden
 * Line 15075-15078:
 *   $("co").addEventListener("input", (e) => {
 *     state.guild = e.target.value.trim();
 *     repaint();
 *   });
 * Line 15079-15087:
 *   $("pilot").addEventListener("submit", (e) => {
 *     e.preventDefault();
 *     $("m-form").hidden = true;
 *     $("m-done").hidden = false;
 *     const name = $("co").value.trim();
 *     $("d-h").textContent = name
 *       ? `Welcome to the server, ${name}`
 *       : "Welcome to the server";
 *   });
 */

export interface LeadFormData {
  company: string;
  start?: string;
  mission?: string;
  intelFiles?: readonly unknown[];
}

export interface LeadValidationResult {
  valid: boolean;
  company: string;
  welcomeHeading: string;
  errors: Record<string, string>;
}

/**
 * Formats the welcome heading for the modal success state.
 * Reference line 15083-15086:
 * const name = $("co").value.trim();
 * $("d-h").textContent = name ? `Welcome to the server, ${name}` : "Welcome to the server";
 */
export function formatWelcomeHeading(company: string): string {
  const name = company.trim();
  return name ? `Welcome to the server, ${name}` : "Welcome to the server";
}

/**
 * Validates lead submission.
 * Reference behavior: In reference/Concepful_Mech_Builder.html (lines 15079-15087),
 * the form submission has no required fields, validation constraints, or error messages.
 * Submitting empty string or any text up to maxLength=18 transitions to #m-done successfully.
 */
export function validateLeadSubmission(
  data: LeadFormData
): LeadValidationResult {
  const company = (data.company ?? "").trim();
  const errors: Record<string, string> = {};

  return {
    valid: true,
    company,
    welcomeHeading: formatWelcomeHeading(company),
    errors,
  };
}
