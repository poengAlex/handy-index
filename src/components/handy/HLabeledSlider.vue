<template>
  <div class="h-lslider">
    <div class="h-lslider__head">
      <!-- label and its ? travel together, so space-between still puts the
           value hard right rather than spreading three items across -->
      <span class="h-lslider__label-group">
        <button
          v-if="reset !== undefined"
          type="button"
          class="text-body-compact h-lslider__label-btn"
          :aria-label="kitLabelFor('sliderReset', label)"
          @click="emit('update:modelValue', reset)"
        >
          {{ label }}
        </button>
        <span v-else class="text-body-compact">{{ label }}</span>
        <HHelpTip
          v-if="help"
          :title="label"
          :text="help"
          :detail="helpDetail"
          :note="helpNote"
        />
      </span>
      <span class="text-body-compact h-lslider__value">
        <!-- out-of-flow room for a status affordance (spinner, badge) before
             the value — the span is the positioning context -->
        <slot name="value-prefix" />
        <slot name="value">
          <template v-if="editable && !isRange">
            <template v-if="editing === 'single'">
              <input
                ref="inputEl"
                :value="draft"
                type="text"
                inputmode="decimal"
                class="h-lslider__input"
                :style="{ width: `${Math.max(draft.length, 1)}ch` }"
                :aria-label="kitLabelFor('sliderValue', label)"
                @input="onDraftInput"
                @keydown.enter.prevent="commitEdit"
                @keydown.esc.prevent="cancelEdit"
                @blur="commitEdit"
              />{{ unit }}
            </template>
            <button
              v-else
              type="button"
              class="h-lslider__value-btn"
              :aria-label="kitLabelFor('sliderEditValue', label)"
              @click="startEdit('single')"
            >
              <HTabularNum :value="valueText" />
            </button>
          </template>
          <template v-else-if="editable && isRange">
            <input
              v-if="editing === 'min'"
              ref="inputEl"
              :value="draft"
              type="text"
              inputmode="decimal"
              class="h-lslider__input"
              :style="{ width: `${Math.max(draft.length, 1)}ch` }"
              :aria-label="kitLabelFor('sliderMin', label)"
              @input="onDraftInput"
              @keydown.enter.prevent="commitEdit"
              @keydown.esc.prevent="cancelEdit"
              @blur="commitEdit"
            />
            <button
              v-else
              type="button"
              class="h-lslider__value-btn"
              :aria-label="kitLabelFor('sliderEditMin', label)"
              @click="startEdit('min')"
            >
              <HTabularNum
                :value="display((modelValue as HLabeledSliderRange).min)"
              />
            </button>
            –
            <input
              v-if="editing === 'max'"
              ref="inputEl"
              :value="draft"
              type="text"
              inputmode="decimal"
              class="h-lslider__input"
              :style="{ width: `${Math.max(draft.length, 1)}ch` }"
              :aria-label="kitLabelFor('sliderMax', label)"
              @input="onDraftInput"
              @keydown.enter.prevent="commitEdit"
              @keydown.esc.prevent="cancelEdit"
              @blur="commitEdit"
            />
            <button
              v-else
              type="button"
              class="h-lslider__value-btn"
              :aria-label="kitLabelFor('sliderEditMax', label)"
              @click="startEdit('max')"
            >
              <HTabularNum
                :value="display((modelValue as HLabeledSliderRange).max)"
              />
            </button>
            {{ unit }}
          </template>
          <HTabularNum v-else :value="valueText" />
        </slot>
      </span>
    </div>
    <!-- the wrapper is where the band's press is caught, before Quasar sees
         it (see "the band drags, on a hold" below) -->
    <div
      v-if="isRange"
      ref="rangeEl"
      class="h-lslider__range"
      :class="{
        'h-lslider__range--live': press !== null,
        'h-lslider__range--band': press === 'band',
        'h-lslider__range--press-min': press === 'min',
        'h-lslider__range--press-max': press === 'max'
      }"
    >
      <q-range
        :model-value="modelValue as HLabeledSliderRange"
        :min="min"
        :max="max"
        :step="step"
        :disable="disable"
        color="primary"
        @update:model-value="emit('update:modelValue', $event)"
        @change="emit('change', $event)"
        @pan="phase => emit('pan', phase)"
      />
    </div>
    <q-slider
      v-else
      :model-value="trackValue"
      :min="logScale ? 0 : min"
      :max="logScale ? LOG_TICKS : max"
      :step="logScale ? 1 : step"
      :disable="disable"
      color="primary"
      @update:model-value="v => emit('update:modelValue', fromTrack(v))"
      @change="v => emit('change', fromTrack(v))"
      @pan="phase => emit('pan', phase)"
    />
    <!-- out-of-flow children only (a q-tooltip for the control's shortcut) —
         anything with layout would land under the track -->
    <slot />
  </div>
</template>

<script setup lang="ts">
// Value-labeled slider (settings pattern): when the value matters more
// than the gesture it lives in a header above the track — compact label
// left, live number right (HTabularNum, so digits don't jiggle mid-drag).
// Pass a number for a single slider or a {min,max} object for a
// dual-handle range. With `drag-range` (opt-in) the selected band is
// itself draggable — both ends move together, keeping their distance.
// The #value slot overrides the default "42%" / "10–110mm" text, and
// `format-value` does the same for a single value without giving up
// click-to-type.
//
// `scale="log"` spaces the handle by ratio rather than by amount, for a
// range that covers orders of magnitude (a zoom window from 250 ms to an
// hour). Only the handle's position changes — model, bounds, presets and
// the typed value all stay in the real unit.
//
// `editable` (default ON — pass :editable="false" to opt out): the number
// itself is a quiet edit affordance — visually identical at rest, click
// (or focus + Enter) swaps in a borderless inline input. In range mode
// EACH end is its own affordance: click the min or the max number alone;
// the edited end stops at the other, so the handles never cross. The
// input is MASKED, not validated: non-numeric characters never land
// (digits, a leading minus, and — only when `decimals` > 0 — one decimal
// separator with the fraction cut to that length). Enter/blur commits
// (rounded to `decimals` when set, otherwise snapped to step; clamped to
// min/max unless `unclamped`), Esc cancels. With `unclamped` a typed
// value may exceed the slider's range — the track pins at its end while
// the readout keeps the real number. With `reset` set, the label becomes
// a same-looking button (pointer cursor) that snaps the value back to it.
//
// For wrappers that own a device round trip (smart sliders): the track's
// `change` (commit on release / per keystroke) and `pan` (drag start/end)
// are re-emitted, `disable` passes through, and the `value-prefix` slot
// offers an out-of-flow spot before the value for a status affordance
// (spinner, badge) that can never shift the header's height.
//
// ── One thing the PARENT owns: room for the handle ──────────────────────────
// Quasar's handle is a 40px box centred on its own position, so at either end
// of the track it hangs 20px OUTSIDE the width this component was given. On an
// ordinary surface nobody notices — the overhang lands in the parent's
// padding. Inside anything that scrolls it is scrollable overflow, and because
// `overflow-y: auto` forces the other axis to compute to `auto` too, the
// region grows a horizontal scrollbar with exactly 20px of travel: drag the
// handle to the end and the panel starts sliding sideways.
//
// This component cannot fix it for you. Insetting its own track would make
// every slider 40px narrower than the row it sits in, and padding itself out
// would just move the overflow one box outwards. The fix goes on the
// SCROLLING ancestor, which pads by the overhang and takes the same amount
// back as negative margin — content lands where it did, only the scrollbar
// moves outward, into padding the parent already had:
//
//   .the-scrolling-box {
//     padding-inline: 20px;
//     margin-inline: -20px;
//   }
//
// styles/_layout.scss ships it as `.slider-thumb-room`; HModal and HSliderMenu
// inline it,
// because they are scroll containers themselves and owe the guarantee to
// anyone who copies them. Clipping is the WRONG fix — `overflow-x: clip`
// slices the handle in half at exactly 0 and 100.
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import HTabularNum from "./HTabularNum.vue";
import HHelpTip from "./HHelpTip.vue";
import { formatSliderValue } from "./slider-format";
import { kitLabelFor } from "./labels";

export interface HLabeledSliderRange {
  min: number;
  max: number;
}

const props = withDefaults(
  defineProps<{
    modelValue: number | HLabeledSliderRange;
    label: string;
    min?: number;
    max?: number;
    /** snap increment between values */
    step?: number;
    /** appended to the value text, e.g. "%" or "mm" */
    unit?: string;
    /** click the number to type it (default on; single-value mode only) */
    editable?: boolean;
    /** typed values may go outside min/max (the track still pins) */
    unclamped?: boolean;
    /** decimal places the typed value accepts; 0 = whole steps only */
    decimals?: number;
    /** when set, clicking the label resets the value to this (explicit
     * undefined allowed, for wrappers that bind it conditionally) */
    reset?: number | HLabeledSliderRange | undefined;
    /** range mode: HOLD the selected band and it drags — both ends move
     * together, keeping their distance. A click, or a drag that starts
     * straight away, still moves the nearer handle (see "the band drags,
     * on a hold" in the script). */
    dragRange?: boolean;
    /**
     * Track shape. "log" spaces the handle by RATIO instead of by amount —
     * for a value whose useful range spans orders of magnitude, where a
     * linear track spends 99% of its length on the top decade and the whole
     * bottom half of the range lives in the first two pixels. `step` is
     * ignored (a log track's step is a ratio, not an amount); typed values
     * still land exactly, rounded to `decimals`. Single-value only, and only
     * when `min` > 0 — a ratio scale has no room for zero. Falls back to
     * linear rather than throwing when either does not hold.
     */
    scale?: "linear" | "log";
    /**
     * Overrides the header's value text — for a value whose useful form is
     * not `${value}${unit}` (a span read as "2m 30s", say). Display only:
     * the model, the track and the typed input all stay in the real unit, so
     * click-to-type still means what it says.
     */
    formatValue?: ((value: number) => string) | undefined;
    /** one or two sentences explaining the control; shows a ? by the label */
    help?: string;
    /** Second paragraph of the ? — for a knob whose meaning is a trade
     * rather than a definition. */
    helpDetail?: string;
    /** Closing line of the ?, set apart: normally the symptom that should
     * send someone to this control in the first place. */
    helpNote?: string;
    disable?: boolean;
  }>(),
  {
    min: 0,
    max: 100,
    step: 1,
    unit: "",
    editable: true,
    unclamped: false,
    decimals: 0,
    dragRange: false,
    scale: "linear",
    help: "",
    helpDetail: "",
    helpNote: "",
    disable: false
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: number | HLabeledSliderRange];
  /** the track's commit — on release, and per keyboard step */
  change: [value: number | HLabeledSliderRange];
  /** a drag gesture began / ended on the track */
  pan: [phase: "start" | "end"];
}>();

const isRange = computed(() => typeof props.modelValue === "object");

/** The number as the header prints it: float noise the host's own units
 * left behind is filtered out (see slider-format.ts), the model is not. */
function display(value: number): string {
  return formatSliderValue(value, props.decimals, props.step);
}

const valueText = computed(() => {
  if (typeof props.modelValue === "object") {
    return `${display(props.modelValue.min)}–${display(props.modelValue.max)}${props.unit}`;
  }
  if (props.formatValue) return props.formatValue(props.modelValue);
  return `${display(props.modelValue)}${props.unit}`;
});

// ── log track ──
// The handle's position is the only thing that changes: the model, `min`,
// `max`, `reset`, the typed input and both emits all stay in the real unit,
// so a host opts in with one prop and nothing else moves.

/** Detents across the whole track. Fine enough that a drag feels continuous,
 * coarse enough that a keyboard arrow is a step rather than a nudge. */
const LOG_TICKS = 1000;

/** A ratio scale needs a positive, ordered range and a single handle; when it
 * doesn't have one, linear is the honest fallback (a thrown error here would
 * take out a settings panel over a cosmetic choice). */
const logScale = computed(
  () =>
    props.scale === "log" &&
    !isRange.value &&
    props.min > 0 &&
    props.max > props.min
);

const trackValue = computed(() => {
  const value = props.modelValue as number;
  if (!logScale.value) return value;
  const clamped = Math.min(props.max, Math.max(props.min, value));
  const ratio = Math.log(clamped / props.min) / Math.log(props.max / props.min);
  return Math.round(ratio * LOG_TICKS);
});

function fromTrack(track: number | null): number {
  if (track === null) return props.min;
  if (!logScale.value) return track;
  const value = props.min * (props.max / props.min) ** (track / LOG_TICKS);
  // the ends are exact: a handle dragged to the top must read the max, not
  // the max minus a rounding error
  if (track <= 0) return props.min;
  if (track >= LOG_TICKS) return props.max;
  return props.decimals > 0
    ? Number(value.toFixed(props.decimals))
    : Math.round(value);
}

// ── inline value editing ──
// One shared draft/input; `editing` names the field it currently edits —
// the single value, or one end of a range (each number is its own quiet
// affordance there).
type EditField = "single" | "min" | "max";

const editing = ref<EditField | null>(null);
const draft = ref("");
const inputEl = ref<HTMLInputElement | null>(null);

function startEdit(field: EditField) {
  const value = props.modelValue;
  if (field === "single") {
    if (typeof value !== "number") return;
    draft.value = display(value);
  } else {
    if (typeof value !== "object") return;
    draft.value = display(field === "min" ? value.min : value.max);
  }
  editing.value = field;
  nextTick(() => {
    inputEl.value?.focus();
    inputEl.value?.select();
  });
}

// the mask: digits and a single leading minus; a decimal separator (. or ,)
// only when `decimals` allows one, with the fraction cut to that length —
// anything else never lands in the field, typed or pasted
function onDraftInput(e: Event) {
  const el = e.target as HTMLInputElement;
  let value = el.value.replace(/[^\d.,-]/g, "");
  value = value.slice(0, 1) + value.slice(1).replace(/-/g, "");
  if (props.decimals > 0) {
    const sep = value.search(/[.,]/);
    if (sep !== -1) {
      const fraction = value
        .slice(sep + 1)
        .replace(/[.,]/g, "")
        .slice(0, props.decimals);
      value = value.slice(0, sep + 1) + fraction;
    }
  } else {
    value = value.replace(/[.,]/g, "");
  }
  draft.value = value;
  // if sanitising didn't change the reactive string, Vue won't touch the
  // DOM — write the element directly so the masked char visibly vanishes
  el.value = value;
}

function commitEdit() {
  const field = editing.value;
  if (field === null) return;
  editing.value = null;
  const parsed = Number(draft.value.replace(",", "."));
  if (!Number.isFinite(parsed)) return; // empty/gibberish → keep the old value
  // with decimals the typed precision is the contract (round to it);
  // otherwise the value snaps to the slider's step — except on a log track,
  // where `step` is not an amount and snapping to it would quantise the top
  // of the range into a handful of values
  const settled =
    props.decimals > 0
      ? Number(parsed.toFixed(props.decimals))
      : props.step > 0 && !logScale.value
        ? Number((Math.round(parsed / props.step) * props.step).toFixed(6))
        : parsed;
  const bounded = props.unclamped
    ? settled
    : Math.min(props.max, Math.max(props.min, settled));
  if (field === "single") {
    emit("update:modelValue", bounded);
    return;
  }
  // range: the edited end stops at the other — handles never cross, same
  // as dragging (this ordering holds even with `unclamped`)
  const range = props.modelValue as HLabeledSliderRange;
  emit(
    "update:modelValue",
    field === "min"
      ? { min: Math.min(bounded, range.max), max: range.max }
      : { min: range.min, max: Math.max(bounded, range.min) }
  );
}

function cancelEdit() {
  editing.value = null;
}

// ── the band drags, on a hold ──
// `drag-range` used to be Quasar's prop passed straight through, and Quasar
// claims the band the instant a pointer lands on it: press anywhere inside
// the selection and the gesture IS a band drag, so a plain click in there —
// the gesture that moves the nearer handle everywhere else on the track —
// did nothing at all. The band is the middle of the track, so opting in cost
// the control its most ordinary gesture.
//
// So the band drag is ours now, and it sits behind a hold. Press inside the
// band and wait HOLD_MS and the band takes the gesture; click, or press and
// move straight away, and the nearer handle goes where you pointed, exactly
// as it does with `drag-range` off. Only a press that starts inside the band
// (inset by a thumb radius, so the handles keep their own gesture) is taken
// from Quasar — caught in the capture phase before its own listeners run,
// then driven off `update:modelValue` like any other host would. The handles
// and the track outside the band are still Quasar's, untouched.

/** how long the band must be held before it takes the gesture. Short, and
 * it can afford to be: moving cancels the hold outright (that press is a
 * handle drag), and letting go without moving is still a click — so an
 * unhurried click that dwells past the threshold does what it always did,
 * rather than arming the band and dying there. */
const HOLD_MS = 120;
/** movement that ends the "is this a click?" question */
const MOVE_SLOP = 4;
/** half the default thumb — the strip at each end of the band that stays
 * Quasar's, so grabbing a handle still grabs the handle */
const THUMB_RADIUS = 10;

const rangeEl = ref<HTMLElement | null>(null);
/** what the press state is on: one end, or the band (the hold landed) */
const press = ref<"min" | "max" | "band" | null>(null);

type BandDrag = {
  touch: boolean;
  startX: number;
  startY: number;
  rect: DOMRect;
  start: HLabeledSliderRange;
  /** the handle a non-band drag moves — the one nearer the press */
  edge: "min" | "max";
  mode: "pending" | "handle" | "band";
  timer: ReturnType<typeof setTimeout> | null;
  moved: boolean;
  last: HLabeledSliderRange;
};

let drag: BandDrag | null = null;

/** the model value at a point on the track, snapped to `step` */
function valueAt(clientX: number, rect: DOMRect): number {
  const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  const step = props.step > 0 ? props.step : 1;
  const raw = props.min + ratio * (props.max - props.min);
  const snapped = props.min + Math.round((raw - props.min) / step) * step;
  // toFixed: a step like 0.1 leaves float dust that would print in the header
  return Math.min(props.max, Math.max(props.min, Number(snapped.toFixed(6))));
}

/** one end moved, the other held — ends stop at each other rather than
 * crossing, the same rule the typed input commits under */
function withEdge(
  start: HLabeledSliderRange,
  edge: "min" | "max",
  value: number
): HLabeledSliderRange {
  return edge === "min"
    ? { min: Math.min(value, start.max), max: start.max }
    : { min: start.min, max: Math.max(value, start.min) };
}

function push(next: HLabeledSliderRange) {
  if (!drag || (next.min === drag.last.min && next.max === drag.last.max))
    return;
  drag.last = next;
  emit("update:modelValue", next);
}

function onDown(
  event: MouseEvent | TouchEvent,
  clientX: number,
  clientY: number
) {
  if (drag || props.disable || !props.dragRange || !isRange.value) return;
  const rect = rangeEl.value
    ?.querySelector(".q-slider")
    ?.getBoundingClientRect();
  const span = props.max - props.min;
  if (!rect || rect.width === 0 || span <= 0) return;

  const start = { ...(props.modelValue as HLabeledSliderRange) };
  const ratio = (clientX - rect.left) / rect.width;
  const inset = THUMB_RADIUS / rect.width;
  const minRatio = (start.min - props.min) / span;
  const maxRatio = (start.max - props.min) / span;
  // outside the band, or on either handle: Quasar's gesture, not ours
  if (ratio <= minRatio + inset || ratio >= maxRatio - inset) return;

  const touch = event.type === "touchstart";
  // Quasar binds mousedown/touch-pan on the track container below us, and
  // the desktop mousedown moves a handle on the way down — stop the event
  // here and the press is ours alone
  event.stopPropagation();
  if (!touch) event.preventDefault();

  const value = valueAt(clientX, rect);
  drag = {
    touch,
    startX: clientX,
    startY: clientY,
    rect,
    start,
    edge: value - start.min <= start.max - value ? "min" : "max",
    mode: "pending",
    timer: null,
    moved: false,
    last: start
  };
  drag.timer = setTimeout(() => {
    if (!drag) return;
    drag.mode = "band";
    press.value = "band";
  }, HOLD_MS);

  if (touch) {
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);
  } else {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }
}

