<template>
  <div class="h-stepperctl">
    <span v-if="label" class="text-body-compact h-stepperctl__label">{{
      label
    }}</span>
    <div class="h-stepperctl__controls">
      <q-btn
        round
        unelevated
        icon="remove"
        class="h-stepperctl__btn"
        :disable="modelValue <= min"
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
        :aria-label="kitLabelFor('sliderValue', label)"
        @input="onDraftInput"
        @keydown.enter.prevent="commitEdit"
        @keydown.esc.prevent="cancelEdit"
        @blur="commitEdit"
      />
      <button
        v-else-if="editable"
        type="button"
        class="h-stepperctl__value-btn"
        :aria-label="kitLabelFor('sliderEditValue', label)"
        @click="startEdit"
      >
        <HTabularNum class="text-h4 h-stepperctl__value" :value="display" />
      </button>
      <HTabularNum
        v-else
        class="text-h4 h-stepperctl__value"
        :value="display"
      />
      <q-btn
        round
        unelevated
        icon="add"
        class="h-stepperctl__btn"
        :disable="modelValue >= max"
        :aria-label="kitLabelFor('increase', label)"
        @pointerdown="press($event, 1)"
        @click="tap(1)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// Proposed spec for a number stepper: label left, minus/value/plus right.
// 40px icon-only round buttons on the alt surface, tabular value
// (HTabularNum), buttons disable at the bounds instead of clamping silently.
//
// Press and hold to repeat, and the longer it is held the further each repeat
// moves — see the constants below. A stepper is only as fine as its step size,
// and a fine step size is unusable if crossing the range takes 600 clicks; the
// hold is what lets `stepSize` be as small as the value deserves.
//
// `editable` opens a third way in: click the number and type it. It is OFF by
// default, because the stepper's whole promise is that the two buttons are
// the only things to aim at — a value that is usually nudged does not want a
// text field, and a field invites a keyboard on touch. Turn it on for a
// stepper whose range is wide enough that reaching the far end by holding is
// absurd. The mask, the commit-on-blur and the step lattice all match
// HLabeledSlider's click-to-type, so the two controls behave alike.
import { computed, nextTick, onBeforeUnmount, ref, useTemplateRef } from "vue";
import HTabularNum from "@/components/handy/HTabularNum.vue";
import { kitLabelFor } from "@/components/handy/labels";

const props = withDefaults(
  defineProps<{
    modelValue: number;
    label?: string;
    min?: number;
    max?: number;
    stepSize?: number;
    /** Suffix on the readout — "%", "ms", " fps". */
    unit?: string;
    /** Click the number and type it. Off by default — see the note above. */
    editable?: boolean;
    /** Decimal places the typed value accepts; 0 = whole steps only. */
    decimals?: number;
  }>(),
  {
    label: "",
    min: 0,
    max: 100,
    stepSize: 1,
    unit: "",
    editable: false,
    decimals: 0
  }
);

// Handed to HTabularNum as ONE string, so its tabular figures and min-width
// cover the unit too and the readout stops shifting as digits come and go.
const display = computed(() => `${props.modelValue}${props.unit}`);

const emit = defineEmits<{ "update:modelValue": [value: number] }>();

// ------------------------------------------------------------ click-to-type

const editing = ref(false);
const draft = ref("");
const inputEl = useTemplateRef<HTMLInputElement>("inputEl");

function startEdit() {
  // the raw number, without the unit — the unit is the readout's, not the
  // value's, and typing "40ms" into a field that wants 40 is a trap
  draft.value = String(props.modelValue);
  editing.value = true;
  void nextTick(() => {
    inputEl.value?.focus();
    inputEl.value?.select();
  });
}

// the mask: digits and a single leading minus, plus one decimal separator
// when `decimals` allows it. Disallowed characters never land in the field,
// typed or pasted (§6 Inputs).
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
  const parsed = Number(draft.value.replace(",", "."));
  if (!Number.isFinite(parsed)) return; // empty/gibberish → keep the old value
  // typed precision is the contract when decimals are allowed; otherwise the
  // value snaps to the same lattice the buttons walk, so typing and stepping
  // can't reach different sets of values
  const settled =
    props.decimals > 0
      ? Number(parsed.toFixed(props.decimals))
      : props.stepSize > 0
        ? Number(
            (Math.round(parsed / props.stepSize) * props.stepSize).toFixed(6)
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
  if (heldMs < GROW_AFTER_MS) return props.stepSize;
  const span = props.max - props.min;
  const ceiling =
    Number.isFinite(span) && span > 0
      ? Math.max(props.stepSize, span * MAX_SHARE_OF_RANGE)
      : props.stepSize;
  const grown = props.stepSize * 2 ** ((heldMs - GROW_AFTER_MS) / GROW_HALF_MS);
  // kept on the stepSize lattice, so a fast run still lands on values a
  // single step could have reached
  const ticks = Math.max(
    1,
    Math.round(Math.min(ceiling, grown) / props.stepSize)
  );
  return ticks * props.stepSize;
}

function intervalAt(heldMs: number): number {
  const t = Math.min(1, heldMs / RAMP_MS);
  return REPEAT_SLOW_MS + (REPEAT_FAST_MS - REPEAT_SLOW_MS) * t;
}

/** Move by `by`, clamped. False when the value could not move — at a bound. */
function bump(dir: 1 | -1, by: number): boolean {
  const next = Math.min(
    props.max,
    Math.max(props.min, props.modelValue + dir * by)
  );
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
  if (event.button !== 0) return;
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
  bump(dir, props.stepSize);
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
