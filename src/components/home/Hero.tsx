"use client";

import Link from "next/link";
import { useState } from "react";
import { services } from "@/content/services";
import { MarginNote } from "../MarginNote";
import { ScribbleCanvas } from "./ScribbleCanvas";
import styles from "./Hero.module.css";

/**
 * The opening: a sheet of graph paper. A rough sketch of a website draws itself and then
 * resolves onto the grid; anything the visitor draws is tidied up the same way.
 */
export function Hero() {
  const [drawn, setDrawn] = useState(false);

  return (
    <section className={`graph ${styles.hero}`} aria-labelledby="hero-title">
      <ScribbleCanvas onFirstStroke={() => setDrawn(true)} />

      <div className={`wrap ${styles.copy}`}>
        <h1 id="hero-title" className={`display ${styles.title}`}>
          <span className={styles.line}>
            <span>Every system</span>
          </span>
          <span className={styles.line}>
            <span>starts as a</span>
          </span>
          <span className={styles.line}>
            <span>scribble.</span>
          </span>
        </h1>

        <p className={`lead ${styles.lead}`}>
          Outriva designs and builds websites, search visibility, AI automation and custom software. Bring us the rough
          idea. We&apos;ll draw it properly.
        </p>

        <div className={styles.actions}>
          <Link href="/contact" className="btn btn--ink">
            Start a project
          </Link>
          <Link href="/work" className="btn btn--paper">
            See the work
          </Link>
        </div>

        <ul role="list" className={styles.services} aria-label="What we do">
          {services.map((s) => (
            <li key={s.id}>
              <Link href={`/#${s.id}`} className="chip">
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <p className={`note ${styles.hint}`} data-hidden={drawn} aria-hidden="true">
        go on, draw something on the grid
        <svg viewBox="0 0 80 60" className={styles.arrow}>
          <path d="M6 6 C 20 40, 46 52, 72 46" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M60 38 L 73 46 L 61 55" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </p>

      <MarginNote at={{ top: "10%", left: "30%" }} tilt={3}>
        headline too big? no. bigger.
      </MarginNote>
    </section>
  );
}