function onMove(
  event: MouseEvent | TouchEvent,
  clientX: number,
  clientY: number
) {
  if (!drag) return;
  const dx = clientX - drag.startX;
  const dy = clientY - drag.startY;

  if (!drag.moved) {
    if (Math.abs(dx) < MOVE_SLOP && Math.abs(dy) < MOVE_SLOP) return;
    // a finger heading down the page is scrolling it, not editing the range —
    // hand the gesture back before anything moves (the band, once held, is
    // committed and keeps the touch)
    if (drag.touch && drag.mode !== "band" && Math.abs(dy) > Math.abs(dx)) {
      endDrag(true);
      return;
    }
    drag.moved = true;
    // moving before the hold landed settles it: this is a handle drag
    if (drag.mode === "pending") {
      drag.mode = "handle";
      press.value = drag.edge;
    }
    if (drag.timer !== null) clearTimeout(drag.timer);
    drag.timer = null;
    emit("pan", "start");
  }

  // ours now — the page underneath stays put
  if (drag.touch && event.cancelable) event.preventDefault();

  if (drag.mode === "band") {
    const width = drag.start.max - drag.start.min;
    const shifted = valueAt(
      drag.rect.left +
        ((drag.start.min - props.min) / (props.max - props.min)) *
          drag.rect.width +
        dx,
      drag.rect
    );
    const min = Math.min(Math.max(shifted, props.min), props.max - width);
    push({ min, max: min + width });
  } else {
    push(withEdge(drag.start, drag.edge, valueAt(clientX, drag.rect)));
  }
}

