<template>
  <q-page class="performers-page">
    <div class="h-section">
      <div class="h-container">
        <div v-if="catalog.status === 'error'" class="performers-page__center">
          <HEmptyState
            icon="cloud_off"
            :title="$t('performers.errorTitle')"
            :body="$t('common.state.catalogErrorBody')"
            :action-label="$t('common.action.retry')"
            @action="catalog.retry()"
          />
        </div>

        <template v-else>
          <header class="performers-page__header">
            <h1 class="text-h2 performers-page__title">
              {{ $t("performers.title") }}
            </h1>
            <p
              v-if="catalog.status === 'ready'"
              class="text-body-sm performers-page__count"
            >
              {{ countLabel }}
            </p>
            <GateNotice v-if="catalog.status === 'ready'" />
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
                :placeholder="$t('performers.search.placeholder')"
                :aria-label="$t('performers.search.aria')"
                class="performers-page__search"
              >
                <template #prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
              <q-select
                v-model="sortKey"
                :options="sortOptions"
                emit-value
                map-options
                filled
                dense
                :aria-label="$t('performers.sort.aria')"
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
                :aria-label="
                  sortDir === 'desc'
                    ? $t('performers.sort.descAria')
                    : $t('performers.sort.ascAria')
                "
                :title="
                  sortDir === 'desc'
                    ? $t('performers.sort.descTitle')
                    : $t('performers.sort.ascTitle')
                "
                class="performers-page__dir"
                @click="flipDir"
              />
              <HBtn
                variant="secondary"
                icon="tune"
                :label="filtersLabel"
                @click="openFilters"
              />
            </div>

            <div v-if="chips.length" class="performers-page__chips">
              <button
                v-for="chip in chips"
                :key="chip.key"
                type="button"
                class="performers-page__chip"
                :aria-label="
                  $t('browse.chip.removeAria', { label: chip.label })
                "
                @click="chip.remove()"
              >
                <HChip icon="tune">
                  {{ chip.label }}
                  <q-icon
                    name="close"
                    size="16px"
                    class="performers-page__chip-close"
                  />
                </HChip>
              </button>
            </div>

            <!-- a property sort says up front what it does with the
                 performers it can't place -->
            <p
              v-if="profileSort && traitFilter.status.value === 'ready'"
              class="text-caption performers-page__note"
            >
              {{ $t("performers.sort.unknownLast") }}
            </p>

            <!-- a property sort needs the profile list, fetched on first use -->
            <div
              v-if="profileSort && traitFilter.status.value === 'error'"
              class="performers-page__center"
            >
              <HEmptyState
                icon="cloud_off"
                :title="$t('performers.filters.errorTitle')"
                :body="$t('performers.sort.profilesError')"
                :action-label="$t('common.action.retry')"
                @action="traitFilter.load()"
              />
            </div>

            <div
              v-else-if="profileSort && traitFilter.status.value !== 'ready'"
              class="performers-page__center"
            >
              <HandyLoader />
            </div>

            <div v-else-if="!filtered.length" class="performers-page__center">
              <!-- the property filters first: with them on, a name that
                   exists can still find no one, and clearing the search
                   would not bring anyone back -->
              <HEmptyState
                v-if="traitFilter.activeCount.value"
                icon="filter_alt_off"
                :title="$t('performers.noMatchTitle')"
                :body="$t('performers.filters.noMatchBody')"
                :action-label="$t('common.action.clearFilters')"
                @action="traitFilter.clear()"
              />
              <HEmptyState
                v-else-if="needle"
                icon="person_search"
                :title="$t('performers.noMatchTitle')"
                :body="$t('performers.noMatchBody', { query: needle })"
                :action-label="$t('common.action.clearSearch')"
                @action="query = ''"
              />
              <HEmptyState
                v-else
                icon="filter_alt_off"
                :title="$t('common.state.emptyTitle')"
                :body="$t('performers.hiddenBody')"
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
                    <!-- their most played clip on hover or touch, over
                         their picture — the video cards' own preview -->
                    <MediaPreview
                      v-if="settings.nsfw && avatarOf(performer)"
                      :ref="el => setPreview(performer.performerId, el)"
                      :poster="avatarOf(performer)"
                      :preview="previews.get(performer.performerId) ?? ''"
                      :alt="performer.name"
                      :enabled="settings.performerCardPreviews"
                      class="tile-card__img"
                      @active="on => onPreviewActive(performer.performerId, on)"
                    />
                    <div v-else class="tile-card__placeholder">
                      <q-icon name="person" size="32px" />
                    </div>
                  </template>
                  <!-- on touch, a tap opens the performer, so the preview
                       hover gives a mouse gets a button of its own here —
                       outside the card's link, like the video cards' menu -->
                  <template
                    v-if="
                      !canHover &&
                      settings.nsfw &&
                      settings.performerCardPreviews &&
                      avatarOf(performer) &&
                      previews.has(performer.performerId)
                    "
                    #action
                  >
                    <button
                      type="button"
                      class="performer-card__play"
                      :aria-label="
                        playing === performer.performerId
                          ? $t('performers.card.previewStop', {
                              name: performer.name
                            })
                          : $t('performers.card.previewPlay', {
                              name: performer.name
                            })
                      "
                      :aria-pressed="playing === performer.performerId"
                      @touchstart.stop
                      @click="togglePreview(performer.performerId)"
                    >
                      <q-icon
                        :name="
                          playing === performer.performerId
                            ? 'pause'
                            : 'play_arrow'
                        "
                        size="22px"
                      />
                    </button>
                  </template>
                  <div class="text-body-compact performer-card__name">
                    {{ performer.name }}
                  </div>
                  <div class="text-caption performer-card__videos">
                    <span>{{ videoLabel(performer) }}</span>
                    <!-- sorted by plays or a profile property, the card shows
                         the value the order comes from; otherwise the partner
                         sites' rating -->
                    <span v-if="profileSort" class="performer-card__stat">
                      {{ traitStat(performer) }}
                    </span>
                    <template v-else-if="sortKey === 'plays'">
                      <span
                        v-if="performer.plays"
                        class="performer-card__stat"
                        :title="playsLabel(performer)"
                        :aria-label="playsLabel(performer)"
                      >
                        <q-icon name="play_arrow" size="1.2em" />
                        {{ num(performer.plays) }}
                      </span>
                    </template>
                    <span
                      v-else-if="performer.avgRating"
                      class="performer-card__stat"
                    >
                      {{
                        $t("performers.ratingBadge", {
                          rating: $n(Math.round(performer.avgRating))
                        })
                      }}
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

    <PerformerFiltersDialog
      v-model="filtersOpen"
      :status="traitFilter.status.value"
      :filters="traitFilter.filters"
      :counts="traitFilter.counts.value"
      :active-count="traitFilter.activeCount.value"
      @toggle="traitFilter.toggle"
      @set-range="traitFilter.setRange"
      @clear="traitFilter.clear()"
      @retry="traitFilter.load()"
    />
  </q-page>
