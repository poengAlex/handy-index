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
  close: "关闭",
  copy: "复制",
  copyKey: "复制密钥",
  dismiss: "关闭",
  readFullText: "阅读全文",
  loading: "加载中",
  recommended: "推荐",
  expert: "高级",

  tipLocked: "已固定——按 Esc 或点击外部区域关闭",
  tipLockedTouch: "已固定——轻触外部区域关闭",

  increase: "增加{label}",
  decrease: "减少{label}",
  value: "数值",

  // HLabeledSlider builds seven internal aria labels around the slider's own
  // name ("Reset image speed"). It can't assemble them from pieces — English
  // word order isn't Norwegian's — so it takes each finished name as a prop
  // and this is where they're written.
  sliderReset: "重置{label}",
  sliderValue: "{label}数值",
  sliderEditValue: "编辑{label}数值",
  sliderMin: "{label}最小值",
  sliderEditMin: "编辑{label}最小值",
  sliderMax: "{label}最大值",
  sliderEditMax: "编辑{label}最大值",

  sliderMenuValue: "{label}：{value}",

  yes: "是",
  no: "否",

  themeToLight: "切换到浅色模式",
  themeToDark: "切换到深色模式",
  themeLight: "浅色模式",
  themeDark: "深色模式",

  connected: "已连接",
  connecting: "正在连接",
  offline: "离线"
};

export default kit;
