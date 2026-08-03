<template>
  <q-page class="favorites-page">
    <div v-if="catalog.status === 'error'" class="h-section">
      <div class="h-container favorites-page__center">
        <HEmptyState
          icon="cloud_off"
          title="Couldn't load the catalog"
          body="The script index didn't answer. Check your connection and try again."
          action-label="Try again"
          @action="catalog.retry()"
        />
      </div>
    </div>

    <div v-else-if="catalog.status !== 'ready'" class="favorites-page__loading">
      <HandyLoader />
    </div>

    <div v-else class="h-section">
      <div class="h-container">
        <header class="favorites-page__header">
          <h1 class="text-h2 favorites-page__title">My favorites</h1>
          <p v-if="favorites.length" class="text-body-sm favorites-page__count">
            {{ countLabel }}
          </p>
        </header>

        <div v-if="!favorites.length" class="favorites-page__center">
          <HEmptyState
            icon="favorite"
            title="No favorites yet"
            body="Tap the heart button on any video page and it's saved here for quick access."
            action-label="Browse videos"
            @action="router.push('/videos')"
          />
        </div>
        <VideoGrid v-else :videos="favorites" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
// The favorites shelf as a full page: every hearted video, newest first.
// Favorites are intentionally ungated — they show regardless of the
// orientation/premium filters (see catalog.favorites).
import { computed } from "vue";
import { useRouter } from "vue-router";
import { HEmptyState, HandyLoader } from "@/components/handy";
import VideoGrid from "@/components/VideoGrid.vue";
import { recentFirst } from "@/services/script-index/queries";
import { useCatalogStore } from "@/stores/catalog";

const router = useRouter();
const catalog = useCatalogStore();

const favorites = computed(() => recentFirst(catalog.favorites));

const countLabel = computed(() => {
  const count = favorites.value.length;
  return count === 1 ? "1 video saved" : `${count} videos saved`;
});
</script>

<style scoped lang="scss">
.favorites-page {
  padding-bottom: var(--space-3xl);
}

.favorites-page__loading {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.favorites-page__center {
  display: flex;
  justify-content: center;
}

.favorites-page__header {
  margin-bottom: var(--space-lg);
}

.favorites-page__title {
  margin: 0;
}

.favorites-page__count {
  color: var(--color-text-tertiary);
  margin: var(--space-xs) 0 0;
}
</style>
