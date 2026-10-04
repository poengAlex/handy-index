<template>
  <button
    type="button"
    class="h-slidermenu"
    :class="{ 'h-slidermenu--open': open }"
    :disabled="disable"
    :aria-label="kitLabelWith('sliderMenuValue', { label, value: valueText })"
    aria-haspopup="dialog"
    :aria-expanded="open"
  >
    <q-icon :name="icon" size="16px" class="h-slidermenu__icon" />
    <HTabularNum class="h-slidermenu__value" :value="valueText" />
    <q-icon name="expand_more" size="14px" class="h-slidermenu__caret" />

    <q-menu
      v-model="open"
      anchor="bottom end"
      self="top end"
      :offset="[0, 6]"
      class="h-slidermenu__menu"
    >
      <div class="h-slidermenu__panel">
        <HLabeledSlider
          :model-value="modelValue"
          :label="label"
          :min="min"
          :max="max"
          :step="step"
          :unit="unit"
          :decimals="decimals"
          :scale="scale"
          :format-value="formatValue"
          :reset="reset"
          @update:model-value="onSlider"
          @change="onChange"
        />
        <!-- the two or three spans anyone actually wants, one click each;
             the slider is for the value between them -->
        <div v-if="presetList.length > 0" class="h-slidermenu__presets">
          <button
            v-for="preset in presetList"
            :key="preset.value"
            type="button"
            class="h-slidermenu__preset"
            :class="{
              'h-slidermenu__preset--current': preset.value === modelValue
            }"
            @click="pick(preset.value)"
          >
            {{ preset.label }}
          </button>
        </div>
        <slot />
      </div>
    </q-menu>

    <slot name="tooltip" />
  </button>
</template>

<script setup lang="ts">
// A slider that costs one line of chrome instead of three: an icon, the live
// value, a caret — and the whole labeled slider only once you ask for it.
//
// For the knob a workspace needs *reachable* but not *present*. A zoom level,
// a row height, a gain: the value matters when you go looking for it and is
// noise the rest of the time, so a permanently-open track spends a full row
// of a panel on something touched twice a session. This keeps the value
// legible at a glance (that is the part you read) and folds the gesture into
// a menu.
//
// It is HLabeledSlider inside a q-menu, not a second slider: the number is
// still click-to-type, the label still resets, the same events come out. The
// presets are the addition — the two or three spans anyone actually wants,
// one click each.
//
// Not for: a slider someone drags repeatedly while watching the result (a
// live mix, the fat sliders on the device page). A gesture behind a menu is
// a gesture you can't repeat quickly, and the menu covers what you're
// watching. Those stay open on the surface.
import { computed, ref } from "vue";
import HLabeledSlider from "./HLabeledSlider.vue";
import { formatSliderValue } from "./slider-format";
import { kitLabelWith } from "./labels";
import HTabularNum from "./HTabularNum.vue";

export interface HSliderMenuPreset {
  value: number;
  /** Defaults to the value plus the unit. */
  label?: string;
}

const props = withDefaults(
  defineProps<{
    modelValue: number;
    /** Names the control, in the menu and in the button's accessible name. */
    label: string;
    /** Material Symbols name for the resting button. */
    icon?: string;
    min?: number;
    max?: number;
    step?: number;
    /** Appended to the value, on the button and in the menu ("s", "%"). */
    unit?: string;
    decimals?: number;
    /** Track shape — "log" for a range spanning orders of magnitude. See
     * HLabeledSlider; the model stays in the real unit either way. */
    scale?: "linear" | "log";
    /** Clicking the label in the menu snaps back to this (explicit
     * undefined allowed, for hosts that bind it conditionally). */
    reset?: number | undefined;
    /** Quick values under the track. Numbers, or {value,label} pairs. */
    presets?: readonly (number | HSliderMenuPreset)[];
    /** Overrides the button's value text — for a value whose useful form
     * isn't `${value}${unit}` (a span shown as a clock, say). */
    formatValue?: ((value: number) => string) | undefined;
    disable?: boolean;
  }>(),
  {
    icon: "tune",
    min: 0,
    max: 100,
    step: 1,
    unit: "",
    decimals: 0,
    scale: "linear",
    presets: () => [],
    disable: false
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: number];
  /** The track's commit — on release, and per keyboard step. A preset
   * click is a commit too: it is a finished choice, not a drag. */
  change: [value: number];
}>();

