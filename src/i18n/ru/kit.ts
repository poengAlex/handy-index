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
  close: "Закрыть",
  copy: "Копировать",
  copyKey: "Копировать connection key",
  dismiss: "Скрыть",
  readFullText: "Читать текст полностью",
  loading: "Загрузка",
  recommended: "Рекомендуется",
  expert: "Для опытных",

  // "Закреплено", not "Заблокировано": the tip is held open, not locked.
  tipLocked: "Закреплено — чтобы закрыть, нажми Esc или щёлкни вне подсказки",
  tipLockedTouch: "Закреплено — чтобы закрыть, коснись вне подсказки",

  // Same "{label}: …" shape as the slider labels below, so the label stays
  // in the nominative.
  increase: "{label}: увеличить",
  decrease: "{label}: уменьшить",
  value: "значение",

  // HLabeledSlider builds seven internal aria labels around the slider's own
  // name ("Reset image speed"). It can't assemble them from pieces — English
  // word order isn't Norwegian's — so it takes each finished name as a prop
  // and this is where they're written.
  sliderReset: "{label}: сбросить",
  sliderValue: "{label}: значение",
  sliderEditValue: "{label}: изменить значение",
  sliderMin: "{label}: минимальное значение",
  sliderEditMin: "{label}: изменить минимум",
  sliderMax: "{label}: максимальное значение",
  sliderEditMax: "{label}: изменить максимум",

  sliderMenuValue: "{label}: {value}",

  yes: "Да",
  no: "Нет",

  // "тема", not "режим": the settings toggle already says "Тёмная тема".
  themeToLight: "Включить светлую тему",
  themeToDark: "Включить тёмную тему",
  themeLight: "Светлая тема",
  themeDark: "Тёмная тема",

  // neuter, agreeing with the "устройство" the dot stands for
  connected: "Подключено",
  connecting: "Подключение",
  offline: "Не в сети"
};

export default kit;
