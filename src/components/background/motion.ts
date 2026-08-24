// ============================================================
// Background motion.
//
// The brief for every preset here is "subtle and not distracting", which in
// practice means three rules:
//
//   Long, but not geological. The first version cycled over 44-96s at 1-3%
//   amplitude and was not subtle, it was INVISIBLE: measured on the real
//   page, eight seconds of Drift changed the brightest pixel by one level
//   out of 255 — below what an 8-bit display can even represent.
//
//   The yardstick is the field's own blur radius, not the viewport. A field
//   softened by ~96px is nearly unchanged by moving it 25px, because a
//   smooth low-contrast surface looks the same after a small translation.
//   Excursions here are around one blur radius, which is where a shift
//   starts to actually alter pixels.
//
//   Erring loud. These defaults sit at the visible end rather than the
//   tasteful end, because the two failure modes are not symmetrical: motion
//   you find slightly too much is one drag of the Amount slider away from
//   right, and motion you cannot see at all reads as a broken feature. The
//   slider runs to 250% and down to 0.
//
//   Measured, not guessed. Animating colour -- hue, saturation -- does
//   almost nothing, because a field that is 95% white has no colour to
//   rotate.
//
//   And one correction worth keeping: this file used to claim that moving
//   the blobs RELATIVE to each other was less visible than moving the whole
//   field, because the blur averaged the difference away. That was measuring
//   a bug -- the per-blob vectors were hardcoded to 2-5% and ignored these
//   amplitudes entirely. Once they were actually wired up, differential
//   motion turned out to be the most efficient thing here, not the least:
//   14% of per-blob travel reads as strongly as 34% of rigid drift.
//
//   Cheap. The motion is applied to a WRAPPER around the blurred field, not
//   to the blobs inside it. A filter's output cannot be reused when its
//   input changes, so animating the blobs re-runs a 96px blur every frame;
//   animating the wrapper transforms an already-rasterised layer, which the
//   compositor does for free. The one preset that does move the blobs is
//   labelled as the expensive one.
//
// Everything alternates rather than loops, so there is no seam to notice.
// ============================================================

export type MotionId =
  | "still"
  | "breathe"
  | "drift"
  | "sway"
  | "current"
  | "orbit"
  | "wander"
  | "strain"
  | "tilt"
  | "wave"
  | "blobs"
  | "morph";

export interface MotionSettings {
  id: MotionId;
  /** Cycle-length multiplier. Higher is faster. */
  speed: number;
  /** Amplitude multiplier. */
  amount: number;
}

export const motionDefaults: MotionSettings = {
  id: "drift",
  speed: 1,
  amount: 1
};

export interface MotionPreset {
  id: MotionId;
  label: string;
  note: string;
  /** Base cycle in seconds at speed 1. */
  seconds: number;
  /** Amplitudes at amount 1. */
  x?: number;
  y?: number;
  scale?: number;
  deg?: number;
  /** Animates the blobs themselves, inside the blur. Expensive. */
  perBlob?: boolean;
  /** Needs the second, nested wrapper (two incommensurate periods). */
  nested?: boolean;
  /** Driven from JS rather than CSS, because it interpolates geometry. */
  morph?: boolean;
  /** Runs continuously in one direction — no alternate, no turnaround. */
  loop?: boolean;
  /** Second period, for `nested`. A ratio of `seconds`. */
  ratio?: number;
  /** True for anything that animates inside the blur. */
  costly?: boolean;
}

