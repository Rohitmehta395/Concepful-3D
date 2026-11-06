import type { NavLink, TextSegment, TierId } from "./types";

/**
 * Static narrative copy and UI labels from reference/Concepful_Mech_Builder.html.
 * All text copied verbatim from HTML markup and DOM template literals.
 * Every string has a trailing comment indicating its source line in reference/Concepful_Mech_Builder.html.
 */

/**
 * Top navigation brand logo.
 * Source: reference/Concepful_Mech_Builder.html (line 1809)
 */
export const BRAND = {
  href: "#intro", // replaces original #s-intro (line 1809); hero section id is "intro"
  label: "Concepful", // line 1809
} as const satisfies NavLink;

/**
 * Top navigation bar links.
 * Source: reference/Concepful_Mech_Builder.html (lines 1868-1872)
 */
export const NAV_LINKS = [
  { href: "#classes", label: "Classes" /* line 1869: replaces #s-classes */ },
  {
    href: "#how-it-works",
    label: "How it works" /* line 1869: replaces #s-logi */,
  },
  { href: "#plans", label: "Plans" /* line 1870: replaces #s-stages */ },
] as const satisfies readonly NavLink[];

/**
 * Top navigation call-to-action button.
 * Source: reference/Concepful_Mech_Builder.html (lines 1871-1872)
 */
export const NAV_CTA = {
  href: "#build", // line 1871: replaces #build
  label: "Start your build", // line 1871
} as const satisfies NavLink;

/**
 * Configurator step metadata and headers.
 * Source: reference/Concepful_Mech_Builder.html (lines 1903-1962, lines 14677-14686)
 */
export const CONFIGURATOR_STEPS = {
  mode: {
    step: "01", // line 1905
    title: "Game mode", // line 1906
    hint: "Solo, party or raid. Scale up whenever you're ready.", // line 1908
  },
  pick: {
    step: "02", // line 1913
    titles: {
      solo: "Mission", // line 1914, line 14678
      squad: "Objective", // line 14681
      combine: "Department", // line 14680
    },
    hints: {
      solo: "Pick a mission. It summons your hero.", // line 14683
      squad:
        "Pick what you’re trying to do. The party forms around it, and specialists are confirmed at kickoff.", // line 14686
      combine:
        "Full Force runs every objective at once. You and your lead set the priorities each month.", // line 14685
    },
    nudgeText: "Bigger mission than one hero can carry? Bring a party.", // line 1919
    nudgeButton: "Form a Full Crew", // line 1920
  },
  ship: {
    step: "03", // line 1925
    title: "Flagship", // line 1926
    hint: "Included with Full Force. It upgrades on its own as you add raid buffs.", // lines 1929-1930
  },
  buffs: {
    step: "04", // line 1936
    title: "Raid buffs", // line 1937
    hint: "Specialist gear and AI systems. Each one brings a new unit or effect.", // lines 1940-1941
  },
  load: {
    step: "05", // line 1946
    title: "Loadout", // line 1947
    hint: "Itemized, and a ceiling. No hidden microtransactions. We confirm the final number after reviewing your materials.", // lines 1949-1951
    finePrint: [
      "Fast kickoff · Senior lead on every build · IP transfers on delivery.", // line 1960
      "Prototype: prices illustrative, nothing is sent.", // line 1961
    ] as const,
  },
} as const;

/**
 * Hero and Story chapter narrative sections.
 * Source: reference/Concepful_Mech_Builder.html (lines 1980-2200)
 */
