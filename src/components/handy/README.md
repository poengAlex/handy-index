# The Handy component kit

Copy this whole folder into a project, plus the token/type-class layer of
`src/css/app.scss` (the `:root` / `[data-theme]` custom properties and the
`.text-*` classes), then:

```ts
import { HBtn, hToast } from "@/components/handy";
```

Peer dependencies, per component:

| Needs                                               | Components                                   |
| --------------------------------------------------- | -------------------------------------------- |
| Quasar (components; `Notify` plugin, `Dark` plugin) | most of the kit; `toast.ts`; `useHandyTheme` |
| vue-router                                          | anything taking a `to` prop                  |
| `vue3-carousel`                                     | `HPeekCarousel`                              |
| `uplot` + `uplot-vue`                               | `HGraph` — **and two build flags, below**    |

The barrel re-exports everything, so a missing peer dep breaks the barrel
import even if you never use that component. Delete the components you don't
want along with their exports.

**One thing the kit guarantees back to the stylesheet:** a component that
renders as an `<a>` (anything given `to` or `href` — `HBtn`, `HNavCard`,
`HDrawerItem`, `HListRow`, `HProductCard`) never wears a link underline, at
rest or on hover. A host's global `a:hover { text-decoration: underline }` is
(0,1,1) and would otherwise beat both Quasar's `.q-btn` reset and any plain
class here, so each of those components carries its own
`text-decoration: none !important`. Keep it when you edit them: a button is
not a text link, and the underline reads as a different control. Only real
inline text links get one.

## Translating the kit (`labels.ts`)

A handful of strings are ones the kit has to say for itself, because a caller
never passes them — the × on a modal, the copy button on a connection key,
the "Loading" a spinner announces, a stepper's increase/decrease. They ship in
English in `labels.ts`.

The kit must stay copy-pasteable, so nothing in this folder may import a host
app's i18n instance — the copy would then only build in the project it came
from. Instead the kit offers a hook. A host with a translator installs one
once, at boot, before anything renders:

```ts
import { setKitLabelResolver } from "@/components/handy";

setKitLabelResolver((key, fallback) => t(`kit.${key}`, fallback));
```

A host without one installs nothing and gets the English defaults. The
resolver is deliberately not reactive on its own: it is expected to read the
host's locale on every call, so a language change re-renders through the same
path as everything else on screen.

If you add a component that needs a word of its own, put it in `KIT_LABELS`
and read it through `kitLabel()` — never inline the English.

## HGraph

`HGraph` renders one or more point series on a canvas, in either of two modes:

- **Playback** (funscripts) — pass `current-time` and `view-span`; the window
  centers on the playhead, drag scrubs, the **wheel** zooms the span (emits
  `zoom`).
- **Static** (any 2D curve) — pass neither; the graph shows the full data
  extent (or `x-domain`), and the **wheel** zooms the x-domain around the
  cursor (emits `zoom-range` — hand it back as `x-domain`). Zooming out stops
  at the data extent.

**The wheel is only claimed when its zoom has somewhere to land.** HGraph
only reports a zoom, it never applies one — so the wheel zooms exactly when
the page listens for the matching event (`@zoom` in playback mode,
`@zoom-range` in static mode) and `zoomable` isn't off. Over any other graph
a wheel stays what it is everywhere else on the page: scroll. A macOS
trackpad pinch arrives as ctrlKey wheel events, so it zooms through the same
path.

`x-domain` is the caller claiming the window and it wins outright: scrubbing
and playhead-centering stand down while it is set, and the wheel only zooms
it by reporting `zoom-range` back to the caller. A `current-time` **on its
own** still draws the playhead — that is how you get a clock running through
a pinned window.

```vue
<HGraph
  :series="[{ id: 'main', label: 'Stroke', points }]"
  :revision="revision"
  :current-time="currentTime"
  :view-span="15000"
  :selected="selected"
  @seek="t => (currentTime = t)"
  @zoom="s => (viewSpan = s)"
  @select-point="s => (selected = s)"
/>
```

```vue
<HGraph
  :series="[{ id: 'temp', label: 'Temperature', points: samples }]"
  :y-domain="[15, 35]"
  :format-y="v => `${v}°`"
  x-mode="value"
  :height="180"
/>
```