/** `abort`: the gesture was handed back (a finger that turned out to be
 * scrolling the page) — nothing was ours to commit */
function endDrag(abort = false) {
  if (!drag) return;
  const d = drag;
  drag = null;
  if (d.timer !== null) clearTimeout(d.timer);
  press.value = null;
  if (d.touch) {
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("touchend", onTouchEnd);
    window.removeEventListener("touchcancel", onTouchEnd);
  } else {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  }
  if (abort) return;

  // a touch ends in compatibility mouse events and a click, and Quasar's
  // track is listening for both — they would replay against it a gesture the
  // touch path has already answered
  if (d.touch) {
    touchAt = Date.now();
    swallowNextClick();
  }

  if (d.moved) {
    emit("pan", "end");
    emit("change", d.last);
    return;
  }
  // nothing moved — a click, whether or not the hold had armed the band —
  // and the press never reached Quasar, so do what a click anywhere else on
  // the track does
  const next = withEdge(d.start, d.edge, valueAt(d.startX, d.rect));
  emit("update:modelValue", next);
  emit("change", next);
}

function swallowNextClick() {
  const el = rangeEl.value;
  if (!el) return;
  const stop = (e: Event) => {
    e.stopPropagation();
    e.preventDefault();
  };
  el.addEventListener("click", stop, { capture: true, once: true });
  setTimeout(() => el.removeEventListener("click", stop, true), 400);
}

