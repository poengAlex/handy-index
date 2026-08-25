<template>
  <div
    :key="mountNonce"
    ref="lensEl"
    class="lens"
    :class="mountClass"
    :style="lensStyle"
    aria-hidden="true"
  >
    <!-- The field, and (when Fringe is up) two offset copies whose hues are
         rotated apart. Real chromatic aberration separates the channels; at
         this much blur the difference is invisible and this costs two
         composites instead of an SVG filter over the whole viewport. -->
    <div v-for="c in copies" :key="c.key" class="lens__copy" :style="c.style">
      <!-- The motion wrapper sits OUTSIDE the filtered element on purpose:
           transforming an already-blurred layer is a compositor job, while
           transforming its contents re-runs the blur every frame. -->
      <div class="lens__motion" :class="motionClass" :style="motionStyle">
        <!-- Second wrapper, used only by Wander: an X period and a Y period
             that share no common multiple compose into a Lissajous path. -->
        <div class="lens__motion2" :class="motionClass2">
          <div class="lens__inner" :style="innerStyle">
            <span
              v-for="(b, i) in blobs"
              :key="i"
              class="lens__blob"
              :class="blobMotionClass"
              :style="blobStyle(b, i)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Grain scoped to the colour. A mirror of the field's own wrapper
         chain, using the SAME classes, so the identical animation drives it
         and the mask cannot drift out from under the blobs. The one thing
         it does not copy is .lens__inner's filter, because blurring grain
         is the one thing that reliably destroys it. -->
    <div v-if="grainScoped" class="lens__grain">
      <div class="lens__motion" :class="motionClass" :style="motionStyle">
        <div class="lens__motion2" :class="motionClass2">
          <div class="lens__inner" :style="grainMaskStyle">
            <slot name="grain" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="s.haze > 0" class="lens__haze" :style="hazeStyle" />
    <div v-if="s.vignette > 0" class="lens__vignette" :style="vignetteStyle" />
    <!-- grain is NOT here on purpose — see GrainOverlay.vue -->
  </div>
</template>

<script setup lang="ts">
// The playground's renderer. Same physics as MeshField — multiply on light,
// screen on dark, both fills carried per blob — but every constant is a
// prop, and a small lens stack sits on top of the field:
//
//   Defocus   blur, as a share of the short side so one setting survives a
//             card and a viewport alike
//   Fringe    two hue-rotated copies pulled apart horizontally
//   Haze      a veil of the surface colour — flare lifting the blacks
//   Vignette  corners falling away
//
// Grain is deliberately NOT part of this component: it belongs over the
// whole image rather than inside the field, and inside a stacking context
// carrying a large blur the browser rasterises it away entirely. See
// GrainOverlay.vue.
import {
  computed,
  onBeforeUnmount,
  onUpdated,
  ref,
  watch,
  type CSSProperties
} from "vue";
import { darkAlpha, darkBoost, flatten, type Blob } from "./gradient-recipes";
import {
  motionDefaults,
  motionPreset,
  motionVars,
  mountVars,
  perBlobVector,
  type MotionId,
  type MotionSettings
} from "./motion";
import { useSpeedBurst } from "./motion-burst";
import {
  blobMask,
  buildBlobs,
  lerpBlobs,
  paletteColors,
  smoothstep,
  tunedFill,
  type LensSettings
} from "./lens";

// see innerFilter()
const MIN_BLUR_PX = 12;
const MAX_BLUR_PX = 96;

const props = withDefaults(
  defineProps<{
    s: LensSettings;
    /** Change this to replay the mount animation. */
    mountNonce?: number;
    /** Resolved by the facade against the real host page. */
    resolved?: "light" | "dark" | null;
    /** The host's actual page colour, for the haze veil. */
    surface?: string | null;
    /**
     * How many viewports tall the box this field is rendering into is. A
     * parallax backdrop needs a canvas taller than the screen so there is
     * something to reveal — but blob geometry is a PERCENTAGE of that box,
     * so left uncompensated a 1.5x canvas stretches every blob by half again
     * and the colour dilutes to grey. Heights are divided back down and the
     * layout is repeated down the canvas instead, so scrolling reveals more
     * field rather than more of the same blob.
     */
    canvasRatio?: number;
  }>(),
  { canvasRatio: 1, mountNonce: 0, resolved: null, surface: null }
);
const s = computed(() => props.s);

