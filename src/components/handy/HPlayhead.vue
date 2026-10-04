<template>
  <div
    ref="rootEl"
    class="h-playhead"
    :class="{
      'h-playhead--interactive': interactive,
      'h-playhead--scrubbing': scrubbing
    }"
    :style="{ '--h-playhead-x': `${percent}%` }"
    v-bind="a11y"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @lostpointercapture="onPointerUp"
    @pointerenter="hovering = true"
    @pointerleave="hovering = false"
    @keydown="onKeydown"
  >
    <!-- what hasn't played yet, washed toward the strip's own surface: the
         split between "behind" and "ahead" is what makes the position read
         as a position rather than as one more line on a busy picture -->
    <div
      v-if="showHandle && dimAhead > 0"
      class="h-playhead__ahead"
      :style="{ opacity: dimAhead }"
    />
    <div v-if="showHandle" class="h-playhead__handle" />
    <div
      v-if="showHandle && labelShown"
      class="h-playhead__label"
      :class="{ 'h-playhead__label--flip': percent > 50 }"
    >
      {{ label }}
    </div>
  </div>
</template>

<script setup lang="ts">
// The current-position marker for a strip that represents time — a heatmap,
// a waveform, a filmstrip, a progress bar with a picture in it. It is the
// M3 slider handle, borrowed: a skinny rounded bar sitting in a gap cut
// through whatever is behind it, slimming while dragged, with the value on a
// label beside it.
//
// A hairline rule over a busy strip is the thing this replaces. It competes
// with the picture at every pixel, it has no state (you can't tell it is
// draggable), and it says nothing about *how far in* you are. The three
// pieces here answer those in turn: the gap detaches the handle from the
// field so it survives any colour behind it, the press-slim (same 0.55 scaleX
// the sliders use in styles/_quasar.scss) confirms the grab, and the
// ahead-wash splits
// the strip into played and not-played.
//
// Portable: props in, events out. No Quasar, no design-token imports, no
// stores — every colour is a CSS custom property with a token default and a
// hard-coded fallback, so it drops into a token-less project unchanged.
//
// Layout: it fills its parent, which must be `position: relative` (and
// normally `overflow: hidden`, so the handle's rounded ends clip to the
// strip's own radius).
//
//   <div class="strip">
//     <canvas />
//     <HPlayhead :value="t" :max="duration" :label="clock" interactive
//                @seek="t => seek(t)" />
//   </div>
//
// Interactive turns it into a real scrubber: the whole strip takes the
// gesture (drag anywhere, not just on the handle), and it becomes a proper
// keyboard slider — arrows step, PageUp/Down jump, Home/End go to the ends.
// A canvas strip has no keyboard story of its own, which is the other half of
// why this is a component and not four lines of CSS in each host.
//
// Theming, per instance or per surface:
//   --h-playhead-color     the handle and its label   (default: feedback-negative)
//   --h-playhead-surface   the gap and the ahead-wash (default: --h-slider-gap)
//   --h-playhead-width     handle thickness           (default: 4px)
//   --h-playhead-gap-width the cut either side of it  (default: 3px)
//   --h-playhead-inset     top/bottom inset           (default: 2px)

import { computed, ref } from "vue";

const props = withDefaults(
  defineProps<{
    /** Where the playhead is, in the caller's own units. */
    value: number;
    min?: number;
    max?: number;
    /** Drag/keyboard scrub the strip and emit `seek`. Off = pure indicator,
     * and the overlay stops taking pointer events entirely. */
    interactive?: boolean;
    /** Draw the handle. False keeps an interactive strip seekable while the
     * position is unknown (nothing loaded yet). */
    showHandle?: boolean;
    /** Value text for the label beside the handle — normally a clock. */
    label?: string;
    /** `auto` shows the label while hovering or scrubbing. */
    showLabel?: "auto" | "always" | "never";
    /** Opacity of the wash over the not-yet-played side; 0 turns it off. */
    dimAhead?: number;
    /** Arrow-key increment. 0 = a hundredth of the range. */
    step?: number;
    /** PageUp/PageDown increment. 0 = a tenth of the range. */
    pageStep?: number;
    /** Accessible name — say what is being scrubbed ("Video position"). */
    ariaLabel?: string;
    /** Spoken value; falls back to `label`, then the raw number. */
    ariaValueText?: string;
  }>(),
  {
    min: 0,
    max: 100,
    interactive: false,
    showHandle: true,
    label: "",
    showLabel: "auto",
    dimAhead: 0.22,
    step: 0,
    pageStep: 0,
    ariaLabel: "Playhead",
    ariaValueText: ""
  }
);

const emit = defineEmits<{
  /** A scrub asked for a new position. Nothing moves until the host writes
   * `value` back — the component never assumes it won the seek. */
  seek: [value: number];
  /** A drag gesture began / ended, same shape HLabeledSlider uses. */
  pan: ["start" | "end"];
}>();

const rootEl = ref<HTMLElement | null>(null);
const scrubbing = ref(false);
const hovering = ref(false);

const span = computed(() => Math.max(0, props.max - props.min));

function clamp(v: number): number {
  return Math.min(props.max, Math.max(props.min, v));
}

const clamped = computed(() => clamp(props.value));

/** A zero-width range pins at the left rather than dividing by zero. */
const percent = computed(() =>
  span.value > 0 ? ((clamped.value - props.min) / span.value) * 100 : 0
);

const labelShown = computed(() => {
  if (!props.label || props.showLabel === "never") return false;
  if (props.showLabel === "always") return true;
  return scrubbing.value || hovering.value;
});

