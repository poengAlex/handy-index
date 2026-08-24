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
  | "calm"
  | "deck"
  | "aurora"
  | "fog"
  | "lens"
  | "crisp"
  | "still";

export interface Scene {
  id: SceneId;
  label: string;
  note: string;
  /** Which of the look presets it is built on. */
  preset: string;
  motion: MotionId;
  mount: MountId;
  attach: "pinned" | "parallax" | "travels" | "banded";
}

export const scenes: Scene[] = [
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

/** Turn a scene into the full settings object the field renders from. */
export function sceneSettings(id: SceneId): LensSettings {
  const sc = scene(id);
  const look = presets.find(p => p.id === sc.preset);
  const base = look ? applyPreset(defaults, look) : { ...defaults };
  return {
    ...base,
    motion: { id: sc.motion, speed: 1, amount: 1 },
    mount: { ...base.mount, id: sc.mount }
  };
}
