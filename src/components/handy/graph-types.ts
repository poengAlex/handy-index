// Shared types for HGraph. No imports — this file is the contract the whole
// graph kit (component, decimation, theme resolution, funscript adapter) and
// its host projects agree on.

export interface GraphPoint {
  /** Milliseconds in playback mode; any unit in static mode. */
  x: number;
  /** Position 0-100 by default; see the yDomain prop for other ranges. */
  y: number;
}

export interface GraphSeries {
  id: string;
  /** Shown in hover readouts and in the legend the page builds. */
  label?: string;
  /** CSS color. Omit to take the next slot of the Handy chart ramp
   * (hero Brand Blue → Dark Charcoal → Slate Gray → Divider Gray, and the
   * white-opacity ladder on dark). */
  color?: string;
  visible?: boolean;
  /** Sorted ascending on x, unique x. Treated as an immutable snapshot —
   * markRaw the array and bump the `revision` prop after mutating in place. */
  points: readonly GraphPoint[];
  /** Draw markers only, no connecting line — for sparse event series (command
   * points, annotations) where a line would invent a trend between events. */
  dots?: boolean;
}

/** A shaded x-range (bookmarks, loops, capture spans, …), drawn at low alpha. */
export interface GraphRegion {
  id: string;
  from: number;
  to: number;
  color: string;
  label?: string;
  /** Draw this one emphasized — stronger fill plus solid edge rules, so the
   * region the host considers current stands out (and a zero-length one is
   * visible at all). */
  selected?: boolean;
}

/** A vertical line at x (cue points, thresholds, …). */
export interface GraphMarker {
  id: string;
  x: number;
  color: string;
  dashed?: boolean;
}

export interface SelectedPointRef {
  seriesId: string;
  /** Index into the ORIGINAL points array of that series, never the decimated one. */
  index: number;
}

/** A point being dragged, or one about to be added, in editing mode. The x/y
 * are already snapped and clamped — the host writes them as given. */
export interface PointEdit {
  seriesId: string;
  index: number;
  x: number;
  y: number;
}

/** Canvas-facing colors. Canvas can't read CSS custom properties, so HGraph
 * resolves the Handy tokens off its host element at mount and re-reads them on
 * data-theme flips, falling back to these neutral defaults — the kit therefore
 * drops into token-less projects unchanged. */
export interface GraphTheme {
  axis: string;
  grid: string;
  text: string;
  /** Playhead line and hover crosshair. */
  cursor: string;
  /** Selected-point ring — a focus state, so it wears the focus token. */
  selection: string;
  /** Default series ramp, in emphasis order (design.md §7.3). */
  series: [string, string, string, string];
}
