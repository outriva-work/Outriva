import type { ReactNode } from "react";
import type { ServiceId } from "@/content/services";
import styles from "./ServiceArt.module.css";

/**
 * Each service illustration is drawn twice from the same shapes: the finished version,
 * and a rough pencil sketch of it with handwritten notes. Hovering the card (or switching
 * the site to Draft) shows the sketch.
 */
export function ServiceArt({ id, note }: { id: ServiceId; note: string }) {
  const { shapes, sketchOnly, noteAt } = arts[id];
  return (
    <svg viewBox="0 0 400 300" className={styles.art} role="img" aria-label={labels[id]}>
      <g className={styles.final}>{shapes}</g>
      <g className={styles.draft}>
        <g className={styles.pencil} filter="url(#rough)">
          {shapes}
          {sketchOnly}
        </g>
        <text x={noteAt[0]} y={noteAt[1]} className={styles.note} transform={`rotate(-4 ${noteAt[0]} ${noteAt[1]})`}>
          {note}
        </text>
      </g>
    </svg>
  );
}

const labels: Record<ServiceId, string> = {
  web: "A website layout with a headline, button and picture",
  search: "A search box above an AI answer that cites your site",
  automation: "An inbox feeding an AI agent that routes work to a CRM, helpdesk and report",
  software: "A dashboard with a sidebar, summary figures, a bar chart and a table",
};

const s = styles;

