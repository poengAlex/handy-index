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
  close: "Cerrar",
  copy: "Copiar",
  copyKey: "Copiar la connection key",
  dismiss: "Descartar",
  readFullText: "Leer el texto completo",
  loading: "Cargando",
  recommended: "Recomendado",
  expert: "Para expertos",

  tipLocked: "Fijado — pulsa Esc o haz clic fuera para cerrar",
  tipLockedTouch: "Fijado — toca fuera para cerrar",

  increase: "Aumentar {label}",
  decrease: "Disminuir {label}",
  value: "valor",

  // HLabeledSlider builds seven internal aria labels around the slider's own
  // name ("Reset image speed"). It can't assemble them from pieces — English
  // word order isn't Norwegian's — so it takes each finished name as a prop
  // and this is where they're written.
  sliderReset: "Restablecer {label}",
  sliderValue: "Valor de {label}",
  sliderEditValue: "Editar el valor de {label}",
  sliderMin: "Valor mínimo de {label}",
  sliderEditMin: "Editar el mínimo de {label}",
  sliderMax: "Valor máximo de {label}",
  sliderEditMax: "Editar el máximo de {label}",

  sliderMenuValue: "{label}: {value}",

  yes: "Sí",
  no: "No",

  themeToLight: "Cambiar al modo claro",
  themeToDark: "Cambiar al modo oscuro",
  themeLight: "Modo claro",
  themeDark: "Modo oscuro",

  connected: "Conectado",
  connecting: "Conectando",
  offline: "Sin conexión"
};

export default kit;
