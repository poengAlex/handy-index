<template>
  <q-dialog :model-value="open" persistent>
    <HModal :title="$t('settings.consent.title')">
      <div class="consent-dialog">
        <!-- Above the text, not below it: this is the one screen where the
             language is a precondition for the words next to it rather than a
             preference. Someone whose browser guessed wrong has to be able to
             fix it *before* agreeing to something they cannot read. -->
        <LanguagePicker compact />
        <p class="consent-dialog__body">{{ $t("settings.consent.body") }}</p>
      </div>

      <template #actions>
        <HBtn
          variant="tertiary"
          :label="$t('settings.consent.decline')"
          @click="answer(false)"
        />
        <HBtn :label="$t('settings.consent.accept')" @click="answer(true)" />
      </template>
    </HModal>
  </q-dialog>
</template>

<script setup lang="ts">
// First-visit consent gate: answering (either way) is persisted; accepting
// also turns on explicit thumbnails.
//
// It carries its own language pills because it is the first thing anyone sees
// and the only screen whose copy is legally load-bearing. Browser detection is
// a guess — a good one, but a reader who gets the wrong guess here would be
// consenting to an age statement they cannot read, and the settings dialog
// that would let them fix it sits behind this modal.
import { computed } from "vue";
import { HBtn, HModal } from "@/components/handy";
import LanguagePicker from "@/components/LanguagePicker.vue";
import { useSettingsStore } from "@/stores/settings";

const settings = useSettingsStore();

const open = computed(() => !settings.consentAnswered);

function answer(accepted: boolean) {
  settings.answerConsent(accepted);
}
</script>

<style scoped lang="scss">
.consent-dialog {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.consent-dialog__body {
  margin: 0;
}

@media (max-width: 599px) {
  // Stack the actions; reversed so Accept (last in DOM, primary) sits on top.
  :deep(.h-modal__actions) {
    flex-direction: column-reverse;
    align-items: stretch;
  }
}
</style>
