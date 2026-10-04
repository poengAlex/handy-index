// ============================================================
// Gradient lab — palettes, blob layouts, and the CSS helpers
// that paint them.  NOT part of the design system.
//
// These are a port of the Canva presentation gradients. Sampling the
// source PNGs turned up the mechanic behind them: they are *saturated*
// colours painted at a low alpha (max 11–41% across the six exports),
// not pale colours painted opaque. That single fact is why they layer —
// two overlapping blobs deepen into a third colour instead of covering
// each other — and it is also why the slide palette lands so close to
// the brand palette: #AAC4E4 is within a hair of Brand Blue at 35%.
//
// Nothing here is ratified. Log a proposal in
// design_system_needs_to_change.md §0 before promoting any of it.
// ============================================================

export interface GradientColor {
  name: string;
  /** The colour actually painted into the mesh. */
  hex: string;
  /** Where it comes from — brand token, slide export, or outside both. */
  origin: string;
}

export interface GradientPalette {
  id: PaletteId;
  label: string;
  /** One word, for a segmented control. */
  short: string;
  lead: string;
  /** Working alpha for a single blob over the base surface. */
  alpha: number;
  colors: GradientColor[];
  /** True when every colour is one of the 14 (§2.1). */
  onPalette: boolean;
}

export type PaletteId = "slide" | "deep" | "brand" | "hybrid";

// The four hexes off the slides, used at face value: pale colours painted
// nearly opaque. Flat and safe — and the overlaps stay flat too.
const SLIDE: GradientColor[] = [
  { name: "Slide blue", hex: "#AAC4E4", origin: "slide export" },
  { name: "Slide green", hex: "#DDFAF4", origin: "slide export" },
  { name: "Slide red", hex: "#F4D9DB", origin: "slide export" },
  { name: "Slide yellow", hex: "#F8EFDC", origin: "slide export" }
];

// The same four, back-solved to the colour Canva is actually painting:
// solve  tint = source·a + white·(1−a)  for source at a = 0.35. Each of
// these over white at 35% reproduces its SLIDE hex exactly — but now the
// overlaps have somewhere to go.
const DEEP: GradientColor[] = [
  { name: "Deep blue", hex: "#0C56B2", origin: "slide blue ÷ 35%" },
  { name: "Deep mint", hex: "#9EF1E0", origin: "slide green ÷ 35%" },
  { name: "Deep rose", hex: "#E09298", origin: "slide red ÷ 35%" },
  { name: "Deep sand", hex: "#EBD19B", origin: "slide yellow ÷ 35%" }
];

// Straight off the 14. Brand Blue is the anchor, Blue Light the lift,
// Connected Purple the spark. Nothing here needs a palette exception.
const BRAND: GradientColor[] = [
  { name: "Brand Blue", hex: "#0064E0", origin: "palette" },
  { name: "Brand Blue Light", hex: "#47A5FA", origin: "palette" },
  { name: "Connected Purple", hex: "#A121CE", origin: "palette" },
  { name: "Soft Gray", hex: "#F1F4F7", origin: "palette" }
];

// Brand Blue does the anchoring; the two soft slide colours do the
// warming. This is the one that reads as The Handy *and* as the deck.
const HYBRID: GradientColor[] = [
  { name: "Brand Blue", hex: "#0064E0", origin: "palette" },
  { name: "Deep mint", hex: "#9EF1E0", origin: "slide green ÷ 35%" },
  { name: "Deep rose", hex: "#E09298", origin: "slide red ÷ 35%" },
  { name: "Connected Purple", hex: "#A121CE", origin: "palette" }
];

export const palettes: Record<PaletteId, GradientPalette> = {
  slide: {
    id: "slide",
    short: "Slide",
    label: "Slide",
    lead: "The four hexes off the deck, painted as-is. Faithful, flat — and because they are already mixed with white, two overlapping blobs barely register as an overlap.",
    alpha: 0.92,
    colors: SLIDE,
    onPalette: false
  },
  deep: {
    id: "deep",
    short: "Deep",
    label: "Slide (deep)",
    lead: "The same four colours back-solved to what Canva is really painting, then dropped to 35%. Identical where a blob is alone; where two cross, the colour actually goes somewhere.",
    alpha: 0.35,
    colors: DEEP,
    onPalette: false
  },
  brand: {
    id: "brand",
    short: "Brand",
    label: "Brand",
    lead: "Only the 14. Cooler and more electric than the deck — Brand Blue at 35% over white is #A6C9F4, which is the slide blue give or take the blue channel.",
    alpha: 0.35,
    colors: BRAND,
    onPalette: true
  },
  hybrid: {
    id: "hybrid",
    short: "Mixed",
    label: "Brand + slide",
    lead: "Brand Blue anchors, the slide mint and rose warm it, Connected Purple sparks it. Two colours from outside the 14 — the smallest exception that still reads as the deck.",
    alpha: 0.38,
    colors: HYBRID,
    onPalette: false
  }
};

