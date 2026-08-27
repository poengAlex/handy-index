<template>
  <q-page class="history-page">
    <div v-if="catalog.status === 'error'" class="h-section">
      <div class="h-container history-page__center">
        <HEmptyState
          icon="cloud_off"
          :title="$t('common.state.catalogErrorTitle')"
          :body="$t('common.state.catalogErrorBody')"
          :action-label="$t('common.action.retry')"
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
          <h1 class="text-h2 history-page__title">
            {{ $t("library.history.title") }}
          </h1>
          <!-- the count is its own dot-separated item, not part of the note
               sentence: word order around it differs per language -->
          <p class="text-body-sm history-page__note">
            <template v-if="viewed.length">
              {{ countLabel }}<span aria-hidden="true"> · </span>
            </template>
            {{ $t("library.history.note") }}
            <template v-if="viewed.length">
              <span aria-hidden="true"> · </span>
              <button
                type="button"
                class="history-page__clear"
                @click="clearOpen = true"
              >
                {{ $t("common.action.clear") }}
              </button>
            </template>
          </p>
        </header>

        <div v-if="!viewed.length" class="history-page__center">
          <HEmptyState
            icon="history"
            :title="$t('library.history.emptyTitle')"
            :body="$t('library.history.emptyBody')"
            :action-label="$t('common.action.browseVideos')"
            @action="router.push('/videos')"
          />
        </div>
        <VideoGrid v-else :videos="viewed" />
      </div>
    </div>

    <!-- one click from the header, so it asks first (same as the home shelf) -->
    <q-dialog v-model="clearOpen">
      <HModal :title="$t('library.history.clearTitle')">
        {{ $t("library.history.clearBody") }}
        <template #actions>
          <HBtn
            variant="tertiary"
            :label="$t('common.action.cancel')"
            @click="clearOpen = false"
          />
          <HBtn
            variant="danger"
            :label="$t('library.history.clearConfirm')"
            @click="clearHistory"
          />
        </template>
      </HModal>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
// Viewing history as a full page: everything recordView remembered, newest
// first. Same gating stance as the home row (see its comment): the full
// catalog on purpose, with muted tags as the only filter. The ids live in
// this browser's storage and are never sent anywhere — the header says so.
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {
  HBtn,
  HEmptyState,
  HModal,
  HandyLoader,
  hToast
} from "@/components/handy";
import VideoGrid from "@/components/VideoGrid.vue";
import { useFormat } from "@/composables/useFormat";
import { hasMutedTag, inOrder } from "@/services/script-index/queries";
import { useCatalogStore } from "@/stores/catalog";
import { useSettingsStore } from "@/stores/settings";

const router = useRouter();
const catalog = useCatalogStore();
const settings = useSettingsStore();
const { t } = useI18n();
const format = useFormat();

const viewed = computed(() =>
  inOrder(catalog.videos, settings.recentlyViewed).filter(
    video => !hasMutedTag(video, settings.mutedSet)
  )
);

const clearOpen = ref(false);

function clearHistory(): void {
  clearOpen.value = false;
  settings.clearRecentlyViewed();
  hToast("info", t("library.history.clearedToast"));
}

const countLabel = computed(() => format.count("videos", viewed.value.length));
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

// a link, not a button shape: it sits at the end of the note sentence
.history-page__clear {
  border: 0;
  background: none;
  padding: 0;
  font: inherit;
  color: var(--color-text-link);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
}
</style>
