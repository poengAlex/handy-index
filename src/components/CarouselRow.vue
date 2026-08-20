<template>
  <section class="carousel-row">
    <div class="h-container">
      <div
        v-if="loading"
        class="carousel-row__title-skeleton"
        aria-hidden="true"
      />
      <h2 v-else class="text-h4 carousel-row__title">
        <router-link v-if="to" :to="to" class="carousel-row__link">
          {{ title }}
          <q-icon name="chevron_right" class="carousel-row__chevron" />
        </router-link>
        <template v-else>{{ title }}</template>
        <!-- sibling of the link on purpose: hovering the hint must not
             read as (or trigger) the see-all affordance -->
        <q-icon
          v-if="hint"
          name="help_outline"
          class="carousel-row__hint"
          tabindex="0"
          role="img"
          :aria-label="hint"
        >
          <q-tooltip max-width="280px">{{ hint }}</q-tooltip>
        </q-icon>
        <!-- likewise a sibling: a destructive action must never sit inside
             the see-all link's hit area -->
        <button
          v-if="clearLabel"
          type="button"
          class="carousel-row__clear"
          :aria-label="clearLabel"
          @click="emit('clear')"
        >
          <q-icon name="delete_outline" />
          <q-tooltip>{{ clearLabel }}</q-tooltip>
        </button>
      </h2>
    </div>
    <HPeekCarousel
      :items="videos"
      :skeleton="loading"
      item-width="clamp(240px, 72vw, 300px)"
    >
      <template #default="{ item }">
        <VideoCard :video="item" />
      </template>
    </HPeekCarousel>
  </section>
</template>

<script setup lang="ts">
// One Apple-TV-style shelf: row title aligned to the content gutter, then a
// full-bleed peek carousel of VideoCards (skeletons while loading). Give it
// `to` and the title becomes a see-all link with a chevron affordance.
import { HPeekCarousel } from "@/components/handy";
import VideoCard from "@/components/VideoCard.vue";
import type { PartnerVideo } from "@/services/script-index/types";

withDefaults(
  defineProps<{
    /** not needed while loading — the header shimmers instead */
    title?: string;
    videos?: PartnerVideo[];
    loading?: boolean;
    /** see-all destination; makes the header clickable */
    to?: string;
    /** shows a small help icon after the title carrying this tooltip.
     * `| undefined` keeps callers free to pass optional row fields straight
     * through under exactOptionalPropertyTypes */
    hint?: string | undefined;
    /** shows a small delete icon after the title carrying this tooltip;
     * pressing it emits `clear` for the parent to confirm and act on */
    clearLabel?: string | undefined;
  }>(),
  {
    title: "",
    videos: () => [],
    loading: false,
    to: "",
    hint: "",
    clearLabel: ""
  }
);

const emit = defineEmits<{
  /** the row's delete icon was pressed */
  clear: [];
}>();
</script>

<style scoped lang="scss">
.carousel-row__title {
  margin: 0 0 var(--space-sm);
  color: var(--color-text-primary);
}

// header placeholder while the shelf loads — same shimmer recipe as the
// kit's carousel skeleton, sized to the text-h4 line box
.carousel-row__title-skeleton {
  width: clamp(140px, 18vw, 220px);
  height: 28px;
  border-radius: var(--radius-xs);
  margin: 0 0 var(--space-sm);
  background-image: linear-gradient(
    90deg,
    var(--color-bg-page-alt) 25%,
    var(--color-stroke-subtle) 37%,
    var(--color-bg-page-alt) 63%
  );
  background-size: 220% 100%;
  animation: carousel-row-shimmer 1.4s ease infinite;
}

@keyframes carousel-row-shimmer {
  from {
    background-position: 220% 0;
  }
  to {
    background-position: -20% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .carousel-row__title-skeleton {
    animation: none;
  }
}

// deliberately small and tertiary: metadata about the row, not part of it
.carousel-row__hint {
  font-size: 18px;
  color: var(--color-text-tertiary);
  margin-left: var(--space-xs);
  cursor: help;
  outline: none;

  &:focus-visible {
    color: var(--color-text-link);
  }
}

// same tertiary weight as the hint — an affordance for the row, not a
// primary action; the danger colour only shows on hover/focus
.carousel-row__clear {
  display: inline-flex;
  align-items: center;
  // q-icon aligns itself `middle`; a bare inline-flex button would align on
  // its own baseline instead and sit a couple of pixels off the hint
  vertical-align: middle;
  line-height: 1;
  font-size: 18px;
  color: var(--color-text-tertiary);
  margin-left: var(--space-xs);
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  outline: none;
  transition: color 180ms ease;

  &:hover,
  &:focus-visible {
    color: var(--color-feedback-negative);
  }
}

.carousel-row__link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  color: inherit;
  text-decoration: none !important;
  transition: color 180ms ease;

  .carousel-row__chevron {
    color: var(--color-text-tertiary);
    transition:
      transform 180ms ease,
      color 180ms ease;
  }

  &:hover {
    color: var(--color-text-link);

    .carousel-row__chevron {
      color: var(--color-text-link);
      transform: translateX(2px);
    }
  }
}
</style>