export const paletteOrder: PaletteId[] = ["slide", "deep", "brand", "hybrid"];

// The semantic wash — state backgrounds rather than decoration. Yellow is
// the bridge the deck uses to keep green and red from reading as a traffic
// light; the same trick works on a status surface.
export const semanticWash: GradientColor[] = [
  { name: "Success", hex: "#31A24C", origin: "palette" },
  { name: "Warning", hex: "#F7B928", origin: "palette" },
  { name: "Error", hex: "#E41E3F", origin: "palette" }
];

// ------------------------------------------------------------
// Layouts — a blob is a centre, a size, and a rotation, all in
// percentages of the field, so one layout works at any size.
// ------------------------------------------------------------

export interface Blob {
  /** Centre, % of field. */
  x: number;
  y: number;
  /** Size, % of field width / height. */
  w: number;
  h: number;
  /** Degrees. */
  rot?: number;
  /** Index into the palette's colours. */
  c: number;
  /** Alpha multiplier against the palette's working alpha. */
  a?: number;
}

export interface FieldLayout {
  id: FieldId;
  label: string;
  note: string;
  blobs: Blob[];
}

export type FieldId = "aurora" | "orb" | "ribbon" | "bloom" | "wash" | "corner";

export const fields: Record<FieldId, FieldLayout> = {
  aurora: {
    id: "aurora",
    label: "Aurora",
    note: "Four blobs pushed past the edges so no blob reads as a shape. The default for a page or hero background.",
    blobs: [
      { x: 16, y: 12, w: 88, h: 88, rot: -14, c: 0 },
      { x: 88, y: 18, w: 78, h: 92, rot: 22, c: 2 },
      { x: 72, y: 88, w: 96, h: 88, rot: -8, c: 1 },
      { x: 26, y: 80, w: 72, h: 70, rot: 16, c: 3, a: 0.9 }
    ]
  },
  orb: {
    id: "orb",
    label: "Orb",
    note: "Two overlapping circles with a warm core off-centre — the Gradient1 shape. Sits behind a headline or inside a product tile.",
    blobs: [
      { x: 40, y: 52, w: 74, h: 74, c: 0 },
      { x: 64, y: 36, w: 62, h: 62, c: 1 },
      { x: 46, y: 76, w: 34, h: 30, c: 3, a: 0.9 },
      { x: 30, y: 40, w: 28, h: 26, c: 2, a: 0.7 }
    ]
  },
  ribbon: {
    id: "ribbon",
    label: "Ribbon",
    note: "Four leaning ellipses in a row — the Gradient5 band. Reads as a strip: section dividers, wide banners, card headers.",
    blobs: [
      { x: 12, y: 52, w: 34, h: 96, rot: -22, c: 0 },
      { x: 38, y: 44, w: 32, h: 92, rot: -22, c: 2 },
      { x: 62, y: 56, w: 32, h: 92, rot: -22, c: 1 },
      { x: 87, y: 46, w: 34, h: 96, rot: -22, c: 3 }
    ]
  },
  bloom: {
    id: "bloom",
    label: "Bloom",
    note: "Three lobes around a shared centre — the Gradient3 cluster. The most 'object'-like of the layouts; use it as art, not as a backdrop.",
    blobs: [
      { x: 52, y: 22, w: 56, h: 48, rot: -18, c: 0 },
      { x: 26, y: 54, w: 52, h: 56, rot: 24, c: 2 },
      { x: 60, y: 74, w: 58, h: 52, rot: -10, c: 1 },
      { x: 46, y: 48, w: 30, h: 28, c: 3, a: 0.8 }
    ]
  },
  wash: {
    id: "wash",
    label: "Wash",
    note: "Wide, shallow, anchored to one edge and fading out. The quietest of the set — a section can wear it without anyone noticing why the page feels warmer.",
    blobs: [
      { x: 24, y: 2, w: 96, h: 78, rot: -6, c: 0 },
      { x: 70, y: -6, w: 92, h: 76, rot: 8, c: 1 },
      { x: 96, y: 22, w: 62, h: 62, c: 2, a: 0.8 }
    ]
  },
  corner: {
    id: "corner",
    label: "Corner",
    note: "One glow bleeding in from a corner. Cheapest of the lot, and the safest over dense text.",
    blobs: [
      { x: 96, y: 4, w: 92, h: 100, rot: -18, c: 0 },
      { x: 84, y: 26, w: 56, h: 60, c: 2, a: 0.85 }
    ]
  }
};

