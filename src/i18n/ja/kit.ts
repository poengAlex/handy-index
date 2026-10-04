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
  close: "閉じる",
  copy: "コピー",
  copyKey: "キーをコピー",
  dismiss: "閉じる",
  readFullText: "全文を読む",
  loading: "読み込み中",
  recommended: "おすすめ",
  expert: "上級者向け",

  tipLocked: "固定中 — Escキーまたは外側のクリックで閉じます",
  tipLockedTouch: "固定中 — 外側のタップで閉じます",

  increase: "{label}を増やす",
  decrease: "{label}を減らす",
  value: "値",

  // HLabeledSlider builds seven internal aria labels around the slider's own
  // name ("Reset image speed"). It can't assemble them from pieces — English
  // word order isn't Norwegian's — so it takes each finished name as a prop
  // and this is where they're written.
  sliderReset: "{label}をリセット",
  sliderValue: "{label}の値",
  sliderEditValue: "{label}の値を編集",
  sliderMin: "{label}の最小値",
  sliderEditMin: "{label}の最小値を編集",
  sliderMax: "{label}の最大値",
  sliderEditMax: "{label}の最大値を編集",

  sliderMenuValue: "{label}：{value}",

  yes: "はい",
  no: "いいえ",

  themeToLight: "ライトモードに切り替え",
  themeToDark: "ダークモードに切り替え",
  themeLight: "ライトモード",
  themeDark: "ダークモード",

  // 接続済み/接続中 is the usual connected/connecting pair in Japanese UI.
  connected: "接続済み",
  connecting: "接続中",
  offline: "オフライン"
};

export default kit;
