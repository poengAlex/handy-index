// Strings that live *inside* the brand kit (components/handy). ARCHITECTURE.md
// forbids forking the kit, so those components can't import vue-i18n — the
// folder has to keep building in any app it is copied into. Instead the kit
// ships English in its own `labels.ts` and exposes one hook, and this app
// installs a resolver into it at boot (see boot/i18n.ts).
//
// Every key here is a key of the kit's KIT_LABELS table, so the names are the
// kit's, not this app's. This file carries the kit's whole table, so every kit
// component the app may use is already translated; a key the kit adds later
// still falls back to the kit's own English until it is added here.
//
// `{label}` and `{value}` are the KIT's slots, not vue-i18n's — the resolver
// hands them through untouched for the kit to fill in.
export default {
  close: "Close",
  copy: "Copy",
  // the accessible name of the copy button beside a device's connection key
  copyKey: "Copy key",
  dismiss: "Dismiss",
  readFullText: "Read the full text",
  loading: "Loading",
  recommended: "Recommended",
  // HSectionCard's marker on a control a casual user should leave alone
  expert: "Expert",

  // The footer a help tip prints only while it is locked open — the sheet
  // then outlives the cursor, so the line names the ways out: the Esc key or
  // a click for a mouse, a tap for a finger.
  tipLocked: "Locked — Esc or click outside to close",
  tipLockedTouch: "Locked — tap outside to close",

  // HNumberStepper's two buttons. `{label}` is the stepper's own name, or
  // `value` when it has none.
  increase: "Increase {label}",
  decrease: "Decrease {label}",
  value: "value",

  // HLabeledSlider names its seven internal controls around the slider's own
  // title ("Reset image speed"). Each is a whole sentence rather than a stem
  // plus a fragment, because English word order isn't Norwegian's.
  sliderReset: "Reset {label}",
  sliderValue: "{label} value",
  sliderEditValue: "Edit {label} value",
  sliderMin: "{label} minimum value",
  sliderEditMin: "Edit {label} minimum",
  sliderMax: "{label} maximum value",
  sliderEditMax: "Edit {label} maximum",

  // A slider menu's button: the control's name, then its current reading.
  sliderMenuValue: "{label}: {value}",

  // an info card's boolean row, when the caller names neither side
  yes: "Yes",
  no: "No",

  // The theme toggle names the mode it switches TO: `themeToLight` is what
  // it announces while dark mode is on. The short pair is its tooltip.
  themeToLight: "Switch to light mode",
  themeToDark: "Switch to dark mode",
  themeLight: "Light mode",
  themeDark: "Dark mode",

  // What a device-status dot calls itself when it is a button and the caller
  // gave it no other name: the state it is showing.
  connected: "Connected",
  connecting: "Connecting",
  offline: "Offline"
};
