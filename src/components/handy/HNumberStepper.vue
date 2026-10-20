<template>
  <div :class="['h-stepperctl', { disabled: disable }]">
    <span v-if="label" class="text-body-compact h-stepperctl__label">{{
      label
    }}</span>
    <div class="h-stepperctl__controls">
      <q-btn
        round
        unelevated
        icon="remove"
        class="h-stepperctl__btn"
        :disable="disable || modelValue <= min"
        :aria-label="kitLabelFor('decrease', label)"
        @pointerdown="press($event, -1)"
        @click="tap(-1)"
      />
      <!-- The readout is three things depending on `editable`: plain text,
           a button that becomes a field, or the field itself. All three keep
           the same box, so nothing on the row moves when you click it. -->
      <input
        v-if="editing"
        ref="inputEl"
        v-model="draft"
        type="text"
        inputmode="decimal"
        class="text-h4 h-stepperctl__value h-stepperctl__input"
        :style="{ width: editWidth }"
        :aria-label="kitLabelFor('sliderValue', label)"
        @input="onDraftInput"
        @keydown.enter.prevent="commitEdit"
        @keydown.esc.prevent="cancelEdit"
        @blur="commitEdit"
      />
      <button
        v-else-if="editable && !disable"
        ref="valueBtn"
        type="button"
        class="h-stepperctl__value-btn"
        :aria-label="kitLabelFor('sliderEditValue', label)"
        @click="startEdit"
      >
        <HTabularNum
          class="text-h4 h-stepperctl__value"
          :value="display"
          :data-widest="reserve"
        />
      </button>
      <HTabularNum
        v-else
        class="text-h4 h-stepperctl__value"
        :value="display"
        :data-widest="reserve"
      />
      <q-btn
        round
        unelevated
        icon="add"
        class="h-stepperctl__btn"
        :disable="disable || modelValue >= max"
        :aria-label="kitLabelFor('increase', label)"
        @pointerdown="press($event, 1)"
        @click="tap(1)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// The number stepper (design.md 6.4): label left, minus/value/plus right.
// 40px icon-only round buttons on the alt surface, tabular value
// (HTabularNum) held at the width of the widest it can show, so the buttons
// never move; they disable at the bounds instead of clamping silently.
//
// Press and hold to repeat, and the longer it is held the further each repeat
// moves — see the constants below. A stepper is only as fine as its step size,
// and a fine step size is unusable if crossing the range takes 600 clicks; the
// hold is what lets `step` be as small as the value deserves.
//
// `disable` takes the whole control out — label and readout dim with the
// buttons, through Quasar's `.disabled` (50%, not-allowed), and the buttons
// inside it don't dim a second time.
//
// `editable` opens a third way in: click the number and type it. It is OFF by
// default, because the stepper's whole promise is that the two buttons are
// the only things to aim at — a value that is usually nudged does not want a
// text field, and a field invites a keyboard on touch. Turn it on for a
// stepper whose range is wide enough that reaching the far end by holding is
// absurd. The mask, the commit-on-blur and the step lattice all match
// HLabeledSlider's click-to-type, so the two controls behave alike.
//
// The readout shows at most `maxDecimals` places, 3 unless set, or more when
// `step` or `decimals` needs them, and drops trailing zeros: a value that
// arrives as 0.30000000000000004 reads 0.3, a third reads 0.333, and a whole
// number reads as one.
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  useTemplateRef,
  watch
} from "vue";
import HTabularNum from "./HTabularNum.vue";
import { kitLabelFor } from "./labels";

const props = withDefaults(
  defineProps<{
    modelValue: number;
    label?: string;
    min?: number;
    max?: number;
    step?: number;
    /** @deprecated The kit's name is `step`, as on the sliders. */
    stepSize?: number;
    /** Suffix on the readout — "%", "ms", " fps". */
    unit?: string;
    /** Click the number and type it. Off by default — see the note above. */
    editable?: boolean;
    /** Decimal places the typed value accepts; 0 = whole steps only. */
    decimals?: number;
    /** Most decimal places the readout shows; `step` or `decimals` can need
     * more, and win. */
    maxDecimals?: number;
    disable?: boolean;
  }>(),
  {
    label: "",
    min: 0,
    max: 100,
    unit: "",
    editable: false,
    decimals: 0,
    maxDecimals: 3,
    disable: false
  }
);

// `step` wins over the old `stepSize`; 1 when neither is given.
const stepBy = computed(() => props.step ?? props.stepSize ?? 1);
// The places a step can land on: 0.1 steps keep one, so 0.1 + 0.2 reads 0.3
// and not the float sum. A typed value may carry `decimals` more.
// Counted on the number rounded to 12 significant digits, so float dust in a
// computed step or value (0.007000000000000001) counts as what it means.
const decimalsOf = (n: number) =>
  (String(Number(n.toPrecision(12))).split(".")[1] ?? "").length;
