// The kit's own words — the handful of strings its components have to say for
// themselves, rather than take as a prop.
//
// They are almost all accessible names: the X on a modal, the copy button on a
// connection key, the "Loading" a spinner announces. A caller never passes
// them, so the component has to hold one — and a component that holds an
// English string is a component that cannot be used in a Norwegian app.
//
// The way out has to keep the kit PORTABLE. handy/ is copied between projects
// from brand-ux, and importing a host app's i18n instance into it would mean
// the copy only builds in the app it was copied from. So the kit ships English
// and offers a hook: a host with a translator installs one at boot, and a host
// without one gets the defaults and never knows this file exists.

export const KIT_LABELS = {
  close: "Close",
  copy: "Copy",
  copyKey: "Copy key",
  dismiss: "Dismiss",
  readFullText: "Read the full text",
  loading: "Loading",
  recommended: "Recommended",
  /** The footer of a help tip, in each of its two states. */
  tipPin: "Click to pin, then scroll",
  tipClose: "Esc or click outside to close",
  /** `{label}` is the control's own name, or `value` when it has none. */
  increase: "Increase {label}",
  decrease: "Decrease {label}",
  value: "value",
  /**
   * A labelled slider names its own parts around the name it was given —
   * "Reset image speed", "image speed maximum value". They are whole
   * sentences rather than a stem plus a fragment on purpose: "Reset {label}"
   * is English word order, and a language that puts the verb last cannot be
   * served by concatenating pieces in this order.
   *
   * The min/max pairs only render on a range slider; a single-value slider
   * never asks for them.
   */
  sliderReset: "Reset {label}",
  sliderValue: "{label} value",
  sliderEditValue: "Edit {label} value",
  sliderMin: "{label} minimum value",
  sliderEditMin: "Edit {label} minimum",
  sliderMax: "{label} maximum value",
  sliderEditMax: "Edit {label} maximum",
  /**
   * A slider menu's button announces the control and its current reading
   * together — two slots, so it takes `kitLabelWith` rather than
   * `kitLabelFor`.
   */
  sliderMenuValue: "{label}: {value}",
  /** How an info card renders a boolean row when the caller names neither side. */
  yes: "Yes",
  no: "No",
  /**
   * The theme toggle names the state it moves TO, not the one it is in:
   * `themeToLight` is what the button announces *while dark mode is on*,
   * because pressing it goes back to light. Getting this backwards is the
   * standard way a theme toggle ships a wrong screen-reader announcement.
   */
  themeToLight: "Switch to light mode",
  themeToDark: "Switch to dark mode",
  themeLight: "Light mode",
  themeDark: "Dark mode"
} as const;

export type KitLabel = keyof typeof KIT_LABELS;

/** What a host installs to translate them. `fallback` is the English above. */
export type KitLabelResolver = (key: KitLabel, fallback: string) => string;

const ENGLISH: KitLabelResolver = (_key, fallback) => fallback;

let resolve: KitLabelResolver = ENGLISH;

/**
 * Point the kit at a translator. Call once, at boot, before anything renders.
 *
 * Deliberately not reactive on its own: the resolver is expected to read the
 * host's locale each time it is called, so a component that re-renders on a
 * language change picks the new words up through the same path as everything
 * else on screen.
 */
export function setKitLabelResolver(next: KitLabelResolver): void {
  resolve = next;
}

/** One of the kit's words, translated if the host offered a way to. */
export function kitLabel(key: KitLabel): string {
  return resolve(key, KIT_LABELS[key]);
}

/** The labels that compose around the name of the control they belong to. */
export type KitLabelWithLabel =
  | "increase"
  | "decrease"
  | "sliderReset"
  | "sliderValue"
  | "sliderEditValue"
  | "sliderMin"
  | "sliderEditMin"
  | "sliderMax"
  | "sliderEditMax";

/** One of those, with the control's name filled in. */
export function kitLabelFor(key: KitLabelWithLabel, label: string): string {
  return kitLabel(key).replace("{label}", label || kitLabel("value"));
}

/**
 * One of the kit's words with every `{slot}` filled in — for the few labels
 * that carry more than the control's own name. An unfilled slot is left as
 * it is rather than blanked, so a half-translated string shows what it is
 * missing instead of quietly losing it.
 */
export function kitLabelWith(
  key: KitLabel,
  vars: Record<string, string>
): string {
  return Object.entries(vars).reduce(
    (text, [slot, value]) => text.replace(`{${slot}}`, value),
    kitLabel(key)
  );
}
