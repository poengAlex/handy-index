// What the performer directory can filter on: each profile's free-text
// fields folded into a handful of codes. The scrapes spell one colour five
// ways ("Blond", "blonde", "Dark Blond") and one country as a city, so a
// filter over the raw text would split every group into its spellings.
// Language-free like the rest of services/: these are codes, and the message
// layer names them.
import {
  profileBirth,
  profileBmi,
  profileHeight,
  profileWeight,
  profileYesNo
} from "./performer-profile";
import type { PerformerProfile } from "./types";

/** Every filterable property and the codes it folds into, in the order the
 * filters offer them. */
export const TRAIT_FACETS = {
  gender: ["woman", "man", "trans", "couple", "nonBinary"],
  hair: ["blonde", "brunette", "black", "red", "grey", "bald", "other"],
  eyes: ["brown", "blue", "green", "hazel", "grey", "black", "other"],
  ethnicity: [
    "white",
    "latina",
    "asian",
    "black",
    "indian",
    "middleEastern",
    "mixed",
    "other"
  ],
  cup: ["a", "b", "c", "d", "ddPlus"],
  natural: ["natural", "enhanced"],
  tattoos: ["yes", "no"],
  piercings: ["yes", "no"]
} as const;

export type TraitFacet = keyof typeof TRAIT_FACETS;
export type TraitCode<F extends TraitFacet = TraitFacet> =
  (typeof TRAIT_FACETS)[F][number];

export const TRAIT_FACET_KEYS = Object.keys(TRAIT_FACETS) as TraitFacet[];

/** The numeric filters' tracks. The ends are open: a handle resting on one
 * means "no limit that way", so the oldest and tallest are never cut off. */
export const TRAIT_RANGES = {
  age: { min: 18, max: 60, step: 1 },
  height: { min: 145, max: 190, step: 1 },
  // the middle 98% of the profiles that give one runs 16–29
  bmi: { min: 15, max: 35, step: 0.5 }
} as const;

export type TraitRange = keyof typeof TRAIT_RANGES;

export const TRAIT_RANGE_KEYS = Object.keys(TRAIT_RANGES) as TraitRange[];

/** One performer's properties as codes. A facet holds every code that
 * applies — "Blonde|Brunette" is both — and is missing when the profile
 * doesn't say. */
export interface PerformerTraits {
  codes: Partial<Record<TraitFacet, readonly string[]>>;
  age?: number | undefined;
  /** whole centimetres */
  height?: number | undefined;
  /** whole kilograms */
  weight?: number | undefined;
  /** body mass index, one decimal — from height and weight, where both are
   * given */
  bmi?: number | undefined;
  /** the cup letter as the measurements give it, "DD" — `codes.cup` holds
   * the filter's coarser group */
  cup?: string | undefined;
}

type Folds = readonly [RegExp, string][];

/** Raw value → code, first match wins. Anchored on whole values: a scrape
 * that is a sentence rather than a colour is better left out than guessed. */
const HAIR: Folds = [
  [/^(dark )?blonde?$/, "blonde"],
  [/^(brunette|brown( hair)?)$/, "brunette"],
  [/^black$/, "black"],
  [/^(red|redhead|auburn|ginger)$/, "red"],
  [/^(grey|gray|silver|white)$/, "grey"],
  [/^(bald|hairless|shaved)$/, "bald"],
  [/^(other|blue|pink|purple|green)$/, "other"]
];

// "Bue" is a typo on ten profiles; "Blonde" and "None" on ten more are not
// eye colours at all and fold into nothing
const EYES: Folds = [
  [/^brown$/, "brown"],
  [/^bl?ue$/, "blue"],
  [/^green$/, "green"],
  [/^hazel$/, "hazel"],
  [/^gr[ae]y$/, "grey"],
  [/^black$/, "black"],
  [/^amber$/, "other"]
];

// "American" is a nationality, not an ethnicity, and is left out
const ETHNICITY: Folds = [
  [/^(white|caucass?ian|european)$/, "white"],
  [/^latin[ao]?$/, "latina"],
  [/^(asian|japanese|chinese|korean|thai|filipina)$/, "asian"],
  [/^(black|african american|ebony)$/, "black"],
  [/^indian$/, "indian"],
  [/^(middle eastern|mideast)$/, "middleEastern"],
  [/^mixed$/, "mixed"],
  [/^other$/, "other"]
];

// "trans_m_couple" is a couple first: the filter is for who is on screen
const GENDER: Folds = [
  [/couple|group/, "couple"],
  [/^trans/, "trans"],
  [/^female$/, "woman"],
  [/^male$/, "man"],
  [/^(non[ _-]?binary|genderqueer)$/, "nonBinary"]
];

/** Every code the raw value folds to. Multi-values ("Blonde|Brunette") give
 * one per part; two or more ethnicities also count as mixed. */
function fold(raw: string | undefined, folds: Folds): string[] {
  const codes = new Set<string>();
  for (const part of (raw ?? "").split("|")) {
    const value = part.trim().toLowerCase().replace(/\s+/g, " ");
    if (!value) continue;
    const code = folds.find(([pattern]) => pattern.test(value))?.[1];
    if (code) codes.add(code);
  }
  return [...codes];
}

/** Cup size from measurements: "34DD-24-36", "32C", "C--", "32Bx23x33".
 * The band and the hips are too inconsistent to filter on — inches on most,
 * centimetres on a few, a lone "9" on five — but the cup letter is the same
 * letter wherever it appears. */
const CUP =
  /^\s*(?:\d{2})?\s*(aaa|aa|a|b|c|ddd|dd|d|e|ff|f|gg|g|h|i|j|k)(?=$|[^a-z]|x\d)/i;

