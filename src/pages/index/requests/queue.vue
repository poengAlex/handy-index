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

        <div v-else-if="!ranked.length" class="queue-page__center">
          <HEmptyState
            icon="pending_actions"
            title="The queue is empty"
            body="Nothing is waiting for a script right now. Request a video from the voting board to get things moving."
            action-label="Go to requests"
            @action="router.push('/requests')"
          />
        </div>

        <template v-else>
          <p class="text-body-sm queue-page__count">{{ countLabel }}</p>
          <div class="queue-page__list">
            <div
              v-for="(request, index) in shown"
              :key="request.requestId"
              class="queue-page__row"
            >
              <span class="text-h5 queue-page__rank">{{ index + 1 }}</span>
              <RequestCard :request="request" class="queue-page__card">
                <div class="queue-page__tally">
                  <span class="text-h5 queue-page__tally-count">
                    {{ request.votes ?? 0 }}
                  </span>
                  <span class="text-caption queue-page__tally-label">
                    votes
                  </span>
                </div>
              </RequestCard>
            </div>
          </div>
          <div v-if="!done" ref="sentinel" class="queue-page__sentinel" />
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
// The queue in scripting order: every votable request, ranked by votes.
// (The spec's full-pipeline GET /requests isn't served by production — it
// answers 405 — so the votable set is the whole visible queue.)
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { HBtn, HEmptyState, HandyLoader } from "@/components/handy";
import ConnectionKeyDialog from "@/components/ConnectionKeyDialog.vue";
import RequestCard from "@/components/RequestCard.vue";
import { useIncrementalReveal } from "@/composables/useIncrementalReveal";
import {
  getVotableRequests,
  isAuthError
} from "@/services/script-index/client";
import type { VideoRequest } from "@/services/script-index/types";
import { useSettingsStore } from "@/stores/settings";

const PAGE_SIZE = 100;
// backstop against a runaway loop — the live queue is ~1k, so this covers it
// with headroom; if it's ever hit, the count label says the list is capped
const MAX_REQUESTS = 2000;

const router = useRouter();
const settings = useSettingsStore();

const requests = ref<VideoRequest[]>([]);
const state = ref<"idle" | "loading" | "ready" | "error" | "rejected">("idle");
const keyDialog = ref(false);
/** the fetch loop hit MAX_REQUESTS — the ranking only covers what we got */
const capped = ref(false);

const hasKey = computed(() => settings.connectionKey.trim().length > 0);

const ranked = computed(() =>
  [...requests.value].sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0))
);

const { shown, done, sentinel } = useIncrementalReveal(ranked, 50);

const countLabel = computed(() => {
  const count = ranked.value.length;
  if (capped.value) {
    return `${count.toLocaleString()}+ requests waiting (showing the first ${count.toLocaleString()})`;
  }
  return `${count.toLocaleString()} request${count === 1 ? "" : "s"} waiting`;
});

async function load() {
  const key = settings.connectionKey.trim();
  if (!key) return;
  state.value = "loading";
  try {
    const all: VideoRequest[] = [];
    let sawShortPage = false;
    for (let skip = 0; skip < MAX_REQUESTS; skip += PAGE_SIZE) {
      const page = await getVotableRequests(key, PAGE_SIZE, skip);
      all.push(...page);
      if (page.length < PAGE_SIZE) {
        sawShortPage = true;
        break;
      }
    }
    requests.value = all;
    capped.value = !sawShortPage;
    state.value = "ready";
  } catch (error) {
    state.value = isAuthError(error) ? "rejected" : "error";
  }
}

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

.queue-page__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.queue-page__row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.queue-page__rank {
  flex: none;
  min-width: 40px;
  text-align: center;
  color: var(--color-text-tertiary);
  font-variant-numeric: tabular-nums;
}

.queue-page__card {
  flex: 1;
  min-width: 0;
}

.queue-page__tally {
  display: flex;
  align-items: baseline;
  gap: var(--space-xs);
}

.queue-page__tally-count {
  font-variant-numeric: tabular-nums;
}

.queue-page__tally-label {
  color: var(--color-text-tertiary);
}

.queue-page__sentinel {
  height: 1px;
}
</style>