const colors = computed(() => paletteColors(props.s));

// A `costly` preset (morph, wave, blobs) animates the blobs themselves,
// INSIDE the blur — so the browser re-rasterises every full-viewport copy of
// the field every frame. A desktop GPU absorbs that. A phone does not: the
// work lands in the same main-thread rAF that vue3-carousel drags a shelf
// with, and the shelf stutters for as long as your finger is down.
//
// So a coarse pointer gets the cheap equivalent. Tilt is the one preset that
// moves the parts of the picture relative to each other — the corners travel
// about three times as far as the centre — which is the quality the costly
// presets are picked for, but as one matrix on an already-rasterised layer.
const CHEAP_SUBSTITUTE: MotionId = "tilt";

// Read once, deliberately: a device does not grow a mouse mid-session, and
// re-resolving this would restart the field's animations under the reader.
const coarsePointer =
  typeof matchMedia !== "undefined" && matchMedia("(pointer: coarse)").matches;

/** The scene's motion, or what this device can actually afford to run. */
const motion = computed<MotionSettings>(() => {
  const own = props.s.motion;
  if (!coarsePointer || !motionPreset(own.id).costly) return own;
  return {
    id: CHEAP_SUBSTITUTE,
    speed: own.speed,
    // NOT the scene's amount. Amplitudes are tuned per preset at amount 1,
    // and a scene carrying a costly preset has no meaningful one to lend —
    // the house look asks for 2.5, which morph ignores entirely and tilt
    // would read as a 22deg lean. Zero still means zero: it is documented as
    // the way to stop a preset without changing it.
    amount: own.amount === 0 ? 0 : motionDefaults.amount
  };
});

const preset = computed(() => motionPreset(motion.value.id));

// Morph state. The seed is an integer, so morphing between arrangements
// means holding two of them and walking a parameter from one to the other;
// when it arrives, the destination becomes the origin and a new destination
// is generated. Everything else about the field — colours, alpha, hardness —
// is unchanged, so only geometry is rewritten each frame.
const lensEl = ref<HTMLElement | null>(null);

const morphStep = ref(0);
const morphT = ref(0);
let raf = 0;
let last = 0;

const morphFrom = computed(() =>
  buildBlobs(props.s, props.s.seed + morphStep.value)
);
const morphTo = computed(() =>
  buildBlobs(props.s, props.s.seed + morphStep.value + 1)
);

function tick(now: number) {
  // The clamp is on the RESTING period, so it keeps meaning "a seed step is
  // never shorter than half a second at rest" and the burst multiplies
  // cleanly on top. Position here is the integral of rate, so it stays
  // continuous for any rate curve — morph is the one kind of motion that
  // would not even need the ramp.
  const secs = Math.max(
    0.5,
    preset.value.seconds / Math.max(0.1, motion.value.speed)
  );
  if (last) {
    morphT.value += ((now - last) / 1000 / secs) * burstRate.value;
  }
  last = now;
  while (morphT.value >= 1) {
    morphT.value -= 1;
    morphStep.value += 1;
  }
  raf = requestAnimationFrame(tick);
}

function stopMorph() {
  cancelAnimationFrame(raf);
  raf = 0;
  last = 0;
}

watch(
  () => motion.value.id === "morph",
  on => {
    stopMorph();
    // a JS-driven animation has no CSS rule to switch off, so the media
    // query has to be asked directly
    const still =
      typeof matchMedia !== "undefined" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (on && !still) raf = requestAnimationFrame(tick);
  },
  { immediate: true }
);

// Burst — see motion-burst.ts. It lives there rather than here because the
// version that lived here had two defects a unit test would have caught: it
// filtered animations by NOT matching /mount/, which also swept up any
// script-driven animation, and it restored by re-scanning the DOM, which
// misses animations the route change has already torn out of the tree.
const {
  rate: burstRate,
  surge,
  refresh: refreshBurst,
  stop: stopBurst
} = useSpeedBurst(
  lensEl,
  computed(() => motion.value.speed)
);

// animations are created and destroyed by preset switches, blob-count
// changes and the fringe toggle; a burst in flight has to catch them
onUpdated(refreshBurst);

onBeforeUnmount(stopMorph);

