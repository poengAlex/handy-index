<template>
  <div class="h-feature-point">
    <q-icon :name="icon" :size="large ? '40px' : '32px'" />
    <span
      :class="[
        'h-feature-point__label',
        { 'h-feature-point__label--lg': large }
      ]"
      >{{ label }}</span
    >
  </div>
</template>

<script setup lang="ts">
// Feature point (brand playground): icon stacked above a short label —
// the presentational sibling of HIconTile, for feature-highlight rows on
// hero and product surfaces. Not interactive.
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    icon: string;
    label: string;
    /** md: 32px icon, 14px label. lg: 40px icon, 16px label. */
    size?: "md" | "lg";
    /** @deprecated Use `size="lg"`, the kit's sizing prop. */
    lg?: boolean;
  }>(),
  { size: "md", lg: false }
);

const large = computed(() => props.size === "lg" || props.lg);
</script>

<style scoped lang="scss">
.h-feature-point {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  color: var(--color-text-primary);
  text-align: center;
  max-width: 220px;
}

.h-feature-point__label {
  font-size: var(--text-body-sm-size);
  font-weight: 500;
  letter-spacing: -0.14px;
  line-height: 1.35;
}

.h-feature-point__label--lg {
  font-size: var(--text-body-size);
}
</style>