/** when a touch gesture of ours last ended — see endDrag */
let touchAt = 0;
const COMPAT_MOUSE_MS = 700;

function onMouseDown(e: MouseEvent) {
  if (Date.now() - touchAt < COMPAT_MOUSE_MS) {
    e.stopPropagation();
    e.preventDefault();
    return;
  }
  if (e.button === 0) onDown(e, e.clientX, e.clientY);
}
function onMouseMove(e: MouseEvent) {
  onMove(e, e.clientX, e.clientY);
}
function onMouseUp() {
  endDrag();
}
function onTouchStart(e: TouchEvent) {
  const touch = e.touches.length === 1 ? e.touches[0] : undefined;
  if (touch) onDown(e, touch.clientX, touch.clientY);
}
function onTouchMove(e: TouchEvent) {
  const touch = e.touches.length === 1 ? e.touches[0] : undefined;
  if (touch) onMove(e, touch.clientX, touch.clientY);
}
function onTouchEnd() {
  endDrag();
}

onMounted(() => {
  const el = rangeEl.value;
  if (!el) return;
  // capture, so the press is answered before Quasar's own listeners on the
  // track container below
  el.addEventListener("mousedown", onMouseDown, true);
  el.addEventListener("touchstart", onTouchStart, {
    capture: true,
    passive: false
  });
});

