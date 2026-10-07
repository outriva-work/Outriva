"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { dist, LABELS, resample, RESOLVE_MS, resolveStroke, SAMPLES, type Pt } from "@/lib/scribble";
import styles from "./ScribbleCanvas.module.css";

/* -------------------------------------------------------------------------- */
/* The opening demo: a wobbly browser window that tidies itself up.           */
/* -------------------------------------------------------------------------- */

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function wobble(points: Pt[], amp: number, seed: number): Pt[] {
  const rand = seeded(seed);
  const out: Pt[] = [];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const steps = Math.max(8, Math.round(dist(a, b) / 7));
    const nx = -(b.y - a.y) / (dist(a, b) || 1);
    const ny = (b.x - a.x) / (dist(a, b) || 1);
    // A loose hand: one slow bow per segment, a gentle waver, and almost no jitter.
    const bow = (rand() - 0.5) * amp * 2.4;
    const phase = rand() * 6;
    const freq = 2 + rand() * 2.5;
    for (let k = i === 1 ? 0 : 1; k <= steps; k++) {
      const t = k / steps;
      const bend = Math.sin(t * Math.PI) * bow + Math.sin(t * freq * Math.PI + phase) * amp * 0.3;
      out.push({ x: a.x + (b.x - a.x) * t + nx * bend + (rand() - 0.5) * 0.7, y: a.y + (b.y - a.y) * t + ny * bend + (rand() - 0.5) * 0.7 });
    }
  }
  return out;
}