Full prop list: see the `defineProps` block in `HGraph.vue`. Three worth
knowing early: `show-axes="false"` drops both axes and their gridlines for
strips too short to label honestly (under ~100px); `x-mode` picks the timeline
format (`"time"` = m:ss, `"ms"` = raw milliseconds, `"value"` = plain numbers,
and `format-x` overrides all three); and `seekable` / `zoomable` / `selectable`
/ `hoverable` gate each interaction independently.

### Marquee zoom

Middle-drag across the plot — or shift-drag, for trackpads without a middle
button — marks a range and emits `zoom-range(from, to)` on release. The
component only reports the range; what it means is the page's call:

```ts
// playback: re-centre and re-span
function onZoomRange(from: number, to: number) {
  currentTime.value = (from + to) / 2;
  viewSpan.value = to - from;
}

// static: pin the window
function onZoomRange(from: number, to: number) {
  domain.value = [from, to];
}
```

**The gesture only arms when you listen for `zoom-range`.** The component
reports the range and nothing else, so on a graph whose page ignores the event
a marquee would paint a selection band and then drop it — which reads as a
broken zoom rather than an absent feature. `zoomable` can't decide this alone:
it also gates the wheel, and a graph can legitimately want wheel-zoom (handled
through `zoom`) with no marquee. Bind the handler and the gesture appears.

Marquees under 8px are treated as a stray click and ignored. In playback mode
the emitted span is clamped to `min-span` / `max-span` around the marquee's
centre; in static mode the range is handed over untouched, because those
millisecond defaults mean nothing to a chart measured in degrees.

### Editing — drawing a script by hand

`editable` turns the same chart into a shape editor. Click empty canvas to add a
point, drag one to move it, Alt+click to remove one. Nothing is applied: HGraph
reports the gesture and the page writes the array, which is what keeps undo, the
minimum point count and "is this a legal time" in the page's hands.

```vue
<HGraph
  :series="[{ id: 'shape', label: 'Pattern', points }]"
  :revision="revision"
  :x-domain="[0, 1000]"
  :selected="selected"
  x-mode="ms"
  editable
  :edit-snap-x="10"
  :edit-min-x="0"
  @select-point="s => (selected = s)"
  @point-add="onAdd"
  @point-drag="onDrag"
  @point-drag-end="onDragEnd"
  @point-delete="onDelete"
/>
```

| Event            | Payload                   | When                                    |
| ---------------- | ------------------------- | --------------------------------------- |
| `point-add`      | `{seriesId, x, y}`        | click on empty canvas                   |
| `point-drag`     | `{seriesId, index, x, y}` | every frame of a drag                   |
| `point-drag-end` | `{seriesId, index}`       | release — record **one** undo step here |
| `point-delete`   | `{seriesId, index}`       | Alt+click on a point                    |

`edit-series-id` picks the series the gestures act on (default: the first
visible one); its points draw as fatter handles and the canvas takes a
crosshair cursor. `edit-snap-x` / `edit-snap-y` set the grids and
`edit-min-x` / `edit-max-x` the bounds. The grids default by axis — whole units
on a time axis and on a y-domain at least 10 wide, no grid at all below that,
because rounding an axis measured in hours or in a 0–1 ratio to 1 would collapse
every edit onto a handful of values. The bounds default unbounded, so a
funscript editor wants `:edit-min-x="0"`.

Four things the component guarantees so the host doesn't have to:

- A dragged x is **pinned strictly between its neighbours** — one snap step
  clear of each — before it is emitted, so the sorted-unique-x invariant holds
  on every frame and the point under the cursor can never swap for its
  neighbour. Wedged between two adjacent steps, the drag goes vertical-only.
- x is snapped and clamped, y is snapped and clamped into `y-domain`, before
  either reaches you. Write the numbers as given.
- A press that travelled, or a release outside the plot, is **not** an add. A
  slipped tap must not drop a point.
- The drag is committed even when the browser steals the pointer
  (`lostpointercapture`), so your undo stack never holds an uncommitted edit.

Two things the host owns:

- **Pin the window.** An editable graph with no `x-domain` sizes itself to its
  data, so adding a point near the right edge widens the window, which moves
  every pixel under the cursor — the point runs away from the pointer. If the
  window must follow the shape, latch it: refit on discrete changes (add,
  remove, release) and hold it still during a drag.
- **A taken x is your call.** `point-add` fires with the snapped x whether or
  not a point already sits there; `insertionAt()` in `graph-edit.ts` tells you
  which it is. Selecting the occupant reads better than replacing it — a click
  on empty canvas that moved an existing point is nobody's mental model.

