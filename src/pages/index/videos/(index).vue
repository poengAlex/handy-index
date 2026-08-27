<template>
  <q-page class="videos-page h-section">
    <div class="h-container">
      <header class="videos-page__head">
        <h1 class="text-h2 videos-page__title">{{ $t("browse.title") }}</h1>
        <p
          v-if="catalog.status === 'ready'"
          class="text-body-sm videos-page__count"
        >
          {{ countLabel }}
        </p>
        <GateNotice
          v-if="catalog.status === 'ready'"
          class="videos-page__gate"
        />
      </header>

      <div class="videos-page__controls">
        <q-input
          :model-value="searchInput"
          filled
          dense
          clearable
          :placeholder="$t('browse.toolbar.searchPlaceholder')"
          :aria-label="$t('browse.toolbar.searchAria')"
          class="videos-page__search"
          @update:model-value="onSearchInput"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-select
          :model-value="sortKey"
          :options="sortOptions"
          emit-value
          map-options
          filled
          dense
          :aria-label="$t('browse.toolbar.sortAria')"
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
          :aria-label="sortDirAria"
          :title="sortDirTitle"
          class="videos-page__dir"
          @click="flipDir"
        />
        <HBtn
          variant="secondary"
          icon="tune"
          :label="filtersLabel"
          @click="filtersOpen = true"
        />
        <HBtn
          variant="tertiary"
          icon="share"
          :label="$t('common.action.share')"
          :aria-label="$t('browse.toolbar.shareAria')"
          @click="shareResults"
        />
      </div>

      <div v-if="chips.length" class="videos-page__chips">
        <button
          v-for="chip in chips"
          :key="chip.key"
          type="button"
          class="videos-page__chip"
          :aria-label="chipRemoveAria(chip)"
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
          :title="$t('common.state.catalogErrorTitle')"
          :body="$t('common.state.catalogErrorBody')"
          :action-label="$t('common.action.retry')"
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
          <!-- the ambient gate is invisible from here, so an empty grid that
               a different orientation would fill has to say so -->
          <HEmptyState
            v-else-if="withoutOrientation.length"
            icon="filter_alt_off"
            :title="orientationTitle"
            :body="orientationBody"
            :action-label="$t('browse.empty.orientationAction')"
            @action="settings.orientation = 'all'"
          />
          <HEmptyState
            v-else
            icon="search_off"
            :title="$t('browse.empty.noneTitle')"
            :body="$t('browse.empty.noneBody')"
            :action-label="$t('browse.empty.noneAction')"
            @action="clearAll"
          />
        </div>
      </template>
    </div>

    <!-- Advanced filters — everything applies live to the URL, and every
         apply is a router.replace, so the dialog must survive route changes -->
    <q-dialog v-model="filtersOpen" no-route-dismiss>
      <HModal
        :title="$t('browse.filters.title')"
        closable
        class="videos-page__filters"
      >
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
            :label="$t('browse.filters.addTag')"
            @filter="filterTags"
            @update:model-value="addTag"
          >
            <template #prepend>
              <q-icon name="sell" />
            </template>
            <template #no-option>
              <q-item>
                <q-item-section class="text-body-sm">
                  {{ $t("browse.filters.noTags") }}
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
            :label="$t('browse.filters.site')"
            @filter="filterSites"
            @update:model-value="setPartner"
          >
            <template #prepend>
              <q-icon name="language" />
            </template>
            <template #no-option>
              <q-item>
                <q-item-section class="text-body-sm">
                  {{ $t("browse.filters.noSites") }}
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-select
            :model-value="performerId || null"
            :display-value="performerDisplay"
            :options="performerOptions"
            emit-value
            map-options
            use-input
            clearable
            input-debounce="150"
            filled
            dense
            :label="$t('browse.filters.performer')"
            @filter="filterPerformers"
            @update:model-value="setPerformer"
          >
            <template #prepend>
              <q-icon name="person" />
            </template>
            <template #no-option>
              <q-item>
                <q-item-section class="text-body-sm">
                  {{ $t("browse.filters.noPerformers") }}
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
              :aria-label="chipRemoveAria(chip)"
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
              :label="$t('browse.filters.vrLabel')"
              :caption="$t('browse.filters.vrCaption')"
              @update:model-value="setVr"
            />
          </HList>

          <!-- The global settings gates. They ride in the URL so a shared
               link reproduces this grid, but they stay preferences rather
               than page filters: they don't count toward the badge, and
               Clear filters leaves them alone. -->
          <HList :title="$t('browse.filters.orientation')">
            <HRadioRow
              v-for="option in ORIENTATIONS"
              :key="option"
              v-model="settings.orientation"
              :val="option"
              :label="format.orientation(option)"
            />
          </HList>

          <HList :title="$t('browse.filters.access')">
            <HToggleRow
              v-model="settings.showPremiumScripts"
              icon="workspace_premium"
              :label="$t('browse.filters.premiumScriptsLabel')"
              :caption="$t('browse.filters.premiumScriptsCaption')"
            />
            <HToggleRow
              v-model="settings.showPaidVideos"
              icon="paid"
              :label="$t('browse.filters.premiumVideosLabel')"
              :caption="$t('browse.filters.premiumVideosCaption')"
            />
          </HList>

          <!-- the third gate, and the only one with no control in the
               browsing chrome: a single common tag can carry half the
               index, so it is listed here with the others rather than
               living solely behind the hidden-count notice -->
          <HList>
            <HListRow
              icon="block"
              :label="$t('browse.filters.mutedLabel')"
              :caption="mutedCaption"
              :clickable="false"
            >
              <template #trailing>
                <HBtn
                  variant="tertiary"
                  size="sm"
                  :label="$t('common.action.manage')"
                  @click="mutedTagsOpen = true"
                />
              </template>
            </HListRow>
          </HList>

          <HLabeledSlider
            :model-value="durationInput"
            :label="$t('browse.filters.duration')"
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
            :label="$t('common.action.clearFilters')"
            :disable="!advancedCount"
            @click="clearAdvanced"
          />
          <HBtn v-close-popup :label="$t('common.action.done')" />
        </template>
      </HModal>
    </q-dialog>

    <MutedTagsDialog v-model="mutedTagsOpen" />
  </q-page>
