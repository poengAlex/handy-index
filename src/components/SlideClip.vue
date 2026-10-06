<template>
  <router-link
    :to="`/videos/${video.partnerVideoId}`"
    class="slide-clip"
    :aria-label="video.title || ''"
  >
    <Transition name="slide-clip-fade">
      <MediaImage
        :key="still"
        :src="still"
        :alt="video.title || ''"
        error-icon="movie"
        class="slide-clip__layer"
      />
    </Transition>
    <!-- mounted only while it may play: a paused or off-screen slideshow
         downloads nothing; faded in once it actually can play -->
    <video
      v-if="playing && clip"
      ref="clipEl"
      :src="clip"
      class="slide-clip__layer slide-clip__video"
      :class="{ 'slide-clip__video--ready': ready }"
      muted
      autoplay
      playsinline
      preload="none"
      disablepictureinpicture
      @canplay="onCanPlay"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      @error="fail"
    />
  </router-link>
</template>

<script setup lang="ts">
// One slide of the performer's reel, in whichever of the reel's two modes it
// is in — the reel is clips or photos, never a mix:
//
// - "clip": the video's preview clip, muted, over its poster while it loads;
//   played once and then handing over to the next slide (`done`), or played
//   again while the slideshow is held (pointer or focus on it), so the clip
//   being looked at never moves away. One that hasn't started within
//   CLIP_TIMEOUT_MS — 5,749 of the catalog's clips are AV1, which plenty of
//   browsers won't decode — is reported `dead`, and the reel drops it.
// - "stills": the video's stills in turn, then the next slide.
//
// The link opens the video.
import { computed, onBeforeUnmount, ref, watch } from "vue";
import MediaImage from "@/components/MediaImage.vue";
import { videoStills } from "@/services/script-index/performer-media";
import type { PartnerVideo } from "@/services/script-index/types";
import { useCatalogStore } from "@/stores/catalog";
import { useSettingsStore } from "@/stores/settings";

const props = defineProps<{
  video: PartnerVideo;
  mode: "clip" | "stills";
  /** the slideshow is visible and not paused */
  playing: boolean;
  /** the pointer or focus is on the slideshow: stay on this video */
  held: boolean;
  /** the only slide in the reel: there is no next one to hand over to, so
   * the clip plays again from the start, and the stills start over */
  alone?: boolean;
}>();

const emit = defineEmits<{
  done: [];
  /** this preview clip doesn't play here — its URL */
  dead: [clip: string];
}>();

const CLIP_TIMEOUT_MS = 4000;
/** how long each still holds, where the video has no clip */
const STILL_MS = 2500;
/** stills shown before moving on: enough to see the scene, not all of a
 * twelve-image set */
const MAX_STILLS = 4;
/** a long clip is cut here, so one slide can't hold the slideshow forever */
const CLIP_MAX_S = 20;

const catalog = useCatalogStore();
const settings = useSettingsStore();
const clipEl = ref<HTMLVideoElement | null>(null);
const ready = ref(false);
/** this clip didn't play — it is reported and nothing more is tried */
const dead = ref(false);
const frame = ref(0);

const stills = computed(() =>
  videoStills(props.video, catalog.brokenArtwork).slice(0, MAX_STILLS)
);
const still = computed(
  () => stills.value[frame.value] ?? stills.value[0] ?? ""
);
const clip = computed(() =>
  props.mode === "clip" && !dead.value ? (props.video.preview ?? "") : ""
);

let timer = 0;

function stopTimer() {
  window.clearTimeout(timer);
  timer = 0;
}

/** Stills mode: the next still after STILL_MS, and after the last one the
 * next slide. Held or paused, it stays on the still it's on. */
function stepStills() {
  stopTimer();
  if (props.mode !== "stills" || !props.playing || props.held) return;
  timer = window.setTimeout(() => {
    if (frame.value + 1 < stills.value.length) {
      frame.value += 1;
      stepStills();
    } else if (props.alone) {
      frame.value = 0;
      stepStills();
    } else {
      emit("done");
    }
  }, STILL_MS);
}

function onCanPlay() {
  stopTimer();
  ready.value = true;
  if (clipEl.value) clipEl.value.playbackRate = settings.previewClipRate;
  void clipEl.value?.play().catch(fail);
}

/** The clip has played through: the next slide — or, held or alone, this one
 * again from the start, so a reel never just stops. */
function finish() {
  if ((props.held || props.alone) && clipEl.value) {
    clipEl.value.currentTime = 0;
    void clipEl.value.play().catch(fail);
  } else {
    emit("done");
  }
}

function onEnded() {
  finish();
}

function onTimeUpdate() {
  if ((clipEl.value?.currentTime ?? 0) >= CLIP_MAX_S) finish();
}

function fail() {
  stopTimer();
  if (dead.value) return;
  dead.value = true;
  ready.value = false;
  emit("dead", props.video.preview ?? "");
}

// starting, stopping, held or let go: a clip starts over (and is given its
// timeout); stills pick up from the one showing
watch(
  () => [props.playing, props.held] as const,
  ([now], previous) => {
    const resumed = !previous || previous[0] !== now;
    if (props.mode === "clip") {
      if (!clip.value) return;
      if (!resumed) return;
      stopTimer();
      ready.value = false;
      if (now) timer = window.setTimeout(fail, CLIP_TIMEOUT_MS);
    } else {
      stepStills();
    }
  },
  { immediate: true }
);

watch(
  () => settings.previewClipRate,
  rate => {
    if (clipEl.value) clipEl.value.playbackRate = rate;
  }
);

onBeforeUnmount(stopTimer);
</script>

<style scoped lang="scss">
.slide-clip {
  position: absolute;
  inset: 0;
  display: block;
  text-decoration: none !important;
}

.slide-clip__layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.slide-clip__video {
  object-fit: cover;
  opacity: 0;
  transition: opacity 220ms ease;
}

.slide-clip__video--ready {
  opacity: 1;
}

.slide-clip-fade-enter-active,
.slide-clip-fade-leave-active {
  transition: opacity 600ms ease;
}

.slide-clip-fade-enter-from,
.slide-clip-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .slide-clip__video,
  .slide-clip-fade-enter-active,
  .slide-clip-fade-leave-active {
    transition: none;
  }
}
</style>
