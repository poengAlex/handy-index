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
  </q-page>
</template>

<script setup lang="ts">
// Playlist overview: everything lives in the settings store, so the page is
// fully synchronous — no catalog dependency, no loading state.
import { computed, ref } from "vue";
import { HBtn, HEmptyState, HNavCard } from "@/components/handy";
import { useSettingsStore, type Playlist } from "@/stores/settings";

const settings = useSettingsStore();

const newName = ref("");

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
