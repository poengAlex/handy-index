// ============================================================
// The playground's settings model.
//
// The playground answers a different question from the design-system docs:
// question: "what else could it do". So nearly everything is a knob, the
// ranges go past the tasteful zone on purpose, and the defaults land on the
// look the source PNGs actually have — which is NOT a crisp mesh.
//
// The single most important control here is Size. The Canva exports get
// their "coloured light through fog" quality from shapes that are SMALLER
// than the blur applied to them: once the blur radius exceeds the shape,
// you stop seeing a blurred blob and start seeing diffuse light with no
// discernible source. Every other lens control is seasoning on top of that.
// ============================================================

import {
  motionDefaults,
  mountDefaults,
  type MotionSettings,
  type MountSettings
} from "./motion";
import {
  fields,
  palettes,
  rgba,
  type Blob,
  type FieldId,
  type GradientColor,
  type PaletteId
} from "./gradient-recipes";

// The palette hexes the presets lean on, named so a preset reads as a
// decision rather than as four anonymous strings.
const DEEP_BLUE = "#0C56B2";
const DEEP_MINT = "#9EF1E0";
const DEEP_ROSE = "#E09298";
const DEEP_SAND = "#EBD19B";
const BRAND_BLUE = "#0064E0";
const BRAND_BLUE_LIGHT = "#47A5FA";
const CONNECTED_PURPLE = "#A121CE";

export type BlendChoice = "auto" | "normal" | "multiply" | "screen";
export type GrainBlend = "overlay" | "soft-light" | "multiply" | "normal";
export type Subject = "background" | "hero" | "card";
/** Where the grain lands. See `lensScope` on LensSettings. */
export type LensScope = "frame" | "blobs";
export type Attach = "pinned" | "parallax" | "travels" | "banded";

export interface LensSettings {
  // ---- colour ----
  palette: PaletteId;
  /** Four hexes when the swatches have been edited; null = use the palette. */
  custom: string[] | null;
  /** Per-blob strength. */
  alpha: number;
  /** Whole-field opacity. */
  strength: number;
  blend: BlendChoice;
  saturate: number;
  contrast: number;
  brightness: number;

  // ---- shape ----
  field: FieldId;
  count: number;
  /** Blob size multiplier. Below ~0.5 with a high Defocus you get fog. */
  size: number;
  /** How far the blobs sit from the centre. */
  spread: number;
  jitter: number;
  seed: number;
  /** 0 = colour holds almost to the rim; 1 = tight core, long empty tail. */
  hardness: number;

  // ---- lens ----
  /** Blur radius as a percentage of the field's short side. */
  defocus: number;
  /**
   * Grain layer opacity, 0-1. It needs to be far higher than instinct
   * suggests: the layer blends with `overlay`, which is self-normalising
   * (no net brightness shift) but barely moves a near-white pixel — 14%
   * measured 0.4 against the 5.0 the source exports carry, and ~50% is
   * where it starts to match them.
   */
  grain: number;
  grainSize: number;
  grainRough: number;
  grainBlend: GrainBlend;
  /**
   * Where the grain lands. "frame" (the default, and the original
   * behaviour) speckles the whole field box like sensor noise. "blobs"
   * confines it to the colour, so empty page stays clean.
   *
   * It scopes GRAIN ONLY, and that is not an oversight:
   *  - HAZE is already blob-scoped in effect. It paints the host's own
   *    surface colour (`--hbg-surface`), so over empty page it is that
   *    colour on itself — measured 0.00 change outside the blobs. It only
   *    reads frame-wide when the field sits on a backdrop that is not the
   *    sniffed surface.
   *  - VIGNETTE is a property of the frame by definition. Measured, its
   *    whole effect is where the blobs are NOT (+0.00 at a blob core,
   *    -57 in empty pixels). Scoping it would not scope it; it would
   *    delete it and leave a rim-darkening that `hardness` already does.
   */
  lensScope: LensScope;
  /** Flare: a veil of the surface colour laid over everything. */
  haze: number;
  vignette: number;
  /** Colour separation, px. */
  fringe: number;

  // ---- motion ----
  motion: MotionSettings;
  /** How the field arrives. Not part of a look preset. */
  mount: MountSettings;
}

