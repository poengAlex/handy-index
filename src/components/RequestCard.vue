<template>
  <TileCard :href="href" :aria-label="$t('requests.card.openAria', { name })">
    <template #media>
      <MediaPreview
        v-if="settings.nsfw && artwork"
        :poster="artwork"
        :images="request.images ?? []"
        :preview="request.preview ?? ''"
        :alt="name"
        :enabled="settings.videoCardPreviews"
        class="tile-card__img"
      />
      <div v-else class="tile-card__placeholder">
        <q-icon name="movie" size="32px" />
      </div>
      <!-- queue position, not the row number: it stays put while you filter -->
      <HChip
        v-if="rank"
        :label="$t('requests.card.rank', { rank: $n(rank) })"
        class="request-card__badge"
      />
      <q-icon
        v-if="href"
        name="open_in_new"
        size="16px"
        class="request-card__open"
      />
    </template>

    <div class="text-body-compact request-card__title">{{ name }}</div>
    <div v-if="caption" class="text-caption request-card__caption">
      {{ caption }}
    </div>

    <template v-if="aiScript || $slots.default" #footer>
      <div class="request-card__footer">
        <!-- the auto-scripter's script, when it has made one: a real link
             (copyable, opens anywhere), fetched in place on a plain click so
             a taken-down script can say so instead of opening an error -->
        <div v-if="aiScript" class="request-card__ai">
          <HBtn
            size="sm"
            icon="download"
            :label="$t('requests.ai.action')"
            :href="aiScript.download"
            :loading="aiLoading"
            class="request-card__ai-btn"
            @click="downloadAi"
          />
          <span class="text-caption request-card__ai-note">
            {{ $t("requests.ai.note", { when: relative(aiScript.updated) }) }}
          </span>
        </div>
        <div v-if="$slots.default" class="request-card__actions">
          <slot />
        </div>
      </div>
    </template>
  </TileCard>
</template>

<script setup lang="ts">
// One request tile on the voting board, in the same shape as a catalog
// video card: NSFW-gated 16:9 well, title over a meta line, page-supplied
// actions in the footer. The tile links out to the source video — a request
// is a video you can go and look at — which is why the vote controls sit in
// TileCard's footer slot, outside that link. Hovering previews it the way it
// does a video: the roll clip when the request has one, else the stills.
// When Handy's auto-scripter has made a script for the video, its download
// sits above the page's actions, marked as made by AI.
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { HBtn, HChip } from "@/components/handy";
import MediaPreview from "@/components/MediaPreview.vue";
import TileCard from "@/components/TileCard.vue";
import { useFormat } from "@/composables/useFormat";
import { artworkOf } from "@/services/script-index/queries";
import type { AiScript } from "@/services/ai-scripts";
import type { VideoRequest } from "@/services/script-index/types";
import { useSettingsStore } from "@/stores/settings";

const props = withDefaults(
  defineProps<{
    request: VideoRequest;
    /** 1-based place in the scripting order; omitted on the voting board */
    rank?: number;
    /** the auto-scripter's script for this video, if it has one */
    aiScript?: AiScript | undefined;
    aiLoading?: boolean;
  }>(),
  { rank: 0, aiScript: undefined, aiLoading: false }
);

const emit = defineEmits<{ aiDownload: [script: AiScript] }>();

function downloadAi(event: Event) {
  event.preventDefault();
  if (props.aiScript) emit("aiDownload", props.aiScript);
}

const settings = useSettingsStore();
const { t } = useI18n();
const { duration, relative } = useFormat();

const name = computed(
  () =>
    props.request.title ?? props.request.domain ?? t("requests.card.untitled")
);

const artwork = computed(() => artworkOf(props.request));

/** The request URL, if it is one we're willing to hand the browser. It comes
 * straight from a third-party payload, and an unchecked `javascript:` in an
 * href is script execution — so only http(s) ever becomes a link. */
const href = computed(() => {
  const raw = props.request.url;
  if (!raw) return "";
  try {
    const url = new URL(raw);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.href
      : "";
  } catch {
    return "";
  }
});

// a metadata list, not a sentence: the domain is catalog data, the other two
// are locale-formatted, and the separator carries no grammar
const caption = computed(() =>
  [
    props.request.domain,
    duration(props.request.duration),
    relative(props.request.createdAt)
  ]
    .filter(Boolean)
    .join(" · ")
);
</script>

<style scoped lang="scss">
.request-card__badge {
  position: absolute;
  top: var(--space-xs);
  left: var(--space-xs);
}

// the one hint that the tile leaves the app; sits opposite the rank badge
.request-card__open {
  position: absolute;
  top: var(--space-xs);
  right: var(--space-xs);
  color: #fff;
  opacity: 0.8;
  filter: drop-shadow(0 1px 2px rgb(0 0 0 / 55%));
}

.request-card__title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.request-card__caption {
  color: var(--color-text-tertiary);
}

// TileCard's footer is one row; this stacks the AI script over the page's
// actions, which keep that row's spread
.request-card__footer {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.request-card__ai {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.request-card__ai-btn {
  width: 100%;
}

.request-card__ai-note {
  color: var(--color-text-tertiary);
}

.request-card__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xs);
}
</style>
