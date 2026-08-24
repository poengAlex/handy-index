<template>
  <q-dialog :model-value="open" persistent>
    <HModal :title="$t('settings.consent.title')">
      {{ $t("settings.consent.body") }}
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
import { computed } from "vue";
import { HBtn, HModal } from "@/components/handy";
import { useSettingsStore } from "@/stores/settings";

const settings = useSettingsStore();

const open = computed(() => !settings.consentAnswered);

function answer(accepted: boolean) {
  settings.answerConsent(accepted);
}
</script>
