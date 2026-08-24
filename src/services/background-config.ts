// The tuned background, exported from the brand-ux lab playground.
//
// Kept as data rather than as props on the layout: this is the whole shape of
// the look in the format the playground round-trips, so re-tuning it is a
// paste over this object instead of a diff against a template. It goes
// through HandyBackground's hardened reader, which clamps out-of-range values
// and falls back to the `calm` scene rather than throwing if it ever stops
// parsing.
//
// The one thing worth knowing before editing: motion "morph" walks the layout
// seed underneath the blur, so every frame re-runs a full-viewport blur. That
// is the most expensive motion the component ships and the reason the ambient
// layer here costs real GPU time — the settings toggle exists partly for that.
import type { PlaygroundConfig } from "@/components/background";

export const BACKGROUND_CONFIG: PlaygroundConfig = {
  kind: "handy-gradient-playground",
  version: 2,
  subject: "background",
  attach: "parallax",
  band: 160,
  settings: {
    palette: "brand",
    custom: null,
    alpha: 0.41,
    strength: 0.32,
    blend: "screen",
    saturate: 1,
    contrast: 1,
    brightness: 1,
    field: "bloom",
    count: 5,
    size: 1,
    spread: 1,
    jitter: 0.58,
    seed: 51,
    hardness: 0.75,
    defocus: 15,
    grain: 0.29,
    grainSize: 2.3,
    grainRough: 4,
    grainBlend: "overlay",
    haze: 0.45,
    vignette: 0.19,
    fringe: 3,
    motion: {
      id: "morph",
      // resting speed — the playground exported 1.8; 3 is the asked-for pace
      speed: 3,
      amount: 2.5
    },
    mount: {
      id: "bloom",
      ms: 1100,
      delay: 280
    }
  }
};
