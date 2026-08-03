<template>
  <q-page class="performers-page">
    <div class="h-section">
      <div class="h-container">
        <div v-if="catalog.status === 'error'" class="performers-page__center">
          <HEmptyState
            icon="cloud_off"
            title="Couldn't load performers"
            body="The script index didn't answer. Check your connection and try again."
            action-label="Try again"
            @action="catalog.retry()"
          />
        </div>

        <template v-else>
          <header class="performers-page__header">
            <h1 class="text-h2 performers-page__title">Performers</h1>
            <p
              v-if="catalog.status === 'ready'"
              class="text-body-sm performers-page__count"
            >
              {{ countLabel }}
            </p>
          </header>

          <div
            v-if="catalog.status !== 'ready'"
            class="performers-page__center"
          >
            <HandyLoader />
          </div>

          <template v-else>
            <q-input
              v-model="query"
              filled
              dense
              clearable
              debounce="300"
              placeholder="Search performers"
              aria-label="Search performers by name"
              class="performers-page__search"
            >
              <template #prepend>
                <q-icon name="search" />
              </template>
            </q-input>

            <div v-if="!filtered.length" class="performers-page__center">
              <HEmptyState
                v-if="needle"
                icon="person_search"
                title="No performers match"
                :body="`Nothing in the index matches “${needle}”. Try a shorter name.`"
                action-label="Clear search"
                @action="query = ''"
              />
              <HEmptyState
                v-else
                icon="filter_alt_off"
                title="Nothing to show"
                body="Your orientation and premium filters hide every performer. Loosen them in settings."
              />
            </div>

            <template v-else>
              <div class="performers-page__grid">
                <TileCard
                  v-for="performer in shown"
                  :key="performer.performerId"
                  :to="performerTo(performer)"
                  aspect="1 / 1"
                  :aria-label="performer.name"
                >
                  <template #media>
                    <MediaImage
                      v-if="settings.nsfw && performer.avatar"
                      :src="performer.avatar"
                      :alt="performer.name"
                      class="tile-card__img"
                    />
                    <div v-else class="tile-card__placeholder">
                      <q-icon name="person" size="32px" />
                    </div>
                  </template>
                  <div class="text-body-compact performer-card__name">
                    {{ performer.name }}
                  </div>
                  <div class="text-caption performer-card__videos">
                    {{ videoLabel(performer.count) }}
                  </div>
                </TileCard>
              </div>

              <div
                v-if="!done"
                ref="sentinel"
                class="performers-page__sentinel"
              />
            </template>
          </template>
        </template>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
// Every performer in the visible catalog as a square avatar card, biggest
// filmography first. Name search narrows the list; cards reveal 48 at a time
// via endless scroll. Cards link into /videos pre-filtered on the performer.
import { computed, ref } from "vue";
import { HEmptyState, HandyLoader } from "@/components/handy";
import MediaImage from "@/components/MediaImage.vue";
import TileCard from "@/components/TileCard.vue";
import { useIncrementalReveal } from "@/composables/useIncrementalReveal";
import {
  performersOf,
  type PerformerSummary
} from "@/services/script-index/queries";
import { useCatalogStore } from "@/stores/catalog";
import { useSettingsStore } from "@/stores/settings";

const PAGE_SIZE = 48;

const catalog = useCatalogStore();
const settings = useSettingsStore();

// clearable q-input emits null on clear
const query = ref<string | null>("");

const all = computed(() =>
  catalog.status === "ready" ? performersOf(catalog.visible) : []
);

const needle = computed(() => (query.value ?? "").trim());

const filtered = computed(() => {
  const search = needle.value.toLowerCase();
  if (!search) return all.value;
  return all.value.filter(performer =>
    performer.name.toLowerCase().includes(search)
  );
});

const { shown, done, sentinel } = useIncrementalReveal(filtered, PAGE_SIZE);

const countLabel = computed(() => {
  const total = all.value.length;
  const totalLabel = `${total.toLocaleString()} performer${total === 1 ? "" : "s"}`;
  return needle.value
    ? `${filtered.value.length.toLocaleString()} of ${totalLabel}`
    : totalLabel;
});

function videoLabel(count: number): string {
  return `${count.toLocaleString()} video${count === 1 ? "" : "s"}`;
}

function performerTo(performer: PerformerSummary): string {
  const id = encodeURIComponent(performer.performerId);
  const name = encodeURIComponent(performer.name);
  return `/videos?performerId=${id}&performerName=${name}`;
}
</script>

<style scoped lang="scss">
.performers-page {
  padding-bottom: var(--space-3xl);
}

.performers-page__header {
  margin-bottom: var(--space-md);
}

.performers-page__title {
  margin: 0;
}

.performers-page__count {
  color: var(--color-text-tertiary);
  margin: var(--space-xs) 0 0;
}

.performers-page__search {
  max-width: 360px;
  margin-bottom: var(--space-md);
}

.performers-page__center {
  min-height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.performers-page__grid {
  display: grid;
  gap: var(--space-sm);
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
}

.performers-page__sentinel {
  height: 1px;
}

.performer-card__name {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  min-height: 2.66em; // two compact lines, so cards in a row stay equal
}

.performer-card__videos {
  color: var(--color-text-tertiary);
}
</style>
