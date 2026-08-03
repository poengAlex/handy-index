<template>
  <button class="h-icon-tile" :disabled="disabled" @click="emit('click')">
    <q-icon :name="icon" size="32px" />
    <span class="h-icon-tile__label">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
// Icon tile (brand playground): clickable icon + label on a square
// tappable surface — app launchers, quick actions, category pickers.
// Interactive, unlike HFeaturePoint. Lay them out in the page's grid
// (2/3/4 columns); the tile just fills its cell.
withDefaults(
  defineProps<{ icon: string; label: string; disabled?: boolean }>(),
  { disabled: false }
);

const emit = defineEmits<{ click: [] }>();
</script>

<style scoped lang="scss">
.h-icon-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  aspect-ratio: 1 / 1;
  min-height: 120px;
  color: var(--color-text-primary);
  border: 0;
  cursor: pointer;
  text-align: center;
  font-family: var(--font-brand);
  transition:
    box-shadow 180ms ease,
    transform 120ms ease,
    background-color 120ms ease;

  &:hover {
    box-shadow: var(--shadow-sm);
  }

  &:active {
    transform: scale(0.98);
    background: var(--color-bg-page-alt);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.h-icon-tile__label {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.14px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
