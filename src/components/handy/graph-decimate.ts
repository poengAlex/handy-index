// Level-of-detail decimation: min/max per pixel column. Preserves stroke
// peaks (the visually load-bearing feature of a funscript) while capping
// the rendered point count at ~2 per column, so a 20k-point script draws
// like a 200-point one when zoomed out.

import type { GraphPoint } from "./graph-types";

/**
 * Reduce `points` (sorted on x) to at most ~2 per pixel column across
 * [from, to] over `widthPx` columns. Returns the input slice untouched
 * when it's already sparse enough.
 */
export function decimateMinMax(
  points: readonly GraphPoint[],
  from: number,
  to: number,
  widthPx: number
): readonly GraphPoint[] {
  if (points.length <= widthPx * 2 || widthPx <= 0 || to <= from) return points;

  const bucketSize = (to - from) / widthPx;
  const out: GraphPoint[] = [];
  // padding points before `from` land in negative buckets — the sentinel
  // must never collide with a real bucket index
  let bucket = Number.NEGATIVE_INFINITY;
  let min: GraphPoint | null = null;
  let max: GraphPoint | null = null;

  const flush = () => {
    if (!min || !max) return;
    // emit in time order so the line stays monotonic on x
    if (min === max) out.push(min);
    else if (min.x <= max.x) out.push(min, max);
    else out.push(max, min);
  };

  for (const p of points) {
    const b = Math.floor((p.x - from) / bucketSize);
    if (b !== bucket) {
      flush();
      bucket = b;
      min = max = p;
    } else {
      if (p.y < min!.y) min = p;
      if (p.y >= max!.y) max = p;
    }
  }
  flush();
  return out;
}
