import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <section className={`graph ${styles.page}`}>
      <div className={`wrap ${styles.inner}`}>
        <svg viewBox="0 0 220 140" className={styles.scribble} aria-hidden="true">
          <path
            d="M20 100 C 30 20, 70 20, 60 80 S 110 130, 120 60 S 160 10, 170 70 S 200 120, 205 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
        <p className="note" style={{ fontSize: "1.75rem" }}>
          this page is still a scribble
        </p>
        <h1 className="display">Nothing here yet.</h1>
        <p className="lead muted">The link may be old, or the page was never drawn. Try the work or start from the beginning.</p>
        <div className={styles.actions}>
          <Link href="/" className="btn btn--ink">
            Go to the home page
          </Link>
          <Link href="/work" className="btn btn--paper">
            See the work
          </Link>
        </div>
      </div>
    </section>
  );
}
