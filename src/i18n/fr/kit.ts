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
  close: "Fermer",
  copy: "Copier",
  copyKey: "Copier la clé",
  dismiss: "Masquer",
  readFullText: "Lire le texte en entier",
  loading: "Chargement",
  recommended: "Recommandé",
  expert: "Pour experts",

  // "Épinglé", not "Verrouillé": the tip is held open, not locked away.
  // "Échap" is what a French keyboard prints on the Esc key.
  tipLocked: "Épinglé — appuie sur Échap ou clique ailleurs pour fermer",
  tipLockedTouch: "Épinglé — touche ailleurs pour fermer",

  // Same "{label} : …" shape as the slider labels below, so the label never
  // needs an article or an agreement.
  increase: "{label} : augmenter",
  decrease: "{label} : diminuer",
  value: "valeur",

  // HLabeledSlider builds seven internal aria labels around the slider's own
  // name ("Reset image speed"). It can't assemble them from pieces — English
  // word order isn't Norwegian's — so it takes each finished name as a prop
  // and this is where they're written.
  sliderReset: "Réinitialiser {label}",
  sliderValue: "{label} : valeur",
  sliderEditValue: "{label} : modifier la valeur",
  sliderMin: "{label} : valeur minimale",
  sliderEditMin: "{label} : modifier le minimum",
  sliderMax: "{label} : valeur maximale",
  sliderEditMax: "{label} : modifier le maximum",

  sliderMenuValue: "{label} : {value}",

  yes: "Oui",
  no: "Non",

  themeToLight: "Passer en mode clair",
  themeToDark: "Passer en mode sombre",
  themeLight: "Mode clair",
  themeDark: "Mode sombre",

  connected: "Connecté",
  connecting: "Connexion en cours",
  offline: "Hors ligne"
};

export default kit;
