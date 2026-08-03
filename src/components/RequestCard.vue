<template>
  <article class="request-card">
    <div class="request-card__thumb">
      <MediaImage
        v-if="settings.nsfw && request.thumbnail"
        :src="request.thumbnail"
        :alt="request.title ?? 'Video request'"
        icon-size="24px"
      />
      <div v-else class="request-card__placeholder">
        <q-icon name="movie" size="24px" />
      </div>
    </div>

    <div class="request-card__body">
      <div class="text-body-compact request-card__name">
        {{ request.title ?? request.domain ?? "Video request" }}
      </div>
      <div v-if="caption" class="text-caption request-card__caption">
        {{ caption }}
      </div>
    </div>

    <div class="request-card__aside">
      <slot />
    </div>
  </article>
</template>

<script setup lang="ts">
// One request row (voting board + queue): NSFW-gated 16:9 thumb, title with
// domain fallback, caption line, and a slot for the page-specific aside
// (vote tally, status badge, …).
import { computed } from "vue";
import MediaImage from "@/components/MediaImage.vue";
import { formatDuration, relativeTime } from "@/services/format";
import type { VideoRequest } from "@/services/script-index/types";
import { useSettingsStore } from "@/stores/settings";

const props = defineProps<{ request: VideoRequest }>();

const settings = useSettingsStore();

const caption = computed(() =>
  [
    props.request.domain,
    formatDuration(props.request.duration),
    relativeTime(props.request.createdAt)
  ]
    .filter(Boolean)
    .join(" · ")
);
</script>

<style scoped lang="scss">
.request-card {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
}

.request-card__thumb {
  flex: none;
  width: 160px;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-sm); // thumbnails take radius-sm per the spec
  overflow: hidden;
  background: var(--color-bg-page-alt);

  @media (max-width: 599px) {
    display: none;
  }
}

.request-card__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
}

.request-card__body {
  flex: 1;
  min-width: 0;
}

.request-card__name {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.request-card__caption {
  color: var(--color-text-tertiary);
  margin-top: 2px;
}

.request-card__aside {
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
}
</style>
