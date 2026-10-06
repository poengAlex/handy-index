// Point maths for HGraph — the parts that are pure arithmetic on a sorted
// point array, split out of the component so they can be unit-tested without
// a DOM or a canvas.
//
// One invariant runs through all of it: a series is sorted ascending on x with
// unique x. Window slicing and hit testing are binary searches, and an editing
// gesture must not break the ordering even for a single frame — the index the
// pointer is holding would swap out from under it.

import type { GraphPoint } from "./graph-types";

/** Last point index with x <= value (binary search), -1 when none. */
export function indexAtOrBefore(
  points: readonly GraphPoint[],
  value: number
): number {
  let lo = 0;
  let hi = points.length - 1;
  let ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (points[mid]!.x <= value) {
      ans = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return ans;
}

/** Index of the point at exactly `x`, or -1. */
export function indexOfX(points: readonly GraphPoint[], x: number): number {
  const at = indexAtOrBefore(points, x);
  return at >= 0 && points[at]!.x === x ? at : -1;
}

/**
 * Round `value` onto a `step` grid. A step of 0 (or anything non-finite) means
 * no grid at all: the value passes through untouched, floats and all — which is
 * the only honest answer on an axis measured in hours or in a 0–1 ratio.
 */
export function snapTo(value: number, step: number): number {
  if (!Number.isFinite(step) || step <= 0) return value;
  return Math.round(value / step) * step;
}

/** Clamp into a domain given either way round — [0, 100] or [100, 0]. */
export function clampToDomain(
  value: number,
  domain: readonly [number, number]
): number {
  const lo = Math.min(domain[0], domain[1]);
  const hi = Math.max(domain[0], domain[1]);
  return Math.min(hi, Math.max(lo, value));
}

export interface DragXLimits {
  /** Floor a dragged or added x may reach. */
  minX?: number;
  /** Ceiling a dragged or added x may reach. */
  maxX?: number;
  /** Grid the x snaps to (0 = none). */
  snapX?: number;
  /** Minimum distance kept to either neighbour. Defaults to one grid step, so
   * a snapped x can never land on a neighbour that is itself on the grid; with
   * no grid, the caller should pass something meaningful in the axis' own
   * units (a pixel's worth is the useful floor). */
  gap?: number;
}

/**
 * Where the point at `index` may actually go on x: snapped to the grid, then
 * pinned strictly between its two neighbours.
 *
 * The pin has to hold on EVERY frame, not just at release. An x that crossed a
 * neighbour would reorder the array and hand the next pointermove a stale
 * index — the point the user is holding would swap under the cursor.
 *
 * Wedged between two neighbours with no room left (adjacent grid steps), the
 * point keeps its own x: the drag becomes vertical-only rather than dead.
 */
export function clampDragX(
  points: readonly GraphPoint[],
  index: number,
  x: number,
  limits: DragXLimits = {}
): number {
  const current = points[index];
  if (!current) return x;
  const {
    minX = Number.NEGATIVE_INFINITY,
    maxX = Number.POSITIVE_INFINITY,
    snapX = 1
  } = limits;
  const gap = limits.gap ?? (Number.isFinite(snapX) && snapX > 0 ? snapX : 1);
  const prev = points[index - 1];
  const next = points[index + 1];
  const lo = prev ? Math.max(minX, prev.x + gap) : minX;
  const hi = next ? Math.min(maxX, next.x - gap) : maxX;
  if (hi < lo) return current.x;
  return Math.min(hi, Math.max(lo, snapTo(x, snapX)));
}

/**
 * Where a new point at `x` would land: its insertion index, and whether that
 * millisecond is already taken.
 *
 * A host that adds on a taken x would REPLACE the point sitting there, which
 * from the user's side reads as "clicking empty canvas dragged an existing
 * point" — so callers select the occupant instead. Returning both halves lets
 * them make that call without searching twice.
 */
export function insertionAt(
  points: readonly GraphPoint[],
  x: number
): { index: number; taken: boolean } {
  const at = indexAtOrBefore(points, x);
  if (at >= 0 && points[at]!.x === x) return { index: at, taken: true };
  return { index: at + 1, taken: false };
}
