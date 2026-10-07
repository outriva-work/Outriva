"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="graph" style={{ minHeight: "80svh", display: "grid", alignItems: "center", paddingTop: "var(--header-h)" }}>
      <div className="wrap" style={{ display: "grid", gap: "1.25rem", justifyItems: "start" }}>
        <p className="note" style={{ fontSize: "1.75rem" }}>
          well, that didn&apos;t draw
        </p>
        <h1 className="display">This page didn&apos;t load.</h1>
        <p className="lead muted">Something went wrong on our side. Try again, and if it keeps happening, email us.</p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button type="button" className="btn btn--ink" onClick={reset}>
            Try again
          </button>
          <Link href="/" className="btn btn--paper">
            Go to the home page
          </Link>
        </div>
      </div>
    </section>
  );
}
