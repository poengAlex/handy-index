<template>
  <q-page class="tags-page h-section">
    <div class="h-container">
      <div v-if="catalog.status === 'error'" class="tags-page__center">
        <HEmptyState
          icon="cloud_off"
          title="Couldn't load tags"
          body="The script index didn't answer. Check your connection and try again."
          action-label="Try again"
          @action="catalog.retry()"
        />
      </div>

      <template v-else>
        <header class="tags-page__header">
          <h1 class="text-h2 tags-page__title">Tags</h1>
          <p
            v-if="catalog.status === 'ready'"
            class="text-body-sm tags-page__count"
          >
            {{ countLabel }}
          </p>
        </header>

        <div v-if="catalog.status !== 'ready'" class="tags-page__center">
          <HandyLoader />
        </div>

        <template v-else>
          <div class="tags-page__controls">
            <q-input
              v-model="query"
              filled
              dense
              clearable
              debounce="300"
              placeholder="Search tags"
              aria-label="Search tags"
              class="tags-page__search"
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
              aria-label="Sort tags"
              class="tags-page__sort"
            >
              <template #prepend>
                <q-icon name="sort" />
              </template>
            </q-select>
          </div>

          <div v-if="!filtered.length" class="tags-page__center">
            <HEmptyState
              icon="search_off"
              title="No tags match"
              :body="`Nothing in the index matches “${needle}”.`"
              action-label="Clear search"
              @action="query = ''"
            />
          </div>

          <template v-else>
            <div class="tags-page__cloud">
              <router-link
                v-for="summary in shown"
                :key="summary.tag"
                :to="`/videos?tag=${encodeURIComponent(summary.tag)}`"
                class="tags-page__tag"
              >
                <HChip>
                  {{ summary.tag }}
                  <span class="tags-page__tag-count">
                    {{ summary.count.toLocaleString() }}
                  </span>
                </HChip>
              </router-link>
            </div>
            <div v-if="!done" ref="sentinel" class="tags-page__sentinel" />
          </template>
        </template>
      </template>
    </div>
  </q-page>
</template>

<script setup lang="ts">
// Every tag in the visible catalog as a clickable pill cloud — most-used
// first or A–Z, searchable, revealed incrementally. A pill filters the
// browse page on that tag.
import { computed, ref } from "vue";
import { HChip, HEmptyState, HandyLoader } from "@/components/handy";
import { useIncrementalReveal } from "@/composables/useIncrementalReveal";
import { tagsOf } from "@/services/script-index/queries";
import { useCatalogStore } from "@/stores/catalog";

const PAGE_SIZE = 150;

type SortKey = "count" | "name";

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: "Most videos", value: "count" },
  { label: "A–Z", value: "name" }
];

const catalog = useCatalogStore();

// clearable q-input emits null on clear
const query = ref<string | null>("");
const sortKey = ref<SortKey>("count");

const all = computed(() =>
  catalog.status === "ready" ? tagsOf(catalog.visible) : []
);

const needle = computed(() => (query.value ?? "").trim().toLowerCase());

const filtered = computed(() => {
  const matches = needle.value
    ? all.value.filter(summary => summary.tag.includes(needle.value))
    : all.value;
  if (sortKey.value === "name") {
    return [...matches].sort((a, b) => a.tag.localeCompare(b.tag));
  }
  return matches;
});

const { shown, done, sentinel } = useIncrementalReveal(filtered, PAGE_SIZE);

const countLabel = computed(() => {
  const total = all.value.length;
  const totalLabel = `${total.toLocaleString()} tag${total === 1 ? "" : "s"}`;
  return needle.value
    ? `${filtered.value.length.toLocaleString()} of ${totalLabel}`
    : totalLabel;
});
</script>

<style scoped lang="scss">
.tags-page {
  padding-bottom: var(--space-3xl);
}

.tags-page__header {
  margin-bottom: var(--space-md);
}

.tags-page__title {
  margin: 0;
}

.tags-page__count {
  color: var(--color-text-tertiary);
  margin: var(--space-xs) 0 0;
}

.tags-page__controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.tags-page__search {
  flex: 1 1 240px;
  max-width: 360px;
}

.tags-page__sort {
  min-width: 180px;
}

.tags-page__center {
  min-height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tags-page__cloud {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.tags-page__tag {
  text-decoration: none !important;
  border-radius: var(--radius-full);

  :deep(.h-chip) {
    transition: box-shadow 180ms ease;
  }

  &:hover :deep(.h-chip) {
    box-shadow: 0 0 0 1px var(--color-stroke-default);
  }
}

.tags-page__tag-count {
  color: var(--color-text-tertiary);
}

.tags-page__sentinel {
  height: 1px;
}
</style>
