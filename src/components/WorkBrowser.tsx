"use client";

import { useMemo, useState } from "react";
import type { CaseStudy } from "@/content/cases";
import type { Service } from "@/content/services";
import { CaseCard } from "./CaseCard";
import styles from "./WorkBrowser.module.css";

type Filter = "all" | "nda" | "shareable" | Service["id"];

export function WorkBrowser({ cases, services }: { cases: CaseStudy[]; services: Pick<Service, "id" | "short">[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const shown = useMemo(
    () =>
      cases.filter((c) =>
        filter === "all" ? true : filter === "nda" ? c.nda : filter === "shareable" ? !c.nda : c.services.includes(filter),
      ),
    [cases, filter],
  );

  const options: { id: Filter; label: string }[] = [
    { id: "all", label: "All work" },
    ...services.map((s) => ({ id: s.id as Filter, label: s.short })),
    { id: "nda", label: "Under NDA" },
    { id: "shareable", label: "Shareable" },
  ];

  return (
    <div>
      <div className={styles.filters} role="group" aria-label="Filter projects">
        {options.map((o) => (
          <button key={o.id} type="button" aria-pressed={filter === o.id} onClick={() => setFilter(o.id)}>
            {o.label}
          </button>
        ))}
      </div>
      <p className={styles.count} role="status">
        {shown.length} {shown.length === 1 ? "project" : "projects"}
      </p>
      <ul role="list" className={styles.grid}>
        {shown.map((c) => (
          <li key={c.slug} className={styles.item}>
            <CaseCard item={c} />
          </li>
        ))}
      </ul>
    </div>
  );
}
