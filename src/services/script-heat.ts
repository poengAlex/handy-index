// Turning a script's `segment_distances` into the two numbers and the one
// strip the video page shows. Framework-free and language-free by the same
// rule as services/format.ts: the arithmetic is universal, the words are not
// — this returns numbers, `video.heat.*` owns the sentences.
//
// The encoding, established against the live API and not the (stale) spec:
// `distances` is RUN-LENGTH ENCODED. A negative entry is a run of that many
// idle seconds; a non-negative entry is one second carrying that much
// movement. Decoded it is exactly `ceil(endTime / 1000)` entries long, which
// held on 40/40 videos sampled fresh and 1054/1054 cached — and it is a
// falsifiable prediction, since 1052 of those 1054 arrays are compressed.
// So the strip is a real clock, not a vague intensity ordering.
import type { ScriptMetadata } from "./script-index/types";

/** Bins in the rendered strip. Part of the ceiling calibration below — bins
 * and aggregator set how hot a bin runs, so changing this means re-deriving
 * HEAT_CEILING_SPM against the catalog. */
export const HEAT_BINS = 120;

/**
 * Where the colour ramp saturates, in strokes per minute.
 *
 * Calibrated on the BINNED quantity, not on per-second peaks: a script's own
 * `max_value` is a one-second spike (p50 ≈ 764 units/s) and scaling 120-bin
 * means against it leaves the median bin at ~0.17 of the ramp — a dim smear.
 * Pooling every non-idle 120-bin mean across 217 sampled scripts (18,931
 * bins) gives p50 87.9, p90 172.8, p95 199.7 spm. At 200 the median bin sits
 * at 44% of the ramp and 5.0% of bins clip, which is the trade we want:
 * mid-tones for ordinary stretches, headroom that only genuinely fast
 * passages reach.
 */
export const HEAT_CEILING_SPM = 200;

/** Faintest a bin carrying any movement may render, as a share of the ramp.
 * A slow-but-moving stretch must not be indistinguishable from a pause. */
export const HEAT_FLOOR = 0.08;

export interface ScriptHeat {
  /** per-second travel distance, gaps expanded — index i is second i of the
   * video, so this is directly plottable against the clock */
  seconds: number[];
  /** seconds carrying at least one movement */
  activeSeconds: number;
  /** length of `seconds`: the script's own span, padded to the video's
   * duration when the video runs longer */
  totalSeconds: number;
  /** mean |change in position| per action, on the funscript 0-100 scale.
   * Measured p50 74.9 — strokes are typically NOT full range, which is
   * exactly why speed is counted rather than derived from distance. */
  amplitude: number;
  /** strokes per minute *while moving*. Deliberately not averaged over idle
   * time: that is what `density` is for, and the two barely correlate. */
  strokesPerMinute: number;
  /** share of the span that carries movement, 0-1 */
  density: number;
  /** per-bin strokes per minute, HEAT_BINS long; 0 marks a resting bin */
  bins: number[];
}

/**
 * Expands the run-length encoding into one entry per second. A negative
 * entry becomes that many zeros; everything else passes through.
 *
 * Defensive against a hand-mangled or future payload: a non-finite entry is
 * dropped rather than turned into NaN seconds, and a run is capped so a
 * corrupt -2000000 can't allocate its way through the tab's memory.
 */
export function decodeSegments(distances: readonly number[]): number[] {
  const seconds: number[] = [];
  for (const value of distances) {
    if (!Number.isFinite(value)) continue;
    if (value < 0) {
      // 24 h of idle is already far past any real script
      const run = Math.min(Math.round(-value), 86_400);
      for (let index = 0; index < run; index += 1) seconds.push(0);
    } else {
      seconds.push(value);
    }
  }
  return seconds;
}

export interface ScriptHeatOptions {
  /** the video's own duration in seconds. The strip is drawn against the
   * video's clock, so a script that stops early is padded out to the end
   * rather than stretched across it. Never truncates: 2.7% of scripts run
   * past the duration the index reports, and the script is the thing being
   * described. */
  spanSeconds?: number;
}

/**
 * The numbers behind the speed row and the strip, or `null` when this script
 * carries nothing to measure — which is the un-enriched metadata shape the
 * newest ~4% of the catalog still has. Callers render nothing at all in that
 * case; there is no half-answer worth showing, because the fallback
 * denominator (the start-to-end span) reads ~32% low at the median and would
 * quietly mean something different from every other page.
 */
export function scriptHeat(
  metadata: ScriptMetadata | undefined,
  options: ScriptHeatOptions = {}
): ScriptHeat | null {
  const distances = metadata?.segment_distances?.distances;
  const total = metadata?.segment_distances?.total_distance;
  const actions = metadata?.actions;
  if (!distances?.length || !total || !actions) return null;

  // amplitude is the units-per-action conversion the whole file hangs on;
  // a zero or non-finite one would poison every spm below it
  const amplitude = total / actions;
  if (!Number.isFinite(amplitude) || amplitude <= 0) return null;

  const seconds = decodeSegments(distances);
  if (!seconds.length) return null;

  // pad (never truncate) to the video's clock, so a script that stops with
  // ten minutes left draws ten minutes of rest rather than being stretched
  const span = Math.round(options.spanSeconds ?? 0);
  if (Number.isFinite(span)) {
    while (seconds.length < span) seconds.push(0);
  }

  let activeSeconds = 0;
  for (const value of seconds) {
    if (value > 0) activeSeconds += 1;
  }
  if (!activeSeconds) return null;

  return {
    seconds,
    activeSeconds,
    totalSeconds: seconds.length,
    amplitude,
    // 30 * actions / activeSeconds is `actions / 2 / activeMinutes`: one
    // stroke is two direction changes. Counted, never derived from distance
    // — a distance-based rate assumes full-range strokes and reads 76.6
    // where the true rate is 101.5.
    strokesPerMinute: (30 * actions) / activeSeconds,
    density: activeSeconds / seconds.length,
    bins: binToStrokes(seconds, amplitude, HEAT_BINS)
  };
}

/** Per-bin strokes per minute: the mean travel distance over the bin's
 * seconds, converted through the same amplitude the headline uses, so the
 * strip and the printed number are the same quantity in the same unit. */
function binToStrokes(
  seconds: readonly number[],
  amplitude: number,
  bins: number
): number[] {
  const out: number[] = Array.from({ length: bins }, () => 0);
  if (!seconds.length) return out;
  for (let bin = 0; bin < bins; bin += 1) {
    const start = Math.floor((bin * seconds.length) / bins);
    // every bin covers at least one second, so a script shorter than the
    // bin count repeats seconds rather than emitting empty bins
    const end = Math.max(
      start + 1,
      Math.floor(((bin + 1) * seconds.length) / bins)
    );
    let sum = 0;
    for (let index = start; index < end && index < seconds.length; index += 1) {
      sum += seconds[index] ?? 0;
    }
    out[bin] = (30 * (sum / (end - start))) / amplitude;
  }
  return out;
}

/** A bin's height/tint as a 0-1 share of the ramp: clipped at the ceiling,
 * and lifted to HEAT_FLOOR whenever there is any movement at all. Exactly 0
 * means resting. */
export function heatIntensity(strokesPerMinute: number): number {
  if (!(strokesPerMinute > 0)) return 0;
  const share = strokesPerMinute / HEAT_CEILING_SPM;
  return Math.min(1, Math.max(HEAT_FLOOR, share));
}
