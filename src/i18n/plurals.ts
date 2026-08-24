import type { Locale } from "./locales";

// vue-i18n's built-in rule is the English one: two forms, and everything that
// isn't exactly 1 takes the plural. Four of our languages disagree, and the
// disagreement is visible on the first screen — a count label is the most
// repeated string in the app.
//
// A rule returns the *index* of the branch to use, so the message file and
// the rule here have to agree on how many `|`-separated branches exist.
// `npm run i18n:check` enforces that pairing; without it a Russian message
// with the wrong branch count fails silently at a number nobody tested.

type PluralRule = (choice: number, choicesLength: number) => number;

/** Never index past the branches a translator actually wrote. */
function clamp(index: number, choicesLength: number): number {
  return Math.min(Math.max(index, 0), Math.max(choicesLength - 1, 0));
}

/** Japanese, Korean and Chinese have no grammatical number: "1 video" and
 * "5 video" are the same noun. One branch, always. Written as a rule rather
 * than left to the default so a translator who does supply two branches still
 * gets the first one rather than an accidental English-shaped plural. */
const single: PluralRule = () => 0;

/** French treats zero as singular — "0 vidéo", not "0 vidéos". Two branches. */
const french: PluralRule = (choice, choicesLength) =>
  clamp(choice > 1 ? 1 : 0, choicesLength);

/**
 * Russian has three: *one* (1, 21, 31 — but not 11), *few* (2–4, 22–24 — but
 * not 12–14) and *many* (everything else, which is also where 0 lands, taking
 * the genitive plural "0 тегов"). Three branches, in that order.
 */
const russian: PluralRule = (choice, choicesLength) => {
  const mod10 = Math.abs(choice) % 10;
  const mod100 = Math.abs(choice) % 100;
  if (mod10 === 1 && mod100 !== 11) return clamp(0, choicesLength);
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return clamp(1, choicesLength);
  }
  return clamp(2, choicesLength);
};

/** How many `|`-separated branches each locale's plural messages must carry.
 * English is the reference; anything absent here uses two, like English. */
export const PLURAL_BRANCHES: Record<Locale, number> = {
  "en-US": 2,
  "nb-NO": 2,
  "pt-BR": 2,
  es: 2,
  de: 2,
  fr: 2,
  ja: 1,
  "ko-KR": 1,
  ru: 3,
  "zh-CN": 1
};

/** Handed to `createI18n`. Locales absent from this map keep vue-i18n's
 * default English-shaped rule, which is correct for Norwegian, Portuguese,
 * Spanish and German. */
export const pluralRules: Record<string, PluralRule> = {
  ja: single,
  "ko-KR": single,
  "zh-CN": single,
  fr: french,
  ru: russian
};