export const fieldOrder: FieldId[] = [
  "aurora",
  "orb",
  "ribbon",
  "bloom",
  "wash",
  "corner"
];

// ------------------------------------------------------------
// Goo shapes — the literal Canva object: a hard organic
// silhouette with a soft mesh inside it.
// ------------------------------------------------------------

export const gooShapes: Record<string, { label: string; blobs: Blob[] }> = {
  orb: {
    label: "Orb",
    blobs: [
      { x: 58, y: 40, w: 62, h: 62, c: 0 },
      { x: 40, y: 58, w: 58, h: 58, c: 1 },
      { x: 34, y: 52, w: 34, h: 34, c: 3 },
      { x: 52, y: 70, w: 26, h: 24, c: 2 }
    ]
  },
  bloom: {
    label: "Bloom",
    blobs: [
      { x: 54, y: 26, w: 48, h: 42, rot: -18, c: 0 },
      { x: 30, y: 52, w: 44, h: 48, rot: 24, c: 2 },
      { x: 58, y: 74, w: 50, h: 44, rot: -10, c: 1 },
      { x: 70, y: 52, w: 34, h: 34, c: 3 },
      { x: 46, y: 50, w: 30, h: 30, c: 2 }
    ]
  },
  pill: {
    label: "Pill",
    blobs: [
      { x: 20, y: 50, w: 34, h: 78, c: 0 },
      { x: 44, y: 50, w: 34, h: 78, c: 1 },
      { x: 68, y: 50, w: 34, h: 78, c: 0 },
      { x: 84, y: 50, w: 30, h: 72, c: 3 }
    ]
  },
  ribbon: {
    label: "Ribbon",
    blobs: [
      { x: 16, y: 56, w: 28, h: 82, rot: -24, c: 0 },
      { x: 38, y: 42, w: 26, h: 78, rot: -24, c: 2 },
      { x: 60, y: 58, w: 26, h: 78, rot: -24, c: 1 },
      { x: 82, y: 44, w: 28, h: 82, rot: -24, c: 3 }
    ]
  },
  leaf: {
    label: "Leaf",
    blobs: [
      { x: 44, y: 34, w: 82, h: 46, rot: -16, c: 0 },
      { x: 58, y: 64, w: 78, h: 42, rot: -16, c: 1 },
      { x: 22, y: 42, w: 30, h: 24, rot: -16, c: 2 },
      { x: 78, y: 68, w: 32, h: 24, rot: -16, c: 3 }
    ]
  }
};

// ------------------------------------------------------------
// Colour helpers
// ------------------------------------------------------------

