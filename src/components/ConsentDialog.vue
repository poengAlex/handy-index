<template>
  <q-dialog :model-value="open" persistent>
    <HModal title="Before you browse">
      IVDB catalogs interactive adult videos with scripts for The Handy. Confirm
      you are 18 or older to browse with explicit previews. Continue without
      confirming and previews stay hidden — you can change this any time in
      settings. Your preferences are stored only in this browser.
      <template #actions>
        <HBtn
          variant="tertiary"
          label="Continue without previews"
          @click="answer(false)"
        />
        <HBtn label="I'm 18 or older" @click="answer(true)" />
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
