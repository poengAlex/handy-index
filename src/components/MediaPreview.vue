<template>
  <div
    ref="root"
    class="media-preview"
    @pointerenter="onEnter"
    @pointerleave="onLeave"
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
// Preview for a media tile — on hover with a pointer, on touch with a
// finger. Two ways to show one:
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
// Touch previews the card the finger LANDS on, and nothing else. The
// listener sits on the whole tile, not this well — a finger anywhere on a
// card is asking about that card — and it starts on contact, with no
// threshold to clear first: any touch counts, whether it becomes a tap, a
// page scroll or a carousel drag. That it fires once per gesture is the
// whole trick. The version before this one hit-tested elementFromPoint on
// every touchmove and mounted a <video> for each card the finger crossed,
// both on the main thread inside the same rAF vue3-carousel drags the shelf
// with, and sliding stuttered on every phone.
//
// A touch preview outlives the gesture (pointerleave fires the moment a
// finger lifts, and the browser cancels the pointer outright when a scroll
// takes over — stopping there would leave a fling showing nothing). It runs
// until another card claims the stage, until it scrolls out of view, or until
// the tile is recycled. usePreviewStage guarantees exactly one runs at a
// time, whatever started it.
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
/** the tile this preview lives in — where touches are listened for */
let card: Element | null = null;

function stopCycling() {
  window.clearInterval(cycleTimer);
  cycleTimer = 0;
}

function advance() {
  frame.value = (frame.value + 1) % frames.value.length;
}

/** `now` steps a frame before the first interval elapses — the poster is
 * already on screen, so a preview that opens by holding it for a full beat
 * reads as nothing having happened. Only for the stills-only path: where a
 * clip is coming, the swap is a flicker under a video about to fade in. */
function startCycling(now = false) {
  if (cycleTimer || frames.value.length < 2) return;
  if (now) advance();
  cycleTimer = window.setInterval(advance, settings.previewFrameMs);
}

// Hover is the mouse's alone: touch fires the enter/leave pair too, and on
// touch the pair means "finger down / finger up" — a preview has to survive
// the lift.
function onEnter(e: PointerEvent) {
  if (e.pointerType === "mouse") start();
}

function onLeave(e: PointerEvent) {
  if (e.pointerType === "mouse") stop();
}

function start() {
  if (active.value) return;
  // take the stage first: this stops whatever was playing elsewhere
  if (root.value) claimPreview(root.value);
  active.value = true;
  // the stills run even when a clip is loading: if the clip never plays, the
  // preview has already been showing something the whole time
  startCycling(!clip.value);
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
  // the clip is out of the picture now, so the stills owe the same instant
  // answer they would have given on their own
  startCycling(true);
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
  if (!root.value) return;
  registerPreview(root.value, { start, stop });
  // touchstart rather than pointerdown: it is the event iOS raises the
  // instant a finger lands, and start() is a no-op once a preview is running
  card = root.value.closest(".tile-card") ?? root.value;
  card.addEventListener("touchstart", start, { passive: true });
});

onBeforeUnmount(() => {
  card?.removeEventListener("touchstart", start);
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
