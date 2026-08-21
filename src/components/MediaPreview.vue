<template>
  <div
    ref="root"
    class="media-preview"
    data-preview
    @mouseenter="start"
    @mouseleave="stop"
  >
    <MediaImage
      :src="frames[frame] ?? poster"
      :alt="alt"
      class="media-preview__layer"
    />

    <!-- only mounted while previewing, and only faded in once it can actually
         play: a still frame is a better card than an empty black well -->
    <video
      v-if="active && clip"
      ref="clipEl"
      :src="clip"
      class="media-preview__layer media-preview__clip"
      :class="{ 'media-preview__clip--ready': clipReady }"
      muted
      loop
      autoplay
      playsinline
      preload="none"
      disablepictureinpicture
      @canplay="onCanPlay"
      @error="failClip"
    />
  </div>
</template>

<script setup lang="ts">
// Preview for a media tile — on hover with a pointer, under your finger on
// a touch screen. Two ways to show one:
//
// - `preview` — a short silent roll clip the partner already publishes, on
//   7,041 of the index's 15,572 videos. Preferred when present.
// - the stills — `thumbnail` plus `images`, three per video for most of the
//   catalog, cycled a frame at a time.
//
// The clip can fail for reasons no `<video>` reports quickly: 5,749 of them
// are AV1-coded, which plenty of browsers still won't decode. So the stills
// stay mounted underneath, the clip fades in only on `canplay`, and a clip
// that hasn't started within CLIP_TIMEOUT_MS is abandoned for cycling.
//
// Pointer devices preview on hover. Touch devices preview whatever card is
// under the finger, following it as you scroll, and keep playing once you
// lift off. Both go through usePreviewStage, which owns the touch gesture and
// guarantees only one preview is ever running.
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import MediaImage from "@/components/MediaImage.vue";
import {
  claimPreview,
  registerPreview,
  releasePreview,
  unregisterPreview
} from "@/composables/usePreviewStage";
import { useCatalogStore } from "@/stores/catalog";
import { useSettingsStore } from "@/stores/settings";

const props = withDefaults(
  defineProps<{
    /** the still shown at rest — frame 0 of the cycle */
    poster: string;
    /** every still the partner published, in order */
    images?: readonly string[];
    /** partner roll clip, when there is one */
    preview?: string;
    alt?: string;
  }>(),
  { images: () => [], preview: "", alt: "" }
);

const CLIP_TIMEOUT_MS = 1500;

const catalog = useCatalogStore();
// both speeds are the reader's call — how long a still holds, and how fast a
// clip runs (see the settings dialog)
const settings = useSettingsStore();

const root = ref<HTMLElement | null>(null);
const active = ref(false);
const frame = ref(0);
const clipReady = ref(false);
/** this clip URL was tried and didn't play — never offer it again */
const deadClip = ref("");
const clipEl = ref<HTMLVideoElement | null>(null);

/** poster first, then the other stills — deduped, because 10,958 videos
 * repeat their thumbnail inside `images`, and skipping artwork already known
 * to 404 (a dead partner CDN is the catalog's most common broken link) */
const frames = computed(() => {
  const seen = new Set<string>();
  const list: string[] = [];
  for (const url of [props.poster, ...props.images]) {
    if (!url || seen.has(url) || catalog.brokenArtwork.has(url)) continue;
    seen.add(url);
    list.push(url);
  }
  return list.length ? list : [props.poster];
});

const clip = computed(() =>
  props.preview && props.preview !== deadClip.value ? props.preview : ""
);

let cycleTimer = 0;
let clipTimer = 0;

function stopCycling() {
  window.clearInterval(cycleTimer);
  cycleTimer = 0;
}

function startCycling() {
  if (cycleTimer || frames.value.length < 2) return;
  cycleTimer = window.setInterval(() => {
    frame.value = (frame.value + 1) % frames.value.length;
  }, settings.previewFrameMs);
}

function start() {
  if (active.value) return;
  // take the stage first: this stops whatever was playing elsewhere
  if (root.value) claimPreview(root.value);
  active.value = true;
  // the stills run even when a clip is loading: if the clip never plays, the
  // preview has already been showing something the whole time
  startCycling();
  if (clip.value) {
    clipTimer = window.setTimeout(() => {
      if (!clipReady.value) failClip();
    }, CLIP_TIMEOUT_MS);
  }
}

function stop() {
  if (root.value) releasePreview(root.value);
  window.clearTimeout(clipTimer);
  clipTimer = 0;
  stopCycling();
  active.value = false;
  clipReady.value = false;
  frame.value = 0;
}

function onCanPlay() {
  window.clearTimeout(clipTimer);
  clipTimer = 0;
  clipReady.value = true;
  // the clip carries the motion now; the stills underneath just hold the well
  stopCycling();
  applyRate();
  void clipEl.value?.play().catch(failClip);
}

function applyRate() {
  if (clipEl.value) clipEl.value.playbackRate = settings.previewClipRate;
}

// both speeds apply to whatever is playing right now, so dragging a slider in
// settings shows its effect on the card behind the dialog
watch(
  () => settings.previewFrameMs,
  () => {
    if (!cycleTimer) return;
    stopCycling();
    startCycling();
  }
);

watch(() => settings.previewClipRate, applyRate);

function failClip() {
  window.clearTimeout(clipTimer);
  clipTimer = 0;
  deadClip.value = props.preview;
  clipReady.value = false;
  startCycling();
}

// a recycled tile (carousels and the grid reuse DOM as you scroll) must not
// keep the previous video's frame index or dead-clip verdict
watch(
  () => props.poster,
  () => {
    deadClip.value = "";
    stop();
  }
);

onMounted(() => {
  if (root.value) registerPreview(root.value, { start, stop });
});

onBeforeUnmount(() => {
  if (root.value) unregisterPreview(root.value);
  stop();
});
</script>

<style scoped lang="scss">
.media-preview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.media-preview__layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.media-preview__clip {
  object-fit: cover;
  opacity: 0;
  transition: opacity 220ms ease;
}

.media-preview__clip--ready {
  opacity: 1;
}

// the cycle is a slideshow, not an animation the reader asked for
@media (prefers-reduced-motion: reduce) {
  .media-preview__clip {
    transition: none;
  }
}
</style>