defineExpose({
  /** Temporarily run everything faster, then settle back. */
  burst: surge,
  /** Cut a burst short and return to rest. */
  stopBurst,
  /** The rate the morph loop multiplies by; 1 at rest. */
  burstRate
});

const blobs = computed<Blob[]>(() => {
  if (preset.value.morph) {
    const morphed = lerpBlobs(
      morphFrom.value,
      morphTo.value,
      smoothstep(morphT.value)
    );
    return applyCanvas(morphed);
  }
  const base = buildBlobs(props.s);
  return applyCanvas(base);
});

/** Spread a layout down a taller-than-viewport canvas. */
function applyCanvas(base: Blob[]): Blob[] {
  const ratio = Math.max(1, props.canvasRatio);
  if (ratio === 1) return base;
  // one band per viewport the canvas covers, each a shifted copy so the
  // field keeps changing all the way down
  const bands = Math.ceil(ratio);
  const out: Blob[] = [];
  for (let band = 0; band < bands; band++) {
    for (const b of base) {
      out.push({
        ...b,
        y: (b.y + band * 100) / ratio,
        h: b.h / ratio,
        // nudge each band so it does not read as a repeat
        x: b.x + (band % 2 === 0 ? 0 : 9) - (band % 3 === 0 ? 0 : 5),
        rot: (b.rot ?? 0) + band * 13
      });
    }
  }
  return out;
}

const lensStyle = computed<CSSProperties>(() => ({
  opacity: String(props.s.strength),
  ...mountVars(props.s.mount),
  ...(props.surface ? { "--hbg-surface": props.surface } : {})
}));

const mountClass = computed(() =>
  props.s.mount.id === "none" ? "" : `lens--mount-${props.s.mount.id}`
);

// wrapper-driven presets get a class; per-blob and morph ones do not move
// the wrapper at all
const motionClass = computed(() =>
  preset.value.perBlob || preset.value.morph || motion.value.id === "still"
    ? ""
    : `lens__motion--${motion.value.id}`
);

const motionClass2 = computed(() =>
  preset.value.nested ? `lens__motion2--${motion.value.id}` : ""
);

const blobMotionClass = computed(() =>
  preset.value.perBlob ? `lens__blob--${motion.value.id}` : ""
);

const motionStyle = computed<CSSProperties>(
  () => motionVars(motion.value) as CSSProperties
);

// filter order on the field itself: colour grading, then defocus
const innerStyle = computed<CSSProperties>(() => {
  const f: string[] = [];
  if (props.s.saturate !== 1) f.push(`saturate(${props.s.saturate})`);
  if (props.s.contrast !== 1) f.push(`contrast(${props.s.contrast})`);
  if (props.s.brightness !== 1) f.push(`brightness(${props.s.brightness})`);
  if (props.s.defocus > 0) {
    // Capped in px, for two independent reasons.
    //
    // Past roughly 100px the browser stops rasterising the stacking context
    // at full resolution, and everything fine-grained in it — the grain
    // layer above all — is averaged out of existence. Measured: grain energy
    // 9.9 at a 46px radius, 0.4 at 180px.
    //
    // And a radius expressed only as a share of the short side means the
    // same setting is 57px on a desktop and 27px on a phone, which is the
    // difference between an atmospheric wash and four visible discs.
    f.push(
      `blur(clamp(${MIN_BLUR_PX}px, calc(${props.s.defocus} * 1cqmin), ${MAX_BLUR_PX}px))`
    );
  }
  return f.length ? { filter: f.join(" ") } : {};
});

const copies = computed(() => {
  if (props.s.fringe <= 0) return [{ key: "base", style: {} as CSSProperties }];
  const px = props.s.fringe;
  return [
    {
      key: "r",
      style: {
        transform: `translateX(${-px}px)`,
        filter: "hue-rotate(-16deg)",
        opacity: "0.55"
      } as CSSProperties
    },
    {
      key: "b",
      style: {
        transform: `translateX(${px}px)`,
        filter: "hue-rotate(16deg)",
        opacity: "0.55"
      } as CSSProperties
    },
    { key: "base", style: { opacity: "0.7" } as CSSProperties }
  ];
});

