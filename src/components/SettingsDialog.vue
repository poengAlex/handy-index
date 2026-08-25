<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <HModal
      :title="$t('settings.title')"
      closable
      :close-label="$t('kit.close')"
      class="settings-modal"
    >
      <ModalScroll>
        <div class="settings-modal__stack">
          <LanguagePicker />

          <HList>
            <HToggleRow
              v-model="darkMode"
              icon="dark_mode"
              :label="$t('settings.display.darkModeLabel')"
              :caption="$t('settings.display.darkModeCaption')"
            />
            <HToggleRow
              v-model="settings.nsfw"
              icon="visibility"
              :label="$t('settings.display.nsfwLabel')"
              :caption="$t('settings.display.nsfwCaption')"
            />
            <HToggleRow
              v-model="settings.inlinePlayers"
              icon="play_circle"
              :label="$t('settings.display.playersLabel')"
              :caption="$t('settings.display.playersCaption')"
            />
            <HToggleRow
              v-model="settings.fullWidth"
              icon="fit_screen"
              :label="$t('settings.display.fullWidthLabel')"
              :caption="$t('settings.display.fullWidthCaption')"
            />
            <HToggleRow
              v-model="settings.background"
              icon="blur_on"
              :label="$t('settings.display.backgroundLabel')"
              :caption="$t('settings.display.backgroundCaption')"
            />
            <HListRow
              icon="block"
              :label="$t('settings.muted.label')"
              :caption="mutedCaption"
              :clickable="false"
            >
              <template #trailing>
                <HBtn
                  variant="tertiary"
                  size="sm"
                  :label="$t('common.action.manage')"
                  @click="mutedTagsOpen = true"
                />
              </template>
            </HListRow>
          </HList>

          <!-- only while the field is on: a look picker for a background
               nobody is rendering is a dead control -->
          <HList
            v-if="settings.background"
            :title="$t('settings.backgroundSceneTitle')"
          >
            <HRadioRow
              v-for="option in BACKGROUND_SCENES"
              :key="option"
              v-model="settings.backgroundScene"
              :val="option"
              :label="sceneLabel(option)"
            />
          </HList>

          <HList :title="$t('settings.orientationTitle')">
            <HRadioRow
              v-for="option in ORIENTATIONS"
              :key="option"
              v-model="settings.orientation"
              :val="option"
              :label="orientation(option)"
            />
          </HList>

          <HList :title="$t('settings.access.title')">
            <HToggleRow
              v-model="settings.showPremiumScripts"
              icon="workspace_premium"
              :label="$t('settings.access.premiumScriptsLabel')"
              :caption="$t('settings.access.premiumScriptsCaption')"
            />
            <HToggleRow
              v-model="settings.showPaidVideos"
              icon="paid"
              :label="$t('settings.access.premiumVideosLabel')"
              :caption="$t('settings.access.premiumVideosCaption')"
            />
          </HList>

          <div class="settings-modal__block">
            <div class="text-body-compact settings-modal__label">
              {{ $t("settings.previews.title") }}
            </div>
            <div
              class="text-caption settings-modal__hint settings-modal__hint--lead"
            >
              {{ $t("settings.previews.hint") }}
            </div>
            <HLabeledSlider
              :model-value="frameSeconds"
              :label="$t('settings.previews.imageSpeed')"
              v-bind="sliderAria($t('settings.previews.imageSpeed'))"
              unit="s"
              :min="PREVIEW_FRAME_MS.min / 1000"
              :max="PREVIEW_FRAME_MS.max / 1000"
              :step="PREVIEW_FRAME_MS.step / 1000"
              :decimals="1"
              :reset="PREVIEW_FRAME_MS.default / 1000"
              @update:model-value="setFrameSeconds"
            />
            <HLabeledSlider
              v-model="settings.previewClipRate"
              :label="$t('settings.previews.clipSpeed')"
              v-bind="sliderAria($t('settings.previews.clipSpeed'))"
              unit="×"
              :min="PREVIEW_CLIP_RATE.min"
              :max="PREVIEW_CLIP_RATE.max"
              :step="PREVIEW_CLIP_RATE.step"
              :decimals="2"
              :reset="PREVIEW_CLIP_RATE.default"
            />
          </div>

          <div>
            <div class="text-body-compact settings-modal__label">
              {{ $t("settings.connectionKey.label") }}
            </div>
            <q-input
              :model-value="settings.connectionKey"
              filled
              dense
              maxlength="32"
              :placeholder="$t('settings.connectionKey.placeholder')"
              :aria-label="$t('settings.connectionKey.label')"
              @update:model-value="onKeyInput(String($event ?? ''))"
            />
            <div class="text-caption settings-modal__hint">
              {{ $t("settings.connectionKey.hint") }}
            </div>
          </div>
        </div>
      </ModalScroll>

      <template #actions>
        <HBtn
          variant="tertiary"
          :label="$t('settings.clearDataAction')"
          @click="clearDataOpen = true"
        />
        <HBtn v-close-popup :label="$t('common.action.done')" />
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
import { useI18n } from "vue-i18n";
import {
  HBtn,
  HLabeledSlider,
  HList,
  HListRow,
  HRadioRow,
  HToggleRow,
  HModal,
  useHandyTheme
} from "@/components/handy";
import ClearDataDialog from "@/components/ClearDataDialog.vue";
import LanguagePicker from "@/components/LanguagePicker.vue";
import ModalScroll from "@/components/ModalScroll.vue";
import MutedTagsDialog from "@/components/MutedTagsDialog.vue";
import { useFormat } from "@/composables/useFormat";
import { useKitLabels } from "@/composables/useKitLabels";
import { sanitizeConnectionKey } from "@/services/format";
import { ORIENTATIONS } from "@/services/script-index/queries";
import { scene as backgroundScene } from "@/components/background";
import {
  BACKGROUND_SCENES,
  PREVIEW_CLIP_RATE,
  PREVIEW_FRAME_MS,
  useSettingsStore
} from "@/stores/settings";

defineProps<{ modelValue: boolean }>();

const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();

const { sliderAria } = useKitLabels();

const settings = useSettingsStore();
const { t } = useI18n();
const { num, orientation } = useFormat();

// theme lives outside the settings store (it's persisted by useHandyTheme
// under "handy-theme"), so the row proxies the shared state instead
const { dark, apply } = useHandyTheme();
const darkMode = computed({
  get: () => dark.value,
  set: (value: boolean) => apply(value)
});

// the store keeps milliseconds (it is a timer); the slider speaks seconds,
// which is the unit anyone reading "how long each image holds" thinks in
const frameSeconds = computed(() => settings.previewFrameMs / 1000);

function setFrameSeconds(value: number | { min: number; max: number }) {
  if (typeof value === "number") settings.previewFrameMs = value * 1000;
}

// Scene names are proper nouns the component already owns ("Handy", "Erin"),
// so they come from it rather than from the message bundles — a name that is
// the same in every language is not a translation, and duplicating it across
// ten locales only creates ten chances to disagree with upstream.
function sceneLabel(id: (typeof BACKGROUND_SCENES)[number]): string {
  return backgroundScene(id).label;
}

const clearDataOpen = ref(false);
const mutedTagsOpen = ref(false);

const mutedCaption = computed(() => {
  const muted = settings.mutedTags.length;
  return muted
    ? t("settings.muted.caption", { count: num(muted) }, muted)
    : t("settings.muted.empty");
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

// the sliders bring their own spacing, so the lead sits tight under the label
.settings-modal__hint--lead {
  margin: 0;
}

.settings-modal__block {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}
</style>
