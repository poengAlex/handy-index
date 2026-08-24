import enUS from "./en-US";
import type { Locale } from "./locales";

/** The shape every locale must satisfy — English is the source of truth. */
export type MessageSchema = typeof enUS;

/** English ships in the main bundle because it is both the default and the
 * fallback: a key missing anywhere resolves here, so it has to be present
 * before any other locale is asked a question. */
export const eagerMessages: Partial<Record<Locale, MessageSchema>> = {
  "en-US": enUS
};

/**
 * Every other locale is a separate chunk, fetched once when it is first
 * selected. Ten languages of UI copy is ~80 kB gzipped — worth paying for the
 * one language you read, not for the nine you don't. The imports are written
 * out rather than built from a template so the bundler emits exactly these
 * ten chunks and nothing else.
 */
export const messageLoaders: Record<
  Exclude<Locale, "en-US">,
  () => Promise<{ default: MessageSchema }>
> = {
  "nb-NO": () => import("./nb-NO"),
  "pt-BR": () => import("./pt-BR"),
  es: () => import("./es"),
  de: () => import("./de"),
  fr: () => import("./fr"),
  ja: () => import("./ja"),
  "ko-KR": () => import("./ko-KR"),
  ru: () => import("./ru"),
  "zh-CN": () => import("./zh-CN")
};

export * from "./locales";
export { PLURAL_BRANCHES, pluralRules } from "./plurals";