function channels(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map(c => c + c)
          .join("")
      : h;
  const n = Number.parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgba(hex: string, a: number): string {
  const [r, g, b] = channels(hex);
  return `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(3))})`;
}

/** What `hex` at `a` looks like once composited over `over`. */
export function flatten(hex: string, a: number, over = "#FFFFFF"): string {
  const [r, g, b] = channels(hex);
  const [br, bg, bb] = channels(over);
  const mix = (c: number, base: number) => Math.round(c * a + base * (1 - a));
  return `#${[mix(r, br), mix(g, bg), mix(b, bb)]
    .map(c => c.toString(16).padStart(2, "0"))
    .join("")}`.toUpperCase();
}

/**
 * A blob's fill. Three things matter here and all of them are easy to get
 * wrong.
 *
 * The far stop is the *same colour* at alpha 0, never `transparent` — that
 * keyword is rgba(0,0,0,0), and interpolating toward it in sRGB drags a
 * grey bruise through the whole falloff.
 *
 * Every midpoint sits well above its linear value, so the blob holds its
 * colour across most of its width and only lets go near the rim. A linear
 * ramp gives you a small hot core and a long grey tail — a spotlight, not
 * a wash, and the reason a first attempt at this always looks weak.
 *
 * And the last 18% is where all the softening happens, which is what stops
 * the edge resolving as a ring.
 */
export function blobFill(hex: string, alpha: number): string {
  return (
    `radial-gradient(closest-side, ${rgba(hex, alpha)} 0%, ` +
    `${rgba(hex, alpha * 0.92)} 38%, ${rgba(hex, alpha * 0.62)} 64%, ` +
    `${rgba(hex, alpha * 0.24)} 84%, ${rgba(hex, 0)} 100%)`
  );
}

// ------------------------------------------------------------
// Dark-surface strength
//
// Screen and multiply are not symmetric about alpha, so a dark field needs
// its colour painted harder than a light one — but "harder" has a ceiling
// that a flat multiplier cannot see. Screening a PALE colour hard onto black
// does not make a glow, it makes a light grey wall: the Slide palette at
// double alpha lands on #BCD4D0, which is 1.6:1 against white body text.
// Measured, not guessed — that configuration was unreadable.
//
// So the boost is capped by the thing that actually matters, the luminance
// of the resulting surface, rather than by alpha. A saturated colour like
// Brand Blue barely notices the cap (its core already sits at L≈0.097); a
// pale mint gets pulled back to a whisper, which is all a pale mint can
// honestly be on black.
// ------------------------------------------------------------

/** Luminance a single blob's core may reach on a dark surface. Set with
 *  headroom, because overlapping blobs screen on top of each other. */
export const DARK_LUMA_CEILING = 0.1;

/** Screen-composite one colour over a backdrop at alpha `a`. */
function screenOver(
  base: [number, number, number],
  cs: [number, number, number],
  a: number
): [number, number, number] {
  return [
    base[0] + a * (1 - base[0]) * cs[0],
    base[1] + a * (1 - base[1]) * cs[1],
    base[2] + a * (1 - base[2]) * cs[2]
  ];
}

function luminanceUnit(c: [number, number, number]): number {
  const f = (v: number) =>
    v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
}

/**
 * The alpha a blob should actually use on a dark surface: the requested
 * boost, pulled back until its core stops exceeding the luminance ceiling.
 * Luminance rises monotonically with alpha, so a bisection is exact enough
 * and runs in a handful of iterations.
 */
export function darkAlpha(
  hex: string,
  requested: number,
  base = "#1C1E21",
  ceiling = DARK_LUMA_CEILING
): number {
  const b = toUnitLocal(base);
  const cs = toUnitLocal(hex);
  const want = Math.min(0.85, requested);
  if (luminanceUnit(screenOver(b, cs, want)) <= ceiling) return want;
  let lo = 0;
  let hi = want;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (luminanceUnit(screenOver(b, cs, mid)) > ceiling) hi = mid;
    else lo = mid;
  }
  return lo;
}

/** The requested dark boost, before the ceiling is applied. */
export function darkBoost(alpha: number): number {
  return Math.min(0.85, alpha * (1.3 + 1.6 * alpha));
}

function toUnitLocal(hex: string): [number, number, number] {
  const [r, g, b] = channels(hex);
  return [r / 255, g / 255, b / 255];
}

// ------------------------------------------------------------
// Legibility maths
//
// A field is decoration, but text has to sit on it, and "does this
// configuration stay readable" should be a number rather than a squint.
// It can be: every blob's contribution at a point is exactly computable.
//
// A blob painted with mix-blend-mode over a backdrop composites as
//   C' = (1 − a)·Cb + a·Blend(Cb, Cs)
// and for the two modes this system uses that collapses to something
// simple — multiply: C' = Cb·((1 − a) + a·Cs); screen: C' = Cb + a·(1 − Cb)·Cs.
// Chain the blobs in paint order and you have the surface under any pixel.
//
// The blur pass is deliberately NOT modelled. Blur redistributes energy, so
// it can only pull the extremes toward the mean — the unblurred figure is
// therefore a lower bound on contrast, and a legibility check that errs
// toward "too careful" is the only kind worth shipping.
// ------------------------------------------------------------

/** The blobFill() stop table, as (position, alpha multiplier). */
const FILL_STOPS: [number, number][] = [
  [0, 1],
  [0.38, 0.92],
  [0.64, 0.62],
  [0.84, 0.24],
  [1, 0]
];

