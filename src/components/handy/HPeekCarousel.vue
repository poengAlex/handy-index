<template>
  <!-- full-bleed: spans the whole viewport so cards scroll/fade off both real
       screen edges; the first card is still aligned to the page content via a
       margin on the inner track (see styles), which the library doesn't factor
       into its snap math, so the sliding stays stable -->
  <div
    :class="[
      'h-peek',
      { 'h-peek--contained': contained, 'h-peek--idle': !arrowsVisible }
    ]"
    :style="{ '--peek-item': itemWidth }"
    @wheel="onWheel"
    @pointerenter="showArrows()"
    @pointerleave="fadeArrowsSoon()"
    @pointerdown="onPointerDown"
    @focusin="showArrows()"
    @focusout="fadeArrowsSoon()"
  >
    <Carousel
      ref="carousel"
      v-bind="config"
      :class="[
        'h-peek__carousel',
        { 'h-peek__carousel--bounded': !loop && !skeleton }
      ]"
    >
      <template v-if="skeleton">
        <Slide v-for="n in skeletonCount" :key="`sk-${n}`">
          <div class="h-peek__slide" :style="{ width: itemWidth }">
            <div
              v-if="skeletonHeight"
              class="h-peek__skel-block"
              :style="{ height: skeletonHeight }"
            />
            <div v-else class="h-peek__skel">
              <div class="h-peek__skel-media" />
              <div class="h-peek__skel-text">
                <div class="h-peek__skel-line" />
                <div class="h-peek__skel-line h-peek__skel-line--short" />
              </div>
            </div>
          </div>
        </Slide>
      </template>
      <template v-else>
        <Slide v-for="(item, i) in items" :key="i">
          <div class="h-peek__slide" :style="{ width: itemWidth }">
            <slot :item="item" :index="i" />
          </div>
        </Slide>
      </template>
      <template v-if="!skeleton" #addons>
        <Navigation />
      </template>
    </Carousel>
  </div>
</template>

<script setup lang="ts" generic="T">
// Reusable peek carousel (vue3-carousel). Cards are a fixed width
// (itemsToShow: "auto") so they don't balloon on wide screens. Runs full-bleed
// and HORIZONTAL by gesture, but `touch-action: pan-y` still lets the page
// scroll vertically when a finger is on it. Has a built-in skeleton state.
import { computed, onBeforeUnmount, ref } from "vue";
import { Carousel, Navigation, Slide } from "vue3-carousel";
import "vue3-carousel/carousel.css";

const props = withDefaults(
  defineProps<{
    items?: T[];
    loop?: boolean;
    autoplay?: number;
    itemWidth?: string;
    skeleton?: boolean;
    skeletonCount?: number;
    skeletonHeight?: string;
    /** bound the row to its parent instead of breaking out full-bleed */
    contained?: boolean;
  }>(),
  {
    items: () => [],
    loop: false,
    autoplay: 0,
    itemWidth: "clamp(260px, 80vw, 300px)",
    skeleton: false,
    skeletonCount: 8,
    skeletonHeight: "",
    contained: false
  }
);

defineSlots<{ default(props: { item: T; index: number }): unknown }>();

const carousel = ref<{ next: () => void; prev: () => void } | null>(null);

// The nav arrows earn their place: hidden by default (a fresh page shows
// clean cards), summoned by the pointer or keyboard focus landing on the
// carousel, or by a touch/drag/wheel interaction — then they retire again
// after a short idle. The peeking next card is the scroll affordance; the
// arrows are only the mouse-user's controls.
const ARROW_IDLE_MS = 2500;
const arrowsVisible = ref(false);
let arrowTimer: ReturnType<typeof setTimeout> | undefined;

function showArrows(scheduleFade = false) {
  arrowsVisible.value = true;
  clearTimeout(arrowTimer);
  if (scheduleFade) fadeArrowsSoon();
}

function fadeArrowsSoon() {
  clearTimeout(arrowTimer);
  arrowTimer = setTimeout(() => {
    arrowsVisible.value = false;
  }, ARROW_IDLE_MS);
}

// touch has no hover to keep the arrows alive, so a touch interaction shows
// them with the fade pre-armed; a mouse press keeps them until pointerleave
function onPointerDown(e: PointerEvent) {
  showArrows(e.pointerType !== "mouse");
}

onBeforeUnmount(() => clearTimeout(arrowTimer));

// Custom wheel handling. The library's mouseWheel option falls back to the
// vertical axis (deltaY) for a horizontal carousel, so a normal scroll wheel
// would move the cards — we don't want that. Here ONLY a horizontal-intent
// gesture (trackpad sideways, shift+wheel) advances the carousel; a vertical
// wheel is ignored so it scrolls the page normally.
let lastWheel = 0;
function onWheel(e: WheelEvent) {
  // vertical-dominant gesture → leave it alone so the page scrolls
  if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
  // horizontal-dominant → the carousel owns it: always capture so the page
  // never pans sideways, even on the small momentum deltas a trackpad emits
  e.preventDefault();
  showArrows();
  // threshold + throttle only gate whether we actually advance a slide
  if (Math.abs(e.deltaX) < 10 || e.timeStamp - lastWheel < 220) return;
  lastWheel = e.timeStamp;
  if (e.deltaX > 0) carousel.value?.next();
  else carousel.value?.prev();
}

const config = computed(() => {
  const wrap = props.loop && !props.skeleton;
  return {
    itemsToShow: "auto" as const,
    gap: 16,
    snapAlign: "start" as const,
    wrapAround: wrap,
    // the library ignores (and warns about) preventExcessiveDragging when
    // wrapAround is on, so only set it on the non-looping carousel
    ...(wrap ? {} : { preventExcessiveDragging: true }),
    ...(props.autoplay && !props.skeleton
      ? { autoplay: props.autoplay, pauseAutoplayOnHover: true }
      : {})
  };
});
</script>

