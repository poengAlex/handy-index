<template>
  <div ref="wrapEl" class="h-graph" :style="{ height: `${height}px` }">
    <UplotVue
      :options="options"
      :data="initialData"
      :reset-scales="false"
      @create="onCreate"
      @delete="onDelete"
    />
    <div
      v-if="readout"
      class="h-graph__readout"
      :class="{ 'h-graph__readout--left': readout.flip }"
      aria-hidden="true"
    >
      <span
        class="h-graph__readout-dot"
        :style="{ background: readout.color }"
      />
      <span v-if="readout.label" class="h-graph__readout-label">{{
        readout.label
      }}</span>
      <span class="h-graph__readout-value">{{ readout.x }}</span>
      <span class="h-graph__readout-value">{{ readout.y }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// The one Handy graph: uPlot (via the uplot-vue wrapper) rendering one or more
// point series, either over a playhead-centered time window (funscripts — pass
// current-time and view-span) or over a static extent (any 2D curve — pass
// neither). The chart is also an input device: drag scrubs, the wheel (or a
// trackpad pinch) zooms X about the cursor, Shift+wheel both axes, Alt+wheel
// y alone (as does the wheel over the y gutter) — middle-drag (or shift-drag)
// marks an x range to zoom,
// Alt-drag (or Ctrl-drag, where the browser allows it) marks a y range,
// double-click asks for the home view, the y-axis gutter is a control strip
// of its own (drag pans a zoomed y window, the wheel zooms y alone, a click
// asks for a y fit), and on a PINNED window a plain drag pans it sideways
// into, click selects the nearest point, hover reads values out. Turn on
// `editable` and it becomes a shape editor too — drag a point to move it,
// click empty space to add one, Alt+click to remove one.
//
// The wheel is only claimed when the page is wired to apply the zoom it
// produces (`zoom` in playback mode, `zoom-range` in static mode). The chart
// is wide and lives in a scrolling grid, so over any graph that can't zoom,
// the wheel stays what it is everywhere else on the page — scroll.
//
// Series colours come from the design.md §7.3 chart ramp — hero Brand Blue,
// then Dark Charcoal → Slate Gray → Divider Gray (white-opacity ladder on
// dark). That ramp is an emphasis ladder, not a set of equal hues: the quiet
// steps are hard to tell apart on their own, so any multi-series chart needs a
// legend or direct labels beside it. The component ships none — per §5.6
// components emit and pages decide, and the page owns that legend.
//
// Editing follows the same rule: every gesture is reported, none is applied.
// The component never touches a points array — it emits point-add /
// point-drag / point-drag-end / point-delete and the page writes the model,
// which is what lets the page own undo, validation and minimum-point rules.
//
// Perf model: the parent markRaws its point arrays and bumps `revision` after
// mutating them in place. Every visual update funnels into one rAF-batched
// pass that slices the visible window (binary search), decimates to ~2 points
// per pixel column, and hands uPlot a tiny array — so scrubbing and editing
// cost is independent of script length.
//
// Build requirements (both fail silently or cryptically): the Options API
// flag and a Vite alias resolving the bare "uplot" specifier to
// uplot/dist/uPlot.cjs.js. handyViteConfig (vite.ts) sets both; README.md §1
// "Build flags" has the details.
import {
  computed,
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch
} from "vue";
import uPlot from "uplot";
import UplotVue from "uplot-vue";
import "uplot/dist/uPlot.min.css";
import { decimateMinMax } from "./graph-decimate";
import {
  clampDragX,
  clampToDomain,
  indexAtOrBefore,
  snapTo
} from "./graph-edit";
import { resolveGraphTheme, watchGraphTheme } from "./graph-theme";
import type {
  GraphMarker,
  GraphPoint,
  GraphRegion,
  GraphSeries,
  GraphTheme,
  PointEdit,
  SelectedPointRef
} from "./graph-types";

const props = withDefaults(
  defineProps<{
    series: GraphSeries[];
    /** Bump after mutating any series' points in place. */
    revision?: number;

    // Playback mode — provide BOTH; the window centers on the playhead.
    /** Playhead position (ms). */
    currentTime?: number;
    /** Visible window width (ms). */
    viewSpan?: number;
    minSpan?: number;
    maxSpan?: number;

    // Static mode — no viewSpan; the window holds still. A current-time on its
    // own still draws a playhead, it just doesn't drag the window along.
    /** Pins the static window. Defaults to the full data extent. */
    xDomain?: [number, number];

    /** Value range of the y axis. */
    yDomain?: [number, number];
    /** Gridline values; defaults to four even divisions of yDomain. */
    ySplits?: number[];
    /** Where wheel zoom-OUT on the y axis converges — the widest y window
     * the wheel will report. Defaults to the y extent of the visible data;
     * pass the resting frame instead when zooming out should land there. */
    yZoomExtent?: [number, number];
    /** x tick format: "time" = m:ss / h:mm:ss, "ms" = raw milliseconds
     * (same increments, digits instead of a clock), "value" = plain numbers. */
    xMode?: "time" | "ms" | "value";
    formatX?: (value: number) => string;
    formatY?: (value: number) => string;
    /** Y-axis gutter in px — widen it for long labels. */
    yAxisSize?: number;
    /** Drop both axes and their gridlines — for strips too short to label. */
    showAxes?: boolean;

    regions?: GraphRegion[];
    markers?: GraphMarker[];
    selected?: SelectedPointRef | null;
    /** Draw the playhead rule at current-time. Off for a chart that tracks a
     * clock it shouldn't advertise (a pattern shape has no "now"). */
    showPlayhead?: boolean;

    /** Drag and empty-space click scrub the playhead (playback mode only). */
    seekable?: boolean;
    /** The wheel — and a trackpad pinch — zooms: the window span in playback
     * mode (emits `zoom`); in static mode the X window about the cursor
     * (emits `zoom-range`). y is never zoomed by a PLAIN wheel — ask for it
     * with Shift+wheel (both axes), Alt+wheel (y alone), or the wheel over
     * the y gutter (y alone); all emit `zoom-y-range`. Middle-drag (or
     * shift-drag) marks an x range that
     * emits zoom-range on release; Alt-drag (or Ctrl-drag, where the browser
     * lets Ctrl through) marks a y range that emits zoom-y-range. The y-axis
     * gutter is y's control strip: dragging it pans a zoomed y window (also
     * zoom-y-range, clamped inside the zoom-out home), its wheel zooms y
     * alone, and a clean click on it emits zoom-y-fit. Double-click on the
     * plot emits zoom-reset. Each gesture arms only where the page listens
     * for the event it produces — otherwise it is left to the page. */
    zoomable?: boolean;
    /** Click selects the nearest point. */
    selectable?: boolean;
    /** Hover draws a crosshair and a value readout. */
    hoverable?: boolean;

    // Editing — off by default, so the read-only path pays nothing. Every
    // edit prop carries the `edit` prefix: minSpan/maxSpan and xDomain are
    // already in this block bounding the WINDOW, and a bare minX beside them
    // reads like one more of those rather than a limit on a point.
    /** Drag / add / remove points on the edit series. */
    editable?: boolean;
    /** Which series editing applies to; defaults to the first visible one. */
    editSeriesId?: string;
    /** Grid a dragged or added x snaps to; 0 = none (floats pass through).
     * Defaults to whole units on a time axis, and to no grid otherwise —
     * milliseconds are discrete, hours and ratios are not. */
    editSnapX?: number;
    /** Grid a dragged or added y snaps to; 0 = none. Defaults to whole units
     * on a y-domain at least 10 wide (a 0–100 position), no grid below that. */
    editSnapY?: number;
    /** Lower bound a dragged or added x may reach. */
    editMinX?: number;
    /** Upper bound a dragged or added x may reach. */
    editMaxX?: number;

    height?: number;
    /** Override auto-detected canvas colors. */
    theme?: Partial<GraphTheme>;
  }>(),
  {
    revision: 0,
    minSpan: 250,
    maxSpan: 1_800_000,
    yDomain: () => [0, 100] as [number, number],
    xMode: "time",
    yAxisSize: 36,
    showAxes: true,
    regions: () => [],
    markers: () => [],
    selected: null,
    showPlayhead: true,
    seekable: true,
    zoomable: true,
    selectable: true,
    hoverable: true,
    editable: false,
    editSeriesId: "",
    editMinX: Number.NEGATIVE_INFINITY,
    editMaxX: Number.POSITIVE_INFINITY,
    height: 280
  }
);

const emit = defineEmits<{
  seek: [timeMs: number];
  zoom: [spanMs: number];
  /** A marquee was released, or the wheel zoomed a static window: show this
   * x range. In playback mode (marquee only), centre on (from + to) / 2 and
   * set the span to (to - from); in static mode, hand it straight back as
   * x-domain. */
  "zoom-range": [from: number, to: number];
  /** A vertical marquee was released, the wheel zoomed y, or the y-axis
   * gutter was dragged: show this y range. Hand it back as y-domain. Always
   * ascending, whichever way the gesture went — flip it yourself if your
   * y-domain runs high-to-low. */
  "zoom-y-range": [from: number, to: number];
  /** A clean click on the y-axis gutter: fit the y window to what's in
   * view. No range on purpose — the page owns what a fit means (extent of
   * the visible points, padding, or anything else). */
  "zoom-y-fit": [];
  /** Double-click: restore the home view. The page owns what "home" means —
   * typically the full data extent and the resting y-domain. */
  "zoom-reset": [];
  "select-point": [selection: SelectedPointRef | null];
  hover: [point: SelectedPointRef | null];
  /** Live during a drag — mutate the point in place and bump `revision`. */
  "point-drag": [edit: PointEdit];
  /** The drag released: the moment to record one undo step. */
  "point-drag-end": [selection: SelectedPointRef];
  /** Click on empty canvas in editing mode. */
  "point-add": [point: { seriesId: string; x: number; y: number }];
  /** Alt+click on a point of the edit series. */
  "point-delete": [selection: SelectedPointRef];
}>();

const wrapEl = ref<HTMLElement | null>(null);
const chart = shallowRef<uPlot | null>(null);

defineExpose({
  /**
   * The live chart canvas — series, axes, regions, dots, everything drawn.
   * Read-only: draw it onto your own canvas before compositing an export;
   * it is uPlot's working surface and repaints under you.
   */
  snapshot: (): HTMLCanvasElement | null => chart.value?.ctx.canvas ?? null
});
const colors = ref<GraphTheme>(resolveGraphTheme(null, props.theme));
const hovered = shallowRef<SelectedPointRef | null>(null);
const hoverFlip = ref(false);
/** The live zoom marquee: a band across one axis, in that axis' values. */
const marquee = shallowRef<{
  axis: "x" | "y";
  from: number;
  to: number;
} | null>(null);

// Stable empty data — imperative setData owns all real updates, and a stable
// identity keeps uplot-vue from fighting them.
const initialData = [[]] as unknown as uPlot.AlignedData;

/** An x-domain is the caller claiming the window, and it beats everything:
 * scrub-drag and the playback centering stand down, or the pinned window
 * drifts under the caller. The wheel still zooms a pinned window — but only
 * by reporting zoom-range, so the caller stays the one moving it. */
const pinned = computed(() => props.xDomain !== undefined);

/** Playback mode is derived, not declared: a moving window needs both halves
 * — and nobody to have pinned it. */
const playback = computed(
  () =>
    !pinned.value &&
    props.currentTime !== undefined &&
    props.viewSpan !== undefined
);

/** The playhead is about current-time, not about the window: a pinned window
 * with a clock running through it is a normal thing to draw. */
const playhead = computed(
  () => props.showPlayhead && props.currentTime !== undefined
);

const visibleSeries = computed(() =>
  props.series.filter(s => s.visible !== false)
);

/** The series drag/add/remove act on — the first visible one unless named. */
const editSeries = computed<GraphSeries | undefined>(() =>
  props.editSeriesId
    ? visibleSeries.value.find(s => s.id === props.editSeriesId)
    : visibleSeries.value[0]
);

/** Snap grids. Left unset they follow the axis: a millisecond is a discrete
 * unit and a 0–100 position is too, but an axis in hours or a 0–1 ratio is
 * not — rounding those to 1 would collapse an edit onto a handful of values. */
const snapXStep = computed(
  () => props.editSnapX ?? (props.xMode === "value" ? 0 : 1)
);
const snapYStep = computed(() => {
  if (props.editSnapY !== undefined) return props.editSnapY;
  return Math.abs(props.yDomain[1] - props.yDomain[0]) >= 10 ? 1 : 0;
});

// An edit series that isn't there swallows every gesture in silence — the
// commonest way to wire this up wrong is to name a series that is hidden.
if (import.meta.env.DEV) {
  watch(
    () => [props.editable, props.editSeriesId, editSeries.value?.id],
    () => {
      if (props.editable && !editSeries.value) {
        console.warn(
          `[HGraph] editable is on but no series matches edit-series-id "${props.editSeriesId}" — every edit gesture will be ignored.`
        );
      }
    },
    { immediate: true }
  );
}

// Structural identity of the series set; changing it rebuilds the chart.
const structureKey = computed(() =>
  props.series.map(s => `${s.id}|${s.visible !== false}`).join(",")
);
// Colors are resolved through closures, so a recolor only repaints.
const colorKey = computed(() => props.series.map(s => s.color ?? "").join(","));

/** Ramp slot per series id, fixed by position in `series` — hiding or
 * filtering a series must never repaint the survivors. */
const paletteSlots = computed(() => {
  const slots = new Map<string, number>();
  props.series.forEach((s, i) => slots.set(s.id, i));
  return slots;
});

function colorFor(id: string): string {
  const own = props.series.find(s => s.id === id)?.color;
  if (own) return own;
  const slot = paletteSlots.value.get(id) ?? 0;
  return colors.value.series[slot % colors.value.series.length]!;
}

// ------------------------------------------------------------------- axes

// Tick increments a person reads as time. uPlot's default decimal ladder
// lands on things like 2500 ms, which m:ss labels then truncate into an
// irregular-looking 0:45 · 0:47 · 0:50 sequence.
const TIME_INCRS = [
  50, 100, 250, 500, 1_000, 2_000, 5_000, 10_000, 15_000, 30_000, 60_000,
  120_000, 300_000, 600_000, 900_000, 1_800_000, 3_600_000, 7_200_000,
  10_800_000, 21_600_000, 43_200_000, 86_400_000
];

// uPlot's own default ladder, for the plain-number axis.
const NUMERIC_INCRS = (() => {
  const out: number[] = [];
  for (let e = -9; e <= 12; e++)
    for (const m of [1, 2, 5]) out.push(m * 10 ** e);
  return out.sort((a, b) => a - b);
})();

function formatTime(ms: number): string {
  const neg = ms < 0 ? "-" : "";
  const abs = Math.abs(ms);
  const totalSec = Math.floor(abs / 1000);
  const sec = totalSec % 60;
  const min = Math.floor(totalSec / 60) % 60;
  const hours = Math.floor(totalSec / 3600);
  const frac = Math.round(abs % 1000);
  const ss =
    frac === 0
      ? String(sec).padStart(2, "0")
      : (sec + frac / 1000)
          .toFixed(frac % 100 === 0 ? 1 : 2)
          .padStart(frac % 100 === 0 ? 4 : 5, "0");
  return hours > 0
    ? `${neg}${hours}:${String(min).padStart(2, "0")}:${ss}`
    : `${neg}${min}:${ss}`;
}

function formatNumber(value: number): string {
  return Number.isInteger(value)
    ? String(value)
    : String(Math.round(value * 100) / 100);
}

/** Raw milliseconds, space-grouped: 1 234 500. */
function formatMs(ms: number): string {
  const neg = ms < 0 ? "-" : "";
  const abs = Math.abs(ms);
  const whole = Math.floor(abs);
  const frac = Math.round((abs - whole) * 100) / 100;
  const grouped = String(whole).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${neg}${grouped}${frac ? String(frac).slice(1) : ""}`;
}

const fmtX = computed(() => {
  if (props.formatX) return props.formatX;
  if (props.xMode === "time") return formatTime;
  if (props.xMode === "ms") return formatMs;
  return formatNumber;
});
const fmtY = computed(() => props.formatY ?? formatNumber);

/** Both clock modes measure time, so both want time-shaped tick increments. */
const timeAxis = computed(
  () => !props.formatX && (props.xMode === "time" || props.xMode === "ms")
);

const ySplits = computed(() => {
  if (props.ySplits) return props.ySplits;
  // ascending whichever way round the domain was given — uPlot wants splits in
  // order, and clampToDomain deliberately accepts [100, 0]
  const lo = Math.min(props.yDomain[0], props.yDomain[1]);
  const hi = Math.max(props.yDomain[0], props.yDomain[1]);
  const step = (hi - lo) / 4;
  return [lo, lo + step, lo + step * 2, lo + step * 3, hi];
});

// -------------------------------------------------------------- chart options

// uplot-vue compares options by reference per key — ANY new options object
// destroys and recreates the whole chart. So options live in a shallowRef
// rebuilt ONLY when the series structure or the chart box genuinely changes;
// colors, domains, and formatters are read through closures instead.
function buildOptions(): uPlot.Options {
  return {
    width: wrapEl.value?.clientWidth ?? 640,
    height: props.height,
    legend: { show: false },
    cursor: {
      // uPlot's own cursor state machine fights the hand-rolled pointer
      // handlers below; the crosshair is drawn on the overlay instead.
      show: false,
      drag: { x: false, y: false, setScale: false }
    },
    scales: {
      x: { time: false },
      y: { range: () => props.yDomain }
    },
    axes: [
      {
        show: props.showAxes,
        stroke: () => colors.value.axis,
        grid: { stroke: () => colors.value.grid, width: 1 },
        ticks: { stroke: () => colors.value.grid, width: 1 },
        values: (_u, splits) => splits.map(v => fmtX.value(v)),
        // read at draw time, so switching xMode never rebuilds the chart
        incrs: () => (timeAxis.value ? TIME_INCRS : NUMERIC_INCRS),
        space: 90,
        font: "12px Figtree, sans-serif"
      },
      {
        show: props.showAxes,
        stroke: () => colors.value.axis,
        grid: { stroke: () => colors.value.grid, width: 1 },
        ticks: { show: false },
        splits: () => ySplits.value,
        values: (_u, splits) => splits.map(v => fmtY.value(v)),
        size: props.yAxisSize,
        font: "12px Figtree, sans-serif"
      }
    ],
    series: [
      {},
      ...visibleSeries.value.map(s => ({
        label: s.label ?? s.id,
        stroke: () => colorFor(s.id),
        width: 2,
        spanGaps: true,
        // dots-only series: uPlot draws neither the path nor its points —
        // the overlay paints the circles (drawOverlay), which sidesteps
        // uPlot's density-based point filtering entirely. The series stays
        // in the joined data so hover reads the dots like any sample.
        ...(s.dots === true
          ? { paths: (() => null) as unknown as uPlot.Series.PathBuilder }
          : {}),
        // fatter dots on the edit series: they are drag handles there, and a
        // 6 px target is below any reasonable pointer floor. A closure, like
        // every other visual here — turning editing on must not destroy and
        // rebuild the chart, which mid-drag would drop the gesture.
        points: {
          show: s.dots !== true,
          // uPlot runs points.size through fnOrSelf at init and calls it per
          // draw; only its .d.ts is behind, still typing it as a plain number
          size: ((): number =>
            props.editable && s.id === editSeries.value?.id
              ? 10
              : 6) as unknown as number,
          stroke: () => colorFor(s.id),
          fill: () => colorFor(s.id)
        }
      }))
    ],
    hooks: {
      draw: [drawOverlay]
    }
  };
}

const options = shallowRef<uPlot.Options>(buildOptions());

watch(
  [
    structureKey,
    () => props.height,
    () => props.yAxisSize,
    () => props.showAxes
  ],
  () => {
    options.value = buildOptions();
  }
);

// The dot size is a closure, so edit mode only needs a repaint — but the
// crosshair cursor is DOM, and has to be written when it changes.
watch(
  () => [props.editable, editSeries.value?.id],
  () => {
    const u = chart.value;
    if (u) u.over.style.cursor = props.editable ? "crosshair" : "";
    scheduleOverlay();
  }
);

// ---------------------------------------------------------------- rendering

let rafId = 0;
function scheduleRedraw() {
  if (rafId) return;
  rafId = requestAnimationFrame(() => {
    rafId = 0;
    redraw();
  });
}

let overlayRafId = 0;
/** Overlay-only changes need a repaint, not new data. */
function scheduleOverlay() {
  if (overlayRafId) return;
  overlayRafId = requestAnimationFrame(() => {
    overlayRafId = 0;
    chart.value?.redraw(false);
  });
}

let axesRafId = 0;
/** uPlot only re-runs a tick formatter when it recalculates the axes, so
 * swapping xMode or a format fn needs this rather than a plain repaint. */
function scheduleAxes() {
  if (axesRafId) return;
  axesRafId = requestAnimationFrame(() => {
    axesRafId = 0;
    chart.value?.redraw(false, true);
  });
}

/** Full x extent of the visible data — O(1), the sorted invariant does the work. */
function dataExtent(): { from: number; to: number } {
  let from = Number.POSITIVE_INFINITY;
  let to = Number.NEGATIVE_INFINITY;
  for (const s of visibleSeries.value) {
    if (s.points.length === 0) continue;
    from = Math.min(from, s.points[0]!.x);
    to = Math.max(to, s.points[s.points.length - 1]!.x);
  }
  // an empty or single-point series still needs a window wide enough that the
  // ticks read as distinct values rather than six copies of 0:00
  // both clock modes measure milliseconds, so both need a window wide enough
  // to read; an editable graph that starts empty lives or dies on this
  const emptySpan = timeAxis.value ? 60_000 : 1;
  if (!Number.isFinite(from) || !Number.isFinite(to)) {
    return { from: 0, to: emptySpan };
  }
  if (to <= from) {
    // one point: frame it in a window proportional to where it sits, and don't
    // invent negative time to the left of a script that starts at zero
    const pad = Math.max(Math.abs(from) * 0.5, emptySpan / 20);
    return {
      from: from >= 0 ? Math.max(0, from - pad) : from - pad,
      to: to + pad
    };
  }
  // breathing room so the first and last marks aren't glued to the axis
  const pad = (to - from) * 0.02;
  return { from: from - pad, to: to + pad };
}

/**
 * The window as it was when the current point drag began.
 *
 * A window derived from the data is a positive feedback loop the moment the
 * data is editable: the dragged point sets the extent, the extent rescales
 * pixels to values, and the same stationary cursor then maps to a different x
 * every frame — the point crawls away from the pointer, or runs off to the
 * right without bound. Freezing the window for the length of the gesture
 * breaks the cycle; it thaws on release, when the extent can safely catch up.
 */
let latchedWindow: { from: number; to: number } | null = null;

function viewWindow(): { from: number; to: number } {
  if (latchedWindow) return latchedWindow;
  if (props.xDomain) return { from: props.xDomain[0], to: props.xDomain[1] };
  if (playback.value) {
    const half = props.viewSpan! / 2;
    return { from: props.currentTime! - half, to: props.currentTime! + half };
  }
  return dataExtent();
}

function visibleSlice(
  points: readonly GraphPoint[],
  from: number,
  to: number
): readonly GraphPoint[] {
  if (points.length === 0) return points;
  // pad one point either side so lines run off-screen instead of stopping
  const start = Math.max(0, indexAtOrBefore(points, from));
  const end = Math.min(points.length - 1, indexAtOrBefore(points, to) + 1);
  return points.slice(start, end + 1);
}

let appliedY = "";

/** Series ids whose last draw was decimated — i.e. where the drawn line is a
 * simplification and a marker can't be assumed to sit on it. */
const decimatedSeries = new Set<string>();

/**
 * Put `point` back into a decimated slice, in x order.
 *
 * Decimation keeps only the min and max of each pixel column, but the
 * selection ring and the hover dot address the ORIGINAL array — so on a dense
 * script the marker lands at a y strictly between the two drawn extremes and
 * floats in the middle of the stroke band instead of sitting on the line. The
 * point is already in the window; re-inserting it costs one splice and makes
 * the marker and the stroke agree about where it is.
 */
function withPoint(
  points: readonly GraphPoint[],
  point: GraphPoint | null
): readonly GraphPoint[] {
  if (!point) return points;
  const at = indexAtOrBefore(points, point.x);
  if (at >= 0 && points[at] === point) return points;
  const out = points.slice();
  out.splice(at + 1, 0, point);
  return out;
}

function redraw() {
  const u = chart.value;
  if (!u) return;
  const { from, to } = viewWindow();
  const width = Math.max(1, u.bbox.width / devicePixelRatio);

  // The edit series is drawn point for point. Decimation keeps the min and max
  // of each pixel column and throws the rest away, but hit testing and the
  // selection ring address the ORIGINAL array — so on a dense script the point
  // you grab may be one that was never drawn, and dragging it moves nothing on
  // screen while the host's model changes underneath.
  const editId = props.editable ? editSeries.value?.id : undefined;
  const selectedRef = props.selected;
  const hoveredRef = hovered.value;
  decimatedSeries.clear();

  const tables = visibleSeries.value.map(s => {
    const visible = visibleSlice(s.points, from, to);
    let sliced =
      s.id === editId ? visible : decimateMinMax(visible, from, to, width);
    if (sliced !== visible) {
      decimatedSeries.add(s.id);
      // the two marked points are the only ones the overlay draws by hand, so
      // they are the only ones that have to survive the simplification
      if (selectedRef?.seriesId === s.id)
        sliced = withPoint(sliced, s.points[selectedRef.index] ?? null);
      if (hoveredRef?.seriesId === s.id)
        sliced = withPoint(sliced, s.points[hoveredRef.index] ?? null);
    }
    const xs: number[] = [];
    const ys: number[] = [];
    for (const p of sliced) {
      xs.push(p.x);
      ys.push(p.y);
    }
    return [xs, ys] as uPlot.AlignedData;
  });

  const joined: uPlot.AlignedData =
    tables.length === 0
      ? ([[]] as unknown as uPlot.AlignedData)
      : tables.length === 1
        ? ([tables[0]![0], tables[0]![1]] as uPlot.AlignedData)
        : uPlot.join(tables);

  u.setData(joined, false);
  u.setScale("x", { min: from, max: to });

  // the y range fn returns props.yDomain, so any setScale re-reads it
  const yKey = `${props.yDomain[0]}|${props.yDomain[1]}`;
  if (yKey !== appliedY) {
    appliedY = yKey;
    u.setScale("y", { min: props.yDomain[0], max: props.yDomain[1] });
  }
}

// ------------------------------------------------------------ overlay layer

function pointFor(ref: SelectedPointRef | null): GraphPoint | null {
  if (!ref) return null;
  const s = visibleSeries.value.find(v => v.id === ref.seriesId);
  return s?.points[ref.index] ?? null;
}

function drawOverlay(u: uPlot) {
  const ctx = u.ctx;
  const { left, top, width, height } = u.bbox;
  const dpr = devicePixelRatio;
  ctx.save();

  // Everything below is clipped to the plot box. uPlot's canvas covers the
  // axes too, and valToPos extrapolates happily past the window — so a
  // selected point that has scrolled out of view would otherwise be ringed
  // out in the axis gutter, at a position that means nothing. Clipping also
  // gets the half-in case right: a marker at the very edge is cut off, which
  // reads as "just off-screen that way" rather than vanishing.
  ctx.beginPath();
  ctx.rect(left, top, width, height);
  ctx.clip();

  // dots-only series — the marker IS the datum, drawn here because uPlot's
  // own point rendering filters by density and cannot be trusted with a
  // handful of isolated values in a joined grid
  for (const s of visibleSeries.value) {
    if (s.dots !== true) continue;
    ctx.fillStyle = colorFor(s.id);
    for (const point of s.points) {
      const px = u.valToPos(point.x, "x", true);
      const py = u.valToPos(point.y, "y", true);
      ctx.beginPath();
      ctx.arc(px, py, 4.5 * dpr, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // regions (bookmarks, loops, capture spans)
  for (const region of props.regions) {
    const x0 = u.valToPos(region.from, "x", true);
    const x1 = u.valToPos(region.to, "x", true);
    if (x1 < left || x0 > left + width) continue;
    const from = Math.max(x0, left);
    const to = Math.min(x1, left + width);
    ctx.fillStyle = region.color;
    ctx.globalAlpha = region.selected ? 0.3 : 0.14;
    ctx.fillRect(from, top, to - from, height);
    ctx.globalAlpha = 1;
    if (!region.selected) continue;
    // edge rules: they carry the emphasis, and they are the only thing a
    // zero-length region (a freshly dropped marker) can draw at all
    ctx.strokeStyle = region.color;
    ctx.lineWidth = 2 * dpr;
    ctx.beginPath();
    for (const x of [x0, x1]) {
      if (x < left || x > left + width) continue;
      ctx.moveTo(x, top);
      ctx.lineTo(x, top + height);
    }
    ctx.stroke();
  }

  // marker lines (cue points, thresholds)
  for (const marker of props.markers) {
    const x = u.valToPos(marker.x, "x", true);
    if (x < left || x > left + width) continue;
    ctx.strokeStyle = marker.color;
    ctx.lineWidth = 1 * dpr;
    ctx.setLineDash(marker.dashed ? [4 * dpr, 4 * dpr] : []);
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x, top + height);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // playhead — at the window center in playback mode, wherever current-time
  // lands in a pinned one
  if (playhead.value) {
    const cx = u.valToPos(props.currentTime!, "x", true);
    ctx.strokeStyle = colors.value.cursor;
    ctx.lineWidth = 1.5 * dpr;
    ctx.beginPath();
    ctx.moveTo(cx, top);
    ctx.lineTo(cx, top + height);
    ctx.stroke();
  }

  // hover crosshair, snapped to the nearest point
  const hoverPoint = pointFor(hovered.value);
  if (hoverPoint) {
    const hx = u.valToPos(hoverPoint.x, "x", true);
    const hy = u.valToPos(hoverPoint.y, "y", true);
    ctx.strokeStyle = colors.value.axis;
    ctx.lineWidth = 1 * dpr;
    ctx.setLineDash([2 * dpr, 3 * dpr]);
    ctx.beginPath();
    ctx.moveTo(hx, top);
    ctx.lineTo(hx, top + height);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = colorFor(hovered.value!.seriesId);
    ctx.beginPath();
    ctx.arc(hx, hy, 4.5 * dpr, 0, Math.PI * 2);
    ctx.fill();
  }

  // selected point ring
  const selectedPoint = pointFor(props.selected);
  if (selectedPoint) {
    const px = u.valToPos(selectedPoint.x, "x", true);
    const py = u.valToPos(selectedPoint.y, "y", true);
    ctx.strokeStyle = colors.value.selection;
    ctx.lineWidth = 2 * dpr;
    ctx.beginPath();
    ctx.arc(px, py, 7 * dpr, 0, Math.PI * 2);
    ctx.stroke();
  }

  // the zoom marquee, on top of everything — it's transient UI, not data.
  // Pixel edges are sorted AFTER conversion: the y scale runs high-to-low on
  // screen, so sorting values first would invert the y band.
  if (marquee.value) {
    const { axis } = marquee.value;
    const p0 = u.valToPos(marquee.value.from, axis, true);
    const p1 = u.valToPos(marquee.value.to, axis, true);
    const lo = Math.min(p0, p1);
    const hi = Math.max(p0, p1);
    ctx.fillStyle = colors.value.selection;
    ctx.strokeStyle = colors.value.selection;
    ctx.lineWidth = 1 * dpr;
    if (axis === "x") {
      const from = Math.max(lo, left);
      const to = Math.min(hi, left + width);
      ctx.globalAlpha = 0.12;
      ctx.fillRect(from, top, to - from, height);
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.moveTo(from, top);
      ctx.lineTo(from, top + height);
      ctx.moveTo(to, top);
      ctx.lineTo(to, top + height);
      ctx.stroke();
    } else {
      const from = Math.max(lo, top);
      const to = Math.min(hi, top + height);
      ctx.globalAlpha = 0.12;
      ctx.fillRect(left, from, width, to - from);
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.moveTo(left, from);
      ctx.lineTo(left + width, from);
      ctx.moveTo(left, to);
      ctx.lineTo(left + width, to);
      ctx.stroke();
    }
  }

  ctx.restore();
}

const readout = computed(() => {
  const ref = hovered.value;
  const point = pointFor(ref);
  if (!ref || !point) return null;
  const s = props.series.find(v => v.id === ref.seriesId);
  return {
    color: colorFor(ref.seriesId),
    label: s?.label ?? "",
    x: fmtX.value(point.x),
    y: fmtY.value(point.y),
    flip: hoverFlip.value
  };
});

// --------------------------------------------------------------- interaction

/** Click and grab radius. Bigger than a dot on purpose — a 6 px target is
 * below any reasonable pointer floor — but small enough that the halo around
 * a point isn't a place you can't click. */
const GRAB_PX = 12;
/** Hover reaches further than the click: the crosshair is a readout, and
 * missing it costs nothing. */
const HOVER_PX = 24;

let pointerDown = false;
let dragging = false;
/** Any travel at all since pointerdown — separate from `dragging`, which is
 * the x-only scrub threshold and must keep its exact behavior. */
let movedFromDown = false;
let downX = 0;
let downY = 0;
let downTime = 0;
/** The point being dragged in editing mode; `moved` gates the click-vs-drag
 * split, so a plain click on a point selects it without recording an edit. */
let pointDrag: { index: number; moved: boolean } | null = null;
/** The pointer that owns the current gesture. A second finger must not
 * overwrite the first one's drag, nor consume its release. */
let activePointerId: number | null = null;

/**
 * x units per CSS pixel, read from the scale uPlot has actually APPLIED rather
 * than from the window we intend next: posToVal and valToPos read that same
 * applied scale, and mixing the two would offset a hit test by one frame's
 * worth of window movement. The span guard matters because a degenerate window
 * (a zero-width x-domain) would otherwise return 0 and make every later
 * distance NaN — after which nothing on the chart is ever hittable again.
 */
function unitsPerPx(u: uPlot): number {
  const scale = u.scales["x"];
  const applied =
    scale && scale.min !== undefined && scale.max !== undefined
      ? { from: scale.min, to: scale.max }
      : viewWindow();
  const span = Math.max(1e-9, applied.to - applied.from);
  return span / Math.max(1, u.bbox.width / devicePixelRatio);
}

/** y units per CSS pixel — unitsPerPx's y-flavoured twin, with the same
 * applied-scale preference and the same degenerate-domain guard. */
function yUnitsPerPx(u: uPlot): number {
  const scale = u.scales["y"];
  const applied =
    scale && scale.min !== undefined && scale.max !== undefined
      ? { from: scale.min, to: scale.max }
      : { from: props.yDomain[0], to: props.yDomain[1] };
  const span = Math.max(1e-9, Math.abs(applied.to - applied.from));
  return span / Math.max(1, u.bbox.height / devicePixelRatio);
}

function plotTimeAt(u: uPlot, clientX: number): number {
  const rect = u.over.getBoundingClientRect();
  return u.posToVal(clientX - rect.left, "x");
}

/** Pointer position in one axis' units — the marquee reads whichever axis it
 * is marking. */
function plotValAt(
  u: uPlot,
  ev: { clientX: number; clientY: number },
  axis: "x" | "y"
): number {
  const rect = u.over.getBoundingClientRect();
  return axis === "x"
    ? u.posToVal(ev.clientX - rect.left, "x")
    : u.posToVal(ev.clientY - rect.top, "y");
}

/** Pointer position as a point: snapped, and clamped to the x bounds and the
 * y domain. */
function pointAt(u: uPlot, e: PointerEvent): { x: number; y: number } {
  const rect = u.over.getBoundingClientRect();
  const x = snapTo(u.posToVal(e.clientX - rect.left, "x"), snapXStep.value);
  const y = snapTo(u.posToVal(e.clientY - rect.top, "y"), snapYStep.value);
  return {
    x: Math.min(props.editMaxX, Math.max(props.editMinX, x)),
    y: clampToDomain(y, props.yDomain)
  };
}

/** Pointer capture keeps delivering events after the pointer leaves the
 * canvas, and posToVal happily extrapolates past the window — so a release
 * outside has to be disqualified explicitly, not clamped into a lie. */
function isOverPlot(u: uPlot, e: PointerEvent): boolean {
  const rect = u.over.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  return x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
}

/** Move the dragged point, pinned between its neighbours (see graph-edit). */
function emitPointDrag(u: uPlot, e: PointerEvent): void {
  const drag = pointDrag;
  const series = editSeries.value;
  if (!drag || !series) return;
  if (!series.points[drag.index]) return;
  const { x, y } = pointAt(u, e);
  const step = snapXStep.value;
  const nextX = clampDragX(series.points, drag.index, x, {
    minX: props.editMinX,
    maxX: props.editMaxX,
    snapX: step,
    // off-grid, a pixel is the smallest gap that still means something on
    // screen — and it keeps two points from sharing an x
    gap: step > 0 ? step : unitsPerPx(u)
  });
  emit("point-drag", { seriesId: series.id, index: drag.index, x: nextX, y });
}

function hitTestPoint(
  u: uPlot,
  clientX: number,
  clientY: number,
  threshold: number,
  /** Restrict the search to one series. Without it, a reference series drawn
   * a few pixels nearer wins the search and the edit-series point underneath
   * can never be grabbed at all. */
  onlySeriesId?: string
): SelectedPointRef | null {
  const rect = u.over.getBoundingClientRect();
  const px = clientX - rect.left;
  const py = clientY - rect.top;
  const t = u.posToVal(px, "x");
  // test every point whose x lands within the pixel threshold of the pointer,
  // not just the two bracketing it — in dense clusters the visually nearest
  // point is often several indexes away
  const xRadius = threshold * unitsPerPx(u);
  let best: SelectedPointRef | null = null;
  let bestDist = threshold;
  for (const s of visibleSeries.value) {
    if (onlySeriesId !== undefined && s.id !== onlySeriesId) continue;
    const first = Math.max(0, indexAtOrBefore(s.points, t - xRadius));
    const last = Math.min(
      s.points.length - 1,
      indexAtOrBefore(s.points, t + xRadius) + 1
    );
    for (let i = first; i <= last; i++) {
      const p = s.points[i];
      if (!p) continue;
      const dx = u.valToPos(p.x, "x") - px;
      const dy = u.valToPos(p.y, "y") - py;
      const dist = Math.hypot(dx, dy);
      if (dist < bestDist) {
        bestDist = dist;
        best = { seriesId: s.id, index: i };
      }
    }
  }
  return best;
}

function setHover(next: SelectedPointRef | null, px = 0, width = 1) {
  const prev = hovered.value;
  const same =
    (prev === null && next === null) ||
    (prev !== null &&
      next !== null &&
      prev.seriesId === next.seriesId &&
      prev.index === next.index);
  if (same) return;
  hovered.value = next;
  // keep the readout chip off the point it describes
  if (next) hoverFlip.value = px > width * 0.6;
  emit("hover", next);
  // on a decimated series the crosshair's point has to be threaded back into
  // the drawn data, which is a data pass rather than a repaint
  if (
    (prev && decimatedSeries.has(prev.seriesId)) ||
    (next && decimatedSeries.has(next.seriesId))
  ) {
    scheduleRedraw();
  } else {
    scheduleOverlay();
  }
}

const instance = getCurrentInstance();

/** Read at gesture time because the vnode is replaced on every render. */
function hasListener(name: string): boolean {
  const handler = instance?.vnode.props?.[name];
  return typeof handler === "function" || Array.isArray(handler);
}

/**
 * Whether a marquee on this axis can do anything.
 *
 * The component only REPORTS the range — so on a graph whose page doesn't
 * listen for the matching event, arming the gesture paints a selection band
 * and then silently drops it on release, which reads as a broken zoom rather
 * than as an absent feature. `zoomable` can't answer this on its own: it also
 * gates the wheel, and a playback graph can want wheel-zoom (which it handles
 * through `zoom`) without a marquee. So the listener is the switch — per
 * axis, because a funscript page has a real x window and a fixed 0–100 y.
 */
function marqueeArmed(axis: "x" | "y"): boolean {
  if (!props.zoomable) return false;
  return hasListener(axis === "x" ? "onZoomRange" : "onZoomYRange");
}

/** Whether a press on the y-axis gutter has anywhere to land: the pan and
 * the gutter wheel need zoom-y-range, the click-fit needs zoom-y-fit — any
 * of them arms the press. No axes, no gutter. */
function gutterArmed(): boolean {
  if (!props.zoomable || !props.showAxes) return false;
  return hasListener("onZoomYRange") || hasListener("onZoomYFit");
}

/**
 * Which marquee a press starts, if any. The middle button, or shift +
 * primary for trackpads that have no middle click, marks an x range. Alt +
 * primary marks a y range — Ctrl is accepted as an alias, but can't be the
 * only chord: macOS turns Ctrl+click into the context menu, and Safari there
 * reports it as the right button outright, so this handler never even sees
 * it. No chord fires while editing, where the primary button belongs to the
 * points (Alt+click already deletes there) and a modifier held for any
 * reason would otherwise make them ungrabbable.
 */
function marqueeAxis(e: PointerEvent | MouseEvent): "x" | "y" | null {
  if (e.button === 1) return "x";
  if (e.button !== 0 || props.editable) return null;
  if (e.shiftKey) return "x";
  if (e.altKey || e.ctrlKey) return "y";
  return null;
}

function endMarquee(u: uPlot) {
  const range = marquee.value;
  marquee.value = null;
  scheduleOverlay();
  if (!range) return;

  let from = Math.min(range.from, range.to);
  let to = Math.max(range.from, range.to);

  if (range.axis === "y") {
    // same stray-click guard as x, measured in y pixels
    if ((to - from) / yUnitsPerPx(u) < 8) return;
    emit("zoom-y-range", from, to);
    return;
  }

  // a stray click is not a range
  if ((to - from) / unitsPerPx(u) < 8) return;

  if (playback.value) {
    // the playback window has limits; a marquee outside them keeps its centre
    const centre = (from + to) / 2;
    const span = Math.min(props.maxSpan, Math.max(props.minSpan, to - from));
    from = centre - span / 2;
    to = centre + span / 2;
  }
  emit("zoom-range", from, to);
}

/** Torn down when the marquee ends, however it ends. */
let stopMarqueeTracking: (() => void) | null = null;
/** Torn down when the y-axis pan ends, however it ends. */
let stopAxisPanTracking: (() => void) | null = null;

/** The y-axis gutter: left of the plot, within its vertical run. The axis
 * labels are canvas pixels, not elements, so the region is the hit test. */
function inYAxisGutter(
  u: uPlot,
  e: { clientX: number; clientY: number }
): boolean {
  const rootRect = u.root.getBoundingClientRect();
  const overRect = u.over.getBoundingClientRect();
  return (
    e.clientX >= rootRect.left &&
    e.clientX < overRect.left &&
    e.clientY >= overRect.top &&
    e.clientY <= overRect.bottom
  );
}

/**
 * A press on the y-axis gutter: drag pans a zoomed y window, a clean click
 * asks for a y fit.
 *
 * The pan is the y twin of the pinned window's x pan, living on the gutter
 * because the plot's own drag is spoken for (scrub, x pan, marquee,
 * editing). The shift is clamped inside yZoomHome, so the gesture dies away
 * at "all of it" instead of drifting into empty space — which also means it
 * only moves anything while the window is actually zoomed in. Tracked on
 * window listeners like the marquee: the drag must survive leaving the
 * gutter.
 *
 * The same slop that separates click from drag on the plot separates them
 * here: below it the press is a click and emits zoom-y-fit on release — the
 * page fits y to what's in view, however it defines a fit. Without the slop
 * gate, the click's own jitter would emit a hair of pan before the fit.
 */
function beginYAxisPan(u: uPlot, e: PointerEvent): void {
  activePointerId = e.pointerId;
  const downX = e.clientX;
  const downY = e.clientY;
  let lastY = e.clientY;
  let moved = false;

  const onMove = (ev: PointerEvent) => {
    if (ev.pointerId !== activePointerId) return;
    // the browser ate the pointerup — a buttonless move must not keep panning
    if (ev.buttons === 0) {
      stopAxisPanTracking?.();
      activePointerId = null;
      return;
    }
    if (!moved) {
      if (Math.hypot(ev.clientX - downX, ev.clientY - downY) <= 3) {
        // still a click; keep measuring from here so the pan, if it starts,
        // starts without a jump
        lastY = ev.clientY;
        return;
      }
      moved = true;
    }
    const dy = ev.clientY - lastY;
    // the window moves under the cursor, so the next move measures from here
    lastY = ev.clientY;
    const home = yZoomHome();
    const from = Math.min(props.yDomain[0], props.yDomain[1]);
    const to = Math.max(props.yDomain[0], props.yDomain[1]);
    const minShift = home.from - from;
    const maxShift = home.to - to;
    // a window as wide as home (or wider) has nowhere to pan
    if (minShift > maxShift) return;
    // dragging DOWN moves the labels down with the cursor: higher values
    // scroll into view, so the window shifts up
    const shift = Math.min(maxShift, Math.max(minShift, dy * yUnitsPerPx(u)));
    if (shift !== 0) emit("zoom-y-range", from + shift, to + shift);
  };
  const onUp = (ev: PointerEvent) => {
    if (ev.pointerId !== activePointerId) return;
    stopAxisPanTracking?.();
    activePointerId = null;
    if (!moved && hasListener("onZoomYFit")) emit("zoom-y-fit");
  };
  const onCancel = (ev: PointerEvent) => {
    if (ev.pointerId !== activePointerId) return;
    // a cancelled press is neither a pan to finish nor a click to honour
    stopAxisPanTracking?.();
    activePointerId = null;
  };

  window.addEventListener("pointermove", onMove, true);
  window.addEventListener("pointerup", onUp, true);
  window.addEventListener("pointercancel", onCancel, true);
  stopAxisPanTracking = () => {
    window.removeEventListener("pointermove", onMove, true);
    window.removeEventListener("pointerup", onUp, true);
    window.removeEventListener("pointercancel", onCancel, true);
    stopAxisPanTracking = null;
  };
}

/**
 * Start a marquee, tracked on WINDOW listeners rather than on pointer capture.
 *
 * A middle-button drag is the gesture a browser is likeliest to take the
 * capture away from — autoscroll, a paste gesture, a driver mapping, a
 * scroll-wheel click the OS claims — and `lostpointercapture` arriving
 * mid-drag would otherwise kill the band silently. Tracking on the window
 * means the gesture survives losing the element, and it still ends on the real
 * release even if that release lands outside the plot.
 */
function beginMarquee(u: uPlot, e: PointerEvent, axis: "x" | "y"): void {
  const at = plotValAt(u, e, axis);
  marquee.value = { axis, from: at, to: at };
  setHover(null);
  activePointerId = e.pointerId;

  const onMove = (ev: PointerEvent) => {
    const live = marquee.value;
    if (!live || ev.pointerId !== activePointerId) return;
    marquee.value = { axis, from: live.from, to: plotValAt(u, ev, axis) };
    scheduleOverlay();
  };
  const onUp = (ev: PointerEvent) => {
    if (ev.pointerId !== activePointerId) return;
    stopMarqueeTracking?.();
    activePointerId = null;
    latchedWindow = null;
    endMarquee(u);
  };
  const onCancel = (ev: PointerEvent) => {
    if (ev.pointerId !== activePointerId) return;
    // a cancelled marquee has no half-applied state — drop it rather than
    // zoom to a range the user never finished choosing
    stopMarqueeTracking?.();
    activePointerId = null;
    marquee.value = null;
    scheduleOverlay();
  };

  window.addEventListener("pointermove", onMove, true);
  window.addEventListener("pointerup", onUp, true);
  window.addEventListener("pointercancel", onCancel, true);
  stopMarqueeTracking = () => {
    window.removeEventListener("pointermove", onMove, true);
    window.removeEventListener("pointerup", onUp, true);
    window.removeEventListener("pointercancel", onCancel, true);
    stopMarqueeTracking = null;
  };
}

/** Release everything a gesture latched. Called when the pointer is taken away
 * (cancel, lost capture) and when the canvas itself goes — without it a drag
 * stays armed and the next pointermove resumes an edit nobody asked for. */
function releaseGestures(): void {
  pointerDown = false;
  dragging = false;
  movedFromDown = false;
  pointDrag = null;
  stopMarqueeTracking?.();
  stopAxisPanTracking?.();
  marquee.value = null;
  activePointerId = null;
  latchedWindow = null;
}

/** A gesture ended without a pointerup — cancelled, or the capture was taken
 * away (the element went, the chart was rebuilt, the browser stole it). A
 * half-drawn marquee has no half-applied state and is discarded; a moved point
 * is already in the host's model and still owes it the one undo checkpoint, or
 * the host is left holding an edit it never committed. */
function abortGesture(): void {
  const drag = pointDrag;
  const series = editSeries.value;
  releaseGestures();
  scheduleOverlay();
  if (drag?.moved && series)
    emit("point-drag-end", { seriesId: series.id, index: drag.index });
}

// ------------------------------------------------------------------- wheel

/**
 * Wheel deltas in CSS pixels, whatever unit and axis the browser chose.
 *
 * Chrome and Safari send pixels (~100 per mouse notch); Firefox sends LINES
 * (deltaY 3 per notch) and, on a rare setup, PAGES. Reading deltaY raw makes
 * the same notch zoom thirty times less on Firefox — a zoom that looks broken
 * rather than slow. And Shift+wheel — the x-only chord — arrives as a
 * HORIZONTAL delta on most browsers, deltaY 0, so the motion is read from
 * whichever axis carries it.
 */
function wheelPixels(e: WheelEvent): number {
  const d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
  if (e.deltaMode === 1) return d * 16; // lines → about one line-height
  if (e.deltaMode === 2) return d * 400; // pages → about one viewport
  return d;
}

/** The zoom factor a wheel event asks for. Tracks the delta's MAGNITUDE
 * rather than stepping a fixed amount per event: a pinch fires a stream of
 * small deltas, and at a flat 1.25x each it bottoms out the zoom before the
 * fingers have finished moving. The exponential also composes — two
 * half-sized events zoom exactly as far as one whole one. */
function wheelFactor(e: WheelEvent): number {
  return Math.min(3, Math.max(1 / 3, Math.exp(wheelPixels(e) * 0.003)));
}

/**
 * Which axes this wheel event zooms — and with it whether the wheel is
 * claimed at all.
 *
 * One chord per intent, and no two the same:
 *   plain wheel   x alone
 *   Shift+wheel   both axes
 *   Alt+wheel     y alone (as does the wheel over the y gutter)
 *
 * X is the bare gesture because it is the axis a series is read along, and
 * the wheel is what people reach for without thinking. Scaling both at once
 * moves the trace under the cursor in two directions — which reads as the
 * graph squirming rather than as a zoom, and quietly discards a y window the
 * page may have set on purpose — so both-axes is a chord you ask for.
 *
 * An axis arms the way anything here does — the page listens for the event it
 * produces — so over a graph with nothing to land on, the wheel stays what it
 * is everywhere else on the page: scroll. Playback mode has no y window; its
 * span zoom answers any chord that asks for x.
 */
function wheelAxes(e: WheelEvent): { x: boolean; y: boolean } {
  if (!props.zoomable) return { x: false, y: false };
  const x = !e.altKey && hasListener(playback.value ? "onZoom" : "onZoomRange");
  const y =
    (e.altKey || e.shiftKey) && !playback.value && hasListener("onZoomYRange");
  return { x, y };
}

/**
 * The y window wheel zoom-OUT converges on: `y-zoom-extent` when the page
 * supplies one, else the y extent of the visible data — "show all of it".
 * That extent is a full scan (y is unsorted, unlike x), so it is cached
 * against the same identity the drawn data has: revision + structure.
 */
let yExtentCache: { key: string; from: number; to: number } | null = null;
function yZoomHome(): { from: number; to: number } {
  if (props.yZoomExtent) {
    const [a, b] = props.yZoomExtent;
    return { from: Math.min(a, b), to: Math.max(a, b) };
  }
  const key = `${props.revision}|${structureKey.value}`;
  if (yExtentCache?.key === key) return yExtentCache;
  let from = Number.POSITIVE_INFINITY;
  let to = Number.NEGATIVE_INFINITY;
  for (const s of visibleSeries.value) {
    for (const p of s.points) {
      if (p.y < from) from = p.y;
      if (p.y > to) to = p.y;
    }
  }
  // no data, or a flat line: fall back to the current domain so zoom-out
  // still has somewhere honest to land (uncached — it tracks a live prop)
  if (!(to > from)) {
    return {
      from: Math.min(props.yDomain[0], props.yDomain[1]),
      to: Math.max(props.yDomain[0], props.yDomain[1])
    };
  }
  yExtentCache = { key, from, to };
  return yExtentCache;
}

/**
 * Scale `win` about the anchor sitting at `frac` of it, so the value under
 * the cursor stays put while everything else moves.
 *
 * Zoom-in floors at 1/10000 of the home extent — a free-spinning wheel
 * delivers dozens of 3x events in one flick, and an unfloored dive ends
 * microseconds wide, as far from the data as it takes notches to return;
 * min() so a caller who pinned an even narrower window than that only gets
 * no-op, never a surprise zoom-out. Zoom-out CONVERGES on the home extent —
 * edges past it are pulled back in, never pegged where a stale window
 * happened to leave them. Null when the window didn't move (already at the
 * extent, or already at the floor): that is not a zoom.
 */
function zoomAbout(
  win: { from: number; to: number },
  home: { from: number; to: number },
  frac: number,
  factor: number
): { from: number; to: number } | null {
  const span = win.to - win.from;
  const anchor = win.from + frac * span;
  const floor = Math.min(span, (home.to - home.from) / 10_000);
  const nextSpan = Math.max(floor, span * factor);
  let from = anchor - frac * nextSpan;
  let to = from + nextSpan;
  if (factor > 1) {
    from = Math.max(from, home.from);
    to = Math.min(to, home.to);
    // a window that lies entirely outside its home (a stale pin over
    // regenerated data) inverts under the clamp — resolve it to the whole
    // extent rather than leaving a dead wheel
    if (!(to > from)) {
      from = home.from;
      to = home.to;
    }
  }
  if (!(to > from) || (from === win.from && to === win.to)) return null;
  return { from, to };
}

/**
 * The wheel zooms the graph — the window span in playback mode, the armed
 * axes about the cursor in static mode. No modifier is needed: the wheel
 * over a zoomable chart IS the zoom, a macOS trackpad pinch (which arrives
 * as ctrlKey wheel events) rides the same path, and Shift / Alt narrow the
 * zoom to one axis (see wheelAxes).
 *
 * preventDefault comes before the remaining early-outs, and stays even when
 * the zoom is already at a limit: Ctrl+wheel is the browser's own page-zoom
 * gesture, and a wheel that zooms on one notch and scrolls the page on the
 * next is worse than one that briefly does nothing.
 *
 * Anchors come from the cursor's FRACTION of the intended window, not from
 * posToVal — mid-burst the applied scale is a frame behind the window the
 * page just pinned, and an anchor read off it slides away from the cursor.
 * The limits live in zoomAbout: x converges on the data extent, y on
 * yZoomHome.
 */
function onWheel(u: uPlot, e: WheelEvent): void {
  const axes = wheelAxes(e);
  if (!axes.x && !axes.y) return;
  e.preventDefault();
  // a pointer gesture owns the window (it latches mid-scrub); zooming under
  // one would move the readout without moving the canvas, then snap on release
  if (activePointerId !== null) return;
  const factor = wheelFactor(e);
  if (playback.value) {
    const next = Math.min(
      props.maxSpan,
      Math.max(props.minSpan, props.viewSpan! * factor)
    );
    if (next !== props.viewSpan) emit("zoom", next);
    return;
  }
  if (axes.x) {
    const rect = u.over.getBoundingClientRect();
    const frac = Math.min(
      1,
      Math.max(0, (e.clientX - rect.left) / Math.max(1, rect.width))
    );
    const next = zoomAbout(viewWindow(), dataExtent(), frac, factor);
    if (next) emit("zoom-range", next.from, next.to);
  }
  if (axes.y) wheelZoomY(u, e, factor);
}

/** The y half of a wheel zoom: scale the y window about the cursor's height.
 * The fraction is measured from the BOTTOM edge — the y scale runs top-down
 * on screen. Shared by the plot wheel and the gutter wheel. */
function wheelZoomY(u: uPlot, e: WheelEvent, factor: number): void {
  const rect = u.over.getBoundingClientRect();
  const frac =
    1 -
    Math.min(1, Math.max(0, (e.clientY - rect.top) / Math.max(1, rect.height)));
  const win = {
    from: Math.min(props.yDomain[0], props.yDomain[1]),
    to: Math.max(props.yDomain[0], props.yDomain[1])
  };
  const next = zoomAbout(win, yZoomHome(), frac, factor);
  if (next) emit("zoom-y-range", next.from, next.to);
}

/** The wheel over the y-axis gutter zooms y alone — the gutter IS the y
 * control strip, so no modifier is asked for. Same arming as everything
 * else: no listener, no claimed wheel. */
function onGutterWheel(u: uPlot, e: WheelEvent): void {
  if (!marqueeArmed("y")) return;
  e.preventDefault();
  if (activePointerId !== null) return;
  wheelZoomY(u, e, wheelFactor(e));
}

function attachInteractions(u: uPlot) {
  const over = u.over;
  over.style.touchAction = "none";
  if (props.editable) over.style.cursor = "crosshair";

  // Chrome starts its autoscroll on middle mousedown, and the browser fires a
  // middle auxclick afterwards — both have to be refused for a drag to work.
  // These have to be the refusal: calling preventDefault on the POINTERdown
  // instead suppresses the compatibility mousedown altogether, so this handler
  // never runs and the browser's own middle-button gesture is never actually
  // refused. (Text selection is handled by user-select: none on .h-graph.)
  over.addEventListener("mousedown", e => {
    if (e.button === 1) e.preventDefault();
  });
  over.addEventListener("auxclick", e => {
    if (e.button === 1) e.preventDefault();
  });
  // macOS fires the context menu on Ctrl+press — the vertical-marquee alias.
  // Refuse it only where that chord is armed and would actually mark a band;
  // a plain right-click (and every unarmed graph) keeps its menu.
  over.addEventListener("contextmenu", e => {
    if (e.ctrlKey && !props.editable && marqueeArmed("y")) e.preventDefault();
  });

  over.addEventListener("pointerdown", e => {
    // One gesture at a time, one pointer at a time. Without this a middle
    // press during a point drag latches a marquee on top of it (freezing the
    // drag and then teleporting the point when the window moves), and a second
    // finger overwrites the first finger's drag and steals its release.
    if (activePointerId !== null) return;
    // buttons the chart has no gesture for — a right press must never arm the
    // scrub latch, because the context menu can swallow its pointerup and
    // leave the chart seeking on every buttonless move afterwards
    if (e.button !== 0 && e.button !== 1) return;

    // Editing claims the primary button first: a press on a drag handle must
    // never be read as a scrub or as the start of a marquee. No preventDefault
    // here — that would suppress the compatibility mousedown, and with it the
    // focus the host's keyboard region needs for its Delete handler.
    if (props.editable && e.button === 0) {
      // the edit series only: a reference series drawn a few pixels nearer
      // would otherwise win the search and make the handle beneath it
      // permanently ungrabbable
      const hit = hitTestPoint(
        u,
        e.clientX,
        e.clientY,
        GRAB_PX,
        editSeries.value?.id
      );
      if (e.altKey) {
        // Alt is the remove modifier and nothing else: on empty canvas it is a
        // deliberate no-op, never an add
        setHover(null);
        if (hit) emit("point-delete", hit);
        return;
      }
      if (hit) {
        setHover(null);
        pointerDown = true;
        dragging = false;
        movedFromDown = false;
        downX = e.clientX;
        downY = e.clientY;
        pointDrag = { index: hit.index, moved: false };
        // freeze the window for the gesture, so a data-derived extent can't
        // move the pixels out from under the point being held
        latchedWindow = viewWindow();
        activePointerId = e.pointerId;
        over.setPointerCapture(e.pointerId);
        emit("select-point", hit);
        return;
      }
    }
    // the marquee chord is swallowed whether or not it zooms — falling through
    // would make a middle-drag scrub, and a middle-click add a point
    const axis = marqueeAxis(e);
    if (axis) {
      if (marqueeArmed(axis)) beginMarquee(u, e, axis);
      return;
    }
    pointerDown = true;
    dragging = false;
    movedFromDown = false;
    pointDrag = null;
    downX = e.clientX;
    downY = e.clientY;
    downTime = props.currentTime ?? 0;
    activePointerId = e.pointerId;
    over.setPointerCapture(e.pointerId);
  });

  over.addEventListener("pointermove", e => {
    if (activePointerId !== null && e.pointerId !== activePointerId) return;
    // a latch that outlived its release (the browser ate the pointerup) would
    // otherwise scrub or drag on a bare hover
    if (activePointerId !== null && e.buttons === 0) {
      abortGesture();
      return;
    }
    // the marquee tracks on the window (see beginMarquee), so it is not
    // handled here — it must keep working after the element loses the pointer
    if (marquee.value) return;
    if (pointerDown) {
      const dx = e.clientX - downX;
      const travel = Math.hypot(dx, e.clientY - downY);
      if (!movedFromDown && travel > 3) movedFromDown = true;
      if (pointDrag) {
        // 2 px of slop: below it the gesture is still a click (which selects),
        // above it the point is being dragged
        if (!pointDrag.moved && travel <= 2) return;
        pointDrag.moved = true;
        emitPointDrag(u, e);
        return;
      }
      // A PINNED window pans instead: dragging must not scrub it (the caller
      // owns the window), but sliding it sideways is the obvious gesture on a
      // chart that is bigger than its viewport. Same event as the marquee —
      // "show this x range" — so a page that already zooms gets panning for
      // free, and one that ignores zoom-range keeps its drag inert.
      if (pinned.value && marqueeArmed("x")) {
        if (!dragging && Math.abs(dx) > 3) dragging = true;
        if (dragging) {
          setHover(null);
          const [from, to] = props.xDomain!;
          const shift = dx * unitsPerPx(u);
          emit("zoom-range", from - shift, to - shift);
          // the window moved under the cursor, so the next move measures from
          // here — without this the drag accelerates away
          downX = e.clientX;
        }
        return;
      }
      if (!playback.value || !props.seekable) return;
      if (!dragging && Math.abs(dx) > 3) dragging = true;
      if (dragging) {
        setHover(null);
        emit("seek", downTime - dx * unitsPerPx(u));
      }
      return;
    }
    if (!props.hoverable) return;
    const rect = over.getBoundingClientRect();
    setHover(
      // while editing, hover reaches exactly as far as the grab does: a
      // readout naming a point you then can't grab — and whose click adds a
      // new point beside it instead — is worse than no readout
      hitTestPoint(
        u,
        e.clientX,
        e.clientY,
        props.editable ? GRAB_PX : HOVER_PX
      ),
      e.clientX - rect.left,
      rect.width
    );
  });

  over.addEventListener("pointerleave", () => setHover(null));

  over.addEventListener("pointerup", e => {
    if (activePointerId !== null && e.pointerId !== activePointerId) return;
    activePointerId = null;
    latchedWindow = null;
    if (marquee.value) return;
    if (!pointerDown) return;
    pointerDown = false;
    if (pointDrag) {
      const drag = pointDrag;
      pointDrag = null;
      const series = editSeries.value;
      // a click that never moved already emitted select-point on the way down
      if (drag.moved && series)
        emit("point-drag-end", { seriesId: series.id, index: drag.index });
      return;
    }
    if (dragging) {
      dragging = false;
      return;
    }
    // While editing, only the edit series answers a click. Otherwise every
    // reference series drawn underneath would wrap each of its points in a
    // 12 px halo where a new point cannot be placed — on a dense reference
    // script that is most of the canvas.
    const hit = props.selectable
      ? hitTestPoint(u, e.clientX, e.clientY, GRAB_PX)
      : null;
    if (hit && (!props.editable || hit.seriesId === editSeries.value?.id)) {
      emit("select-point", hit);
      return;
    }
    if (props.editable) {
      // a slipped press is not a click, and a release off-canvas is not a
      // position: dropping a point where the finger happened to stop is the
      // one edit nobody asks for
      if (movedFromDown || !isOverPlot(u, e)) return;
      const series = editSeries.value;
      if (series) emit("point-add", { seriesId: series.id, ...pointAt(u, e) });
      return;
    }
    if (dragging) return; // a pan is not a click
    if (playback.value && props.seekable)
      emit("seek", plotTimeAt(u, e.clientX));
    else if (props.selectable) emit("select-point", null);
  });

  over.addEventListener("pointercancel", abortGesture);
  over.addEventListener("lostpointercapture", abortGesture);

  // The y-axis gutter pans a zoomed y window. These sit on the chart ROOT:
  // the overlay div covers only the plot, and the axis labels are drawn
  // outside it. Plot gestures stay unaffected — over's own handlers claim
  // the pointer first, and the gutter test refuses everything else.
  u.root.addEventListener("pointerdown", e => {
    if (activePointerId !== null || e.button !== 0) return;
    if (!gutterArmed() || !inYAxisGutter(u, e)) return;
    beginYAxisPan(u, e);
  });
  u.root.addEventListener("pointermove", e => {
    if (activePointerId !== null) return;
    // the affordance: the gutter shows the pan cursor only where a press
    // would actually do something
    u.root.style.cursor =
      gutterArmed() && inYAxisGutter(u, e) ? "ns-resize" : "";
  });
  u.root.addEventListener("pointerleave", () => {
    u.root.style.cursor = "";
  });
  // the gutter wheel zooms y alone. Plot wheels bubble up here too, but the
  // gutter test refuses them — the plot's own wheel handler already ran
  u.root.addEventListener(
    "wheel",
    e => {
      if (inYAxisGutter(u, e)) onGutterWheel(u, e);
    },
    { passive: false }
  );

  // Double-click restores the home view — the standing reset gesture on every
  // chart tool. Reported, never applied: the page owns what "home" means.
  // Listener-armed like the marquees, and off while editing, where two quick
  // clicks are two deliberate point-adds, not a reset.
  over.addEventListener("dblclick", () => {
    if (!props.zoomable || props.editable) return;
    if (hasListener("onZoomReset")) emit("zoom-reset");
  });

  over.addEventListener("wheel", e => onWheel(u, e), { passive: false });
}

// -------------------------------------------------------------------- wiring

function onCreate(u: uPlot) {
  chart.value = u;
  attachInteractions(u);
  appliedY = "";
  scheduleRedraw();
}

function onDelete() {
  chart.value = null;
  // A rebuild mid-drag destroys the captured element, so the release event
  // never arrives: every latch has to reset here or hovering keeps scrubbing,
  // and a live pointDrag would resume on the next chart's first move. It also
  // has to COMMIT — the host has already applied the drag, and abortGesture is
  // its only remaining chance at the undo checkpoint.
  abortGesture();
  hovered.value = null;
}

let resizeObserver: ResizeObserver | null = null;
let stopThemeWatch: (() => void) | null = null;

onMounted(() => {
  colors.value = resolveGraphTheme(wrapEl.value, props.theme);
  stopThemeWatch = watchGraphTheme(() => {
    colors.value = resolveGraphTheme(wrapEl.value, props.theme);
    scheduleOverlay();
  });
  resizeObserver = new ResizeObserver(() => {
    const u = chart.value;
    const el = wrapEl.value;
    if (!u || !el) return;
    u.setSize({ width: el.clientWidth, height: props.height });
    scheduleRedraw();
  });
  if (wrapEl.value) resizeObserver.observe(wrapEl.value);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  stopThemeWatch?.();
  if (rafId) cancelAnimationFrame(rafId);
  if (overlayRafId) cancelAnimationFrame(overlayRafId);
  if (axesRafId) cancelAnimationFrame(axesRafId);
});

watch(
  () => [
    props.revision,
    props.currentTime,
    props.viewSpan,
    props.xDomain,
    props.yDomain,
    ySplits.value,
    structureKey.value,
    // a swapped-in points array is a data change too — only in-place
    // mutation needs the revision counter
    props.series
  ],
  () => scheduleRedraw()
);

watch(
  () => [props.regions, props.markers, props.selected, colorKey.value],
  () => {
    if (props.selected && decimatedSeries.has(props.selected.seriesId))
      scheduleRedraw();
    else scheduleOverlay();
  },
  { deep: true }
);

watch(
  () => [props.xMode, props.formatX, props.formatY, props.ySplits],
  () => scheduleAxes()
);

watch(
  () => props.theme,
  () => {
    colors.value = resolveGraphTheme(wrapEl.value, props.theme);
    scheduleOverlay();
  },
  { deep: true }
);
</script>

<style scoped lang="scss">
.h-graph {
  width: 100%;
  position: relative;
  // a drag across the canvas is a gesture, not a text selection — and the
  // pointer handlers deliberately don't preventDefault, because that would
  // also eat the click that focuses an editable graph's keyboard region
  user-select: none;
}

.h-graph :deep(.uplot) {
  font-family: inherit;
}

.h-graph__readout {
  position: absolute;
  top: var(--space-xs);
  right: var(--space-xs);
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: var(--radius-xs);
  background: var(--color-bg-card);
  border: 1px solid var(--color-stroke-subtle);
  // the chip floats over the plot, and on a card-surfaced panel its background
  // is the panel's own — without a shadow the border is all that separates them
  box-shadow: 0 2px 8px rgb(0 0 0 / 12%);
  font-size: 12px;
  line-height: 1.4;
  // values wear text tokens; the dot carries series identity
  color: var(--color-text-secondary);
  font-variant-numeric: tabular-nums;
  pointer-events: none;
  white-space: nowrap;
}

.h-graph__readout--left {
  right: auto;
  left: var(--space-xs);
}

.h-graph__readout-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  flex: 0 0 auto;
}

.h-graph__readout-label {
  color: var(--color-text-primary);
  font-weight: 500;
}

.h-graph__readout-value + .h-graph__readout-value::before {
  content: "·";
  margin-right: 6px;
  color: var(--color-text-tertiary);
}
</style>
