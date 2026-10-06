<template>
  <q-page class="home">
    <!-- Error: the index is the whole app, so failing to load it is a page
         state, not a toast -->
    <div v-if="catalog.status === 'error'" class="h-section">
      <div class="h-container home-error">
        <HEmptyState
          icon="cloud_off"
          :title="$t('common.state.catalogErrorTitle')"
          :body="$t('common.state.catalogErrorBody')"
          :action-label="$t('common.action.retry')"
          @action="catalog.retry()"
        />
      </div>
    </div>

    <template v-else>
      <!-- Hero: latest featured pick -->
      <MediaHero
        v-if="featured"
        :artwork="artworkOf(featured)"
        :alt="featured.title ?? $t('home.hero.alt')"
      >
        <p class="text-h6 home-hero__kicker">{{ $t("home.hero.kicker") }}</p>
        <h1 class="text-h2 home-hero__title">{{ featured.title }}</h1>
        <div class="home-hero__chips">
          <HChip v-if="featured.partnerName" :label="featured.partnerName" />
          <HChip
            v-if="featured.duration"
            icon="schedule"
            :label="format.duration(featured.duration)"
          />
          <HChip
            v-if="featured.format?.format === 'vr'"
            icon="view_in_ar"
            label="VR"
          />
        </div>
        <div class="home-hero__ctas">
          <HBtn
            :label="$t('home.hero.cta')"
            arrow
            :to="`/videos/${featured.partnerVideoId}`"
            @click="noteVideoShelf(featured.partnerVideoId, 'hero')"
          />
        </div>
      </MediaHero>
      <section v-else-if="catalog.status !== 'ready'" class="home-hero-loading">
        <HandyLoader />
      </section>
      <!-- ready but nothing to feature (filters/mutes emptied the pool):
           without this the page opens with neither hero nor loader -->
      <section v-else class="h-section home-hero-empty">
        <div class="h-container">
          <h1 class="text-h2 home-hero__title">
            {{ $t("home.hero.emptyTitle") }}
          </h1>
          <p class="text-body-sm home-hero-empty__body">
            {{ $t("home.filteredOutBody") }}
          </p>
        </div>
      </section>

      <!-- where the old site went: returning visitors land here first -->
      <div class="h-container">
        <OldSiteNote class="home-old-site" />
      </div>

      <!-- Catalog size. The whole index rather than the gated view — it
           describes the database — and last month on the day videos went
           live, which is final once the month ends (see publishedBetween).
           Each count is a slot so the number can carry its own weight while
           the sentence around it stays one translatable unit. -->
      <div v-if="catalog.status === 'ready'" class="h-container">
        <p class="text-body-sm home-stats">
          <i18n-t
            keypath="home.stats.total"
            :plural="stats.total"
            tag="span"
            scope="global"
          >
            <template #count>
              <strong class="home-stats__num">{{
                format.num(stats.total)
              }}</strong>
            </template>
          </i18n-t>
          <span class="home-stats__sep" aria-hidden="true">·</span>
          <i18n-t
            keypath="home.stats.lastMonth"
            :plural="stats.lastMonth"
            tag="span"
            scope="global"
          >
            <template #count>
              <strong class="home-stats__num">{{
                format.num(stats.lastMonth)
              }}</strong>
            </template>
            <template #month>{{ stats.month }}</template>
          </i18n-t>
        </p>
      </div>

      <!-- The shelves -->
      <div class="home-rows">
        <template v-if="catalog.status === 'ready'">
          <CarouselRow
            v-for="row in shownRows"
            :key="row.key"
            :title="row.title"
            :videos="row.videos"
            :to="row.to"
            :hint="row.hint"
            :clear-label="row.clearLabel"
            :shelf="row.key"
            @clear="clearHistoryOpen = true"
          />
          <div v-if="!rowsDone" ref="rowSentinel" class="home-rows__sentinel" />
          <div v-if="!rows.length" class="h-container home-empty">
            <HEmptyState
              icon="filter_alt_off"
              :title="$t('common.state.emptyTitle')"
              :body="$t('home.filteredOutBody')"
            />
          </div>
        </template>
        <template v-else>
          <CarouselRow v-for="n in 4" :key="`skeleton-${n}`" loading />
        </template>
      </div>

      <!-- Clearing viewing history is one click from the shelf, so it asks -->
      <q-dialog v-model="clearHistoryOpen">
        <HModal :title="$t('home.clearHistory.title')">
          {{ $t("home.clearHistory.body") }}
          <template #actions>
            <HBtn
              variant="tertiary"
              :label="$t('common.action.cancel')"
              @click="clearHistoryOpen = false"
            />
            <HBtn
              variant="danger"
              :label="$t('home.clearHistory.confirm')"
              @click="clearHistory"
            />
          </template>
        </HModal>
      </q-dialog>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import {
  HBtn,
  HChip,
  HEmptyState,
  HModal,
  HandyLoader,
  hToast
} from "@/components/handy";
import CarouselRow from "@/components/CarouselRow.vue";
import MediaHero from "@/components/MediaHero.vue";
import OldSiteNote from "@/components/OldSiteNote.vue";
import { useFormat } from "@/composables/useFormat";
import { useIncrementalReveal } from "@/composables/useIncrementalReveal";
import {
  artworkOf,
  byTag,
  featuredPick,
  hasMutedTag,
  inOrder,
  mostPlayed,
  publishedBetween,
  recentFirst,
  recentlyUpdatedFirst,
  tagsOf,
  topRated,
  topTags,
  vrOnly,
  withThumbnail
} from "@/services/script-index/queries";
import { noteVideoShelf } from "@/services/analytics";
import type { PartnerVideo } from "@/services/script-index/types";
import { useCatalogStore } from "@/stores/catalog";
import { useSettingsStore } from "@/stores/settings";

