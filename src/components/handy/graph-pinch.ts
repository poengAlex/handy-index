// Pinch maths for HGraph and the vanilla graph, which imports this file as it
// is. Pure numbers, no DOM: the chart tracks the fingers (or reads Safari's
// gesture scale) and hands the spread and the midpoint here on every move.

/** An x window, `from` below `to`. */
export interface XWindow {
  from: number;
  to: number;
}

/**
 * The x window a pinch asks for, always measured from where the pinch began
 * rather than stepped from the previous frame. The page applies each window a
 * frame late and may clamp it, and a pinch stepped from frame to frame would
 * add that lag up into drift. Measured from the start, the value that sat
 * under the fingers' midpoint stays under it while the fingers spread, close
 * or slide, which is what "the graph follows the fingers" means on one axis.
 *
 * `scale` multiplies the starting span: the fingers' start distance over
 * their distance now, so fingers moving apart (scale below 1) zoom in.
 * `startFrac` and `frac` are the midpoint's fraction across the plot, 0 at
 * the left edge, when the pinch began and now.
 *
 * The limits are the wheel's. Zoom-in floors at 1/10000 of `home`, the data
 * extent. Zooming out to home's width or past it shows home. A window that
 * fits inside home is kept inside it, so sliding the fingers sideways stops
 * at the edge of the data instead of drifting off into empty space.
 */
export function pinchWindow(
  start: XWindow,
  home: XWindow,
  startFrac: number,
  frac: number,
  scale: number
): XWindow {
  const startSpan = start.to - start.from;
  const homeSpan = home.to - home.from;
  if (!(startSpan > 0) || !(scale > 0) || !Number.isFinite(scale)) {
    return { from: start.from, to: start.to };
  }
  const floor = Math.min(startSpan, homeSpan / 10_000);
  const span = Math.max(floor, startSpan * scale);
  if (scale > 1 && homeSpan > 0 && span >= homeSpan) {
    return { from: home.from, to: home.to };
  }
  const anchor = start.from + startFrac * startSpan;
  let from = anchor - frac * span;
  if (homeSpan > 0 && span < homeSpan) {
    from = Math.min(Math.max(from, home.from), home.to - span);
  }
  return { from, to: from + span };
}
