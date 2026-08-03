<template>
  <div :class="['h-btngroup', `h-btngroup--${layout}`]">
    <slot />
  </div>
</template>

<script setup lang="ts">
// Proposed spec for the ButtonsContainer gap: the three button layouts.
// inline — right-aligned row (dialogs, card actions; primary sits last)
// equal  — full-width pair sharing the row 50/50 (confirmations)
// stack  — full-width column, strongest action on top (mobile sheets)
// The one-primary rule (§7) applies inside every layout.
withDefaults(defineProps<{ layout?: "inline" | "equal" | "stack" }>(), {
  layout: "inline"
});
</script>

<style scoped lang="scss">
.h-btngroup {
  display: flex;
  gap: var(--space-sm);
  width: 100%;
}

.h-btngroup--inline {
  justify-content: flex-end;
  flex-wrap: wrap;
}

.h-btngroup--equal > :deep(*) {
  flex: 1;
}

.h-btngroup--stack {
  flex-direction: column;
  align-items: stretch;
}
</style>