// Grain confined to the blobs. The mask is the blobs' own falloff, so the
// noise dies exactly where the colour does.
//
// Per-blob motion is the one thing this does not track: presets that animate
// individual blobs (`blobs`, `wave`) move them under a mask that only carries
// the GROUP animation. Measured on the house default (`morph`) the per-blob
// residual is 0.0px, because every blob rides one shared translate.
const grainScoped = computed(
  () => props.s.lensScope === "blobs" && props.s.grain > 0
);

const grainMaskStyle = computed<CSSProperties>(() => {
  const m = blobMask(blobs.value, props.s.hardness);
  return { maskImage: m, WebkitMaskImage: m };
});

const hazeStyle = computed<CSSProperties>(() => ({
  opacity: String(props.s.haze)
}));

const vignetteStyle = computed<CSSProperties>(() => ({
  // a soft ellipse rather than a ring — a hard vignette reads as a badge
  background: `radial-gradient(ellipse 74% 74% at 50% 50%, rgba(0,0,0,0) 42%, rgba(0,0,0,${props.s.vignette}) 100%)`
}));

function blobStyle(b: Blob, i: number): CSSProperties {
  const color = colors.value[b.c % colors.value.length];
  const hex = color?.hex ?? "#0064E0";
  const a = props.s.alpha * (b.a ?? 1);
  const h = props.s.hardness;
  // Per-blob travel comes from motion.ts, where it can be tested. It used
  // to be computed here from hardcoded constants, which meant Blobs and
  // Wave silently ignored their own amplitudes.
  const v = perBlobVector(
    motion.value.id,
    motion.value.amount,
    motion.value.speed,
    i,
    blobs.value.length
  );
  const amp = Math.max(0, motion.value.amount);
  const style: CSSProperties = {
    left: `${b.x}%`,
    top: `${b.y}%`,
    width: `${b.w}%`,
    height: `${b.h}%`,
    "--fill-light": tunedFill(hex, a, h),
    "--fill-dark": tunedFill(hex, darkAlpha(hex, darkBoost(a)), h),
    "--rot": `${b.rot ?? 0}deg`,
    "--dx": `${v.dx.toFixed(1)}%`,
    "--dy": `${v.dy.toFixed(1)}%`,
    "--sc": String(1 + ((i % 3) - 1) * 0.05 * amp),
    "--dur": `${v.dur.toFixed(1)}s`,
    // A negative delay starts the animation already part-way through, which
    // is what turns identical curves into a travelling swell.
    "--delay": `${v.delay.toFixed(1)}s`,
    "--wave-delay": `${v.delay.toFixed(1)}s`
  };
  // Fill and blend are pinned together, inline on the blob, and they must
  // stay a pair: "multiply" against the boosted dark fill is a look nobody
  // asked for. This used to be routed through a custom property declared on
  // .lens, which silently painted NOTHING for every scene that did not pin
  // an explicit blend — see the note on .lens__blob for why. Pre-hydration
  // `resolved` is null and the stylesheet first-paint hint takes over.
  const lightFill = tunedFill(hex, a, h);
  const darkFill = tunedFill(hex, darkAlpha(hex, darkBoost(a)), h);
  if (props.s.blend !== "auto") {
    style.mixBlendMode = props.s.blend;
    style.backgroundImage = props.s.blend === "screen" ? darkFill : lightFill;
  } else if (props.resolved) {
    const dark = props.resolved === "dark";
    style.mixBlendMode = dark ? "screen" : "multiply";
    style.backgroundImage = dark ? darkFill : lightFill;
  }
  return style;
}
</script>

<style scoped lang="scss">
.lens {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  isolation: isolate;
  container-type: size;
}

.lens__copy {
  position: absolute;
  inset: 0;
}

// grown past the box on every side so the defocus does not eat its own edges
.lens__inner {
  position: absolute;
  inset: -28%;
}

// The blob reads its OWN --fill-light/--fill-dark, which blobStyle writes
// inline on it. Do NOT lift this into a custom property on .lens: `var()`
// inside a custom property is substituted at the DECLARATION site, so a
// `var(--fill-light)` declared on .lens resolves against .lens — which has
// no --fill-light — and every blob computes background-image: none. That
// was live for six of the seven scenes; only the one pinning an explicit
// blend escaped, because it writes background-image inline.
.lens__blob {
  position: absolute;
  transform: translate(-50%, -50%) rotate(var(--rot, 0deg));
  background-image: var(--fill-light);
  mix-blend-mode: multiply;
}