const open = ref(false);

const valueText = computed(() =>
  props.formatValue
    ? props.formatValue(props.modelValue)
    : // same filter the slider's own header uses, so the closed button and the
      // open panel never disagree about the value
      `${formatSliderValue(props.modelValue, props.decimals, props.step)}${props.unit}`
);

const presetList = computed<Required<HSliderMenuPreset>[]>(() =>
  props.presets.map(preset =>
    typeof preset === "number"
      ? { value: preset, label: `${preset}${props.unit}` }
      : {
          value: preset.value,
          label: preset.label ?? `${preset.value}${props.unit}`
        }
  )
);

// HLabeledSlider is number-or-range; this wrapper is single-value only, so
// the range shape is dropped rather than forwarded as a broken number
function onSlider(value: number | { min: number; max: number }) {
  if (typeof value === "number") emit("update:modelValue", value);
}

function onChange(value: number | { min: number; max: number }) {
  if (typeof value === "number") emit("change", value);
}

// a preset is a decision: apply it and get out of the way
function pick(value: number) {
  emit("update:modelValue", value);
  emit("change", value);
  open.value = false;
}
</script>

<style scoped lang="scss">
.h-slidermenu {
  all: unset;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px 4px 10px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  box-shadow: inset 0 0 0 1px var(--color-stroke-subtle);
  transition:
    color 180ms ease,
    box-shadow 180ms ease;

  &:hover {
    color: var(--color-text-primary);
    box-shadow: inset 0 0 0 1px var(--color-stroke-default);
  }

  &:focus-visible {
    outline: 2px solid var(--color-stroke-focus);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
}

// open is a state worth showing: the menu can sit anywhere on screen, and
// without it the button it came from is unfindable
.h-slidermenu--open {
  color: var(--color-text-primary);
  box-shadow: inset 0 0 0 1px var(--color-stroke-default);
}

.h-slidermenu__icon {
  color: var(--color-text-tertiary);
}

.h-slidermenu--open .h-slidermenu__icon,
.h-slidermenu:hover .h-slidermenu__icon {
  color: inherit;
}

.h-slidermenu__caret {
  margin-left: -2px;
  opacity: 0.7;
}

.h-slidermenu__panel {
  // the menu portals to <body>, so it inherits the PAGE's gap colour while
  // sitting on a card — the handle would otherwise wear a page-coloured halo
  --h-slider-gap: var(--color-bg-card);

  // Room for the handle's overhang, so this menu never grows a horizontal
  // scrollbar. Quasar's handle is a 40px box centred on its position, so at
  // either end of the track it hangs 20px past the width it was given — and
  // q-menu scrolls its own content (`overflow: auto`), which turns that
  // overhang into 20px of horizontal travel the moment you drag to an end.
  //
  // Every other slider leaves this to whatever ancestor is scrolling (see the
  // note in HLabeledSlider). This one cannot: the menu IS the scroll
  // container, and it belongs to this component, so the fix belongs here.
  // Padding rather than clipping — `overflow-x: clip` would slice the handle
  // in half at exactly 0 and 100, which is where it spends most of its life.
  --h-slider-thumb-overhang: 20px;

  min-width: 240px;
  padding: var(--space-sm) var(--h-slider-thumb-overhang);
  background: var(--color-bg-card);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.h-slidermenu__presets {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.h-slidermenu__preset {
  all: unset;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  box-shadow: inset 0 0 0 1px var(--color-stroke-subtle);
  transition:
    color 180ms ease,
    box-shadow 180ms ease;

  &:hover {
    color: var(--color-text-primary);
    box-shadow: inset 0 0 0 1px var(--color-stroke-default);
  }

  &:focus-visible {
    outline: 2px solid var(--color-stroke-focus);
    outline-offset: 2px;
  }
}

.h-slidermenu__preset--current {
  color: var(--color-text-primary);
  box-shadow: inset 0 0 0 1px var(--color-stroke-focus);
}
</style>
