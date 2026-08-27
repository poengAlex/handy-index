// Slider value → the text a header shows.
//
// A value that has round-tripped through another unit carries binary-float
// noise: a gauge thickness stored as the share 0.035 comes back as
// 3.5000000000000004 percent, and a plain interpolation prints every digit
// of it. Round the DISPLAY to the precision the control can actually hold —
// what the host declared for typing (`decimals`) or what the track's `step`
// implies, whichever is finer — then drop trailing zeros, so a clean value
// still reads the way it always did (4, not 4.0).
//
// Display only: the model keeps whatever precision its owner stores, so a
// host that rounds its own values is unaffected and one that doesn't never
// loses any.

/** toFixed accepts up to 100 places; nothing on a slider needs a fraction
 * anywhere near that long, and a step written in exponent form (1e-7) would
 * otherwise report none at all. */
const MAX_DECIMALS = 12;

/** Significant digits kept when there is no declared precision to round to —
 * well inside a double's ~17, so only the noise at the tail is dropped. A
 * whole-step slider whose value is genuinely 3.5 still reads 3.5, and a
 * 15-digit integer is not quietly rounded off at the end (12 would turn
 * 123456789012345 into 123456789012000). */
const SIGNIFICANT = 15;

/** Digits after the point a step can produce: 0.5 → 1, 1 → 0. */
function stepDecimals(step: number): number {
  if (!Number.isFinite(step) || step <= 0) return 0;
  const fraction = String(step).split(".")[1];
  return fraction ? Math.min(fraction.length, MAX_DECIMALS) : 0;
}

/** The precision the control can hold: the finer of `decimals` and `step`. */
export function sliderDecimals(decimals: number, step: number): number {
  return Math.min(Math.max(decimals, stepDecimals(step)), MAX_DECIMALS);
}

export function formatSliderValue(
  value: number,
  decimals: number,
  step: number
): string {
  if (!Number.isFinite(value)) return String(value);
  const places = sliderDecimals(decimals, step);
  return String(
    places > 0
      ? Number(value.toFixed(places))
      : Number(value.toPrecision(SIGNIFICANT))
  );
}