</template>

<script setup lang="ts">
// Every performer in the catalog as a square avatar card, biggest
// filmography first. Name search and the property filters (hair, eyes, cup
// size, age, …) narrow the list; cards reveal 48 at a time via endless
// scroll. Cards link into /videos pre-filtered on the performer.
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { HBtn, HChip, HEmptyState, HandyLoader } from "@/components/handy";
import GateNotice from "@/components/GateNotice.vue";
import MediaPreview from "@/components/MediaPreview.vue";
import { canHover } from "@/composables/useCanHover";
import PerformerFiltersDialog from "@/components/PerformerFiltersDialog.vue";
import TileCard from "@/components/TileCard.vue";
import { useFormat } from "@/composables/useFormat";
import { useIncrementalReveal } from "@/composables/useIncrementalReveal";
import { usePerformerFilterLabels } from "@/composables/usePerformerFilterLabels";
import { usePerformerFilters } from "@/composables/usePerformerFilters";
import { usePerformerPictures } from "@/composables/usePerformerProfile";
import {
  feetAndInches,
  pounds
} from "@/services/script-index/performer-profile";
import {
  SORTABLE_TRAITS,
  isSortableTrait,
  traitOrder,
  type SortableTrait
} from "@/services/script-index/performer-traits";
import {
  performersOf,
  topPreviewByPerformer,
  type PerformerSummary
} from "@/services/script-index/queries";
import { useCatalogStore } from "@/stores/catalog";
import { useSettingsStore } from "@/stores/settings";

