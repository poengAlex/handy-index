import { useI18n } from "vue-i18n";
import { feetAndInches } from "@/services/script-index/performer-profile";
import {
  TRAIT_RANGES,
  type RangeValue,
  type TraitFacet,
  type TraitRange
} from "@/services/script-index/performer-traits";

/** Where each build word starts, by the weight-to-height score. Set where
 * real profiles sit — half of them fall between 18.4 and 21.3 — rather
 * than at the medical cut-offs, which would file almost everyone under one
 * or two words. */
const BUILD_STEPS: readonly (readonly [number, string])[] = [
  [17.5, "slender"],
  [19.5, "slim"],
  [22, "medium"],
  [26, "curvy"],
  [Infinity, "full"]
];

/** The words for the directory's property filters — the dialog's headings
 * and pills, and the chips that show what is active on the page. */
export function usePerformerFilterLabels() {
  const { t, n, locale } = useI18n();

  function facetLabel(item: TraitFacet | TraitRange): string {
    return t(`performers.filters.facets.${item}`);
  }

  function optionLabel(facet: TraitFacet, code: string): string {
    // tattoos and piercings answer with the profile card's own yes and no
    if (facet === "tattoos" || facet === "piercings") {
      return code === "yes"
        ? t("performers.profile.yes")
        : t("performers.profile.no");
    }
    return t(`performers.filters.options.${facet}.${code}`);
  }

  /** "25–35", "40 and older", "Any age"; heights arrive with every unit
   * filled in, as the profile card's do, so each language prints its own */
  function rangeLabel(key: TraitRange, band: RangeValue): string {
    const track = TRAIT_RANGES[key];
    const from = band.min > track.min;
    const to = band.max < track.max;
    if (key === "bmi") return buildLabel(band, from, to);
    const low = feetAndInches(band.min);
    const high = feetAndInches(band.max);
    // BMI moves in halves; the others are whole numbers
    const decimals = { maximumFractionDigits: 1 };
    const params = {
      min: new Intl.NumberFormat(locale.value, decimals).format(band.min),
      max: new Intl.NumberFormat(locale.value, decimals).format(band.max),
      minFeet: n(low.feet),
      minInches: n(low.inches),
      maxFeet: n(high.feet),
      maxInches: n(high.inches)
    };
    // ageRange / heightFrom / bmiAny / … — four messages per track
    if (from && to) return t(`performers.filters.${key}Range`, params);
    if (from) return t(`performers.filters.${key}From`, params);
    if (to) return t(`performers.filters.${key}UpTo`, params);
    return t(`performers.filters.${key}Any`);
  }

  /** Build reads in words, not numbers: "slim or fuller", "medium to curvy".
   * The score behind it is weight against height, and a number beside a
   * person reads as a verdict on them. */
  function buildLabel(band: RangeValue, from: boolean, to: boolean): string {
    const low = buildWord(band.min);
    const high = buildWord(band.max);
    if (from && to) {
      return low === high
        ? low
        : t("performers.filters.bmiRange", { min: low, max: high });
    }
    if (from) return t("performers.filters.bmiFrom", { min: low });
    if (to) return t("performers.filters.bmiUpTo", { max: high });
    return t("performers.filters.bmiAny");
  }

  function buildWord(score: number): string {
    const step = BUILD_STEPS.find(([below]) => score < below);
    return t(`performers.filters.build.${step?.[1] ?? "full"}`);
  }

  /** "Hair: Blonde or Red" — the picks within one facet are alternatives */
  function facetChip(facet: TraitFacet, codes: readonly string[]): string {
    const value = new Intl.ListFormat(locale.value, {
      type: "disjunction"
    }).format(codes.map(code => optionLabel(facet, code)));
    return t("performers.filters.chip", { facet: facetLabel(facet), value });
  }

  function rangeChip(key: TraitRange, band: RangeValue): string {
    return t("performers.filters.chip", {
      facet: facetLabel(key),
      value: rangeLabel(key, band)
    });
  }

  return { facetLabel, optionLabel, rangeLabel, facetChip, rangeChip };
}
