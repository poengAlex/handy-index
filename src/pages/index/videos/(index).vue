<template>
  <q-page class="videos-page h-section">
    <div class="h-container">
      <header class="videos-page__head">
        <h1 class="text-h2 videos-page__title">Videos</h1>
        <p
          v-if="catalog.status === 'ready'"
          class="text-body-sm videos-page__count"
        >
          {{ countLabel }}
        </p>
      </header>

      <div class="videos-page__controls">
        <q-input
          :model-value="searchInput"
          filled
          dense
          clearable
          placeholder="Search titles"
          aria-label="Search videos by title"
          class="videos-page__search"
          @update:model-value="onSearchInput"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-select
          :model-value="sortKey"
          :options="SORT_OPTIONS"
          emit-value
          map-options
          filled
          dense
          aria-label="Sort videos"
          class="videos-page__sort"
          @update:model-value="setSort"
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
          class="videos-page__dir"
          @click="flipDir"
        />
        <HBtn
          variant="secondary"
          icon="tune"
          :label="filtersLabel"
          @click="filtersOpen = true"
        />
      </div>

      <div v-if="chips.length" class="videos-page__chips">
        <button
          v-for="chip in chips"
          :key="chip.key"
          type="button"
          class="videos-page__chip"
          :aria-label="`Remove filter: ${chip.label}`"
          @click="chip.remove()"
        >
          <HChip :icon="chip.icon">
            {{ chip.label }}
            <q-icon name="close" size="16px" class="videos-page__chip-close" />
          </HChip>
        </button>
      </div>

      <div v-if="catalog.status === 'error'" class="videos-page__state">
        <HEmptyState
          icon="cloud_off"
          title="Couldn't load the catalog"
          body="The script index didn't answer. Check your connection and try again."
          action-label="Try again"
          @action="catalog.retry()"
        />
      </div>

      <div v-else-if="catalog.status !== 'ready'" class="videos-page__loading">
        <HandyLoader />
      </div>

      <template v-else>
        <VideoGrid
          v-if="results.length"
          :videos="results"
          class="videos-page__grid"
        />
        <div v-else class="videos-page__state">
          <!-- A muted tag arriving via ?tag= (bookmark, shared link) empties
               the grid, and "Clear all filters" provably cannot fix it -->
          <HEmptyState
            v-if="mutedActiveTags.length"
            icon="volume_off"
            :title="mutedTitle"
            :body="mutedBody"
            :action-label="mutedAction"
            @action="unmuteActive"
          />
          <HEmptyState
            v-else
            icon="search_off"
            title="No videos match"
            body="Every video got filtered out. Loosen the search or remove some filters."
            action-label="Clear all filters"
            @action="clearAll"
          />
        </div>
      </template>
    </div>

    <!-- Advanced filters — everything applies live to the URL, and every
         apply is a router.replace, so the dialog must survive route changes -->
    <q-dialog v-model="filtersOpen" no-route-dismiss>
      <HModal title="Filters" closable class="videos-page__filters">
        <div class="videos-page__filters-stack">
          <q-select
            :model-value="null"
            :options="tagOptions"
            emit-value
            map-options
            use-input
            input-debounce="150"
            filled
            dense
            label="Add tag"
            @filter="filterTags"
            @update:model-value="addTag"
          >
            <template #prepend>
              <q-icon name="sell" />
            </template>
            <template #no-option>
              <q-item>
                <q-item-section class="text-body-sm">
                  No matching tags
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-select
            :model-value="partnerId || null"
            :options="siteOptions"
            emit-value
            map-options
            use-input
            input-debounce="150"
            filled
            dense
            label="Site"
            @filter="filterSites"
            @update:model-value="setPartner"
          >
            <template #prepend>
              <q-icon name="language" />
            </template>
            <template #no-option>
              <q-item>
                <q-item-section class="text-body-sm">
                  No matching sites
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <div v-if="chips.length" class="videos-page__chips">
            <button
              v-for="chip in chips"
              :key="chip.key"
              type="button"
              class="videos-page__chip"
              :aria-label="`Remove filter: ${chip.label}`"
              @click="chip.remove()"
            >
              <HChip :icon="chip.icon">
                {{ chip.label }}
                <q-icon
                  name="close"
                  size="16px"
                  class="videos-page__chip-close"
                />
              </HChip>
            </button>
          </div>

          <HList>
            <HToggleRow
              :model-value="vr"
              icon="view_in_ar"
              label="VR only"
              caption="Only virtual-reality videos"
              @update:model-value="setVr"
            />
            <HToggleRow
              v-model="settings.showPremium"
              icon="workspace_premium"
              label="Premium videos"
              caption="Include videos without a free script — applies everywhere"
            />
          </HList>

          <!-- Mirrors of the global settings gates (not URL filters): they
               don't count toward the badge and Clear filters leaves them -->
          <HList title="Orientation">
            <HRadioRow
              v-for="option in ORIENTATIONS"
              :key="option"
              v-model="settings.orientation"
              :val="option"
              :label="ORIENTATION_LABELS[option]"
            />
          </HList>

          <HLabeledSlider
            :model-value="durationInput"
            label="Duration"
            unit="min"
            :min="0"
            :max="DURATION_MAX"
            :step="1"
            :editable="false"
            @update:model-value="onDurationInput"
            @change="commitDuration"
          >
            <template #value>{{ durationLabel }}</template>
          </HLabeledSlider>
        </div>

        <template #actions>
          <HBtn
            variant="tertiary"
            label="Clear filters"
            :disable="!advancedCount"
            @click="clearAdvanced"
          />
          <HBtn v-close-popup label="Done" />
        </template>
      </HModal>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
