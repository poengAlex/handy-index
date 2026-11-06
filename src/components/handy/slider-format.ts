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

/** Points a range of more steps than this is tried at, each way. */
const WIDEST_SAMPLES = 2000;
/** Texts handed back for the readout to measure. */
const WIDEST_KEPT = 6;

/**
 * What a value readout holds room for, so it keeps one width while the
 * value moves and what sits beside it holds still (design.md 6.4): the
 * texts it can show at their widest. In tabular figures every digit is as
 * wide as a 0, so each text counts with its digits as zeros. `text` is tried
 * at every step of the range, or, for a range of more steps than
 * WIDEST_SAMPLES, at points spread across it both evenly and (for a range
 * above zero) logarithmically, as a log track spreads them. The longest
 * come back, longest first, with those one character short of it: a text of
 * wider letters can still be the wider one, so the readout lays them all
 * out under itself, unseen, and the font decides.
 */
export function widestSliderTexts(
  text: (value: number) => string,
  min: number,
  max: number,
  step: number
): string[] {
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return [];
  const span = hi - lo;
  const stepped = Number.isFinite(step) && step > 0;
  const snap = (value: number) =>
    stepped ? Math.min(hi, lo + Math.round((value - lo) / step) * step) : value;
  const values = new Set<number>([lo, hi]);
  if (stepped && span / step <= WIDEST_SAMPLES) {
    for (let i = 1; lo + i * step < hi; i++) values.add(lo + i * step);
  } else if (span > 0) {
    for (let i = 1; i < WIDEST_SAMPLES; i++) {
      values.add(snap(lo + (span * i) / WIDEST_SAMPLES));
      if (lo > 0) values.add(snap(lo * (hi / lo) ** (i / WIDEST_SAMPLES)));
    }
  }
  const texts = new Set<string>();
  for (const value of values) texts.add(text(value).replace(/\d/g, "0"));
  const longest = Math.max(0, ...[...texts].map(t => t.length));
  return [...texts]
    .filter(t => t.length >= longest - 1)
    .sort((a, b) => b.length - a.length)
    .slice(0, WIDEST_KEPT);
}