The chart itself is not a tab stop. Wrap it in a focusable region — `tabindex="0"`,
`role="application"` on the chart wrapper only, an `aria-label` naming the point
count and the gestures — and give it a `keydown` handler: Delete removes, the
arrows nudge the selection through `clampDragX`, Escape clears it. Alt+click has
no keyboard equivalent and no touch equivalent either, so add and remove also
need buttons outside the canvas. `/showcase/graphs` does all of that, and is the
reference implementation.

Two gesture rules worth knowing. While `editable` is on the primary button
belongs to the points, so shift-drag no longer starts a marquee (middle-drag
still does), and a click on empty canvas is an add rather than a deselect — a
host that needs `select-point(null)` should clear the selection itself. And
`touch-action: none` means a finger on an editable plot edits instead of
scrolling the page: give an editable stage a bounded height and keep scrollable
page around it.

The pure point maths — `snapTo`, `clampDragX`, `clampToDomain`, `insertionAt`,
`indexAtOrBefore`, `indexOfX` — lives in `graph-edit.ts` and is unit-tested
without a DOM (`test/graph-edit.spec.ts`). Reuse it in the host's own handlers.

### Build flags (both fail silently or cryptically)

In a Quasar app, add to `quasar.config.ts` under `build`:

```ts
// uplot-vue is an Options-API component; app-vite builds Vue with
// __VUE_OPTIONS_API__ = false unless this is set, which silently strips the
// wrapper's data/methods/mounted — you get an empty chart and no error.
vueOptionsAPI: true,

extendViteConf(viteConf) {
  // uplot-vue is a UMD bundle whose require("uplot") interop receives the ESM
  // namespace instead of the uPlot class ("uPlot is not a constructor").
  // Exact-match regex — "uplot/dist/uPlot.min.css" must stay untouched.
  viteConf.resolve ??= {};
  const alias = viteConf.resolve.alias ?? {};
  const uplotCjs = { find: /^uplot$/, replacement: "uplot/dist/uPlot.cjs.js" };
  viteConf.resolve.alias = Array.isArray(alias)
    ? [...alias, uplotCjs]
    : [
        ...Object.entries(alias).map(([find, replacement]) => ({ find, replacement })),
        uplotCjs
      ];
},
```

In a plain Vite app only the alias is needed (`resolve.alias` in
`vite.config.ts`); the Options API is on by default there.

Symptom → cause: empty chart, no console error = `vueOptionsAPI` missing.
`uPlot is not a constructor` = the alias is missing.

### Performance contract

Point arrays are treated as immutable snapshots and are never deep-watched.
For large scripts:

1. `markRaw` the array so Vue doesn't proxy 20k objects.
2. Mutate in place, then bump the `revision` prop — that's the redraw signal.
3. Keep points **sorted ascending on x with unique x**. Window slicing and hit
   testing are binary searches; unsorted input silently drops data.
   `funscriptToPoints()` in `graph-funscript.ts` enforces this on load.

Every update funnels into one rAF-batched pass that slices the visible window
and decimates to ~2 points per pixel column, so cost is independent of script
length.

### Colours

Series colours are optional. Omitted, a series takes its slot in the
design.md §7.3 chart ramp — hero Brand Blue, then Dark Charcoal → Slate Gray →
Divider Gray (a white-opacity ladder on dark). Slots are assigned by position
in the `series` array and stay put when a series is hidden.

That ramp is an **emphasis ladder, not a set of equal hues**: one series is the
point and the rest are context. Two consequences:

- Any chart with more than one series needs a legend or direct labels next to
  it. `HGraph` ships neither — components emit, pages decide.
- Past four series the ramp repeats. Fold the tail into an "other" series, or
  facet into small multiples.

Canvas can't read CSS custom properties, so `graph-theme.ts` resolves the
tokens off the graph's own host element at mount and re-reads them when
`data-theme` flips — which is also why a graph inside a `.section-dark` island
on a light page gets the dark ramp. Override any of them per instance with the
`theme` prop.

## HPlayhead

The current-position marker for a strip that stands for time — a heatmap, a
waveform, a filmstrip. It is the M3 slider handle borrowed out of the slider:
a skinny rounded bar in a gap cut through whatever is behind it, slimming
while dragged (the same `scaleX(0.55)` press state `app.scss` gives
`.q-slider`), with the value on a label beside it.