// The browse + search surface: every filter lives in the URL query so any
// combination is shareable and back-button friendly. Filtering is a straight
// composition of the queries.ts selectors over the gated catalog.
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  HBtn,
  HChip,
  HEmptyState,
  HLabeledSlider,
  HList,
  HModal,
  HRadioRow,
  HToggleRow,
  HandyLoader
} from "@/components/handy";
import type { HLabeledSliderRange } from "@/components/handy/HLabeledSlider.vue";
import VideoGrid from "@/components/VideoGrid.vue";
import {
  ORIENTATIONS,
  alphabetical,
  byDurationRange,
  byPartner,
  byPerformer,
  byTags,
  longestFirst,
  mostPlayed,
  mostViewed,
  partnersOf,
  recentFirst,
  recentlyUpdatedFirst,
  searchTitle,
  tagsOf,
  topRated,
  vrOnly,
  type Orientation
} from "@/services/script-index/queries";
import type { PartnerVideo } from "@/services/script-index/types";
import { useCatalogStore } from "@/stores/catalog";
import { useSettingsStore } from "@/stores/settings";

const SEARCH_DEBOUNCE_MS = 300;

// duration slider cap in MINUTES — a max handle sitting at the cap means
// "no cap" (open-ended range), so dmax is never written at this value
const DURATION_MAX = 120;

type SortKey =
  | "recent"
  | "updated"
  | "top"
  | "plays"
  | "views"
  | "longest"
  | "title";

const SORTERS: Record<
  SortKey,
  (videos: readonly PartnerVideo[]) => PartnerVideo[]
> = {
  recent: recentFirst,
  updated: recentlyUpdatedFirst,
  top: topRated,
  plays: mostPlayed,
  views: mostViewed,
  longest: longestFirst,
  title: alphabetical
};

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: "Recently added", value: "recent" },
  { label: "Recently updated", value: "updated" },
  { label: "Top rated", value: "top" },
  { label: "Most played", value: "plays" },
  { label: "Most viewed", value: "views" },
  { label: "Longest", value: "longest" },
  { label: "A–Z", value: "title" }
];

type SortDir = "asc" | "desc";

// the direction each sorter naturally produces; `dir` in the URL is only
// written when it differs, and flipping away from natural reverses the list
const NATURAL_DIR: Record<SortKey, SortDir> = {
  recent: "desc",
  updated: "desc",
  top: "desc",
  plays: "desc",
  views: "desc",
  longest: "desc",
  title: "asc"
};

function isSortKey(value: string): value is SortKey {
  return value in SORTERS;
}

interface FilterChip {
  key: string;
  label: string;
  icon: string;
  remove: () => void;
}

const ORIENTATION_LABELS: Record<Orientation, string> = {
  straight: "Straight",
  gay: "Gay",
  trans: "Trans",
  all: "Everything"
};

