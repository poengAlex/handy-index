<template>
  <q-list :class="['h-list', { 'h-list--separated': separated }]">
    <div v-if="title" class="text-h5 h-list__title">{{ title }}</div>
    <slot />
  </q-list>
</template>

<script setup lang="ts">
// The grouped-list card (Cards → Card rules, row-list form). Default: one
// card, rows hairline-divided. `separated`: each row on its own card with a
// gap. Holds HListRow children. Title follows the same h5 rule as InfoCard.
withDefaults(defineProps<{ title?: string; separated?: boolean }>(), {
  title: "",
  separated: false
});
</script>

<style scoped lang="scss">
.h-list {
  width: 100%;
  padding: 0;
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

// title follows the InfoCard rule — h5, 24px inset, 16px beneath
.h-list__title {
  padding: var(--space-md) var(--space-md) var(--space-sm);
  color: var(--color-text-primary);
}

// inset hairline between adjacent rows — aligned to the 24px content margin,
// never full-bleed, so it can't cross the card's rounded corners (matches the
// InfoCard divider). Drawn on the lower row's top edge.
.h-list :deep(.h-list-row + .h-list-row)::before {
  content: "";
  position: absolute;
  top: 0;
  left: var(--space-md);
  right: var(--space-md);
  height: 1px;
  background: var(--color-stroke-subtle);
}

// separated: no card on the list itself — each row becomes its own card,
// stacked with a gap, and the dividers go away
.h-list--separated {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  background: transparent;
  border-radius: 0;
  overflow: visible;
}

.h-list--separated :deep(.h-list-row) {
  min-height: 56px;
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.h-list--separated :deep(.h-list-row + .h-list-row)::before {
  display: none;
}
</style>
