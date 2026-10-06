// ============================================================
// Burst — a temporary speed-up, used as a page-transition flourish.
//
// Three kinds of motion have to accelerate together and stay in phase with
// each other:
//
//   CSS animations on the motion wrappers   (transform, outside the blur)
//   CSS animations on the blobs             (transform, inside the blur)
//   one JS rAF loop that walks the morph seed
//
// The rule that makes this work: THE RESTING RATE IS EXACTLY 1. The 3x rest
// speed lives where it already lives, in animation-duration (`seconds / 3`
// from motionVars). playbackRate carries ONLY the burst. Two consequences
// worth the whole design:
//
//   Restoring is exact, not approximate. The end of a burst is the literal
//   float 1, not a reconstruction of "what 3x was".
//
//   Every failure mode degrades to "did not surge" rather than "stuck at
//   24x". An animation created mid-burst that the sweep misses is simply at
//   rest, which is correct; a missed restore cannot happen, because there is
//   nothing to restore to but 1.
// ============================================================

import { onBeforeUnmount, ref, type Ref } from "vue";

export interface BurstOptions {
  /** Absolute speed to reach, in the same units as `motion.speed`. */
  to?: number;
  /** Ramp up, in ms. */
  attack?: number;
  /** Time at the peak, in ms. */
  hold?: number;
  /** Ramp down, in ms. */
  release?: number;
  /**
   * Shortest permitted gap between direction reversals, in seconds. Most
   * presets `alternate`, so at the peak they turn around every half cycle;
   * this is what stops a burst turning a slow swell into a flicker.
   */
  floorSeconds?: number;
}

const DEFAULTS: Required<BurstOptions> = {
  to: 24,
  attack: 180,
  hold: 420,
  release: 1400,
  floorSeconds: 0.5
};

// How big a speed change has to be before it is worth committing.
//
// Not a performance fudge — a perceptual one, and the two layers genuinely
// differ. Wrapper motion is a rigid slide of the entire field, so a viewer
// can track it and a coarse step reads as a stutter. Per-blob motion runs
// underneath a 96px blur where no individual blob is trackable, and there
// are up to 54 of them (6 blobs x 3 canvas bands x 3 fringe copies), so it
// gets the coarse step and pays a fifth of the calls for it.
//
// Steps are in LOG speed, because speed is perceived as a ratio — the same
// reason the speed slider in motion.ts is logarithmic.
const STEP_WRAPPER = Math.log(1.06); // 6%
const STEP_BLOB = Math.log(1.3); // 30%

const easeOut = (t: number) => 1 - (1 - t) ** 3;
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;

// Safari gained updatePlaybackRate in 13.1, alongside Element.getAnimations.
// The setter is the fallback rather than the default: it preserves position
// too, it is just less kind to the compositor.
const setRate = (a: Animation, r: number) => {
  if (typeof a.updatePlaybackRate === "function") a.updatePlaybackRate(r);
  else a.playbackRate = r;
};

const isBlob = (a: Animation) =>
  (
    (a.effect as KeyframeEffect | null)?.target as Element | null
  )?.classList.contains("lens__blob") === true;

/**
 * One iteration in seconds, before playbackRate.
 *
 * For an `alternate` animation this is exactly the interval between direction
 * reversals — CSS animation-duration is ONE LEG, so `drift 8s alternate` turns
 * around every 8s and completes a there-and-back every 16s.
 */
function iteration(a: Animation): number {
  const d = a.effect?.getComputedTiming().duration;
  return typeof d === "number" && d > 0 ? d / 1000 : Infinity;
}

