<template>
  <q-page class="queue-page">
    <div class="h-section">
      <div class="h-container">
        <header class="queue-page__header">
          <div class="queue-page__header-row">
            <h1 class="text-h2 queue-page__title">Request queue</h1>
            <HBtn
              variant="tertiary"
              label="Voting board"
              icon="how_to_vote"
              to="/requests"
            />
          </div>
          <p class="text-body queue-page__lead">
            The scripting order: the top-voted request gets scripted first.
          </p>
        </header>

        <div v-if="!hasKey" class="queue-page__center">
          <HEmptyState
            icon="key"
            title="Connection key needed"
            body="The queue is tied to your Handy. Add the connection key from the Handy app to see it."
            action-label="Add connection key"
            @action="keyDialog = true"
          />
        </div>

        <div v-else-if="state === 'rejected'" class="queue-page__center">
          <HEmptyState
            icon="key_off"
            title="Connection key rejected"
            body="The script index didn't accept your connection key. Check it in the Handy app and enter it again."
            action-label="Enter key again"
            @action="keyDialog = true"
          />
        </div>

        <div v-else-if="state === 'error'" class="queue-page__center">
          <HEmptyState
            icon="cloud_off"
            title="Couldn't load the queue"
            body="The script index didn't answer. Check your connection and try again."
            action-label="Try again"
            @action="load"
          />
        </div>

        <div v-else-if="state !== 'ready'" class="queue-page__loading">
          <HandyLoader />
        </div>

        <div v-else-if="!requests.length" class="queue-page__center">
          <HEmptyState
            icon="pending_actions"
            title="The queue is empty"
            body="Nothing is waiting for a script right now. Request a video from the voting board to get things moving."
            action-label="Go to requests"
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
              title="No requests match"
              body="Nothing in the queue matches those filters. Loosen them to see the rest."
              action-label="Clear filters"
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
                <q-icon name="check" size="14px" /> Voted
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
      The queue is bound to your Handy. Enter the connection key from the Handy
      app to continue.
    </ConnectionKeyDialog>
  </q-page>
</template>

<script setup lang="ts">
// The queue in scripting order: every votable request, ranked by votes, with
// the board's filter/sort controls on top. (The spec's full-pipeline GET
// /requests isn't served by production — it answers 405 — so the votable set
// is the whole visible queue.)
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { HBtn, HEmptyState, HandyLoader } from "@/components/handy";
import ConnectionKeyDialog from "@/components/ConnectionKeyDialog.vue";
import RequestCard from "@/components/RequestCard.vue";
import RequestFilters from "@/components/RequestFilters.vue";
import { useIncrementalReveal } from "@/composables/useIncrementalReveal";
import { useRequestFilters } from "@/composables/useRequestFilters";
import { useVotableRequests } from "@/composables/useVotableRequests";
import { rankByVotes, votesOf } from "@/services/script-index/requests";
import type { VideoRequest } from "@/services/script-index/types";
import { useSettingsStore } from "@/stores/settings";

const router = useRouter();
const settings = useSettingsStore();

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
  const votes = votesOf(request);
  return `${votes} vote${votes === 1 ? "" : "s"}`;
}

const countLabel = computed(() => {
  const total = requests.value.length;
  const count = results.value.length;
  const waiting = `${count.toLocaleString()} request${count === 1 ? "" : "s"}`;
  // "of 1,080" only when filters are on — otherwise it's the same number twice
  const matched = activeCount.value
    ? `${waiting} of ${total.toLocaleString()}`
    : waiting;
  return capped.value
    ? `${matched} (the queue is longer than we loaded)`
    : `${matched} waiting`;
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
