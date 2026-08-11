<template>
  <q-page class="playlists-page h-section">
    <div class="h-container">
      <header class="playlists-page__head">
        <h1 class="text-h2 playlists-page__title">Playlists</h1>
        <p
          v-if="settings.playlists.length"
          class="text-body-sm playlists-page__count"
        >
          {{ countLabel }}
        </p>
      </header>

      <div class="playlists-page__create">
        <q-input
          :model-value="newName"
          filled
          dense
          label="New playlist"
          maxlength="60"
          class="playlists-page__input"
          @update:model-value="newName = String($event ?? '')"
          @keyup.enter="create"
        />
        <HBtn
          variant="secondary"
          label="Create"
          :disable="!newName.trim()"
          @click="create"
        />
        <HBtn
          variant="tertiary"
          icon="upload"
          label="Import"
          title="Import a playlist exported from this site"
          @click="importOpen = true"
        />
      </div>

      <div v-if="settings.playlists.length" class="playlists-page__grid">
        <HNavCard
          v-for="playlist in settings.playlists"
          :key="playlist.id"
          icon="playlist_play"
          :label="playlist.name"
          :caption="videoCountLabel(playlist)"
          :to="`/playlists/${playlist.id}`"
        />
      </div>
      <div v-else class="playlists-page__empty">
        <HEmptyState
          icon="playlist_add"
          title="No playlists yet"
          body="Create one right here, or use the playlist button on any video page to start one from a video you like."
        />
      </div>
    </div>

    <!-- Import: paste an export (or share link), or pick the .json file -->
    <q-dialog v-model="importOpen">
      <HModal title="Import playlist" closable class="playlists-page__import">
        <q-input
          v-model="importText"
          type="textarea"
          filled
          placeholder="Paste a playlist export (JSON) or a pastes.dev link"
          aria-label="Playlist export text or share link"
          :input-style="{ minHeight: '140px', fontFamily: 'monospace' }"
        />
        <template #actions>
          <HBtn
            variant="tertiary"
            label="Choose file…"
            @click="importInput?.click()"
          />
          <HBtn
            label="Import"
            :loading="importing"
            :disable="!importText.trim()"
            @click="importFromText"
          />
        </template>
      </HModal>
    </q-dialog>
    <input
      ref="importInput"
      type="file"
      accept=".json,application/json"
      class="playlists-page__file"
      aria-hidden="true"
      tabindex="-1"
      @change="onImportFile"
    />
  </q-page>
</template>

<script setup lang="ts">
// Playlist overview: everything lives in the settings store, so the page is
// fully synchronous — no catalog dependency, no loading state.
import { computed, ref } from "vue";
import {
  HBtn,
  HEmptyState,
  HModal,
  HNavCard,
  hToast
} from "@/components/handy";
import {
  PlaylistImportError,
  parsePlaylistExport,
  resolveImportText,
  type ImportedPlaylist
} from "@/services/playlist-transfer";
import { useSettingsStore, type Playlist } from "@/stores/settings";

const settings = useSettingsStore();

const newName = ref("");
const importInput = ref<HTMLInputElement>();
const importOpen = ref(false);
const importText = ref("");
const importing = ref(false);

function finishImport(parsed: ImportedPlaylist): void {
  const playlist = settings.importPlaylist(parsed.name, parsed.videoIds);
  const count = playlist.videoIds.length;
  importOpen.value = false;
  importText.value = "";
  hToast(
    "positive",
    "Playlist imported",
    `'${playlist.name}' — ${count.toLocaleString()} video${count === 1 ? "" : "s"}.`
  );
}

function toastImportError(error: unknown): void {
  hToast(
    "negative",
    "Couldn't import that",
    error instanceof PlaylistImportError
      ? error.message
      : "Something went wrong reading the export."
  );
}

async function importFromText() {
  if (importing.value) return;
  importing.value = true;
  try {
    finishImport(await resolveImportText(importText.value));
  } catch (error) {
    toastImportError(error);
  } finally {
    importing.value = false;
  }
}

async function onImportFile(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  // reset so picking the same file again re-fires change
  input.value = "";
  if (!file) return;
  try {
    finishImport(parsePlaylistExport(await file.text()));
  } catch (error) {
    toastImportError(error);
  }
}

const countLabel = computed(() => {
  const count = settings.playlists.length;
  return `${count.toLocaleString()} ${count === 1 ? "playlist" : "playlists"}`;
});

function videoCountLabel(playlist: Playlist): string {
  const count = playlist.videoIds.length;
  return `${count.toLocaleString()} video${count === 1 ? "" : "s"}`;
}

function create() {
  const name = newName.value.trim();
  if (!name) return;
  settings.createPlaylist(name);
  newName.value = "";
}
</script>

<style scoped lang="scss">
.playlists-page {
  padding-bottom: var(--space-3xl);
}

.playlists-page__head {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.playlists-page__title {
  margin: 0;
}

.playlists-page__count {
  margin: 0;
  color: var(--color-text-tertiary);
}

.playlists-page__create {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-top: var(--space-md);
}

.playlists-page__input {
  flex: 1 1 260px;
  max-width: 420px;
}

.playlists-page__file {
  display: none;
}

.playlists-page__import {
  width: min(480px, 100%);
}

.playlists-page__grid {
  display: grid;
  gap: var(--space-sm);
  grid-template-columns: 1fr;
  margin-top: var(--space-lg);

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1440px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.playlists-page__empty {
  display: flex;
  justify-content: center;
  padding-top: var(--space-xl);
}
</style>
