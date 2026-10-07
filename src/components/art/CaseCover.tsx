import type { ReactNode } from "react";
import type { Glyph, Tone } from "@/content/cases";
import styles from "./CaseCover.module.css";

/**
 * Cover art for a case study: a large line drawing of something from the client's sector.
 * Projects under NDA have the drawing blurred and blacked out, with a stamp.
 */
export function CaseCover({ glyph, tone, nda, large }: { glyph: Glyph; tone: Tone; nda: boolean; large?: boolean }) {
  return (
    <div className={`${styles.cover} sketchable`} data-tone={tone} data-nda={nda} data-large={large || undefined}>
      <svg viewBox="0 0 400 300" className={styles.svg} aria-hidden="true">
        <g className={styles.glyph}>{glyphs[glyph]}</g>
        {nda && (
          <g className={styles.bars}>
            <rect x="44" y="96" width="210" height="26" rx="3" />
            <rect x="120" y="150" width="236" height="26" rx="3" />
            <rect x="64" y="204" width="150" height="26" rx="3" />
          </g>
        )}
      </svg>
      {nda && (
        <span className={styles.stamp}>
          <span>Under NDA</span>
        </span>
      )}
    </div>
  );
}

const glyphs: Record<Glyph, ReactNode> = {
  card: (
    <>
      <rect x="150" y="70" width="240" height="152" rx="18" />
      <rect x="176" y="112" width="40" height="30" rx="6" />
      <line x1="176" y1="176" x2="300" y2="176" />
      <line x1="176" y1="196" x2="250" y2="196" />
      <circle cx="338" cy="190" r="16" />
      <circle cx="358" cy="190" r="16" />
      <rect x="100" y="40" width="240" height="152" rx="18" className={styles.ghost} />
    </>
  ),
  cross: (
    <>
      <path d="M220 40 h70 v70 h70 v70 h-70 v70 h-70 v-70 h-70 v-70 h70 z" />
      <path d="M60 220 h40 l16 -40 l22 80 l18 -60 l12 20 h60" />
    </>
  ),
  hanger: (
    <>
      <path d="M250 80 a20 20 0 1 1 20 20 v18 L 380 200 H 140 L 270 118" />
      <line x1="140" y1="200" x2="380" y2="200" />
      <path d="M160 200 l -10 70 h 220 l -10 -70" className={styles.ghost} />
    </>
  ),
  route: (
    <>
      <path d="M40 250 C 120 250, 110 150, 200 150 S 300 60, 360 60" strokeDasharray="10 10" />
      <circle cx="40" cy="250" r="12" />
      <circle cx="200" cy="150" r="12" />
      <path d="M360 60 m -18 0 a18 18 0 1 1 36 0 c 0 20 -18 34 -18 34 s -18 -14 -18 -34 z" />
      <rect x="230" y="200" width="120" height="60" rx="6" />
      <line x1="230" y1="222" x2="350" y2="222" />
    </>
  ),
  org: (
    <>
      <rect x="210" y="40" width="90" height="46" rx="10" />
      <rect x="110" y="150" width="90" height="46" rx="10" />
      <rect x="310" y="150" width="90" height="46" rx="10" />
      <rect x="210" y="236" width="90" height="46" rx="10" />
      <path d="M255 86 V 118 H 155 V 150 M255 118 H 355 V 150 M155 196 V 214 H 255 V 236" />
    </>
  ),
  plan: (
    <>
      <rect x="120" y="40" width="260" height="220" />
      <line x1="250" y1="40" x2="250" y2="150" />
      <line x1="120" y1="150" x2="320" y2="150" />
      <path d="M320 150 a 40 40 0 0 1 40 -40" />
      <line x1="320" y1="150" x2="320" y2="110" />
      <path d="M190 260 a 34 34 0 0 1 34 -34 v 34" />
      <rect x="140" y="60" width="60" height="40" />
    </>
  ),
  crate: (
    <>
      <rect x="150" y="150" width="110" height="110" />
      <rect x="260" y="150" width="110" height="110" />
      <rect x="205" y="40" width="110" height="110" />
      <path d="M150 150 l110 110 M260 150 l110 110 M205 40 l110 110" className={styles.ghost} />
      <line x1="60" y1="260" x2="390" y2="260" />
    </>
  ),
  book: (
    <>
      <path d="M260 80 C 220 60, 160 60, 120 76 V 250 C 160 234, 220 234, 260 254 Z" />
      <path d="M260 80 C 300 60, 360 60, 400 76 V 250 C 360 234, 300 234, 260 254" />
      <line x1="150" y1="120" x2="230" y2="112" />
      <line x1="150" y1="150" x2="230" y2="142" />
      <line x1="290" y1="112" x2="370" y2="120" />
    </>
  ),
};
