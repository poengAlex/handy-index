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
          <GateNotice v-if="catalog.status === 'ready'" />
        </header>

        <div v-if="catalog.status !== 'ready'" class="tags-page__center">
          <div class="tags-page__loading">
            <HandyLoader />
            <div
              class="tags-page__bar"
              role="progressbar"
              aria-label="Loading tags"
              aria-valuemin="0"
              aria-valuemax="100"
              :aria-valuenow="percent"
            >
              <div
                class="tags-page__bar-fill"
                :style="{ width: `${percent}%` }"
              />
            </div>
            <p class="text-body-sm tags-page__loading-line" aria-live="polite">
              <span>{{ loadingPhase }}</span>
              <HTabularNum class="tags-page__loading-pct">
                {{ percent }}%
              </HTabularNum>
            </p>
            <p class="text-caption tags-page__loading-note">
              {{ loadingNote }}
            </p>
          </div>
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
            <q-btn
              flat
              round
              :icon="sortDir === 'desc' ? 'arrow_downward' : 'arrow_upward'"
              :aria-label="`Sorted ${sortDir === 'desc' ? 'descending' : 'ascending'} — reverse`"
              :title="`Sorted ${sortDir === 'desc' ? 'descending' : 'ascending'} — click to reverse`"
              class="tags-page__dir"
              @click="flipDir"
            />
            <HBtn
              variant="secondary"
              icon="block"
              :label="mutedLabel"
              @click="mutedOpen = true"
            />
          </div>

          <div v-if="!filtered.length" class="tags-page__center">
            <HEmptyState
              v-if="needle"
              icon="search_off"
              title="No tags match"
              :body="`Nothing in the index matches “${needle}”.`"
              action-label="Clear search"
              @action="query = ''"
            />
            <HEmptyState
              v-else
              icon="filter_alt_off"
              title="Nothing to show"
              body="Your filters and muted tags hide every tag in the index. Loosen them in settings."
              action-label="Muted tags"
              @action="mutedOpen = true"
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
                <!-- right-click / long-press, so the cloud costs no pixels -->
                <q-menu context-menu touch-position>
                  <q-list dense class="tags-page__menu">
                    <q-item
                      v-close-popup
                      clickable
                      :to="`/videos?tag=${encodeURIComponent(summary.tag)}`"
                    >
                      <q-item-section side>
                        <q-icon name="sell" size="20px" />
                      </q-item-section>
                      <q-item-section>Browse this tag</q-item-section>
                    </q-item>
                    <q-item v-close-popup clickable @click="mute(summary.tag)">
                      <q-item-section side>
                        <q-icon name="block" size="20px" />
                      </q-item-section>
                      <q-item-section>Mute this tag</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </router-link>
            </div>
            <div v-if="!done" ref="sentinel" class="tags-page__sentinel" />
          </template>
        </template>
      </template>
    </div>

    <MutedTagsDialog v-model="mutedOpen" />
  </q-page>
</template>

<script setup lang="ts">
// Every tag in the visible catalog as a clickable pill cloud — most-used
// first or A–Z, searchable, revealed incrementally. A pill filters the
// browse page on that tag.
import { computed, ref, watch } from "vue";
import {
  HBtn,
  HChip,
  HEmptyState,
  HTabularNum,
  HandyLoader,
  hToast
} from "@/components/handy";
import GateNotice from "@/components/GateNotice.vue";
import MutedTagsDialog from "@/components/MutedTagsDialog.vue";
import { useIncrementalReveal } from "@/composables/useIncrementalReveal";
import { tagsOf } from "@/services/script-index/queries";
import { useCatalogStore } from "@/stores/catalog";
import { useSettingsStore } from "@/stores/settings";

const PAGE_SIZE = 150;

type SortKey = "count" | "name";
type SortDir = "asc" | "desc";

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: "Most videos", value: "count" },
  { label: "A–Z", value: "name" }
];

