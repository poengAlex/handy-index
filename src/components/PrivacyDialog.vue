<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <HModal :title="$t('privacy.title')" closable class="privacy-dialog">
      <PrivacyStatement compact />

      <template #actions>
        <HBtn v-close-popup :label="$t('common.action.done')" />
      </template>
    </HModal>
  </q-dialog>
</template>

<script setup lang="ts">
// The privacy & terms text, read without leaving the page you were on. Same
// component the /privacy page renders, so the two can never disagree.
import PrivacyStatement from "@/components/PrivacyStatement.vue";
import { HBtn, HModal } from "@/components/handy";

defineProps<{ modelValue: boolean }>();

const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();
</script>

<style scoped lang="scss">
// the statement's first heading follows the modal title directly, so it does
// not need the full section gap the page gives it
.privacy-dialog :deep(h2:first-of-type) {
  margin-top: var(--space-md);
}
</style>
