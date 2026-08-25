// ============================================================
// Import / export for a playground configuration.
//
// A config is a file someone keeps, pastes into a ticket, or sends to a
// colleague — which means it will outlive the shape of LensSettings. So it
// carries a version, and reading one is a migration rather than a
// JSON.parse.
//
// The import path assumes the input is hostile: every field is checked,
// numbers are clamped to the range the UI can actually reach, unknown keys
// are dropped and missing ones fall back to the defaults. A config that is
// half-right imports as the half that was right, rather than putting the
// page into a state the controls cannot get it out of.
// ============================================================

import {
  defaults,
  fieldOrderIds,
  lensScopeIds,
  paletteIds,
  type BlendChoice,
  type GrainBlend,
  type LensScope,
  type LensSettings,
  type Subject
} from "./lens";
import {
  motionDefaults,
  motionPresets,
  mountDefaults,
  mountPresets,
  type MotionId,
  type MountId
} from "./motion";

/** Bump when the shape changes, and add a step to `migrate`. */
export const CONFIG_VERSION = 2;

export const CONFIG_KIND = "handy-gradient-playground";

export interface PlaygroundConfig {
  kind: typeof CONFIG_KIND;
  version: number;
  /** Free-text, so an exported file says what it was for. */
  name?: string;
  subject: Subject;
  attach: string;
  band: number;
  settings: LensSettings;
}

export interface ImportOk {
  ok: true;
  config: PlaygroundConfig;
  /** Set when the payload was older and had to be brought forward. */
  migratedFrom?: number;
  /** Fields that were missing, unknown or out of range. */
  notes: string[];
}

export interface ImportErr {
  ok: false;
  error: string;
}

// ------------------------------------------------------------
// Export
// ------------------------------------------------------------

export function buildConfig(
  settings: LensSettings,
  subject: Subject,
  attach: string,
  band: number,
  name?: string
): PlaygroundConfig {
  return {
    kind: CONFIG_KIND,
    version: CONFIG_VERSION,
    ...(name ? { name } : {}),
    subject,
    attach,
    band,
    settings: structuredCloneish(settings)
  };
}

export function serializeConfig(config: PlaygroundConfig): string {
  return `${JSON.stringify(config, null, 2)}\n`;
}

/** structuredClone is not available everywhere this might run. */
function structuredCloneish<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

// ------------------------------------------------------------
// Coercion helpers — every one of these takes a fallback, so a bad field
// costs you that field and nothing else.
// ------------------------------------------------------------

function num(
  raw: unknown,
  fallback: number,
  min: number,
  max: number,
  label: string,
  notes: string[]
): number {
  if (typeof raw !== "number" || !Number.isFinite(raw)) {
    if (raw !== undefined) notes.push(`${label}: not a number, kept default`);
    return fallback;
  }
  if (raw < min || raw > max) {
    notes.push(`${label}: ${raw} out of range, clamped`);
    return Math.min(max, Math.max(min, raw));
  }
  return raw;
}

function pick<T extends string>(
  raw: unknown,
  allowed: readonly T[],
  fallback: T,
  label: string,
  notes: string[]
): T {
  if (typeof raw === "string" && (allowed as readonly string[]).includes(raw)) {
    return raw as T;
  }
  if (raw !== undefined) {
    notes.push(`${label}: ${JSON.stringify(raw)} unknown, kept default`);
  }
  return fallback;
}

const HEX = /^#[0-9a-f]{6}$/i;

/**
 * `null` and absent mean different things here. An explicit null is a
 * decision — "no custom colours, use the palette" — while an absent key is
 * just an older or hand-written file, and those follow the same
 * fall-back-to-defaults rule as every other field.
 */
function colors(
  raw: unknown,
  fallback: string[] | null,
  notes: string[]
): string[] | null {
  if (raw === undefined) return fallback;
  if (raw === null) return null;
  if (!Array.isArray(raw)) {
    notes.push("custom: not a list, ignored");
    return null;
  }
  const out = raw.filter(
    (c): c is string => typeof c === "string" && HEX.test(c)
  );
  if (out.length !== raw.length) {
    notes.push(`custom: ${raw.length - out.length} value(s) were not #rrggbb`);
  }
  return out.length ? out.map(c => c.toUpperCase()) : null;
}

// ------------------------------------------------------------
// Migration
// ------------------------------------------------------------

/**
 * Bring an older payload forward. Each step is deliberately tiny and only
 * knows about the version below it.
 */
function migrate(raw: Record<string, unknown>, notes: string[]): void {
  let v = typeof raw.version === "number" ? raw.version : 1;
  if (typeof raw.version !== "number") {
    notes.push("no version field, read as v1");
  }

  if (v < 2) {
    // v1 carried `drift: boolean` and `driftSpeed: number`; v2 replaced them
    // with a motion preset, of which "blobs" is the old behaviour.
    //
    // Only synthesize a motion block when the payload actually SAID
    // something about drift. Writing one unconditionally turned every
    // v1-shaped file — including an empty `{}` — into an explicit "still",
    // which is a decision the file never made and which silently overrode
    // the default.
    const settings = (raw.settings ?? {}) as Record<string, unknown>;
    if ("drift" in settings || "driftSpeed" in settings) {
      const drift = settings.drift === true;
      const speed =
        typeof settings.driftSpeed === "number" ? settings.driftSpeed : 1;
      settings.motion = { id: drift ? "blobs" : "still", speed, amount: 1 };
      notes.push("migrated v1 drift settings to a motion preset");
    }
    delete settings.drift;
    delete settings.driftSpeed;
    raw.settings = settings;
    v = 2;
  }

  raw.version = v;
}

