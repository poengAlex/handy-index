<template>
  <span class="h-dots" aria-hidden="true"><span /><span /><span /></span>
</template>

<script setup lang="ts">
// Tier-1 loading (§9): the trailing "…" of the preceding word, pulsing.
// Inline-flex so it rides the text baseline — write "Connecting" and put
// this right after it. Decorative, so it's aria-hidden and goes static
// under prefers-reduced-motion (an essential indicator would not).
</script>

<style scoped lang="scss">
.h-dots {
  display: inline-flex;
  gap: 0.15em;
  vertical-align: baseline;
  margin-left: 0.1em;
}

.h-dots span {
  display: inline-block;
  animation: h-dots-pulse 1.2s infinite ease-in-out;

  &::before {
    content: ".";
  }

  &:nth-child(2) {
    animation-delay: 0.15s;
  }

  &:nth-child(3) {
    animation-delay: 0.3s;
  }
}

@keyframes h-dots-pulse {
  0%,
  80%,
  100% {
    opacity: 0.25;
  }

  40% {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .h-dots span {
    animation: none;
  }
}
</style>
