<template>
  <canvas
    v-show="amount > 0"
    ref="el"
    class="grain"
    :class="{ 'grain--fixed': fixed }"
    :style="{ opacity: String(amount), mixBlendMode: blend }"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
// Grain, painted into a real canvas element.
//
// Two earlier attempts failed, and both failures are worth keeping written
// down because both are the obvious approach.
//
// It began inside the field, which is where it seems to belong, and it was
// measured at 0.35 against the ~5 the source exports carry — attributed at
// the time to a sibling with a large blur forcing the whole stacking context
// to rasterise at reduced resolution.
//
// That no longer reproduces. Re-measured 2026-08-24 on the live component,
// the canvas moved inside .lens as a sibling of the blurred subtree keeps
// 90% of its energy at the 96px cap (1.351 against 1.503 outside). Either
// the browser changed or the original diagnosis was wrong. What IS still
// true, and measured twice, is the ANCESTOR case: a grain child inside
// .lens__inner, under the filter itself, retains 0.6% — and the clamp has a
// 12px floor, so there is no defocus setting that escapes it.
//
// `lensScope: "blobs"` relies on the corrected version: it puts this canvas
// inside .lens, in a mirror of the field's wrapper chain that carries the
// same motion animation but none of its filter.
//
// Lifting it to its own layer as a `background-image: url(data:image/png…)`
// did not fix it either — the overlay was provably there, fixed, at 0.85
// opacity, normal blend, with a valid PNG, and still painted nothing
// measurable.
//
// A canvas element paints its own bitmap. There is no data-URL decode, no
// background resampling and no interaction with a neighbouring filter, so
// what is generated is what appears. It is also the version that lets the
// tile be regenerated on resize instead of being tiled at a fixed size.
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { grainTile, noiseTile, type GrainBlend } from "./lens";

const props = withDefaults(
  defineProps<{
    /** Layer opacity, 0-1. ~0.55 lands on the source exports' grain level. */
    amount: number;
    /** Grain cluster size in px. 1 = sensor noise, 5 = coarse film. */
    size?: number;
    /** Octaves summed. */
    rough?: number;
    blend?: GrainBlend;
    fixed?: boolean;
  }>(),
  { size: 1.3, rough: 4, blend: "normal", fixed: false }
);

const el = ref<HTMLCanvasElement | null>(null);
let frame = 0;

function paint() {
  const canvas = el.value;
  if (!canvas || props.amount <= 0) return;
  const rect = canvas.getBoundingClientRect();
  const w = Math.max(1, Math.round(rect.width));
  const h = Math.max(1, Math.round(rect.height));
  // 1:1 device pixels — grain that gets scaled is no longer grain
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const tile = noiseTile(props.size, props.rough);
  if (!tile) return;
  const pattern = ctx.createPattern(tile, "repeat");
  if (!pattern) return;
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function schedule() {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(paint);
}

onMounted(() => {
  schedule();
  window.addEventListener("resize", schedule);
});
onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  window.removeEventListener("resize", schedule);
});

watch(
  () => [props.size, props.rough, props.amount, grainTile(props.size)],
  schedule
);
</script>

<style scoped lang="scss">
// No z-index. Grain belongs to the FIELD, not to the page: it goes above
// the gradient and below everything the reader is meant to read. It sits
// after the field in the DOM, so paint order alone puts it on top of the
// gradient, and any content carrying z-index: 1 stays on top of it.
//
// It was briefly z-index: 20 over the whole page on the theory that film
// grain covers the whole frame. That is true of film and wrong of a user
// interface — it speckles body copy and puts visible noise across a solid
// CTA.
.grain {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

// Fills the viewport rather than its parent, for a field that is itself
// viewport-fixed. Still no z-index — its parent decides the layer.
.grain--fixed {
  position: fixed;
}
</style>