export function useSpeedBurst(
  root: Ref<HTMLElement | null>,
  /** The resting `motion.speed` — 3. Used only to size the peak. */
  restSpeed: Ref<number>
) {
  /** 1 at rest. The morph loop reads this; CSS animations are pushed. */
  const rate = ref(1);

  let raf = 0;
  let started = 0;
  let peak = 1;
  let u0 = 0;
  let frames = 0;
  let opt = DEFAULTS;

  // Every animation this burst has spoken to, and the rate last pushed to it.
  // A registry rather than a re-scan, because the restore has to reach
  // animations that have since dropped out of getAnimations() — the subtree
  // is re-rendered by the very route change that triggered the burst.
  const touched = new Map<Animation, number>();

  const mq =
    typeof matchMedia !== "undefined"
      ? matchMedia("(prefers-reduced-motion: reduce)")
      : null;

  // Read the cached list rather than calling matchMedia() — this is checked
  // once a frame for the length of every burst, and each call allocates.
  const reduced = () => mq?.matches === true;

  /**
   * Positive filter, not `!/mount/`: this must catch only the ambient
   * keyframes. The one-shot entrance (`mount-*`) keeps its own 1100ms —
   * a route change often replays it, and an arrival compressed to 137ms is
   * not an arrival. A script-driven Animation has `animationName === undefined`
   * and is likewise none of our business.
   */
  function scan(): Animation[] {
    const el = root.value;
    if (!el?.getAnimations) return [];
    return el
      .getAnimations({ subtree: true })
      .filter(a => (a as CSSAnimation).animationName?.startsWith("lens-"));
  }

  /**
   * Pull newly-created animations up to the burst that is already running.
   * Called on the first few frames (the route's own render lands one to
   * three frames after the burst starts) and from the component's onUpdated.
   */
  function refresh() {
    if (!raf) return;
    for (const a of scan()) {
      if (touched.has(a)) continue;
      setRate(a, rate.value);
      touched.set(a, rate.value);
    }
  }

  /**
   * One rate for the whole field, capped once for the whole set.
   *
   * The cap is deliberately NOT per animation. Wander and Tilt run two nested
   * wrappers at periods in the golden ratio, and that incommensurability is
   * the entire point of those presets — scaling the two by different factors
   * would rationalise the ratio and collapse the path into a closed figure.
   * One factor keeps every period ratio and every phase offset exact.
   */
  function peakFor(list: Animation[]): number {
    const wanted = Math.max(1, opt.to / Math.max(0.1, restSpeed.value));
    let shortest = Infinity;
    for (const a of list) shortest = Math.min(shortest, iteration(a));
    if (!Number.isFinite(shortest)) return wanted;
    return Math.max(1, Math.min(wanted, shortest / opt.floorSeconds));
  }

  function commit(r: number) {
    for (const [a, was] of touched) {
      if (Math.abs(Math.log(r / was)) < (isBlob(a) ? STEP_BLOB : STEP_WRAPPER))
        continue;
      // updatePlaybackRate, never `a.playbackRate = r`. Both preserve
      // currentTime (so neither moves the position), but the setter applies
      // synchronously against the MAIN thread's clock while the animation is
      // running on the compositor — worth up to a frame of drift per call,
      // and it drops the animation off the compositor to resync. This one
      // sets a pending rate that is applied where the animation actually
      // lives.
      setRate(a, r);
      touched.set(a, r);
    }
  }

  function frame(now: number) {
    if (reduced()) return finish();
    if (frames++ < 4) refresh();

    const t = now - started;
    const rise = opt.attack * (1 - u0);
    let u: number;
    if (t < rise) u = u0 + (1 - u0) * easeOut(rise > 0 ? t / rise : 1);
    else if (t < rise + opt.hold) u = 1;
    else {
      const k = (t - rise - opt.hold) / opt.release;
      if (k >= 1) return finish();
      u = 1 - easeInOut(k);
    }

    // Log-domain envelope. A linear ramp 1 -> 8 is half-way up at 4.5, which
    // is 82% of the way in perceived terms: it lunges, then the release
    // crawls out its last octave looking like it has stalled. In log space
    // the ramp is even.
    rate.value = peak ** u;
    commit(rate.value);
    raf = requestAnimationFrame(frame);
  }

  function finish() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    rate.value = 1;
    // one last scan, so an animation born in the final frames is pinned too.
    // The value is a placeholder — every key is set to 1 unconditionally on
    // the next line, with no step threshold on the way home.
    for (const a of scan()) if (!touched.has(a)) touched.set(a, peak);
    // exactly 1, unconditionally — no step threshold on the way home
    for (const a of touched.keys()) setRate(a, 1);
    touched.clear();
  }

  function surge(o: BurstOptions = {}) {
    if (reduced()) return;
    opt = { ...DEFAULTS, ...o };
    // `morph` has no CSS animation at all — scan() is empty and the burst
    // runs purely through `rate`, which the rAF loop reads.
    const list = scan();
    peak = peakFor(list);
    // A second route change mid-burst resumes the attack from where the rate
    // actually is, instead of dropping to 1 and climbing again.
    u0 =
      peak > 1
        ? Math.min(1, Math.log(Math.max(1, rate.value)) / Math.log(peak))
        : 1;
    started = performance.now();
    frames = 0;
    for (const a of list) if (!touched.has(a)) touched.set(a, rate.value || 1);
    if (!raf) raf = requestAnimationFrame(frame);
  }

  function onMedia() {
    if (reduced() && raf) finish();
  }
  mq?.addEventListener("change", onMedia);

  // A hidden tab throttles rAF, so a burst started there would land whenever
  // the tab came back — minutes later, on a page that has moved on.
  function onHidden() {
    if (document.visibilityState === "hidden" && raf) finish();
  }

  // guarded: this component is meant to be portable, and a Quasar app may
  // prerender, where there is no document at setup time
  const canDom = typeof document !== "undefined";
  if (canDom) document.addEventListener("visibilitychange", onHidden);

  onBeforeUnmount(() => {
    if (raf) finish();
    mq?.removeEventListener("change", onMedia);
    if (canDom) document.removeEventListener("visibilitychange", onHidden);
  });

  return { rate, surge, refresh, stop: finish };
}