// survives navigation away from home so the next visit can pick something
// else — a page-local ref would reset with the component
let lastFeaturedId: string | undefined;

const ROW_SIZE = 20;

/** Shelves drawn up front, and added each time the reader nears the last.
 * All eleven at once was the homepage's biggest freeze on a slow phone — each
 * is a carousel of 20 cards that measures itself on mount — and on a phone
 * screen only the first one or two are in view. */
const ROWS_PER_REVEAL = 3;
const MIN_ROW_VIDEOS = 5;

// tags that describe orientation/format rather than content — they already
// exist as filters or dedicated rows, so they'd make redundant shelves
const EXCLUDED_ROW_TAGS = new Set([
  "straight",
  "gay",
  "trans",
  "vr",
  "vr porn",
  "180",
  "360",
  "hd porn"
]);

// personal shelves appear from their first video; catalog shelves need
// enough cards to actually scroll
const MIN_EXEMPT_ROW_KEYS = new Set(["favorites", "recently-viewed"]);

interface Row {
  key: string;
  title: string;
  videos: PartnerVideo[];
  /** see-all destination for the clickable shelf header; empty = plain title */
  to: string;
  /** help-icon tooltip after the title (privacy notes and the like) */
  hint?: string;
  /** delete-icon tooltip after the title; the icon clears the shelf */
  clearLabel?: string;
}

const catalog = useCatalogStore();
const settings = useSettingsStore();
const { t } = useI18n();
const format = useFormat();

// only the recently-viewed shelf carries a clear icon, so the row event
// needs no key check
const clearHistoryOpen = ref(false);

function clearHistory(): void {
  clearHistoryOpen.value = false;
  settings.clearRecentlyViewed();
  hToast("info", t("home.clearHistory.done"));
}

// Re-rolled once per visit: rolling inside the computed instead would swap
// the hero mid-view every time a mute, a filter or a broken-artwork report
// changed the candidate list.
const heroSeed = ref(Math.random());
// captured at setup, so this visit knows the last one without depending on
// the value it is about to write
const previousFeaturedId = lastFeaturedId;

const featured = computed(() =>
  catalog.status === "ready"
    ? featuredPick(catalog.visible, catalog.brokenArtwork, {
        seed: heroSeed.value,
        exclude: previousFeaturedId
      })
    : undefined
);

