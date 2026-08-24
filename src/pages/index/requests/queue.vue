<template>
  <q-page class="queue-page">
    <div class="h-section">
      <div class="h-container">
        <header class="queue-page__header">
          <div class="queue-page__header-row">
            <h1 class="text-h2 queue-page__title">
              {{ $t("requests.queue.title") }}
            </h1>
            <HBtn
              variant="tertiary"
              :label="$t('requests.queue.boardLink')"
              icon="how_to_vote"
              to="/requests"
            />
          </div>
          <p class="text-body queue-page__lead">
            {{ $t("requests.queue.lead") }}
          </p>
        </header>

        <div v-if="!hasKey" class="queue-page__center">
          <HEmptyState
            icon="key"
            :title="$t('requests.key.title')"
            :body="$t('requests.key.queueBody')"
            :action-label="$t('requests.key.addAction')"
            @action="keyDialog = true"
          />
        </div>

        <div v-else-if="state === 'rejected'" class="queue-page__center">
          <HEmptyState
            icon="key_off"
            :title="$t('requests.key.rejectedTitle')"
            :body="$t('requests.key.rejectedBody')"
            :action-label="$t('requests.key.rejectedAction')"
            @action="keyDialog = true"
          />
        </div>

        <div v-else-if="state === 'error'" class="queue-page__center">
          <HEmptyState
            icon="cloud_off"
            :title="$t('requests.queue.errorTitle')"
            :body="$t('common.state.catalogErrorBody')"
            :action-label="$t('common.action.retry')"
            @action="load"
          />
        </div>

        <div v-else-if="state !== 'ready'" class="queue-page__loading">
          <HandyLoader :loading-label="$t('kit.loading')" />
        </div>

        <div v-else-if="!requests.length" class="queue-page__center">
          <HEmptyState
            icon="pending_actions"
            :title="$t('requests.queue.emptyTitle')"
            :body="$t('requests.queue.emptyBody')"
            :action-label="$t('requests.queue.emptyAction')"
            @action="router.push('/requests')"
          />
        </div>

        <template v-else>
          <RequestFilters
            v-model:search="search"
            v-model:sort="sortKey"
            v-model:hide-voted="hideVoted"
            :tags="tags"
            :all-tags="allTags"
            :active-count="activeCount"
            class="queue-page__filters"
            @add-tag="addTag"
            @remove-tag="removeTag"
            @clear="clear"
          />

          <p class="text-body-sm queue-page__count">{{ countLabel }}</p>

          <div v-if="!results.length" class="queue-page__center">
            <HEmptyState
              icon="search_off"
              :title="$t('requests.filters.emptyTitle')"
              :body="$t('requests.queue.noMatchBody')"
              :action-label="$t('common.action.clearFilters')"
              @action="clear"
            />
          </div>

          <div v-else class="queue-page__grid">
            <!-- rank is the request's real place in the scripting order, from
                 the whole set: filtering or re-sorting must not renumber it -->
            <RequestCard
              v-for="request in shown"
              :key="request.requestId"
              :request="request"
              :rank="ranks.get(request.requestId) ?? 0"
            >
              <!-- read-only: voting lives on the board, and a button here
                   that only linked there would drop you on a list of 1,080
                   with your request nowhere in sight -->
              <span class="text-caption queue-page__votes">
                {{ voteLabel(request) }}
              </span>
              <span
                v-if="settings.hasUpvoted(request.requestId)"
                class="text-caption queue-page__voted"
              >
                <q-icon name="check" size="14px" />
                {{ $t("requests.vote.voted") }}
              </span>
            </RequestCard>
          </div>
          <div
            v-if="results.length && !done"
            ref="sentinel"
            class="queue-page__sentinel"
          />
        </template>
      </div>
    </div>

    <ConnectionKeyDialog v-model="keyDialog" @saved="load">
      {{ $t("requests.key.queueDialog") }}
    </ConnectionKeyDialog>
  </q-page>
</template>

<script setup lang="ts">
// The queue in scripting order: every votable request, ranked by votes, with
// the board's filter/sort controls on top. (The spec's full-pipeline GET
// /requests isn't served by production — it answers 405 — so the votable set
// is the whole visible queue.)
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { HBtn, HEmptyState, HandyLoader } from "@/components/handy";
import ConnectionKeyDialog from "@/components/ConnectionKeyDialog.vue";
import RequestCard from "@/components/RequestCard.vue";
import RequestFilters from "@/components/RequestFilters.vue";
import { useFormat } from "@/composables/useFormat";
import { useIncrementalReveal } from "@/composables/useIncrementalReveal";
import { useRequestFilters } from "@/composables/useRequestFilters";
import { useVotableRequests } from "@/composables/useVotableRequests";
import { rankByVotes, votesOf } from "@/services/script-index/requests";
import type { VideoRequest } from "@/services/script-index/types";
import { useSettingsStore } from "@/stores/settings";

const router = useRouter();
const settings = useSettingsStore();
const { t, n } = useI18n();
const { count } = useFormat();

const keyDialog = ref(false);

const { requests, state, capped, hasKey, load } = useVotableRequests();

const {
  search,
  sortKey,
  tags,
  hideVoted,
  allTags,
  results,
  activeCount,
  addTag,
  removeTag,
  clear
} = useRequestFilters(requests);

// positions come from the whole set, so a filtered view still shows where
// each request actually sits in the queue
const ranks = computed(() => rankByVotes(requests.value));

const { shown, done, sentinel } = useIncrementalReveal(results, 50);

function voteLabel(request: VideoRequest): string {
  return count("votes", votesOf(request));
}

const countLabel = computed(() => {
  const params = {
    requests: count("requests", results.value.length),
    total: n(requests.value.length)
  };
  // "of 1,080" only when filters are on — otherwise it's the same number
  // twice; each combination is a whole message so the translator owns the
  // word order, with the counted noun coming from common.count.requests
  if (activeCount.value) {
    return capped.value
      ? t("requests.queue.countFilteredCapped", params)
      : t("requests.queue.countFiltered", params);
  }
  return capped.value
    ? t("requests.queue.countWaitingCapped", params)
    : t("requests.queue.countWaiting", params);
});

onMounted(() => {
  if (hasKey.value) void load();
});
</script>

<style scoped lang="scss">
.queue-page {
  padding-bottom: var(--space-3xl);
}

.queue-page__header {
  margin-bottom: var(--space-lg);
}

.queue-page__header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.queue-page__title {
  margin: 0;
}

.queue-page__lead {
  color: var(--color-text-secondary);
  margin: var(--space-xs) 0 0;
}

.queue-page__filters {
  margin-bottom: var(--space-md);
}

.queue-page__count {
  color: var(--color-text-tertiary);
  margin: 0 0 var(--space-sm);
}

.queue-page__center,
.queue-page__loading {
  min-height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.queue-page__grid {
  display: grid;
  gap: var(--space-sm);
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}

.queue-page__votes {
  color: var(--color-text-secondary);
  font-variant-numeric: tabular-nums;
}

.queue-page__voted {
  color: var(--color-text-tertiary);
}

.queue-page__sentinel {
  height: 1px;
}
</style>