/** Alpha multiplier at normalised radius t (0 = core, 1 = rim). */
function falloffAt(t: number, table?: [number, number][]): number {
  const stops = table ?? FILL_STOPS;
  if (t >= 1) return 0;
  for (let i = 0; i < stops.length - 1; i++) {
    const [p0, a0] = stops[i]!;
    const [p1, a1] = stops[i + 1]!;
    if (t >= p0 && t <= p1) {
      const f = p1 === p0 ? 0 : (t - p0) / (p1 - p0);
      return a0 + (a1 - a0) * f;
    }
  }
  return 0;
}

function toUnit(hex: string): [number, number, number] {
  const [r, g, b] = channels(hex);
  return [r / 255, g / 255, b / 255];
}

function toHex(c: [number, number, number]): string {
  return `#${c
    .map(v =>
      Math.round(Math.max(0, Math.min(1, v)) * 255)
        .toString(16)
        .padStart(2, "0")
    )
    .join("")}`.toUpperCase();
}

export interface FieldSampleOptions {
  colors: GradientColor[];
  blobs: Blob[];
  /** Palette working alpha. */
  alpha: number;
  /** Whole-field opacity (the Strength control). */
  opacity?: number;
  /** Dark surfaces screen a stronger fill; see MeshField. */
  dark?: boolean;
  /** The surface the field is painted onto. */
  base?: string;
  /**
   * How far the blob canvas is grown past the field on each side, as a
   * fraction — MeshField uses 0.18, LensField 0.28. Blob coordinates are
   * percentages of that OVERSCANNED canvas, not of the visible field, and
   * forgetting the difference shifts every sample by nearly a fifth of the
   * box. Measured against a real render it was worth 8 points of 255.
   */
  overscan?: number;
  /** Falloff table, when the caller has tuned the blob hardness. */
  stops?: [number, number][];
  /**
   * Defocus radius as a percentage of the field's short side. Supplied, the
   * meter blurs its sample grid to match the page; omitted, it reports the
   * unblurred field, which is a strict lower bound on contrast.
   */
  blurPct?: number;
}

/**
 * The composited surface colour at (px, py), both given 0–1 across the
 * field. Returns a hex string.
 */
export function sampleField(
  px: number,
  py: number,
  o: FieldSampleOptions
): string {
  const dark = o.dark ?? false;
  const base = o.base ?? (dark ? "#1C1E21" : "#FFFFFF");
  const opacity = o.opacity ?? 1;
  const overscan = o.overscan ?? 0.18;
  const baseUnit = toUnit(base);

  // The field is an ISOLATED group: `.mesh { isolation: isolate }` means the
  // blobs blend with each other and never with the page behind them. So the
  // group is accumulated on transparent first and composited over the base
  // once, at the end — modelling each blob as blending straight into the
  // surface drifts as soon as more than a couple of them overlap.
  let ca: [number, number, number] = [0, 0, 0];
  let aa = 0;

  // blob coordinates are percentages of the overscanned canvas
  const span = 1 + 2 * overscan;
  const ix = (100 * (px + overscan)) / span;
  const iy = (100 * (py + overscan)) / span;

  for (const b of o.blobs) {
    const color = o.colors[b.c % o.colors.length];
    if (!color) continue;
    const a0 = o.alpha * (b.a ?? 1);
    // keep in step with MeshField/LensField, or the meter reports a page
    // that does not exist
    const aMax = dark ? darkAlpha(color.hex, darkBoost(a0), base) : a0;

    const rot = ((b.rot ?? 0) * Math.PI) / 180;
    const dx = ix - b.x;
    const dy = iy - b.y;
    const rx = Math.cos(-rot) * dx - Math.sin(-rot) * dy;
    const ry = Math.sin(-rot) * dx + Math.cos(-rot) * dy;
    const t = Math.hypot(rx / (b.w / 2), ry / (b.h / 2));

    const av = falloffAt(t, o.stops) * aMax;
    if (av <= 0) continue;

    const cs = toUnit(color.hex);
    // source-over of a blended source onto the accumulated group
    const co: [number, number, number] = [0, 0, 0];
    for (let k = 0; k < 3; k++) {
      const blended = dark
        ? ca[k]! + cs[k]! - ca[k]! * cs[k]! // screen
        : ca[k]! * cs[k]!; // multiply
      co[k] = (1 - aa) * cs[k]! + aa * blended;
    }
    const na = av + aa * (1 - av);
    if (na > 0) {
      for (let k = 0; k < 3; k++) {
        ca[k] = (av * co[k]! + aa * (1 - av) * ca[k]!) / na;
      }
    }
    aa = na;
  }

  // the group rides its own opacity onto the surface
  const cover = aa * opacity;
  const out: [number, number, number] = [0, 0, 0];
  for (let k = 0; k < 3; k++) {
    out[k] = baseUnit[k]! * (1 - cover) + ca[k]! * cover;
  }
  return toHex(out);
}

