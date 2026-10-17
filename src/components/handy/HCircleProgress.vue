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
      :instant-feedback="instant"
      track-color="grey-3"
      rounded
      show-value
      :style="fill ? { '--ring-fill': fill } : undefined"
    >
      <slot>{{ centerText }}</slot>
    </q-circular-progress>
    <span v-if="caption" class="h-circle__caption">{{ caption }}</span>
  </div>
</template>

<script setup lang="ts">
// The one circular ring (skins Quasar's q-circular-progress): a determinate
// meter — Brand Blue arc on a pale track, rounded caps, value centered.
// Optional flavors, not modes: caption (label below), display (center text
// override), severity (a feedback colour for the arc). A "stat dial" is just
// a circular progress with a caption + severity. The determinate counterpart
// to the spinner (design.md 6.6, 6.7).
// Strokes bind to CSS tokens so they re-theme in dark mode.
//
// The ring animates as it FILLS and never as it empties — useForwardProgress
// owns that rule (and the first paint) for every determinate meter in the
// kit. It is suppressed here rather than in the pages, because every caller
// would otherwise have to know.
import { computed } from "vue";
import { useForwardProgress } from "./useForwardProgress";

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
    /** Arc in a feedback colour instead of Brand Blue. */
    severity?: "info" | "positive" | "warning" | "negative";
    /** @deprecated A free CSS colour; use `severity`. Still applied when
     *  `severity` is unset. */
    color?: string;
  }>(),
  { size: 96, stroke: 0, caption: "", display: "", color: "" }
);

const fill = computed(() =>
  props.severity ? `var(--color-feedback-${props.severity})` : props.color
);

// Bound to Quasar's `instant-feedback`: no transition while true, so the
// first paint and every decrease land instantly instead of unwinding.
const { instant } = useForwardProgress(() => props.value);

const thickness = computed(
  () => props.stroke || Math.max(3, Math.round(props.size * 0.085))
);
// Quasar renders a stroke of (thickness / 2) * size px, so the ratio is doubled
// to land on our intended px stroke — otherwise the ring draws at half width.
const thicknessRatio = computed(() => (thickness.value * 2) / props.size);
// never under 12px, the type scale's floor (design.md 5.3)
const valueFont = computed(() => Math.max(12, Math.round(props.size * 0.2)));
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
  gap: var(--space-2xs);
}

.h-circle__ring {
  // crisp the arc: force high-precision rendering and flatten Quasar's 3D
  // start-rotation to 2D so the SVG isn't rasterized into a low-res layer
  :deep(.q-circular-progress__svg) {
    shape-rendering: geometricPrecision;
    transform: rotate(-90deg) !important;
  }

  // Quasar draws the track only when a track-color is given (the template
  // passes one), and paints it in that colour's class; the token here wins
  // over both, so the track is the subtle stroke in every theme (design.md 6.7)
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
  font-size: var(--text-caption-size);
  font-weight: 500;
  color: var(--color-text-secondary);
  text-align: center;
}
</style>
