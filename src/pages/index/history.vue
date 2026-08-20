<template>
  <q-page class="history-page">
    <div v-if="catalog.status === 'error'" class="h-section">
      <div class="h-container history-page__center">
        <HEmptyState
          icon="cloud_off"
          title="Couldn't load the catalog"
          body="The script index didn't answer. Check your connection and try again."
          action-label="Try again"
          @action="catalog.retry()"
        />
      </div>
    </div>

    <div v-else-if="catalog.status !== 'ready'" class="history-page__loading">
      <HandyLoader />
    </div>

    <div v-else class="h-section">
      <div class="h-container">
        <header class="history-page__header">
          <h1 class="text-h2 history-page__title">Recently viewed</h1>
          <p class="text-body-sm history-page__note">
            {{ countLabel }}Only stored in this browser — your viewing history
            is never tracked or sent anywhere.
          </p>
        </header>

        <div v-if="!viewed.length" class="history-page__center">
          <HEmptyState
            icon="history"
            title="Nothing viewed yet"
            body="Videos you open are remembered here, on this device only."
            action-label="Browse videos"
            @action="router.push('/videos')"
          />
        </div>
        <VideoGrid v-else :videos="viewed" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
// Viewing history as a full page: everything recordView remembered, newest
// first. Same gating stance as the home row (see its comment): the full
// catalog on purpose, with muted tags as the only filter. The ids live in
// this browser's storage and are never sent anywhere — the header says so.
import { computed } from "vue";
import { useRouter } from "vue-router";
import { HEmptyState, HandyLoader } from "@/components/handy";
import VideoGrid from "@/components/VideoGrid.vue";
import { hasMutedTag, inOrder } from "@/services/script-index/queries";
import { useCatalogStore } from "@/stores/catalog";
import { useSettingsStore } from "@/stores/settings";

const router = useRouter();
const catalog = useCatalogStore();
const settings = useSettingsStore();

const viewed = computed(() =>
  inOrder(catalog.videos, settings.recentlyViewed).filter(
    video => !hasMutedTag(video, settings.mutedSet)
  )
);

const countLabel = computed(() => {
  const count = viewed.value.length;
  if (!count) return "";
  return `${count === 1 ? "1 video" : `${count} videos`} · `;
});
</script>

<style scoped lang="scss">
.history-page {
  padding-bottom: var(--space-3xl);
}

.history-page__loading {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.history-page__center {
  display: flex;
  justify-content: center;
}

.history-page__header {
  margin-bottom: var(--space-lg);
}

.history-page__title {
  margin: 0;
}

.history-page__note {
  color: var(--color-text-tertiary);
  margin: var(--space-xs) 0 0;
}
</style>
