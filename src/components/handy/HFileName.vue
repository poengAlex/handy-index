<template>
  <span
    ref="rootEl"
    class="h-file-name"
    @mouseenter="showFull"
    @mouseleave="full = false"
  >
    <!-- read aloud whole; the copy beside it is for the eye only -->
    <span class="h-file-name__whole">{{ name }}</span>
    <!-- written by fit(), never by the template -->
    <span ref="shownEl" aria-hidden="true" />
    <q-tooltip v-model="full" no-parent-event>{{ name }}</q-tooltip>
  </span>
</template>

<script setup lang="ts">
// A file name on one line, cut in the middle when it doesn't fit (design.md
// 6.7): the start gives way, and the end (the extension and the last few
// characters before it, where similar files differ) always shows. The full
// name is a tooltip, offered only while the name is cut, and what a screen
// reader reads, from a visually hidden copy.
//
// Measured, not left to CSS. Middle truncation in CSS needs the name in two
// boxes, and an ellipsis stops at the last whole character and leaves the
// rest of its box blank, which reads as a space before the end. fit() writes
// exactly the characters that fit, so the leftover lands after the name.
// A plain end ellipsis stays as the fallback, for a box too narrow even for
// the end.
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch
} from "vue";
import { splitFileName } from "./files";

const props = withDefaults(
  defineProps<{
    name: string;
    /** Characters kept before the extension. */
    keep?: number;
  }>(),
  { keep: 6 }
);

const parts = computed(() => splitFileName(props.name, props.keep));
const rootEl = ref<HTMLElement | null>(null);
const shownEl = ref<HTMLElement | null>(null);
const full = ref(false);
let cut = false;

function showFull(): void {
  full.value = cut;
}

let measureCanvas: HTMLCanvasElement | undefined;

/** Text widths in the name's own font, letter spacing included. */
function measurer(el: HTMLElement): (text: string) => number {
  measureCanvas ??= document.createElement("canvas");
  const ctx = measureCanvas.getContext("2d");
  if (!ctx) return () => 0;
  const style = getComputedStyle(el);
  ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  if ("letterSpacing" in ctx) {
    ctx.letterSpacing =
      style.letterSpacing === "normal" ? "0px" : style.letterSpacing;
  }
  return text => ctx.measureText(text).width;
}

function fit(): void {
  const root = rootEl.value;
  const shown = shownEl.value;
  if (!root || !shown) return;
  // the whole name first: the room it is squeezed into is the room it has
  shown.textContent = props.name;
  cut = root.scrollWidth > root.clientWidth;
  if (!cut) return;
  // the content box: clientWidth counts the padding too
  const box = getComputedStyle(root);
  const room =
    root.clientWidth -
    parseFloat(box.paddingLeft) -
    parseFloat(box.paddingRight) -
    0.5;
  const width = measurer(shown);
  const [head, end] = parts.value;
  // not even the end fits: leave the whole name to the CSS ellipsis
  if (width(`…${end}`) > room) return;
  // the longest start of the name that fits beside "…" and the end
  let lo = 0;
  let hi = head.length - 1;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (width(`${head.slice(0, mid)}…${end}`) <= room) lo = mid;
    else hi = mid - 1;
  }
  shown.textContent = `${head.slice(0, lo)}…${end}`;
}

// The parent, not the name: the name's own width follows what fit() wrote,
// so watching it would never see more room arrive.
let observer: ResizeObserver | undefined;

onMounted(() => {
  fit();
  const parent = rootEl.value?.parentElement;
  if (parent && typeof ResizeObserver !== "undefined") {
    observer = new ResizeObserver(() => fit());
    observer.observe(parent);
  }
  // a web font arriving later changes every width without resizing anything
  void document.fonts?.ready.then(fit);
});

watch(parts, () => void nextTick(fit));

onBeforeUnmount(() => observer?.disconnect());
</script>

<style scoped lang="scss">
.h-file-name {
  position: relative;
  display: block;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

// out of sight and out of a copied selection, not out of the accessibility
// tree
.h-file-name__whole {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  user-select: none;
}
</style>
