import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseCover } from "@/components/art/CaseCover";
import { MarginNote } from "@/components/MarginNote";
import { Redacted } from "@/components/Redacted";
import { cases, getCase } from "@/content/cases";
import { getService } from "@/content/services";
import styles from "./case.module.css";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const item = getCase(slug);
  if (!item) return {};
  return {
    title: `${item.headline} (${item.sector})`,
    description: item.summary,
    alternates: { canonical: `/work/${item.slug}` },
  };
}

export default async function CasePage({ params }: { params: Params }) {
  const { slug } = await params;
  const item = getCase(slug);
  if (!item) notFound();

  const index = cases.findIndex((c) => c.slug === item.slug);
  const next = cases[(index + 1) % cases.length];

  return (
    <article>
      <header className={`graph ${styles.head}`}>
        <div className={`wrap ${styles.headInner}`}>
          <Link href="/work" className={`link ${styles.back}`}>
            All work
          </Link>
          <p className={styles.meta}>
            <span className={styles.sector}>{item.sector}</span>
            <span>
              Client <Redacted width={item.nda ? 12 : 8} />
            </span>
            <span className={styles.status} data-nda={item.nda}>
              {item.nda ? "Under NDA" : "Shareable on request"}
            </span>
          </p>
          <h1 className={`h2 ${styles.title}`}>{item.headline}</h1>
          <p className="lead muted">{item.summary}</p>
          <ul role="list" className={styles.tags}>
            {item.services.map((id) => (
              <li key={id}>
                <Link href={`/#${id}`} className="chip">
                  {getService(id).name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <div className={`wrap ${styles.cover}`}>
        <CaseCover glyph={item.cover.glyph} tone={item.cover.tone} nda={item.nda} large />
      </div>

      <div className={`wrap section ${styles.body}`}>
        <section className={styles.block} aria-labelledby="brief">
          <h2 id="brief" className={styles.blockTitle}>
            The brief
          </h2>
          <p className={styles.brief}>{item.brief}</p>
        </section>

        <section className={styles.block} aria-labelledby="did">
          <h2 id="did" className={styles.blockTitle}>
            What we did
          </h2>
          <ul role="list" className={styles.list}>
            {item.did.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </section>

        <section className={styles.block} aria-labelledby="changed">
          <h2 id="changed" className={styles.blockTitle}>
            What changed
          </h2>
          <ul role="list" className={`${styles.list} ${styles.changed}`}>
            {item.changed.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          {item.nda && (
            <div className={styles.redactedBlock} aria-label="Further details withheld under NDA">
              <span style={{ width: "92%" }} />
              <span style={{ width: "78%" }} />
              <span style={{ width: "85%" }} />
              <span style={{ width: "40%" }} />
              <p className="small muted">
                Figures and screenshots for this project are covered by an NDA. We can walk through more of it on a call.
              </p>
            </div>
          )}
        </section>

        <section className={styles.block} aria-labelledby="stack">
          <h2 id="stack" className={styles.blockTitle}>
            Built with
          </h2>
          <ul role="list" className={styles.stack}>
            {item.stack.map((s) => (
              <li key={s} className="chip">
                {s}
              </li>
            ))}
          </ul>
        </section>
        <MarginNote at={{ top: "4rem", right: "3%" }} tilt={4}>
          keep it short. they&apos;re busy
        </MarginNote>
      </div>

      <section className={`surface-2 ${styles.cta}`} aria-label="Next steps">
        <div className={`wrap ${styles.ctaInner}`}>
          <div className={styles.ctaText}>
            <h2 className="h3">Something similar in mind?</h2>
            <p className="muted">Tell us what you&apos;re working on. We&apos;ll reply with questions and a rough plan.</p>
            <Link href={`/contact?project=${item.slug}`} className="btn btn--ink">
              Ask about this project
            </Link>
          </div>
          <Link href={`/work/${next.slug}`} className={`case-link ${styles.next}`}>
            <span className="label">Next project</span>
            <span className={styles.nextTitle}>{next.headline}</span>
            <span className={styles.nextSector}>{next.sector}</span>
          </Link>
        </div>
      </section>
    </article>
  );
}
