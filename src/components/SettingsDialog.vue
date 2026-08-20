<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <HModal title="Settings" closable class="settings-modal">
      <ModalScroll>
        <div class="settings-modal__stack">
          <HList>
            <HToggleRow
              v-model="settings.nsfw"
              icon="visibility"
              label="Explicit previews"
              caption="Show real artwork instead of neutral tiles"
            />
            <HToggleRow
              v-model="settings.inlinePlayers"
              icon="play_circle"
              label="Embedded players"
              caption="Play Pornhub and xHamster videos right on the video page"
            />
            <HToggleRow
              v-model="settings.fullWidth"
              icon="fit_screen"
              label="Full-width layout"
              caption="Use the whole screen instead of a centered column"
            />
            <HListRow
              icon="block"
              label="Muted tags"
              :caption="mutedCaption"
              :clickable="false"
            >
              <template #trailing>
                <HBtn
                  variant="tertiary"
                  size="sm"
                  label="Manage"
                  @click="mutedTagsOpen = true"
                />
              </template>
            </HListRow>
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

          <HList title="Script access">
            <HRadioRow
              v-for="option in ACCESS_FILTERS"
              :key="option"
              v-model="settings.scriptFilter"
              :val="option"
              :icon="ACCESS_FILTER_ICONS[option]"
              :label="SCRIPT_FILTER_LABELS[option]"
              :caption="SCRIPT_CAPTIONS[option]"
            />
          </HList>

          <HList title="Video access">
            <HRadioRow
              v-for="option in ACCESS_FILTERS"
              :key="option"
              v-model="settings.videoFilter"
              :val="option"
              :icon="ACCESS_FILTER_ICONS[option]"
              :label="VIDEO_FILTER_LABELS[option]"
              :caption="VIDEO_CAPTIONS[option]"
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

          <HNavCard
            v-close-popup
            icon="help"
            label="Help & features"
            caption="Everything you can do on this site"
            to="/help"
          />
        </div>
      </ModalScroll>

      <template #actions>
        <HBtn
          variant="tertiary"
          label="Clear data…"
          @click="clearDataOpen = true"
        />
        <HBtn v-close-popup label="Done" />
      </template>
    </HModal>
  </q-dialog>

  <ClearDataDialog
    v-model="clearDataOpen"
    @cleared-all="emit('update:modelValue', false)"
  />

  <MutedTagsDialog v-model="mutedTagsOpen" />
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import {
  HBtn,
  HList,
  HListRow,
  HNavCard,
  HRadioRow,
  HToggleRow,
  HModal
} from "@/components/handy";
import ClearDataDialog from "@/components/ClearDataDialog.vue";
import ModalScroll from "@/components/ModalScroll.vue";
import MutedTagsDialog from "@/components/MutedTagsDialog.vue";
import { sanitizeConnectionKey } from "@/services/format";
import {
  ACCESS_FILTERS,
  ACCESS_FILTER_ICONS,
  ORIENTATIONS,
  ORIENTATION_LABELS,
  SCRIPT_FILTER_LABELS,
  VIDEO_FILTER_LABELS
} from "@/services/script-index/queries";
import type { AccessFilter } from "@/services/script-index/queries";
import { useSettingsStore } from "@/stores/settings";

// Two paywalls, and the labels alone don't say which is which — settings has
// the room to spell it out (the browse filter sheet carries the labels
// alone). The script one is what this catalog is for, so it leads.
const SCRIPT_CAPTIONS: Record<AccessFilter, string> = {
  all: "Free and premium scripts",
  free: "Only scripts you can download for free",
  premium: "Only scripts behind the Handy paywall"
};

const VIDEO_CAPTIONS: Record<AccessFilter, string> = {
  all: "However the video itself is gated",
  free: "Only videos you can watch for free",
  premium: "Only videos behind the partner's paywall"
};

defineProps<{ modelValue: boolean }>();

const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();

const settings = useSettingsStore();

const clearDataOpen = ref(false);
const mutedTagsOpen = ref(false);

const mutedCaption = computed(() => {
  const count = settings.mutedTags.length;
  return count
    ? `${count} tag${count === 1 ? "" : "s"} muted`
    : "Nothing muted";
});

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
