<template>
  <q-page class="requests-page">
    <div class="h-section">
      <div class="h-container">
        <header class="requests-page__header">
          <div class="requests-page__header-row">
            <h1 class="text-h2 requests-page__title">Script requests</h1>
            <HBtn
              variant="tertiary"
              label="View queue"
              icon="pending_actions"
              to="/requests/queue"
            />
          </div>
          <p class="text-body requests-page__lead">
            Vote on which videos get scripted next — the top-voted request goes
            first.
          </p>
        </header>

        <!-- The whole board is bound to a Handy connection key -->
        <div v-if="!hasKey" class="requests-page__center">
          <HEmptyState
            icon="key"
            title="Connection key needed"
            body="The request board is tied to your Handy. Add the connection key from the Handy app to see, submit and vote on requests."
            action-label="Add connection key"
            @action="keyDialog = true"
          />
        </div>

        <template v-else>
          <!-- Submit a new request -->
          <section class="requests-page__submit">
            <h2 class="text-h5 requests-page__submit-title">
              Request a video
            </h2>
            <p class="text-body-sm requests-page__submit-hint">
              Paste a link to a video you'd like scripted. It goes through
              verification before it shows up for voting.
            </p>
            <div class="requests-page__submit-row">
              <q-input
                :model-value="url"
                filled
                dense
                clearable
                label="Video URL"
                placeholder="https://…"
                class="requests-page__url-input"
                @update:model-value="url = String($event ?? '')"
                @keyup.enter="submit"
              />
              <HBtn
                label="Request video"
                :loading="submitting"
                :disable="!validUrl"
                @click="submit"
              />
            </div>
          </section>

          <!-- The voting list -->
          <div v-if="listState === 'loading'" class="requests-page__loading">
            <HandyLoader />
          </div>

          <!-- the key can be rejected mid-session (rotated in the Handy app),
               and that needs the dialog, not a retry button -->
          <div
            v-else-if="listState === 'rejected'"
            class="requests-page__center"
          >
            <HEmptyState
              icon="key_off"
              title="Connection key rejected"
              body="Either the key is wrong or your Handy isn't online. Check the key in the Handy app, make sure the device is switched on and connected, then enter it again."
              action-label="Enter key again"
              @action="keyDialog = true"
            />
          </div>

          <div v-else-if="listState === 'error'" class="requests-page__center">
            <HEmptyState
              icon="cloud_off"
              title="Couldn't load requests"
              body="The script index didn't answer. Check your connection and try again."
              action-label="Try again"
              @action="load"
            />
          </div>

          <div v-else-if="!requests.length" class="requests-page__center">
            <HEmptyState
              icon="how_to_vote"
              title="No requests waiting"
              body="Nothing is up for a vote right now. Request a video above to get things moving."
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
              class="requests-page__filters"
              @add-tag="addTag"
              @remove-tag="removeTag"
              @clear="clear"
            />

            <p class="text-body-sm requests-page__count">{{ countLabel }}</p>

            <div v-if="!results.length" class="requests-page__center">
              <HEmptyState
                icon="search_off"
                title="No requests match"
                body="Nothing on the board matches those filters. Loosen them to see the rest."
                action-label="Clear filters"
                @action="clear"
              />
            </div>

            <div v-else class="requests-page__grid">
              <RequestCard
                v-for="request in shown"
                :key="request.requestId"
                :request="request"
              >
                <span class="text-caption requests-page__votes">
                  {{ voteLabel(request) }}
                </span>
                <HBtn
                  size="sm"
                  icon="thumb_up"
                  :variant="
                    settings.hasUpvoted(request.requestId)
                      ? 'tertiary'
                      : 'secondary'
                  "
                  :label="
                    settings.hasUpvoted(request.requestId) ? 'Voted' : 'Vote'
                  "
                  :disable="settings.hasUpvoted(request.requestId)"
                  :loading="votingId === request.requestId"
                  @click="vote(request)"
                />
              </RequestCard>
            </div>

            <div
              v-if="results.length && !done"
              ref="sentinel"
              class="requests-page__sentinel"
            />
          </template>
        </template>
      </div>
    </div>

    <ConnectionKeyDialog v-model="keyDialog" @saved="loadUnlessReady">
      The request board is bound to your Handy. Enter the connection key from
      the Handy app to continue.
    </ConnectionKeyDialog>
  </q-page>
</template>