It replaces the hairline rule most canvas strips draw. A rule competes with
the picture at every pixel, carries no state — you can't tell it is
draggable — and says nothing about how far in you are. The three parts answer
those in turn: the surface-coloured **gap** detaches the handle from the field
so it survives any colour behind it, the **press-slim** confirms the grab, and
the **ahead-wash** splits the strip into played and not-played.

```vue
<div class="strip">
  <canvas ref="canvas" />
  <HPlayhead
    :value="currentTime"
    :max="duration"
    :label="clock"
    aria-label="Playhead"
    interactive
    @seek="t => seek(t)"
  />
</div>
```

```scss
.strip {
  position: relative; // HPlayhead fills its parent
  overflow: hidden; // so the handle clips to the strip's own radius
}
```

`interactive` makes it a real scrubber: the **whole strip** takes the gesture,
not just the handle, and it becomes a proper keyboard slider — `role="slider"`
with live `aria-valuenow`, arrows step, PageUp/Down jump, Home/End go to the
ends. A canvas has no keyboard story of its own, which is half the reason this
is a component rather than four lines of CSS in each host. Left off, it is a
pure indicator and stops taking pointer events entirely, so it can't steal the
host's own gestures.

Nothing moves on its own: `seek` reports where the scrub asked to go and the
host writes `value` back. `pan("start" | "end")` brackets a drag, same shape
`HLabeledSlider` uses.

| Custom property          | Default                     | What it paints             |
| ------------------------ | --------------------------- | -------------------------- |
| `--h-playhead-color`     | `--color-feedback-negative` | the handle and its label   |
| `--h-playhead-surface`   | `--h-slider-gap`            | the gap and the ahead-wash |
| `--h-playhead-width`     | `4px`                       | handle thickness           |
| `--h-playhead-gap-width` | `3px`                       | the cut either side of it  |
| `--h-playhead-inset`     | `2px`                       | top/bottom inset           |

The colour default is deliberate: it is the same token `graph-theme.ts` gives
`HGraph`'s playhead, so a chart and the strip under it read as one instrument
rather than two. The surface default follows the slider's own gap token, which
`app.scss` re-declares per scope — set `--h-playhead-surface` on the strip when
its background isn't the page's (a heatmap on `--color-bg-page-alt` sets it to
that).

`dim-ahead` (default `0.22`, `0` disables) is the wash. It is the part that
answers "how far in am I" at a glance; turn it down on a strip whose data
matters uniformly across its whole width.

## HSliderMenu

A slider that costs one line of chrome instead of three: an icon, the live
value, a caret — and the whole labeled slider only once you ask for it.

For the knob a workspace needs _reachable_ but not _present_. A zoom level, a
row height, a gain: the value matters when you go looking for it and is noise
the rest of the time, so a permanently-open track spends a full row of a panel
on something touched twice a session.

```vue
<HSliderMenu
  v-model="viewSpanSeconds"
  label="View window"
  icon="zoom_in"
  :min="1"
  :max="120"
  unit="s"
  :reset="10"
  :presets="[2, 5, 10, 30, 60]"
/>
```

It is `HLabeledSlider` inside a `q-menu`, not a second slider: the number is
still click-to-type, the label still resets, `change` still fires on release.
The presets are the addition — the two or three spans anyone actually wants,
one click each; picking one commits and closes.

`format-value` overrides the button's text for a value whose useful form isn't
`${value}${unit}` — it is forwarded into the slider inside the menu too, so
the closed button and the open panel can never disagree about the value. Both
readouts otherwise go through the same filter (`slider-format.ts`), which
rounds the DISPLAY to the precision the control can hold: a value that has
round-tripped through another unit prints `3.5`, not `3.5000000000000004`.
`scale="log"` is passed straight through to the slider. The default slot drops
extra content into the menu under the presets (a hint line, a second control);
a `#tooltip` slot takes a `q-tooltip` for the resting button.

**Not for** a slider someone drags repeatedly while watching the result — a
live mix, the fat sliders on the device page. A gesture behind a menu can't be
repeated quickly, and the menu covers the thing being watched. Those stay open
on the surface.

## HHelpTip

A "?" for one control, placed after that control's own label. Hover previews,
**click pins** — and pinned it is a real element: scrollable, selectable,
dismissed by Esc, a click outside, or the ? again.