const PAGE_SIZE = 48;

type SortKey = "count" | "plays" | "rating" | "name" | SortableTrait;
type SortDir = "asc" | "desc";

// the direction each sort naturally produces; flipping away reverses the list.
// The profile properties start low to high — youngest, shortest, smallest —
// like a ruler; the arrow turns them round.
const NATURAL_DIR: Record<SortKey, SortDir> = {
  count: "desc",
  plays: "desc",
  rating: "desc",
  name: "asc",
  age: "asc",
  height: "asc",
  weight: "asc",
  bmi: "asc",
  cup: "asc"
};

/** rated videos a performer needs before their average ranks at full weight —
 * same idea as the video vote floor, so one rated video can't top the list */
const RATED_VIDEO_FLOOR = 3;

const catalog = useCatalogStore();
const settings = useSettingsStore();
const { t, n } = useI18n();
const { count, num, ofTotal } = useFormat();

// clearable q-input emits null on clear
const query = ref<string | null>("");
const sortKey = ref<SortKey>("count");
const sortDir = ref<SortDir>(NATURAL_DIR[sortKey.value]);

// a computed, not a module constant: the labels have to be re-read when the
// language changes, and a `const` at import time would freeze them in English
const sortOptions = computed<{ label: string; value: SortKey }[]>(() => [
  { label: t("performers.sort.count"), value: "count" },
  { label: t("performers.sort.plays"), value: "plays" },
  { label: t("performers.sort.rating"), value: "rating" },
  { label: t("performers.sort.name"), value: "name" },
  ...SORTABLE_TRAITS.map(key => ({
    label: t(`performers.sort.${key}`),
    value: key
  }))
]);

// picking a new sort resets to that sort's natural direction
watch(sortKey, key => {
  sortDir.value = NATURAL_DIR[key];
});

function flipDir() {
  sortDir.value = sortDir.value === "desc" ? "asc" : "desc";
}

// the whole roster, orientation gate lifted (catalog.anyOrientation): a
// performer is a person in the index, not a preference
const all = computed(() =>
  catalog.status === "ready" ? performersOf(catalog.anyOrientation) : []
);

// how many of each performer's videos the orientation gate lets through, so
// the card can move when you switch orientation without dropping the person.
// null on "Everything": nothing is being narrowed, so there is no second
// number to show and the second pass isn't worth taking.
const matching = computed(() => {
  if (settings.orientation === "all" || catalog.status !== "ready") return null;
  const counts = new Map<string, number>();
  for (const summary of performersOf(catalog.visible)) {
    counts.set(summary.performerId, summary.count);
  }
  return counts;
});

/** the sort is by a profile property rather than by what the catalog knows */
const profileSort = computed<SortableTrait | null>(() =>
  isSortableTrait(sortKey.value) ? sortKey.value : null
);

/** The clip each card previews: their most played video that has one, from
 * the gated catalog — a video a mute or the orientation filter keeps out of
 * the grid doesn't play here either. Only while previews can show at all. */
const previews = computed(() =>
  settings.nsfw && catalog.status === "ready"
    ? topPreviewByPerformer(catalog.visible)
    : new Map<string, string>()
);

// --- the play button on touch: the card's own preview, started and stopped
// by hand ---

