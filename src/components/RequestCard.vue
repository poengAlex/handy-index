<template>
  <article class="request-card">
    <!-- both the thumb and the title open the source video, so the row has a
         real target whichever half you aim at; the aside is left to the page,
         whose vote button must not sit inside a link -->
    <component
      :is="href ? 'a' : 'div'"
      v-bind="linkAttrs"
      class="request-card__thumb"
    >
      <MediaImage
        v-if="settings.nsfw && request.thumbnail"
        :src="request.thumbnail"
        :alt="request.title ?? 'Video request'"
        icon-size="24px"
      />
      <div v-else class="request-card__placeholder">
        <q-icon name="movie" size="24px" />
      </div>
    </component>

    <div class="request-card__body">
      <component
        :is="href ? 'a' : 'div'"
        v-bind="linkAttrs"
        class="text-body-compact request-card__name"
        :class="{ 'request-card__name--link': href }"
      >
        {{ name }}
        <q-icon
          v-if="href"
          name="open_in_new"
          size="14px"
          class="request-card__open"
        />
      </component>
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
// (vote tally, status badge, …). Thumb and title link out to the source
// video — a request is a video you can go and look at.
import { computed } from "vue";
import MediaImage from "@/components/MediaImage.vue";
import { formatDuration, relativeTime } from "@/services/format";
import type { VideoRequest } from "@/services/script-index/types";
import { useSettingsStore } from "@/stores/settings";

const props = defineProps<{ request: VideoRequest }>();

const settings = useSettingsStore();

const name = computed(
  () => props.request.title ?? props.request.domain ?? "Video request"
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

// noreferrer as well as noopener: the partner has no business being told
// which catalog page the visit came from
const linkAttrs = computed(() =>
  href.value
    ? {
        href: href.value,
        target: "_blank",
        rel: "noopener noreferrer",
        title: `Open on ${props.request.domain ?? "the partner site"}`
      }
    : {}
);

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
  display: block;
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
  color: inherit;
  text-decoration: none;
}

// a link, but not a shouty one: the row is a card, so the underline waits
// for hover/focus rather than colouring the whole title
.request-card__name--link:hover,
.request-card__name--link:focus-visible {
  text-decoration: underline;
  text-underline-offset: 2px;
}

.request-card__open {
  color: var(--color-text-tertiary);
  margin-left: 4px;
  vertical-align: baseline;
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