</template>

<script setup lang="ts">
// The browse + search surface: every filter lives in the URL query so any
// combination is shareable and back-button friendly — including the two
// global gates (orientation, script/video access), without which a link would
// render against the recipient's catalog instead of the sender's. Filtering
// is a straight composition of the queries.ts selectors over the gated
// catalog.
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import {
  HBtn,
  HChip,
  HEmptyState,
  HLabeledSlider,
  HList,
  HListRow,
  HModal,
  HRadioRow,
  HToggleRow,
  HandyLoader,
  hToast
} from "@/components/handy";
import type { HLabeledSliderRange } from "@/components/handy/HLabeledSlider.vue";
import GateNotice from "@/components/GateNotice.vue";
import MutedTagsDialog from "@/components/MutedTagsDialog.vue";
import VideoGrid from "@/components/VideoGrid.vue";
import { useFormat } from "@/composables/useFormat";
import type { Orientation } from "@/services/script-index/queries";
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
  performersOf,
  recentFirst,
  recentlyUpdatedFirst,
  searchTitle,
  tagsOf,
  topRated,
  vrOnly
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

// the order the dropdown offers them in, and nothing else: a module constant
// is evaluated once at import, so a label parked here would keep its English
// through a language switch. `browse.sort.*` is keyed by SortKey, so the
// option list translates itself at render time (see `sortOptions`).
const SORT_ORDER: SortKey[] = [
  "recent",
  "updated",
  "top",
  "plays",
  "views",
  "longest",
  "title"
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

const { t, n } = useI18n();
const format = useFormat();
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

const sortOptions = computed(() =>
  SORT_ORDER.map(value => ({ label: t(`browse.sort.${value}`), value }))
);

// the flip button reads out the direction the list is in; the tooltip adds
// what a click would do
const sortDirAria = computed(() =>
  sortDir.value === "desc"
    ? t("browse.toolbar.dirDescAria")
    : t("browse.toolbar.dirAscAria")
);

const sortDirTitle = computed(() =>
  sortDir.value === "desc"
    ? t("browse.toolbar.dirDescTitle")
    : t("browse.toolbar.dirAscTitle")
);

// The three global gates (orientation + the two paywalls) also ride in the
// URL — they
// silently decide what the grid can contain, so a link without them
// reproduces the recipient's catalog rather than the sender's. They stay
// owned by the settings store: the URL is an inbound setter plus a
// projection (see the sync watcher), never a second source of truth.
// null = absent or unparseable, which means "the URL has nothing to say".
const orientationParam = computed<Orientation | null>(() => {
  const raw = firstParam(route.query.orientation);
  return (ORIENTATIONS as string[]).includes(raw) ? (raw as Orientation) : null;
});

// "1"/"0" today; the word forms are the three-way gate this briefly shipped
// with, where premium-only has no boolean equivalent and reads as "shown"
function accessParam(raw: string): boolean | null {
  if (raw === "1" || raw === "all" || raw === "premium") return true;
  if (raw === "0" || raw === "free") return false;
  return null;
}

const scriptParam = computed<boolean | null>(
  () =>
    // ?premium= was this same switch back when the two paywalls were one gate
    accessParam(firstParam(route.query.script)) ??
    accessParam(firstParam(route.query.premium))
);

const videoParam = computed<boolean | null>(() =>
  accessParam(firstParam(route.query.video))
);

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
  /** global gate — read from the store, not the URL (see currentFilters) */
  orientation: Orientation;
  /** global gate — read from the store, not the URL */
  script: boolean;
  /** global gate — read from the store, not the URL */
  video: boolean;
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
    dmax: durationMax.value,
    // the store is the truth for both gates: every write goes through it
    // first, so what lands in the URL is what the app is actually using
    orientation: settings.orientation,
    script: settings.showPremiumScripts,
    video: settings.showPaidVideos
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
  // written unconditionally, unlike every filter above: their "default" is
  // whatever this user saved, not a constant, so omitting them at a default
  // would export nothing on the most common visit — the one where you never
  // touched the gates and copied the URL from the address bar
  query.orientation = filters.orientation;
  query.script = filters.script ? "1" : "0";
  query.video = filters.video ? "1" : "0";
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

// through apply, not a bare empty query: the gates are the user's standing
// preference, not a page filter, so clearing the page keeps them (and keeps
// the URL shareable)
function clearAll() {
  apply({
    ...currentFilters(),
    q: "",
    tags: [],
    partnerId: "",
    performerId: "",
    performerName: "",
    sort: "recent",
    dir: NATURAL_DIR.recent,
    vr: false,
    dmin: 0,
    dmax: DURATION_MAX
  });
}

// --- global gates ⇄ URL ---

// One watcher, both directions, with a single precedence rule: if the URL's
// gate values moved (opened link, back button, first render) the URL is the
// intent and is adopted into the store; otherwise the store moved (header
// switcher, settings dialog, filters modal) and the URL is what needs to
// catch up. Both branches converge on params === store, so the re-run each
// one triggers settles immediately instead of ping-ponging.
watch(
  [
    orientationParam,
    scriptParam,
    videoParam,
    () => settings.orientation,
    () => settings.showPremiumScripts,
    () => settings.showPaidVideos
  ],
  ([orientation, script, video], before) => {
    // no `before` = the immediate first run, where the URL always leads
    const urlLed =
      !before ||
      orientation !== before[0] ||
      script !== before[1] ||
      video !== before[2];
    if (urlLed) {
      if (orientation) settings.orientation = orientation;
      if (script !== null) settings.showPremiumScripts = script;
      if (video !== null) settings.showPaidVideos = video;
    }
    // fills a bare /videos, an inbound link that carried only some of the
    // gates, and any unparseable value — the URL always ends up stating all
    if (
      orientation !== settings.orientation ||
      script !== settings.showPremiumScripts ||
      video !== settings.showPaidVideos
    ) {
      apply(currentFilters());
    }
  },
  { immediate: true }
);

// --- the advanced-filters modal ---

const filtersOpen = ref(false);
const mutedTagsOpen = ref(false);

// names them rather than counting them: "3 tags muted" tells you a gate is
// on, but not whether it's the one emptying your grid
const MUTED_SHOWN = 3;

const mutedCaption = computed(() => {
  const tags = settings.mutedTags;
  if (!tags.length) return t("browse.filters.mutedNone");
  const shown = tags.slice(0, MUTED_SHOWN).join(", ");
  const rest = tags.length - MUTED_SHOWN;
  return rest > 0
    ? t("browse.filters.mutedMore", { tags: shown, rest: n(rest) })
    : shown;
});

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
  advancedCount.value
    ? t("browse.toolbar.filtersCount", { count: n(advancedCount.value) })
    : t("browse.toolbar.filters")
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
  if (min <= 0 && max >= DURATION_MAX) return t("browse.filters.durationAny");
  if (max >= DURATION_MAX) {
    return t("browse.filters.durationFrom", { min: n(min) });
  }
  return t("browse.filters.durationRange", { min: n(min), max: n(max) });
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

// --- pickers: add a tag / choose a site or performer without leaving the
// page ---

interface PickOption {
  label: string;
  value: string;
}

const tagNeedle = ref("");
const siteNeedle = ref("");
const performerNeedle = ref("");

const allTags = computed(() =>
  catalog.status === "ready" ? tagsOf(catalog.visible) : []
);

// the picker is a filter control, so it offers what a pick would actually
// show — counts included. The /sites directory is the complete map instead,
// and discloses "0 of 1,211" for a site your gates empty.
const allSites = computed(() =>
  catalog.status === "ready" ? partnersOf(catalog.visible) : []
);

// same rule as the sites picker: what a pick would actually show. The
// /performers directory is the full roster instead, and lifts the
// orientation gate — a performer is a person in the index, not a preference.
const allPerformers = computed(() =>
  catalog.status === "ready" ? performersOf(catalog.visible) : []
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
      label: t("browse.filters.option", {
        name: summary.tag,
        count: n(summary.count)
      }),
      value: summary.tag
    }))
);

