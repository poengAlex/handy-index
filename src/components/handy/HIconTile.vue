<template>
  <button
    type="button"
    class="h-icon-tile"
    :disabled="disable || disabled"
    @click="emit('click')"
  >
    <q-icon :name="icon" size="32px" />
    <span class="h-icon-tile__label">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
// Icon tile (brand playground): clickable icon + label on a square
// tappable surface — app launchers, quick actions, category pickers.
// Interactive, unlike HFeaturePoint. Lay them out in the page's grid
// (2/3/4 columns); the tile just fills its cell. `type="button"`, or a tile
// inside a form would submit it.
withDefaults(
  defineProps<{
    icon: string;
    label: string;
    disable?: boolean;
    /** @deprecated The kit's name is `disable`, as on every other control. */
    disabled?: boolean;
  }>(),
  { disable: false, disabled: false }
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
  // square, but never shorter than its content: a fixed min-height would
  // replace the content-based minimum an aspect-ratio box gets for free, and
  // on a narrow tile the two-line label was squeezed and sliced in half
  aspect-ratio: 1 / 1;
  color: var(--color-text-primary);
  border: 0;
  cursor: pointer;
  text-align: center;
  font-family: var(--font-brand);
  transition:
    box-shadow 180ms ease,
    transform 120ms ease,
    background-color 120ms ease;

  @media (hover: hover) {
    &:hover {
      box-shadow: var(--shadow-md);
    }
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

// On a phone a square takes its height from the width, 160px and up, and a
// two-line label keeps it from going narrower than about 136px, so it left a
// narrow card. There it sizes to its content, and a grid can hold three or four.
@media (max-width: 599.98px) {
  .h-icon-tile {
    aspect-ratio: auto;
    min-height: 88px;
    min-width: 0;
    gap: var(--space-xs);
    padding: var(--space-sm) var(--space-2xs) 12px;

    :deep(.q-icon) {
      font-size: 24px !important;
    }
  }

  .h-icon-tile__label {
    font-size: var(--text-caption-size) !important;
    letter-spacing: 0 !important;
  }
}

.h-icon-tile__label {
  font-size: var(--text-body-sm-size);
  font-weight: 500;
  letter-spacing: -0.14px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

<style lang="scss">
// Shadows don't read on dark, so the light-mode hover lift is invisible
// there. On dark, hover lifts via a hairline outline instead (the dark-mode
// "separation is surface/stroke, not shadow" rule) — the same treatment
// HNavCard gets, for the same reason.
@media (hover: hover) {
  [data-theme="dark"] .h-icon-tile:hover,
  .section-dark .h-icon-tile:hover {
    box-shadow: inset 0 0 0 1px var(--color-stroke-default);
  }
}
</style>