<style scoped lang="scss">
// full-bleed wrapper — break out of the page container to span the viewport.
// --h-gutter (the first card's inset from the viewport edge) mirrors
// .h-container's content inset and is declared HERE, on the component root,
// so a page with a different content column can re-declare it with a plain
// `.page :deep(.h-peek) { --h-gutter: ...; }` — that (0,3,0) rule outweighs
// these (0,2,0) defaults at every width. Don't move it onto an inner
// element: an element-own declaration would shadow any consumer override.
.h-peek {
  width: 100vw;
  margin-left: calc(50% - 50vw);

  --h-gutter: 24px;

  @media (min-width: 600px) {
    --h-gutter: 32px;
  }

  @media (min-width: 1440px) {
    --h-gutter: calc((100vw - 1440px) / 2 + 40px);
  }
}

// contained — stay within the parent's width, no break-out (opt-in), and no
// gutter: the first card aligns to the parent's left edge, not the page
// content inset (same specificity as the defaults above; later wins the tie)
.h-peek--contained {
  width: 100%;
  margin-left: 0;

  --h-gutter: 0;
}

.h-peek__carousel {
  --vc-nav-background: color-mix(
    in srgb,
    var(--color-bg-card) 25%,
    transparent
  );
  --vc-nav-color: var(--color-text-primary);
  --vc-nav-color-hover: var(--color-text-link);
  --vc-nav-border-radius: var(--radius-full);
  --vc-nav-width: 40px;
  --vc-nav-height: 40px;
  // vertical always scrolls the page (both wheel and swipe); only horizontal
  // moves the carousel. pan-y lets the browser keep vertical scrolling, the
  // library handles horizontal drag, and the custom wheel handler routes only
  // horizontal-intent wheel/trackpad gestures to the carousel.
  touch-action: pan-y;
}

// the first card starts at the page content edge: a margin on the TRACK shifts
// the whole row right by the gutter. The library computes its snap transform
// from slide offsets (relative to the track) + applies it on top of this
// margin, so the margin is a free visual shift it never miscounts — full-bleed
// AND content-aligned without the jumpiness the viewport-padding trick caused.
.h-peek__carousel :deep(.carousel__track) {
  margin-left: var(--h-gutter);
}

// arrows near the viewport edges, translucent glassy fill over the cards
.h-peek__carousel :deep(.carousel__prev),
.h-peek__carousel :deep(.carousel__next) {
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: opacity 220ms ease;
}

// at an end there's nothing to go to, so the arrow fades out entirely and
// fades back in when it's usable. !important is load-bearing: the button
// carries the `disabled` attribute, and Quasar's global
// `[disabled] { opacity: .6 !important }` would otherwise win over any
// specificity we stack up — leaving a ghost arrow floating at the edge.
.h-peek__carousel :deep(.carousel__prev--disabled),
.h-peek__carousel :deep(.carousel__next--disabled) {
  opacity: 0 !important;
  pointer-events: none;
}

// idle: no hover/focus/interaction for a while — the arrows retire until
// the next pointer, touch, wheel, or focus wakes them
.h-peek--idle :deep(.carousel__prev),
.h-peek--idle :deep(.carousel__next) {
  opacity: 0;
  pointer-events: none;
}

.h-peek__carousel :deep(.carousel__prev) {
  left: var(--space-sm);
}

.h-peek__carousel :deep(.carousel__next) {
  right: var(--space-sm);
}

.h-peek__carousel :deep(.carousel__slide) {
  align-items: stretch;
  padding: var(--space-xs) 0;
}

// End position = start position. vue3-carousel "removes whitespace" in
// auto + no-wrap mode (it stops once the last card is flush-right), so the
// last card can't travel to where the first one started. Transparent trailing
// space on the last slide (≈ a viewport minus one card) extends the scroll
// range so the last card slides all the way back to the start, with the empty
// space bleeding off the right. Only for the bounded (non-looping) carousel —
// a wrapping one clones slides, so :last-child would be a clone.
.h-peek__carousel--bounded :deep(.carousel__slide:last-child) {
  padding-right: calc(100vw - var(--peek-item) + var(--space-sm));
}

// contained: the last card rests flush-right at the parent's edge (standard),
// so it needs no viewport-sized trailing space
.h-peek--contained
  .h-peek__carousel--bounded
  :deep(.carousel__slide:last-child) {
  padding-right: 0;
}

// ── skeleton / loading state ──
// structured default matches a media + two-line card; pass skeletonHeight for
// a plain fixed-height block instead (e.g. to match a different card shape)
.h-peek__skel,
.h-peek__skel-block {
  width: 100%;
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.h-peek__skel-media {
  aspect-ratio: 4 / 3;
}

.h-peek__skel-text {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md) var(--space-md);
}

.h-peek__skel-line {
  height: 14px;
  border-radius: var(--radius-xs);
}

.h-peek__skel-line--short {
  width: 60%;
}

// shimmer
.h-peek__skel-media,
.h-peek__skel-line,
.h-peek__skel-block {
  background-image: linear-gradient(
    90deg,
    var(--color-bg-page-alt) 25%,
    var(--color-stroke-subtle) 37%,
    var(--color-bg-page-alt) 63%
  );
  background-size: 220% 100%;
  animation: h-peek-shimmer 1.4s ease infinite;
}

@keyframes h-peek-shimmer {
  from {
    background-position: 220% 0;
  }

  to {
    background-position: -220% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .h-peek__skel-media,
  .h-peek__skel-line,
  .h-peek__skel-block {
    animation: none;
  }
}
</style>