const siteOptions = computed<PickOption[]>(() =>
  allSites.value
    .filter(summary => summary.name.toLowerCase().includes(siteNeedle.value))
    .slice(0, 30)
    .map(summary => ({
      label: t("browse.filters.option", {
        name: summary.name,
        count: n(summary.count)
      }),
      value: summary.partnerId
    }))
);

const performerOptions = computed<PickOption[]>(() =>
  allPerformers.value
    .filter(summary =>
      summary.name.toLowerCase().includes(performerNeedle.value)
    )
    .slice(0, 30)
    .map(summary => ({
      label: t("browse.filters.option", {
        name: summary.name,
        count: n(summary.count)
      }),
      value: summary.performerId
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

function filterPerformers(input: string, update: (fn: () => void) => void) {
  update(() => {
    performerNeedle.value = input.trim().toLowerCase();
  });
}

function setPartner(id: string | null) {
  apply({ ...currentFilters(), partnerId: id ?? "" });
}

// The name rides in the URL beside the id (same as the links in from the
// performers page and a video's cast list), so the chip has something to
// print without scanning the catalog for the id.
function setPerformer(id: string | null) {
  if (!id) {
    removePerformer();
    return;
  }
  const match = allPerformers.value.find(entry => entry.performerId === id);
  apply({
    ...currentFilters(),
    performerId: id,
    performerName: match?.name ?? ""
  });
}

// --- active filter chips ---

const partnerLabel = computed(() => {
  const id = partnerId.value;
  if (!id) return "";
  const match = catalog.videos.find(video => video.partnerId === id);
  return match?.partnerName ?? t("browse.chip.partnerFallback");
});

// The picker offers the 30 biggest matches, so a performer picked earlier
// (or arriving in a shared link) is usually not among them — without this the
// closed control would print the raw id.
const performerDisplay = computed(() =>
  performerId.value
    ? performerName.value || t("browse.chip.performerFallback")
    : undefined
);

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
      label: performerName.value || t("browse.chip.performerFallback"),
      icon: "person",
      remove: removePerformer
    });
  }
  return list;
});

