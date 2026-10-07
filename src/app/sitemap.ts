import type { MetadataRoute } from "next";
import { cases } from "@/content/cases";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (p: string) => new URL(p, site.url).toString();
  return [
    { url: url("/"), changeFrequency: "monthly", priority: 1 },
    { url: url("/work"), changeFrequency: "monthly", priority: 0.9 },
    ...cases.map((c) => ({ url: url(`/work/${c.slug}`), changeFrequency: "yearly" as const, priority: 0.7 })),
    { url: url("/contact"), changeFrequency: "yearly", priority: 0.8 },
  ];
}
