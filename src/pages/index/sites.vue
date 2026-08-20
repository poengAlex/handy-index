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
          <GateNotice />
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
            icon="inventory_2"
            title="Nothing to show"
            body="The index came back without a single site. Try loading it again."
            action-label="Try again"
            @action="catalog.retry()"
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
// The site directory: every partner in the INDEX as a nav card, count-sorted
// by partnersOf, with a client-side name filter on top. The LIST is ungated —
// a directory that dropped sites would read as an incomplete index — while
// the captions do respect the gates, so what a card promises is what opening
// it delivers. Each card also breaks the site down by both paywalls.
import { computed, ref } from "vue";
import { HEmptyState, HNavCard, HandyLoader } from "@/components/handy";
import GateNotice from "@/components/GateNotice.vue";
import {
  partnersOf,
  type PartnerSummary
} from "@/services/script-index/queries";
import { useCatalogStore } from "@/stores/catalog";

const catalog = useCatalogStore();

const query = ref("");

const partners = computed(() => partnersOf(catalog.videos));

// what each site actually opens onto. The browse page lifts the orientation
// gate for a deliberate site pick (catalog.anyOrientation) and applies the
// rest, so this counts the same way. null when no gate is narrowing anything:
// there is then no second number to show, and the pass isn't worth taking.
const matching = computed(() => {
  if (catalog.anyOrientation.length === catalog.videos.length) return null;
  const counts = new Map<string, number>();
  for (const summary of partnersOf(catalog.anyOrientation)) {
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

// the total the per-site captions add up to
const totalVideos = computed(() => catalog.videos.length);

const countLabel = computed(() => {
  const sites = partners.value.length;
  const siteNoun = sites === 1 ? "site" : "sites";
  const videos = totalVideos.value;
  const videoNoun = videos === 1 ? "video" : "videos";
  return `${sites.toLocaleString()} ${siteNoun} · ${videos.toLocaleString()} ${videoNoun} in the index`;
});

function countOf(count: number, noun: string): string {
  return `${count.toLocaleString()} ${noun}${count === 1 ? "" : "s"}`;
}

// "1,234 of 2,000 videos · 500 paid videos · 300 premium scripts" — the total
// stays the headline because that is what the site holds; the first number is
// what your filters leave of it. The two paywalls are named in full: they are
// different gates, and "500 premium" would not say which.
function videoCountLabel(partner: PartnerSummary): string {
  const total = countOf(partner.count, "video");
  const counts = matching.value;
  const parts = [
    counts
      ? `${(counts.get(partner.partnerId) ?? 0).toLocaleString()} of ${total}`
      : total
  ];
  if (partner.paidVideoCount) {
    parts.push(countOf(partner.paidVideoCount, "paid video"));
  }
  if (partner.premiumScriptCount) {
    parts.push(countOf(partner.premiumScriptCount, "premium script"));
  }
  return parts.join(" · ");
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