// the chip is a button whose whole job is removing the filter it names, and
// the name is catalog data — a tag, a site, a performer
function chipRemoveAria(chip: FilterChip): string {
  return t("browse.chip.removeAria", { label: chip.label });
}

// --- results:
// byTags → byPartner → byPerformer → vrOnly → duration → search → sort ---

// Picking a site or a performer used to lift the orientation gate, on the
// theory that a deliberate pick outranks an ambient filter. It reads as a
// broken filter instead: one site alone served 1,567 gay/trans videos under a
// Straight filter, and the directory card promising "5,751 of 7,320" opened
// onto 7,318. Every filter applies to every surface now; a pick that empties
// the grid says so, and offers to lift the gate (see the empty state).
function filterPool(pool: readonly PartnerVideo[]): PartnerVideo[] {
  let out = byTags(pool, tags.value);
  if (partnerId.value) out = byPartner(out, partnerId.value);
  if (performerId.value) out = byPerformer(out, performerId.value);
  if (vr.value) out = vrOnly(out);
  out = byDurationRange(
    out,
    durationMin.value * 60,
    durationMax.value >= DURATION_MAX ? Infinity : durationMax.value * 60
  );
  return searchTitle(out, q.value);
}

const results = computed<PartnerVideo[]>(() => {
  if (catalog.status !== "ready") return [];
  const sorted = SORTERS[sortKey.value](filterPool(catalog.visible));
  // sorters return fresh arrays, so in-place reverse is safe
  return sortDir.value === NATURAL_DIR[sortKey.value]
    ? sorted
    : sorted.reverse();
});