watch(featured, video => {
  if (video) lastFeaturedId = video.partnerVideoId;
});

// Last month is the previous calendar month in the visitor's own time zone,
// so the window and the month name printed beside it are the same month.
// Month arithmetic below zero rolls back a year: January asks for December.
const stats = computed(() => {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const to = new Date(now.getFullYear(), now.getMonth(), 1);
  return {
    total: catalog.videos.length,
    lastMonth: publishedBetween(catalog.videos, from, to).length,
    month: format.month(from)
  };
});

function titleCase(tag: string): string {
  return tag.charAt(0).toUpperCase() + tag.slice(1);
}

/** The shelves drawn from the catalog itself, as opposed to the visitor's own
 * (favorites, history). */
interface CatalogShelves {
  /** what the catalog shelves draw from — see `rows` */
  pool: PartnerVideo[];
  rowTags: string[];
  byTag: Map<string, PartnerVideo[]>;
  recent: PartnerVideo[];
  topRated: PartnerVideo[];
  mostPlayed: PartnerVideo[];
  vr: PartnerVideo[];
  updated: PartnerVideo[];
}

// They only change when the gated catalog or the broken-artwork registry
// does, yet every visit to home rebuilt them, and that was most of what
// returning here cost on a slow phone. So they outlive the page, keyed on
// exactly those inputs: the registry by identity AND size, because it grows
// in place.
let shelfCache:
  | {
      visible: readonly PartnerVideo[];
      broken: ReadonlySet<string>;
      brokenSize: number;
      shelves: CatalogShelves;
    }
  | undefined;

function catalogShelves(
  visible: readonly PartnerVideo[],
  broken: ReadonlySet<string>
): CatalogShelves {
  const brokenSize = broken.size;
  if (
    shelfCache?.visible === visible &&
    shelfCache.broken === broken &&
    shelfCache.brokenSize === brokenSize
  ) {
    return shelfCache.shelves;
  }
  const pool = withThumbnail(visible, broken);
  const rowTags = topTags(pool, 12)
    .filter(tag => !EXCLUDED_ROW_TAGS.has(tag))
    .slice(0, 4);
  const shelves: CatalogShelves = {
    pool,
    rowTags,
    byTag: new Map(
      rowTags.map(tag => [tag, recentFirst(byTag(pool, tag), ROW_SIZE)])
    ),
    recent: recentFirst(pool, ROW_SIZE),
    topRated: topRated(pool, ROW_SIZE),
    mostPlayed: mostPlayed(pool, ROW_SIZE),
    vr: recentFirst(vrOnly(pool), ROW_SIZE),
    updated: recentlyUpdatedFirst(pool, ROW_SIZE)
  };
  shelfCache = { visible, broken, brokenSize, shelves };
  return shelves;
}

