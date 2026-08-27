// The handy design-system kit — one portable unit. To reuse in another
// project, copy this folder plus the token/type-class layer of app.scss
// (the :root/[data-theme] custom properties and the .text-* classes several
// components lean on), then `import { HBtn, hToast } from "@/components/handy"`.
// Peer deps: Quasar (components + Notify plugin for toast.ts, Dark plugin
// for useHandyTheme), vue-router (to-capable components), vue3-carousel
// (HPeekCarousel only), uplot + uplot-vue (HGraph only — it also needs two
// build flags; see README.md in this folder before copying it).
//
// NOTE (handy-index): HGraph and its graph-* helpers need uplot + uplot-vue,
// which are not dependencies here; HHoldBtn, HSegmented, HSliderMenu and the
// background sub-kit are simply unused. Those exports are the ONLY things
// removed; everything else is verbatim. Add the deps upstream of a resync if
// this app ever needs graphs. Re-copy from brand-ux; never edit here.

// Actions
export { default as HBtn } from "./HBtn.vue";
export { default as HBtnGroup } from "./HBtnGroup.vue";

// Inputs & controls
export { default as HNumberStepper } from "./HNumberStepper.vue";
export { default as HFatSlider } from "./HFatSlider.vue";
export { default as HLabeledSlider } from "./HLabeledSlider.vue";
export { default as HHelpTip } from "./HHelpTip.vue";

// Containers & surfaces
export { default as HInfoCard } from "./HInfoCard.vue";
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

// Feedback & status
export { default as HFeedbackCard } from "./HFeedbackCard.vue";
export { default as HStatusBadge } from "./HStatusBadge.vue";
export { default as HEmptyState } from "./HEmptyState.vue";
export { default as HSuccessMoment } from "./HSuccessMoment.vue";
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
