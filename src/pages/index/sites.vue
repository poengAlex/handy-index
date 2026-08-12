<template>
  <q-page class="sites-page">
    <div v-if="catalog.status === 'error'" class="h-section">
      <div class="h-container sites-page__center">
        <HEmptyState
          icon="cloud_off"
          title="Couldn't load sites"
          body="The script index didn't answer. Check your connection and try again."
          action-label="Try again"
          @action="catalog.retry()"
        />
      </div>
    </div>

    <div v-else-if="catalog.status !== 'ready'" class="sites-page__loading">
      <HandyLoader />
    </div>

    <div v-else class="h-section">
      <div class="h-container">
        <header class="sites-page__header">
          <h1 class="text-h2 sites-page__title">Sites</h1>
          <p class="text-body-sm sites-page__count">{{ countLabel }}</p>
          <p v-if="hiddenLabel" class="text-caption sites-page__hidden">
            {{ hiddenLabel }}
          </p>
        </header>

        <q-input
          :model-value="query"
          filled
          dense
          clearable
          placeholder="Search sites"
          aria-label="Search sites"
          class="sites-page__search"
          @update:model-value="query = String($event ?? '')"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <div v-if="!partners.length" class="sites-page__center">
          <HEmptyState
            icon="filter_alt_off"
            title="Nothing to show"
            body="Your premium filter and muted tags hide the whole catalog. Loosen them in settings."
          />
        </div>
        <div v-else-if="!filtered.length" class="sites-page__center">
          <HEmptyState
            icon="search_off"
            title="No sites match"
            body="No site names match that search. Try fewer letters."
          />
        </div>
        <div v-else class="sites-page__grid">
          <HNavCard
            v-for="partner in filtered"
            :key="partner.partnerId"
            icon="language"
            :label="partner.name"
            :caption="videoCountLabel(partner)"
            :to="`/videos?partnerId=${encodeURIComponent(partner.partnerId)}`"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
// The site directory: every partner in the catalog as a nav card,
// count-sorted by partnersOf, with a client-side name filter on top.
import { computed, ref } from "vue";
import { HEmptyState, HNavCard, HandyLoader } from "@/components/handy";
import {
  ORIENTATION_LABELS,
  partnersOf,
  type PartnerSummary
} from "@/services/script-index/queries";
import { useCatalogStore } from "@/stores/catalog";
import { useSettingsStore } from "@/stores/settings";

const catalog = useCatalogStore();
const settings = useSettingsStore();

const query = ref("");

// every site in the index, orientation gate lifted (catalog.anyOrientation) —
// a directory that hid sites would read as an incomplete index
const partners = computed(() => partnersOf(catalog.anyOrientation));

// how many of each site's videos the orientation gate lets through, so the
// caption can move when you switch orientation without dropping the site.
// null on "Everything": nothing is being narrowed, so there is no second
// number to show and the second pass isn't worth taking.
const matching = computed(() => {
  if (settings.orientation === "all") return null;
  const counts = new Map<string, number>();
  for (const summary of partnersOf(catalog.visible)) {
    counts.set(summary.partnerId, summary.count);
  }
  return counts;
});

const filtered = computed(() => {
  const needle = query.value.trim().toLowerCase();
  if (!needle) return partners.value;
  return partners.value.filter(partner =>
    partner.name.toLowerCase().includes(needle)
  );
});

// the two totals the per-site captions add up to, so the header explains the
// arithmetic instead of leaving "38 of 300" to be inferred
const totalVideos = computed(() => catalog.anyOrientation.length);

const hiddenVideos = computed(() => totalVideos.value - catalog.visible.length);

const countLabel = computed(() => {
  const sites = partners.value.length;
  const siteNoun = sites === 1 ? "site" : "sites";
  const videos = totalVideos.value;
  const videoNoun = videos === 1 ? "video" : "videos";
  return `${sites.toLocaleString()} ${siteNoun} · ${videos.toLocaleString()} ${videoNoun} in the index`;
});

const hiddenLabel = computed(() => {
  if (settings.orientation === "all" || !hiddenVideos.value) return "";
  const label = ORIENTATION_LABELS[settings.orientation];
  const noun = hiddenVideos.value === 1 ? "video" : "videos";
  return `${hiddenVideos.value.toLocaleString()} ${noun} hidden by the ${label} filter — that's the gap in each “X of Y” below.`;
});

function videoCountLabel(partner: PartnerSummary): string {
  const total = `${partner.count.toLocaleString()} ${partner.count === 1 ? "video" : "videos"}`;
  const counts = matching.value;
  // "38 of 300 videos" — the total stays the headline because that is what
  // opening the site actually shows
  const videos = counts
    ? `${(counts.get(partner.partnerId) ?? 0).toLocaleString()} of ${total}`
    : total;
  return partner.premiumCount
    ? `${videos} · ${partner.premiumCount.toLocaleString()} premium`
    : videos;
}
</script>

<style scoped lang="scss">
.sites-page {
  padding-bottom: var(--space-3xl);
}

.sites-page__loading {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sites-page__center {
  display: flex;
  justify-content: center;
}

.sites-page__header {
  margin-bottom: var(--space-md);
}

.sites-page__title {
  margin: 0;
}

.sites-page__count {
  color: var(--color-text-tertiary);
  margin: var(--space-xs) 0 0;
}

// the footnote that decodes the "X of Y" captions — half a step quieter than
// the count line it explains
.sites-page__hidden {
  color: var(--color-text-tertiary);
  margin: calc(var(--space-xs) / 2) 0 0;
  max-width: 60ch;
}

.sites-page__search {
  max-width: 360px;
  margin-bottom: var(--space-lg);
}

// same directory-grid rhythm as the brand-ux showcase pages
.sites-page__grid {
  display: grid;
  gap: var(--space-sm);

  @media (min-width: 600px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1440px) {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
