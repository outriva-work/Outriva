import Link from "next/link";
import { ServiceArt } from "@/components/art/ServiceArt";
import { CaseCard } from "@/components/CaseCard";
import { Faq } from "@/components/home/Faq";
import { Hero } from "@/components/home/Hero";
import { Process } from "@/components/home/Process";
import { MarginNote } from "@/components/MarginNote";
import { ModeToggle } from "@/components/ModeToggle";
import { Reveal } from "@/components/Reveal";
import { cases } from "@/content/cases";
import { services } from "@/content/services";
import { site } from "@/content/site";
import styles from "./home.module.css";

export default function HomePage() {
  const featured = cases.filter((c) => c.featured).slice(0, 4);
  const ndaCount = cases.filter((c) => c.nda).length;

  return (
    <>
      <Hero />

      {/* Services */}
      <section id="services" className={`section ${styles.services}`} aria-labelledby="services-title">
        <div className="wrap">
          <div className={styles.head}>
            <h2 id="services-title" className="h2">
              Four kinds of work, one way of doing it
            </h2>
            <p className="muted">
              Every project starts as a rough sketch and ends as something that runs. Hover a card to see where it began.
            </p>
          </div>
          <ul role="list" className={styles.serviceGrid}>
            {services.map((s, i) => (
              <li key={s.id} id={s.id} className={styles.serviceItem}>
                <Reveal delay={(i % 2) * 90} className={styles.fill}>
                  <div className={`show-sketch ${styles.serviceCard}`}>
                  <div className={`graph ${styles.serviceArt}`}>
                    <ServiceArt id={s.id} note={s.scribble} />
                  </div>
                  <div className={styles.serviceBody}>
                    <h3 className="h3">{s.name}</h3>
                    <p className={styles.serviceLine}>{s.line}</p>
                    <p className="muted small">{s.description}</p>
                    <ul role="list" className={styles.includes} aria-label={`${s.name} includes`}>
                      {s.includes.map((x) => (
                        <li key={x} className="chip">
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Work */}
      <section id="work" className={`section surface-2 ${styles.work}`} aria-labelledby="work-title">
        <div className="wrap">
          <div className={styles.head}>
            <h2 id="work-title" className="h2">
              Work, mostly under NDA
            </h2>
            <p className="muted">
              Most of our clients prefer not to be named, so we don&apos;t. Here is what we built for them, by sector.{" "}
              {ndaCount} of {cases.length} projects are under a non-disclosure agreement.
            </p>
          </div>
          <ul role="list" className={styles.workGrid}>
            {featured.map((c, i) => (
              <li key={c.slug}>
                <Reveal delay={(i % 2) * 90}>
                  <CaseCard item={c} />
                </Reveal>
              </li>
            ))}
          </ul>
          <div className={styles.more}>
            <Link href="/work" className="btn btn--ink">
              See all {cases.length} projects
            </Link>
          </div>
        </div>
        <MarginNote at={{ top: "5rem", right: "4%" }} tilt={5}>
          can we name anyone? legal says no
        </MarginNote>
      </section>

      {/* Process */}
      <section id="process" className={`section ${styles.processSection}`} aria-labelledby="process-title">
        <div className="wrap">
          <div className={styles.head}>
            <h2 id="process-title" className="h2">
              From scribble to shipped
            </h2>
            <p className="muted">
              The same four steps for a landing page or a full platform. You see working software early and often.
            </p>
          </div>
          <Process />
        </div>
      </section>

      {/* The draft underneath */}
      <section className={`section surface-ink ${styles.draftBand}`} aria-labelledby="draft-title">
        <div className={`wrap ${styles.draftInner}`}>
          <h2 id="draft-title" className="h2">
            Creativity isn&apos;t a mood. It&apos;s a process you can see.
          </h2>
          <div className={styles.draftSide}>
            <p className={styles.draftText}>
              Every page on this site has its first sketch underneath it. Flip the switch to see the draft we started
              from, notes and all.
            </p>
            <ModeToggle />
          </div>
        </div>
        <MarginNote at={{ bottom: "2.5rem", right: "6%" }} tilt={-6}>
          yes, really. try it
        </MarginNote>
      </section>

      {/* FAQ */}
      <section id="faq" className="section" aria-labelledby="faq-title">
        <div className={`wrap ${styles.faq}`}>
          <div className={styles.faqHead}>
            <h2 id="faq-title" className="h2">
              Questions people ask us
            </h2>
            <p className="muted">
              Written as direct answers, the same way we write content for answer engines.
            </p>
          </div>
          <Faq />
        </div>
      </section>

      {/* Closing */}
      <section className={`graph ${styles.closing}`} aria-labelledby="closing-title">
        <div className={`wrap ${styles.closingInner}`}>
          <h2 id="closing-title" className="display">
            Bring us a scribble.
          </h2>
          <p className="lead muted">
            A sentence, a screenshot or a sketch on a napkin is plenty. We&apos;ll reply with questions and a rough plan.
          </p>
          <div className={styles.closingActions}>
            <Link href="/contact" className="btn btn--ink">
              Start a project
            </Link>
            <a href={`mailto:${site.email}`} className="btn btn--paper">
              {site.email}
            </a>
          </div>
        </div>
        <MarginNote at={{ top: "18%", right: "8%" }} tilt={-8}>
          napkins accepted
        </MarginNote>
      </section>
    </>
  );
}