export const motionPresets: MotionPreset[] = [
  {
    id: "still",
    label: "Still",
    note: "No motion. The honest default for a product surface — a moving background is a taste that wears out on the second visit.",
    seconds: 0
  },
  {
    id: "breathe",
    label: "Breathe",
    note: "The field swells and eases across at the same time. Pure scaling turned out to be nearly invisible — scaling moves the middle of the frame hardly at all, which is exactly where you are looking — so it carries a small drift as well.",
    seconds: 22,
    scale: 0.17,
    x: 3.5,
    y: -2.8
  },
  {
    id: "drift",
    label: "Drift",
    note: "A diagonal wander of roughly one blur radius over half a minute. The default: clearly moving if you watch it, gone the moment you read a sentence.",
    seconds: 24,
    x: 11,
    y: -7
  },
  {
    id: "sway",
    label: "Sway",
    note: "A slow 3.5° roll about a point below the frame, so the visible part swings rather than pivots. Quietest at the centre, where the text usually sits.",
    seconds: 28,
    deg: 5
  },
  {
    id: "current",
    label: "Current",
    note: "One long horizontal pass. The most directional of the set and the easiest to notice — good behind a hero, too much behind a wall of body copy.",
    seconds: 32,
    x: 18,
    y: -3
  },
  {
    id: "orbit",
    label: "Orbit",
    note: "The field travels a circle at a constant speed. Alone in the set it never turns around, so there is no moment where it slows to a stop and looks static — the usual reason ambient motion reads as broken. It also loops seamlessly, because a circle has no ends.",
    seconds: 34,
    x: 7,
    y: 7,
    loop: true
  },
  {
    id: "wander",
    label: "Wander",
    note: "Two circles nested inside each other, turning opposite ways at periods in the golden ratio — an epitrochoid. It keeps everything that makes Orbit work (constant speed, no turnaround, no seam) and adds the one thing Orbit lacks: the path never returns to itself, so there is no figure to recognise however long you watch it.",
    seconds: 29,
    ratio: 1.618,
    x: 6,
    y: 4,
    nested: true,
    loop: true
  },
  {
    id: "strain",
    label: "Strain",
    note: "The field stretches on one axis while relaxing on the other, like a tide — a deformation rather than a displacement, so the pattern changes shape instead of sliding past you. The theory was that this would show at a fraction of a translation's amplitude. Measured, it does not: 7% was as quiet as anything else and it needed 15% to register. Kept for its character, not its efficiency.",
    seconds: 24,
    scale: 0.15
  },
  {
    id: "tilt",
    label: "Tilt",
    note: "The field leans away from you and the direction of the lean walks slowly around the frame. Because it is a perspective keystone rather than a slide, the corners travel about three times as far as the centre — the parts of the picture move relative to each other. That is the efficiency the per-blob presets pay dearly for, and here it is one matrix on an already-rendered layer, so it costs nothing. It rides on a slow orbit as well, because the precession alone leaves the middle of the frame almost still.",
    seconds: 42,
    ratio: 1.618,
    x: 5,
    deg: 9,
    nested: true,
    loop: true
  },
  {
    id: "wave",
    label: "Wave",
    note: "A swell passing through the field: each blob rises and falls on the same curve, started a beat later than the one before it. The field does not go anywhere — the shape of it travels instead. Like Blobs it buys a lot of visible change per unit of travel, and pays for it by running underneath the blur.",
    seconds: 26,
    x: 0,
    y: 20,
    perBlob: true,
    costly: true
  },
  {
    id: "blobs",
    label: "Blobs",
    note: "The blobs wander independently rather than the field moving as one, so the pattern itself changes instead of sliding. Because the blobs move relative to EACH OTHER rather than as a unit, it converts a given amount of travel into far more visible change than any rigid preset — 14% here reads as strongly as 34% of rigid drift. The catch is the cost: this motion happens underneath the blur, so every frame re-runs it.",
    seconds: 24,
    x: 14,
    y: 11,
    perBlob: true,
    costly: true
  },
  {
    id: "morph",
    label: "Morph",
    note: "The layout itself changes. Every other preset moves a fixed arrangement of blobs around; this one walks the seed, easing from one generated arrangement into the next, so blobs genuinely change place, size and angle rather than sliding as a unit. The slowest-feeling of the set and the most alive.",
    seconds: 20,
    morph: true,
    costly: true
  }
];

// ------------------------------------------------------------
// Speed
//
// The multiplier spans more than two decades, so the slider behind it is
// logarithmic: a linear control over this range would put everything from
// 0.1x to 2x in its first eighth and make the useful end unusable. Equal
// distances along the slider are equal RATIOS of speed, which is also how
// speed is actually perceived.
// ------------------------------------------------------------

export const SPEED_MIN = 0.1;
export const SPEED_MAX = 24;

/** Slider notches 0-100 -> speed multiplier. */
export function sliderToSpeed(notch: number): number {
  const t = Math.min(100, Math.max(0, notch)) / 100;
  const speed = SPEED_MIN * (SPEED_MAX / SPEED_MIN) ** t;
  // two significant figures is plenty and keeps the readout stable
  return speed < 1 ? Number(speed.toFixed(2)) : Number(speed.toFixed(1));
}

/** Speed multiplier -> slider notches 0-100. */
export function speedToSlider(speed: number): number {
  const clamped = Math.min(SPEED_MAX, Math.max(SPEED_MIN, speed));
  const t = Math.log(clamped / SPEED_MIN) / Math.log(SPEED_MAX / SPEED_MIN);
  return Math.round(t * 100);
}

/** How long one cycle takes at this speed, for the readout. */
export function cycleSeconds(p: MotionPreset, speed: number): number {
  return p.seconds / Math.max(SPEED_MIN, speed);
}

/** Presets whose motion happens per blob, inside the blur. */
export function isPerBlob(id: MotionId): boolean {
  return motionPreset(id).perBlob === true;
}

export function motionPreset(id: MotionId): MotionPreset {
  return motionPresets.find(p => p.id === id) ?? motionPresets[0]!;
}

