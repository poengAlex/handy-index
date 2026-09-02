import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useFormat } from "@/composables/useFormat";
import { APP_VERSION, BUILD_DATE } from "@/services/build-info";

/**
 * "Version 2.1.0 · Built 2 September 2026 · © 2026 Ohdoki AS" — the one line
 * of small print the About box and the help-page footer both show. Written
 * once so the two can't disagree about what build this is.
 *
 * The build date drops out of the line rather than leaving an empty gap if
 * the stamp is missing, and the year is the reader's, not the build's.
 */
export function useBuildMeta() {
  const { t } = useI18n();
  const { date } = useFormat();

  const line = computed(() => {
    const built = date(BUILD_DATE);
    return [
      t("about.version", { version: APP_VERSION }),
      built ? t("about.built", { date: built }) : "",
      t("about.copyright", { year: new Date().getFullYear() })
    ]
      .filter(Boolean)
      .join(" · ");
  });

  return { version: APP_VERSION, line };
}