export const STORY_SECTIONS = {
  boxart: {
    title: [
      { text: "Assemble your" }, // line 1983
      { text: "creative", em: true }, // line 1983
      { text: " department." }, // line 1983
    ] as const satisfies readonly TextSegment[],
    serverInfo:
      "Server: Concepful · Senior lead on every build · Four encounters to clear", // lines 1986-1987
    burst: [
      "No pay", // line 1990
      "to win.", // line 1990
      "Priced", // line 1990
      "up front.", // line 1990
    ] as const,
  },
  hero: {
    eyebrow: "Creative Department-as-a-Service", // line 1997
    heading: [
      { text: "Your creative department, " }, // line 1999
      { text: "on demand.", em: true }, // line 1999
    ] as const satisfies readonly TextSegment[],
    description:
      "One expert team for product, brand and campaigns. Stop juggling freelancers and agencies.", // lines 2002-2003
    ctas: {
      primary: "Start your build", // line 2006
      secondary: "See how it works", // line 2007
    },
    hud: [
      { highlight: "1 lead", text: "accountable, start to finish" }, // line 2010
      { highlight: "Fixed", text: "scope & price" }, // line 2011
      { highlight: "Your IP", text: "transferred on delivery" }, // line 2012
    ],
  },
  classes: {
    eyebrow: "Choose your class", // line 2021
    heading: "One goal: to provide a different perspective.", // line 2022
    description:
      "We sell creative capability, not deliverables. Across screens, hardware, brands and campaigns.", // lines 2024-2025
    beats: [
      {
        title: "Product & Interface", // line 2029
        desc: "Digital product & UI/UX · MVP build that hardens AI-assisted code for shipping · Physical interfaces & HMI", // lines 2031-2033
      },
      {
        title: "Brand & Story", // line 2037
        desc: "Brand identity · Creative direction · Concept development", // lines 2039-2040
      },
      {
        title: "Content & Campaigns", // line 2044
        desc: "Go-to-market strategy · Campaigns · Marketing assets", // line 2046
      },
    ],
    perks: [
      "Unlimited requests", // line 2051
      "Senior sign-off", // line 2051
      "Cancel anytime", // line 2052
      "Dedicated team", // line 2052
    ],
  },
  logistics: {
    eyebrow: "Mission log", // line 2061
    heading: "Fast isn't luck. It's logistics.", // line 2062
    description:
      "A small senior core plus a vetted specialist network. Scroll to follow a brief through the pipeline.", // lines 2064-2065
    slides: [
      {
        num: "01", // line 2071
        title: "Scope & commit", // line 2071
        desc: "One SOW covers scope, price and timeline. Sign and pay in one step, and assembly starts the day payment clears.", // lines 2073-2074
      },
      {
        num: "02", // line 2078
        title: "Assemble the team", // line 2078
        desc: "Your brief is matched to vetted specialists, sized to the job. They beam in already briefed.", // lines 2080-2081
      },
      {
        num: "03", // line 2085
        title: "Build around the clock", // line 2085
        desc: "Production follows the sun across time zones, so the work keeps moving while you sleep.", // lines 2087-2088
      },
      {
        num: "04", // line 2092
        title: "Senior sign-off", // line 2092
        desc: "A creative director reviews everything. One accountable lead owns the outcome.", // lines 2094-2095
      },
    ],
  },
  rules: {
    eyebrow: "Server rules", // line 2106
    heading: "The fine print, up front.", // line 2107
    items: [
      {
        bold: "One accountable lead.", // line 2110
        text: " A senior director owns the account. One name, one number.", // lines 2110-2111
      },
      {
        bold: "Fixed scope, fixed price.", // line 2114
        text: " The SOW is the contract. No surprise change orders.", // lines 2114-2115
      },
      {
        bold: "Your IP, fully transferred.", // line 2118
        text: " NDA before the first call. Files are yours on delivery.", // lines 2118-2119
      },
      {
        bold: "SLA in writing.", // line 2121
        text: " Delivery windows live in the SOW.", // line 2121
      },
      {
        bold: "A bench, not a marketplace.", // line 2123
        text: " Every specialist has shipped with us before.", // lines 2123-2124
      },
      {
        bold: "Progress you can see.", // line 2127
        text: " Status, files and feedback in one shared workspace.", // lines 2127-2128
      },
    ],
  },
  stages: {
    eyebrow: "Pick your scale", // line 2138
    heading: "Wherever you are, we fit in.", // line 2139
    beats: [
      {
        title: "Solo founders", // line 2142
        tier: "Mission", // line 2142
        targetTier: "solo" as TierId, // line 2141
        desc: "From zero to a credible brand. One mission, one hero.", // line 2144
      },
      {
        title: "Startups", // line 2148
        tier: "Mission → Full Crew", // line 2148
        targetTier: "squad" as TierId, // line 2147
        desc: "Build fast and stay consistent as the work stacks up.", // line 2150
      },
      {
        title: "SMBs", // line 2154
        tier: "Full Crew", // line 2154
        targetTier: "squad" as TierId, // line 2153
        desc: "Marketing that scales: campaign assets and ongoing creative.", // lines 2156-2157
      },
      {
        title: "Mid-market", // line 2161
        tier: "Full Force", // line 2161
        targetTier: "combine" as TierId, // line 2160
        desc: "An embedded creative department, flagship included.", // line 2163
      },
    ],
    cta: "Build yours", // line 2167
  },
  outro: {
    eyebrow: "Game over for overhead", // line 2175
    heading: [
      { text: "Stop hiring. " }, // line 2176
      { text: "Start creating.", em: true }, // line 2176
    ] as const satisfies readonly TextSegment[],
    description:
      "A full creative department with no hiring and no overhead. Cancel anytime.", // lines 2178-2179
    ctas: {
      primary: "Choose your plan", // line 2182
      secondary: "Compare plans", // line 2183
    },
  },
  footer: {
    lines: [
      "© 2026 Concepful · Creative Department-as-a-Service", // line 2198
      "Senior lead on every build · Prototype, prices illustrative", // lines 2198-2199
    ] as const,
  },
} as const;

/**
 * "Create your guild" modal dialog copy.
 * Source: reference/Concepful_Mech_Builder.html (lines 2215-2279, line 15085)
 */
export const MODAL_COPY = {
  header: "Create your guild", // line 2215
  closeLabel: "Close", // line 2216
  title: "Your build is ready.", // line 2219
  intro:
    "Name your guild and drop your intel. A senior lead picks it up from here.", // lines 2221-2222
  fields: {
    company: {
      label: "Guild (company)", // line 2226
      placeholder: "Harbor & Vane", // line 2231
    },
    start: {
      label: "Server start", // line 2236
      options: [
        "This week", // line 2238
        "Within 2 weeks", // line 2239
        "This month", // line 2240
        "Just exploring", // line 2241
      ] as const,
    },
    objective: {
      label: "Mission objective, in one line", // line 2245
      placeholder: "Rebrand ahead of our Series A launch", // line 2249
    },
    intel: {
      label: "Attach intel: brief or materials (optional)", // lines 2253-2254
    },
  },
  submitButton: "Enter world", // line 2257
  success: {
    badge: "Patch unlocked", // line 2262
    heading: "Welcome to the server", // line 2264
    items: [
      {
        bold: "First,", // line 2268
        text: " a senior lead reviews your brief and confirms the number.", // lines 2268-2269
      },
      {
        bold: "You get the SOW", // line 2272
        text: " and a secure Stripe link. IP transfers on delivery.", // lines 2272-2273
      },
      {
        bold: "Your Context™ workspace opens", // line 2276
        text: " with this build loaded, and the mission begins.", // lines 2276-2277
      },
    ],
  },
} as const;
