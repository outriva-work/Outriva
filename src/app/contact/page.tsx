import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { MarginNote } from "@/components/MarginNote";
import { PageHead } from "@/components/PageHead";
import { getCase } from "@/content/cases";
import { services } from "@/content/services";
import { site } from "@/content/site";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Start a project",
  description: "Tell Outriva about your website, search, automation or software project. A rough idea is enough to start.",
  alternates: { canonical: "/contact" },
};

type SearchParams = Promise<{ project?: string }>;

export default async function ContactPage({ searchParams }: { searchParams: SearchParams }) {
  const { project } = await searchParams;
  const related = project ? getCase(project) : undefined;
  const context = related ? `We saw your ${related.sector.toLowerCase()} project and want something similar: ` : undefined;

  return (
    <>
      <PageHead
        kicker="Start a project"
        title="Bring us a scribble."
        intro="A sentence, a sketch or a list of tools you use today is plenty. We turn it into questions, then a written plan."
      />
      <section className={`wrap section ${styles.grid}`}>
        <div className={styles.form}>
          <ContactForm services={services.map(({ id, name }) => ({ id, name }))} context={context} />
        </div>
        <aside className={styles.aside} aria-label="Other ways to reach us">
          <div className={styles.card}>
            <h2 className="label">Prefer email?</h2>
            <a href={`mailto:${site.email}`} className={`link ${styles.email}`}>
              {site.email}
            </a>
          </div>
          <div className={styles.card}>
            <h2 className="label">What happens next</h2>
            <ol role="list" className={styles.steps}>
              <li>We read your message and reply with questions.</li>
              <li>A short call to understand the problem.</li>
              <li>A written plan with scope, timeline and price.</li>
            </ol>
          </div>
          <MarginNote at={{ bottom: "-2rem", left: "0" }} tilt={-4}>
            no sales scripts, promise
          </MarginNote>
        </aside>
      </section>
    </>
  );
}
