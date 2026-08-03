<template>
  <TileCard
    :to="`/videos/${video.partnerVideoId}`"
    :aria-label="video.title ?? 'Video'"
  >
    <template #media>
      <MediaImage
        v-if="settings.nsfw && artwork"
        :src="artwork"
        :alt="video.title ?? 'Video'"
        class="tile-card__img"
      />
      <div v-else class="tile-card__placeholder">
        <q-icon name="movie" size="32px" />
      </div>
      <HChip v-if="isVr" label="VR" class="video-card__badge" />
    </template>
    <div class="text-body-compact video-card__title">
      {{ video.title }}
    </div>
    <div v-if="caption" class="text-caption video-card__caption">
      {{ caption }}
    </div>
  </TileCard>
</template>

<script setup lang="ts">
// The catalog media tile: TileCard with a 16:9 thumbnail well over two text
// lines. Explicit artwork only renders when the NSFW setting is on.
import { computed } from "vue";
import { HChip } from "@/components/handy";
import MediaImage from "@/components/MediaImage.vue";
import TileCard from "@/components/TileCard.vue";
import { formatDuration } from "@/services/format";
import { artworkOf } from "@/services/script-index/queries";
import type { PartnerVideo } from "@/services/script-index/types";
import { useSettingsStore } from "@/stores/settings";

const props = defineProps<{ video: PartnerVideo }>();

const settings = useSettingsStore();

const artwork = computed(() => artworkOf(props.video));

const isVr = computed(() => props.video.format?.format === "vr");

const caption = computed(() =>
  [props.video.partnerName, formatDuration(props.video.duration)]
    .filter(Boolean)
    .join(" · ")
);
</script>

<style scoped lang="scss">
.video-card__badge {
  position: absolute;
  top: var(--space-xs);
  left: var(--space-xs);
}

.video-card__title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  min-height: 2.66em; // two compact lines, so cards in a row stay equal
}

.video-card__caption {
  color: var(--color-text-tertiary);
}
</style>
