<template>
  <span class="h-chip">
    <q-icon v-if="icon" :name="icon" size="16px" />
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup lang="ts">
// Annotation chip (§7): a quiet, factual pill tag for product hero shots
// and spec rows. Its background rides --h-chip-bg, which each surface
// scope re-declares (app.scss) so a chip never blends into its backdrop —
// Soft Gray on white, translucent white on dark, card-white on Soft Gray.
withDefaults(defineProps<{ label?: string; icon?: string }>(), {
  label: "",
  icon: ""
});
</script>

<style scoped lang="scss">
.h-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  background: var(--h-chip-bg);
  color: var(--color-text-primary);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.14px;
}
</style>
