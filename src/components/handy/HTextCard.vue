<template>
  <div class="h-text-card">
    <!-- pinned over the corner — the title and copy scroll underneath it;
         the card-colored fill keeps it readable while text passes under.
         Only rendered when the text actually overflows the given height -->
    <q-btn
      v-if="expandable && overflowing"
      flat
      round
      dense
      icon="open_in_full"
      :class="[
        'h-text-card__expand',
        { 'h-text-card__expand--faded': scrolled }
      ]"
      :aria-label="expandLabel"
      @click="expanded = true"
    >
      <q-tooltip>{{ expandLabel }}</q-tooltip>
    </q-btn>

    <!-- fixed height: q-scroll-area keeps the scrollbar inside the card's
         radius (native overflow would run under the rounded corners) -->
    <q-scroll-area
      v-if="height"
      ref="scrollRef"
      :style="{ height }"
      :thumb-style="H_SCROLL_THUMB_STYLE"
      :bar-style="H_SCROLL_BAR_STYLE"
      @scroll="onScroll"
    >
      <div ref="contentEl" class="h-text-card__content text-body">
        <div v-if="title" class="text-h5 h-text-card__title">{{ title }}</div>
        <slot />
      </div>
    </q-scroll-area>
    <div v-else class="h-text-card__content text-body">
      <div v-if="title" class="text-h5 h-text-card__title">{{ title }}</div>
      <slot />
    </div>

    <!-- no scroll logic here on purpose: q-dialog scrolls tall content
         itself (its inner container is a scroll area) -->
    <q-dialog v-model="expanded">
      <HModal :title="title" closable :close-label="closeLabel">
        <div class="h-text-card__content text-body"><slot /></div>
      </HModal>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
// Text card — a card-rules surface for long-form copy (terms, release
// notes, lesson text). Give it a `height` and the text scrolls inside the
// card via q-scroll-area, so the themed scrollbar lives within the 20px
// radius instead of a native bar punching through the corner; omit
// `height` and the card grows naturally. The scroll/expand affordances are
// automatic: when the text fits the height there's nothing to expand, so
// the top-right button only appears on overflow (a ResizeObserver keeps
// that honest when the height or the content changes). Expanding opens the
// full text in an HModal; q-dialog scrolls tall content natively.
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import type { QScrollArea } from "quasar";
import HModal from "@/components/handy/HModal.vue";
import {
  H_SCROLL_BAR_STYLE,
  H_SCROLL_THUMB_STYLE
} from "@/components/handy/scroll";

const props = withDefaults(
  defineProps<{
    title?: string;
    /** CSS length, e.g. "220px" — omit for natural (unscrolled) height */
    height?: string;
    expandable?: boolean;
    /** Name of the expand action — screen reader and tooltip alike. */
    expandLabel?: string;
    /** Forwarded to the expanded view's HModal. */
    closeLabel?: string;
  }>(),
  {
    title: "",
    height: "",
    expandable: true,
    expandLabel: "Read the full text",
    closeLabel: "Close"
  }
);

const expanded = ref(false);

// once the reader is into the text, the expand action steps back — it
// fades while scrolled and comes back at the top (or on hover/focus)
const scrolled = ref(false);

function onScroll(info: { verticalPosition: number }) {
  scrolled.value = info.verticalPosition > 0;
}

// overflow detection — the expand button exists only when there's more
// text than the height shows
const scrollRef = ref<QScrollArea | null>(null);
const contentEl = ref<HTMLElement | null>(null);
const overflowing = ref(false);
let resizeObserver: ResizeObserver | undefined;

function measure() {
  const viewport = scrollRef.value?.$el as HTMLElement | undefined;
  overflowing.value =
    !!viewport &&
    !!contentEl.value &&
    contentEl.value.offsetHeight > viewport.clientHeight + 1;
}

function observe() {
  resizeObserver?.disconnect();
  const viewport = scrollRef.value?.$el as HTMLElement | undefined;
  if (!viewport || !contentEl.value) {
    overflowing.value = false;
    return;
  }
  resizeObserver = new ResizeObserver(measure);
  resizeObserver.observe(viewport);
  resizeObserver.observe(contentEl.value);
  measure();
}

onMounted(observe);
// height can appear, change, or go away at runtime — re-wire the observer
watch(
  () => props.height,
  () => nextTick(observe)
);
onUnmounted(() => resizeObserver?.disconnect());
</script>

<style scoped lang="scss">
.h-text-card {
  position: relative;
  width: 100%;
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
}

// title follows the card rule — h5, 16px beneath — but scrolls away with
// the copy; padded on the right so the pinned expand never covers it
.h-text-card__title {
  color: var(--color-text-primary);
  margin: 0 0 var(--space-sm);
  padding-right: 40px;
}

// stays on top while everything scrolls beneath it; transparent so the
// scrollbar thumb at the card's edge stays visible behind it
.h-text-card__expand {
  position: absolute;
  top: var(--space-sm);
  right: var(--space-sm);
  z-index: 1;
  color: var(--color-text-secondary);
  transition: opacity 180ms ease;
}

// hover/focus restore it — faded is a de-emphasis, not a disable
.h-text-card__expand--faded:not(:hover, :focus-visible) {
  opacity: 0.35;
}

.h-text-card__content {
  color: var(--color-text-secondary);
  // clear the inset thumb so the last characters never sit under it
  padding-right: var(--space-sm);

  :deep(p) {
    margin: 0 0 var(--space-sm);
  }

  :deep(p:last-child) {
    margin-bottom: 0;
  }
}
</style>