// Tuned by rendering a size x alpha x count sweep and reading it back: the
// deck's look needs blobs around half size and an alpha near 0.7, NOT the
// tiny-and-faint combination that intuition suggests. Shrinking a blob
// spreads the same ink over a much larger area once it is blurred, so size
// and alpha have to move in opposite directions or the colour just leaves.
export const defaults: LensSettings = {
  palette: "deep",
  // blue twice: the exports are one dominant hue with small warm and cool
  // accents, and four colours weighted equally is what turns a field to mud
  custom: [DEEP_BLUE, DEEP_BLUE, DEEP_MINT, DEEP_ROSE],
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
  seed: 7,
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

  motion: { ...motionDefaults },
  mount: { ...mountDefaults }
};

// ------------------------------------------------------------
// Presets — the fastest way to understand what the knobs do is to
// watch them all move at once.
// ------------------------------------------------------------

export interface Preset {
  id: string;
  label: string;
  note: string;
  values: Partial<LensSettings>;
}

export const presets: Preset[] = [
  {
    id: "slide",
    label: "Slide",
    note: "The deck at its calmest: one dominant blue, a rose and a mint kept small, and most of the frame left alone. Composited on white the exports are ~80% white — the colour is an accent, not a wash.",
    values: {
      palette: "deep",
      custom: [DEEP_BLUE, DEEP_BLUE, DEEP_MINT, DEEP_ROSE],
      alpha: 0.55,
      field: "aurora",
      count: 4,
      size: 0.75,
      spread: 1,
      jitter: 0.15,
      hardness: 0.35,
      defocus: 12,
      grain: 0.5,
      grainSize: 1.1
    }
  },
  {
    id: "orb",
    label: "Orb",
    note: "The closest of the set to what the PNGs actually are: a defined core with the colour falling away from it, rather than an even wash. The exports are objects on white, and this is that.",
    values: {
      palette: "deep",
      custom: [DEEP_BLUE, DEEP_MINT, DEEP_ROSE, DEEP_SAND],
      alpha: 0.5,
      field: "orb",
      count: 4,
      size: 0.95,
      spread: 1.05,
      jitter: 0.1,
      hardness: 0.4,
      defocus: 11,
      grain: 0.45,
      grainSize: 1.2
    }
  },
  {
    id: "aurora",
    label: "Aurora",
    note: "Louder than the deck and the one to reach for behind a hero: Brand Blue into Connected Purple with a mint edge. Big shapes, little blur, so the colour keeps its saturation.",
    values: {
      palette: "hybrid",
      custom: [BRAND_BLUE, BRAND_BLUE_LIGHT, DEEP_MINT, CONNECTED_PURPLE],
      alpha: 0.45,
      field: "aurora",
      count: 5,
      size: 0.95,
      spread: 1,
      jitter: 0.15,
      hardness: 0.5,
      defocus: 9,
      grain: 0.35,
      grainSize: 1.4
    }
  },
  {
    id: "fog",
    label: "Fog",
    note: "Soft and diffuse without disappearing. The temptation is to shrink the shapes and crank the blur, and it kills the colour outright — blur spreads the same ink over a far larger area. Big shapes and a big radius, not small ones.",
    values: {
      palette: "deep",
      custom: [DEEP_BLUE, DEEP_BLUE, DEEP_MINT, DEEP_BLUE],
      alpha: 0.8,
      field: "aurora",
      count: 5,
      size: 0.7,
      spread: 1.15,
      jitter: 0.3,
      hardness: 0.25,
      defocus: 22,
      grain: 0.5,
      // was 1.8 — coarse enough that the octave ladder reached 32px blobs
      // and the "fog" read as dirty glass
      grainSize: 1.1
    }
  },
  {
    id: "lens",
    label: "Bad lens",
    note: "Colour first, defects on top: corners falling away, heavy grain, a touch of extra saturation to survive it. Haze is deliberately at zero here — flare lifts the blacks and turns the whole thing beige, which is worth switching on to see and then switching off.",
    values: {
      palette: "deep",
      // sand dropped: with a vignette and this much grain over it, the warm
      // hue stopped reading as flare and started reading as a stain
      custom: [DEEP_BLUE, DEEP_ROSE, DEEP_MINT, DEEP_BLUE],
      alpha: 0.8,
      field: "aurora",
      count: 6,
      size: 0.8,
      spread: 1.1,
      jitter: 0.35,
      hardness: 0.28,
      defocus: 14,
      grain: 0.7,
      grainSize: 1.2,
      grainRough: 4,
      vignette: 0.28,
      contrast: 0.96,
      saturate: 1.3
    }
  },
  {
    id: "crisp",
    label: "Crisp",
    note: "The other end, for comparison: only the 14, big shapes, almost no blur, no grain at all. This is what a CSS gradient looks like when nobody has told it to stop.",
    values: {
      palette: "brand",
      custom: null,
      alpha: 0.35,
      field: "aurora",
      count: 4,
      size: 1.25,
      spread: 0.9,
      jitter: 0,
      hardness: 0.75,
      defocus: 2,
      grain: 0
    }
  }
];

