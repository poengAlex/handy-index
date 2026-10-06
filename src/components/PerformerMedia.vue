<template>
  <div
    :class="[
      'performer-media',
      { 'performer-media--pair': photos.length && reelItems.length }
    ]"
  >
    <section v-if="photos.length" :aria-labelledby="photosId">
      <h3 :id="photosId" class="text-h4 performer-media__title">
        {{ $t("performers.media.photos") }}
      </h3>
      <MediaSlideshow
        :items="photos"
        :interval="PHOTO_MS"
        :label="$t('performers.media.photos')"
        :previous-label="$t('performers.media.previous')"
        :next-label="$t('performers.media.next')"
        @change="prefetchAfter"
      >
        <template #default="{ item }">
          <Transition name="performer-media-fade">
            <div :key="item" class="performer-media__photo">
              <!-- the same picture, blurred to fill the frame: shown whole,
                   a portrait in a wide frame would otherwise sit between two
                   empty bars -->
              <img
                :src="item"
                alt=""
                class="performer-media__backdrop"
                aria-hidden="true"
              />
              <MediaImage
                :src="item"
                :alt="name"
                fit="contain"
                class="performer-media__picture"
              />
            </div>
          </Transition>
        </template>
      </MediaSlideshow>
    </section>

    <section v-if="reelItems.length" :aria-labelledby="reelId">
      <h3 :id="reelId" class="text-h4 performer-media__title">
        {{ $t("performers.media.reel") }}
      </h3>
      <MediaSlideshow
        :items="reelItems"
        :label="$t('performers.media.reel')"
        :previous-label="$t('performers.media.previousVideo')"
        :next-label="$t('performers.media.nextVideo')"
      >
        <template #default="{ item, playing, held, next }">
          <SlideClip
            :key="item.partnerVideoId"
            :video="item"
            :mode="reelMode"
            :playing="playing"
            :held="held"
            :alone="reelItems.length === 1"
            @done="next"
            @dead="deadClips.add($event)"
          />
        </template>
        <template #detail="{ item }">
          <router-link
            :to="`/videos/${item.partnerVideoId}`"
            class="performer-media__source"
          >
            {{ item.title || $t("performers.media.fromVideo") }}
          </router-link>
        </template>
      </MediaSlideshow>
    </section>
  </div>
</template>

<script setup lang="ts">
// A performer's pictures and videos, under their profile: two slideshows,
// side by side on a wide screen. Photos — of them, never video stills —
// advance on a timer. The reel shows their videos most played first, as
// clips or as photos, never mixed: each preview clip plays through and hands
// over to the next, so only one is ever downloading; only a performer with
// no clips at all gets their videos' stills. Dumb — the parent picks what
// goes in (services/script-index/performer-media.ts) and whether this shows
// at all.
import { computed, reactive, useId } from "vue";
import MediaImage from "@/components/MediaImage.vue";
import MediaSlideshow from "@/components/MediaSlideshow.vue";
import SlideClip from "@/components/SlideClip.vue";
import type { ReelSource } from "@/services/script-index/performer-media";

const props = defineProps<{
  name: string;
  /** pictures of the performer — never video stills, which are the reel's */
  photos: string[];
  reel: ReelSource;
}>();

/** how long each photo holds */
const PHOTO_MS = 5000;

const photosId = useId();
const reelId = useId();

/** Clips that didn't play here (5,749 of the catalog's are AV1, which
 * plenty of browsers won't decode). Each is dropped from the reel the moment
 * it fails, so the next clip plays instead of its stills standing in. */
const deadClips = reactive(new Set<string>());

const playableClips = computed(() =>
  props.reel.clips.filter(video => !deadClips.has(video.preview ?? ""))
);

/** Clips or photos, never a mix: the clips while any is left to play, and
 * the videos' stills only for a performer none of whose videos has one — or
 * once every clip has failed in this browser. */
const reelMode = computed(() =>
  playableClips.value.length ? "clip" : "stills"
);

const reelItems = computed(() =>
  reelMode.value === "clip" ? playableClips.value : props.reel.stills
);

/** The photo after this one, fetched while this one shows, so a slide never
 * fades in on an empty frame. The browser's cache keeps it until it's up. */
const fetched = new Set<string>();

function prefetchAfter(index: number) {
  const url = props.photos[(index + 1) % props.photos.length];
  if (!url || fetched.has(url) || typeof Image === "undefined") return;
  fetched.add(url);
  new Image().src = url;
}
</script>

<style scoped lang="scss">
.performer-media {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-lg);
  min-width: 0;

  > section {
    min-width: 0;
  }
}

// photos and clips side by side once there is room for both at a useful size
@media (min-width: 1024px) {
  .performer-media--pair {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
}

.performer-media__title {
  margin: 0 0 var(--space-sm);
  color: var(--color-text-primary);
}

.performer-media__photo {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.performer-media__backdrop {
  position: absolute;
  inset: -24px;
  width: calc(100% + 48px);
  height: calc(100% + 48px);
  object-fit: cover;
  filter: blur(24px) brightness(0.7);
}

.performer-media__picture {
  position: absolute;
  inset: 0;
}

.performer-media__source {
  color: var(--color-text-link);
}

.performer-media-fade-enter-active,
.performer-media-fade-leave-active {
  transition: opacity 600ms ease;
}

.performer-media-fade-enter-from,
.performer-media-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .performer-media-fade-enter-active,
  .performer-media-fade-leave-active {
    transition: none;
  }
}
</style>