const arts: Record<ServiceId, { shapes: ReactNode; sketchOnly: ReactNode; noteAt: [number, number] }> = {
  web: {
    noteAt: [214, 286],
    shapes: (
      <>
        <rect x="20" y="16" width="360" height="252" rx="14" className={`${s.card} ${s.edge}`} />
        <line x1="20" y1="48" x2="380" y2="48" className={s.edge} />
        <circle cx="40" cy="32" r="4.5" className={s.ink} />
        <circle cx="55" cy="32" r="4.5" className={s.ink} />
        <circle cx="70" cy="32" r="4.5" className={s.ink} />
        <rect x="44" y="76" width="168" height="18" rx="4" className={s.ink} />
        <rect x="44" y="100" width="122" height="18" rx="4" className={s.ink} />
        <rect x="44" y="132" width="150" height="8" rx="4" className={s.muted} />
        <rect x="44" y="146" width="118" height="8" rx="4" className={s.muted} />
        <rect x="44" y="172" width="90" height="28" rx="14" className={`${s.marker} ${s.edge}`} />
        <rect x="236" y="74" width="120" height="126" rx="10" className={s.blue} />
        <circle cx="270" cy="108" r="13" className={s.marker} />
        <polyline points="236,184 276,146 302,170 326,150 356,180" className={s.white} />
        <rect x="44" y="220" width="96" height="30" rx="6" className={s.soft} />
        <rect x="152" y="220" width="96" height="30" rx="6" className={s.soft} />
        <rect x="260" y="220" width="96" height="30" rx="6" className={s.soft} />
      </>
    ),
    sketchOnly: (
      <>
        <line x1="236" y1="74" x2="356" y2="200" />
        <line x1="356" y1="74" x2="236" y2="200" />
      </>
    ),
  },

  search: {
    noteAt: [238, 290],
    shapes: (
      <>
        <rect x="20" y="16" width="360" height="44" rx="22" className={`${s.card} ${s.edge}`} />
        <circle cx="46" cy="37" r="8" className={s.edgeOnly} />
        <line x1="52" y1="43" x2="59" y2="50" className={s.edge} />
        <text x="70" y="43" className={s.text}>best invoicing tool for agencies?</text>
        <rect x="20" y="76" width="360" height="132" rx="14" className={`${s.card} ${s.edge}`} />
        <rect x="38" y="92" width="82" height="22" rx="11" className={s.blue} />
        <text x="52" y="107" className={s.textWhite}>AI answer</text>
        <rect x="38" y="128" width="300" height="8" rx="4" className={s.muted} />
        <rect x="38" y="144" width="262" height="8" rx="4" className={s.muted} />
        <rect x="38" y="166" width="214" height="24" rx="5" className={s.marker} />
        <text x="48" y="183" className={s.text}>according to yourbrand.com</text>
        <rect x="20" y="222" width="34" height="34" rx="8" className={s.blue} />
        <text x="32" y="245" className={s.textWhite}>1</text>
        <rect x="66" y="228" width="200" height="9" rx="4.5" className={s.ink} />
        <rect x="66" y="243" width="140" height="7" rx="3.5" className={s.muted} />
        <rect x="20" y="264" width="34" height="20" rx="6" className={s.soft} />
        <rect x="66" y="268" width="170" height="8" rx="4" className={s.soft} />
      </>
    ),
    sketchOnly: (
      <>
        <path d="M330 220 q 14 -18 28 -4 q 10 12 -8 22 q -8 5 -8 14" />
        <circle cx="342" cy="268" r="2" />
      </>
    ),
  },

  automation: {
    noteAt: [150, 290],
    shapes: (
      <>
        <path d="M110 140 C 135 140, 135 140, 158 140" className={s.wire} />
        <path d="M242 128 C 266 128, 262 74, 288 74" className={s.wire} />
        <path d="M242 140 C 266 140, 266 150, 288 150" className={s.wire} />
        <path d="M242 152 C 266 152, 262 226, 288 226" className={s.wire} />
        <rect x="20" y="112" width="90" height="56" rx="12" className={`${s.card} ${s.edge}`} />
        <text x="40" y="145" className={s.text}>Inbox</text>
        <rect x="158" y="96" width="84" height="88" rx="16" className={s.blue} />
        <circle cx="200" cy="128" r="12" className={s.marker} />
        <text x="179" y="166" className={s.textWhite}>Agent</text>
        <rect x="288" y="52" width="92" height="44" rx="10" className={`${s.card} ${s.edge}`} />
        <text x="314" y="79" className={s.text}>CRM</text>
        <rect x="288" y="128" width="92" height="44" rx="10" className={`${s.card} ${s.edge}`} />
        <text x="302" y="155" className={s.text}>Helpdesk</text>
        <rect x="288" y="204" width="92" height="44" rx="10" className={`${s.card} ${s.edge}`} />
        <text x="308" y="231" className={s.text}>Report</text>
        <circle cx="158" cy="140" r="4" className={s.ink} />
        <circle cx="288" cy="74" r="4" className={s.ink} />
        <circle cx="288" cy="150" r="4" className={s.ink} />
        <circle cx="288" cy="226" r="4" className={s.ink} />
        <rect x="190" y="40" width="20" height="20" rx="10" className={`${s.marker} ${s.edge}`} />
        <polyline points="195,50 199,54 206,46" className={s.edge} />
        <line x1="200" y1="60" x2="200" y2="96" className={s.dash} />
      </>
    ),
    sketchOnly: (
      <>
        <path d="M60 112 C 40 60, 140 40, 290 60" />
        <path d="M70 168 C 90 250, 200 270, 290 230" />
        <path d="M110 125 C 180 20, 260 260, 290 140" />
      </>
    ),
  },

  software: {
    noteAt: [150, 292],
    shapes: (
      <>
        <rect x="20" y="16" width="360" height="252" rx="14" className={`${s.card} ${s.edge}`} />
        <path d="M34 16 H 92 V 268 H 34 A 14 14 0 0 1 20 254 V 30 A 14 14 0 0 1 34 16 Z" className={s.ink} />
        <rect x="34" y="36" width="44" height="10" rx="5" className={s.marker} />
        <rect x="34" y="62" width="40" height="6" rx="3" className={s.sideItem} />
        <rect x="34" y="78" width="34" height="6" rx="3" className={s.sideItem} />
        <rect x="34" y="94" width="42" height="6" rx="3" className={s.sideItem} />
        <rect x="108" y="32" width="80" height="50" rx="8" className={s.soft} />
        <rect x="198" y="32" width="80" height="50" rx="8" className={s.soft} />
        <rect x="288" y="32" width="78" height="50" rx="8" className={s.blue} />
        <rect x="118" y="44" width="40" height="7" rx="3.5" className={s.muted} />
        <rect x="118" y="58" width="56" height="12" rx="3" className={s.ink} />
        <rect x="208" y="44" width="40" height="7" rx="3.5" className={s.muted} />
        <rect x="208" y="58" width="48" height="12" rx="3" className={s.ink} />
        <rect x="298" y="44" width="40" height="7" rx="3.5" className={s.whiteFill} />
        <rect x="298" y="58" width="52" height="12" rx="3" className={s.whiteFill} />
        <line x1="108" y1="184" x2="366" y2="184" className={s.edge} />
        <rect x="120" y="140" width="22" height="44" rx="3" className={s.muted} />
        <rect x="154" y="118" width="22" height="66" rx="3" className={s.muted} />
        <rect x="188" y="130" width="22" height="54" rx="3" className={s.muted} />
        <rect x="222" y="102" width="22" height="82" rx="3" className={s.blue} />
        <rect x="256" y="124" width="22" height="60" rx="3" className={s.muted} />
        <rect x="290" y="112" width="22" height="72" rx="3" className={s.muted} />
        <rect x="324" y="96" width="22" height="88" rx="3" className={s.muted} />
        <line x1="108" y1="208" x2="366" y2="208" className={s.hair} />
        <line x1="108" y1="230" x2="366" y2="230" className={s.hair} />
        <line x1="108" y1="252" x2="366" y2="252" className={s.hair} />
        <rect x="112" y="214" width="70" height="8" rx="4" className={s.ink} />
        <rect x="112" y="236" width="56" height="8" rx="4" className={s.muted} />
        <rect x="300" y="214" width="56" height="10" rx="5" className={s.marker} />
        <rect x="300" y="236" width="56" height="10" rx="5" className={s.soft} />
      </>
    ),
    sketchOnly: (
      <>
        <line x1="190" y1="204" x2="250" y2="256" />
        <line x1="250" y1="204" x2="190" y2="256" />
      </>
    ),
  },
};
