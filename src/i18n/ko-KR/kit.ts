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
  close: "닫기",
  copy: "복사",
  copyKey: "키 복사",
  dismiss: "닫기",
  readFullText: "전체 내용 읽기",
  loading: "불러오는 중",
  recommended: "추천",
  expert: "전문가용",

  tipLocked: "고정됨 — Esc 키를 누르거나 바깥쪽을 클릭하면 닫혀요",
  tipLockedTouch: "고정됨 — 바깥쪽을 탭하면 닫혀요",

  increase: "{label} 늘리기",
  decrease: "{label} 줄이기",
  value: "값",

  // HLabeledSlider builds seven internal aria labels around the slider's own
  // name ("Reset image speed"). It can't assemble them from pieces — English
  // word order isn't Norwegian's — so it takes each finished name as a prop
  // and this is where they're written.
  sliderReset: "{label} 초기화",
  sliderValue: "{label} 값",
  sliderEditValue: "{label} 값 편집",
  sliderMin: "{label} 최솟값",
  sliderEditMin: "{label} 최솟값 편집",
  sliderMax: "{label} 최댓값",
  sliderEditMax: "{label} 최댓값 편집",

  sliderMenuValue: "{label}: {value}",

  yes: "예",
  no: "아니요",

  themeToLight: "라이트 모드로 전환",
  themeToDark: "다크 모드로 전환",
  themeLight: "라이트 모드",
  themeDark: "다크 모드",

  connected: "연결됨",
  connecting: "연결 중",
  offline: "오프라인"
};

export default kit;
