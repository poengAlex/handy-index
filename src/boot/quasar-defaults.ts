import { Notify, QRange, QSlider, Screen } from "quasar";
import { watchEffect } from "vue";
import { defineBoot } from "#q-app";

// Brand defaults for Quasar component props that can't be set via SCSS.
// M3 slider geometry: 16px track, narrow handle bar in a 40px touch box.
// The sizes are inline styles computed from props (they also drive thumb
// position math), so prop defaults are the only safe global override.
// Per-instance props still take precedence.
const TRACK_SIZE = "16px";
const THUMB_SIZE = "40px";

// M3 handle: a 4×36px vertical bar (2×18 units in Quasar's 20×20 thumb
// viewBox) — taller than the track, skinny like the M3 spec. The track
// gap either side of it is painted in app.scss (surface-colored stroke
// under the fill).
const THUMB_PATH =
  "M9 2 A1 1 0 0 1 10 1 A1 1 0 0 1 11 2 " +
  "V18 A1 1 0 0 1 10 19 A1 1 0 0 1 9 18 Z";

export default defineBoot(() => {
  for (const comp of [QSlider, QRange]) {
    const props = comp.props as Record<
      string,
      { default?: unknown } | undefined
    >;
    if (props.trackSize) props.trackSize.default = TRACK_SIZE;
    if (props.thumbSize) props.thumbSize.default = THUMB_SIZE;
    if (props.thumbPath) props.thumbPath.default = THUMB_PATH;
  }

  // Toast position default: top-right on desktop, bottom on mobile.
  // Screen.lt.md is reactive, so watchEffect re-applies the default when the
  // viewport crosses the breakpoint (setDefaults affects toasts created after
  // the change — individual Notify.create calls can still override position).
  watchEffect(() => {
    Notify.setDefaults({ position: Screen.lt.md ? "bottom" : "top-right" });
  });
});
