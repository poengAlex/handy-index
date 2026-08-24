import { useI18n } from "vue-i18n";

/**
 * Translations handed *to* the brand kit.
 *
 * `components/handy/` is never forked (ARCHITECTURE.md), so it can't import
 * vue-i18n — its components take optional label props defaulting to English
 * instead. That leaves the app responsible for passing translations, and a
 * couple of kit components need several at once. This is where those bundles
 * are built, so no call site has to remember the full set.
 */
export function useKitLabels() {
  const { t } = useI18n();

  /**
   * The seven aria labels HLabeledSlider builds around its own name. Spread
   * it onto the component — `v-bind="sliderAria($t('…'))"` — passing the same
   * string you gave `label`. The kit can't compose these itself: "Reset
   * {label}" is English word order, and the range ends only exist on some
   * sliders, so the unused half is simply ignored.
   */
  function sliderAria(label: string) {
    return {
      resetLabel: t("kit.slider.reset", { label }),
      valueLabel: t("kit.slider.value", { label }),
      editValueLabel: t("kit.slider.editValue", { label }),
      minValueLabel: t("kit.slider.min", { label }),
      editMinLabel: t("kit.slider.editMin", { label }),
      maxValueLabel: t("kit.slider.max", { label }),
      editMaxLabel: t("kit.slider.editMax", { label })
    };
  }

  return { sliderAria };
}
