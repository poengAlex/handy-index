<template>
  <fieldset class="lang-picker">
    <legend class="text-body-compact lang-picker__label">
      {{ $t("common.language.label") }}
    </legend>
    <p class="text-caption lang-picker__hint">
      {{ $t("common.language.caption") }}
    </p>
    <div class="lang-picker__chips">
      <label
        v-for="option in options"
        :key="option.value"
        class="lang-picker__chip"
        :class="{ 'lang-picker__chip--on': choice === option.value }"
        :lang="option.lang"
      >
        <input
          v-model="choice"
          type="radio"
          name="app-language"
          :value="option.value"
          class="lang-picker__input"
        />
        <q-icon v-if="option.icon" :name="option.icon" size="16px" />
        {{ option.label }}
      </label>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
// The language chooser. Ten languages plus "match my browser" is too many for
// the radio rows the rest of this dialog uses — a row each would be most of
// the modal — so the options become a wrapping chip row where all of them are
// visible at once.
//
// Real <input type="radio"> under each chip rather than divs with click
// handlers: arrow-key navigation, the roving tab stop, and the group
// semantics screen readers announce all come for free, and cannot drift out
// of sync with the visual state the way a hand-rolled widget does.
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { LOCALE_LABELS, LOCALES } from "@/i18n/locales";
import type { Locale } from "@/i18n/locales";
import { useSettingsStore } from "@/stores/settings";

const { t } = useI18n();
const settings = useSettingsStore();

// "system" is the absence of a choice, which the store models as null — the
// radio group needs a real value to compare against, so the proxy maps the
// two representations. Picking your current browser language explicitly is a
// different state from following it: the first survives a browser change.
const choice = computed<Locale | "system">({
  get: () => settings.locale ?? "system",
  set: value => {
    settings.locale = value === "system" ? null : value;
  }
});

// Each chip carries its own `lang`, so a screen reader switches voice for
// 日本語 and 한국어 instead of spelling them out in the page language, and the
// CJK font rules in app.scss apply per chip rather than to the whole dialog.
const options = computed<
  { value: Locale | "system"; label: string; lang?: string; icon?: string }[]
>(() => [
  {
    value: "system",
    label: t("common.language.system"),
    icon: "language"
  },
  ...LOCALES.map(locale => ({
    value: locale,
    label: LOCALE_LABELS[locale],
    lang: locale
  }))
]);
</script>

<style scoped lang="scss">
.lang-picker {
  border: 0;
  padding: 0;
  margin: 0;
  min-inline-size: 0;
}

.lang-picker__label {
  color: var(--color-text-primary);
  padding: 0;
}

.lang-picker__hint {
  color: var(--color-text-tertiary);
  margin: var(--space-xs) 0 var(--space-sm);
}

.lang-picker__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.lang-picker__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: var(--radius-full);
  background: var(--color-bg-card);
  box-shadow: inset 0 0 0 1px var(--color-stroke-subtle);
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.14px;
  cursor: pointer;
  transition:
    background 120ms ease,
    color 120ms ease;

  &:hover {
    background: var(--color-row-hover);
  }
}

.lang-picker__chip--on {
  background: var(--color-action-primary);
  color: var(--color-action-primary-label);
  box-shadow: none;

  &:hover {
    background: var(--color-action-primary-hover);
  }
}

// the input still receives focus and keyboard events — it is only invisible,
// never display:none, which would take it out of the tab order entirely
.lang-picker__input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.lang-picker__chip:has(.lang-picker__input:focus-visible) {
  outline: 2px solid var(--color-stroke-focus);
  outline-offset: 2px;
}
</style>
