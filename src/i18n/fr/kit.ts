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
  close: "Fermer",
  loading: "Chargement",

  // HLabeledSlider builds seven internal aria labels around the slider's own
  // name ("Reset image speed"). It can't assemble them from pieces — English
  // word order isn't Norwegian's — so it takes each finished name as a prop
  // and this is where they're written.
  sliderReset: "Réinitialiser {label}",
  sliderValue: "{label} : valeur",
  sliderEditValue: "{label} : modifier la valeur",
  sliderMin: "{label} : valeur minimale",
  sliderEditMin: "{label} : modifier le minimum",
  sliderMax: "{label} : valeur maximale",
  sliderEditMax: "{label} : modifier le maximum"
};

export default kit;
