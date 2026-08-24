import type enUS from "../en-US/kit";

const kit: typeof enUS = {
  close: "Lukk",
  loading: "Laster",

  // The label lands last in every one of these: Norwegian would lowercase a
  // noun mid-sentence, and the label arrives capitalized from the slider's
  // own title. "Verdi for Bildehastighet" reads as a reference to a named
  // control; "Bildehastighet verdi" reads as a translation bug. The two ends
  // of a range are a matched pair — "laveste"/"høyeste", not the lopsided
  // "minsteverdi"/"maksverdi".
  slider: {
    reset: "Nullstill {label}",
    value: "Verdi for {label}",
    editValue: "Endre verdien for {label}",
    min: "Laveste verdi for {label}",
    editMin: "Endre laveste verdi for {label}",
    max: "Høyeste verdi for {label}",
    editMax: "Endre høyeste verdi for {label}"
  }
};

export default kit;
