<template>
  <div class="privacy-statement">
    <!-- Only the English text is legally operative, so the note appears
         exactly where it is needed: on a translated rendering. -->
    <p v-if="locale !== 'en-US'" class="text-body-sm privacy-statement__notice">
      {{ $t("privacy.authoritativeNotice") }}
    </p>

    <div class="prose privacy-statement__prose">
      <p class="text-body">{{ $t("privacy.intro") }}</p>

      <h2 :class="headingClass">{{ $t("privacy.what.title") }}</h2>
      <p class="text-body">{{ $t("privacy.what.body") }}</p>
      <!-- One message, two anchors: the links are slots so the sentence
           stays a single translatable unit and word order can move. -->
      <i18n-t
        keypath="privacy.what.apiBody"
        tag="p"
        class="text-body"
        scope="global"
      >
        <template #apiDocs>
          <a
            href="https://scripts01.handyfeeling.com/api/script/index/v0/docs/"
            target="_blank"
            rel="noopener"
            >{{ $t("privacy.what.apiDocsLink") }}</a
          >
        </template>
        <template #repo>
          <a
            href="https://github.com/poengAlex/handy-index"
            target="_blank"
            rel="noopener"
            >{{ $t("privacy.what.repoLink") }}</a
          >
        </template>
      </i18n-t>

      <h2 :class="headingClass">{{ $t("privacy.local.title") }}</h2>
      <p class="text-body">{{ $t("privacy.local.intro") }}</p>
      <ul class="text-body privacy-statement__list">
        <li>{{ $t("privacy.local.item.consent") }}</li>
        <li>{{ $t("privacy.local.item.previews") }}</li>
        <li>{{ $t("privacy.local.item.orientation") }}</li>
        <li>{{ $t("privacy.local.item.accessFilters") }}</li>
        <li>{{ $t("privacy.local.item.favorites") }}</li>
        <li>{{ $t("privacy.local.item.votes") }}</li>
        <li>{{ $t("privacy.local.item.connectionKey") }}</li>
      </ul>
      <p class="text-body">{{ $t("privacy.local.outro") }}</p>

      <h2 :class="headingClass">{{ $t("privacy.catalog.title") }}</h2>
      <p class="text-body">{{ $t("privacy.catalog.body") }}</p>

      <h2 :class="headingClass">{{ $t("privacy.thirdParty.title") }}</h2>
      <p class="text-body">{{ $t("privacy.thirdParty.body") }}</p>

      <h2 :class="headingClass">{{ $t("privacy.age.title") }}</h2>
      <p class="text-body">{{ $t("privacy.age.body") }}</p>

      <h2 :class="headingClass">{{ $t("privacy.choices.title") }}</h2>
      <p class="text-body">{{ $t("privacy.choices.body") }}</p>

      <h2 :class="headingClass">{{ $t("privacy.contact.title") }}</h2>
      <i18n-t
        keypath="privacy.contact.body"
        tag="p"
        class="text-body"
        scope="global"
      >
        <template #email>
          <a href="mailto:alexander@ohdoki.com">alexander@ohdoki.com</a>
        </template>
      </i18n-t>
    </div>
  </div>
</template>

<script setup lang="ts">
// The privacy & terms text itself, with no page furniture around it — so the
// /privacy page and the dialog under Help are the same words, not two copies
// that drift. Only the heading size differs: a modal's own title is already
// h4, and h5 headings under it would out-shout it.
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const props = withDefaults(defineProps<{ compact?: boolean }>(), {
  compact: false
});

// Read only to decide whether the "English is authoritative" note shows; the
// prose itself is translated like any other page.
const { locale } = useI18n();

const headingClass = computed(() => (props.compact ? "text-h6" : "text-h5"));
</script>

<style scoped lang="scss">
// the translation disclaimer sits above the prose, quieter than body copy
// and marked by a rule so it reads as a note, not a clause
.privacy-statement__notice {
  max-width: 680px;
  margin: 0 0 var(--space-md);
  padding-left: var(--space-sm);
  border-left: 2px solid var(--color-stroke-subtle);
  color: var(--color-text-tertiary);
}

.privacy-statement__prose {
  h2 {
    margin: var(--space-xl) 0 var(--space-sm);
  }

  p {
    color: var(--color-text-secondary);
    margin: 0 0 var(--space-md);
  }

  a {
    color: var(--color-text-link);
    text-decoration: none;
    transition: text-decoration-color 180ms ease;
    text-decoration-color: transparent;

    &:hover {
      text-decoration: underline;
      text-decoration-color: currentColor;
    }
  }
}

.privacy-statement__list {
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-md);
  padding-left: var(--space-lg);

  li {
    margin-bottom: var(--space-xs);
  }
}
</style>
