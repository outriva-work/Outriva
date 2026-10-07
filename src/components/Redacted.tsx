import styles from "./Redacted.module.css";

/** A blacked-out client name. Screen readers hear that the name is withheld. */
export function Redacted({ width = 9 }: { width?: number }) {
  return (
    <span className={styles.bar} style={{ width: `${width}ch` }} role="img" aria-label="Client name withheld">
      <span className={styles.tip} aria-hidden="true">
        nice try
      </span>
    </span>
  );
}