// ------------------------------------------------------------
// Shape generation
// ------------------------------------------------------------

/** Deterministic PRNG — jitter has to survive a re-render unchanged. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Turn a named layout into the blob list the settings ask for: `count`
 * blobs (cycling the layout and nudging the repeats so they do not stack),
 * resized by `size`, pushed out from the centre by `spread`, and scattered
 * by `jitter`.
 *
 * `seedOverride` exists for the Morph motion, which needs the arrangement
 * at seed N and at seed N+1 so it can walk between them.
 */
export function buildBlobs(s: LensSettings, seedOverride?: number): Blob[] {
  const base = fields[s.field].blobs;
  const rnd = mulberry32(seedOverride ?? s.seed);
  const out: Blob[] = [];

  for (let i = 0; i < s.count; i++) {
    const b = base[i % base.length]!;
    const lap = Math.floor(i / base.length);
    // repeats would land exactly on top of their original — give each lap
    // its own offset so a high count adds depth instead of just opacity
    const lapDx = lap === 0 ? 0 : (rnd() - 0.5) * 46;
    const lapDy = lap === 0 ? 0 : (rnd() - 0.5) * 46;
    const jx = (rnd() - 0.5) * 60 * s.jitter;
    const jy = (rnd() - 0.5) * 60 * s.jitter;
    const jSize = 1 + (rnd() - 0.5) * 0.5 * s.jitter;

    out.push({
      x: 50 + (b.x - 50) * s.spread + lapDx + jx,
      y: 50 + (b.y - 50) * s.spread + lapDy + jy,
      w: b.w * s.size * jSize,
      h: b.h * s.size * jSize,
      rot: (b.rot ?? 0) + (rnd() - 0.5) * 90 * s.jitter,
      c: b.c,
      ...(b.a === undefined ? {} : { a: b.a })
    });
  }
  return out;
}

/** The ids an imported config is allowed to name. */
export const paletteIds = ["slide", "deep", "brand", "hybrid"] as const;
export const lensScopeIds = ["frame", "blobs"] as const;
export const fieldOrderIds = [
  "aurora",
  "orb",
  "ribbon",
  "bloom",
  "wash",
  "corner"
] as const;

export function paletteColors(s: LensSettings): GradientColor[] {
  const base = palettes[s.palette].colors;
  if (!s.custom) return base;
  return s.custom.map((hex, i) => ({
    name: base[i]?.name ?? `Colour ${i + 1}`,
    hex,
    origin: "edited"
  }));
}

// ------------------------------------------------------------
// Falloff — how a blob lets go of its colour
//
// Soft holds nearly full strength most of the way out and then releases
// over the last stretch; hard puts a small bright core in a long empty
// tail. The stop table is shared with the legibility maths, so a setting
// can never make the page look one way and measure another.
// ------------------------------------------------------------

const SOFT: [number, number][] = [
  [0, 1],
  [0.5, 0.94],
  [0.75, 0.7],
  [0.9, 0.3],
  [1, 0]
];
const HARD: [number, number][] = [
  [0, 1],
  [0.2, 0.8],
  [0.45, 0.4],
  [0.7, 0.12],
  [1, 0]
];

export function fillStops(hardness: number): [number, number][] {
  const h = Math.max(0, Math.min(1, hardness));
  return SOFT.map(([p, a], i) => {
    const [ph, ah] = HARD[i]!;
    return [p + (ph - p) * h, a + (ah - a) * h] as [number, number];
  });
}

/**
 * The blob field as an alpha mask: one radial-gradient per blob, same stop
 * table as `tunedFill`, so anything masked with it dies exactly where the
 * colour dies.
 *
 * Centres are `at x% y%` rather than mask-position on purpose. The
 * mask-position form needs `(centre - size/2) / (100 - size)`, which has a
 * pole as a blob approaches the width of its box — and at the shipped
 * `size: 0.75` the default field sits right on it. The `at` form is a plain
 * position percentage with no such singularity.
 *
 * Caveat: a radial-gradient ellipse cannot be rotated, so a blob carrying
 * `--rot` is masked by its axis-aligned twin. At the default `jitter: 0.15`
 * that is under 7 degrees on an edge already metres wide in blur terms.
 */
