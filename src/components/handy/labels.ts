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
  /** Marks a control a casual user should leave alone (HSectionCard). */
  expert: "Expert",
  /**
   * The foot of a help tip, printed only while it is LOCKED. Nothing
   * advertises that a click would lock one: a hint for a state the reader is
   * not in yet costs a line on the surface with the fewest to spare. Locked
   * is different — the sheet now outlives the cursor, and the way back out is
   * the part that stopped being guessable.
   */
  tipLocked: "Locked. Press Esc or click outside to close.",
  /** The same line where there is no Esc key and nothing to click with. */
  tipLockedTouch: "Locked. Tap outside to close.",
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
  themeDark: "Dark mode",
  /**
   * What a connection dot calls itself when it is a BUTTON and the caller
   * named no other purpose for it. An icon-only button has to say something,
   * and the state it is showing is the honest thing for it to say — a caller
   * whose button does something more specific ("Reconnect") passes `label`.
   */
  connected: "Connected",
  connecting: "Connecting",
  offline: "Offline",
  /**
   * What an interactive playhead calls itself when the caller names nothing
   * more specific. A caller should: "Video position" says what is being
   * scrubbed, and this only says what the control is.
   */
  playhead: "Playhead",
  /**
   * A peek carousel's arrows: their accessible names and their tooltips.
   * The words are vue3-carousel's own, so an app without a translator reads
   * what it always did.
   */
  carouselPrevious: "Navigate to previous slide",
  carouselNext: "Navigate to next slide",
  /**
   * A file button's label when the page gives none: one file, several, or a
   * folder (HFileBtn). Pages usually say their own verb ("Add files").
   */
  chooseFile: "Choose file",
  chooseFiles: "Choose files",
  chooseFolder: "Choose folder",
  /** The drop overlay's title when the page gives none (HDropOverlay). */
  dropToOpen: "Drop to open",
  /**
   * A drop zone's title when the page gives none (HDropZone): what a pointer
   * can do there, and the one thing a touch screen can.
   */
  dropZone: "Drop files here, or click to choose",
  dropZoneTouch: "Tap to choose files",
  /** A drop zone's title while files are dragged over the window. */
  dropHere: "Drop here",
  /**
   * The accessible name of a file row's remove button. `{label}` is the
   * file's name: the row's own label, so it takes `kitLabelFor` like the
   * stepper's buttons, and a vue-i18n host needs no new slot for it.
   */
  removeFile: "Remove {label}"
} as const;

export type KitLabel = keyof typeof KIT_LABELS;

/**
 * What a host installs to translate them. `fallback` is the English above.
 * Return `{label}` and `{value}` untouched: the kit fills them in after the
 * resolver returns (a vue-i18n `t()` called without them blanks them).
 */
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
  | "sliderEditMax"
  | "removeFile";

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
