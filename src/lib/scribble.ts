/**
 * Geometry for turning a wobbly hand-drawn line into a clean, grid-snapped one.
 * Used by the home page canvas and the sketch pad on the contact form.
 */

export type Pt = { x: number; y: number };

export const GRID = 24;
export const SAMPLES = 80;
export const RESOLVE_MS = 760;
export const LABELS = ["shipped", "v1.0", "on grid", "approved", "live", "sorted", "deployed", "tidy"];

export const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);

export function length(pts: Pt[]) {
  let total = 0;
  for (let i = 1; i < pts.length; i++) total += dist(pts[i - 1], pts[i]);
  return total;
}

/** Evenly spaced points along a polyline. */
export function resample(pts: Pt[], n: number): Pt[] {
  if (pts.length < 2) return Array.from({ length: n }, () => ({ ...pts[0] }));
  const total = length(pts);
  const out: Pt[] = [{ ...pts[0] }];
  const step = total / (n - 1);
  let acc = 0;
  let i = 1;
  let prev = pts[0];
  for (let k = 1; k < n - 1; k++) {
    const target = step * k;
    while (i < pts.length && acc + dist(prev, pts[i]) < target) {
      acc += dist(prev, pts[i]);
      prev = pts[i];
      i++;
    }
    if (i >= pts.length) break;
    const seg = dist(prev, pts[i]) || 1;
    const t = (target - acc) / seg;
    out.push({ x: prev.x + (pts[i].x - prev.x) * t, y: prev.y + (pts[i].y - prev.y) * t });
  }
  while (out.length < n) out.push({ ...pts[pts.length - 1] });
  return out;
}

/** Ramer–Douglas–Peucker simplification. */
export function simplify(pts: Pt[], eps: number): Pt[] {
  if (pts.length < 3) return pts;
  const [a, b] = [pts[0], pts[pts.length - 1]];
  let maxD = 0;
  let index = 0;
  const len = dist(a, b) || 1;
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i];
    const d = Math.abs((b.y - a.y) * p.x - (b.x - a.x) * p.y + b.x * a.y - b.y * a.x) / len;
    if (d > maxD) {
      maxD = d;
      index = i;
    }
  }
  if (maxD > eps) {
    const left = simplify(pts.slice(0, index + 1), eps);
    const right = simplify(pts.slice(index), eps);
    return [...left.slice(0, -1), ...right];
  }
  return [a, b];
}

/** The tidy version of a stroke: simplified, straightened and snapped to the grid. */
export function resolveStroke(raw: Pt[]): Pt[] | null {
  const total = length(raw);
  if (total < 28) return null;
  const closed = dist(raw[0], raw[raw.length - 1]) < Math.max(36, total * 0.07);
  let pts = simplify(resample(raw, 140), Math.max(10, total * 0.035)).map((p) => ({ ...p }));

  // Near-horizontal and near-vertical segments become exactly horizontal and vertical.
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const dx = Math.abs(b.x - a.x);
    const dy = Math.abs(b.y - a.y);
    if (dx > dy * 2.4) b.y = a.y;
    else if (dy > dx * 2.4) b.x = a.x;
  }

  pts = pts.map((p) => ({ x: Math.round(p.x / GRID) * GRID, y: Math.round(p.y / GRID) * GRID }));
  if (closed && pts.length > 2) pts[pts.length - 1] = { ...pts[0] };
  pts = pts.filter((p, i) => i === 0 || p.x !== pts[i - 1].x || p.y !== pts[i - 1].y);
  if (pts.length < 2) pts = [pts[0], { x: pts[0].x + GRID, y: pts[0].y }];
  return pts;
}


/** Ease-in-out cubic. */
export const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
