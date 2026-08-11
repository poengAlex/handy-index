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
            <div class="performers-page__controls">
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
              <q-select
                v-model="sortKey"
                :options="SORT_OPTIONS"
                emit-value
                map-options
                filled
                dense
                aria-label="Sort performers"
                class="performers-page__sort"
              >
                <template #prepend>
                  <q-icon name="sort" />
                </template>
              </q-select>
              <q-btn
                flat
                round
                :icon="sortDir === 'desc' ? 'arrow_downward' : 'arrow_upward'"
                :aria-label="`Sorted ${sortDir === 'desc' ? 'descending' : 'ascending'} — reverse`"
                :title="`Sorted ${sortDir === 'desc' ? 'descending' : 'ascending'} — click to reverse`"
                class="performers-page__dir"
                @click="flipDir"
              />
            </div>

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
                body="Your filters and muted tags hide every performer. Loosen them in settings."
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
                    <span>{{ videoLabel(performer.count) }}</span>
                    <span
                      v-if="performer.avgRating"
                      class="performer-card__rating"
                    >
                      ★ {{ Math.round(performer.avgRating) }}%
                    </span>
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
import { computed, ref, watch } from "vue";
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

type SortKey = "count" | "rating" | "name";
type SortDir = "asc" | "desc";

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: "Most videos", value: "count" },
  { label: "Best rated", value: "rating" },
  { label: "A–Z", value: "name" }
];

// the direction each sort naturally produces; flipping away reverses the list
const NATURAL_DIR: Record<SortKey, SortDir> = {
  count: "desc",
  rating: "desc",
  name: "asc"
};

/** rated videos a performer needs before their average ranks at full weight —
 * same idea as the video vote floor, so one rated video can't top the list */
const RATED_VIDEO_FLOOR = 3;

const catalog = useCatalogStore();
const settings = useSettingsStore();

// clearable q-input emits null on clear
const query = ref<string | null>("");
const sortKey = ref<SortKey>("count");
const sortDir = ref<SortDir>(NATURAL_DIR[sortKey.value]);

// picking a new sort resets to that sort's natural direction
watch(sortKey, key => {
  sortDir.value = NATURAL_DIR[key];
});

function flipDir() {
  sortDir.value = sortDir.value === "desc" ? "asc" : "desc";
}

const all = computed(() =>
  catalog.status === "ready" ? performersOf(catalog.visible) : []
);

const needle = computed(() => (query.value ?? "").trim());

const filtered = computed(() => {
  const search = needle.value.toLowerCase();
  const matches = search
    ? all.value.filter(performer =>
        performer.name.toLowerCase().includes(search)
      )
    : all.value;
  let ordered: readonly PerformerSummary[];
  if (sortKey.value === "name") {
    ordered = [...matches].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortKey.value === "rating") {
    ordered = [...matches].sort((a, b) => {
      const aEstablished = a.ratedCount >= RATED_VIDEO_FLOOR;
      const bEstablished = b.ratedCount >= RATED_VIDEO_FLOOR;
      if (aEstablished !== bEstablished) return aEstablished ? -1 : 1;
      return b.avgRating - a.avgRating || b.count - a.count;
    });
  } else {
    ordered = matches; // performersOf is already count-desc
  }
  if (sortDir.value === NATURAL_DIR[sortKey.value]) return ordered;
  // copy before reversing — `ordered` can alias the performersOf result
  return [...ordered].reverse();
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

.performers-page__controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.performers-page__search {
  flex: 1 1 240px;
  max-width: 360px;
}

.performers-page__sort {
  min-width: 180px;
}

.performers-page__dir {
  color: var(--color-text-secondary);
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
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-xs);
}

.performer-card__rating {
  white-space: nowrap;
}
</style>
