<template>
  <section :class="['media-hero', `media-hero--${size}`]">
    <MediaImage
      v-if="showArtwork"
      :src="artwork"
      alt=""
      error-icon=""
      aria-hidden="true"
      class="media-hero__backdrop"
    />
    <div class="media-hero__scrim" />
    <div class="h-container media-hero__content">
      <div class="media-hero__body">
        <slot />
      </div>
      <div v-if="showArtwork" class="media-hero__thumb">
        <MediaImage :src="artwork" :alt="alt" error-icon="" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// The shared media banner. Partner artwork is low-res thumbnail stock, so it
// is never shown stretched on wide screens: there the full-bleed layer is
// blurred into an ambient backdrop (blur hides upscaling artifacts) and the
// sharp copy renders small in a contained card beside the text. At phone and
// tablet widths the backdrop is close to native resolution and no thumb card
// renders, so it is left unblurred and reads as the image itself. Slot content sits
// bottom-aligned on a mandatory scrim in always-white ink. Used by the home
// hero and the video detail banner. Artwork only renders with NSFW on; a
// load failure falls back to the plain surface (MediaImage, no icon).
import { computed } from "vue";
import MediaImage from "@/components/MediaImage.vue";
import { useSettingsStore } from "@/stores/settings";

const props = withDefaults(
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

const showArtwork = computed(() => settings.nsfw && Boolean(props.artwork));
</script>

<style scoped lang="scss">
.media-hero {
  position: relative;
  display: flex;
  align-items: flex-end;
  background: var(--color-bg-page-alt);
  overflow: hidden;
}

// compact by design: the backdrop is blurred so it tolerates any height,
// and the sharp artwork never renders larger than the thumb card
.media-hero--lg {
  min-height: clamp(220px, 34vh, 380px);
}

.media-hero--md {
  min-height: clamp(180px, 26vh, 300px);
}

.media-hero__backdrop {
  position: absolute;
  inset: 0;
  // phones/tablets sit close to the artwork's native resolution, and the
  // thumb card that carries the sharp copy on wide screens does not render
  // here — so the backdrop is left unblurred and reads as the image itself
  filter: saturate(1.1);

  // wide screens stretch the low-res art far past its native size, so the
  // ambient blur starts where the sharp thumb card takes over — kept light
  // enough that the backdrop still reads as the video rather than as fog
  @media (min-width: 1024px) {
    filter: blur(8px) saturate(1.15);
    // scale covers the blur's soft edges: at the hero's ~380px cap the 5%
    // bleed is ~9px a side, just past the radius
    transform: scale(1.05);
  }
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
  display: flex;
  align-items: flex-end;
  gap: var(--space-xl);
  padding-top: var(--space-xl);
  padding-bottom: var(--space-lg);
  color: var(--color-text-on-fill); // always-white: it sits on the scrim
}

.media-hero__body {
  flex: 1;
  min-width: 0;
}

// the sharp copy of the artwork, close to its native resolution
.media-hero__thumb {
  display: none;

  @media (min-width: 1024px) {
    display: block;
    flex: none;
    width: clamp(280px, 28vw, 380px);
    aspect-ratio: 16 / 9;
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-md);
  }
}
</style>
