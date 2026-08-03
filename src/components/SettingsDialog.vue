<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <HModal title="Settings" closable class="settings-modal">
      <div class="settings-modal__stack">
        <HList>
          <HToggleRow
            v-model="settings.nsfw"
            icon="visibility"
            label="Explicit previews"
            caption="Show real artwork instead of neutral tiles"
          />
          <HToggleRow
            v-model="settings.showPremium"
            icon="workspace_premium"
            label="Premium videos"
            caption="Include videos without a free script"
          />
        </HList>

        <HList title="Orientation">
          <HRadioRow
            v-for="option in ORIENTATIONS"
            :key="option"
            v-model="settings.orientation"
            :val="option"
            :label="ORIENTATION_LABELS[option]"
          />
        </HList>

        <div>
          <div class="text-body-compact settings-modal__label">
            Connection key
          </div>
          <q-input
            :model-value="settings.connectionKey"
            filled
            dense
            maxlength="32"
            placeholder="e.g. a1B2c3D4e5"
            aria-label="Connection key"
            @update:model-value="onKeyInput(String($event ?? ''))"
          />
          <div class="text-caption settings-modal__hint">
            Your Handy connection key, used when downloading scripts.
          </div>
        </div>
      </div>

      <template #actions>
        <HBtn variant="tertiary" label="Clear all data" @click="clearAll" />
        <HBtn v-close-popup label="Done" />
      </template>
    </HModal>
  </q-dialog>
</template>

<script setup lang="ts">
import { nextTick } from "vue";
import {
  HBtn,
  HList,
  HRadioRow,
  HToggleRow,
  HModal,
  hToast
} from "@/components/handy";
import { sanitizeConnectionKey } from "@/services/format";
import { ORIENTATIONS } from "@/services/script-index/queries";
import type { Orientation } from "@/services/script-index/queries";
import { useSettingsStore } from "@/stores/settings";

defineProps<{ modelValue: boolean }>();

const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();

const ORIENTATION_LABELS: Record<Orientation, string> = {
  straight: "Straight",
  gay: "Gay",
  trans: "Trans",
  all: "Everything"
};

const settings = useSettingsStore();

// force a change cycle when sanitizing strips the typed char back to the
// stored value — otherwise the controlled q-input keeps showing the bad char
async function onKeyInput(raw: string) {
  const clean = sanitizeConnectionKey(raw);
  if (clean !== raw) {
    settings.connectionKey = raw;
    await nextTick();
  }
  settings.connectionKey = clean;
}

function clearAll() {
  settings.clearAll();
  emit("update:modelValue", false);
  hToast("info", "All local data cleared");
}
</script>

<style scoped lang="scss">
.settings-modal {
  width: min(480px, 100%);
}

.settings-modal__stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.settings-modal__label {
  color: var(--color-text-primary);
  margin-bottom: var(--space-xs);
}

.settings-modal__hint {
  color: var(--color-text-tertiary);
  margin-top: var(--space-xs);
}
</style>
