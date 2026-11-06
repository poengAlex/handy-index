<template>
  <div class="h-dock" :class="{ 'h-dock--inline': inline }">
    <div class="h-dock__bar">
      <slot />
      <HBtn
        v-if="$slots.more"
        variant="secondary"
        round
        icon="more_vert"
        :aria-label="kitLabel('more')"
        class="h-dock__more"
      >
        <q-menu anchor="top right" self="bottom right">
          <q-list><slot name="more" /></q-list>
        </q-menu>
      </HBtn>
    </div>
  </div>
</template>

<script setup lang="ts">
// The action dock (design.md 6.3): on a phone a tool page's main actions stay
// on screen, fixed to the bottom edge in thumb reach, with a "more" menu for
// everything else. Above a phone it is an ordinary row in the page. The body
// keeps the bar's height free, so the last of the page scrolls clear of it.
// `inline` keeps it in the page on a phone too, for a demo.
import HBtn from "./HBtn.vue";
import { kitLabel } from "./labels";

defineProps<{ inline?: boolean }>();
</script>

<style scoped lang="scss">
.h-dock__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-xs);
}

.h-dock--inline .h-dock__bar {
  flex-wrap: nowrap;
}

// round whatever the row does: min-width below would squeeze it into an oval
.h-dock__more {
  flex: none;
  min-width: 44px !important;
  width: 44px;
  height: 44px;
}

.h-dock--inline .h-dock__bar > :deep(*),
.h-dock__bar > :deep(*) {
  min-width: 0;
}

.h-dock--inline .h-dock__bar > :deep(.h-btn:not(.h-dock__more)) {
  flex: 1 1 0;
}

@media (max-width: 599.98px) {
  .h-dock__bar > :deep(.h-btn:not(.h-dock__more)) {
    padding-inline: var(--space-sm);
  }

  // no box in the page, so it leaves no gap in the card it was written in
  .h-dock:not(.h-dock--inline) {
    display: contents;

    .h-dock__bar {
      position: fixed;
      inset: auto 0 0;
      z-index: 100;
      flex-wrap: nowrap;
      padding: 12px var(--page-gutter)
        calc(var(--space-sm) + env(safe-area-inset-bottom, 0px));
      background: var(--color-bg-card);
      border-radius: var(--radius-lg) var(--radius-lg) 0 0;
      box-shadow: var(--shadow-lg);
    }

    .h-dock__bar > :deep(.h-btn:not(.h-dock__more)) {
      flex: 1 1 0;
    }
  }
}
</style>

<style lang="scss">
@media (max-width: 599.98px) {
  body:has(.h-dock:not(.h-dock--inline)) {
    padding-bottom: calc(72px + env(safe-area-inset-bottom, 0px));
  }
}
</style>
