<template>
  <q-page class="sites-page">
    <div v-if="catalog.status === 'error'" class="h-section">
      <div class="h-container sites-page__center">
        <HEmptyState
          icon="cloud_off"
          :title="$t('sites.errorTitle')"
          :body="$t('common.state.catalogErrorBody')"
          :action-label="$t('common.action.retry')"
          @action="catalog.retry()"
        />
      </div>
    </div>

    <div v-else-if="catalog.status !== 'ready'" class="sites-page__loading">
      <HandyLoader :loading-label="$t('kit.loading')" />
    </div>

    <div v-else class="h-section">
      <div class="h-container">
        <header class="sites-page__header">
          <h1 class="text-h2 sites-page__title">{{ $t("sites.title") }}</h1>
          <p class="text-body-sm sites-page__count">{{ countLabel }}</p>
          <GateNotice />
        </header>

        <q-input
          :model-value="query"
          filled
          dense
          clearable
          :placeholder="$t('sites.search.placeholder')"
          :aria-label="$t('sites.search.aria')"
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
            :title="$t('common.state.emptyTitle')"
            :body="$t('sites.emptyBody')"
            :action-label="$t('common.action.retry')"
            @action="catalog.retry()"
          />
        </div>
        <div v-else-if="!filtered.length" class="sites-page__center">
          <HEmptyState
            icon="search_off"
            :title="$t('sites.noMatchTitle')"
            :body="$t('sites.noMatchBody')"
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
// every COUNT on the page is fully gated: script access, video access, muted
// tags and orientation all move it. Each card also breaks the site down by
// both paywalls, which is the one figure the filters don't touch (it
// describes the site, not your view of it).
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { HEmptyState, HNavCard, HandyLoader } from "@/components/handy";
import GateNotice from "@/components/GateNotice.vue";
import { useFormat } from "@/composables/useFormat";
import {
  partnersOf,
  type PartnerSummary
} from "@/services/script-index/queries";
import { useCatalogStore } from "@/stores/catalog";

const catalog = useCatalogStore();
const { t } = useI18n();
const { count, num, ofTotal } = useFormat();

const query = ref("");

const partners = computed(() => partnersOf(catalog.videos));

// what each site has left once EVERY active filter is applied — both
// paywalls, muted tags and orientation (catalog.visible). A count that quietly
// skipped one of them would be the one number on the page you couldn't trust.
// null when nothing is narrowing: there is then no second number to show, and
// the pass isn't worth taking.
const matching = computed(() => {
  if (catalog.visible.length === catalog.videos.length) return null;
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

// the totals the per-site captions add up to, in the same "x of y" shape as
// the cards, so the header and the grid can never tell different stories.
// "·" joins two finished phrases rather than splicing a sentence: each half
// is one whole message, and only the punctuation between them is code.
const countLabel = computed(() => {
  const sites = count("sites", partners.value.length);
  const videos = count("videos", catalog.videos.length);
  const total = matching.value
    ? ofTotal(catalog.visible.length, catalog.videos.length, "videos")
    : t("sites.count.totalInIndex", { total: videos });
  return `${sites} · ${total}`;
});

// "1,234 of 2,000 videos · 500 premium videos · 300 premium scripts" — the
// total stays the headline because that is what the site holds; the first
// number is what your filters leave of it. The two paywalls are named in
// full: they are different gates, and "500 premium" would not say which.
function videoCountLabel(partner: PartnerSummary): string {
  const total = count("videos", partner.count);
  const counts = matching.value;
  const parts = [
    counts
      ? ofTotal(counts.get(partner.partnerId) ?? 0, partner.count, "videos")
      : total
  ];
  if (partner.paidVideoCount) {
    parts.push(
      t(
        "sites.count.premiumVideos",
        { count: num(partner.paidVideoCount) },
        partner.paidVideoCount
      )
    );
  }
  if (partner.premiumScriptCount) {
    parts.push(
      t(
        "sites.count.premiumScripts",
        { count: num(partner.premiumScriptCount) },
        partner.premiumScriptCount
      )
    );
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