/** The custom properties LensField hands to its keyframes. */
export function motionVars(m: MotionSettings): Record<string, string> {
  const p = motionPreset(m.id);
  if (p.seconds === 0) return {};
  const amp = Math.max(0, m.amount);
  const speed = Math.max(0.1, m.speed);
  return {
    "--m-dur": `${(p.seconds / speed).toFixed(1)}s`,
    "--m-dur2": `${((p.seconds * (p.ratio ?? 1)) / speed).toFixed(1)}s`,
    "--m-x": `${((p.x ?? 0) * amp).toFixed(2)}%`,
    "--m-y": `${((p.y ?? 0) * amp).toFixed(2)}%`,
    "--m-scale": String(1 + (p.scale ?? 0) * amp),
    "--m-strain": String((p.scale ?? 0) * amp),
    "--m-beta": `${((p.deg ?? 0) * amp).toFixed(2)}deg`,
    // Pushed back far enough that the tilt never brings any part of the
    // plane closer than its rest scale. Magnifying a filtered layer past
    // the size it was rasterised at either re-rasters mid-animation or
    // stretches the bitmap; both are visible on a field made of softness.
    // Scales with amount so the guarantee holds at every setting.
    "--m-tiltz": `${Math.round(400 * amp)}px`,
    "--m-deg": `${((p.deg ?? 0) * amp).toFixed(2)}deg`
  };
}

// ------------------------------------------------------------
// Mount — how the field arrives.
//
// A different job from ambient motion, and it gets different numbers. Ambient
// motion has to survive being looked at for minutes without being noticed;
// an entrance is SUPPOSED to be seen, once, and then never again. So these
// run in about a second and move by enough to read as an arrival.
// ------------------------------------------------------------

export type MountId = "none" | "fade" | "rise" | "bloom" | "sweep";

export interface MountSettings {
  id: MountId;
  /** Duration in ms. */
  ms: number;
  /** Delay in ms — a beat before the field arrives usually reads better. */
  delay: number;
}

export const mountDefaults: MountSettings = {
  id: "bloom",
  ms: 1100,
  delay: 60
};

export interface MountPreset {
  id: MountId;
  label: string;
  note: string;
  ms: number;
}

export const mountPresets: MountPreset[] = [
  {
    id: "none",
    label: "None",
    note: "The field is simply there. Correct whenever the page is a tool rather than a front door.",
    ms: 0
  },
  {
    id: "fade",
    label: "Fade",
    note: "Opacity only. The quietest arrival there is, and the one least likely to fight with content animating in at the same time.",
    ms: 900
  },
  {
    id: "rise",
    label: "Rise",
    note: "Comes up three percent as it fades in. The small vertical travel reads as the page settling rather than as a transition.",
    ms: 1000
  },
  {
    id: "bloom",
    label: "Bloom",
    note: "Opens from 94% while fading. The colour appears to spread outward into the frame, which suits a field whose whole character is diffusion.",
    ms: 1100
  },
  {
    id: "sweep",
    label: "Sweep",
    note: "A soft masked wipe across the frame. The most visible of the set — good behind a hero, too much on a page you return to often.",
    ms: 1300
  }
];

export function mountPreset(id: MountId): MountPreset {
  return mountPresets.find(p => p.id === id) ?? mountPresets[0]!;
}

export function mountVars(m: MountSettings): Record<string, string> {
  if (m.id === "none") return {};
  return {
    "--mount-dur": `${Math.max(0, m.ms)}ms`,
    "--mount-delay": `${Math.max(0, m.delay)}ms`
  };
}

// ------------------------------------------------------------
// Per-blob motion
//
// Extracted out of the component because it was wrong in there for a long
// time and nothing could see it: the vectors were hardcoded, so Blobs and
// Wave ignored their own amplitudes entirely and moved a token 2-5% however
// they were configured. Buried in a style function, that is invisible to a
// test. Out here it is four lines and provable.
// ------------------------------------------------------------

export interface BlobVector {
  /** Percent of the blob's own box. */
  dx: number;
  dy: number;
  /** Seconds. */
  dur: number;
  /** Seconds, negative — starts the animation part-way through. */
  delay: number;
}

export function perBlobVector(
  id: MotionId,
  amount: number,
  speed: number,
  index: number,
  count: number
): BlobVector {
  const p = motionPreset(id);
  const amp = Math.max(0, amount);
  const base = p.seconds / Math.max(SPEED_MIN, speed);
  const px = (p.x ?? 0) * amp;
  const py = (p.y ?? 0) * amp;

  if (id === "wave") {
    // one shared curve, staggered — that is what makes a swell travel
    return {
      dx: 0,
      dy: py,
      dur: base,
      delay: (-index * base) / Math.max(2, count)
    };
  }
  return {
    // `|| 0` collapses negative zero, which would otherwise render as
    // "-0.0%" in the generated CSS
    dx: (index % 2 === 0 ? 1 : -1) * px || 0,
    dy: (index % 3 === 0 ? -1 : 1) * py || 0,
    // never let them fall into step
    dur: base * (0.8 + (index % 4) * 0.13),
    delay: index * -3.5
  };
}
