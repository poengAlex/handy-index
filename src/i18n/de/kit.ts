import type enUS from "../en-US/kit";

// Strings that live *inside* the brand kit (components/handy). ARCHITECTURE.md
// forbids forking the kit, so those components didn't gain an i18n import —
// they gained optional label props defaulting to the English they used to
// hardcode. That keeps the folder portable (drop it in any app and it still
// reads correctly) while letting this app hand them a translation.
//
// It carries the kit's whole label table, so any kit component the app may
// use is already translated; a key the kit adds later keeps its English until
// it is added here.
const kit: typeof enUS = {
  close: "Schließen",
  copy: "Kopieren",
  // `connection key` stays English, as everywhere in this locale
  copyKey: "Connection key kopieren",
  dismiss: "Ausblenden",
  readFullText: "Ganzen Text lesen",
  loading: "Wird geladen",
  recommended: "Empfohlen",
  expert: "Für Experten",

  // "Fixiert", not "Gesperrt": the tip is held open, nothing is locked away.
  tipLocked: "Fixiert — zum Schließen Esc drücken oder außerhalb klicken",
  tipLockedTouch: "Fixiert — zum Schließen außerhalb tippen",

  // Label in front, verb last, the way `reset` does it below. `value` stands
  // in for a missing label, so it is a capitalized noun: "Wert erhöhen".
  increase: "{label} erhöhen",
  decrease: "{label} verringern",
  value: "Wert",

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
  sliderEditMax: "Höchstwert für {label} ändern",

  sliderMenuValue: "{label}: {value}",

  yes: "Ja",
  no: "Nein",

  // "Dunkelmodus" is the settings toggle's word; "Heller Modus" its pair.
  themeToLight: "Zum hellen Modus wechseln",
  themeToDark: "Zum Dunkelmodus wechseln",
  themeLight: "Heller Modus",
  themeDark: "Dunkelmodus",

  // "Nicht verbunden" pairs with "Verbunden", and is how the rest of this
  // locale describes a device that is offline ("ohne Verbindung").
  connected: "Verbunden",
  connecting: "Wird verbunden",
  offline: "Nicht verbunden"
};

export default kit;