// First-paint hints only, for the frame before the theme resolves in JS.
// After that blobStyle pins both properties inline on the blob, which beats
// every one of these regardless of host specificity.
[data-theme="dark"] .lens__blob,
.body--dark .lens__blob,
.section-dark .lens__blob {
  background-image: var(--fill-dark);
  mix-blend-mode: screen;
}

[data-theme="light"] .lens__blob,
.section-light .lens__blob {
  background-image: var(--fill-light);
  mix-blend-mode: multiply;
}

// ---- mount ----
// The whole field animates in as one. `both` holds the start frame through
// the delay, so a delayed mount does not flash at full strength first.
.lens--mount-fade {
  animation: mount-fade var(--mount-dur, 900ms) ease-out var(--mount-delay, 0ms)
    both;
}

.lens--mount-rise {
  animation: mount-rise var(--mount-dur, 1000ms) cubic-bezier(0.16, 1, 0.3, 1)
    var(--mount-delay, 0ms) both;
}

.lens--mount-bloom {
  animation: mount-bloom var(--mount-dur, 1100ms) cubic-bezier(0.16, 1, 0.3, 1)
    var(--mount-delay, 0ms) both;
}

.lens--mount-sweep {
  animation: mount-sweep var(--mount-dur, 1300ms) ease-out
    var(--mount-delay, 0ms) both;
}

@keyframes mount-fade {
  from {
    opacity: 0;
  }
}

@keyframes mount-rise {
  from {
    opacity: 0;
    transform: translateY(3%);
  }
}

@keyframes mount-bloom {
  from {
    opacity: 0;
    transform: scale(0.94);
  }
}

// a soft-edged wipe rather than a hard one — a hard edge on a diffuse field
// looks like a rendering fault
@keyframes mount-sweep {
  from {
    opacity: 0;
    mask-image: linear-gradient(
      100deg,
      #000 -40%,
      #000 -25%,
      transparent -5%,
      transparent 100%
    );
  }

  to {
    opacity: 1;
    mask-image: linear-gradient(
      100deg,
      #000 100%,
      #000 115%,
      transparent 135%,
      transparent 200%
    );
  }
}

@media (prefers-reduced-motion: reduce) {
  .lens--mount-fade,
  .lens--mount-rise,
  .lens--mount-bloom,
  .lens--mount-sweep {
    animation-name: none;
  }
}

.lens__motion {
  position: absolute;
  inset: 0;
  // a near-linear curve with just enough ease to hide the direction flip
  --m-ease: cubic-bezier(0.25, 0.1, 0.75, 0.9);
}

// The one place on this page where a transform genuinely animates. It also
// tells the compositor to rasterise the filtered layer once at a scale that
// covers the animation, instead of stretching a rest-scale bitmap — which
// on a field whose whole character is softness reads as it going soft.
.lens__motion--breathe,
.lens__motion--drift,
.lens__motion--sway,
.lens__motion--current,
.lens__motion--orbit,
.lens__motion--wander,
.lens__motion--strain,
.lens__motion--tilt {
  will-change: transform;
}

// Easing matters more than it looks. Detection here is change-per-GLANCE,
// so what counts is the floor of the rate, not its peak — and ease-in-out
// spends its turnarounds at ~0 velocity, so a viewer who looks up at the
// wrong moment sees a still image. Measured share of the amplitude
// delivered in the worst ten-second window at these durations: ease-in-out
// 23-31%, this curve 30-36%. Same numbers, more of the time.
.lens__motion--breathe {
  animation: lens-breathe var(--m-dur, 22s) var(--m-ease) infinite alternate;
}

.lens__motion--drift {
  animation: lens-shift var(--m-dur, 26s) var(--m-ease) infinite alternate;
}

// Rotating about the centre barely moves the middle of the frame, which is
// exactly where the field is most visible. Dropping the pivot below the
// bottom edge turns the same few degrees into a swing.
.lens__motion--sway {
  transform-origin: 50% 150%;
  animation: lens-sway var(--m-dur, 30s) var(--m-ease) infinite alternate;
}

.lens__motion--current {
  animation: lens-shift var(--m-dur, 32s) var(--m-ease) infinite alternate;
}

