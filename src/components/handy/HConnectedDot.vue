<template>
  <span :class="['h-cdot', { 'h-cdot--off': !live }]" />
</template>

<script setup lang="ts">
// Connected-state LED (design.md §13). A purple presence dot that pulses
// while live — purple is the *connected color*, the same Oculus Purple as
// the device's hardware LED when it's linked to our online services, so the
// UI mirrors the device. Flat grey when offline; "connected" reads as the
// brighter state. The pulse honours prefers-reduced-motion.
withDefaults(
  defineProps<{
    live?: boolean;
    /** dot diameter in px */
    size?: number;
  }>(),
  { live: true, size: 8 }
);
</script>

<style scoped lang="scss">
.h-cdot {
  display: inline-block;
  width: calc(v-bind(size) * 1px);
  height: calc(v-bind(size) * 1px);
  border-radius: 50%;
  flex-shrink: 0;
  background: var(--color-accent);
  animation: h-cdot-pulse 1.8s ease-out infinite;
}

.h-cdot--off {
  background: var(--color-text-tertiary);
  animation: none;
}

@keyframes h-cdot-pulse {
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-accent) 45%, transparent);
  }

  70% {
    box-shadow: 0 0 0 7px
      color-mix(in srgb, var(--color-accent) 0%, transparent);
  }

  100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-accent) 0%, transparent);
  }
}

@media (prefers-reduced-motion: reduce) {
  .h-cdot {
    animation: none;
  }
}
</style>
