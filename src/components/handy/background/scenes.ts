// ============================================================
// Scenes — a named look with its motion already chosen.
//
// The settings object underneath has two dozen fields, which is right for a
// playground and wrong for dropping a background into an app. A scene is the
// whole decision in one word: colour, shape, lens, how it moves, how it
// arrives. `<HandyBackground scene="aurora" />` and you are done.
//
// Every scene is one of the shipped looks plus a motion that suits it —
// nothing louder than the field can carry, and nothing so quiet you cannot
// tell it is on. Override any single part with a prop.
// ============================================================

import { applyPreset, defaults, presets, type LensSettings } from "./lens";
import type { MotionId, MountId } from "./motion";

export type SceneId =
  | "handy"
  | "calm"
  | "deck"
  | "aurora"
  | "fog"
  | "lens"
  | "crisp"
  | "erin"
  | "alex1"
  | "still";

export interface Scene {
  id: SceneId;
  label: string;
  note: string;
  /**
   * Which look preset it is built on. Absent for a scene that carries its
   * own settings verbatim — the brand default does, so that it cannot drift
   * when a preset is retuned underneath it.
   */
  preset?: string;
  motion: MotionId;
  mount: MountId;
  attach: "pinned" | "parallax" | "travels" | "banded";
  /** `banded` only: how far down the page it reaches, in vh. Falls back to 160. */
  band?: number;
}

export const scenes: Scene[] = [
  {
    id: "handy",
    label: "Handy",
    note: "The brand default. A screen-blended Brand Blue bloom under a heavy haze, morphing its own layout rather than sliding — tuned in the playground and pinned here as the house look.",
    motion: "morph",
    mount: "bloom",
    attach: "parallax"
  },
  {
    id: "calm",
    label: "Calm",
    note: "The default. A blue-led field that drifts about one blur radius over half a minute — visible if you watch it, gone the moment you read a sentence.",
    preset: "slide",
    motion: "drift",
    mount: "bloom",
    attach: "parallax"
  },
  {
    id: "deck",
    label: "Deck",
    note: "The presentation look: a defined core with the colour falling away from it, wandering an epitrochoid that never retraces.",
    preset: "orb",
    motion: "wander",
    mount: "bloom",
    attach: "parallax"
  },
  {
    id: "aurora",
    label: "Aurora",
    note: "The loud one, for a hero or a landing page. Brand blue into purple, travelling a circle at constant speed so it never stalls.",
    preset: "aurora",
    motion: "orbit",
    mount: "sweep",
    attach: "parallax"
  },
  {
    id: "fog",
    label: "Fog",
    note: "Soft and diffuse, breathing rather than moving. The quietest thing here that is still doing something.",
    preset: "fog",
    motion: "breathe",
    mount: "fade",
    attach: "pinned"
  },
  {
    id: "lens",
    label: "Lens",
    note: "Vignette, heavy grain, and a slow tilt whose corners travel three times as far as the middle. Atmospheric; not for dense text.",
    preset: "lens",
    motion: "tilt",
    mount: "fade",
    attach: "pinned"
  },
  {
    id: "crisp",
    label: "Crisp",
    note: "Big shapes, almost no blur, no grain. What a CSS gradient looks like when nobody has told it to stop.",
    preset: "crisp",
    motion: "still",
    mount: "fade",
    attach: "pinned"
  },
  {
    id: "alex1",
    label: "alex1",
    note: "The house look under its own name — the same brand-blue bloom, haze and morph that `handy` renders today. Kept as a separate scene so the default can move without this one going with it.",
    motion: "morph",
    mount: "bloom",
    attach: "parallax"
  },
  {
    id: "erin",
    label: "Erin",
    note: "The default field on another seed, with the deep palette taken as it comes rather than led by one hue — four colours at equal weight instead of one leading. Parallax, so it moves slower than the page and the colour stays vivid.",
    motion: "drift",
    mount: "bloom",
    attach: "parallax"
  },
  {
    id: "still",
    label: "Still",
    note: "The default look with nothing moving at all. The honest choice for a tool rather than a front door.",
    preset: "slide",
    motion: "still",
    mount: "none",
    attach: "pinned"
  }
];

export function scene(id: SceneId): Scene {
  return scenes.find(s => s.id === id) ?? scenes[0]!;
}

/**
 * The brand look, verbatim from the playground export it was tuned in.
 * It is spelled out rather than assembled from a preset because a house
 * default should not drift when a preset is retuned underneath it.
 */
export const handySettings: LensSettings = {
  palette: "brand",
  custom: null,
  alpha: 0.41,
  strength: 0.32,
  // Pinned, not "auto". Screen is the dark-surface physics; on a light page
  // it lifts rather than deepens, which is the whole character of this look.
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
  lensScope: "frame",
  haze: 0.45,
  vignette: 0.19,
  fringe: 3,

  // 3x at rest — the resting speed for the whole app. The export this came
  // from said 1.8; the house default is 3.
  motion: { id: "morph", speed: 3, amount: 2.5 },
  mount: { id: "bloom", ms: 1100, delay: 280 }
};

/**
 * Erin, verbatim from the playground export it was tuned in. Spelled out
 * for the same reason the brand look is: a named scene should not shift
 * when a preset is retuned underneath it.
 *
 * Only two settings differ from `defaults`: seed 3, and `custom: null`,
 * which drops the doubled-blue override and lets all four deep colours
 * carry equal weight. Its motion and mount are the defaults exactly. The
 * export predates `lensScope`, so it is pinned to the value the config
 * reader would have given it anyway.
 *
 * The export it came from said `attach: "banded"` at 163vh. That was the
 * playground's state when it was exported, not the intent — the scene is
 * parallax. Settings and attachment are separate decisions here.
 */
export const erinSettings: LensSettings = {
  palette: "deep",
  custom: null,
  alpha: 0.55,
  strength: 1,
  blend: "auto",
  saturate: 1,
  contrast: 1,
  brightness: 1,

  field: "aurora",
  count: 4,
  size: 0.75,
  spread: 1,
  jitter: 0.15,
  seed: 3,
  hardness: 0.35,

  defocus: 12,
  grain: 0.5,
  grainSize: 1.1,
  grainRough: 4,
  grainBlend: "normal",
  lensScope: "frame",
  haze: 0,
  vignette: 0,
  fringe: 0,

  motion: { id: "drift", speed: 3, amount: 1 },
  mount: { id: "bloom", ms: 1100, delay: 60 }
};

/**
 * Scenes that carry their settings verbatim rather than assembling them
 * from a preset. Declared here rather than on the scene entries themselves
 * because the entries are defined before these objects exist.
 */
const VERBATIM: Partial<Record<SceneId, LensSettings>> = {
  handy: handySettings,
  // The same object, not a copy of the literal: `alex1` is a second name for
  // the house look, and two transcriptions of it would eventually disagree.
  alex1: handySettings,
  erin: erinSettings
};

/** Turn a scene into the full settings object the field renders from. */
export function sceneSettings(id: SceneId): LensSettings {
  const sc = scene(id);
  const exact = VERBATIM[sc.id];
  if (exact) return { ...exact };
  const look = presets.find(p => p.id === sc.preset);
  const base = look ? applyPreset(defaults, look) : { ...defaults };
  return {
    ...base,
    motion: { id: sc.motion, speed: 1, amount: 1 },
    mount: { ...base.mount, id: sc.mount }
  };
}
