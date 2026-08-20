<template>
  <q-page class="home">
    <!-- Error: the index is the whole app, so failing to load it is a page
         state, not a toast -->
    <div v-if="catalog.status === 'error'" class="h-section">
      <div class="h-container home-error">
        <HEmptyState
          icon="cloud_off"
          title="Couldn't load the catalog"
          body="The script index didn't answer. Check your connection and try again."
          action-label="Try again"
          @action="catalog.retry()"
        />
      </div>
    </div>

    <template v-else>
      <!-- Hero: latest featured pick -->
      <MediaHero
        v-if="featured"
        :artwork="artworkOf(featured)"
        :alt="featured.title ?? 'Featured video'"
      >
        <p class="text-h6 home-hero__kicker">Featured</p>
        <h1 class="text-h2 home-hero__title">{{ featured.title }}</h1>
        <div class="home-hero__chips">
          <HChip v-if="featured.partnerName" :label="featured.partnerName" />
          <HChip
            v-if="featured.duration"
            icon="schedule"
            :label="formatDuration(featured.duration)"
          />
          <HChip
            v-if="featured.format?.format === 'vr'"
            icon="view_in_ar"
            label="VR"
          />
        </div>
        <div class="home-hero__ctas">
          <HBtn
            label="View video"
            arrow
            :to="`/videos/${featured.partnerVideoId}`"
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
          <h1 class="text-h2 home-hero__title">Nothing to feature</h1>
          <p class="text-body-sm home-hero-empty__body">
            Your filters and muted tags hide the whole catalog. Loosen them in
            settings.
          </p>
        </div>
      </section>

      <!-- The shelves -->
      <div class="home-rows">
        <template v-if="catalog.status === 'ready'">
          <CarouselRow
            v-for="row in rows"
            :key="row.key"
            :title="row.title"
            :videos="row.videos"
            :to="row.to"
            :hint="row.hint"
          />
          <div v-if="!rows.length" class="h-container home-empty">
            <HEmptyState
              icon="filter_alt_off"
              title="Nothing to show"
              body="Your filters and muted tags hide the whole catalog. Loosen them in settings."
            />
          </div>
        </template>
        <template v-else>
          <CarouselRow v-for="n in 4" :key="`skeleton-${n}`" loading />
        </template>
      </div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { HBtn, HChip, HEmptyState, HandyLoader } from "@/components/handy";
import CarouselRow from "@/components/CarouselRow.vue";
import MediaHero from "@/components/MediaHero.vue";
import { formatDuration } from "@/services/format";
import {
  artworkOf,
  byTag,
  featuredPick,
  hasMutedTag,
  inOrder,
  mostPlayed,
  recentFirst,
  recentlyUpdatedFirst,
  tagsOf,
  topRated,
  topTags,
  vrOnly,
  withThumbnail
} from "@/services/script-index/queries";
import type { PartnerVideo } from "@/services/script-index/types";
import { useCatalogStore } from "@/stores/catalog";
import { useSettingsStore } from "@/stores/settings";

const ROW_SIZE = 20;
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
}

const catalog = useCatalogStore();
const settings = useSettingsStore();

const featured = computed(() =>
  catalog.status === "ready"
    ? featuredPick(catalog.visible, catalog.brokenArtwork)
    : undefined
);

function titleCase(tag: string): string {
  return tag.charAt(0).toUpperCase() + tag.slice(1);
}

const rows = computed<Row[]>(() => {
  // home is a visual browse surface: a card without artwork — no link at
  // all, or a link the broken-artwork registry knows is dead — is just a
  // grey tile, so the catalog shelves only draw from illustrated videos.
  // Personal shelves (favorites, recently viewed) stay complete — hiding
  // something the user saved would read as data loss.
  const pool = withThumbnail(catalog.visible, catalog.brokenArtwork);

  const rowTags = topTags(pool, 12)
    .filter(tag => !EXCLUDED_ROW_TAGS.has(tag))
    .slice(0, 4);

  const tagRows: Row[] = rowTags.map(tag => ({
    key: `tag-${tag}`,
    title: titleCase(tag),
    videos: recentFirst(byTag(pool, tag)).slice(0, ROW_SIZE),
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
      title: `Because you like ${tag}`,
      videos: recentFirst(byTag(pool, tag)).slice(0, ROW_SIZE),
      to: `/videos?tag=${encodeURIComponent(tag)}`
    }));

  const allRows: Row[] = [
    {
      key: "recent",
      title: "Recently added",
      videos: recentFirst(pool).slice(0, ROW_SIZE),
      to: "/videos"
    },
    {
      key: "favorites",
      title: "My favorites",
      videos: recentFirst(catalog.favorites).slice(0, ROW_SIZE),
      to: "/favorites"
    },
    {
      // full catalog on purpose: you should always see what you just viewed,
      // even when the orientation/premium filters would hide it. Muted tags
      // are the exception — a mute is aversion rather than narrowing, and
      // home is the one surface you can't avoid. recordView keeps recording,
      // so unmuting restores the row intact.
      key: "recently-viewed",
      title: "Recently viewed",
      videos: inOrder(catalog.videos, settings.recentlyViewed)
        .filter(video => !hasMutedTag(video, settings.mutedSet))
        .slice(0, ROW_SIZE),
      to: "/history",
      hint: "Only stored in this browser — your viewing history is never tracked or sent anywhere."
    },
    ...likeRows,
    {
      key: "top-rated",
      title: "Top rated",
      videos: topRated(pool).slice(0, ROW_SIZE),
      to: "/videos?sort=top"
    },
    {
      key: "most-played",
      title: "Most played",
      videos: mostPlayed(pool).slice(0, ROW_SIZE),
      to: "/videos?sort=plays"
    },
    {
      key: "vr",
      title: "VR",
      videos: recentFirst(vrOnly(pool)).slice(0, ROW_SIZE),
      to: "/videos?vr=1"
    },
    ...tagRows,
    {
      key: "updated",
      title: "Recently updated",
      videos: recentlyUpdatedFirst(pool).slice(0, ROW_SIZE),
      to: "/videos?sort=updated"
    }
  ];

  return allRows.filter(row =>
    MIN_EXEMPT_ROW_KEYS.has(row.key)
      ? row.videos.length > 0
      : row.videos.length >= MIN_ROW_VIDEOS
  );
});
</script>

<style scoped lang="scss">
.home {
  padding-bottom: var(--space-3xl);
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
</style>