/** US cup letters, smallest first — the order a cup-size sort follows */
const CUP_ORDER = [
  "aaa",
  "aa",
  "a",
  "b",
  "c",
  "d",
  "dd",
  "ddd",
  "e",
  "f",
  "ff",
  "g",
  "gg",
  "h",
  "i",
  "j",
  "k"
];

function cupLetter(measurements: string | undefined): string | undefined {
  return CUP.exec(measurements ?? "")?.[1]?.toLowerCase();
}

function cupOf(measurements: string | undefined): string[] {
  const letter = cupLetter(measurements);
  if (!letter) return [];
  if (letter.startsWith("a")) return ["a"];
  if (letter === "b" || letter === "c" || letter === "d") return [letter];
  return ["ddPlus"];
}

function yesNo(raw: string | undefined): string[] {
  const value = profileYesNo(raw);
  if (value === undefined) return [];
  // a description ("Navel, clitoris") is a yes
  return [value === false ? "no" : "yes"];
}

function natural(raw: string | undefined): string[] {
  const value = raw?.trim().toLowerCase();
  if (value === "no") return ["natural"];
  if (value === "yes") return ["enhanced"];
  return [];
}

export function profileTraits(
  profile: PerformerProfile,
  now = new Date()
): PerformerTraits {
  const all: Record<TraitFacet, string[]> = {
    gender: fold(profile.gender, GENDER),
    hair: fold(profile.hair, HAIR),
    eyes: fold(profile.eyes, EYES),
    ethnicity: fold(profile.ethnicity, ETHNICITY),
    cup: cupOf(profile.measurements),
    natural: natural(profile.fakeBoobs),
    tattoos: yesNo(profile.tattoos),
    piercings: yesNo(profile.piercings)
  };
  if (all.ethnicity.length > 1 && !all.ethnicity.includes("mixed")) {
    all.ethnicity.push("mixed");
  }
  const codes: PerformerTraits["codes"] = {};
  for (const facet of TRAIT_FACET_KEYS) {
    if (all[facet].length) codes[facet] = all[facet];
  }
  const height = profileHeight(profile.height);
  const weight = profileWeight(profile.weight);
  return {
    codes,
    age: profileBirth(profile, now)?.age,
    height,
    weight,
    bmi: profileBmi(height, weight),
    cup: cupLetter(profile.measurements)?.toUpperCase()
  };
}

export interface RangeValue {
  min: number;
  max: number;
}

/** What the directory is being narrowed by: for each facet the codes picked
 * (any of them will do), and for each range the band. */
export interface TraitFilters {
  codes: Record<TraitFacet, string[]>;
  ranges: Record<TraitRange, RangeValue>;
}

export function emptyTraitFilters(): TraitFilters {
  return {
    codes: Object.fromEntries(
      TRAIT_FACET_KEYS.map(facet => [facet, []])
    ) as unknown as Record<TraitFacet, string[]>,
    ranges: Object.fromEntries(
      TRAIT_RANGE_KEYS.map(key => [key, fullTrack(key)])
    ) as unknown as Record<TraitRange, RangeValue>
  };
}

/** The whole of a range's track — no limit either way. */
export function fullTrack(key: TraitRange): RangeValue {
  return { min: TRAIT_RANGES[key].min, max: TRAIT_RANGES[key].max };
}

/** A range narrows only once a handle has left its end of the track. */
export function rangeActive(key: TraitRange, value: RangeValue): boolean {
  const track = TRAIT_RANGES[key];
  return value.min > track.min || value.max < track.max;
}

function inBand(
  key: TraitRange,
  band: RangeValue,
  value: number | undefined
): boolean {
  if (!rangeActive(key, band)) return true;
  // a profile that doesn't say can't be judged, so it doesn't pass
  if (value === undefined) return false;
  const track = TRAIT_RANGES[key];
  return (
    (band.min <= track.min || value >= band.min) &&
    (band.max >= track.max || value <= band.max)
  );
}

/**
 * Whether a performer passes every filter — any picked code within a facet,
 * every facet and band together. `skip` leaves one facet out, which is how a
 * facet's own option counts are worked out: what picking that option would
 * add, given everything else.
 */
export function traitsMatch(
  traits: PerformerTraits | undefined,
  filters: TraitFilters,
  skip?: TraitFacet
): boolean {
  for (const facet of TRAIT_FACET_KEYS) {
    const picked = filters.codes[facet];
    if (facet === skip || !picked.length) continue;
    const has = traits?.codes[facet];
    if (!has?.some(code => picked.includes(code))) return false;
  }
  return TRAIT_RANGE_KEYS.every(key =>
    inBand(key, filters.ranges[key], traits?.[key])
  );
}

/** The properties the directory can be sorted by — the ones with an order.
 * Hair and eyes are kinds, not amounts, and stay filters only. */
export const SORTABLE_TRAITS = [
  "age",
  "height",
  "weight",
  "bmi",
  "cup"
] as const;

export type SortableTrait = (typeof SORTABLE_TRAITS)[number];

export function isSortableTrait(key: string): key is SortableTrait {
  return (SORTABLE_TRAITS as readonly string[]).includes(key);
}

/** The number a sort by `key` orders on, or undefined where the profile
 * doesn't say: years, centimetres, kilograms, BMI, or the cup's place in
 * CUP_ORDER. */
export function traitOrder(
  traits: PerformerTraits | undefined,
  key: SortableTrait
): number | undefined {
  if (key !== "cup") return traits?.[key];
  const rank = CUP_ORDER.indexOf(traits?.cup?.toLowerCase() ?? "");
  return rank < 0 ? undefined : rank;
}
