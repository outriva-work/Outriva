import styles from "./Logo.module.css";

/** The Outriva mark: an open loop that ends on a grid node, a scribble that has been resolved. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <path
        d="M30.5 12.2A13 13 0 1 0 33 21"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <rect x="28.5" y="16.5" width="9" height="9" rx="1.5" fill="var(--blue)" />
    </svg>
  );
}

export function Logo({ tone = "ink" }: { tone?: "ink" | "paper" }) {
  return (
    <span className={styles.logo} data-tone={tone}>
      <Mark className={styles.mark} />
      <span className={styles.word}>outriva</span>
    </span>
  );
}