onBeforeUnmount(() => {
  endDrag();
  const el = rangeEl.value;
  if (!el) return;
  el.removeEventListener("mousedown", onMouseDown, true);
  el.removeEventListener("touchstart", onTouchStart, true);
});
</script>

<style scoped lang="scss">
// full-width: the slider spans whatever container it's placed in — pages
// that want a narrower control constrain the container, not the component
.h-lslider {
  width: 100%;
}

.h-lslider__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
}

.h-lslider__value {
  // the positioning context for #value-prefix content
  position: relative;
  // flex drops the whitespace-only text nodes between the range-edit
  // buttons and the dash/unit, keeping the readout tight ("20–100%")
  display: inline-flex;
  align-items: baseline;
  color: var(--color-text-secondary);
}

// the range's wrapper exists to catch the band's press (see the script) —
// it must not add a box of its own, and `q-slider--h` is width:100% inside it
.h-lslider__range {
  display: block;
}

// Quasar animates a range that is at REST into position — `--inactive`
// carries a .28s transition on the thumb's `left` and the selection's
// `width`/`left` — and drops it while IT is dragging. Our gesture never makes
// it active, so every frame we emitted was being animated over 280ms: the
// band lagged the pointer and stuttered along behind it. Live gesture, no
// transition, same as Quasar's own drag.
.h-lslider__range--live :deep(.q-slider__thumb),
.h-lslider__range--live :deep(.q-slider__selection),
.h-lslider__range--live :deep(.q-slider__text-container) {
  transition: none;
}

