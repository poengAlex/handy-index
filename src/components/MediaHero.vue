<template>
  <section :class="['media-hero', `media-hero--${size}`]">
    <MediaImage
      v-if="settings.nsfw && artwork"
      :src="artwork"
      :alt="alt"
      error-icon=""
      class="media-hero__img"
    />
    <div class="media-hero__scrim" />
    <div class="h-container media-hero__content">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
// The shared media banner: full-bleed artwork under a mandatory scrim, slot
// content bottom-aligned to the page gutter in always-white ink. Used by the
// home hero and the video detail banner. Artwork only renders with NSFW on;
// a load failure falls back to the plain surface (MediaImage, no icon).
import MediaImage from "@/components/MediaImage.vue";
import { useSettingsStore } from "@/stores/settings";

withDefaults(
  defineProps<{
    // `| undefined` keeps callers free to pass artworkOf(video) straight
    // through under exactOptionalPropertyTypes
    artwork?: string | undefined;
    alt?: string | undefined;
    /** lg = home hero, md = detail banner */
    size?: "lg" | "md";
  }>(),
  { artwork: "", alt: "", size: "lg" }
);

const settings = useSettingsStore();
</script>

<style scoped lang="scss">
.media-hero {
  position: relative;
  display: flex;
  align-items: flex-end;
  background: var(--color-bg-page-alt);
  overflow: hidden;
}

.media-hero--lg {
  min-height: clamp(320px, 56vh, 560px);
}

.media-hero--md {
  min-height: clamp(280px, 48vh, 480px);
}

.media-hero__img {
  position: absolute;
  inset: 0;
}

// text over media always sits on a scrim, never a text-shadow
.media-hero__scrim {
  position: absolute;
  inset: 0;
  background: var(--scrim-bottom-dark);
}

.media-hero__content {
  position: relative;
  width: 100%;
  padding-top: var(--space-2xl);
  padding-bottom: var(--space-xl);
  color: var(--color-text-on-fill); // always-white: it sits on the scrim
}
</style>
