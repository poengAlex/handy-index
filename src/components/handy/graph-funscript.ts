// The funscript wire format. A funscript is JSON {actions: [{at: ms, pos: 0-100}]};
// HGraph plots GraphPoint {x: ms, y: 0-100} arrays. These adapters are the one
// shared copy of that conversion — every Handy project used to carry its own.

import type { GraphPoint } from "./graph-types";

export interface FunscriptAction {
  at: number;
  pos: number;
}

export interface Funscript {
  actions: FunscriptAction[];
  inverted?: boolean;
  range?: number;
  version?: string;
  metadata?: Record<string, unknown>;
}

export function pointsToFunscript(points: readonly GraphPoint[]): Funscript {
  return {
    version: "1.0",
    inverted: false,
    range: 100,
    actions: points.map(p => ({ at: Math.round(p.x), pos: Math.round(p.y) }))
  };
}

/**
 * Actions → points, sorted ascending on x with duplicate timestamps collapsed
 * (last wins). HGraph's window slicing and hit testing are binary searches, so
 * out-of-order input would silently drop data — and a file from the wild is
 * not guaranteed to be sorted the way an editor's own model is.
 */
export function funscriptToPoints(script: Funscript): GraphPoint[] {
  if (!Array.isArray(script.actions)) return [];

  const points = script.actions
    .filter(a => typeof a.at === "number" && typeof a.pos === "number")
    .map(a => ({ x: a.at, y: a.pos }))
    .sort((a, b) => a.x - b.x);

  const out: GraphPoint[] = [];
  for (const p of points) {
    if (out.length > 0 && out[out.length - 1]!.x === p.x)
      out[out.length - 1] = p;
    else out.push(p);
  }
  return out;
}

/** Parse funscript JSON text; throws with a readable message on bad input. */
export function parseFunscript(text: string): Funscript {
  const parsed: unknown = JSON.parse(text);
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !Array.isArray((parsed as Funscript).actions)
  ) {
    throw new Error("Not a funscript: missing actions array");
  }
  return parsed as Funscript;
}

export function serializeFunscript(script: Funscript): string {
  return JSON.stringify(script);
}
