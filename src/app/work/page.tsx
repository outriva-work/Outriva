import type { Metadata } from "next";
import { MarginNote } from "@/components/MarginNote";
import { PageHead } from "@/components/PageHead";
import { WorkBrowser } from "@/components/WorkBrowser";
import { cases } from "@/content/cases";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Projects by Outriva across fintech, healthcare, retail, logistics, SaaS, real estate, manufacturing and education. Client names withheld.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  const nda = cases.filter((c) => c.nda).length;
  return (
    <>
      <PageHead
        kicker={`${cases.length} projects, ${nda} under NDA`}
        title="Work we can talk about. Mostly."
        intro="Client names are withheld on every project. Under-NDA work shows the sector and the shape of what we built; the rest we can discuss on a call."
      >
        <MarginNote at={{ bottom: "2rem", right: "8%" }} tilt={-5}>
          redaction bars = very professional
        </MarginNote>
      </PageHead>
      <section className="section wrap" aria-label="Projects">
        <WorkBrowser cases={cases} services={services.map(({ id, short }) => ({ id, short }))} />
      </section>
    </>
  );
}