const route = useRoute();
const router = useRouter();
const catalog = useCatalogStore();
const settings = useSettingsStore();

// --- query param normalization (values are string | string[] | null) ---

function firstParam(value: unknown): string {
  if (Array.isArray(value)) {
    const head = value[0];
    return typeof head === "string" ? head : "";
  }
  return typeof value === "string" ? value : "";
}

function allParams(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return typeof value === "string" ? [value] : [];
}

const q = computed(() => firstParam(route.query.q));
const tags = computed(() => allParams(route.query.tag));
const partnerId = computed(() => firstParam(route.query.partnerId));
const performerId = computed(() => firstParam(route.query.performerId));
const performerName = computed(() => firstParam(route.query.performerName));
const vr = computed(() => firstParam(route.query.vr) === "1");
const sortKey = computed<SortKey>(() => {
  const raw = firstParam(route.query.sort);
  return isSortKey(raw) ? raw : "recent";
});

const sortDir = computed<SortDir>(() => {
  const raw = firstParam(route.query.dir);
  return raw === "asc" || raw === "desc" ? raw : NATURAL_DIR[sortKey.value];
});

// dmin/dmax are integer MINUTES; both optional and omitted at defaults
const durationMin = computed(() => {
  const raw = Number.parseInt(firstParam(route.query.dmin), 10);
  if (!Number.isFinite(raw)) return 0;
  return Math.min(Math.max(raw, 0), DURATION_MAX);
});

const durationMax = computed(() => {
  const raw = Number.parseInt(firstParam(route.query.dmax), 10);
  // absent/invalid, or at/over the cap → open-ended (the sentinel)
  if (!Number.isFinite(raw) || raw <= 0 || raw >= DURATION_MAX) {
    return DURATION_MAX;
  }
  return Math.max(raw, durationMin.value);
});

// --- writing filters back to the URL ---

interface Filters {
  q: string;
  tags: string[];
  partnerId: string;
  performerId: string;
  performerName: string;
  sort: SortKey;
  dir: SortDir;
  vr: boolean;
  /** minutes; 0 = no lower bound */
  dmin: number;
  /** minutes; DURATION_MAX = no cap */
  dmax: number;
}

function currentFilters(): Filters {
  return {
    q: q.value,
    tags: tags.value,
    partnerId: partnerId.value,
    performerId: performerId.value,
    performerName: performerName.value,
    sort: sortKey.value,
    dir: sortDir.value,
    vr: vr.value,
    dmin: durationMin.value,
    dmax: durationMax.value
  };
}

// replace, not push: tweaking a filter shouldn't grow the history stack
function apply(filters: Filters) {
  const query: Record<string, string | string[]> = {};
  const needle = filters.q.trim();
  if (needle) query.q = needle;
  if (filters.tags.length) query.tag = [...filters.tags];
  if (filters.partnerId) query.partnerId = filters.partnerId;
  if (filters.performerId) {
    query.performerId = filters.performerId;
    if (filters.performerName) query.performerName = filters.performerName;
  }
  if (filters.sort !== "recent") query.sort = filters.sort;
  if (filters.dir !== NATURAL_DIR[filters.sort]) query.dir = filters.dir;
  if (filters.vr) query.vr = "1";
  if (filters.dmin > 0) query.dmin = String(filters.dmin);
  if (filters.dmax < DURATION_MAX) query.dmax = String(filters.dmax);
  void router.replace({ query });
}

// picking a new sort resets to that sort's natural direction
function setSort(value: SortKey) {
  apply({ ...currentFilters(), sort: value, dir: NATURAL_DIR[value] });
}

function flipDir() {
  apply({
    ...currentFilters(),
    dir: sortDir.value === "desc" ? "asc" : "desc"
  });
}

function setVr(value: boolean) {
  apply({ ...currentFilters(), vr: value });
}

function removeTag(tag: string) {
  apply({
    ...currentFilters(),
    tags: tags.value.filter(item => item !== tag)
  });
}

function removePartner() {
  apply({ ...currentFilters(), partnerId: "" });
}

function removePerformer() {
  apply({ ...currentFilters(), performerId: "", performerName: "" });
}

function clearAll() {
  void router.replace({ query: {} });
}