interface PreviewHandle {
  start: () => void;
  stop: () => void;
}

const previewHandles = new Map<string, PreviewHandle>();

function setPreview(id: string, el: unknown) {
  if (el) previewHandles.set(id, el as PreviewHandle);
  else previewHandles.delete(id);
}

/** the performer whose card is previewing, "" for none — kept from the
 * preview's own reports, so the button turns back when the preview stops for
 * any reason (another card, a scroll away) */
const playing = ref("");

function onPreviewActive(id: string, on: boolean) {
  if (on) playing.value = id;
  else if (playing.value === id) playing.value = "";
}

function togglePreview(id: string) {
  const handle = previewHandles.get(id);
  if (playing.value === id) handle?.stop();
  else handle?.start();
}

// --- property filters ---

// Not destructured: the template reads it as one object, and the dialog's
// props are its fields.
const traitFilter = usePerformerFilters(all);
const filtersOpen = ref(false);

/** the profile list behind the filters is fetched on first open, not with
 * the page — most visits never filter */
function openFilters() {
  filtersOpen.value = true;
  void traitFilter.load();
}

// a property sort needs the same profile list as the filters
watch(profileSort, key => {
  if (key) void traitFilter.load();
});

const filtersLabel = computed(() =>
  traitFilter.activeCount.value
    ? t("browse.toolbar.filtersCount", {
        count: n(traitFilter.activeCount.value)
      })
    : t("browse.toolbar.filters")
);

const { facetChip, rangeChip } = usePerformerFilterLabels();

/** one chip per facet or band in use; removing it clears that one */
const chips = computed(() => [
  ...traitFilter.activeFacets.value.map(facet => ({
    key: facet,
    label: facetChip(facet, traitFilter.filters.codes[facet]),
    remove: () => traitFilter.clearFacet(facet)
  })),
  ...traitFilter.activeRanges.value.map(key => ({
    key,
    label: rangeChip(key, traitFilter.filters.ranges[key]),
    remove: () => traitFilter.clearRange(key)
  }))
]);

const needle = computed(() => (query.value ?? "").trim());

