// Strings that live *inside* the brand kit (components/handy). ARCHITECTURE.md
// forbids forking the kit, so those components can't import vue-i18n — the
// folder has to keep building in any app it is copied into. Instead the kit
// ships English in its own `labels.ts` and exposes one hook, and this app
// installs a resolver into it at boot (see boot/i18n.ts).
//
// Every key here is a key of the kit's KIT_LABELS table, so the names are the
// kit's, not this app's. Only the ones this app actually renders need a key;
// anything absent falls back to the kit's own English and never reaches here.
//
// `{label}` and `{value}` are the KIT's slots, not vue-i18n's — the resolver
// hands them through untouched for the kit to fill in.
export default {
  close: "Close",
  loading: "Loading",

  // HLabeledSlider names its seven internal controls around the slider's own
  // title ("Reset image speed"). Each is a whole sentence rather than a stem
  // plus a fragment, because English word order isn't Norwegian's.
  sliderReset: "Reset {label}",
  sliderValue: "{label} value",
  sliderEditValue: "Edit {label} value",
  sliderMin: "{label} minimum value",
  sliderEditMin: "Edit {label} minimum",
  sliderMax: "{label} maximum value",
  sliderEditMax: "Edit {label} maximum"
};