// the direction each sort naturally produces; flipping away reverses the list
const NATURAL_DIR: Record<SortKey, SortDir> = { count: "desc", name: "asc" };

const catalog = useCatalogStore();
const settings = useSettingsStore();

// The cloud can't draw a single pill until the whole index is in, and that is
// a ~40 MB wait — long enough that a bare spinner reads as a hang. So: how
// far along, and why it's worth waiting for.
const percent = computed(() => Math.round(catalog.progress * 100));

const loadingPhase = computed(() =>
  catalog.parsing ? "Reading the index" : "Downloading the script index"
);

const loadingNote = computed(() => {
  if (catalog.parsing) return "All in — sorting it into tags now.";
  const received = megabytes(catalog.loadedBytes);
  // the total is only last visit's size; an index that grew since must not
  // print "44 of ~41 MB"
  if (catalog.loadedBytes > catalog.expectedBytes) {
    return `${received} MB unpacked — the whole catalog, fetched once.`;
  }
  return `${received} of ~${megabytes(catalog.expectedBytes)} MB unpacked — the whole catalog, fetched once, so every page after this is instant.`;
});

function megabytes(bytes: number): string {
  return (bytes / 1_000_000).toFixed(1);
}

const mutedOpen = ref(false);

const mutedLabel = computed(() =>
  settings.mutedTags.length ? `Muted (${settings.mutedTags.length})` : "Muted"
);

function mute(tag: string) {
  // a refusal is always an orientation tag here: a muted tag is already gone
  // from the cloud, so it can't be offered twice
  if (!settings.muteTag(tag)) {
    hToast(
      "info",
      `“${tag}” can't be muted`,
      "Orientation tags decide which catalog you see — change that in settings."
    );
    return;
  }
  hToast(
    "info",
    `Muted “${tag}”`,
    "It's in your muted list — unmute any time."
  );
}

// a muted pill vanishes from the cloud, which shortens the list and so resets
// useIncrementalReveal to the first page — a mute made 900 pills deep would
// strand the user in blank space. Covers mutes made in the dialog too
watch(
  () => settings.mutedTags.length,
  () => window.scrollTo({ top: 0 })
);

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
  catalog.status === "ready" ? tagsOf(catalog.visible) : []
);

const needle = computed(() => (query.value ?? "").trim().toLowerCase());

const filtered = computed(() => {
  const matches = needle.value
    ? all.value.filter(summary => summary.tag.includes(needle.value))
    : all.value;
  const ordered =
    sortKey.value === "name"
      ? [...matches].sort((a, b) => a.tag.localeCompare(b.tag))
      : matches;
  if (sortDir.value === NATURAL_DIR[sortKey.value]) return ordered;
  // copy before reversing — `ordered` can alias the tagsOf result
  return [...ordered].reverse();
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

.tags-page__dir {
  color: var(--color-text-secondary);
}

.tags-page__center {
  min-height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tags-page__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  width: 100%;
  max-width: 320px;
  text-align: center;
}

.tags-page__bar {
  width: 100%;
  height: 4px;
  border-radius: var(--radius-full);
  background: var(--color-stroke-subtle);
  overflow: hidden;
}

.tags-page__bar-fill {
  height: 100%;
  border-radius: inherit;
  background: var(--color-action-primary);
  // chunks land in bursts; ease them so the bar glides instead of ratcheting
  transition: width 240ms ease-out;
}

.tags-page__loading-line {
  display: flex;
  justify-content: space-between;
  gap: var(--space-sm);
  width: 100%;
  margin: 0;
  color: var(--color-text-secondary);
}

.tags-page__loading-pct {
  color: var(--color-text-primary);
}

.tags-page__loading-note {
  margin: 0;
  color: var(--color-text-tertiary);
  text-wrap: balance;
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

<style lang="scss">
// unscoped — the menu teleports to the body, outside this page's scope
.tags-page__menu {
  min-width: 200px;
  font-family: var(--font-brand);
}
</style>
