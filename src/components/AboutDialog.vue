<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <HModal :title="$t('about.title')" closable class="about-dialog">
      <p class="text-body about-dialog__paragraph">{{ $t("about.body") }}</p>
      <p class="text-body about-dialog__paragraph">{{ $t("about.beta") }}</p>

      <p class="text-caption about-dialog__meta">{{ meta }}</p>

      <template #actions>
        <HBtn v-close-popup :label="$t('common.action.done')" />
      </template>
    </HModal>
  </q-dialog>
</template>

<script setup lang="ts">
// What the site is, and which build of it you are looking at. Opened from the
// help page; the same three values sit in that page's footer, quieter.
import { HBtn, HModal } from "@/components/handy";
import { useBuildMeta } from "@/composables/useBuildMeta";

defineProps<{ modelValue: boolean }>();

const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();

// the same line the help-page footer prints, quietly
const { line: meta } = useBuildMeta();
</script>

<style scoped lang="scss">
.about-dialog__paragraph {
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-md);
}

.about-dialog__meta {
  color: var(--color-text-tertiary);
  margin: 0;
}
</style>
