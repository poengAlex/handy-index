<template>
  <svg
    class="h-mark"
    :style="style"
    viewBox="0 0 52 52"
    aria-hidden="true"
    focusable="false"
  >
    <!-- pathLength=1 normalises both shapes, so one keyframe draws a circle
         and a tick of quite different real lengths -->
    <circle class="h-mark__ring" cx="26" cy="26" r="23" pathLength="1" />
    <path
      class="h-mark__tick"
      d="M15 27 L22.5 34.5 L37.5 18.5"
      pathLength="1"
    />
  </svg>
</template>

<script setup lang="ts">
// The system's one "that landed" mark: a ring that draws itself, then a tick
// that draws inside it. Use it wherever a step, stage or task completes, so
// completion looks the same everywhere instead of each screen inventing its
// own check. (It had a filled halo flashing in as the tick started; it read
// as a button being pressed and was removed on the owner's review,
// 2026-10-13.)
//
// It is decoration (aria-hidden) — the words beside it carry the meaning, and
// under prefers-reduced-motion it arrives already drawn.
//
// Timing: `duration` is the WHOLE beat, and every phase is a fraction of it,
// so a host that must close in 600ms passes 600 and gets a shorter animation
// rather than a truncated one. Colour follows --color-feedback-positive;
// override per instance with --h-mark-color.
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    /** Rendered size in px (the viewBox is square). */
    size?: number;
    /** Total draw time in ms — every phase scales to it. */
    duration?: number;
  }>(),
  { size: 52, duration: 900 }
);

const style = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  "--h-mark-duration": `${props.duration}ms`
}));
</script>

<style scoped lang="scss">
.h-mark {
  flex-shrink: 0;
  // the phases, as fractions of the whole beat: the ring draws over the first
  // 0.65, and the tick draws inside it from 0.56 to the end, finishing on
  // `duration`
  --mark-ring: calc(var(--h-mark-duration) * 0.65);
  --mark-delay: calc(var(--h-mark-duration) * 0.56);
  --mark-tick: calc(var(--h-mark-duration) * 0.44);
}

.h-mark__ring,
.h-mark__tick {
  fill: none;
  stroke: var(--h-mark-color, var(--color-feedback-positive));
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  // normalised by pathLength=1, so one keyframe draws both
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: h-mark-draw var(--mark-ring) ease-out forwards;
}

.h-mark__tick {
  animation: h-mark-draw var(--mark-tick) ease-out var(--mark-delay) forwards;
}

@keyframes h-mark-draw {
  to {
    stroke-dashoffset: 0;
  }
}

// Reduced motion: the mark still appears, it just arrives finished. The draw
// is the decoration; the state it lands on is the information.
@media (prefers-reduced-motion: reduce) {
  .h-mark__ring,
  .h-mark__tick {
    animation: none;
    stroke-dashoffset: 0;
  }
}
</style>
