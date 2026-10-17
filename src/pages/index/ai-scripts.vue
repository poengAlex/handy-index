<template>
  <q-page class="ai-scripts-page h-section">
    <div class="h-container">
      <header class="ai-scripts-page__header">
        <h1 class="text-h2 ai-scripts-page__title">
          {{ $t("aiScripts.title") }}
        </h1>
        <p class="text-body-sm ai-scripts-page__lead">
          {{ $t("aiScripts.lead") }}
        </p>
      </header>

      <!-- before anything else on the page, and not dismissible: every
           script below is the auto-scripter's output, unreviewed -->
      <div class="ai-scripts-page__warning" role="note">
        <q-icon
          name="warning"
          size="24px"
          class="ai-scripts-page__warning-icon"
        />
        <div>
          <p class="text-body-compact ai-scripts-page__warning-title">
            {{ $t("aiScripts.warning.title") }}
          </p>
          <p class="text-body-sm ai-scripts-page__warning-body">
            {{ $t("aiScripts.warning.body") }}
          </p>
        </div>
      </div>

      <div v-if="failed" class="ai-scripts-page__center">
        <HEmptyState
          icon="cloud_off"
          :title="$t('aiScripts.errorTitle')"
          :body="$t('aiScripts.errorBody')"
          :action-label="$t('common.action.retry')"
          @action="load()"
        />
      </div>

      <div v-else-if="!loaded" class="ai-scripts-page__loading">
        <HandyLoader />
      </div>

      <div v-else-if="!all.length" class="ai-scripts-page__center">
        <HEmptyState
          icon="inventory_2"
          :title="$t('common.state.emptyTitle')"
          :body="$t('aiScripts.emptyBody')"
        />
      </div>

      <template v-else>
        <div class="ai-scripts-page__controls">
          <q-input
            :model-value="query"
            filled
            dense
            clearable
            :placeholder="$t('aiScripts.search.placeholder')"
            :aria-label="$t('aiScripts.search.aria')"
            class="ai-scripts-page__search"
            @update:model-value="query = String($event ?? '')"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
          <p class="text-caption ai-scripts-page__count">{{ countLabel }}</p>
        </div>

        <div v-if="!filtered.length" class="ai-scripts-page__center">
          <HEmptyState
            icon="search_off"
            :title="$t('aiScripts.noMatchTitle')"
            :body="$t('aiScripts.noMatchBody')"
          />
        </div>

        <ul v-else class="ai-scripts-page__list">
          <li
            v-for="script in visible"
            :key="script.id"
            class="ai-scripts-page__row"
          >
            <div class="ai-scripts-page__text">
              <a
                v-if="script.url"
                :href="script.url"
                target="_blank"
                rel="noopener noreferrer nofollow"
                class="text-body-compact ai-scripts-page__name"
                >{{ nameOf(script) }}</a
              >
              <span v-else class="text-body-compact ai-scripts-page__name">{{
                nameOf(script)
              }}</span>
              <span class="text-caption ai-scripts-page__meta">{{
                metaOf(script)
              }}</span>
            </div>
            <!-- a real link (copyable, opens anywhere), fetched in place on a
                 plain click so a taken-down script can say so -->
            <HBtn
              size="sm"
              variant="secondary"
              icon="download"
              :label="$t('aiScripts.download')"
              :href="script.download"
              :loading="downloadingId === script.id"
              class="ai-scripts-page__download"
              @click="download($event, script)"
            />
          </li>
        </ul>

        <div v-if="filtered.length > limit" class="ai-scripts-page__more">
          <HBtn
            variant="tertiary"
            :label="$t('aiScripts.showMore')"
            @click="limit += PAGE"
          />
        </div>
      </template>
    </div>
  </q-page>
</template>

<script setup lang="ts">
// Every AI script Handy's auto-scripter has published, newest first — the
// same list the request board matches its tiles against, here whole. Not in
// the navigation on purpose: the one way in is a row on the help page, and
// the page opens with a warning that none of it has been checked by a
// person. Titles and video addresses are third-party text from the
// auto-scripter's list; only http(s) addresses become links.
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { HBtn, HEmptyState, HandyLoader, hToast } from "@/components/handy";
import { useAiScripts } from "@/composables/useAiScripts";
import { useFormat } from "@/composables/useFormat";
import { track } from "@/services/analytics";
import {
  aiScriptFailure,
  downloadAiScript,
  type AiScript
} from "@/services/ai-scripts";

