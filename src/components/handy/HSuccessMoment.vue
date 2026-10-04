<template>
  <div class="h-success" :class="{ 'h-success--drawn': drawn }" :style="style">
    <HSuccessMark v-if="drawn" :size="44" :duration="duration" />
    <q-icon v-else :name="icon" size="40px" class="h-success__icon" />
    <div class="text-h3 h-success__title">{{ title }}</div>
    <p v-if="body || $slots.default" class="text-body-sm h-success__sub">
      <slot>{{ body }}</slot>
    </p>
  </div>
</template>

<script setup lang="ts">
// The trademark success register (§2): two words where four would do —
// "You're welcome." after purchase, "Connected." after pairing. A green
// check, a short bold title, one quiet sub-line.
//
// The check is HSuccessMark by default — the system's one completion
// animation — with the words rising in behind the tick. Pass an `icon` for a
// success that isn't a check (it renders static), or `:animated="false"` to
// keep the check but drop the draw. The mark plays on mount, so to replay it
// (a demo, a step re-run) change the component's `:key`.
import { computed } from "vue";
import HSuccessMark from "./HSuccessMark.vue";

const props = withDefaults(
  defineProps<{
    title: string;
    body?: string;
    /** A non-check success symbol. Given, it renders static in place of the
     * drawn mark. */
    icon?: string;
    animated?: boolean;
    /** Total beat in ms, shared by the mark and the rising words. */
    duration?: number;
  }>(),
  { body: "", icon: "", animated: true, duration: 900 }
);

const drawn = computed(() => props.animated && !props.icon);
const icon = computed(() => props.icon || "check_circle");
const style = computed(() =>
  drawn.value ? { "--h-success-beat": `${props.duration}ms` } : undefined
);
</script>

<style scoped lang="scss">
.h-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-xs);
  padding: var(--space-lg);
  width: 100%;
}

.h-success__icon {
  color: var(--color-feedback-positive);
}

.h-success__sub {
  color: var(--color-text-secondary);
  margin: 0;
}

// the words arrive on the tick, not before it — same beat as the mark
.h-success--drawn {
  --rise-delay: calc(var(--h-success-beat) * 0.56);
  --rise: calc(var(--h-success-beat) * 0.48);

  .h-success__title,
  .h-success__sub {
    opacity: 0;
    animation: h-success-rise var(--rise) ease-out var(--rise-delay) forwards;
  }
}

@keyframes h-success-rise {
  0% {
    opacity: 0;
    transform: translateY(6px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .h-success--drawn {
    .h-success__title,
    .h-success__sub {
      animation: none;
      opacity: 1;
    }
  }
}
</style>
