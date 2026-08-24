<template>
  <q-page class="playlists-page h-section">
    <div class="h-container">
      <header class="playlists-page__head">
        <h1 class="text-h2 playlists-page__title">
          {{ $t("playlists.title") }}
        </h1>
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
          :label="$t('playlists.newLabel')"
          maxlength="60"
          class="playlists-page__input"
          @update:model-value="newName = String($event ?? '')"
          @keyup.enter="create"
        />
        <HBtn
          variant="secondary"
          :label="$t('common.action.create')"
          :disable="!newName.trim()"
          @click="create"
        />
        <HBtn
          variant="tertiary"
          icon="upload"
          :label="$t('common.action.import')"
          :title="$t('playlists.importHint')"
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
          :title="$t('playlists.emptyTitle')"
          :body="$t('playlists.emptyBody')"
        />
      </div>
    </div>

    <!-- Import: paste an export (or share link), or pick the .json file -->
    <q-dialog v-model="importOpen">
      <HModal
        :title="$t('playlists.import.title')"
        closable
        :close-label="$t('kit.close')"
        class="playlists-page__import"
      >
        <q-input
          v-model="importText"
          type="textarea"
          filled
          :placeholder="$t('playlists.import.placeholder')"
          :aria-label="$t('playlists.import.inputAria')"
          :input-style="{ minHeight: '140px', fontFamily: 'monospace' }"
        />
        <template #actions>
          <HBtn
            variant="tertiary"
            :label="$t('playlists.import.chooseFile')"
            @click="importInput?.click()"
          />
          <HBtn
            :label="$t('common.action.import')"
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
import { useI18n } from "vue-i18n";
import {
  HBtn,
  HEmptyState,
  HModal,
  HNavCard,
  hToast
} from "@/components/handy";
import { useFormat } from "@/composables/useFormat";
import {
  PlaylistImportError,
  parsePlaylistExport,
  resolveImportText,
  type ImportedPlaylist
} from "@/services/playlist-transfer";
import { useSettingsStore, type Playlist } from "@/stores/settings";

const settings = useSettingsStore();
const { t, n } = useI18n();
const format = useFormat();

const newName = ref("");
const importInput = ref<HTMLInputElement>();
const importOpen = ref(false);
const importText = ref("");
const importing = ref(false);

function finishImport(parsed: ImportedPlaylist): void {
  // an export with no name of its own still has to become a named playlist,
  // and naming it is UI copy — the parser has no locale to write it in
  const name = parsed.name || t("playlists.import.defaultName");
  const playlist = settings.importPlaylist(name, parsed.videoIds);
  const count = playlist.videoIds.length;
  importOpen.value = false;
  importText.value = "";
  hToast(
    "positive",
    t("playlists.import.doneTitle"),
    t(
      "playlists.import.doneBody",
      { name: playlist.name, count: n(count) },
      count
    )
  );
}

function toastImportError(error: unknown): void {
  // the parser throws a code, not a sentence; the sentence lives here
  const code = error instanceof PlaylistImportError ? error.code : "unknown";
  hToast(
    "negative",
    t("playlists.import.failedTitle"),
    t(`playlists.import.error.${code}`)
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

const countLabel = computed(() =>
  format.count("playlists", settings.playlists.length)
);

function videoCountLabel(playlist: Playlist): string {
  return format.count("videos", playlist.videoIds.length);
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
