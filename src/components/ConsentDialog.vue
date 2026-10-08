<template>
  <q-dialog
    :model-value="open"
    persistent
    :transition-duration="closing ? 300 : 0"
    @hide="closing = false"
  >
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
import { computed, nextTick, ref } from "vue";
import { HBtn, HModal } from "@/components/handy";
import LanguagePicker from "@/components/LanguagePicker.vue";
import { useSettingsStore } from "@/stores/settings";

const settings = useSettingsStore();

const open = computed(() => !settings.consentAnswered);

// It opens with the page, so the stock entrance read as the site dimming and
// blurring itself a beat after it loaded. 0ms on the way in: the page arrives
// already behind the overlay. Quasar's 300ms on the way out, so answering
// still lifts the overlay off softly. The backdrop takes its duration from
// this same prop, which is why it is not a transition-show override.
//
// The 300ms has to be on the elements a render BEFORE the dialog closes:
// Vue does not re-patch an element it is removing, so a duration that
// changes in the same render as `open` never reaches the leave. Flipping it
// on @show is no good either — that fires before the entrance has started.
const closing = ref(false);

async function answer(accepted: boolean) {
  closing.value = true;
  await nextTick();
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