<script setup lang="ts">
// The community voting board: submit a video URL, then upvote what should
// get scripted next. Every API call here needs the Handy connection key.
import { computed, onMounted, ref } from "vue";
import { HBtn, HEmptyState, HandyLoader, hToast } from "@/components/handy";
import ConnectionKeyDialog from "@/components/ConnectionKeyDialog.vue";
import RequestCard from "@/components/RequestCard.vue";
import RequestFilters from "@/components/RequestFilters.vue";
import { useIncrementalReveal } from "@/composables/useIncrementalReveal";
import { useRequestFilters } from "@/composables/useRequestFilters";
import { useVotableRequests } from "@/composables/useVotableRequests";
import {
  createVideoRequest,
  isAuthError,
  voteForRequest
} from "@/services/script-index/client";
import { votesOf } from "@/services/script-index/requests";
import type { VideoRequest } from "@/services/script-index/types";
import { useSettingsStore } from "@/stores/settings";

const settings = useSettingsStore();

// the whole board in one load: filtering a "Load more" list would only ever
// search the pages you happened to have opened
const {
  requests,
  state: listState,
  capped,
  hasKey,
  load,
  loadUnlessReady
} = useVotableRequests();

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

const { shown, done, sentinel } = useIncrementalReveal(results, 30);

const keyDialog = ref(false);

const url = ref("");
const submitting = ref(false);
const votingId = ref("");

const validUrl = computed(() => {
  const raw = url.value.trim();
  if (!raw) return false;
  try {
    const parsed = new URL(raw);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
});

function voteLabel(request: VideoRequest): string {
  const votes = votesOf(request);
  return `${votes} vote${votes === 1 ? "" : "s"}`;
}

const countLabel = computed(() => {
  const total = requests.value.length;
  const count = results.value.length;
  const label = `${count.toLocaleString()} request${count === 1 ? "" : "s"}`;
  const matched = activeCount.value
    ? `${label} of ${total.toLocaleString()}`
    : `${label} up for a vote`;
  return capped.value ? `${matched} (board is longer than we loaded)` : matched;
});

async function vote(request: VideoRequest) {
  if (settings.hasUpvoted(request.requestId) || votingId.value) return;
  const key = settings.connectionKey.trim();
  if (!key) {
    keyDialog.value = true;
    return;
  }
  votingId.value = request.requestId;
  try {
    await voteForRequest(request.requestId, key);
    settings.markUpvoted(request.requestId);
    request.votes = (request.votes ?? 0) + 1;
    hToast(
      "positive",
      "Vote counted",
      "Top-voted requests get scripted first."
    );
  } catch (error) {
    if (isAuthError(error)) {
      keyDialog.value = true;
      hToast(
        "negative",
        "Vote failed",
        "Either the key is wrong or your Handy isn't online — check both and enter it again."
      );
    } else {
      hToast(
        "negative",
        "Vote failed",
        "The script index didn't accept the vote. Try again."
      );
    }
  } finally {
    votingId.value = "";
  }
}

async function submit() {
  if (!validUrl.value || submitting.value) return;
  const key = settings.connectionKey.trim();
  if (!key) {
    keyDialog.value = true;
    return;
  }
  submitting.value = true;
  try {
    await createVideoRequest(url.value.trim(), key);
    url.value = "";
    hToast(
      "positive",
      "Request sent",
      "It goes through verification before it shows up for voting."
    );
  } catch {
    hToast(
      "negative",
      "Request failed",
      "The script index didn't accept the URL. Try again."
    );
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  if (hasKey.value) void load();
});
</script>

<style scoped lang="scss">
.requests-page {
  padding-bottom: var(--space-3xl);
}

.requests-page__header {
  margin-bottom: var(--space-lg);
}

.requests-page__header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.requests-page__title {
  margin: 0 0 var(--space-xs);
}

.requests-page__lead {
  margin: 0;
  color: var(--color-text-secondary);
  max-width: 56ch;
}

.requests-page__center {
  display: flex;
  justify-content: center;
}

.requests-page__loading {
  min-height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

// card contract: card surface, lg radius, md padding, flat
.requests-page__submit {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  margin-bottom: var(--space-lg);
}

.requests-page__submit-title {
  margin: 0 0 var(--space-xs);
}

.requests-page__submit-hint {
  margin: 0 0 var(--space-sm);
  color: var(--color-text-tertiary);
}

.requests-page__submit-row {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.requests-page__url-input {
  flex: 1;
  min-width: 220px;
}

.requests-page__filters {
  margin-bottom: var(--space-md);
}

.requests-page__count {
  color: var(--color-text-tertiary);
  margin: 0 0 var(--space-sm);
}

.requests-page__sentinel {
  height: 1px;
}

// same rhythm as the catalog grid, so a request reads as the same kind of
// object as a video
.requests-page__grid {
  display: grid;
  gap: var(--space-sm);
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}

.requests-page__votes {
  color: var(--color-text-secondary);
  font-variant-numeric: tabular-nums;
}
</style>
