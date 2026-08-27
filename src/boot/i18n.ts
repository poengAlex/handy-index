import { watch } from "vue";
import { Lang } from "quasar";
import type { QuasarLanguage } from "quasar";
import langEnUS from "quasar/lang/en-US";
import { createI18n } from "vue-i18n";
import { defineBoot } from "#q-app";
import {
  DEFAULT_LOCALE,
  eagerMessages,
  messageLoaders,
  pluralRules
} from "@/i18n";
import type { Locale } from "@/i18n";
import { setKitLabelResolver } from "@/components/handy";
import { useSettingsStore } from "@/stores/settings";

// Quasar's own copy — the date picker's month names, the table's "Records per
// page", the pull-to-refresh label. English is bundled (it is the fallback);
// the rest are chunks fetched alongside their message bundle, so a language
// costs one round of two small parallel requests and nothing before that.
const QUASAR_LANG: Record<
  Exclude<Locale, "en-US">,
  () => Promise<{ default: QuasarLanguage }>
> = {
  "nb-NO": () => import("quasar/lang/nb-NO"),
  "pt-BR": () => import("quasar/lang/pt-BR"),
  es: () => import("quasar/lang/es"),
  de: () => import("quasar/lang/de"),
  fr: () => import("quasar/lang/fr"),
  ja: () => import("quasar/lang/ja"),
  "ko-KR": () => import("quasar/lang/ko-KR"),
  ru: () => import("quasar/lang/ru"),
  "zh-CN": () => import("quasar/lang/zh-CN")
};

/** The app-wide i18n instance. Exported so non-component code (services, a
 * store action raising a toast) can translate without a component context —
 * inside components prefer `useI18n()` / `$t`, which track locale reactively. */
export const i18n = createI18n({
  // Composition API only. The Options-API surface ($tc, this.$i18n mutation)
  // is a different runtime that would have to be kept in sync for nothing.
  legacy: false,
  // makes `$t` / `$n` / `$d` available in every template without an import
  globalInjection: true,
  locale: DEFAULT_LOCALE,
  // Every locale is type-checked against English, so a hole should be
  // impossible — this is the seatbelt for a chunk that failed to load.
  fallbackLocale: DEFAULT_LOCALE,
  // silence the "fell back to en-US" console noise for keys that legitimately
  // share a value across locales (product names, "VR", "min")
  fallbackWarn: false,
  missingWarn: import.meta.env.DEV,
  // French counts zero as singular, Russian has three forms, and CJK has none
  pluralRules,
  messages: eagerMessages
});

/** Translate outside a component. Locale-correct at call time, but *not*
 * reactive — never cache what this returns across a language switch. */
export function translate(...args: Parameters<typeof i18n.global.t>): string {
  return i18n.global.t(...args);
}

/** Quasar lang packs, kept once fetched. vue-i18n remembers the messages it
 * has been given; Quasar's Lang plugin holds only the *current* pack, so
 * switching back to a language visited earlier still has to re-apply it. */
const quasarPacks = new Map<Locale, QuasarLanguage>([
  [DEFAULT_LOCALE, langEnUS]
]);

/**
 * Switch every consumer at once: vue-i18n's messages, the Quasar lang pack,
 * `<html lang>` (screen readers, hyphenation, CJK font selection, and the
 * browser's own translate prompt), and the `Intl` formatters that read i18n's
 * locale.
 *
 * Nothing is applied until both chunks have arrived, so a switch never leaves
 * half the page in the old language. A failed fetch leaves the current locale
 * in place rather than stranding the user on a blank UI.
 */
async function applyLocale(locale: Locale): Promise<void> {
  if (!quasarPacks.has(locale)) {
    const key = locale as Exclude<Locale, "en-US">;
    try {
      const [messages, lang] = await Promise.all([
        messageLoaders[key](),
        QUASAR_LANG[key]()
      ]);
      i18n.global.setLocaleMessage(locale, messages.default);
      quasarPacks.set(locale, lang.default);
    } catch {
      // keep whatever is on screen; en-US is always resident
      return;
    }
  }

  const pack = quasarPacks.get(locale);
  if (pack) Lang.set(pack);
  i18n.global.locale.value = locale;
  document.documentElement.setAttribute("lang", locale);
}

/**
 * Hand the brand kit this app's translator.
 *
 * The kit can't import vue-i18n (it is copied verbatim between projects and
 * has to build in all of them), so it holds its own English and asks for a
 * resolver instead. Keys it doesn't find here keep the kit's English — that
 * is the designed fallback, not a failure, so `te` decides rather than
 * letting vue-i18n echo a missing path back as the label.
 *
 * `{label}` / `{value}` are the KIT's slots and it fills them itself, but
 * vue-i18n would consume them first and leave a hole. Passing each through
 * as its own literal makes vue-i18n's interpolation a no-op over them.
 *
 * Not reactive by design: the kit calls this on every render, so a component
 * that re-renders on a language change picks the new words up with everything
 * else on screen.
 */
const KIT_SLOTS = { label: "{label}", value: "{value}" };

function installKitLabels(): void {
  setKitLabelResolver((key, fallback) => {
    const path = `kit.${key}`;
    return i18n.global.te(path) ? i18n.global.t(path, KIT_SLOTS) : fallback;
  });
}

export default defineBoot(async ({ app, store }) => {
  app.use(i18n);
  installKitLabels();

  const settings = useSettingsStore(store);

  // awaited, so the very first paint is already in the right language rather
  // than flashing English and swapping
  await applyLocale(settings.resolvedLocale);

  watch(
    () => settings.resolvedLocale,
    (locale: Locale) => {
      void applyLocale(locale);
    }
  );
});