export function blobMask(blobs: Blob[], hardness: number): string {
  const stops = fillStops(hardness)
    .map(([p, m]) => `rgba(0,0,0,${m}) ${Math.round(p * 100)}%`)
    .join(", ");
  return blobs
    .map(
      b =>
        `radial-gradient(${(b.w / 2).toFixed(2)}% ${(b.h / 2).toFixed(2)}% at ${b.x.toFixed(2)}% ${b.y.toFixed(2)}%, ${stops})`
    )
    .join(", ");
}

export function tunedFill(
  hex: string,
  alpha: number,
  hardness: number
): string {
  const stops = fillStops(hardness)
    .map(([p, m]) => `${rgba(hex, alpha * m)} ${Math.round(p * 100)}%`)
    .join(", ");
  return `radial-gradient(closest-side, ${stops})`;
}

// ------------------------------------------------------------
// Grain
//
// Generated onto a canvas, not with feTurbulence.
//
// The SVG route is the one every article recommends and it does not survive
// contact with this use case: an feTurbulence rect used as a CSS
// background-image rasterises unpredictably, and measuring it back off the
// screen showed a faint regular cross-hatch whose strength did not respond
// to opacity or blend mode at all. Measured grain energy came out at 0.2-0.5
// against the 5.0 the source PNGs actually carry — better than ten times too
// little, which is exactly the "not grainy enough" complaint.
//
// A canvas gives an exact amplitude, a real random field, and one decode.
// The tile is generated once per (size, roughness, amplitude) and cached.
// ------------------------------------------------------------

const grainCache = new Map<string, string>();

/** Deterministic — the same settings must give the same tile every time. */
function noiseRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x9e3779b9) >>> 0;
    let t = Math.imul(a ^ (a >>> 16), 0x21f0aaad);
    t = Math.imul(t ^ (t >>> 15), 0x735a2d97);
    return ((t ^ (t >>> 15)) >>> 0) / 4294967296;
  };
}

export function grainTile(grainSize: number): number {
  // big enough that the repeat never resolves as a pattern, small enough to
  // decode instantly
  return Math.round(Math.min(512, 220 + grainSize * 60));
}

/**
 * A greyscale noise tile as a data URL. `grainSize` sets the size of a grain
 * cluster in px (1 = per-pixel sensor noise, 5 = coarse film), `rough` how
 * many octaves are summed.
 */
export function grainUri(grainSize: number, rough: number): string {
  const key = `${grainSize}|${rough}`;
  const hit = grainCache.get(key);
  if (hit) return hit;
  const uri = buildGrain(grainSize, rough);
  grainCache.set(key, uri);
  return uri;
}

const tileCache = new Map<string, HTMLCanvasElement>();

/** The noise tile as a live canvas, for painting via createPattern(). */
export function noiseTile(
  grainSize: number,
  rough: number
): HTMLCanvasElement | null {
  const key = `${grainSize}|${rough}`;
  const hit = tileCache.get(key);
  if (hit) return hit;
  const made = buildTile(grainSize, rough);
  if (made) tileCache.set(key, made);
  return made;
}

function buildGrain(grainSize: number, rough: number): string {
  const c = buildTile(grainSize, rough);
  return c ? `url("${c.toDataURL("image/png")}")` : "none";
}