// The press state, which Quasar would otherwise put on itself: our gesture
// never reaches it, so `.q-slider--active` (styles/_quasar.scss — the M3 slim on the
// handle bar) never fires. On the band's hold this is the only sign the hold
// landed, and a finger has no cursor to read it any other way. The thumbs are
// the last two children of the track, min then max.
.h-lslider__range--band :deep(.q-slider__thumb-shape path),
.h-lslider__range--press-min
  :deep(.q-slider__thumb:nth-last-child(2) .q-slider__thumb-shape path),
.h-lslider__range--press-max
  :deep(.q-slider__thumb:last-child .q-slider__thumb-shape path) {
  transform: scaleX(0.55);
}

// held: the band has the gesture, and says so the way any grabbed thing does
.h-lslider__range--band :deep(.q-slider__track-container) {
  cursor: grabbing;
}

// with a reset value, the label is a button that looks exactly like the
// text — only the pointer cursor gives the affordance away
.h-lslider__label-group {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  min-width: 0;
}

.h-lslider__label-btn {
  appearance: none;
  background: none;
  border: 0;
  padding: 0;
  margin: 0;
  font: inherit;
  letter-spacing: inherit;
  color: inherit;
  cursor: pointer;
}

// the resting editable value is a button that looks exactly like the text
.h-lslider__value-btn {
  appearance: none;
  background: none;
  border: 0;
  padding: 0;
  margin: 0;
  font: inherit;
  letter-spacing: inherit;
  color: inherit;
  cursor: text;
}

// the inline input inherits the value's exact type; the focus ring is
// replaced by a hairline underline in the focus colour (it IS the ring
// here). The underline is a box-shadow, not a border — a border would add
// 1px to the box and nudge the row's height when editing starts.
.h-lslider__input {
  appearance: none;
  background: none;
  border: 0;
  padding: 0;
  margin: 0;
  font: inherit;
  letter-spacing: inherit;
  color: inherit;
  text-align: right;
  font-variant-numeric: tabular-nums;
  min-width: 1ch;
  box-shadow: 0 1px 0 0 var(--color-stroke-focus);

  &:focus-visible {
    outline: none;
  }
}
</style>
