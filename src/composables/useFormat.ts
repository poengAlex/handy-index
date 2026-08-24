import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type enCommon from "@/i18n/en-US/common";
import { durationSpan, relativeSpan } from "@/services/format";
import type { Orientation } from "@/services/script-index/queries";

/** The nouns `common.count.*` knows how to pluralize. */
export type CountNoun = keyof typeof enCommon.count;

/** The nouns that have an "N of M <noun>" message. A listing header that needs
 * a new one adds it to `common.ofTotal` in all ten locales. */
export type OfTotalNoun = keyof typeof enCommon.ofTotal;

/**
 * Locale-bound display formatters. Everything here reads the reactive i18n
 * locale, so a template that calls these re-renders when the language
 * changes — which a module-level `Intl` formatter or a plain service call
 * would not. Use it anywhere a number or a duration reaches the screen.
 */
export function useFormat() {
  const { t, n, locale } = useI18n();

  // rebuilt only when the locale changes; constructing an Intl formatter is
  // the expensive part, and these run inside list renders
  const relativeFormat = computed(
    () => new Intl.RelativeTimeFormat(locale.value, { numeric: "auto" })
  );

  /** A localized integer: "15,000" in English, "15 000" in Norwegian. */
  function num(value: number): string {
    return n(value);
  }

  /**
   * "12 videos" / "1 video" — the count localized and the noun pluralized in
   * one call. This is the shape ~36 hand-rolled
   * `${x.toLocaleString()} video${x === 1 ? "" : "s"}` expressions used to
   * take, each of which was a separate place for English to leak.
   */
  function count(noun: CountNoun, value: number): string {
    return t(`common.count.${noun}`, { count: n(value) }, value);
  }

  /** "12 of 340 tags", every part localized. The noun is required and picks
   * the message: languages that put a counter on both numbers need to see the
   * noun, and languages that decline it need the total to drive the plural. */
  function ofTotal(shown: number, total: number, noun: OfTotalNoun): string {
    const params = { shown: n(shown), total: n(total) };
    // switched rather than interpolated so the keys stay statically checkable
    switch (noun) {
      case "videos":
        return t("common.ofTotal.videos", params, total);
      case "performers":
        return t("common.ofTotal.performers", params, total);
      case "tags":
        return t("common.ofTotal.tags", params, total);
    }
  }

  /** "1 h 30 min" / "1 t 30 min"; empty string when there is nothing to show. */
  function duration(seconds?: number): string {
    const span = durationSpan(seconds);
    if (!span) return "";
    // switched rather than interpolated so the message keys stay statically
    // checkable — a renamed key fails the build, not the render
    switch (span.unit) {
      case "hoursMinutes":
        return t("common.duration.hoursMinutes", {
          hours: span.hours,
          minutes: span.minutes
        });
      case "hours":
        return t("common.duration.hours", { hours: span.hours });
      case "minutes":
        return t("common.duration.minutes", { minutes: span.minutes });
      case "seconds":
        return t("common.duration.seconds", { seconds: span.seconds });
    }
  }

  /** The display name of an orientation. Was `ORIENTATION_LABELS` in
   * queries.ts; the shared-vocabulary reason it existed is now the reason
   * `common.orientation.*` is a single message group. */
  function orientation(value: Orientation): string {
    switch (value) {
      case "straight":
        return t("common.orientation.straight");
      case "gay":
        return t("common.orientation.gay");
      case "trans":
        return t("common.orientation.trans");
      case "all":
        return t("common.orientation.all");
    }
  }

  /** "3 days ago" / "for 3 dager siden"; empty when the date is missing. */
  function relative(iso?: string): string {
    const span = relativeSpan(iso);
    if (span === null) return "";
    if (span === "now") return t("common.justNow");
    return relativeFormat.value.format(span.value, span.unit);
  }

  return { num, count, ofTotal, duration, orientation, relative };
}