function buildTile(grainSize: number, rough: number): HTMLCanvasElement | null {
  if (typeof document === "undefined") return null;
  const tile = grainTile(grainSize);
  const canvas = document.createElement("canvas");
  canvas.width = tile;
  canvas.height = tile;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const img = ctx.createImageData(tile, tile);
  const cell = Math.max(1, Math.round(grainSize));
  const octaves = Math.max(1, Math.min(5, Math.round(rough)));

  // Sum octaves at halving amplitude, each on a coarser lattice, sampled
  // with wrap so the tile stitches to itself seamlessly.
  const field = new Float32Array(tile * tile);
  let amp = 1;
  let total = 0;
  for (let o = 0; o < octaves; o++) {
    const step = Math.max(1, cell << o);
    const cells = Math.ceil(tile / step);
    const rnd = noiseRandom(1013 + o * 7919 + cell * 31);
    const lattice = new Float32Array((cells + 1) * (cells + 1));
    for (let i = 0; i < lattice.length; i++) lattice[i] = rnd() * 2 - 1;
    // wrap the far edge onto the near one so the tile is seamless
    for (let i = 0; i <= cells; i++) {
      lattice[i * (cells + 1) + cells] = lattice[i * (cells + 1)]!;
      lattice[cells * (cells + 1) + i] = lattice[i]!;
    }
    for (let y = 0; y < tile; y++) {
      const gy = y / step;
      const y0 = Math.floor(gy);
      const fy = gy - y0;
      const wy = fy * fy * (3 - 2 * fy); // smoothstep
      for (let x = 0; x < tile; x++) {
        const gx = x / step;
        const x0 = Math.floor(gx);
        const fx = gx - x0;
        const wx = fx * fx * (3 - 2 * fx);
        const i00 = y0 * (cells + 1) + x0;
        const top = lattice[i00]! + (lattice[i00 + 1]! - lattice[i00]!) * wx;
        const bi = i00 + (cells + 1);
        const bot = lattice[bi]! + (lattice[bi + 1]! - lattice[bi]!) * wx;
        field[y * tile + x] =
          field[y * tile + x]! + (top + (bot - top) * wy) * amp;
      }
    }
    total += amp;
    // 0.35, not 0.5. Halving leaves enough energy in the 16px and 32px
    // octaves to read as mottling — mould, not grain. Measured against the
    // exports at display size, their noise is almost entirely per-pixel.
    amp *= 0.35;
  }

  // The noise goes in the ALPHA channel, not the colour channel.
  //
  // Grey noise blended with `overlay` is the textbook recipe and it does not
  // work here: the grain sits inside the field's isolated group, so its
  // backdrop is the half-transparent blob composite rather than the page,
  // and overlay against a mostly-transparent backdrop barely resolves. Three
  // separate implementations all measured 0.2-0.4 against the 5.0 the source
  // exports carry.
  //
  // Black-or-white pixels carrying the noise in alpha, composited normally,
  // have no backdrop term at all: the modulation is exactly
  // opacity x alpha x 255, symmetric about the original, and therefore
  // predictable enough to calibrate against a real measurement.
  // Calibrated twice, because the first attempt was measured wrong.
  //
  // Reading grain off a DOWNSCALED export concentrates it — resampling packs
  // the noise of many pixels into one — and matching that number made the
  // page two to three times grainier than the deck actually is. Measured at
  // the size the exports are really shown (~1400px wide), Gradient1 sits at
  // 2.1 and Gradient6 at 1.3 on the r=8 high-pass. 0.09 lands the default
  // there.
  const PEAK = 0.09;
  for (let i = 0; i < tile * tile; i++) {
    const n = field[i]! / total; // -1..1
    const p = i * 4;
    const lighten = n >= 0;
    const v = lighten ? 255 : 0;
    img.data[p] = v;
    img.data[p + 1] = v;
    img.data[p + 2] = v;
    img.data[p + 3] = Math.round(Math.min(1, Math.abs(n)) * PEAK * 255);
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

/**
 * A preset is a destination, not a nudge: it resets to the defaults first,
 * so picking one always lands you in the same place. Merging over the
 * CURRENT settings meant Bad lens left its vignette behind in Slide, and
 * every preset quietly meant something different depending on which one you
 * came from.
 *
 * Settings that are not part of a look — the seed, the motion, the overall
 * strength — are carried through rather than reset.
 */
export function applyPreset(
  current: LensSettings,
  preset: Preset
): LensSettings {
  return {
    ...defaults,
    ...preset.values,
    seed: current.seed,
    motion: current.motion,
    mount: current.mount,
    strength: current.strength
  };
}

/**
 * Blend two arrangements. Morph walks the seed, and a seed is discrete —
 * without interpolation the layout would jump. Rotation is blended on the
 * shortest arc so a blob at 179° and one at -179° cross the boundary
 * instead of unwinding the long way round.
 */
export function lerpBlobs(a: Blob[], b: Blob[], t: number): Blob[] {
  const k = Math.min(1, Math.max(0, t));
  return a.map((from, i) => {
    const to = b[i] ?? from;
    const ra = from.rot ?? 0;
    const rb = to.rot ?? 0;
    let d = ((rb - ra + 180) % 360) - 180;
    if (d < -180) d += 360;
    return {
      x: from.x + (to.x - from.x) * k,
      y: from.y + (to.y - from.y) * k,
      w: from.w + (to.w - from.w) * k,
      h: from.h + (to.h - from.h) * k,
      rot: ra + d * k,
      c: from.c,
      ...(from.a === undefined ? {} : { a: from.a })
    };
  });
}

/** Smoothstep — Morph settles into each arrangement rather than sliding past it. */
export function smoothstep(t: number): number {
  const k = Math.min(1, Math.max(0, t));
  return k * k * (3 - 2 * k);
}
