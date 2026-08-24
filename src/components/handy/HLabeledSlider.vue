<template>
  <div class="h-lslider">
    <div class="h-lslider__head">
      <button
        v-if="reset !== undefined"
        type="button"
        class="text-body-compact h-lslider__label-btn"
        :aria-label="aria.reset"
        @click="emit('update:modelValue', reset)"
      >
        {{ label }}
      </button>
      <span v-else class="text-body-compact">{{ label }}</span>
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
                :aria-label="aria.value"
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
              :aria-label="aria.editValue"
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
              :aria-label="aria.min"
              @input="onDraftInput"
              @keydown.enter.prevent="commitEdit"
              @keydown.esc.prevent="cancelEdit"
              @blur="commitEdit"
            />
            <button
              v-else
              type="button"
              class="h-lslider__value-btn"
              :aria-label="aria.editMin"
              @click="startEdit('min')"
            >
              <HTabularNum
                :value="`${(modelValue as HLabeledSliderRange).min}`"
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
              :aria-label="aria.max"
              @input="onDraftInput"
              @keydown.enter.prevent="commitEdit"
              @keydown.esc.prevent="cancelEdit"
              @blur="commitEdit"
            />
            <button
              v-else
              type="button"
              class="h-lslider__value-btn"
              :aria-label="aria.editMax"
              @click="startEdit('max')"
            >
              <HTabularNum
                :value="`${(modelValue as HLabeledSliderRange).max}`"
              />
            </button>
            {{ unit }}
          </template>
          <HTabularNum v-else :value="valueText" />
        </slot>
      </span>
    </div>
    <q-range
      v-if="isRange"
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
    <q-slider
      v-else
      :model-value="modelValue as number"
      :min="min"
      :max="max"
      :step="step"
      :disable="disable"
      color="primary"
      @update:model-value="emit('update:modelValue', $event ?? min)"
      @change="emit('change', $event ?? min)"
      @pan="phase => emit('pan', phase)"
    />
  </div>
</template>

<script setup lang="ts">
// Value-labeled slider (settings pattern): when the value matters more
// than the gesture it lives in a header above the track — compact label
// left, live number right (HTabularNum, so digits don't jiggle mid-drag).
// Pass a number for a single slider or a {min,max} object for a
// dual-handle range. The #value slot overrides the default "42%" /
// "10–110mm" text.
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
import { computed, nextTick, ref } from "vue";
import HTabularNum from "@/components/handy/HTabularNum.vue";

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
    disable?: boolean;
    /** Screen-reader name for the label-as-reset button. */
    resetLabel?: string;
    /** Screen-reader name for the value field. */
    valueLabel?: string;
    /** Screen-reader name for the button that opens that field. */
    editValueLabel?: string;
    /** Screen-reader name for the range's lower field. */
    minValueLabel?: string;
    /** Screen-reader name for the button that opens the lower field. */
    editMinLabel?: string;
    /** Screen-reader name for the range's upper field. */
    maxValueLabel?: string;
    /** Screen-reader name for the button that opens the upper field. */
    editMaxLabel?: string;
  }>(),
  {
    min: 0,
    max: 100,
    step: 1,
    unit: "",
    editable: true,
    unclamped: false,
    decimals: 0,
    disable: false,
    resetLabel: "",
    valueLabel: "",
    editValueLabel: "",
    minValueLabel: "",
    editMinLabel: "",
    maxValueLabel: "",
    editMaxLabel: ""
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

const valueText = computed(() => {
  if (typeof props.modelValue === "object") {
    return `${props.modelValue.min}–${props.modelValue.max}${props.unit}`;
  }
  return `${props.modelValue}${props.unit}`;
});

// Every one of these names is built around `label` ("Edit Duration
// minimum"), so the fallbacks can't be fixed strings in withDefaults —
// they have to follow the label. An app with more than one language
// passes the finished name instead: English's word order is not
// everyone's, so these can never be assembled from translated pieces.
const aria = computed(() => ({
  reset: props.resetLabel || `Reset ${props.label}`,
  value: props.valueLabel || `${props.label} value`,
  editValue: props.editValueLabel || `Edit ${props.label} value`,
  min: props.minValueLabel || `${props.label} minimum value`,
  editMin: props.editMinLabel || `Edit ${props.label} minimum`,
  max: props.maxValueLabel || `${props.label} maximum value`,
  editMax: props.editMaxLabel || `Edit ${props.label} maximum`
}));

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
    draft.value = String(value);
  } else {
    if (typeof value !== "object") return;
    draft.value = String(field === "min" ? value.min : value.max);
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
  // otherwise the value snaps to the slider's step
  const settled =
    props.decimals > 0
      ? Number(parsed.toFixed(props.decimals))
      : props.step > 0
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

// with a reset value, the label is a button that looks exactly like the
// text — only the pointer cursor gives the affordance away
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
