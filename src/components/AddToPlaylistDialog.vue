<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <HModal :title="$t('playlists.add.title')" closable>
      <HList v-if="settings.playlists.length" class="playlist-dialog__list">
        <HToggleRow
          v-for="playlist in settings.playlists"
          :key="playlist.id"
          :model-value="settings.isInPlaylist(playlist.id, videoId)"
          :label="playlist.name"
          :caption="countLabel(playlist)"
          icon="playlist_play"
          @update:model-value="settings.toggleInPlaylist(playlist.id, videoId)"
        />
      </HList>
      <p v-else class="text-body-sm playlist-dialog__empty">
        {{ $t("playlists.add.empty") }}
      </p>

      <div class="playlist-dialog__create">
        <q-input
          :model-value="newName"
          filled
          dense
          :label="$t('playlists.newLabel')"
          :placeholder="$t('playlists.newPlaceholder')"
          maxlength="60"
          class="playlist-dialog__input"
          @update:model-value="newName = String($event ?? '')"
          @keyup.enter="create"
        />
        <HBtn
          variant="secondary"
          :label="$t('common.action.create')"
          :disable="!newName.trim()"
          @click="create"
        />
      </div>

      <template #actions>
        <HBtn v-close-popup :label="$t('common.action.done')" />
      </template>
    </HModal>
  </q-dialog>
</template>

<script setup lang="ts">
// Membership editor for one video: toggle it in and out of any playlist,
// or create a new playlist (which includes the video right away).
import { ref } from "vue";
import { HBtn, HList, HModal, HToggleRow } from "@/components/handy";
import { useFormat } from "@/composables/useFormat";
import { useSettingsStore, type Playlist } from "@/stores/settings";

const props = defineProps<{ modelValue: boolean; videoId: string }>();

const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();

const settings = useSettingsStore();
const format = useFormat();
const newName = ref("");

function countLabel(playlist: Playlist): string {
  return format.count("videos", playlist.videoIds.length);
}

function create() {
  const name = newName.value.trim();
  if (!name) return;
  const playlist = settings.createPlaylist(name);
  settings.toggleInPlaylist(playlist.id, props.videoId);
  newName.value = "";
}
</script>

<style scoped lang="scss">
.playlist-dialog__list {
  max-height: 40vh;
  overflow-y: auto;
}

.playlist-dialog__empty {
  color: var(--color-text-tertiary);
  margin: 0;
}

.playlist-dialog__create {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin-top: var(--space-sm);
}

.playlist-dialog__input {
  flex: 1;
}
</style>
