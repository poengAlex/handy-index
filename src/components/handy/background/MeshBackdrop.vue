<template>
  <div
    :class="['backdrop', `backdrop--${attach}`]"
    :style="rootStyle"
    aria-hidden="true"
  >
    <div class="backdrop__travel" :style="travelStyle">
      <slot />
    </div>

    <!-- Overlays that belong to the lens rather than to the field: they sit
         above the gradient but still inside the backdrop, so page content
         (z-index 1) stays on top of them. Outside .backdrop__travel on
         purpose — the sensor does not parallax with the scene. -->
    <slot name="overlay" />
  </div>
</template>

<script setup lang="ts">
// A mesh field attached to a whole PAGE rather than to a box.
//
// Four attachments, but only one mechanism: a viewport-sized window with a
// taller canvas inside it that travels as you scroll. The rate is the whole
// difference.
//
//   pinned    rate 0    — the field never moves. Calm, and after two screens
//                         of scrolling the page stops feeling like it is
//                         going anywhere. Measured: pixel-identical at 0%,
//                         45% and 100% of a three-screen page.
//   parallax  rate 0.5  — moves, but slower than the content. Keeps the
//                         colour vivid (the canvas is viewport-sized, so the
//                         blobs are never stretched) while the page still
//                         travels. The sweet spot.
//   travels   rate 1.4  — near-scroll-rate. The field is scenery you move
//                         past; the top and the bottom of the page are
//                         different places.
//   banded    n/a       — not pinned at all: anchored to the top of the
//                         document and masked so it lets go. Colour where
//                         the page starts, plain surface where the content
//                         gets dense.
//
// WHAT AN ATTACHMENT COSTS. Measured 2026-08-26, motion held at `still` to
// isolate the attachment, six seconds of continuous scrolling at 4x CPU
// throttle with GPU rasterisation off (i.e. imitating the software-raster
// path — see the note in LensField.vue about why that is the case worth
// measuring):
//
//   attach     blobs  canvas    fps    raster over 6s
//   pinned       15    800px   76-78     7-8 ms
//   parallax     30   1200px   74-76   465-483 ms
//   travels      45   1920px   75-76   978-989 ms
//
// Frame rate is the same for all three, and none of them is remotely near the
// cost of an ill-chosen MOTION (morph, uncapped, burned 29,665ms in eight
// seconds on the same rig). So attachment is not where a performance problem
// comes from.
//
// What cost there is does NOT come from the scroll animation — that is a
// transform on a cached layer, the cheapest thing a compositor does. It comes
// from the field being BIGGER: canvasRatio is 1 + rate, LensField lays down
// `ceil(ratio)` bands of the layout, so parallax draws twice the blobs of
// pinned on a canvas 1.5x viewport height and travels three times on 2.4x.
// More blurred area means more tiles to rasterise as they scroll into view.
// If this ever needs trimming, the lever is the band count, not the travel.
//
// The travel is a CSS scroll-driven animation, so there is no scroll
// listener and nothing to throttle — and it inherits the global
// reduced-motion rule for free. Where the browser lacks scroll timelines the
// canvas simply does not move, which is `pinned`: the page is still correct,
// just calmer. That is the right failure.
import { computed } from "vue";
import type {
  Blob,
  FieldId,
  GradientColor,
  PaletteId
} from "./gradient-recipes";

export type Attach = "pinned" | "parallax" | "travels" | "banded";

const props = withDefaults(
  defineProps<{
    attach?: Attach;
    /** How far the canvas travels, as a multiple of the viewport. Overrides
     *  the attachment's own rate when set. */
    rate?: number | undefined;
    /** `banded` only: how far down the page the band reaches, in vh. */
    band?: number;
    /** `banded` only: the fraction of the band held at full strength before
     *  the mask starts letting go. */
    hold?: number;
  }>(),
  {
    attach: "parallax",
    band: 160,
    hold: 0.42
  }
);

const RATES: Record<Attach, number> = {
  pinned: 0,
  parallax: 0.5,
  travels: 1.4,
  banded: 0
};

const rate = computed(() => props.rate ?? RATES[props.attach]);

const rootStyle = computed(() => {
  if (props.attach !== "banded") return {};
  // the mask is what makes a band a band: full strength through `hold`,
  // then a long release rather than a line
  const mask = `linear-gradient(to bottom, #000 0, #000 ${Math.round(
    props.hold * 100
  )}%, transparent 100%)`;
  return {
    height: `${props.band}vh`,
    maskImage: mask,
    WebkitMaskImage: mask
  };
});

// The canvas is (1 + rate) viewports tall and slides by exactly the extra
// height, so its bottom edge arrives as the page's bottom edge does — no
// gap at either end, whatever the document height turns out to be.
const travelStyle = computed(() => {
  const r = rate.value;
  if (r <= 0) return {};
  return {
    height: `${(1 + r) * 100}%`,
    "--travel": `-${(r / (1 + r)) * 100}%`
  };
});
</script>

<style scoped lang="scss">
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  // The blur radius is a share of the container's short side, so the
  // container has to be the VIEWPORT — not the travel canvas, which is 150%
  // of viewport height for parallax and 240% for travels. Left alone,
  // switching attachment silently softened the field and the number in the
  // settings panel stopped describing what was on screen.
  container-type: size;
  // the field inside is absolutely positioned against this box, and the
  // cqmin blur radius resolves against the VIEWPORT here — which is what a
  // page background wants. Sizing it to the document instead would make the
  // blur grow with page length.
  overflow: hidden;
}

// A band belongs to the document, not the viewport: it has to scroll away.
// (Proved the hard way — masking a pinned layer fades the bottom of the
// SCREEN, which follows you down the page and is not a band at all.)
.backdrop--banded {
  position: absolute;
  inset: 0 0 auto;
}

.backdrop__travel {
  position: absolute;
  inset: 0;
}

// hand the size query back to .backdrop above
.backdrop :deep(.mesh),
.backdrop :deep(.lens) {
  container-type: normal;
}

// Progressive enhancement: no scroll timeline, no travel — the field is
// simply pinned, which is a design we ship anyway.
@supports (animation-timeline: scroll()) {
  .backdrop--parallax .backdrop__travel,
  .backdrop--travels .backdrop__travel {
    animation: backdrop-travel linear both;
    animation-timeline: scroll(root block);
    // the one place on this page where a transform genuinely animates
    will-change: transform;
  }

  // A scroll-driven animation has no duration for the global reduced-motion
  // rule to shorten — its timeline is the scrollbar. It has to be switched
  // off by name, or "reduce motion" still gets a sliding background.
  @media (prefers-reduced-motion: reduce) {
    .backdrop--parallax .backdrop__travel,
    .backdrop--travels .backdrop__travel {
      animation: none;
    }
  }
}

@keyframes backdrop-travel {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(var(--travel, 0));
  }
}
</style>