// what the same filters would find with the orientation gate lifted. Only the
// empty state reads it, and computeds are lazy, so this second pass over the
// catalog runs only when the grid came back empty.
const withoutOrientation = computed<PartnerVideo[]>(() =>
  catalog.status === "ready" && settings.orientation !== "all"
    ? filterPool(catalog.anyOrientation)
    : []
);

const orientationTitle = computed(() =>
  t("browse.empty.orientationTitle", {
    orientation: format.orientation(settings.orientation)
  })
);

const orientationBody = computed(() => {
  const count = withoutOrientation.value.length;
  return t(
    "browse.empty.orientationBody",
    {
      count: n(count),
      orientation: format.orientation(settings.orientation)
    },
    count
  );
});

const countLabel = computed(() => format.count("videos", results.value.length));

// --- muted tags sitting in the URL filter ---

// the URL is never silently rewritten: that would rewrite a shared link and
// hide the very cause the empty state is trying to explain
const mutedActiveTags = computed(() =>
  tags.value.filter(tag => settings.mutedSet.has(tag))
);

// the single-tag copy names the tag, so it needs the tag itself and not just
// the count — undefined here means "say it in the plural"
const mutedOne = computed(() =>
  mutedActiveTags.value.length === 1 ? mutedActiveTags.value[0] : undefined
);

// two separate sentences rather than one plural message: the singular carries
// a param the plural has nowhere to put
const mutedTitle = computed(() => {
  const tag = mutedOne.value;
  return tag
    ? t("browse.empty.mutedOneTitle", { tag })
    : t("browse.empty.mutedManyTitle");
});

const mutedBody = computed(() =>
  mutedOne.value
    ? t("browse.empty.mutedOneBody")
    : t("browse.empty.mutedManyBody")
);

const mutedAction = computed(() => {
  const tag = mutedOne.value;
  return tag
    ? t("browse.empty.mutedOneAction", { tag })
    : t("browse.empty.mutedManyAction");
});

function unmuteActive() {
  for (const tag of mutedActiveTags.value) settings.unmuteTag(tag);
}

// --- sharing the current view ---

// Nothing to assemble: every filter, sort and gate is already in the URL, so
// the shareable link IS the current location. Same ladder as the video detail
// page — the platform share sheet where there is one, clipboard otherwise.
async function shareResults() {
  const url = window.location.href;
  const title =
    catalog.status === "ready"
      ? t("browse.share.title", { count: countLabel.value })
      : t("browse.share.fallbackTitle");
  if (navigator.share) {
    try {
      await navigator.share({ title, url });
    } catch {
      // user dismissed the sheet — not an error
    }
    return;
  }
  try {
    await navigator.clipboard.writeText(url);
    hToast(
      "positive",
      t("browse.share.copiedTitle"),
      t("browse.share.copiedBody")
    );
  } catch {
    hToast("negative", t("browse.share.failedTitle"));
  }
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

// its own row under the title/count pair, which share the baseline above it
.videos-page__gate {
  flex-basis: 100%;
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
