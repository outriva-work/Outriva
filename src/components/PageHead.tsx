import type { ReactNode } from "react";
import styles from "./PageHead.module.css";

/** Title block for inner pages, set on a strip of graph paper. */
export function PageHead({ kicker, title, intro, children }: { kicker?: ReactNode; title: string; intro?: ReactNode; children?: ReactNode }) {
  return (
    <header className={`graph ${styles.head}`}>
      <div className={`wrap ${styles.inner}`}>
        {kicker && <p className={styles.kicker}>{kicker}</p>}
        <h1 className="display">{title}</h1>
        {intro && <div className={`lead muted ${styles.intro}`}>{intro}</div>}
        {children}
      </div>
    </header>
  );
}
