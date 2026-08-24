// Framework-free locale registry. Lives outside the Vue layer on purpose:
// stores, services and the boot file all need to agree on what a locale is,
// and none of them should have to import vue-i18n to find out.

/** Supported UI locales. Every tag is one Quasar ships a lang pack under
 * (quasar/lang/<tag>) and is valid BCP 47, so the same string feeds vue-i18n,
 * Quasar, every `Intl.*` constructor and `<html lang>` — one identifier, no
 * translation table between layers.
 *
 * Where a language has regional variants we ship the one with the largest
 * reachable audience and let `PRIMARY_SUBTAGS` route the rest to it: pt-BR
 * rather than European Portuguese, and Simplified Chinese. Adding the other
 * variant later is a new entry here plus one message directory — nothing
 * else in the app changes. */
export const LOCALES = [
  "en-US",
  "nb-NO",
  "pt-BR",
  "es",
  "de",
  "fr",
  "ja",
  "ko-KR",
  "ru",
  "zh-CN"
] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en-US";

/** Endonyms — a language picker names each language *in* that language, so
 * someone who landed in the wrong one can still find the way out. Chinese is
 * named for its script rather than the language, because that is the actual
 * choice being offered. */
export const LOCALE_LABELS: Record<Locale, string> = {
  "en-US": "English",
  "nb-NO": "Norsk",
  "pt-BR": "Português",
  es: "Español",
  de: "Deutsch",
  fr: "Français",
  ja: "日本語",
  "ko-KR": "한국어",
  ru: "Русский",
  "zh-CN": "简体中文"
};

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" && (LOCALES as readonly string[]).includes(value)
  );
}

/** Primary subtags we answer to. Two languages need more than the obvious
 * entry: Norwegian has three living codes — `no` (the macrolanguage), `nb`
 * (Bokmål) and `nn` (Nynorsk) — and a browser may send any of them; and every
 * Chinese tag lands on Simplified, since serving a Traditional reader
 * Simplified beats serving them English. */
const PRIMARY_SUBTAGS: Record<string, Locale> = {
  en: "en-US",
  nb: "nb-NO",
  nn: "nb-NO",
  no: "nb-NO",
  pt: "pt-BR",
  es: "es",
  de: "de",
  fr: "fr",
  ja: "ja",
  ko: "ko-KR",
  ru: "ru",
  zh: "zh-CN"
};

/** `navigator.languages` when the browser offers it, else its single
 * `navigator.language`. Guarded for non-browser callers (tests, tooling). */
function browserLanguages(): readonly string[] {
  if (typeof navigator === "undefined") return [];
  if (navigator.languages?.length) return navigator.languages;
  return navigator.language ? [navigator.language] : [];
}

/**
 * The browser's preferred UI locale, walked in `navigator.languages` order:
 * an exact tag wins, otherwise the primary subtag decides — "nb-NO", "no-NB"
 * and a bare "no" are all Norwegian, "pt-PT" gets the Brazilian bundle, and
 * "en-GB" is English. Falls back to English when nothing the browser asks for
 * is on offer.
 */
export function detectLocale(
  preferred: readonly string[] = browserLanguages()
): Locale {
  for (const tag of preferred) {
    if (isLocale(tag)) return tag;
    const primary = tag.toLowerCase().split("-")[0];
    const match = primary ? PRIMARY_SUBTAGS[primary] : undefined;
    if (match) return match;
  }
  return DEFAULT_LOCALE;
}
