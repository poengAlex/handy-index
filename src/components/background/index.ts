// The gradient background — one portable unit.
//
// To reuse it in another project, copy THIS FOLDER. Nothing else. It imports
// only "vue": no Quasar, no design tokens, no router, no store. See README.md.
//
//   import { HandyBackground } from "@/components/background";
//   <HandyBackground scene="aurora" />

export { default as HandyBackground } from "./HandyBackground.vue";

// The pieces, for anyone assembling their own arrangement
export { default as BackgroundField } from "./LensField.vue";
export { default as BackgroundGrain } from "./GrainOverlay.vue";
export { default as BackgroundAttach } from "./MeshBackdrop.vue";

// Scenes — a named look with its motion already chosen
export {
  scene,
  scenes,
  sceneSettings,
  type Scene,
  type SceneId
} from "./scenes";

// Settings, for a consumer that wants to build a config by hand
export {
  applyPreset,
  buildBlobs,
  defaults,
  paletteColors,
  presets,
  type LensSettings,
  type Preset,
  type Subject
} from "./lens";

export {
  motionPresets,
  motionPreset,
  perBlobVector,
  mountPresets,
  mountPreset,
  sliderToSpeed,
  speedToSlider,
  type MotionId,
  type MotionSettings,
  type MountId,
  type MountSettings
} from "./motion";

// Palettes and layouts
export {
  fields,
  fieldOrder,
  palettes,
  paletteOrder,
  flatten,
  type FieldId,
  type GradientColor,
  type PaletteId
} from "./gradient-recipes";

// Configs: the format the lab playground exports, and a hardened reader
export {
  buildConfig,
  CONFIG_KIND,
  CONFIG_VERSION,
  parseConfig,
  serializeConfig,
  type PlaygroundConfig
} from "./config-io";

// Is this configuration readable? Answered before it ships, not after.
export {
  contrastRatio,
  luminance,
  sampleField,
  worstContrast,
  type WorstContrast
} from "./gradient-recipes";