// --- the advanced-filters modal ---

const filtersOpen = ref(false);

/** how many advanced filters are active (search and sort don't count) */
const advancedCount = computed(
  () =>
    tags.value.length +
    (partnerId.value ? 1 : 0) +
    (performerId.value ? 1 : 0) +
    (vr.value ? 1 : 0) +
    (durationMin.value > 0 || durationMax.value < DURATION_MAX ? 1 : 0)
);

const filtersLabel = computed(() =>
  advancedCount.value ? `Filters (${advancedCount.value})` : "Filters"
);

/** resets everything the modal owns, keeping search text and sort */
function clearAdvanced() {
  apply({
    ...currentFilters(),
    tags: [],
    partnerId: "",
    performerId: "",
    performerName: "",
    vr: false,
    dmin: 0,
    dmax: DURATION_MAX
  });
}

// --- debounced search input ---

const searchInput = ref("");
let searchTimer = 0;

// external q changes (back button, chip links) resync the input; compare
// trimmed so the echo of our own trimmed write can't snap the field while
// the user is mid-word
watch(
  q,
  value => {
    if (value !== searchInput.value.trim()) searchInput.value = value;
  },
  { immediate: true }
);

function onSearchInput(value: string | number | null) {
  searchInput.value = String(value ?? "");
  window.clearTimeout(searchTimer);
  searchTimer = window.setTimeout(() => {
    apply({ ...currentFilters(), q: searchInput.value });
  }, SEARCH_DEBOUNCE_MS);
}

onBeforeUnmount(() => {
  window.clearTimeout(searchTimer);
});

// --- duration range slider ---

// the pending range lives here while dragging; only the track's commit
// (@change) writes the URL — same discipline as the debounced search box.
// Route changes (back button, clearAll) resync it.
const durationInput = ref<HLabeledSliderRange>({
  min: 0,
  max: DURATION_MAX
});

watch(
  [durationMin, durationMax],
  ([min, max]) => {
    durationInput.value = { min, max };
  },
  { immediate: true }
);

const durationLabel = computed(() => {
  const { min, max } = durationInput.value;
  if (min <= 0 && max >= DURATION_MAX) return "Any";
  if (max >= DURATION_MAX) return `${min}+ min`;
  return `${min}–${max} min`;
});

function onDurationInput(value: number | HLabeledSliderRange) {
  if (typeof value === "number") return;
  durationInput.value = value;
}

function commitDuration() {
  apply({
    ...currentFilters(),
    dmin: durationInput.value.min,
    dmax: durationInput.value.max
  });
}

// --- pickers: add a tag / choose a site without leaving the page ---

interface PickOption {
  label: string;
  value: string;
}

const tagNeedle = ref("");
const siteNeedle = ref("");

const allTags = computed(() =>
  catalog.status === "ready" ? tagsOf(catalog.visible) : []
);

const allSites = computed(() =>
  catalog.status === "ready" ? partnersOf(catalog.visible) : []
);

const tagOptions = computed<PickOption[]>(() =>
  allTags.value
    .filter(
      summary =>
        !tags.value.includes(summary.tag) &&
        summary.tag.includes(tagNeedle.value)
    )
    .slice(0, 30)
    .map(summary => ({
      label: `${summary.tag} (${summary.count.toLocaleString()})`,
      value: summary.tag
    }))
);

const siteOptions = computed<PickOption[]>(() =>
  allSites.value
    .filter(summary => summary.name.toLowerCase().includes(siteNeedle.value))
    .slice(0, 30)
    .map(summary => ({
      label: `${summary.name} (${summary.count.toLocaleString()})`,
      value: summary.partnerId
    }))
);

function filterTags(input: string, update: (fn: () => void) => void) {
  update(() => {
    tagNeedle.value = input.trim().toLowerCase();
  });
}

function filterSites(input: string, update: (fn: () => void) => void) {
  update(() => {
    siteNeedle.value = input.trim().toLowerCase();
  });
}

function addTag(tag: string | null) {
  if (!tag) return;
  apply({ ...currentFilters(), tags: [...tags.value, tag] });
}

function setPartner(id: string | null) {
  apply({ ...currentFilters(), partnerId: id ?? "" });
}

// --- active filter chips ---

