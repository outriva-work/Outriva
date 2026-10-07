import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Caveat } from "next/font/google";
import type { ReactNode } from "react";
import { modeScript } from "@/components/ModeToggle";
import { SiteShell } from "@/components/SiteShell";
import { site } from "@/content/site";
import "./globals.css";

// One family for everything, using its optical size and width axes.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  display: "swap",
  variable: "--font-display",
});

// Handwriting, used only for notes and Draft view.
const hand = Caveat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hand",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Outriva | Web development, SEO & AEO, AI automation and custom software",
    template: "%s | Outriva",
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: "Outriva",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Outriva: every system starts as a scribble" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#f4f5f0" };

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Outriva",
  url: site.url,
  email: site.email,
  description: site.description,
  knowsAbout: ["Web development", "Search engine optimisation", "Answer engine optimisation", "AI automation", "Custom software"],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${hand.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: modeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      </head>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
