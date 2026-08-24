<template>
  <q-page class="requests-page">
    <div class="h-section">
      <div class="h-container">
        <header class="requests-page__header">
          <div class="requests-page__header-row">
            <h1 class="text-h2 requests-page__title">
              {{ $t("requests.board.title") }}
            </h1>
            <HBtn
              variant="tertiary"
              :label="$t('requests.board.queueLink')"
              icon="pending_actions"
              to="/requests/queue"
            />
          </div>
          <p class="text-body requests-page__lead">
            {{ $t("requests.board.lead") }}
          </p>
        </header>

        <!-- The whole board is bound to a Handy connection key -->
        <div v-if="!hasKey" class="requests-page__center">
          <HEmptyState
            icon="key"
            :title="$t('requests.key.title')"
            :body="$t('requests.key.boardBody')"
            :action-label="$t('requests.key.addAction')"
            @action="keyDialog = true"
          />
        </div>

        <template v-else>
          <!-- Submit a new request -->
          <section class="requests-page__submit">
            <h2 class="text-h5 requests-page__submit-title">
              {{ $t("requests.submit.title") }}
            </h2>
            <p class="text-body-sm requests-page__submit-hint">
              {{ $t("requests.submit.hint") }}
            </p>
            <div class="requests-page__submit-row">
              <q-input
                :model-value="url"
                filled
                dense
                clearable
                :label="$t('requests.submit.urlLabel')"
                placeholder="https://…"
                class="requests-page__url-input"
                @update:model-value="url = String($event ?? '')"
                @keyup.enter="submit"
              />
              <HBtn
                :label="$t('requests.submit.action')"
                :loading="submitting"
                :disable="!validUrl"
                @click="submit"
              />
            </div>
          </section>

          <!-- The voting list -->
          <div v-if="listState === 'loading'" class="requests-page__loading">
            <HandyLoader :loading-label="$t('kit.loading')" />
          </div>

          <!-- the key can be rejected mid-session (rotated in the Handy app),
               and that needs the dialog, not a retry button -->
          <div
            v-else-if="listState === 'rejected'"
            class="requests-page__center"
          >
            <HEmptyState
              icon="key_off"
              :title="$t('requests.key.rejectedTitle')"
              :body="$t('requests.key.rejectedBody')"
              :action-label="$t('requests.key.rejectedAction')"
              @action="keyDialog = true"
            />
          </div>

          <div v-else-if="listState === 'error'" class="requests-page__center">
            <HEmptyState
              icon="cloud_off"
              :title="$t('requests.board.errorTitle')"
              :body="$t('common.state.catalogErrorBody')"
              :action-label="$t('common.action.retry')"
              @action="load"
            />
          </div>

          <div v-else-if="!requests.length" class="requests-page__center">
            <HEmptyState
              icon="how_to_vote"
              :title="$t('requests.board.emptyTitle')"
              :body="$t('requests.board.emptyBody')"
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
                :title="$t('requests.filters.emptyTitle')"
                :body="$t('requests.board.noMatchBody')"
                :action-label="$t('common.action.clearFilters')"
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
                    settings.hasUpvoted(request.requestId)
                      ? $t('requests.vote.voted')
                      : $t('requests.vote.action')
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
      {{ $t("requests.key.boardDialog") }}
    </ConnectionKeyDialog>
  </q-page>
</template>

<script setup lang="ts">
// The community voting board: submit a video URL, then upvote what should
// get scripted next. Every API call here needs the Handy connection key.
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { HBtn, HEmptyState, HandyLoader, hToast } from "@/components/handy";
import ConnectionKeyDialog from "@/components/ConnectionKeyDialog.vue";
import RequestCard from "@/components/RequestCard.vue";
import RequestFilters from "@/components/RequestFilters.vue";
import { useFormat } from "@/composables/useFormat";
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
const { t, n } = useI18n();
const { count } = useFormat();

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
  return count("votes", votesOf(request));
}

// Four whole messages rather than a stem the render bolts suffixes onto —
// word order is the translator's to decide. The counted noun comes from
// common.count.requests, so its plural rule lives in exactly one place.
const countLabel = computed(() => {
  const params = {
    requests: count("requests", results.value.length),
    total: n(requests.value.length)
  };
  if (activeCount.value) {
    return capped.value
      ? t("requests.board.countFilteredCapped", params)
      : t("requests.board.countFiltered", params);
  }
  return capped.value
    ? t("requests.board.countAllCapped", params)
    : t("requests.board.countAll", params);
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
      t("requests.vote.successTitle"),
      t("requests.vote.successBody")
    );
  } catch (error) {
    if (isAuthError(error)) {
      keyDialog.value = true;
      hToast(
        "negative",
        t("requests.vote.failedTitle"),
        t("requests.vote.failedKeyBody")
      );
    } else {
      hToast(
        "negative",
        t("requests.vote.failedTitle"),
        t("requests.vote.failedBody")
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
      t("requests.submit.sentTitle"),
      t("requests.submit.sentBody")
    );
  } catch {
    hToast(
      "negative",
      t("requests.submit.failedTitle"),
      t("requests.submit.failedBody")
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
