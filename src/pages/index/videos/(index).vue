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
          <!-- Column one: the page filters. Everything here narrows THIS
               search, counts toward the "Filters (n)" badge, and is wiped by
               Clear filters. -->
          <div class="videos-page__filters-col">
            <section class="videos-page__group">
              <h4 class="text-h5 videos-page__group-title">
                {{ $t("browse.filters.sectionContent") }}
              </h4>
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

              <q-select
                :model-value="scripter || null"
                :options="scripterOptions"
                emit-value
                map-options
                use-input
                clearable
                input-debounce="150"
                filled
                dense
                :label="$t('browse.filters.scripter')"
                @filter="filterScripters"
                @update:model-value="setScripter"
              >
                <template #prepend>
                  <q-icon name="edit_note" />
                </template>
                <template #no-option>
                  <q-item>
                    <q-item-section class="text-body-sm">
                      {{ $t("browse.filters.noScripters") }}
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
            </section>

            <section class="videos-page__group">
              <h4 class="text-h5 videos-page__group-title">
                {{ $t("browse.filters.sectionVideo") }}
              </h4>
              <HList>
                <HToggleRow
                  :model-value="vr"
                  icon="view_in_ar"
                  :label="$t('browse.filters.vrLabel')"
                  :caption="$t('browse.filters.vrCaption')"
                  @update:model-value="setVr"
                />
                <HToggleRow
                  :model-value="clip"
                  icon="movie"
                  :label="$t('browse.filters.clipLabel')"
                  :caption="$t('browse.filters.clipCaption')"
                  @update:model-value="setClip"
                />
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
            </section>

            <section class="videos-page__group">
              <h4 class="text-h5 videos-page__group-title">
                {{ $t("browse.filters.sectionScript") }}
              </h4>
              <HLabeledSlider
                :model-value="speedInput"
                :label="$t('browse.filters.speed')"
                unit="spm"
                :min="0"
                :max="SPEED_MAX"
                :step="5"
                :editable="false"
                @update:model-value="onSpeedInput"
                @change="commitSpeed"
              >
                <template #value>{{ speedLabel }}</template>
              </HLabeledSlider>

              <p v-if="unmeasured" class="text-caption videos-page__note">
                {{
                  $t("browse.filters.speedUnmeasured", {
                    count: $n(unmeasured)
                  })
                }}
              </p>
            </section>

            <HList :title="$t('browse.filters.published')">
              <HRadioRow
                v-for="option in PUBLISHED_WINDOWS"
                :key="option"
                :model-value="since"
                :val="option"
                :label="$t(`browse.filters.${PUBLISHED_LABELS[option]}`)"
                @update:model-value="setSince(option)"
              />
            </HList>
          </div>

          <!-- Column two: the three standing preferences. They ride in the
               URL so a shared link reproduces the sender's grid, but they are
               not page filters — no badge, and Clear filters leaves them
               alone — so they get their own column and say so. -->
          <div class="videos-page__filters-col">
            <section class="videos-page__group">
              <h4 class="text-h5 videos-page__group-title">
                {{ $t("browse.filters.sectionAlways") }}
              </h4>
              <p class="text-caption videos-page__group-caption">
                {{ $t("browse.filters.sectionAlwaysCaption") }}
              </p>
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
            </section>
          </div>
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
  byScripter,
  bySpeedRange,
  byTags,
  fastestFirst,
  longestFirst,
  mostPlayed,
  mostViewed,
  partnersOf,
  performersOf,
  addedWithin,
  recentFirst,
  recentlyUpdatedFirst,
  scriptersOf,
  searchTitle,
  tagsOf,
  topRated,
  unmeasuredCount,
  vrOnly,
  withPreview
} from "@/services/script-index/queries";
import type { PartnerVideo } from "@/services/script-index/types";
import { useCatalogStore } from "@/stores/catalog";
import { useSettingsStore } from "@/stores/settings";

const SEARCH_DEBOUNCE_MS = 300;

// duration slider cap in MINUTES — a max handle sitting at the cap means
// "no cap" (open-ended range), so dmax is never written at this value
const DURATION_MAX = 120;

/** The recency windows, in days. 0 is the off position. Spans rather than
 * dates so a shared link keeps meaning "the past month" instead of freezing
 * whatever month the sender was in. Counts on the live index: 186 videos in
 * the past week, 1,074 in the month, 5,636 in the year. */
/** Speed slider cap in STROKES PER MINUTE. A max handle sitting at the cap
 * means "no cap", so smax is never written at this value — the same sentinel
 * DURATION_MAX uses. 180 leaves 0.29% of measured videos above it, while
 * keeping the handle's travel over the range that actually exists (p50 94,
 * p95 135) — re-measured after the run-length decoder stopped reading a
 * repeated value as rest, which had pushed 2,390 scripts above their real
 * speed. */
