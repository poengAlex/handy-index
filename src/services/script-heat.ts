// Turning a script's `segment_distances` into the numbers and the strip the
// video page shows, and the speed the browse page filters on. Framework-free
// and language-free by the same rule as services/format.ts: the arithmetic is
// universal, the words are not — this returns numbers, `video.heat.*` owns
// the sentences.
//
// The encoding, established against the live API and not the (stale) spec:
// `distances` is RUN-LENGTH ENCODED. A negative entry is a run of that many
// idle SEGMENTS; a non-negative entry is one segment carrying that much
// movement. Decoded it is exactly `ceil(endTime / resolution)` entries long,
// which holds on 16,303/16,303 index entries and on every per-video response
// sampled — a falsifiable prediction, since 15,474 of those arrays are
// compressed. So the strip is a real clock, not a vague intensity ordering.
//
// Segment width is NOT fixed. The per-video endpoint uses 1 s throughout; the
// copy carried inline on the index is downsampled to roughly 110 segments per
// script, which across the catalog means 50 distinct `resolution` values from
// 2 s to 25 s and beyond. Everything below is therefore expressed per segment
// and scaled by `resolution`, never by an assumed second.
import type { ScriptMetadata } from "./script-index/types";

/** Bins in the rendered strip. Part of the ceiling calibration below — bins
 * and aggregator set how hot a bin runs, so changing this means re-deriving
 * HEAT_CEILING_SPM against the catalog. */
export const HEAT_BINS = 120;

/**
 * Where the colour ramp saturates, in strokes per minute.
 *
 * Calibrated on the BINNED quantity, not on per-segment peaks: a script's own
 * `max_value` is a single segment's spike and scaling 120-bin means against
 * it leaves the median bin at ~0.17 of the ramp — a dim smear. Pooling every
 * non-idle 120-bin mean across 217 sampled scripts (18,931 bins) gives p50
 * 87.9, p90 172.8, p95 199.7 spm. At 200 the median bin sits at 44% of the
 * ramp and 5.0% of bins clip: mid-tones for ordinary stretches, headroom that
 * only genuinely fast passages reach.
 */
export const HEAT_CEILING_SPM = 200;

/** Faintest a bin carrying any movement may render, as a share of the ramp.
 * A slow-but-moving stretch must not be indistinguishable from a pause. */
export const HEAT_FLOOR = 0.08;

export interface ScriptHeat {
  /** per-segment travel distance, idle runs expanded back out */
  segments: number[];
  /** seconds each segment covers — 1 off the per-video endpoint, commonly
   * 3-25 off the index's inline copy */
  segmentSeconds: number;
  /** seconds carrying movement. Resolution-bound: a 7 s segment holding one
   * second of motion counts as 7, which is why an index-derived speed reads
   * about 8% below the same script measured at 1 s. */
  activeSeconds: number;
  /** the script's own span, padded to the video's duration when longer */
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
  /** whole strokes in the script: one stroke is two direction changes */
  strokes: number;
  /** the busiest bin's rate. Deliberately the binned figure and not
   * `segment_distances.max_value`, which is one segment's spike and would
   * print a number no stretch of the video sustains. */
  peakStrokesPerMinute: number;
  /** the longest unbroken pause inside the script's own span, in seconds.
   * Measured before the video-length padding: the silence after a script ends
   * is the script being over, not a rest in it. */
  longestRestSeconds: number;
}

/**
 * Expands the run-length encoding into one entry per segment. A negative
 * entry becomes that many zeros; everything else passes through.
 *
 * Defensive against a hand-mangled or future payload: a non-finite entry is
 * dropped rather than turned into NaN segments, and a run is capped so a
 * corrupt -2000000 can't allocate its way through the tab's memory.
 */
export function decodeSegments(distances: readonly number[]): number[] {
  const segments: number[] = [];
  for (const value of distances) {
    if (!Number.isFinite(value)) continue;
    if (value < 0) {
      // 86,400 segments is a day even at one-second resolution
      const run = Math.min(Math.round(-value), 86_400);
      for (let index = 0; index < run; index += 1) segments.push(0);
    } else {
      segments.push(value);
    }
  }
  return segments;
}

export interface ScriptHeatOptions {
  /** the video's own duration in seconds. The strip is drawn against the
   * video's clock, so a script that stops early is padded out to the end
   * rather than stretched across it. Never truncates: 2.7% of scripts run
   * past the duration the index reports, and the script is the thing being
   * described. */
  spanSeconds?: number;
}

