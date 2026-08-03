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
  }>(),
  { title: "", videos: () => [], loading: false, to: "" }
);
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