// role=slider only when the thing is actually operable — an indicator that
// announces itself as a control is a worse lie than one that says nothing.
const a11y = computed(() => {
  if (!props.interactive) return {};
  return {
    role: "slider",
    tabindex: 0,
    "aria-label": props.ariaLabel,
    "aria-orientation": "horizontal" as const,
    "aria-valuemin": props.min,
    "aria-valuemax": props.max,
    "aria-valuenow": Math.round(clamped.value),
    "aria-valuetext": props.ariaValueText || props.label || undefined
  };
});

// ------------------------------------------------------------------ scrubbing

function valueFromEvent(e: PointerEvent): number {
  const el = rootEl.value;
  if (!el) return clamped.value;
  const rect = el.getBoundingClientRect();
  if (rect.width === 0) return clamped.value;
  const frac = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
  return props.min + frac * span.value;
}

function onPointerDown(e: PointerEvent) {
  // primary button only: a middle-drag over a strip is normally the host's
  // own gesture (marquee zoom, pan), and a right-click is the context menu
  if (!props.interactive || e.button !== 0) return;
  scrubbing.value = true;
  rootEl.value?.setPointerCapture(e.pointerId);
  // a click hands the keyboard the control it just used — :focus-visible
  // keeps the ring off for the pointer that did it
  rootEl.value?.focus();
  emit("pan", "start");
  emit("seek", valueFromEvent(e));
}

function onPointerMove(e: PointerEvent) {
  if (scrubbing.value) emit("seek", valueFromEvent(e));
}

function onPointerUp() {
  if (!scrubbing.value) return;
  scrubbing.value = false;
  emit("pan", "end");
}

function onKeydown(e: KeyboardEvent) {
  if (!props.interactive) return;
  const stepBy = props.step > 0 ? props.step : span.value / 100;
  const pageBy = props.pageStep > 0 ? props.pageStep : span.value / 10;
  let next: number;
  switch (e.key) {
    case "ArrowRight":
    case "ArrowUp":
      next = clamped.value + stepBy;
      break;
    case "ArrowLeft":
    case "ArrowDown":
      next = clamped.value - stepBy;
      break;
    case "PageUp":
      next = clamped.value + pageBy;
      break;
    case "PageDown":
      next = clamped.value - pageBy;
      break;
    case "Home":
      next = props.min;
      break;
    case "End":
      next = props.max;
      break;
    default:
      return;
  }
  e.preventDefault();
  emit("seek", clamp(next));
}
</script>

<style scoped lang="scss">
.h-playhead {
  position: absolute;
  inset: 0;
  // an indicator must never eat the host's own gestures
  pointer-events: none;

  --h-playhead-width: 4px;
  --h-playhead-gap-width: 3px;
  --h-playhead-inset: 2px;
  // --h-slider-gap is the kit's existing "colour of the surface a handle is
  // cut into", declared per scope in app.scss so dark islands don't inherit
  // a white halo. Same job here.
  --h-playhead-surface: var(--h-slider-gap, var(--color-bg-page, #ffffff));
  // the playhead colour the charts already use (graph-theme.ts cursor)
  --h-playhead-fill: var(
    --h-playhead-color,
    var(--color-feedback-negative, #e41e3f)
  );
}

.h-playhead--interactive {
  pointer-events: auto;
  cursor: pointer;
  // the strip owns the horizontal drag; the page keeps vertical scroll
  touch-action: pan-y;
  user-select: none;
  -webkit-user-select: none;

  &:focus-visible {
    outline: 2px solid var(--color-stroke-focus, #0064e0);
    outline-offset: 2px;
  }
}

// no transition on the wash: it tracks a clock, and easing a playhead makes
// it lag its own position
.h-playhead__ahead {
  position: absolute;
  top: 0;
  bottom: 0;
  left: var(--h-playhead-x);
  right: 0;
  background: var(--h-playhead-surface);
}

.h-playhead__handle {
  position: absolute;
  top: var(--h-playhead-inset);
  bottom: var(--h-playhead-inset);
  left: var(--h-playhead-x);
  width: var(--h-playhead-width);
  // centred on the position without spending `transform`, which the
  // press-slim below owns
  margin-left: calc(var(--h-playhead-width) / -2);
  border-radius: var(--radius-full, 9999px);
  background: var(--h-playhead-fill);
  // the M3 gap: a ring of the host surface painted around the bar, so the
  // handle never touches the field and survives any colour behind it
  box-shadow: 0 0 0 var(--h-playhead-gap-width) var(--h-playhead-surface);
  transition:
    width 120ms ease,
    margin-left 120ms ease;
}

// M3 press state, and the same 0.55 the sliders use: thickness only, never
// length. Width rather than the sliders' scaleX, because a transform would
// shrink the gap along with the bar — and the gap is the whole reason the
// handle survives the picture behind it.
.h-playhead--scrubbing .h-playhead__handle {
  width: calc(var(--h-playhead-width) * 0.55);
  margin-left: calc(var(--h-playhead-width) * -0.275);
}

@media (prefers-reduced-motion: reduce) {
  .h-playhead__handle {
    transition: none;
  }
}

// beside the handle, never on top of it, and it changes sides at the
// midpoint so it can't run out of the strip
.h-playhead__label {
  position: absolute;
  top: 4px;
  left: calc(var(--h-playhead-x) + 10px);
  padding: 1px 6px;
  border-radius: var(--radius-xs, 8px);
  background: var(--h-playhead-fill);
  color: var(--color-text-on-fill, #ffffff);
  font-size: 11px;
  font-weight: 600;
  line-height: 1.5;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  pointer-events: none;
}

.h-playhead__label--flip {
  left: auto;
  right: calc(100% - var(--h-playhead-x) + 10px);
}
</style>
