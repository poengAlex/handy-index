import type enUS from "../en-US/kit";

// Strings that live *inside* the brand kit (components/handy). ARCHITECTURE.md
// forbids forking the kit, so those components didn't gain an i18n import —
// they gained optional label props defaulting to the English they used to
// hardcode. That keeps the folder portable (drop it in any app and it still
// reads correctly) while letting this app hand them a translation.
//
// Only the components this app actually renders have keys here; the rest keep
// their English defaults until something uses them.
const kit: typeof enUS = {
  close: "Schließen",
  loading: "Wird geladen",

  // HLabeledSlider builds seven internal aria labels around the slider's own
  // name ("Reset image speed"). It can't assemble them from pieces — English
  // word order isn't Norwegian's — so it takes each finished name as a prop
  // and this is where they're written.
  //
  // "… für {label}" in the six value labels: the label arrives capitalized
  // from the slider's own title, and a bare preposition keeps it out of any
  // case ending German would otherwise want on it. `reset` puts the label
  // in front instead, where the bare form is just as safe.
  // "Mindestwert"/"Höchstwert" are a matched pair the way
  // "minimum"/"maximum" are.
  sliderReset: "{label} zurücksetzen",
  sliderValue: "Wert für {label}",
  sliderEditValue: "Wert für {label} ändern",
  sliderMin: "Mindestwert für {label}",
  sliderEditMin: "Mindestwert für {label} ändern",
  sliderMax: "Höchstwert für {label}",
  sliderEditMax: "Höchstwert für {label} ändern"
};

export default kit;
