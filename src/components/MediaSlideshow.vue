<template>
  <div
    ref="root"
    class="media-slideshow"
    role="group"
    :aria-roledescription="$t('performers.media.slideshow')"
    :aria-label="label"
    tabindex="0"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
    @focusin="focused = true"
    @focusout="onFocusOut"
    @keydown.left.prevent="step(-1)"
    @keydown.right.prevent="step(1)"
  >
    <div
      class="media-slideshow__stage"
      @pointerdown="onSwipeStart"
      @pointerup="onSwipeEnd"
      @pointercancel="cancelSwipe"
    >
      <slot
        v-if="current !== undefined"
        :item="current"
        :index="index"
        :playing="playing"
        :held="held"
        :next="() => step(1)"
      />

      <!-- how long this slide has left; paused exactly when the timer is -->
      <div
        v-if="interval && items.length > 1"
        :key="index"
        class="media-slideshow__progress"
        :style="{
          animationDuration: `${interval}ms`,
          animationPlayState: running ? 'running' : 'paused'
        }"
        aria-hidden="true"
      />

      <template v-if="items.length > 1">
        <button
          type="button"
          class="media-slideshow__nav media-slideshow__nav--prev"
          :aria-label="previousLabel"
          @click="step(-1)"
        >
          <q-icon name="chevron_left" size="24px" />
        </button>
        <button
          type="button"
          class="media-slideshow__nav media-slideshow__nav--next"
          :aria-label="nextLabel"
          @click="step(1)"
        >
          <q-icon name="chevron_right" size="24px" />
        </button>
      </template>
    </div>

    <div class="media-slideshow__bar">
      <div class="text-body-sm media-slideshow__caption">
        <slot v-if="current !== undefined" name="detail" :item="current" />
      </div>
      <span class="text-body-sm media-slideshow__counter">
        {{
          $t("performers.media.counter", {
            index: $n(index + 1),
            total: $n(items.length)
          })
        }}
      </span>
      <button
        type="button"
        class="media-slideshow__toggle"
        :aria-label="
          paused ? $t('performers.media.play') : $t('performers.media.pause')
        "
        :aria-pressed="paused"
        @click="paused = !paused"
      >
        <q-icon :name="paused ? 'play_arrow' : 'pause'" size="20px" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
// One item at a time, advancing on its own — the performer page's photo and
// clip slideshows. The slide itself is the caller's (default slot); this owns
// which one is showing and when the next one comes.
//
// With an `interval` the slideshow times each slide itself, and a thin bar
// along the top shows how long the current one has left. Without one, the
// slide decides — a clip calls `next` when it has played — and the slot's
// `playing` says whether it should be playing at all.
//
// Either way it holds still while it can't be watched (scrolled away, tab in
// the background), while the pointer or focus is on it, and once the reader
// presses pause. A reader who asked their system for less motion, or their
// browser for less data, starts paused: nothing moves or downloads until they
// press play.
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    items: T[];
    /** ms per slide; 0 = the slide calls `next` itself */
    interval?: number;
    /** names the slideshow for assistive tech */
    label: string;
    previousLabel: string;
    nextLabel: string;
  }>(),
  { interval: 0 }
);

/** the slide now showing — on mount, and each time it changes */
const emit = defineEmits<{ change: [index: number] }>();

defineSlots<{
  default(props: {
    item: T;
    index: number;
    /** visible, in a foreground tab and not paused — whether a clip should
     * be playing */
    playing: boolean;
    /** the pointer or focus is on it: a clip should loop, not move on */
    held: boolean;
    next: () => void;
  }): unknown;
  detail(props: { item: T }): unknown;
}>();

/** a horizontal drag this long, in px, is a swipe to the next slide */
const SWIPE_PX = 40;

