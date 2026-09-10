<template>
  <figure class="heat">
    <figcaption class="heat__head">
      <span class="text-body-sm heat__title">{{ title }}</span>
      <!-- the readout replaces the summary on hover rather than sitting
           beside it: two live numbers in one row read as a comparison -->
      <span class="text-body-sm heat__readout" aria-hidden="true">
        {{ hovered === null ? summary : readout }}
      </span>
    </figcaption>

    <svg
      class="heat__plot"
      :viewBox="`0 0 ${bins.length} ${PLOT_HEIGHT}`"
      preserveAspectRatio="none"
      role="img"
      :aria-label="spokenLabel"
      @pointermove="onPointerMove"
      @pointerleave="hovered = null"
    >
      <!-- the resting track: without it a quiet stretch is indistinguishable
           from the strip simply ending -->
      <rect
        class="heat__ground"
        x="0"
        :y="PLOT_HEIGHT - 1"
        :width="bins.length"
        height="1"
      />
      <rect
        v-for="bar in bars"
        :key="bar.index"
        class="heat__bar"
        :class="{ 'heat__bar--hovered': bar.index === hovered }"
        :x="bar.index"
        :y="PLOT_HEIGHT - bar.height"
        width="1"
        :height="bar.height"
        :fill-opacity="bar.opacity"
      />
    </svg>

    <div class="text-caption heat__axis" aria-hidden="true">
      <span v-for="tick in ticks" :key="tick.at" :style="tick.style">
        {{ tick.label }}
      </span>
    </div>
  </figure>
</template>

<script setup lang="ts">
// The activity strip for one script: 120 bins of strokes-per-minute drawn
// against the video's own clock.
//
// It is a real timeline, not an ordering — `segment_distances` decodes to
// exactly one entry per second (see services/script-heat.ts) — so it earns a
// time axis and a per-position readout. What it must NOT be read as: it says
// nothing about stroke POSITION or depth (only how much travel happened),
// nothing sub-second, and it describes one script, so a video carrying
// several needs its scripter named beside it.
//
// Inline SVG rather than canvas: the app has a live theme toggle, and SVG
// re-themes for free from the CSS custom properties below. 120 rects is
// nothing to lay out.
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { heatIntensity } from "@/services/script-heat";

const props = defineProps<{
  /** per-bin strokes per minute; 0 marks a resting bin */
  bins: number[];
  /** the clock the bins span, in seconds */
  totalSeconds: number;
  title: string;
  /** the standing line under the title — the speed/quiet summary */
  summary: string;
  /** spoken description. Not named `ariaLabel`: that binds as the native
   * attribute in kebab-case and never reaches the prop. The numbers also
   * live in the details card, so the strip is never the only place a figure
   * appears. */
  spokenLabel: string;
}>();

const { n, t } = useI18n();

/** viewBox height. Bars are drawn in these units and stretched by
 * preserveAspectRatio, so it only sets the height/width precision ratio. */
const PLOT_HEIGHT = 100;

/** Tint at the floor of the ramp. Height already separates a slow bar from a
 * fast one; the tint is the redundant second channel, so its dimmest step
 * still has to survive on a dark surface. */
const MIN_OPACITY = 0.25;

const hovered = ref<number | null>(null);

const bars = computed(() =>
  props.bins
    .map((strokes, index) => {
      const intensity = heatIntensity(strokes);
      return {
        index,
        height: intensity * PLOT_HEIGHT,
        opacity: MIN_OPACITY + (1 - MIN_OPACITY) * intensity
      };
    })
    // a resting bin draws nothing at all — the ground track is what shows
    .filter(bar => bar.height > 0)
);

function onPointerMove(event: PointerEvent) {
  const box = (event.currentTarget as SVGElement).getBoundingClientRect();
  if (!box.width) return;
  const share = (event.clientX - box.left) / box.width;
  const index = Math.floor(share * props.bins.length);
  hovered.value = Math.min(props.bins.length - 1, Math.max(0, index));
}

/** Clock position of a bin's start. */
function secondsAt(index: number): number {
  return Math.floor((index * props.totalSeconds) / props.bins.length);
}

/** m:ss, or h:mm:ss past the hour. Digits and colons only — every locale
 * writes a running time this way, so this is arithmetic rather than copy. */
function clock(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const pad = (value: number) => String(value).padStart(2, "0");
  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(secs)}`
    : `${minutes}:${pad(secs)}`;
}

const readout = computed(() => {
  const index = hovered.value;
  if (index === null) return "";
  const strokes = props.bins[index] ?? 0;
  const at = clock(secondsAt(index));
  return strokes > 0
    ? t("video.heat.readout", { at, spm: n(Math.round(strokes)) })
    : t("video.heat.readoutRest", { at });
});

/** Five evenly spaced marks. Positioned by percentage and nudged at the ends
 * so the first and last labels sit inside the plot instead of overhanging it. */
const ticks = computed(() => {
  const marks = [0, 0.25, 0.5, 0.75, 1];
  return marks.map(share => ({
    at: share,
    label: clock(share * props.totalSeconds),
    style: {
      left: `${share * 100}%`,
      transform:
        share === 0
          ? "none"
          : share === 1
            ? "translateX(-100%)"
            : "translateX(-50%)"
    }
  }));
});
</script>

<style scoped lang="scss">
.heat {
  margin: 0;
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
}

.heat__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-sm);
  margin-bottom: var(--space-xs);
}

.heat__title {
  color: var(--color-text-secondary);
}

// tabular so the hover readout doesn't reflow the row as digits change
.heat__readout {
  color: var(--color-text-primary);
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.heat__plot {
  display: block;
  width: 100%;
  height: 88px;
  // the bars are 1 user-unit wide and stretched; without this the browser
  // antialiases a hairline gap between neighbours at most widths
  shape-rendering: crispEdges;
  touch-action: pan-y;
}

.heat__ground {
  fill: var(--heat-ground);
}

.heat__bar {
  fill: var(--heat-ink);
}

.heat__bar--hovered {
  fill: var(--heat-ink-strong);
  fill-opacity: 1 !important;
}

.heat__axis {
  position: relative;
  height: 1.25em;
  margin-top: 6px;
  color: var(--color-text-tertiary);
  font-variant-numeric: tabular-nums;

  span {
    position: absolute;
    top: 0;
  }
}

// High-contrast mode throws the custom properties away; keep the bars as
// shapes rather than letting them vanish into the background.
@media (forced-colors: active) {
  .heat__bar {
    fill: CanvasText;
    fill-opacity: 1 !important;
  }

  .heat__ground {
    fill: GrayText;
  }
}
</style>
