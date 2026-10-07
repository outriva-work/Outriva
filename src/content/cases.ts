import type { ServiceId } from "./services";

export type Glyph = "card" | "cross" | "hanger" | "route" | "org" | "plan" | "crate" | "book";
export type Tone = "blue" | "marker" | "stone" | "ink";

export interface CaseStudy {
  /** Used in the URL: /work/<slug>. */
  slug: string;
  /** The client's industry. Client names are never shown. */
  sector: string;
  /** Under a non-disclosure agreement: details are redacted and the cover is obscured. */
  nda: boolean;
  /** One line describing what was made. */
  headline: string;
  services: ServiceId[];
  summary: string;
  brief: string;
  did: string[];
  changed: string[];
  stack: string[];
  cover: { glyph: Glyph; tone: Tone };
  featured?: boolean;
}

/**
 * SAMPLE CONTENT: these case studies are illustrative placeholders.
 * Replace them with Outriva's real projects (names withheld) before launch.
 */
export const cases: CaseStudy[] = [
  {
    slug: "fintech-payments-platform",
    sector: "Fintech, payments",
    nda: false,
    headline: "A marketing site and docs hub built to be found, and quoted",
    services: ["web", "search"],
    summary: "Rebuilt the site and developer docs for a payments platform, then made both readable by search and answer engines.",
    brief:
      "The product was strong but the website wasn't: slow pages, docs on a separate platform, and competitors appearing in AI answers to questions the client should own.",
    did: [
      "Moved the marketing site and docs onto one Next.js codebase with a headless CMS",
      "Wrote structured data for products, FAQs and documentation pages",
      "Rewrote key pages around the questions developers actually ask",
      "Set up tracking for both search rankings and AI answer citations",
    ],
    changed: [
      "Docs and marketing now share one design system and one deploy",
      "The marketing team publishes pages without a developer",
      "The brand now appears in AI answers for its core product questions",
    ],
    stack: ["Next.js", "Sanity", "Vercel", "Schema.org"],
    cover: { glyph: "card", tone: "blue" },
    featured: true,
  },
  {
    slug: "healthcare-intake-automation",
    sector: "Healthcare, clinic network",
    nda: true,
    headline: "Patient intake that sorts itself before the front desk opens",
    services: ["automation"],
    summary: "Automated intake forms, referral letters and appointment requests across a group of clinics.",
    brief:
      "Front-desk staff spent their mornings re-typing referral letters and intake forms into the booking system, and urgent requests sat in the same queue as routine ones.",
    did: [
      "Mapped every intake path with the front-desk team",
      "Built document extraction for referral letters with a human check on every record",
      "Routed requests by urgency and clinic, with alerts for the urgent ones",
      "Connected the workflow to the existing booking and messaging tools",
    ],
    changed: [
      "Referral details arrive in the booking system already filled in",
      "Urgent requests are flagged as soon as they arrive",
      "Staff review records instead of typing them",
    ],
    stack: ["Python", "LLM document extraction", "n8n", "Booking system API"],
    cover: { glyph: "cross", tone: "marker" },
    featured: true,
  },
  {
    slug: "fashion-headless-storefront",
    sector: "Retail, D2C fashion",
    nda: false,
    headline: "A headless storefront that keeps up with drop days",
    services: ["web", "search"],
    summary: "Replaced a themed store with a fast headless storefront and an editorial lookbook.",
    brief:
      "Launch days slowed the old store to a crawl, and the theme couldn't show the brand's photography the way the team wanted.",
    did: [
      "Designed an editorial storefront around the brand's photography",
      "Built it headless on Next.js with the existing commerce back end",
      "Added product structured data and collection pages for search",
      "Load-tested the checkout path before the first drop",
    ],
    changed: [
      "Drop days run without the site slowing down",
      "The team builds lookbooks from the CMS without code",
      "Product pages show rich results in search",
    ],
    stack: ["Next.js", "Shopify Storefront API", "Contentful"],
    cover: { glyph: "hanger", tone: "stone" },
    featured: true,
  },
  {
    slug: "logistics-dispatch-console",
    sector: "Logistics, freight",
    nda: true,
    headline: "One dispatch console instead of six spreadsheets",
    services: ["software", "automation"],
    summary: "A live dispatch and tracking console for a freight operator, replacing shared spreadsheets.",
    brief:
      "Dispatchers juggled spreadsheets, phone calls and a tracking portal to know where each load was. Customers called for updates the team didn't have.",
    did: [
      "Shadowed dispatchers for a week before designing anything",
      "Built a live console for loads, drivers and exceptions",
      "Pulled tracking data from carriers into one timeline per load",
      "Sent customers automatic status updates at each milestone",
    ],
    changed: [
      "Every load has one timeline everyone can see",
      "Exceptions surface on the console instead of by phone",
      "Customers get updates without asking",
    ],
    stack: ["Next.js", "Node.js", "PostgreSQL", "Carrier APIs"],
    cover: { glyph: "route", tone: "ink" },
    featured: true,
  },
  {
    slug: "hr-saas-answer-engine",
    sector: "B2B SaaS, HR tech",
    nda: false,
    headline: "Programmatic SEO and AEO for a crowded category",
    services: ["search", "web"],
    summary: "Built a library of answer-first pages for an HR platform competing with much larger brands.",
    brief:
      "Bigger competitors owned the search results, and AI assistants recommended them by name. The client needed a way in that didn't depend on ad spend.",
    did: [
      "Researched the questions buyers ask at each stage",
      "Designed page templates that answer first and explain second",
      "Generated and edited a library of guides with a human editor on every page",
      "Added structured data and internal linking across the library",
    ],
    changed: [
      "The library ranks for long-tail questions competitors ignore",
      "AI assistants now cite the client's guides",
      "Sales uses the same pages in conversations",
    ],
    stack: ["Next.js", "Schema.org", "Search Console", "Custom content pipeline"],
    cover: { glyph: "org", tone: "marker" },
  },
  {
    slug: "real-estate-listing-assistant",
    sector: "Real estate, developer",
    nda: true,
    headline: "A listings site with an assistant that knows every floor plan",
    services: ["web", "automation"],
    summary: "A new listings site with an AI assistant that answers buyer questions from the developer's own documents.",
    brief:
      "Buyers asked the same questions about layouts, payment plans and possession dates, and the sales team answered each one by hand.",
    did: [
      "Designed and built a listings site with filterable floor plans",
      "Built an assistant grounded only in approved project documents",
      "Handed qualified conversations to the sales team with full context",
      "Added guardrails so the assistant declines what it shouldn't answer",
    ],
    changed: [
      "Routine questions are answered at any hour",
      "Sales receives leads with the buyer's questions attached",
      "Every answer can be traced to a source document",
    ],
    stack: ["Next.js", "Retrieval-augmented generation", "CRM integration"],
    cover: { glyph: "plan", tone: "blue" },
  },
  {
    slug: "manufacturing-inventory-planner",
    sector: "Manufacturing, industrial parts",
    nda: true,
    headline: "Inventory planning connected straight to the ERP",
    services: ["software", "automation"],
    summary: "A planning tool that reads from the ERP and suggests reorders, so the warehouse stops guessing.",
    brief:
      "Reorder decisions lived in one planner's spreadsheet. Stock-outs and overstock both happened, and nobody could see why.",
    did: [
      "Connected to the ERP to read stock, orders and lead times",
      "Built a planning view with suggested reorders and the reasons behind them",
      "Automated the weekly purchasing report",
      "Trained the team and documented the rules",
    ],
    changed: [
      "Reorder suggestions come with their reasoning",
      "The weekly report builds itself",
      "Planning knowledge no longer lives in one spreadsheet",
    ],
    stack: ["Python", "ERP API", "PostgreSQL", "Next.js"],
    cover: { glyph: "crate", tone: "stone" },
  },
  {
    slug: "edtech-support-triage",
    sector: "Education, online courses",
    nda: false,
    headline: "Support triage and a course content pipeline",
    services: ["automation", "software"],
    summary: "Automated support triage and a pipeline that turns recorded lessons into course material.",
    brief:
      "Support questions spiked at every course launch, and turning recorded lessons into notes and quizzes took the team weeks.",
    did: [
      "Classified incoming tickets and drafted replies for agents to approve",
      "Built a pipeline from lesson recordings to transcripts, notes and quiz drafts",
      "Added a review screen so instructors approve everything before it's published",
    ],
    changed: [
      "Agents start every ticket with a drafted reply",
      "Course material is ready for review soon after recording",
      "Instructors edit instead of writing from scratch",
    ],
    stack: ["Python", "Speech-to-text", "Helpdesk API", "Next.js"],
    cover: { glyph: "book", tone: "ink" },
  },
];

export function getCase(slug: string) {
  return cases.find((c) => c.slug === slug);
}