const quiet =
  typeof matchMedia !== "undefined" &&
  (matchMedia("(prefers-reduced-motion: reduce)").matches ||
    Boolean(
      (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection?.saveData
    ));

const root = ref<HTMLElement | null>(null);
const index = ref(0);
const paused = ref(quiet);
const hovered = ref(false);
const focused = ref(false);
const inView = ref(false);
const pageVisible = ref(
  typeof document === "undefined" || document.visibilityState === "visible"
);

const current = computed<T | undefined>(() => props.items[index.value]);
const held = computed(() => hovered.value || focused.value);
const playing = computed(
  () => inView.value && pageVisible.value && !paused.value
);
/** whether this slideshow's own timer is counting down */
const running = computed(
  () =>
    Boolean(props.interval) &&
    props.items.length > 1 &&
    playing.value &&
    !held.value
);

function step(by: number) {
  const total = props.items.length;
  if (total < 2) return;
  index.value = (index.value + by + total) % total;
}

// the list can shrink under the current slide (a picture found dead is
// dropped from it)
watch(
  () => props.items.length,
  total => {
    if (index.value >= total) index.value = 0;
  }
);

// --- the timer: pausing keeps what was left of the slide, as the bar does ---

let timer = 0;
let remaining = props.interval;
let startedAt = 0;

function stopTimer() {
  if (!timer) return;
  window.clearTimeout(timer);
  timer = 0;
  remaining = Math.max(0, remaining - (performance.now() - startedAt));
}

function startTimer() {
  if (timer || !running.value) return;
  startedAt = performance.now();
  timer = window.setTimeout(() => {
    timer = 0;
    step(1);
  }, remaining);
}

watch(running, now => (now ? startTimer() : stopTimer()));

watch(index, now => {
  window.clearTimeout(timer);
  timer = 0;
  remaining = props.interval;
  startTimer();
  emit("change", now);
});

// --- hover and focus hold it still ---

function onPointerEnter(event: PointerEvent) {
  if (event.pointerType === "mouse") hovered.value = true;
}

function onPointerLeave(event: PointerEvent) {
  if (event.pointerType === "mouse") hovered.value = false;
}

function onFocusOut(event: FocusEvent) {
  if (!root.value?.contains(event.relatedTarget as Node | null)) {
    focused.value = false;
  }
}

// --- swipe ---

let swipeX: number | null = null;

function onSwipeStart(event: PointerEvent) {
  swipeX = event.pointerType === "mouse" ? null : event.clientX;
}

function cancelSwipe() {
  swipeX = null;
}

function onSwipeEnd(event: PointerEvent) {
  if (swipeX === null) return;
  const dx = event.clientX - swipeX;
  swipeX = null;
  if (Math.abs(dx) >= SWIPE_PX) step(dx < 0 ? 1 : -1);
}

// --- visibility ---

let observer: IntersectionObserver | undefined;

function onVisibility() {
  pageVisible.value = document.visibilityState === "visible";
}

onMounted(() => {
  emit("change", index.value);
  document.addEventListener("visibilitychange", onVisibility);
  if (!root.value) return;
  observer = new IntersectionObserver(
    ([entry]) => {
      inView.value = Boolean(entry && entry.intersectionRatio >= 0.5);
    },
    { threshold: [0, 0.5] }
  );
  observer.observe(root.value);
});

onBeforeUnmount(() => {
  window.clearTimeout(timer);
  observer?.disconnect();
  document.removeEventListener("visibilitychange", onVisibility);
});
</script>

<style scoped lang="scss">
.media-slideshow {
  display: grid;
  // minmax(0, …), not the implicit auto: an auto track grows to its
  // content's widest line, and a long video title in the caption pushed the
  // stage past a phone's edge
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-xs);
  min-width: 0;
  border-radius: var(--radius-lg);
  outline: none;

  &:focus-visible {
    outline: 2px solid var(--color-stroke-focus);
    outline-offset: 4px;
  }
}

.media-slideshow__stage {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-bg-page-alt);
  // vertical page scroll stays the browser's; a sideways drag is a swipe
  touch-action: pan-y;
}

.media-slideshow__progress {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  height: 3px;
  width: 100%;
  transform-origin: left;
  background: var(--color-action-primary);
  animation-name: media-slideshow-progress;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@keyframes media-slideshow-progress {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

// round, translucent and out of the way until the slideshow is pointed at
.media-slideshow__nav {
  position: absolute;
  top: 50%;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-top: -20px;
  padding: 0;
  border: 0;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--color-bg-card) 70%, transparent);
  color: var(--color-text-primary);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  cursor: pointer;
  opacity: 0;
  transition: opacity 180ms ease;

  &:focus-visible {
    opacity: 1;
    outline: 2px solid var(--color-stroke-focus);
  }
}

.media-slideshow__nav--prev {
  left: var(--space-sm);
}

.media-slideshow__nav--next {
  right: var(--space-sm);
}

.media-slideshow:hover .media-slideshow__nav,
.media-slideshow:focus-within .media-slideshow__nav {
  opacity: 1;
}

// no hover on touch, so there the arrows simply stay
@media (hover: none) {
  .media-slideshow__nav {
    opacity: 1;
  }
}

.media-slideshow__bar {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  min-height: 32px;
}

.media-slideshow__caption {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text-secondary);
}

.media-slideshow__counter {
  flex: none;
  color: var(--color-text-tertiary);
  font-variant-numeric: tabular-nums;
}

.media-slideshow__toggle {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: var(--radius-full);
  background: none;
  color: var(--color-text-secondary);
  cursor: pointer;

  &:hover {
    background: var(--color-row-hover);
  }

  &:focus-visible {
    outline: 2px solid var(--color-stroke-focus);
  }
}

@media (prefers-reduced-motion: reduce) {
  .media-slideshow__nav {
    transition: none;
  }
}
</style>