// Orbit is the only preset with no turnaround. A circle has constant speed
// and no ends, so it never slows to a stop (the moment every alternating
// preset looks static) and it loops without a seam — which is why it is
// `linear` and `infinite` rather than eased and alternating.
.lens__motion--orbit {
  animation: lens-orbit var(--m-dur, 34s) linear infinite;
}

// Wander is two nested circles at periods in the golden ratio, the second
// turning the other way: an epitrochoid. It inherits everything that makes
// Orbit work — constant speed, no turnaround, no seam — and adds the one
// thing Orbit lacks, which is that the path never comes back to itself, so
// there is no figure to recognise however long you watch.
.lens__motion--wander {
  animation: lens-orbit var(--m-dur, 29s) linear infinite;
}

.lens__motion2 {
  position: absolute;
  inset: 0;
}

.lens__motion2--wander {
  animation: lens-orbit-2 var(--m-dur2, 47s) linear infinite reverse;
  will-change: transform;
}

// Tilt rides a slow orbit so the frame always has a speed floor; the
// precession on the inner wrapper supplies the deformation.
.lens__motion--tilt {
  animation: lens-orbit var(--m-dur, 42s) linear infinite;
}

// A perspective keystone whose axis precesses. The rotate/counter-rotate
// sandwich holds the tilt MAGNITUDE constant while its direction walks
// around, and cancels any in-plane spin — so the field never turns and
// never passes edge-on, which means no turnaround anywhere in the cycle.
.lens__motion2--tilt {
  transform-origin: 50% 150%;
  animation: lens-tilt var(--m-dur2, 68s) linear infinite;
  will-change: transform;
}

@keyframes lens-tilt {
  from {
    transform: perspective(1400px) translateZ(calc(-1 * var(--m-tiltz, 400px)))
      rotate(0deg) rotateY(var(--m-beta, 9deg)) rotate(0deg);
  }

  to {
    transform: perspective(1400px) translateZ(calc(-1 * var(--m-tiltz, 400px)))
      rotate(360deg) rotateY(var(--m-beta, 9deg)) rotate(-360deg);
  }
}

// rotate out, step away from the centre, rotate back: the field travels a
// circle without itself turning
// Counter-phased axes: as one stretches the other relaxes, so the area
// stays roughly constant and it reads as the field breathing rather than
// as a zoom. Deformation, not displacement — which is why it shows up on a
// blurred field at a fraction of the amplitude a translation needs.
.lens__motion--strain {
  animation: lens-strain var(--m-dur, 27s) var(--m-ease) infinite alternate;
}

@keyframes lens-strain {
  from {
    transform: scale(
      calc(1 + var(--m-strain, 0.07)),
      calc(1 - var(--m-strain, 0.07))
    );
  }

  to {
    transform: scale(
      calc(1 - var(--m-strain, 0.07)),
      calc(1 + var(--m-strain, 0.07))
    );
  }
}

@keyframes lens-orbit {
  from {
    transform: rotate(0deg) translate(var(--m-x, 7%), 0) rotate(0deg);
  }

  to {
    transform: rotate(360deg) translate(var(--m-x, 7%), 0) rotate(-360deg);
  }
}

// the inner circle, on its own radius
@keyframes lens-orbit-2 {
  from {
    transform: rotate(0deg) translate(var(--m-y, 5%), 0) rotate(0deg);
  }

  to {
    transform: rotate(360deg) translate(var(--m-y, 5%), 0) rotate(-360deg);
  }
}

// Runs DOWNWARDS: the rest frame is the enlarged one and the animation
// shrinks toward 1. Magnifying a filtered layer past the size it was
// rasterised at either forces a mid-animation re-raster (a jank spike) or
// stretches the existing bitmap (visible softening).
@keyframes lens-breathe {
  from {
    transform: translate(var(--m-x, 0), var(--m-y, 0))
      scale(var(--m-scale, 1.13));
  }

  to {
    transform: scale(1);
  }
}

@keyframes lens-shift {
  to {
    transform: translate(var(--m-x, 0), var(--m-y, 0));
  }
}

@keyframes lens-sway {
  to {
    transform: rotate(var(--m-deg, 0deg));
  }
}