function demoStrokes(w: number, h: number): Pt[][] {
  const mobile = w < 760;
  const x0 = mobile ? w * 0.08 : w * 0.56;
  const x1 = mobile ? w * 0.92 : w * 0.93;
  const y0 = mobile ? h * 0.62 : h * 0.2;
  const y1 = mobile ? h * 0.93 : h * 0.8;
  const W = x1 - x0;
  const H = y1 - y0;
  const P = (fx: number, fy: number): Pt => ({ x: x0 + W * fx, y: y0 + H * fy });
  return [
    // Window frame, overshooting the start the way a quick sketch does.
    wobble([P(0.02, 0.04), P(0.98, 0.0), P(1.0, 0.97), P(0.0, 1.0), P(0.03, -0.03), P(0.12, 0.02)], 7, 11),
    // Browser bar
    wobble([P(0.0, 0.16), P(1.0, 0.15)], 5, 23),
    // Headline
    wobble([P(0.1, 0.34), P(0.62, 0.36)], 6, 37),
    // Subline
    wobble([P(0.1, 0.48), P(0.48, 0.47)], 5, 41),
    // Button
    wobble([P(0.1, 0.64), P(0.36, 0.63), P(0.37, 0.78), P(0.11, 0.79), P(0.1, 0.62)], 4, 53),
    // Picture box
    wobble([P(0.66, 0.32), P(0.9, 0.31), P(0.9, 0.82), P(0.65, 0.83), P(0.67, 0.3)], 5, 67),
  ];
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

interface Stroke {
  raw: Pt[];
  from: Pt[] | null;
  to: Pt[] | null;
  nodes: Pt[];
  /** Time drawing started (demo strokes draw themselves). */
  drawStart: number;
  drawMs: number;
  resolveAt: number;
  label: string | null;
  user: boolean;
}

export function ScribbleCanvas({ onFirstStroke }: { onFirstStroke?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<Stroke[]>([]);
  const active = useRef<Stroke | null>(null);
  const size = useRef({ w: 0, h: 0 });
  const frame = useRef(0);
  const visible = useRef(true);
  const reduced = useRef(false);
  const noteFont = useRef("cursive");
  const lastMode = useRef<string | undefined>(undefined);
  const [touchDraw, setTouchDraw] = useState(false);
  const [hasUserStrokes, setHasUserStrokes] = useState(false);

  const prepare = useCallback((s: Stroke, now: number) => {
    const to = resolveStroke(s.raw);
    if (!to) return false;
    s.from = resample(s.raw, SAMPLES);
    s.to = resample(to, SAMPLES);
    s.nodes = to;
    s.resolveAt = reduced.current ? now - RESOLVE_MS : now;
    return true;
  }, []);

  const playDemo = useCallback((instant = false) => {
    const { w, h } = size.current;
    const now = performance.now() - (instant ? 60_000 : 0);
    let t = now + 500;
    strokes.current = demoStrokes(w, h).map((raw, i) => {
      const drawMs = i === 0 ? 1100 : 420;
      const s: Stroke = {
        raw, from: null, to: null, nodes: [], drawStart: reduced.current ? now - 5000 : t, drawMs,
        resolveAt: Infinity, label: i === 0 ? "idea → v1" : null, user: false,
      };
      s.from = resample(raw, SAMPLES);
      const to = resolveStroke(raw);
      s.to = to ? resample(to, SAMPLES) : s.from;
      s.nodes = to ?? [];
      t += drawMs + 120;
      return s;
    });
    // Everything tidies up together once the sketch is finished.
    const resolveAt = reduced.current ? now - RESOLVE_MS : t + 450;
    strokes.current.forEach((s, i) => (s.resolveAt = resolveAt + i * 70));
  }, []);

  /* ---------- drawing ---------- */
  const render = useCallback((now: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { w, h } = size.current;
    ctx.clearRect(0, 0, w, h);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // In Draft view nothing resolves. Switching back to Final tidies every line up, live.
    const mode = document.documentElement.dataset.mode;
    const draft = mode === "draft";
    if (lastMode.current !== undefined && lastMode.current !== mode && !draft) {
      strokes.current.forEach((s, i) => {
        if (s.to) s.resolveAt = now + 120 + i * 70;
      });
    }
    lastMode.current = mode;

    const userCount = strokes.current.filter((s) => s.user).length;
    let userIndex = 0;

    for (const s of [...strokes.current, ...(active.current ? [active.current] : [])]) {
      const age = s.user ? userCount - 1 - userIndex++ : 0;
      const fade = s.user ? Math.max(0.25, 1 - age * 0.16) : 1;

      // Still being drawn (by hand or by the demo).
      const drawP = s.user ? 1 : Math.min(1, Math.max(0, (now - s.drawStart) / s.drawMs));
      if (drawP <= 0) continue;
      const p = s.to && !draft ? Math.min(1, Math.max(0, (now - s.resolveAt) / RESOLVE_MS)) : 0;
      const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

      let pts: Pt[];
      if (p > 0 && s.from && s.to) {
        pts = s.from.map((a, i) => ({ x: a.x + (s.to![i].x - a.x) * e, y: a.y + (s.to![i].y - a.y) * e }));
      } else {
        const src = s.raw;
        pts = src.slice(0, Math.max(2, Math.ceil(src.length * drawP)));
      }

      // Pencil grey eases into ballpoint blue as the line resolves.
      const r = Math.round(91 + (36 - 91) * e);
      const g = Math.round(96 + (64 - 96) * e);
      const b = Math.round(112 + (224 - 112) * e);
      ctx.strokeStyle = `rgba(${r},${g},${b},${fade})`;
      ctx.lineWidth = 2.6 - e * 0.6;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      if (p >= 1 && s.nodes.length) {
        for (const n of s.nodes.slice(1)) ctx.lineTo(n.x, n.y);
      } else {
        for (let i = 1; i < pts.length - 1; i++) {
          const mx = (pts[i].x + pts[i + 1].x) / 2;
          const my = (pts[i].y + pts[i + 1].y) / 2;
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
        }
        ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      }
      ctx.stroke();

      // Grid nodes appear on each corner once the line has settled.
      if (p > 0.6) {
        const k = Math.min(1, (p - 0.6) / 0.4);
        const sizeN = 7 * (0.6 + 0.4 * k);
        ctx.globalAlpha = k * fade;
        ctx.fillStyle = "#fbfbf8";
        ctx.strokeStyle = "#2440e0";
        ctx.lineWidth = 1.5;
        for (const n of s.nodes) {
          ctx.fillRect(n.x - sizeN / 2, n.y - sizeN / 2, sizeN, sizeN);
          ctx.strokeRect(n.x - sizeN / 2, n.y - sizeN / 2, sizeN, sizeN);
        }
        ctx.globalAlpha = 1;
      }

      // A handwritten label once it's done.
      if (s.label && p >= 1) {
        const since = Math.min(1, (now - s.resolveAt - RESOLVE_MS) / 400);
        const last = s.user
          ? s.nodes.reduce((m, n) => (n.x > m.x ? n : m), s.nodes[0])
          : s.nodes.reduce((m, n) => (n.x + n.y > m.x + m.y ? n : m), s.nodes[0]);
        ctx.globalAlpha = Math.max(0, since) * fade;
        ctx.fillStyle = "#2440e0";
        ctx.font = `700 ${s.user ? 22 : 26}px ${noteFont.current}`;
        ctx.save();
        ctx.translate(last.x + (s.user ? 14 : 12), last.y + (s.user ? 6 : 30));
        ctx.rotate(-0.05);
        ctx.fillText(s.label, s.user ? 0 : -110, 0);
        ctx.restore();
        ctx.globalAlpha = 1;
      }
    }
  }, []);

  /* ---------- lifecycle ---------- */
  useEffect(() => {
    const canvas = canvasRef.current!;
    const parent = canvas.parentElement!;
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const family = getComputedStyle(document.documentElement).getPropertyValue("--font-hand").trim();
    if (family) noteFont.current = family;

    let first = true;
    let lastW = 0;
    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const widthChanged = Math.abs(rect.width - lastW) > 40;
      lastW = rect.width;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size.current = { w: rect.width, h: rect.height };
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Play the demo once; after that a resize redraws it in its finished state.
      if (first) playDemo();
      else if (widthChanged && !strokes.current.some((s) => s.user)) playDemo(true);
      first = false;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const io = new IntersectionObserver(([entry]) => (visible.current = entry.isIntersecting));
    io.observe(parent);

    const loop = (now: number) => {
      if (visible.current) render(now);
      frame.current = requestAnimationFrame(loop);
    };
    frame.current = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      io.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, [playDemo, render]);

  /* ---------- pointer input ---------- */
  const point = (e: ReactPointerEvent | PointerEvent): Pt => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === "touch" && !touchDraw) return;
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    active.current = { raw: [point(e)], from: null, to: null, nodes: [], drawStart: 0, drawMs: 1, resolveAt: Infinity, label: null, user: true };
  };

  const onMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const s = active.current;
    if (!s) return;
    const events = e.nativeEvent.getCoalescedEvents?.() ?? [e.nativeEvent];
    for (const ev of events) {
      const p = point(ev);
      if (dist(p, s.raw[s.raw.length - 1]) > 2) s.raw.push(p);
    }
  };

  const onUp = () => {
    const s = active.current;
    active.current = null;
    if (!s) return;
    if (!prepare(s, performance.now() + 140)) return;
    s.label = LABELS[Math.floor(Math.random() * LABELS.length)];
    // The demo makes way for the visitor's own drawing.
    strokes.current = [...strokes.current.filter((x) => x.user), s].slice(-6);
    if (!hasUserStrokes) {
      setHasUserStrokes(true);
      onFirstStroke?.();
    }
  };

  const clear = () => {
    strokes.current = [];
    setHasUserStrokes(false);
    playDemo();
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        data-touch-draw={touchDraw}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        aria-label="Drawing area: sketch a line or shape and it is redrawn neatly on the grid"
        role="img"
      />
      <div className={styles.tools}>
        <button type="button" className={styles.tool} data-on={touchDraw} onClick={() => setTouchDraw((v) => !v)}>
          {touchDraw ? "Done drawing" : "Tap to draw"}
        </button>
        {hasUserStrokes && (
          <button type="button" className={styles.tool} onClick={clear}>
            Clear the page
          </button>
        )}
      </div>
    </>
  );
}
