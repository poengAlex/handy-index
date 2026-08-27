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
  close: "閉じる",
  loading: "読み込み中",

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
  sliderEditMax: "{label}の最大値を編集"
};

export default kit;