const places = computed(() =>
  Math.max(props.decimals, decimalsOf(stepBy.value))
);
// The places the readout keeps: the cap, unless the step or the typing
// precision needs more.
const shown = computed(() => Math.max(props.maxDecimals, places.value));

/** The value as the readout and the field print it: rounded to `shown`,
 * trailing zeros dropped. */
function format(value: number): string {
  if (!Number.isFinite(value)) return String(value);
  return String(Number(value.toFixed(Math.min(shown.value, 20))));
}

// Handed to HTabularNum as ONE string, so its tabular figures cover the unit
// too.
const display = computed(() => `${format(props.modelValue)}${props.unit}`);

// The readout holds one width, so the buttons either side never move as the
// value changes (design.md 6.4). In tabular figures every digit is as wide
// as a 0, so the widest value it can show is a string of zeros: the longer
// whole part of the two bounds, every place a step, a typed value or a bound
// can land on, a minus when the range dips below zero, and the unit. It sits
// invisibly under the number (data-widest and the ::after below), so the
// width is the font's own.
const widest = computed(() => {
  const whole = (n: number) =>
    Number.isFinite(n) ? String(Math.trunc(Math.abs(n))).length : 1;
  const fraction = Math.min(
    shown.value,
    Math.max(places.value, decimalsOf(props.min), decimalsOf(props.max))
  );
  return [
    props.min < 0 ? "-" : "",
    "0".repeat(Math.max(whole(props.min), whole(props.max))),
    fraction > 0 ? `.${"0".repeat(fraction)}` : "",
    props.unit
  ].join("");
});
// A value given with more places than that (a third reads 0.333) widens the
// readout, and it keeps that width: shrinking back as the steps walk on
// would move the buttons all the same. New bounds, step or unit start over
// from their own widest.
const reserve = ref("");
watch(
  [widest, display],
  ([wide, text], previous) => {
    const base = previous?.[0] === wide ? reserve.value : wide;
    reserve.value = text.length > base.length ? text : base;
  },
  { immediate: true }
);

const emit = defineEmits<{ "update:modelValue": [value: number] }>();

// ------------------------------------------------------------ click-to-type

const editing = ref(false);
const draft = ref("");
// what the field opened with: leaving it untouched must not round the value
// to the typing precision behind the person's back
let draftStart = "";
const inputEl = useTemplateRef<HTMLInputElement>("inputEl");
// The field takes the readout's box: a text input's own width is the
// browser's default, about twenty characters, which pushed the − button
// aside the moment you clicked the number.
const valueBtn = useTemplateRef<HTMLButtonElement>("valueBtn");
const editWidth = ref("");

function startEdit() {
  const width = valueBtn.value?.getBoundingClientRect().width;
  editWidth.value = width ? `${width}px` : "";
  // the raw number, without the unit — the unit is the readout's, not the
  // value's, and typing "40ms" into a field that wants 40 is a trap
  draft.value = format(props.modelValue);
  draftStart = draft.value;
  editing.value = true;
  void nextTick(() => {
    inputEl.value?.focus();
    inputEl.value?.select();
  });
}

// the mask: digits and a single leading minus, plus one decimal separator
// when `decimals` allows it. Disallowed characters never land in the field,
// typed or pasted (design.md 6.4, Text field).
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
  // if sanitising didn't change the reactive string, Vue won't touch the DOM
  // — write the element directly so the masked character visibly vanishes
  el.value = value;
}

function commitEdit() {
  if (!editing.value) return;
  editing.value = false;
  if (draft.value === draftStart) return;
  const parsed = Number(draft.value.replace(",", "."));
  if (!Number.isFinite(parsed)) return; // empty/gibberish → keep the old value
  // typed precision is the contract when decimals are allowed; otherwise the
  // value snaps to the same lattice the buttons walk, so typing and stepping
  // can't reach different sets of values
  const settled =
    props.decimals > 0
      ? Number(parsed.toFixed(props.decimals))
      : stepBy.value > 0
        ? Number(
            (Math.round(parsed / stepBy.value) * stepBy.value).toFixed(
              places.value
            )
          )
        : parsed;
  const bounded = Math.min(props.max, Math.max(props.min, settled));
  if (bounded !== props.modelValue) emit("update:modelValue", bounded);
}

function cancelEdit() {
  editing.value = false;
}

// ------------------------------------------------------------ press and hold

/** Held this long before the repeat starts — longer than any tap. */
const HOLD_DELAY_MS = 400;
/** The repeat interval eases from the first to the second over RAMP_MS. */
const REPEAT_SLOW_MS = 150;
const REPEAT_FAST_MS = 45;
const RAMP_MS = 1000;
/** The increment holds at one step this long, then doubles every GROW_HALF_MS. */
const GROW_AFTER_MS = 1000;
const GROW_HALF_MS = 300;
/** Ceiling on that growth, as a share of the range: a hold covers ground fast
 * but never in a jump you cannot see happen. */
