<template>
  <TileCard :href="href" :aria-label="$t('requests.card.openAria', { name })">
    <template #media>
      <MediaPreview
        v-if="settings.nsfw && request.thumbnail"
        :poster="request.thumbnail"
        :images="request.images ?? []"
        :alt="name"
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

    <template #footer>
      <slot />
    </template>
  </TileCard>
</template>

<script setup lang="ts">
// One request tile (voting board + queue), in the same shape as a catalog
// video card: NSFW-gated 16:9 well, title over a meta line, page-supplied
// actions in the footer. The tile links out to the source video — a request
// is a video you can go and look at — which is why the vote controls sit in
// TileCard's footer slot, outside that link. Requests ship seven stills and
// no roll clip, so hovering one cycles the stills.
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { HChip } from "@/components/handy";
import MediaPreview from "@/components/MediaPreview.vue";
import TileCard from "@/components/TileCard.vue";
import { useFormat } from "@/composables/useFormat";
import type { VideoRequest } from "@/services/script-index/types";
import { useSettingsStore } from "@/stores/settings";

const props = withDefaults(
  defineProps<{
    request: VideoRequest;
    /** 1-based place in the scripting order; omitted on the voting board */
    rank?: number;
  }>(),
  { rank: 0 }
);

const settings = useSettingsStore();
const { t } = useI18n();
const { duration, relative } = useFormat();

const name = computed(
  () =>
    props.request.title ?? props.request.domain ?? t("requests.card.untitled")
);

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
</style>