// ------------------------------------------------------------
// Import
// ------------------------------------------------------------

export function parseConfig(text: string): ImportOk | ImportErr {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: "That is not valid JSON." };
  }
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return { ok: false, error: "Expected a JSON object." };
  }
  const obj = raw as Record<string, unknown>;

  if (obj.kind !== undefined && obj.kind !== CONFIG_KIND) {
    return {
      ok: false,
      error: `This is a ${JSON.stringify(obj.kind)} file, not a ${CONFIG_KIND} one.`
    };
  }
  if (typeof obj.version === "number" && obj.version > CONFIG_VERSION) {
    return {
      ok: false,
      error: `Made by a newer version of the playground (v${obj.version}; this one reads up to v${CONFIG_VERSION}).`
    };
  }

  const notes: string[] = [];
  const from = typeof obj.version === "number" ? obj.version : 1;
  migrate(obj, notes);

  const s = (obj.settings ?? {}) as Record<string, unknown>;
  const m = (s.motion ?? {}) as Record<string, unknown>;
  const d = defaults;

  const settings: LensSettings = {
    palette: pick(s.palette, paletteIds, d.palette, "palette", notes),
    custom: colors(s.custom, d.custom, notes),
    alpha: num(s.alpha, d.alpha, 0, 1, "alpha", notes),
    strength: num(s.strength, d.strength, 0, 1, "strength", notes),
    blend: pick<BlendChoice>(
      s.blend,
      ["auto", "normal", "multiply", "screen"],
      d.blend,
      "blend",
      notes
    ),
    saturate: num(s.saturate, d.saturate, 0, 3, "saturate", notes),
    contrast: num(s.contrast, d.contrast, 0.2, 2, "contrast", notes),
    brightness: num(s.brightness, d.brightness, 0.2, 2, "brightness", notes),

    field: pick(s.field, fieldOrderIds, d.field, "field", notes),
    count: Math.round(num(s.count, d.count, 1, 12, "count", notes)),
    size: num(s.size, d.size, 0.05, 3, "size", notes),
    spread: num(s.spread, d.spread, 0.1, 2.5, "spread", notes),
    jitter: num(s.jitter, d.jitter, 0, 1, "jitter", notes),
    seed: Math.round(num(s.seed, d.seed, 1, 9999, "seed", notes)),
    hardness: num(s.hardness, d.hardness, 0, 1, "hardness", notes),

    defocus: num(s.defocus, d.defocus, 0, 60, "defocus", notes),
    grain: num(s.grain, d.grain, 0, 1, "grain", notes),
    grainSize: num(s.grainSize, d.grainSize, 0.2, 8, "grainSize", notes),
    grainRough: Math.round(
      num(s.grainRough, d.grainRough, 1, 5, "grainRough", notes)
    ),
    grainBlend: pick<GrainBlend>(
      s.grainBlend,
      ["overlay", "soft-light", "multiply", "normal"],
      d.grainBlend,
      "grainBlend",
      notes
    ),
    lensScope: pick<LensScope>(
      s.lensScope,
      lensScopeIds,
      d.lensScope,
      "lensScope",
      notes
    ),
    haze: num(s.haze, d.haze, 0, 1, "haze", notes),
    vignette: num(s.vignette, d.vignette, 0, 1, "vignette", notes),
    fringe: num(s.fringe, d.fringe, 0, 30, "fringe", notes),

    mount: {
      id: pick<MountId>(
        ((s.mount ?? {}) as Record<string, unknown>).id,
        mountPresets.map(p => p.id),
        mountDefaults.id,
        "mount.id",
        notes
      ),
      ms: num(
        ((s.mount ?? {}) as Record<string, unknown>).ms,
        mountDefaults.ms,
        0,
        6000,
        "mount.ms",
        notes
      ),
      delay: num(
        ((s.mount ?? {}) as Record<string, unknown>).delay,
        mountDefaults.delay,
        0,
        4000,
        "mount.delay",
        notes
      )
    },

    motion: {
      id: pick<MotionId>(
        m.id,
        motionPresets.map(p => p.id),
        motionDefaults.id,
        "motion.id",
        notes
      ),
      speed: num(
        m.speed,
        motionDefaults.speed,
        0.05,
        40,
        "motion.speed",
        notes
      ),
      amount: num(m.amount, motionDefaults.amount, 0, 3, "motion.amount", notes)
    }
  };

  const config: PlaygroundConfig = {
    kind: CONFIG_KIND,
    version: CONFIG_VERSION,
    ...(typeof obj.name === "string" && obj.name ? { name: obj.name } : {}),
    subject: pick<Subject>(
      obj.subject,
      ["background", "hero", "card"],
      "background",
      "subject",
      notes
    ),
    attach: pick(
      obj.attach,
      ["pinned", "parallax", "travels", "banded"],
      "parallax",
      "attach",
      notes
    ),
    band: num(obj.band, 160, 20, 400, "band", notes),
    settings
  };

  return {
    ok: true,
    config,
    ...(from < CONFIG_VERSION ? { migratedFrom: from } : {}),
    notes
  };
}