const MAX_SHARE_OF_RANGE = 0.01;

let holdStart = 0;
let timer: ReturnType<typeof setTimeout> | null = null;
/** Whether this press has repeated — the click that ends it is then the
 * release of a hold, not a step of its own. */
let repeated = false;

/**
 * The increment for a press held `heldMs`. One step until it has been held a
 * beat, so a slow deliberate press is still exactly one step, then doubling
 * with time — and capped by the range, so a stepper fenced into a narrow one
 * (a value bounded by its neighbours, say) never accelerates at all.
 */
function incrementAt(heldMs: number): number {
  const step = stepBy.value;
  if (heldMs < GROW_AFTER_MS) return step;
  const span = props.max - props.min;
  const ceiling =
    Number.isFinite(span) && span > 0
      ? Math.max(step, span * MAX_SHARE_OF_RANGE)
      : step;
  const grown = step * 2 ** ((heldMs - GROW_AFTER_MS) / GROW_HALF_MS);
  // kept on the step lattice, so a fast run still lands on values a single
  // step could have reached
  const ticks = Math.max(1, Math.round(Math.min(ceiling, grown) / step));
  return ticks * step;
}

function intervalAt(heldMs: number): number {
  const t = Math.min(1, heldMs / RAMP_MS);
  return REPEAT_SLOW_MS + (REPEAT_FAST_MS - REPEAT_SLOW_MS) * t;
}

/** Move by `by`, clamped. False when the value could not move — at a bound. */
function bump(dir: 1 | -1, by: number): boolean {
  // rounded to the step's places, or the value's own when a caller set one
  // finer, up to what the readout shows (so float noise in it isn't kept as
  // precision, and the next value is never finer than the one on screen)
  const keep = Math.max(
    places.value,
    Math.min(shown.value, decimalsOf(props.modelValue))
  );
  const sum = Number((props.modelValue + dir * by).toFixed(keep));
  const next = Math.min(props.max, Math.max(props.min, sum));
  if (next === props.modelValue) return false;
  emit("update:modelValue", next);
  return true;
}

function repeat(dir: 1 | -1): void {
  const held = performance.now() - holdStart;
  repeated = true;
  if (!bump(dir, incrementAt(held))) {
    release();
    return;
  }
  timer = setTimeout(() => repeat(dir), intervalAt(held));
}

function release(): void {
  if (timer !== null) clearTimeout(timer);
  timer = null;
  window.removeEventListener("pointerup", release);
  window.removeEventListener("pointercancel", release);
  window.removeEventListener("blur", release);
}

/** Pointer only. The first step comes from the click on release — which is
 * also what a keyboard Enter/Space fires, so both paths step once and only
 * the hold needs the pointer. */
function press(event: PointerEvent, dir: 1 | -1): void {
  if (event.button !== 0 || props.disable) return;
  release();
  repeated = false;
  holdStart = performance.now();
  timer = setTimeout(() => repeat(dir), HOLD_DELAY_MS);
  window.addEventListener("pointerup", release);
  window.addEventListener("pointercancel", release);
  window.addEventListener("blur", release);
}

function tap(dir: 1 | -1): void {
  if (repeated) {
    repeated = false;
    return;
  }
  if (props.disable) return;
  bump(dir, stepBy.value);
}

onBeforeUnmount(release);
</script>

<style scoped lang="scss">
.h-stepperctl {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
  width: 100%;
}

.h-stepperctl__label {
  color: var(--color-text-primary);
}

.h-stepperctl__controls {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin-left: auto;
}

.h-stepperctl__btn {
  background: var(--color-bg-page-alt);
  color: var(--color-text-primary);
  // a held button is a gesture, not a selection: without this a long press
  // on touch scrolls the page, and on desktop it drags a text selection out
  // of the label beside it
  touch-action: manipulation;
  user-select: none;
}

.h-stepperctl__value {
  font-weight: 700;
  min-width: 48px;
  text-align: center;

  // the widest value the readout can show (`reserve`), as a line of no
  // height under the number: the readout takes its width, so the buttons
  // hold still. Hidden, it is neither seen nor read out.
  &::after {
    content: attr(data-widest);
    display: block;
    height: 0;
    overflow: hidden;
    visibility: hidden;
  }
}

// the button is only a hit area — it must not change the readout's metrics,
// or the number would shift the moment `editable` is turned on
.h-stepperctl__value-btn {
  appearance: none;
  background: none;
  border: 0;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  display: flex;
  cursor: text;
}

.h-stepperctl__input {
  appearance: none;
  background: none;
  border: 0;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  font-variant-numeric: tabular-nums;
  // the same 1px rule the labeled slider's field wears, rather than a box —
  // the field is the readout, lightly underlined, not a new control
  box-shadow: 0 1px 0 0 var(--color-stroke-focus);

  &:focus-visible {
    outline: none;
  }
}
</style>
