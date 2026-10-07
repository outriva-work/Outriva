"use client";

import { useEffect, useState } from "react";
import styles from "./ModeToggle.module.css";

type Mode = "draft" | "final";
const KEY = "outriva-mode";

/** Flips the whole site between its finished design and the sketch it started as. */
export function ModeToggle() {
  const [mode, setMode] = useState<Mode>("final");

  // Stay in sync with the page, including when another toggle on the page changes it.
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setMode(root.dataset.mode === "draft" ? "draft" : "final");
    read();
    const mo = new MutationObserver(read);
    mo.observe(root, { attributes: true, attributeFilter: ["data-mode"] });
    return () => mo.disconnect();
  }, []);

  const choose = (next: Mode) => {
    if (next === mode) return;
    setMode(next);
    document.documentElement.dataset.mode = next;
    document.body.classList.remove("mode-flash");
    void document.body.offsetWidth; // restart the animation
    document.body.classList.add("mode-flash");
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* storage unavailable: the choice lasts for this visit */
    }
  };

  return (
    <div className={styles.toggle} role="group" aria-label="View the site as">
      <button type="button" aria-pressed={mode === "draft"} onClick={() => choose("draft")} className={styles.draft}>
        Draft
      </button>
      <button type="button" aria-pressed={mode === "final"} onClick={() => choose("final")}>
        Final
      </button>
      <span className={styles.thumb} data-mode={mode} aria-hidden="true" />
    </div>
  );
}

/** Runs before the page paints so a saved Draft view doesn't flash the final design first. */
export const modeScript = `try{var m=localStorage.getItem('${KEY}');if(m==='draft')document.documentElement.dataset.mode='draft'}catch(e){}document.documentElement.classList.add('js')`;