/** WCAG relative luminance of a hex colour. */
export function luminance(hex: string): number {
  const [r, g, b] = toUnit(hex);
  const f = (v: number) =>
    v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

/** WCAG contrast ratio between two hex colours, 1–21. */
export function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Three box passes over a grid approximate a Gaussian closely enough for a
 * legibility read-out, and cost nothing next to sampling the field.
 * Browsers run CSS filter: blur() in sRGB, so this does too.
 */
function blurGrid(
  src: [number, number, number][],
  n: number,
  sigmaCells: number
): [number, number, number][] {
  if (sigmaCells < 0.5) return src;
  const r = Math.max(1, Math.round(sigmaCells * 0.9));
  let cur = src.map(c => [...c] as [number, number, number]);
  for (let pass = 0; pass < 3; pass++) {
    for (const horizontal of [true, false]) {
      const next: [number, number, number][] = Array.from({ length: n * n });
      for (let a = 0; a < n; a++) {
        for (let b = 0; b < n; b++) {
          const acc: [number, number, number] = [0, 0, 0];
          let count = 0;
          for (let d = -r; d <= r; d++) {
            const q = Math.max(0, Math.min(n - 1, b + d)); // clamp at the edges
            const src2 = horizontal ? cur[a * n + q]! : cur[q * n + a]!;
            acc[0] += src2[0];
            acc[1] += src2[1];
            acc[2] += src2[2];
            count++;
          }
          const out: [number, number, number] = [
            acc[0] / count,
            acc[1] / count,
            acc[2] / count
          ];
          if (horizontal) next[a * n + b] = out;
          else next[b * n + a] = out;
        }
      }
      cur = next;
    }
  }
  return cur;
}

export interface WorstContrast {
  /** Lowest contrast ratio found anywhere on the field. */
  ratio: number;
  /** The surface colour at that point. */
  surface: string;
  /** Where it was, 0–1 across the field. */
  at: { x: number; y: number };
  /** WCAG AA for body text. */
  passesBody: boolean;
  /** WCAG AA for large text / non-text. */
  passesLarge: boolean;
}

/**
 * Sweep the field and return the least readable point for `ink`. The grid is
 * deliberately coarse — the surface varies smoothly, so a fine grid buys
 * decimal places nobody acts on.
 */
export function worstContrast(
  ink: string,
  o: FieldSampleOptions,
  steps = 24
): WorstContrast {
  // Sample the field on a grid, then — crucially — blur the GRID by the same
  // radius the page blurs the field. Without this the meter reads the naked
  // blob cores and condemns exactly the settings the deck actually uses:
  // small shapes under a huge defocus have violent cores and a perfectly
  // calm result, and only one of those is on screen.
  const n = steps + 1;
  const grid: [number, number, number][] = [];
  for (let iy = 0; iy < n; iy++) {
    for (let ix = 0; ix < n; ix++) {
      grid.push(toUnit(sampleField(ix / steps, iy / steps, o)));
    }
  }

  const blurred = o.blurPct
    ? blurGrid(grid, n, (o.blurPct / 100) * steps)
    : grid;

  let ratio = Number.POSITIVE_INFINITY;
  let surface = "#FFFFFF";
  let at = { x: 0, y: 0 };
  for (let iy = 0; iy < n; iy++) {
    for (let ix = 0; ix < n; ix++) {
      const hex = toHex(blurred[iy * n + ix]!);
      const r = contrastRatio(ink, hex);
      if (r < ratio) {
        ratio = r;
        surface = hex;
        at = { x: ix / steps, y: iy / steps };
      }
    }
  }
  return {
    ratio,
    surface,
    at,
    passesBody: ratio >= 4.5,
    passesLarge: ratio >= 3
  };
}