/** rows rendered per step: the list runs to thousands */
const PAGE = 100;

const { t } = useI18n();
const { duration, num, relative } = useFormat();
const { load, markGone, all, loaded, failed } = useAiScripts();

const query = ref("");
const limit = ref(PAGE);
const downloadingId = ref<string | null>(null);

watch(query, () => {
  limit.value = PAGE;
});

const filtered = computed(() => {
  const needle = query.value.trim().toLowerCase();
  if (!needle) return all.value;
  return all.value.filter(script =>
    nameOf(script).toLowerCase().includes(needle)
  );
});

const visible = computed(() => filtered.value.slice(0, limit.value));

const countLabel = computed(() =>
  t(
    "aiScripts.count",
    { count: num(filtered.value.length) },
    filtered.value.length
  )
);

function nameOf(script: AiScript): string {
  return script.title ?? script.id;
}

function metaOf(script: AiScript): string {
  return [
    script.durationS ? duration(script.durationS) : "",
    t("aiScripts.made", { when: relative(script.updated) })
  ]
    .filter(Boolean)
    .join(" · ");
}

async function download(event: Event, script: AiScript) {
  event.preventDefault();
  if (downloadingId.value) return;
  downloadingId.value = script.id;
  try {
    await downloadAiScript(script);
    track("script_download", { surface: "ai_scripts_page", outcome: "ok" });
  } catch (error) {
    track("script_download", {
      surface: "ai_scripts_page",
      outcome: "failed"
    });
    if (aiScriptFailure(error) === "gone") {
      markGone(script);
      hToast("negative", t("requests.ai.goneTitle"), t("requests.ai.goneBody"));
    } else {
      hToast(
        "negative",
        t("requests.ai.failedTitle"),
        t("requests.ai.failedBody")
      );
    }
  } finally {
    downloadingId.value = null;
  }
}

onMounted(() => {
  void load();
});
</script>

<style scoped lang="scss">
.ai-scripts-page {
  padding-bottom: var(--space-3xl);
}

// one centered 720px column, like the help page that links here
.ai-scripts-page__header,
.ai-scripts-page__warning,
.ai-scripts-page__controls,
.ai-scripts-page__list,
.ai-scripts-page__more,
.ai-scripts-page__center {
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
}

.ai-scripts-page__header {
  margin-bottom: var(--space-md);
}

.ai-scripts-page__title {
  margin: 0;
}

.ai-scripts-page__lead {
  color: var(--color-text-tertiary);
  margin: var(--space-xs) 0 0;
}

.ai-scripts-page__warning {
  display: flex;
  gap: var(--space-sm);
  align-items: flex-start;
  padding: var(--space-md);
  margin-bottom: var(--space-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-feedback-warning);
  background: color-mix(
    in srgb,
    var(--color-feedback-warning) 12%,
    transparent
  );

  p {
    margin: 0;
  }
}

.ai-scripts-page__warning-icon {
  color: var(--color-feedback-warning);
  flex-shrink: 0;
}

.ai-scripts-page__warning-title {
  font-weight: 600;
  color: var(--color-text-primary);
}

.ai-scripts-page__warning-body {
  color: var(--color-text-secondary);
  margin-top: 2px !important;
}

.ai-scripts-page__controls {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  margin-bottom: var(--space-sm);
}

.ai-scripts-page__count {
  color: var(--color-text-tertiary);
  margin: 0;
}

.ai-scripts-page__list {
  list-style: none;
  padding: 0;
  margin-top: 0;
  margin-bottom: 0;
}

.ai-scripts-page__row {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-sm) 0;
  border-bottom: 1px solid var(--color-stroke-subtle);
}

.ai-scripts-page__text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ai-scripts-page__name {
  color: var(--color-text-primary);
  // two lines: on a phone one line leaves a title three words long
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  overflow-wrap: anywhere;
}

.ai-scripts-page__meta {
  color: var(--color-text-tertiary);
}

.ai-scripts-page__download {
  flex-shrink: 0;
}

.ai-scripts-page__more {
  display: flex;
  justify-content: center;
  margin-top: var(--space-md);
}

.ai-scripts-page__center {
  padding: var(--space-2xl) 0;
}

.ai-scripts-page__loading {
  display: flex;
  justify-content: center;
  padding: var(--space-3xl) 0;
}
</style>
