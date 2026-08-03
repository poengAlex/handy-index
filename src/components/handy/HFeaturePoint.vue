<template>
  <div class="h-feature-point">
    <q-icon :name="icon" :size="lg ? '40px' : '32px'" />
    <span
      :class="['h-feature-point__label', { 'h-feature-point__label--lg': lg }]"
      >{{ label }}</span
    >
  </div>
</template>

<script setup lang="ts">
// Feature point (brand playground): icon stacked above a short label —
// the presentational sibling of HIconTile, for feature-highlight rows on
// hero and product surfaces. Not interactive.
withDefaults(defineProps<{ icon: string; label: string; lg?: boolean }>(), {
  lg: false
});
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
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.14px;
  line-height: 1.35;
}

.h-feature-point__label--lg {
  font-size: 16px;
}
</style>