/** Direction changes in the script. The per-video endpoint calls this
 * `actions`; the index's inline copy ships the identical number as `points`
 * and omits `actions` entirely (verified equal on 50/50 videos carried by
 * both). Either spelling is accepted so one selector serves both sources. */
function actionsOf(metadata: ScriptMetadata): number | undefined {
  return metadata.actions ?? metadata.points;
}

/**
 * The numbers behind the speed row and the strip, or `null` when this script
 * carries nothing to measure. Callers render nothing at all in that case;
 * there is no half-answer worth showing, because the only fallback
 * denominator (the start-to-end span) reads ~30% low and would quietly mean
 * something different from every other page.
 */
export function scriptHeat(
  metadata: ScriptMetadata | undefined,
  options: ScriptHeatOptions = {}
): ScriptHeat | null {
  const distances = metadata?.segment_distances?.distances;
  const total = metadata?.segment_distances?.total_distance;
  const actions = metadata ? actionsOf(metadata) : undefined;
  if (!distances?.length || !total || !actions) return null;

  // width of one segment. Absent or nonsensical means the per-video
  // endpoint's default; a bad value here would scale every figure below it.
  const resolution = metadata.segment_distances?.resolution;
  const segmentSeconds =
    Number.isFinite(resolution) && (resolution ?? 0) > 0
      ? (resolution as number) / 1000
      : 1;

  // amplitude is the units-per-action conversion the whole file hangs on;
  // a zero or non-finite one would poison every spm below it
  const amplitude = total / actions;
  if (!Number.isFinite(amplitude) || amplitude <= 0) return null;

  const segments = decodeSegments(distances);
  if (!segments.length) return null;

  // taken here, while the array is still only as long as the script: past the
  // padding below, the tail of a short script would read as one enormous rest
  const longestRestSeconds = longestRun(segments) * segmentSeconds;

  // pad (never truncate) to the video's clock, so a script that stops with
  // ten minutes left draws ten minutes of rest rather than being stretched
  const span = Math.round(options.spanSeconds ?? 0);
  if (Number.isFinite(span)) {
    const wanted = Math.ceil(span / segmentSeconds);
    while (segments.length < wanted) segments.push(0);
  }

  let activeSegments = 0;
  for (const value of segments) {
    if (value > 0) activeSegments += 1;
  }
  if (!activeSegments) return null;

  const activeSeconds = activeSegments * segmentSeconds;
  const bins = binToStrokes(segments, amplitude, segmentSeconds, HEAT_BINS);

  return {
    segments,
    segmentSeconds,
    activeSeconds,
    totalSeconds: segments.length * segmentSeconds,
    amplitude,
    // 30 * actions / activeSeconds is `actions / 2 / activeMinutes`: one
    // stroke is two direction changes. Counted, never derived from distance
    // — a distance-based rate assumes full-range strokes and reads 76.6
    // where the true rate is 101.5.
    strokesPerMinute: (30 * actions) / activeSeconds,
    density: activeSegments / segments.length,
    bins,
    // actions are direction changes; a stroke is a there and a back
    strokes: Math.round(actions / 2),
    peakStrokesPerMinute: Math.max(...bins),
    longestRestSeconds
  };
}

/** Longest unbroken run of resting segments. */
function longestRun(segments: readonly number[]): number {
  let longest = 0;
  let run = 0;
  for (const value of segments) {
    if (value > 0) {
      run = 0;
      continue;
    }
    run += 1;
    if (run > longest) longest = run;
  }
  return longest;
}

/** Per-bin strokes per minute: the mean travel distance over the bin's
 * segments, divided by the segment width to reach units per second and then
 * converted through the same amplitude the headline uses — so the strip and
 * the printed number are the same quantity in the same unit. */
function binToStrokes(
  segments: readonly number[],
  amplitude: number,
  segmentSeconds: number,
  bins: number
): number[] {
  const out: number[] = Array.from({ length: bins }, () => 0);
  if (!segments.length) return out;
  for (let bin = 0; bin < bins; bin += 1) {
    const start = Math.floor((bin * segments.length) / bins);
    // every bin covers at least one segment, so a script with fewer segments
    // than bins repeats them rather than emitting empty bins
    const end = Math.max(
      start + 1,
      Math.floor(((bin + 1) * segments.length) / bins)
    );
    let sum = 0;
    for (
      let index = start;
      index < end && index < segments.length;
      index += 1
    ) {
      sum += segments[index] ?? 0;
    }
    const perSecond = sum / (end - start) / segmentSeconds;
    out[bin] = (30 * perSecond) / amplitude;
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
