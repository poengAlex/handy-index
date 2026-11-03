import type enUS from "../en-US/kit";

const kit: typeof enUS = {
  close: "Lukk",
  copy: "Kopier",
  copyKey: "Kopier connection key",
  dismiss: "Skjul",
  readFullText: "Les hele teksten",
  loading: "Laster",
  recommended: "Anbefalt",
  expert: "Avansert",

  // "Festet", not "Låst": the tip is held open, nothing is locked away.
  tipLocked: "Festet. Trykk Esc eller klikk utenfor for å lukke.",
  tipLockedTouch: "Festet. Trykk utenfor for å lukke.",

  // The label lands last here too, for the reason given below.
  increase: "Øk {label}",
  decrease: "Reduser {label}",
  value: "verdi",

  // The label lands last in every one of these: Norwegian would lowercase a
  // noun mid-sentence, and the label arrives capitalized from the slider's
  // own title. "Verdi for Bildehastighet" reads as a reference to a named
  // control; "Bildehastighet verdi" reads as a translation bug. The two ends
  // of a range are a matched pair — "laveste"/"høyeste", not the lopsided
  // "minsteverdi"/"maksverdi".
  sliderReset: "Nullstill {label}",
  sliderValue: "Verdi for {label}",
  sliderEditValue: "Endre verdien for {label}",
  sliderMin: "Laveste verdi for {label}",
  sliderEditMin: "Endre laveste verdi for {label}",
  sliderMax: "Høyeste verdi for {label}",
  sliderEditMax: "Endre høyeste verdi for {label}",

  sliderMenuValue: "{label}: {value}",

  yes: "Ja",
  no: "Nei",

  themeToLight: "Bytt til lys modus",
  themeToDark: "Bytt til mørk modus",
  themeLight: "Lys modus",
  themeDark: "Mørk modus",

  // "Frakoblet" is this locale's word for an offline device (settings.ts).
  connected: "Tilkoblet",
  bluetooth: "Tilkoblet via Bluetooth",
  connecting: "Kobler til",
  offline: "Frakoblet",
  playhead: "Avspillingshode",
  carouselPrevious: "Gå til forrige lysbilde",
  carouselNext: "Gå til neste lysbilde",
  chooseFile: "Velg fil",
  chooseFiles: "Velg filer",
  chooseFolder: "Velg mappe",
  dropToOpen: "Slipp for å åpne",
  dropZone: "Slipp filer her, eller klikk for å velge",
  dropZoneTouch: "Trykk for å velge filer",
  dropHere: "Slipp her",
  removeFile: "Fjern {label}"
};

export default kit;