// Shelf titles are translated here rather than in a module-level table: a
// constant would be built once at import and keep its labels through a
// language switch, while this computed re-runs when the locale changes.
const rows = computed<Row[]>(() => {
  // home is a visual browse surface: a card without artwork — no link at
  // all, or a link the broken-artwork registry knows is dead — is just a
  // grey tile, so the catalog shelves only draw from illustrated videos.
  // Personal shelves (favorites, recently viewed) stay complete — hiding
  // something the user saved would read as data loss.
  const shelves = catalogShelves(catalog.visible, catalog.brokenArtwork);
  const { pool, rowTags } = shelves;

  const tagRows: Row[] = rowTags.map(tag => ({
    key: `tag-${tag}`,
    title: titleCase(tag),
    videos: shelves.byTag.get(tag) ?? [],
    to: `/videos?tag=${encodeURIComponent(tag)}`
  }));

  // "Because you like <tag>": the tags that recur across the user's
  // favorites, skipping ones that already have a generic shelf
  const usedTags = new Set(rowTags);
  const likeRows: Row[] = tagsOf(catalog.favorites)
    .filter(
      summary =>
        summary.count >= 2 &&
        !EXCLUDED_ROW_TAGS.has(summary.tag) &&
        !usedTags.has(summary.tag) &&
        // favorites are ungated, so a muted tag can reach here; dropping it
        // before the slice keeps the shelf rather than wasting the slot on a
        // row that would come back empty
        !settings.mutedSet.has(summary.tag)
    )
    .slice(0, 2)
    .map(({ tag }) => ({
      key: `like-${tag}`,
      title: t("home.rows.becauseYouLike", { tag }),
      videos: recentFirst(byTag(pool, tag), ROW_SIZE),
      to: `/videos?tag=${encodeURIComponent(tag)}`
    }));

  const allRows: Row[] = [
    {
      key: "recent",
      title: t("home.rows.recent"),
      videos: shelves.recent,
      to: "/videos"
    },
    {
      key: "favorites",
      title: t("home.rows.favorites"),
      videos: recentFirst(catalog.favorites, ROW_SIZE),
      to: "/favorites"
    },
    {
      // full catalog on purpose: you should always see what you just viewed,
      // even when the orientation/premium filters would hide it. Muted tags
      // are the exception — a mute is aversion rather than narrowing, and
      // home is the one surface you can't avoid. recordView keeps recording,
      // so unmuting restores the row intact.
      key: "recently-viewed",
      title: t("home.rows.recentlyViewed"),
      videos: inOrder(catalog.videos, settings.recentlyViewed)
        .filter(video => !hasMutedTag(video, settings.mutedSet))
        .slice(0, ROW_SIZE),
      to: "/history",
      hint: t("home.rows.recentlyViewedHint"),
      clearLabel: t("home.rows.recentlyViewedClear")
    },
    ...likeRows,
    {
      key: "top-rated",
      title: t("home.rows.topRated"),
      videos: shelves.topRated,
      to: "/videos?sort=top"
    },
    {
      key: "most-played",
      title: t("home.rows.mostPlayed"),
      videos: shelves.mostPlayed,
      to: "/videos?sort=plays"
    },
    {
      key: "vr",
      // the one shelf title that is not a message: "VR" is the same word in
      // every locale this app ships
      title: "VR",
      videos: shelves.vr,
      to: "/videos?vr=1"
    },
    ...tagRows,
    {
      key: "updated",
      title: t("home.rows.updated"),
      videos: shelves.updated,
      to: "/videos?sort=updated"
    }
  ];

  return allRows.filter(row =>
    MIN_EXEMPT_ROW_KEYS.has(row.key)
      ? row.videos.length > 0
      : row.videos.length >= MIN_ROW_VIDEOS
  );
});

const {
  shown: shownRows,
  done: rowsDone,
  sentinel: rowSentinel
} = useIncrementalReveal(rows, ROWS_PER_REVEAL, { reset: false });
</script>

<style scoped lang="scss">
.home {
  padding-bottom: var(--space-3xl);
}

.home-old-site {
  margin-top: var(--space-lg);
}

.home-error,
.home-empty {
  display: flex;
  justify-content: center;
}

// secondary ink tier on the scrim — Brand Blue is for action only (§5.2.3)
.home-hero__kicker {
  color: rgba(255, 255, 255, 0.72);
  margin: 0 0 var(--space-xs);
}

.home-hero__title {
  margin: 0;
  max-width: 22ch;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.home-hero__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-top: var(--space-sm);
}

.home-hero__ctas {
  margin-top: var(--space-md);
}

.home-hero-empty__body {
  color: var(--color-text-tertiary);
  margin: var(--space-xs) 0 0;
}

// a fact about the database, not a call to action: secondary ink for the
// words (tertiary would sit under AA on the gradient field), primary for the
// two figures that are the point
.home-stats {
  margin: var(--space-lg) 0 0;
  color: var(--color-text-secondary);
}

.home-stats__num {
  color: var(--color-text-primary);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.home-stats__sep {
  margin-inline: var(--space-xs);
}

.home-hero-loading {
  min-height: clamp(320px, 56vh, 560px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-page-alt);
}

.home-rows {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  margin-top: var(--space-xl);
}

.home-rows__sentinel {
  height: 1px;
}
</style>