const partnerLabel = computed(() => {
  const id = partnerId.value;
  if (!id) return "";
  const match = catalog.videos.find(video => video.partnerId === id);
  return match?.partnerName ?? "Partner";
});

const chips = computed<FilterChip[]>(() => {
  const list: FilterChip[] = tags.value.map(tag => ({
    key: `tag-${tag}`,
    label: tag,
    // marks a filter that can never match while the tag stays muted
    icon: settings.mutedSet.has(tag) ? "volume_off" : "sell",
    remove: () => removeTag(tag)
  }));
  if (partnerId.value) {
    list.push({
      key: "partner",
      label: partnerLabel.value,
      icon: "language",
      remove: removePartner
    });
  }
  if (performerId.value) {
    list.push({
      key: "performer",
      label: performerName.value || "Performer",
      icon: "person",
      remove: removePerformer
    });
  }
  return list;
});

// --- results:
// byTags → byPartner → byPerformer → vrOnly → duration → search → sort ---

const results = computed<PartnerVideo[]>(() => {
  if (catalog.status !== "ready") return [];
  let pool = byTags(catalog.visible, tags.value);
  if (partnerId.value) pool = byPartner(pool, partnerId.value);
  if (performerId.value) pool = byPerformer(pool, performerId.value);
  if (vr.value) pool = vrOnly(pool);
  pool = byDurationRange(
    pool,
    durationMin.value * 60,
    durationMax.value >= DURATION_MAX ? Infinity : durationMax.value * 60
  );
  pool = searchTitle(pool, q.value);
  const sorted = SORTERS[sortKey.value](pool);
  // sorters return fresh arrays, so in-place reverse is safe
  return sortDir.value === NATURAL_DIR[sortKey.value]
    ? sorted
    : sorted.reverse();
});

const countLabel = computed(() => {
  const count = results.value.length;
  return `${count.toLocaleString()} ${count === 1 ? "video" : "videos"}`;
});

// --- muted tags sitting in the URL filter ---

// the URL is never silently rewritten: that would rewrite a shared link and
// hide the very cause the empty state is trying to explain
const mutedActiveTags = computed(() =>
  tags.value.filter(tag => settings.mutedSet.has(tag))
);

const mutedTitle = computed(() =>
  mutedActiveTags.value.length === 1
    ? `“${mutedActiveTags.value[0]}” is muted`
    : "Some of these tags are muted"
);

const mutedBody = computed(() =>
  mutedActiveTags.value.length === 1
    ? "Videos with this tag are hidden everywhere. Unmute it to see these results."
    : "Videos with these tags are hidden everywhere. Unmute them to see these results."
);

const mutedAction = computed(() =>
  mutedActiveTags.value.length === 1
    ? `Unmute “${mutedActiveTags.value[0]}”`
    : "Unmute them"
);

function unmuteActive() {
  for (const tag of mutedActiveTags.value) settings.unmuteTag(tag);
}
</script>

<style scoped lang="scss">
.videos-page {
  padding-bottom: var(--space-3xl);
}

.videos-page__head {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.videos-page__title {
  margin: 0;
}

.videos-page__count {
  margin: 0;
  color: var(--color-text-tertiary);
}

.videos-page__controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-top: var(--space-md);
}

.videos-page__search {
  flex: 1 1 260px;
  max-width: 420px;
}

.videos-page__sort {
  min-width: 210px;
}

.videos-page__dir {
  color: var(--color-text-secondary);
}

.videos-page__filters {
  width: 480px;
}

.videos-page__filters-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.videos-page__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-top: var(--space-sm);
}

// naked button around the chip so the whole pill is the remove target
.videos-page__chip {
  border: 0;
  background: none;
  padding: 0;
  cursor: pointer;
  border-radius: var(--radius-full);

  :deep(.h-chip) {
    transition: box-shadow 180ms ease;
  }

  &:hover :deep(.h-chip) {
    box-shadow: 0 0 0 1px var(--color-stroke-default);
  }
}

.videos-page__chip-close {
  color: var(--color-text-tertiary);
}

.videos-page__loading {
  min-height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.videos-page__state {
  display: flex;
  justify-content: center;
  padding-top: var(--space-xl);
}

.videos-page__grid {
  margin-top: var(--space-lg);
}
</style>
