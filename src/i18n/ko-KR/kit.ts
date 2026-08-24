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
  close: "닫기",
  loading: "불러오는 중",

  // HLabeledSlider builds seven internal aria labels around the slider's own
  // name ("Reset image speed"). It can't assemble them from pieces — English
  // word order isn't Norwegian's — so it takes each finished name as a prop
  // and this is where they're written.
  slider: {
    reset: "{label} 초기화",
    value: "{label} 값",
    editValue: "{label} 값 편집",
    min: "{label} 최솟값",
    editMin: "{label} 최솟값 편집",
    max: "{label} 최댓값",
    editMax: "{label} 최댓값 편집"
  }
};

export default kit;