const SPEED_MAX = 180;

const PUBLISHED_WINDOWS = [0, 7, 30, 365] as const;
type PublishedWindow = (typeof PUBLISHED_WINDOWS)[number];

/** Keyed by the day count so the radio list can stay a module constant of
 * numbers instead of English. */
const PUBLISHED_LABELS: Record<PublishedWindow, string> = {
  0: "publishedAny",
  7: "publishedWeek",
  30: "publishedMonth",
  365: "publishedYear"
};

type SortKey =
  | "recent"
  | "updated"
  | "top"
  | "plays"
  | "views"
  | "longest"
  | "speed"
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
  speed: fastestFirst,
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
  "speed",
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
  speed: "desc",
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
const clip = computed(() => firstParam(route.query.clip) === "1");
const scripter = computed(() => firstParam(route.query.scripter));

const since = computed<PublishedWindow>(() => {
  const raw = Number.parseInt(firstParam(route.query.since), 10);
  return (PUBLISHED_WINDOWS as readonly number[]).includes(raw)
    ? (raw as PublishedWindow)
    : 0;
});
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

// smin/smax are integer STROKES PER MINUTE; both optional, omitted at defaults
const speedMin = computed(() => {
  const raw = Number.parseInt(firstParam(route.query.smin), 10);
  if (!Number.isFinite(raw)) return 0;
  return Math.min(Math.max(raw, 0), SPEED_MAX);
});

const speedMax = computed(() => {
  const raw = Number.parseInt(firstParam(route.query.smax), 10);
  // absent/invalid, or at/over the cap -> open-ended (the sentinel)
  if (!Number.isFinite(raw) || raw <= 0 || raw >= SPEED_MAX) return SPEED_MAX;
  return Math.max(raw, speedMin.value);
});

/** the speed window is narrowed at all — the one condition under which
 * unmeasured videos are dropped, and so the one that has to disclose it */
const speedActive = computed(
  () => speedMin.value > 0 || speedMax.value < SPEED_MAX
);

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
  /** only videos shipping a roll clip */
  clip: boolean;
  /** scripter name; "" = any */
  scripter: string;
  /** days; 0 = any time */
  since: PublishedWindow;
  /** minutes; 0 = no lower bound */
  dmin: number;
  /** minutes; DURATION_MAX = no cap */
  dmax: number;
  /** strokes per minute; 0 = no lower bound */
  smin: number;
  /** strokes per minute; SPEED_MAX = no cap */
  smax: number;
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
    clip: clip.value,
    scripter: scripter.value,
    since: since.value,
    dmin: durationMin.value,
    dmax: durationMax.value,
    smin: speedMin.value,
    smax: speedMax.value,
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
  if (filters.clip) query.clip = "1";
  if (filters.scripter) query.scripter = filters.scripter;
  if (filters.since) query.since = String(filters.since);
  if (filters.dmin > 0) query.dmin = String(filters.dmin);
  if (filters.dmax < DURATION_MAX) query.dmax = String(filters.dmax);
  if (filters.smin > 0) query.smin = String(filters.smin);
  if (filters.smax < SPEED_MAX) query.smax = String(filters.smax);
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

function setClip(value: boolean) {
  apply({ ...currentFilters(), clip: value });
}

function setSince(value: PublishedWindow) {
  apply({ ...currentFilters(), since: value });
}

function setScripter(name: string | null) {
  apply({ ...currentFilters(), scripter: name ?? "" });
}