const filtered = computed(() => {
  const search = needle.value.toLowerCase();
  const pool = traitFilter.results.value;
  const matches = search
    ? pool.filter(performer => performer.name.toLowerCase().includes(search))
    : pool;
  const trait = profileSort.value;
  if (trait) return byTrait(matches, trait);
  let ordered: readonly PerformerSummary[];
  if (sortKey.value === "name") {
    ordered = [...matches].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortKey.value === "plays") {
    // summed, not averaged: a performer people come back to across many
    // videos is more popular than one with a single well-played script
    ordered = [...matches].sort(
      (a, b) => b.plays - a.plays || b.count - a.count
    );
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

/**
 * Ordered by a profile property, in the chosen direction. Whoever's profile
 * doesn't say comes last either way — most of the index for any one
 * property — so turning the order round shows the other end of the people
 * it can place, not a screenful of blanks. Ties, and the unplaced, go
 * biggest filmography first.
 */
function byTrait(
  list: readonly PerformerSummary[],
  key: SortableTrait
): PerformerSummary[] {
  const known = traitFilter.traits.value;
  if (!known) return [...list];
  const sign = sortDir.value === "asc" ? 1 : -1;
  const value = (performer: PerformerSummary) =>
    traitOrder(known.get(performer.performerId), key);
  return [...list].sort((a, b) => {
    const av = value(a);
    const bv = value(b);
    if (av === undefined || bv === undefined) {
      if (av !== bv) return av === undefined ? 1 : -1;
      return b.count - a.count;
    }
    return sign * (av - bv) || b.count - a.count;
  });
}

const { shown, done, sentinel } = useIncrementalReveal(filtered, PAGE_SIZE);

// Some performers have no picture on any of their videos (Lana Rhoades), or
// one whose host has dropped it (Alex Adams) — but a working one in their
// profile. Those are looked up for the cards on screen, after the page is
// complete: the grid renders exactly as before and the pictures arrive into
// it. A card whose picture fails while you look re-runs this through the
// broken-artwork set. Not at all while explicit images are off.
const { pictures, findPictures, working } = usePerformerPictures();

watch(
  [shown, () => settings.nsfw, () => catalog.brokenArtwork.size],
  ([list, nsfw]) => {
    if (!nsfw) return;
    const missing = list
      .filter(performer => !working(performer.avatar))
      .map(performer => performer.performerId);
    if (missing.length) void findPictures(missing);
  },
  { immediate: true }
);

/** empty when there is none (yet) */
function avatarOf(performer: PerformerSummary): string {
  return working(performer.avatar)
    ? performer.avatar
    : (pictures.get(performer.performerId) ?? "");
}

const countLabel = computed(() => {
  const total = count("performers", all.value.length);
  return needle.value || traitFilter.activeCount.value
    ? ofTotal(filtered.value.length, all.value.length, "performers")
    : total;
});

function videoLabel(performer: PerformerSummary): string {
  const total = count("videos", performer.count);
  const counts = matching.value;
  // "38 of 300 videos" — the total stays the headline because that is what
  // opening the performer actually shows
  return counts
    ? ofTotal(counts.get(performer.performerId) ?? 0, performer.count, "videos")
    : total;
}

/** the value a property sort orders this card by, as the card prints it;
 * empty where the profile doesn't say */
function traitStat(performer: PerformerSummary): string {
  const traits = traitFilter.traits.value?.get(performer.performerId);
  switch (profileSort.value) {
    case "age":
      return traits?.age
        ? t("performers.card.age", { age: n(traits.age) })
        : "";
    case "height": {
      if (!traits?.height) return "";
      const { feet, inches } = feetAndInches(traits.height);
      return t("performers.card.height", {
        cm: n(traits.height),
        feet: n(feet),
        inches: n(inches)
      });
    }
    case "weight":
      return traits?.weight
        ? t("performers.card.weight", {
            kg: n(traits.weight),
            lb: n(pounds(traits.weight))
          })
        : "";
    case "bmi": {
      // build is shown as what it is made of — height and weight — rather
      // than as a score beside the person
      if (!traits?.height || !traits.weight) return "";
      const { feet, inches } = feetAndInches(traits.height);
      const height = t("performers.card.height", {
        cm: n(traits.height),
        feet: n(feet),
        inches: n(inches)
      });
      const weight = t("performers.card.weight", {
        kg: n(traits.weight),
        lb: n(pounds(traits.weight))
      });
      return `${height} · ${weight}`;
    }
    case "cup":
      return traits?.cup ? t("performers.card.cup", { cup: traits.cup }) : "";
    default:
      return "";
  }
}

function playsLabel(performer: PerformerSummary): string {
  return t(
    "performers.profile.plays",
    { count: num(performer.plays) },
    performer.plays
  );
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

.performers-page__note {
  margin: calc(var(--space-xs) * -1) 0 var(--space-md);
  color: var(--color-text-tertiary);
}

.performers-page__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin: calc(var(--space-xs) * -1) 0 var(--space-md);
}

// naked button around the chip so the whole pill is the remove target
.performers-page__chip {
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

.performers-page__chip-close {
  color: var(--color-text-tertiary);
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

// round and translucent over the picture, like the slideshow's arrows
.performer-card__play {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--color-bg-card) 75%, transparent);
  color: var(--color-text-primary);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  cursor: pointer;

  &[aria-pressed="true"] {
    background: var(--color-action-primary);
    color: var(--color-action-primary-label);
  }

  &:focus-visible {
    outline: 2px solid var(--color-stroke-focus);
    outline-offset: 2px;
  }
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
  // "38 of 300 videos" and a rating don't share a 160px tile — let the rating
  // drop to its own line rather than push the count out of the card
  flex-wrap: wrap;
}

.performer-card__stat {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}
</style>