The pin is not a flourish. Quasar renders `q-tooltip` content with
`no-pointer-events`, and its position engine caps the tooltip's height at the
gap between the anchor and the window edge — so a tip longer than that gap
grows a scrollbar the mouse cannot touch, and would die on `mouseleave` even
if it could. The popup therefore has to be a `q-menu`, dressed to behave like
a tooltip until it is pinned. `usePinnableTip` holds that logic and is
exported on its own for anything else needing the same two states.

```vue
<HHelpTip
  title="Ramp time"
  text="How long the device takes to reach the speed you asked for."
  detail="A longer ramp is gentler but slower to respond."
  note="Turn it down if changes feel like they land late."
/>
```

`HLabeledSlider` and `HToggleRow` take the same three parts as
`help` / `help-detail` / `help-note` props and render the ? in the right
place themselves — prefer those over placing an `HHelpTip` by hand.

**If the ? sits inside something clickable**, the click must not reach it:
the component already uses `@click.stop`, but a custom placement must do the
same, or pinning a tip also flips the setting it explains.

Every paragraph is mirrored onto the button's accessible name, because a
popup that only appears on hover reaches nobody navigating by keyboard.

## HHoldBtn

One button, two commitments: a tap fires the light action, a press held past
`holdMs` (default 500 ms) fires the heavy one. While pressed, the icon winds
up one full turn timed to exactly the hold window — the rotation IS the hold
progress, and it's the whole affordance: anyone who presses the button sees
that pressing longer means something. Released early, it springs back.

The canonical use is refresh-vs-poll on a live-data card; the mechanic also
covers hold-to-confirm (`hold-only`), hold to arm a mode, hold for
"apply-to-all". The component never owns state — it emits, the caller
decides:

```vue
<!-- toggle case: v-model:active is all you need -->
<HHoldBtn
  v-model:active="polling"
  :busy="reading"
  icon="refresh"
  active-icon="autorenew"
  tap-hint="Tap to refresh"
  hold-hint="hold to poll every second"
  active-hint="Polling — hold to stop"
  @tap="readOnce"
/>

<!-- one-shot hold-to-confirm: no `active`, taps do nothing -->
<HHoldBtn
  hold-only
  variant="danger"
  :round="false"
  label="Hold to delete"
  icon="delete_forever"
  :hold-ms="1000"
  hold-hint="Hold for one second to delete"
  @hold="deleteThing"
/>
```

- **Events** — `@tap` (light), `@hold` (heavy), `update:active` (`!active` on
  every completed hold). One gesture, one event: the trailing click after a
  completed hold is swallowed; a pointer that wanders off cancels the gesture;
  the touch long-press context menu is suppressed.
- **States** — `busy` = tap action in flight (quick spin); `active` = the
  hold-toggled state (accent tint + slow spin). Binding `active` at all marks
  the button as a toggle (`aria-pressed`); leave it unbound for one-shot
  holds.
- **Hints** — `tapHint` + `holdHint` compose the tooltip and aria-label;
  `activeHint` replaces them while active; `hint` overrides everything;
  `#tooltip` slot for markup; `:tooltip="false"` to bring your own. On a
  labeled button the hint is appended AFTER the visible label in the
  accessible name (WCAG 2.5.3). Give sibling instances distinct hints —
  five buttons named "Tap to refresh" read as one button to a screen
  reader.
- **Appearance** — defaults to the icon-only card action (tertiary/sm/round);
  all HBtn knobs pass through (`variant`, `size`, `label`, `round`).
  `activeColor`, `activeSpinMs`, `busySpinMs`, `spinWhileActive`,
  `spinWhileBusy`, `windUp` tune or disable each motion. Everything respects
  `prefers-reduced-motion`.
- **Keyboard** — Space mirrors the pointer (its click fires on keyup, so
  holds work); Enter is always a tap; blur cancels a hold in flight. The
  tooltip shows on hover only — keyboard and screen-reader users get the
  same text through the aria-label.

**Not for** actions that need a rapid tap-tap-tap (the wind-up reads as lag
there — use a plain `HBtn`), or as the ONLY path to an essential action:
assistive-tech activation is an instantaneous click that can reach the tap
but never the hold (`aria-pressed` still reports the toggle state
truthfully). Pair the hold with a visible alternative — a menu item, a
settings row — when the heavy action matters.
