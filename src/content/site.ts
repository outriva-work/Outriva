/**
 * Site-wide settings. Replace the PLACEHOLDER values with Outriva's real details.
 */
export const site = {
  name: "Outriva",
  tagline: "Every system starts as a scribble.",
  description:
    "Outriva is a studio for websites and web apps, SEO and AEO, AI automation and custom software. Bring the rough idea; we draw it properly.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  // PLACEHOLDER
  email: "hello@outriva.com",
  location: "Working with teams worldwide",
  social: [
    { label: "LinkedIn", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "X", href: "#" },
    { label: "GitHub", href: "#" },
  ],
};

export const navigation = [
  { href: "/#services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/#process", label: "Process" },
  { href: "/#faq", label: "FAQ" },
];
