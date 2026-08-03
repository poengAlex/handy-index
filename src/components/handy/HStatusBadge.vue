<template>
  <span :class="['h-status', `h-status--${severity}`]">
    <q-icon v-if="icon" :name="icon" size="14px" />
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup lang="ts">
// Status badge (brand playground §7): small semantic pill on a 12–18%
// tinted fill of its own feedback color. The label/icon use the text-tier
// token for each severity (not the raw feedback color) so they stay legible
// on the pale tint in both themes — full-strength warning yellow on a yellow
// tint fails contrast on light (icons-vs-text rule).
withDefaults(
  defineProps<{
    severity?: "positive" | "negative" | "warning" | "info";
    label?: string;
    icon?: string;
  }>(),
  { severity: "info", label: "", icon: "" }
);
</script>

<style scoped lang="scss">
.h-status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
}

// tints derive from the feedback tokens so a palette change carries through
.h-status--positive {
  background: color-mix(
    in srgb,
    var(--color-feedback-positive) 15%,
    transparent
  );
  color: var(--color-text-success);
}

.h-status--negative {
  background: color-mix(
    in srgb,
    var(--color-feedback-negative) 15%,
    transparent
  );
  color: var(--color-text-error);
}

.h-status--warning {
  background: color-mix(
    in srgb,
    var(--color-feedback-warning) 18%,
    transparent
  );
  color: var(--color-text-warning);
}

.h-status--info {
  background: color-mix(in srgb, var(--color-feedback-info) 12%, transparent);
  color: var(--color-text-link);
}
</style>
