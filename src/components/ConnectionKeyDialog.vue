<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <HModal
      :title="$t('settings.keyPrompt.title')"
      closable
      :close-label="$t('kit.close')"
    >
      <slot>{{ $t("settings.keyPrompt.body") }}</slot>
      <q-input
        ref="inputRef"
        :model-value="keyInput"
        filled
        dense
        autofocus
        maxlength="32"
        :label="$t('settings.connectionKey.label')"
        :placeholder="$t('settings.connectionKey.placeholder')"
        class="key-dialog__input"
        @update:model-value="onInput(String($event ?? ''))"
        @keyup.enter="save"
      />
      <div class="text-caption key-dialog__hint">
        <q-icon name="wifi_tethering" size="16px" />
        <span>{{ $t("settings.keyPrompt.hint") }}</span>
      </div>
      <template #actions>
        <HBtn
          v-close-popup
          variant="tertiary"
          :label="$t('common.action.cancel')"
        />
        <HBtn
          :label="$t('settings.keyPrompt.save')"
          :disable="!keyInput.trim()"
          @click="save"
        />
      </template>
    </HModal>
  </q-dialog>
</template>

<script setup lang="ts">
// The one connection-key prompt: saves the key to settings and emits `saved`
// so the caller can resume whatever needed the key.
import { nextTick, ref, watch } from "vue";
import type { QInput } from "quasar";
import { HBtn, HModal } from "@/components/handy";
import { sanitizeConnectionKey } from "@/services/format";
import { useSettingsStore } from "@/stores/settings";

const props = defineProps<{ modelValue: boolean }>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  saved: [];
}>();

const settings = useSettingsStore();
const keyInput = ref("");
const inputRef = ref<QInput>();

// A key rarely changes, and the dialog also reopens when the API rejects a
// call — starting empty would make every reopen a full retype. Prefill the
// saved key and select it, so confirming is one tap and replacing is one
// keystroke.
watch(
  () => props.modelValue,
  async open => {
    if (!open) return;
    keyInput.value = sanitizeConnectionKey(settings.connectionKey);
    if (!keyInput.value) return;
    await nextTick();
    inputRef.value?.select();
  }
);

// When sanitizing is a no-op on the ref (typed char was stripped back to the
// previous value) the controlled q-input never re-renders and the bad char
// stays visible — force a change cycle via the raw value first.
async function onInput(raw: string) {
  const clean = sanitizeConnectionKey(raw);
  if (clean !== raw) {
    keyInput.value = raw;
    await nextTick();
  }
  keyInput.value = clean;
}

function save() {
  const key = keyInput.value.trim();
  if (!key) return;
  settings.connectionKey = key;
  emit("update:modelValue", false);
  emit("saved");
}
</script>

<style scoped lang="scss">
.key-dialog__input {
  margin-top: var(--space-sm);
}

.key-dialog__hint {
  display: flex;
  align-items: flex-start;
  gap: var(--space-xs);
  margin-top: var(--space-sm);
  color: var(--color-text-tertiary);
}
</style>
