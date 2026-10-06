// The handy design-system kit — one portable unit, synced into other apps
// from brand-ux as a whole folder (`npm run kit`, README.md §1). A host loads
// styles/kit.scss once, calls installHandyKit() at boot and handyViteConfig()
// (vite.ts — Node-only, so not re-exported here) from quasar.config.ts, then
// `import { HBtn, hToast } from "@/components/handy"`.
// Peer deps (kit.json): Quasar (components + Notify plugin for toast.ts, Dark
// plugin for useHandyTheme), vue-router (to-capable components), vue3-carousel
// (HPeekCarousel only), uplot + uplot-vue (HGraph only).

// Actions
export { default as HBtn } from "./HBtn.vue";
export { default as HBtnGroup } from "./HBtnGroup.vue";
export { default as HHoldBtn } from "./HHoldBtn.vue";

// Inputs & controls
export { default as HSegmented } from "./HSegmented.vue";
export { default as HNumberStepper } from "./HNumberStepper.vue";
export { default as HFatSlider } from "./HFatSlider.vue";
export { default as HLabeledSlider } from "./HLabeledSlider.vue";
export { default as HSliderMenu } from "./HSliderMenu.vue";
export { default as HHelpTip } from "./HHelpTip.vue";

// Containers & surfaces
export { default as HInfoCard } from "./HInfoCard.vue";
export { default as HSectionCard } from "./HSectionCard.vue";
export { default as HTextCard } from "./HTextCard.vue";
export { default as HNavCard } from "./HNavCard.vue";
export { default as HProductCard } from "./HProductCard.vue";
export { default as HModal } from "./HModal.vue";
export { default as HList } from "./HList.vue";
export { default as HListRow } from "./HListRow.vue";
export { default as HRadioRow } from "./HRadioRow.vue";
export { default as HToggleRow } from "./HToggleRow.vue";

// Data display
export { default as HTabularNum } from "./HTabularNum.vue";

// Data visualization
export { default as HGraph } from "./HGraph.vue";
export { default as HPlayhead } from "./HPlayhead.vue";
export { decimateMinMax } from "./graph-decimate";
export {
  clampDragX,
  clampToDomain,
  indexAtOrBefore,
  indexOfX,
  insertionAt,
  snapTo,
  type DragXLimits
} from "./graph-edit";
export { resolveGraphTheme, watchGraphTheme } from "./graph-theme";
export {
  funscriptToPoints,
  parseFunscript,
  pointsToFunscript,
  serializeFunscript,
  type Funscript,
  type FunscriptAction
} from "./graph-funscript";
export type {
  GraphMarker,
  GraphPoint,
  GraphRegion,
  GraphSeries,
  GraphTheme,
  PointEdit,
  SelectedPointRef
} from "./graph-types";

// Feedback & status
export { default as HFeedbackCard } from "./HFeedbackCard.vue";
export { default as HStatusBadge } from "./HStatusBadge.vue";
export { default as HEmptyState } from "./HEmptyState.vue";
export { default as HSuccessMoment } from "./HSuccessMoment.vue";
export { default as HSuccessMark } from "./HSuccessMark.vue";
export { default as HInlineDots } from "./HInlineDots.vue";
export { default as HandyLoader } from "./HandyLoader.vue";
export { default as HCircleProgress } from "./HCircleProgress.vue";

// Navigation & chrome
export { default as HDrawerItem } from "./HDrawerItem.vue";
export { default as HThemeToggle } from "./HThemeToggle.vue";

// Brand
export { default as HLogo } from "./HLogo.vue";
export { default as HConnectedDot } from "./HConnectedDot.vue";
export { default as HConnectionKey } from "./HConnectionKey.vue";
export { default as HChip } from "./HChip.vue";
export { default as HIconTile } from "./HIconTile.vue";
export { default as HFeaturePoint } from "./HFeaturePoint.vue";
export { default as HPeekCarousel } from "./HPeekCarousel.vue";

// Types (per-component types live in their SFCs — import from the file:
// `import { type InfoItem } from "@/components/handy/HInfoCard.vue"`)
export type { HLogoVariant } from "./handy-logo-art";

// Background — a self-contained sub-kit. It is the one part of this folder
// with NO Quasar dependency at all (only "vue"), and it keeps its own
// index.ts and README, so `src/components/handy/background/` can still be
// copied on its own into a project that wants the background and none of
// the rest. Re-exported here so the kit has one front door.
export {
  HandyBackground,
  scene,
  scenes,
  sceneSettings,
  erinSettings,
  handySettings,
  type Scene,
  type SceneId
} from "./background";

// Utils & composables
export {
  hToast,
  hNotify,
  type ToastSeverity,
  type ToastOptions
} from "./toast";
export { generateKey, sanitizeKey, KEY_MAX_LENGTH } from "./keys";
export {
  H_SCROLL_BAR_STYLE,
  H_SCROLL_BAR_STYLE_HORIZONTAL,
  H_SCROLL_THUMB_STYLE,
  H_SCROLL_THUMB_STYLE_HORIZONTAL
} from "./scroll";
export {
  kitLabel,
  kitLabelFor,
  kitLabelWith,
  setKitLabelResolver
} from "./labels";
export type { KitLabel, KitLabelResolver, KitLabelWithLabel } from "./labels";
export { formatSliderValue, sliderDecimals } from "./slider-format";
export { useHandyTheme } from "./useHandyTheme";
export { useGlassOnScroll } from "./useGlassOnScroll";
export { usePinnableTip } from "./usePinnableTip";
export { useForwardProgress } from "./useForwardProgress";

// Setup
export { installHandyKit, mapIconName, type HandyKitOptions } from "./install";
