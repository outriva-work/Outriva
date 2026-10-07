"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { dist, ease, GRID, resample, RESOLVE_MS, resolveStroke, SAMPLES, type Pt } from "@/lib/scribble";
import styles from "./SketchPad.module.css";

export interface SketchPadHandle {
  /** The drawing as a PNG data URL, or null if nothing was drawn. */
  toDataURL(): string | null;
  clear(): void;
}

interface Stroke {
  raw: Pt[];
  from: Pt[] | null;
  to: Pt[] | null;
  nodes: Pt[];
  start: number;
}

/** A small graph-paper pad on the contact form: draw the idea, optionally tidy it onto the grid. */
export const SketchPad = forwardRef<SketchPadHandle>(function SketchPad(_, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<Stroke[]>([]);
  const active = useRef<Stroke | null>(null);
  const size = useRef({ w: 0, h: 0 });
  const animating = useRef(false);
  const [count, setCount] = useState(0);

  const render = useCallback((now: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return false;
    const { w, h } = size.current;
    ctx.fillStyle = "#fbfbf8";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(36,64,224,0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= w; x += GRID) {
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += GRID) {
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(w, y + 0.5);
      ctx.stroke();
    }

    let moving = false;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const s of [...strokes.current, ...(active.current ? [active.current] : [])]) {
      const p = s.to ? Math.min(1, Math.max(0, (now - s.start) / RESOLVE_MS)) : 0;
      if (s.to && p < 1) moving = true;
      const e = ease(p);
      ctx.strokeStyle = e > 0 ? `rgb(${91 - 55 * e},${96 - 32 * e},${112 + 112 * e})` : "#5b6070";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      if (p >= 1) {
        s.nodes.forEach((n, i) => (i ? ctx.lineTo(n.x, n.y) : ctx.moveTo(n.x, n.y)));
      } else {
        const pts = s.from && s.to ? s.from.map((a, i) => ({ x: a.x + (s.to![i].x - a.x) * e, y: a.y + (s.to![i].y - a.y) * e })) : s.raw;
        pts.forEach((n, i) => (i ? ctx.lineTo(n.x, n.y) : ctx.moveTo(n.x, n.y)));
      }
      ctx.stroke();
      if (p >= 1) {
        ctx.fillStyle = "#fbfbf8";
        ctx.strokeStyle = "#2440e0";
        ctx.lineWidth = 1.5;
        for (const n of s.nodes) {
          ctx.fillRect(n.x - 3.5, n.y - 3.5, 7, 7);
          ctx.strokeRect(n.x - 3.5, n.y - 3.5, 7, 7);
        }
      }
    }
    return moving;
  }, []);

  const animate = useCallback(() => {
    if (animating.current) return;
    animating.current = true;
    const loop = (now: number) => {
      const moving = render(now) || Boolean(active.current);
      if (moving) requestAnimationFrame(loop);
      else animating.current = false;
    };
    requestAnimationFrame(loop);
  }, [render]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size.current = { w: rect.width, h: rect.height };
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
      render(performance.now());
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);
    return () => ro.disconnect();
  }, [render]);

  const point = (e: ReactPointerEvent | PointerEvent): Pt => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    active.current = { raw: [point(e)], from: null, to: null, nodes: [], start: 0 };
    animate();
  };
  const onMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const s = active.current;
    if (!s) return;
    for (const ev of e.nativeEvent.getCoalescedEvents?.() ?? [e.nativeEvent]) {
      const p = point(ev);
      if (dist(p, s.raw[s.raw.length - 1]) > 1.5) s.raw.push(p);
    }
  };
  const onUp = () => {
    const s = active.current;
    active.current = null;
    if (s && s.raw.length > 1) {
      strokes.current.push(s);
      setCount(strokes.current.length);
    }
    render(performance.now());
  };

  const tidy = () => {
    const now = performance.now();
    for (const s of strokes.current) {
      if (s.to) continue;
      const to = resolveStroke(s.raw);
      if (!to) continue;
      s.from = resample(s.raw, SAMPLES);
      s.to = resample(to, SAMPLES);
      s.nodes = to;
      s.start = now;
    }
    animate();
  };

  const clear = useCallback(() => {
    strokes.current = [];
    setCount(0);
    render(performance.now());
  }, [render]);

  useImperativeHandle(ref, () => ({
    toDataURL: () => (strokes.current.length ? canvasRef.current?.toDataURL("image/png") ?? null : null),
    clear,
  }), [clear]);

  return (
    <div className={styles.pad}>
      <div className={styles.surface}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          role="img"
          aria-label="Sketch pad: draw your idea with a mouse, pen or finger"
        />
        {count === 0 && <span className={`note ${styles.empty}`}>sketch it here, if words don&apos;t fit</span>}
      </div>
      <div className={styles.tools}>
        <button type="button" onClick={tidy} disabled={count === 0}>
          Tidy it up
        </button>
        <button type="button" onClick={clear} disabled={count === 0}>
          Clear
        </button>
      </div>
    </div>
  );
});
