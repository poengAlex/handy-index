<template>
  <div class="h-circle" :class="{ 'h-circle--captioned': caption }">
    <q-circular-progress
      class="h-circle__ring"
      :value="value"
      :min="0"
      :max="100"
      :size="`${size}px`"
      :thickness="thicknessRatio"
      :font-size="`${valueFont}px`"
      rounded
      show-value
      :style="color ? { '--ring-fill': color } : undefined"
    >
      <slot>{{ centerText }}</slot>
    </q-circular-progress>
    <span v-if="caption" class="h-circle__caption">{{ caption }}</span>
  </div>
</template>

<script setup lang="ts">
// The one circular ring (skins Quasar's q-circular-progress): a determinate
// meter — Brand Blue arc on a hairline track, rounded caps, value centered.
// Optional flavors, not modes: caption (label below), display (center text
// override), color (semantic arc fill). A "stat dial" is just a circular
// progress with a caption + color. §9's determinate counterpart to the spinner.
// Strokes bind to CSS tokens so they re-theme in dark mode.
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    value: number;
    /** diameter in px */
    size?: number;
    /** track/arc width in px; defaults proportional to size */
    stroke?: number;
    /** caption below the ring */
    caption?: string;
    /** center text override; defaults to "{value}%" */
    display?: string;
    /** CSS color for the arc, e.g. var(--color-feedback-positive) */
    color?: string;
  }>(),
  { size: 96, stroke: 0, caption: "", display: "", color: "" }
);

const thickness = computed(
  () => props.stroke || Math.max(3, Math.round(props.size * 0.085))
);
// Quasar renders a stroke of (thickness / 2) * size px, so the ratio is doubled
// to land on our intended px stroke — otherwise the ring draws at half width.
const thicknessRatio = computed(() => (thickness.value * 2) / props.size);
const valueFont = computed(() => Math.max(11, Math.round(props.size * 0.2)));
const centerText = computed(
  () => props.display || `${Math.round(props.value)}%`
);
</script>

<style scoped lang="scss">
.h-circle {
  display: inline-flex;
  color: var(--color-text-primary);
}

.h-circle--captioned {
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.h-circle__ring {
  // crisp the arc: force high-precision rendering and flatten Quasar's 3D
  // start-rotation to 2D so the SVG isn't rasterized into a low-res layer
  :deep(.q-circular-progress__svg) {
    shape-rendering: geometricPrecision;
    transform: rotate(-90deg) !important;
  }

  :deep(.q-circular-progress__track) {
    stroke: var(--color-stroke-subtle);
  }

  :deep(.q-circular-progress__circle) {
    stroke: var(--ring-fill, var(--color-action-primary));
  }

  :deep(.q-circular-progress__text) {
    color: var(--color-text-primary);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
  }
}

.h-circle__caption {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-align: center;
}
</style>
