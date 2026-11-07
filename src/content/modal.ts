/**
 * Verbatim content extracted from reference/Concepful_Mech_Builder.html
 * for the "Create your guild" modal (lines 2208-2283).
 */

export interface ModalField {
  id: string;
  label: string;
  placeholder?: string;
  type: string;
  maxLength?: number;
  autoComplete?: string;
  multiple?: boolean;
}

export interface ModalContent {
  header: string;
  closeAriaLabel: string;
  formHeading: string;
  formDescription: string;
  fields: {
    company: ModalField;
    start: {
      id: string;
      label: string;
      options: string[];
      defaultSelected: string;
    };
    mission: ModalField;
    intel: ModalField;
  };
  submitLabel: string;
  success: {
    badge: string;
    heading: string;
    steps: Array<{
      lead: string;
      text: string;
    }>;
  };
}

export const MODAL_CONTENT: ModalContent = {
  // Line 2215: Header category banner
  header: "Create your guild",

  // Line 2216: Close button aria-label
  closeAriaLabel: "Close",

  // Line 2219: Form heading
  formHeading: "Your build is ready.",

  // Lines 2220-2223: Form intro paragraph
  formDescription:
    "Name your guild and drop your intel. A senior lead picks it up from here.",

  fields: {
    // Lines 2226-2233: Guild (company) input
    company: {
      id: "co",
      label: "Guild (company)",
      placeholder: "Harbor & Vane",
      type: "text",
      maxLength: 18,
      autoComplete: "organization",
    },

    // Lines 2236-2242: Server start timeline select
    start: {
      id: "ko",
      label: "Server start",
      options: ["This week", "Within 2 weeks", "This month", "Just exploring"],
      defaultSelected: "Within 2 weeks",
    },

    // Lines 2245-2250: Mission objective input
    mission: {
      id: "mi",
      label: "Mission objective, in one line",
      placeholder: "Rebrand ahead of our Series A launch",
      type: "text",
    },

    // Lines 2253-2256: Attach intel file input
    intel: {
      id: "br",
      label: "Attach intel: brief or materials (optional)",
      type: "file",
      multiple: true,
    },
  },

  // Line 2257: Submit CTA button
  submitLabel: "Enter world",

  success: {
    // Line 2262: Unlocked badge
    badge: "Patch unlocked",

    // Line 2264: Welcome heading
    heading: "Welcome to the server",

    // Lines 2266-2279: Onboarding steps
    steps: [
      {
        lead: "First,",
        text: " a senior lead reviews your brief and confirms the number.",
      },
      {
        lead: "You get the SOW",
        text: " and a secure Stripe link. IP transfers on delivery.",
      },
      {
        lead: "Your Context™ workspace opens",
        text: " with this build loaded, and the mission begins.",
      },
    ],
  },
} as const;
