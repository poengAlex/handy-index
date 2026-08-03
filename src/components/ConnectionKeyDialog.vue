<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <HModal title="Connection key needed" closable>
      <slot>
        This action is bound to your Handy. Enter the connection key from the
        Handy app to continue.
      </slot>
      <q-input
        :model-value="keyInput"
        filled
        dense
        autofocus
        maxlength="32"
        label="Connection key"
        placeholder="e.g. a1B2c3D4e5"
        class="key-dialog__input"
        @update:model-value="onInput(String($event ?? ''))"
        @keyup.enter="save"
      />
      <template #actions>
        <HBtn v-close-popup variant="tertiary" label="Cancel" />
        <HBtn
          label="Save and continue"
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

watch(
  () => props.modelValue,
  open => {
    if (open) keyInput.value = "";
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
</style>
