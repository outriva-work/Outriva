"use client";

import { useEffect, useRef, useState } from "react";
import { process } from "@/content/process";
import styles from "./Process.module.css";

/** A line that starts as a tangle and ends perfectly straight, drawn as it scrolls into view. */
function pathData() {
  const pts: string[] = [];
  const steps = 1100;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Loops tighten and fade along the line until it runs perfectly straight.
    const calm = Math.max(0, 1 - t / 0.78) ** 1.4;
    const x = 30 + t * 1120 - Math.sin(t * 120) * 30 * calm;
    const y = 60 + Math.cos(t * 120) * 32 * calm + Math.sin(t * 7) * 8 * calm;
    pts.push(`${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join(" ");
}

const d = pathData();

export function Process() {
  const ref = useRef<HTMLOListElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return setDrawn(true);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setDrawn(true), io.disconnect()), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className={styles.process} data-drawn={drawn}>
      <svg viewBox="0 0 1200 120" className={styles.line} aria-hidden="true" preserveAspectRatio="none">
        <path d={d} pathLength={1} className={styles.path} />
        <path d="M1134 46 L 1160 60 L 1134 74" className={styles.head} />
      </svg>
      <ol ref={ref} role="list" className={styles.steps}>
        {process.map((step, i) => (
          <li key={step.name} className={styles.step} style={{ transitionDelay: `${300 + i * 220}ms` }}>
            <span className={styles.node} aria-hidden="true" />
            <span className={styles.number}>{i + 1}</span>
            <h3 className="h3">{step.name}</h3>
            <p className="muted">{step.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
