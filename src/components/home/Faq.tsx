import { faq } from "@/content/faq";
import styles from "./Faq.module.css";

/** Questions as native disclosure widgets, plus FAQPage structured data for search and answer engines. */
export function Faq() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className={styles.list}>
        {faq.map((item, i) => (
          <details key={item.q} className={styles.item} open={i === 0}>
            <summary>
              <span>{item.q}</span>
              <span className={styles.icon} aria-hidden="true" />
            </summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </>
  );
}
