import Link from "next/link";
import type { CaseStudy } from "@/content/cases";
import { getService } from "@/content/services";
import { CaseCover } from "./art/CaseCover";
import { Redacted } from "./Redacted";
import styles from "./CaseCard.module.css";

export function CaseCard({ item }: { item: CaseStudy }) {
  return (
    <article className={styles.card}>
      <Link href={`/work/${item.slug}`} className={`case-link ${styles.link}`}>
        <CaseCover glyph={item.cover.glyph} tone={item.cover.tone} nda={item.nda} />
        <div className={styles.body}>
          <p className={styles.meta}>
            <span className={styles.sector}>{item.sector}</span>
            <span className={styles.client}>
              Client <Redacted width={item.nda ? 10 : 7} />
            </span>
          </p>
          <h3 className={`h3 ${styles.title}`}>{item.headline}</h3>
          <ul role="list" className={styles.tags}>
            {item.services.map((id) => (
              <li key={id} className="chip">
                {getService(id).short}
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </article>
  );
}