function removeScripter() {
  apply({ ...currentFilters(), scripter: "" });
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
    clip: false,
    scripter: "",
    since: 0,
    dmin: 0,
    dmax: DURATION_MAX,
    smin: 0,
    smax: SPEED_MAX
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
    (clip.value ? 1 : 0) +
    (scripter.value ? 1 : 0) +
    (since.value ? 1 : 0) +
    (durationMin.value > 0 || durationMax.value < DURATION_MAX ? 1 : 0) +
    (speedActive.value ? 1 : 0)
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
    clip: false,
    scripter: "",
    since: 0,
    dmin: 0,
    dmax: DURATION_MAX,
    smin: 0,
    smax: SPEED_MAX
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

// --- speed range slider ---

// same discipline as the duration track: the pending range lives here while
// dragging and only the commit (@change) writes the URL
const speedInput = ref<HLabeledSliderRange>({ min: 0, max: SPEED_MAX });

watch(
  [speedMin, speedMax],
  ([min, max]) => {
    speedInput.value = { min, max };
  },
  { immediate: true }
);

const speedLabel = computed(() => {
  const { min, max } = speedInput.value;
  if (min <= 0 && max >= SPEED_MAX) return t("browse.filters.speedAny");
  if (max >= SPEED_MAX) return t("browse.filters.speedFrom", { min: n(min) });
  return t("browse.filters.speedRange", { min: n(min), max: n(max) });
});

function onSpeedInput(value: number | HLabeledSliderRange) {
  if (typeof value === "number") return;
  speedInput.value = value;
}

function commitSpeed() {
  apply({
    ...currentFilters(),
    smin: speedInput.value.min,
    smax: speedInput.value.max
  });
}

/** How many videos the speed window drops purely for carrying no measurement
 * (1.2% of the catalog, scattered by age rather than all recent). Stated
 * outright: a filter that silently removes what it cannot judge is the same
 * failure as the muted-tag gate this app already discloses. Computed only
 * while the filter is on, and the pool is the gated catalog so the number
 * matches what the grid is drawn from. */
const unmeasured = computed(() =>
  speedActive.value && catalog.status === "ready"
    ? unmeasuredCount(catalog.visible)
    : 0
);

// --- pickers: add a tag / choose a site or performer without leaving the
// page ---

interface PickOption {
  label: string;
  value: string;
}

const tagNeedle = ref("");
const siteNeedle = ref("");
const performerNeedle = ref("");
const scripterNeedle = ref("");

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

// unlike the other three this is a closed, tiny set — 17 people across the
// whole index — so the list is offered whole and the search box is a
// courtesy rather than the only way through it
const allScripters = computed(() =>
  catalog.status === "ready" ? scriptersOf(catalog.visible) : []
);

const scripterOptions = computed<PickOption[]>(() =>
  allScripters.value
    .filter(summary =>
      summary.name.toLowerCase().includes(scripterNeedle.value)
    )
    .map(summary => ({
      label: t("browse.filters.option", {
        name: summary.name,
        count: n(summary.count)
      }),
      value: summary.name
    }))
);

function filterScripters(input: string, update: (fn: () => void) => void) {
  update(() => {
    scripterNeedle.value = input.trim().toLowerCase();
  });
}

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
  if (scripter.value) {
    list.push({
      key: "scripter",
      label: scripter.value,
      icon: "edit_note",
      remove: removeScripter
    });
  }
  return list;
});

// the chip is a button whose whole job is removing the filter it names, and
// the name is catalog data — a tag, a site, a performer
function chipRemoveAria(chip: FilterChip): string {
  return t("browse.chip.removeAria", { label: chip.label });
}

// --- results: byTags → byPartner → byPerformer → vrOnly → clip → scripter
// → added → duration → search → sort ---

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
  if (clip.value) out = withPreview(out);
  if (scripter.value) out = byScripter(out, scripter.value);
  if (since.value) out = addedWithin(out, since.value);
  out = byDurationRange(
    out,
    durationMin.value * 60,
    durationMax.value >= DURATION_MAX ? Infinity : durationMax.value * 60
  );
  out = bySpeedRange(
    out,
    speedMin.value,
    speedMax.value >= SPEED_MAX ? Infinity : speedMax.value
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
  // the kit caps at 560; on a narrow phone a fixed 480 would overhang
  max-width: 100%;
}

// Wide screens get two columns and the room to hold them. HModal's 560px cap
// is a kit rule and the kit is never forked, so it is overridden here, from
// the consumer, and only above the breakpoint — the doubled class buys the
// specificity to beat the component's own scoped rule without !important.
// Justification for departing from the 560 rule: this dialog carries thirteen
// controls, and one 560px column makes it a scroller on a 27" display.
@media (min-width: 1024px) {
  .videos-page__filters.videos-page__filters {
    width: 900px;
    max-width: calc(100vw - 2 * var(--space-lg));
  }
}

.videos-page__filters-stack {
  display: grid;
  gap: var(--space-sm);
  // columns are independent stacks, not a flowing masonry: the split is
  // semantic (page filters | standing preferences), so a section must never
  // migrate across it to even the heights out
  align-items: start;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-md);
  }
}

.videos-page__filters-col {
  display: grid;
  gap: var(--space-sm);
  align-content: start;
  // grid children default to auto min-width, which a long select label
  // stretches past its track
  min-width: 0;
}

.videos-page__group {
  display: grid;
  gap: var(--space-sm);
  min-width: 0;
}

// matches the HList card title (text-h5) but sits on the dialog surface
// rather than on a card, so it carries no inset padding of its own
.videos-page__group-title {
  margin: 0;
  color: var(--color-text-primary);
}

.videos-page__group-caption {
  margin: calc(var(--space-sm) * -1) 0 0;
  color: var(--color-text-tertiary);
  text-wrap: balance;
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

.videos-page__note {
  margin: calc(var(--space-xs) * -1) 0 0;
  color: var(--color-text-tertiary);
}

.videos-page__grid {
  margin-top: var(--space-lg);
}
</style>
