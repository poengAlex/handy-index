<template>
  <div class="h-page-bar">
    <slot name="lead" />
    <div class="h-page-bar__title">
      <span class="text-h5 h-page-bar__text">{{ title }}</span>
      <slot name="suffix" />
    </div>
    <div v-if="$slots.actions" class="h-page-bar__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
// The page header (design.md 7.1): the way back or the menu, the page's title
// on the left, and at most a few icon actions on the right. It goes inside the
// app's own header, which owns the height, the glass and the safe area. On a
// phone a page starts right under it, with no second title in the page.
defineProps<{ title: string }>();
</script>

<style scoped lang="scss">
.h-page-bar {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  width: 100%;
  min-width: 0;
  min-height: 56px;

  @media (min-width: 600px) {
    min-height: 64px;
  }
}

.h-page-bar__title {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

// a title too long for the bar is cut, and the tail of the row keeps its place
.h-page-bar__text {
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.h-page-bar__actions {
  flex: none;
  display: flex;
  align-items: center;
  gap: var(--space-2xs);
}
</style>