// The global rule only shortens the duration, which finishes an animation
// rather than stopping it — on a background that means landing on a frame
// nobody designed and staying there.
@media (prefers-reduced-motion: reduce) {
  .lens__motion,
  .lens__motion2 {
    animation-name: none;
  }
}

// Wave gives every blob the same vertical curve and starts each one a beat
// after the last, so the swell travels across the field while the field
// itself stays put. The phase comes from a negative delay — the animation
// begins already part-way through.
.lens__blob--wave {
  animation: lens-wave var(--dur, 26s) cubic-bezier(0.25, 0.1, 0.75, 0.9)
    var(--wave-delay, 0s) infinite alternate;
}

@keyframes lens-wave {
  to {
    transform: translate(-50%, -50%) rotate(var(--rot, 0deg))
      translateY(var(--dy, 0));
  }
}

.lens__blob--blobs {
  animation: lens-drift var(--dur, 22s) cubic-bezier(0.25, 0.1, 0.75, 0.9)
    var(--delay, 0s) infinite alternate;
}

// The global reduced-motion rule only shortens the duration, which finishes
// the drift rather than stopping it and leaves the blobs off-layout.
@media (prefers-reduced-motion: reduce) {
  .lens__motion {
    position: absolute;
    inset: 0;
  }

  .lens__motion--breathe {
    animation: lens-breathe var(--m-dur, 44s) ease-in-out infinite alternate;
  }

  .lens__motion--drift {
    animation: lens-shift var(--m-dur, 68s) ease-in-out infinite alternate;
  }

  .lens__motion--sway {
    animation: lens-sway var(--m-dur, 80s) ease-in-out infinite alternate;
  }

  .lens__motion--current {
    animation: lens-shift var(--m-dur, 96s) ease-in-out infinite alternate;
  }

  @keyframes lens-breathe {
    to {
      transform: scale(var(--m-scale, 1.03));
    }
  }

  @keyframes lens-shift {
    to {
      transform: translate(var(--m-x, 0), var(--m-y, 0));
    }
  }

  @keyframes lens-sway {
    to {
      transform: rotate(var(--m-deg, 0deg));
    }
  }

  // The global rule only shortens the duration, which finishes an animation
  // rather than stopping it — on a background that means landing on a frame
  // nobody designed and staying there.
  @media (prefers-reduced-motion: reduce) {
    .lens__motion {
      animation-name: none;
    }
  }

  // Wave gives every blob the same vertical curve and starts each one a beat
  // after the last, so the swell travels across the field while the field
  // itself stays put. The phase comes from a negative delay — the animation
  // begins already part-way through.
  .lens__blob--wave {
    animation: lens-wave var(--dur, 26s) cubic-bezier(0.25, 0.1, 0.75, 0.9)
      var(--wave-delay, 0s) infinite alternate;
  }

  @keyframes lens-wave {
    to {
      transform: translate(-50%, -50%) rotate(var(--rot, 0deg))
        translateY(var(--dy, 0));
    }
  }

  .lens__blob--blobs {
    animation-name: none;
  }
}

@keyframes lens-drift {
  to {
    transform: translate(-50%, -50%) rotate(var(--rot, 0deg))
      translate(var(--dx, 0), var(--dy, 0)) scale(var(--sc, 1));
  }
}

// Flare: a veil of the SURFACE colour, so it lifts the blacks on dark and
// washes toward white on light — which is what stray light actually does.
// Flare is a veil of the PAGE colour, so a veil in the wrong colour is
// worse than none. The facade sniffs the host's real background and pins it
// inline; these fallbacks only matter before that resolves, and they are
// split by theme so a dark page never gets a white sheet.
// The grain mirror. Sits above the field copies in paint order and below
// haze/vignette, and carries no filter of its own.
.lens__grain {
  position: absolute;
  inset: 0;
}

.lens__haze {
  position: absolute;
  inset: 0;
  background: var(--hbg-surface, var(--color-bg-page, #fff));
}

[data-theme="dark"] .lens__haze,
.body--dark .lens__haze,
.section-dark // The grain mirror. Sits above the field copies in paint order and below
// haze/vignette, and carries no filter of its own.
.lens__grain {
  position: absolute;
  inset: 0;
}

.lens__haze {
  background: var(--hbg-surface, var(--color-bg-page, #121212));
}

.lens__vignette {
  position: absolute;
  inset: 0;
}
</style>
