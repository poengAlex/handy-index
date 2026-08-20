<template>
  <q-scroll-area
    :style="{ height }"
    :thumb-style="H_SCROLL_THUMB_STYLE"
    :bar-style="H_SCROLL_BAR_STYLE"
  >
    <div ref="contentEl" class="modal-scroll"><slot /></div>
  </q-scroll-area>
</template>

<script setup lang="ts">
// Scrolling body for a modal that outgrew the viewport. q-dialog does scroll
// a tall HModal on its own, but with a native bar cutting through the card's
// 20px radius — and it scrolls the whole card, so the title and the actions
// leave with it. This keeps those pinned and gives the body the kit's slim
// thumb instead [DESIGN.md 5.6].
//
// q-scroll-area can't size itself to its content (its content is absolutely
// positioned), so the height has to be a real length: the content is
// measured and the viewport takes the smaller of that and what the dialog
// can show. A body that fits is therefore never scrolled — no thumb, no
// empty space under the last row.
import { computed, onMounted, onUnmounted, ref } from "vue";
import {
  H_SCROLL_BAR_STYLE,
  H_SCROLL_THUMB_STYLE
} from "@/components/handy/scroll";

const props = withDefaults(
  defineProps<{
    /** CSS length the body may not exceed. The default is what q-dialog's
     * own max-height leaves once the card's padding, title and actions are
     * taken out — overshoot it and the native bar comes back on top. */
    max?: string;
  }>(),
  { max: "max(200px, calc(100vh - 280px))" }
);

const contentEl = ref<HTMLElement | null>(null);
const contentHeight = ref(0);
let resizeObserver: ResizeObserver | undefined;

function measure() {
  contentHeight.value = contentEl.value?.offsetHeight ?? 0;
}

// rows appear and disappear inside these bodies (chips, a picked site, the
// muted caption), so the height can't be measured once and trusted
onMounted(() => {
  if (!contentEl.value) return;
  resizeObserver = new ResizeObserver(measure);
  resizeObserver.observe(contentEl.value);
  // synchronously, so the first paint is already at the right height
  measure();
});

onUnmounted(() => resizeObserver?.disconnect());

const height = computed(() =>
  contentHeight.value
    ? `min(${contentHeight.value}px, ${props.max})`
    : props.max
);
</script>

<style scoped lang="scss">
// clears the inset thumb so the rightmost pixels of a card never sit under it
.modal-scroll {
  padding-right: var(--space-xs);
}
</style>
