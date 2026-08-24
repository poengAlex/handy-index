// Strings that live *inside* the brand kit (components/handy). ARCHITECTURE.md
// forbids forking the kit, so those components didn't gain an i18n import —
// they gained optional label props defaulting to the English they used to
// hardcode. That keeps the folder portable (drop it in any app and it still
// reads correctly) while letting this app hand them a translation.
//
// Only the components this app actually renders have keys here; the rest keep
// their English defaults until something uses them.
export default {
  close: "Close",
  loading: "Loading",

  // HLabeledSlider builds seven internal aria labels around the slider's own
  // name ("Reset image speed"). It can't assemble them from pieces — English
  // word order isn't Norwegian's — so it takes each finished name as a prop
  // and this is where they're written.
  slider: {
    reset: "Reset {label}",
    value: "{label} value",
    editValue: "Edit {label} value",
    min: "{label} minimum value",
    editMin: "Edit {label} minimum",
    max: "{label} maximum value",
    editMax: "Edit {label} maximum"
  }
};
