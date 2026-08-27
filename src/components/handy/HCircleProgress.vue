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
//
// The ring animates as it FILLS and never as it empties. Quasar transitions
// stroke-dashoffset in both directions, so a meter reset to 0 unwinds
// backwards for the length of the animation before it starts again — which
// reads as "something just finished and is being undone", the opposite of
// "starting". The same transition on the very first paint sweeps the ring in
// from empty before the page has settled. Both are suppressed here rather
// than in the pages, because every caller would otherwise have to know.
import { computed, onMounted, ref, watch } from "vue";

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

// Quasar's transition is off while this is true. It starts true so the first
// paint lands at its value, and goes off again for one PAINTED frame whenever
// the value drops — a decrease is a reset or a re-measure, not a thing to
// watch unwind.
const instant = ref(true);

onMounted(() => {
  instant.value = false;
});

/**
 * Restore the transition only after the browser has actually drawn a frame
 * without it.
 *
 * nextTick is not enough, and this is the whole trick: it runs before paint,
 * so the transition would be removed and put back inside a single frame — the
 * compositor never sees it go, and animates the drop anyway. Two rAFs is the
 * shortest wait that guarantees one composited frame in between.
 */
function restoreAfterPaint() {
  if (typeof requestAnimationFrame !== "function") {
    instant.value = false;
    return;
  }
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      instant.value = false;
    });
  });
}

// `flush: "pre"` (the default) matters here too — the watcher has to set the
// flag BEFORE this component re-renders, or the render that carries the new
// value still carries the transition with it.
watch(
  () => props.value,
  (next, previous) => {
    if (next >= previous) return;
    instant.value = true;
    restoreAfterPaint();
  }
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
