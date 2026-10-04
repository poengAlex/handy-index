// The kit's runtime setup — what a host app runs once, at boot, before
// anything renders:
//
//   import { defineBoot } from "#q-app";
//   import { installHandyKit } from "@/components/handy/install";
//   export default defineBoot(() => installHandyKit({ labels }));
//
// Everything here configures Quasar globally (the icon map, slider prop
// defaults, the toast position) or the kit itself (its label translator).
// The global CSS it pairs with is styles/kit.scss; the build fixes are vite.ts.

import { IconSet, Notify, QRange, QSlider, Screen } from "quasar";
import { watchEffect } from "vue";

import { setKitLabelResolver, type KitLabelResolver } from "./labels";

export interface HandyKitOptions {
  /** Translator for the kit's own strings; see labels.ts. */
  labels?: KitLabelResolver;
}

// DESIGN.md §12 — Material Symbols Outlined is the canonical set, forced
// globally. Code uses plain icon names ("home", icon: "bluetooth"); this
// map function rewrites every resolved name to its sym_o_ variant, so an
// off-set icon can't slip in anywhere. It lives on the IconSet plugin at
// runtime (a function can't sit in the serializable quasar.config), and
// because Quasar's own internal icons (dropdown arrows, chip close, …)
// resolve through the same path, they restyle too.
//
// Left alone: names that already target another set — a `:` (img:, svguse:)
// or a `-` (mdi-, fa-, …) — and the explicit Material families (o_, r_, s_,
// sym_). So is anything that is not a plain ligature name (an SVG path
// string, a class list): no Material Symbol is spelled that way.
const PLAIN_LIGATURE = /^[a-z0-9_]+$/;
const PREFIXED = /^(o_|r_|s_|sym_)/;

export function mapIconName(iconName: string): { icon: string } | undefined {
  if (!iconName || iconName.includes(":") || iconName.includes("-")) {
    return undefined;
  }
  if (PREFIXED.test(iconName) || !PLAIN_LIGATURE.test(iconName)) {
    return undefined;
  }
  return { icon: `sym_o_${iconName}` };
}

// Brand defaults for Quasar component props that can't be set via SCSS.
// M3 slider geometry: 16px track, narrow handle bar in a 40px touch box.
// The sizes are inline styles computed from props (they also drive thumb
// position math), so prop defaults are the only safe global override.
// Per-instance props still take precedence.
const TRACK_SIZE = "16px";
const THUMB_SIZE = "40px";

// M3 handle: a 4×36px vertical bar (2×18 units in Quasar's 20×20 thumb
// viewBox) — taller than the track, skinny like the M3 spec. The track
// gap either side of it is painted in styles/_quasar.scss (surface-colored
// stroke under the fill).
const THUMB_PATH =
  "M9 2 A1 1 0 0 1 10 1 A1 1 0 0 1 11 2 " +
  "V18 A1 1 0 0 1 10 19 A1 1 0 0 1 9 18 Z";

/**
 * Configure Quasar and the kit. Call once, from a boot file, before anything
 * renders. Needs Quasar's Notify plugin (framework.plugins).
 */
export function installHandyKit(options: HandyKitOptions = {}): void {
  IconSet.iconMapFn = mapIconName;

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

  if (options.labels) setKitLabelResolver(options.labels);
}
