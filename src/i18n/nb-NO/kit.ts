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
  sliderReset: "Nullstill {label}",
  sliderValue: "Verdi for {label}",
  sliderEditValue: "Endre verdien for {label}",
  sliderMin: "Laveste verdi for {label}",
  sliderEditMin: "Endre laveste verdi for {label}",
  sliderMax: "Høyeste verdi for {label}",
  sliderEditMax: "Endre høyeste verdi for {label}"
};

export default kit;
