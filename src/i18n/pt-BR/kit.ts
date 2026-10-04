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
  close: "Fechar",
  copy: "Copiar",
  copyKey: "Copiar a chave",
  dismiss: "Dispensar",
  readFullText: "Ler o texto completo",
  loading: "Carregando",
  recommended: "Recomendado",
  expert: "Avançado",

  tipLocked: "Fixado — pressione Esc ou clique fora para fechar",
  tipLockedTouch: "Fixado — toque fora para fechar",

  increase: "Aumentar {label}",
  decrease: "Diminuir {label}",
  value: "valor",

  // HLabeledSlider builds seven internal aria labels around the slider's own
  // name ("Reset image speed"). It can't assemble them from pieces — English
  // word order isn't Norwegian's — so it takes each finished name as a prop
  // and this is where they're written.
  sliderReset: "Redefinir {label}",
  sliderValue: "Valor de {label}",
  sliderEditValue: "Editar o valor de {label}",
  sliderMin: "Valor mínimo de {label}",
  sliderEditMin: "Editar o mínimo de {label}",
  sliderMax: "Valor máximo de {label}",
  sliderEditMax: "Editar o máximo de {label}",

  sliderMenuValue: "{label}: {value}",

  yes: "Sim",
  no: "Não",

  themeToLight: "Mudar para o modo claro",
  themeToDark: "Mudar para o modo escuro",
  themeLight: "Modo claro",
  themeDark: "Modo escuro",

  // "Offline" is the word this locale already uses for the device (settings.ts)
  connected: "Conectado",
  connecting: "Conectando",
  offline: "Offline"
};

export default kit;
