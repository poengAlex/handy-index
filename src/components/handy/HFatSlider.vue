<template>
  <div ref="rootEl" :class="['h-fat', vertical ? 'h-fat--v' : 'h-fat--h']">
    <q-slider
      :model-value="modelValue"
      :vertical="vertical"
      :reverse="vertical"
      :min="min"
      :max="max"
      color="primary"
      track-size="56px"
      thumb-size="72px"
      :thumb-path="vertical ? FAT_THUMB_V : FAT_THUMB_H"
      :class="['h-fat__slider', { 'h-fat__slider--zero': modelValue === min }]"
      :aria-label="label"
      @update:model-value="onInput"
    />
    <q-icon
      v-if="currentIcon"
      :name="currentIcon"
      size="20px"
      :class="['h-fat__icon', { 'h-fat__icon--off': !iconCovered }]"
    />
  </div>
</template>

<script setup lang="ts">
// The fat M3 volume-style slider (§7 sliders) — a 56px track you drag by
// its whole body, for the controls the device lives on (speed, depth,
// volume). Vertical fills from the bottom; the symbol sits inside the
// track at the fill's origin. Its colour follows what's actually behind
// it: it keeps the on-fill white while the fill or the passing handle
// still touches it, and only goes muted once both are all the way clear
// of the glyph. `iconOff` swaps the symbol at zero (volume_up → volume_off).
import { computed, onMounted, onUnmounted, ref } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: number;
    /** accessible name — required, the control has no visible label */
    label: string;
    min?: number;
    max?: number;
    icon?: string;
    /** icon shown when the value sits at min; defaults to `icon` */
    iconOff?: string;
    vertical?: boolean;
    /** track length when vertical */
    height?: string;
  }>(),
  {
    min: 0,
    max: 100,
    icon: "",
    iconOff: "",
    vertical: false,
    height: "220px"
  }
);

const emit = defineEmits<{ "update:modelValue": [value: number] }>();

const currentIcon = computed(() =>
  props.modelValue === props.min && props.iconOff ? props.iconOff : props.icon
);

function onInput(value: number | null) {
  emit("update:modelValue", value ?? props.min);
}

// Icon coverage — the fill edge vs the icon's position. The icon spans
// 24–44px from the fill's origin; the flip lands at the middle of the
// glyph (34px): dragging down, the icon stays on-fill white through the
// handle pass and goes muted once the fill edge crosses its midpoint —
// tuned between "fully covered" (56) and "fully clear" (14).
const ICON_CLEARANCE = 34;

const rootEl = ref<HTMLElement | null>(null);
const trackLength = ref(0);
let resizeObserver: ResizeObserver | undefined;

function measure() {
  const el = rootEl.value;
  if (!el) return;
  trackLength.value = props.vertical ? el.clientHeight : el.clientWidth;
}

onMounted(() => {
  if (!rootEl.value) return;
  resizeObserver = new ResizeObserver(measure);
  resizeObserver.observe(rootEl.value);
  measure();
});

onUnmounted(() => resizeObserver?.disconnect());

const iconCovered = computed(() => {
  if (props.max <= props.min) return false;
  const fraction = (props.modelValue - props.min) / (props.max - props.min);
  return fraction * trackLength.value > ICON_CLEARANCE;
});

// fat-slider handle: a bar perpendicular to the track, at full length so it
// overhangs the 56px track ~6px each side, but kept thin — a 1.4-unit-thick
// stadium in the 20×20 viewBox at the 72px thumb, so it reads as a slim
// handle rather than a chunky block. One path per orientation.
const FAT_THUMB_V =
  "M1.2 9.3 H18.8 A0.7 0.7 0 0 1 19.5 10 A0.7 0.7 0 0 1 18.8 10.7 " +
  "H1.2 A0.7 0.7 0 0 1 0.5 10 A0.7 0.7 0 0 1 1.2 9.3 Z";
const FAT_THUMB_H =
  "M9.3 1.2 A0.7 0.7 0 0 1 10 0.5 A0.7 0.7 0 0 1 10.7 1.2 " +
  "V18.8 A0.7 0.7 0 0 1 10 19.5 A0.7 0.7 0 0 1 9.3 18.8 Z";
</script>

<style scoped lang="scss">
// inline-flex so the wrapper hugs the (inline) slider exactly — any
// line-box slack would push the absolutely-centered icon off the track
.h-fat {
  position: relative;
  display: inline-flex;
}

.h-fat--h {
  display: flex;
  align-items: center;
  width: 100%;
}

.h-fat--v .h-fat__slider {
  height: v-bind(height);
}

.h-fat--h .h-fat__slider {
  width: 100%;
}

// the symbol sits inside the track, at the fill's origin end (M3) —
// inset far enough that the handle at 0% never covers it
.h-fat__icon {
  position: absolute;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  color: var(--color-text-on-fill);
  pointer-events: none;
  transition: color 180ms ease;
}

.h-fat--h .h-fat__icon {
  left: 24px;
  bottom: auto;
  top: 50%;
  transform: translateY(-50%);
}

// the fill no longer covers the icon — it sits on the pale inactive
// track, so it trades white for the secondary ink to stay visible
.h-fat__icon--off {
  color: var(--color-text-secondary);
}

// at the 72px fat thumb the global 6-unit gap stroke would scale to
// ~11px — bring it back to the ~6px M3 gap
.h-fat__slider :deep(.q-slider__thumb-shape path) {
  stroke-width: 3.4;
}

// At exactly 0% the fill is gone, so the bare track shows its rounded cap
// on the handle side (at 100% the fill's flat-cut edge squares that end).
// Flatten just the handle-side corners at the extreme so 0% reads squared
// like 100% — the far end keeps the standard radius. (vertical sliders are
// `reverse` → handle at the bottom; horizontal → handle at the left.)
.h-fat--v .h-fat__slider--zero :deep(.q-slider__track) {
  border-radius: var(--radius-lg) var(--radius-lg) 2px 2px;
}

.h-fat--h .h-fat__slider--zero :deep(.q-slider__track) {
  border-radius: 2px var(--radius-lg) var(--radius-lg) 2px;
}

// press: same slim-on-use as every slider, but the vertical slider's bar is
// horizontal — slim its thickness (scaleY), not its length. The horizontal
// slider's bar is vertical, so the global scaleX rule already applies.
.h-fat--v .h-fat__slider.q-slider--active :deep(.q-slider__thumb-shape path) {
  transform: scaleY(0.55);
}
</style>
