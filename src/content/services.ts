export type ServiceId = "web" | "search" | "automation" | "software";

export interface Service {
  id: ServiceId;
  name: string;
  /** Short label used on case studies and filters. */
  short: string;
  line: string;
  description: string;
  includes: string[];
  /** The handwritten note shown on the sketch version of the illustration. */
  scribble: string;
}

export const services: Service[] = [
  {
    id: "web",
    name: "Websites & web apps",
    short: "Web",
    line: "Sites that load fast, read well and are easy for your team to change.",
    description:
      "Marketing sites, e-commerce storefronts and web applications, designed and built on Next.js with a CMS your team can actually use.",
    includes: ["Design & UX", "Next.js builds", "Headless CMS", "E-commerce", "Core Web Vitals"],
    scribble: "make it feel fast",
  },
  {
    id: "search",
    name: "SEO & AEO",
    short: "SEO / AEO",
    line: "Be found on Google, and be the answer in ChatGPT, Perplexity and AI Overviews.",
    description:
      "Technical SEO, structured data and content written to be cited by answer engines, so people find you whether they search or ask.",
    includes: ["Technical audits", "Schema & structured data", "Answer-ready content", "AI search visibility", "Reporting"],
    scribble: "be the answer",
  },
  {
    id: "automation",
    name: "AI automation",
    short: "AI automation",
    line: "Agents and workflows that take the repetitive work off your team.",
    description:
      "Lead routing, document processing, support triage and reporting, connected to the tools you already use and checked by a person where it matters.",
    includes: ["Workflow mapping", "AI agents", "Document extraction", "CRM & helpdesk integrations", "Human review steps"],
    scribble: "stop copy-pasting",
  },
  {
    id: "software",
    name: "Custom software",
    short: "Custom software",
    line: "Internal tools, portals and dashboards built around how you really work.",
    description:
      "When off-the-shelf software forces you to bend, we build the tool that fits: dashboards, client portals, integrations and APIs.",
    includes: ["Product scoping", "Dashboards & portals", "APIs & integrations", "Data pipelines", "Support & iteration"],
    scribble: "one place for all of it",
  },
];

export function getService(id: ServiceId) {
  return services.find((s) => s.id === id)!;
}
