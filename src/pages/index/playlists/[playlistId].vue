<template>
  <q-page class="playlist-page h-section">
    <div v-if="!playlist" class="h-container playlist-page__center">
      <HEmptyState
        icon="playlist_remove"
        title="Playlist not found"
        body="This playlist doesn't exist anymore, or the link is wrong."
        action-label="All playlists"
        @action="router.push('/playlists')"
      />
    </div>

    <div v-else class="h-container">
      <header class="playlist-page__header">
        <div class="playlist-page__heading">
          <h1 class="text-h2 playlist-page__title">{{ playlist.name }}</h1>
          <p class="text-body-sm playlist-page__count">{{ countLabel }}</p>
        </div>
        <div class="playlist-page__actions">
          <HBtn
            v-if="freeCount"
            variant="secondary"
            icon="download"
            :label="
              bulkBusy
                ? `Getting ${bulkDone}/${freeCount}…`
                : `Get all scripts (${freeCount})`
            "
            :disable="bulkBusy"
            @click="downloadAllScripts"
          />
          <HBtn
            v-if="videos.length"
            variant="tertiary"
            :label="editing ? 'Done' : 'Edit'"
            @click="editing = !editing"
          />
          <q-btn
            flat
            round
            icon="ios_share"
            aria-label="Share playlist"
            title="Share or export this playlist"
            class="playlist-page__icon-btn"
            @click="shareOpen = true"
          />
          <q-btn
            flat
            round
            icon="edit"
            aria-label="Rename"
            class="playlist-page__icon-btn"
            @click="openRename"
          />
          <q-btn
            flat
            round
            icon="delete"
            aria-label="Delete"
            class="playlist-page__icon-btn"
            @click="deleteOpen = true"
          />
        </div>
      </header>

      <div v-if="catalog.status === 'error'" class="playlist-page__center">
        <HEmptyState
          icon="cloud_off"
          title="Couldn't load the catalog"
          body="The script index didn't answer. Check your connection and try again."
          action-label="Try again"
          @action="catalog.retry()"
        />
      </div>

      <div
        v-else-if="catalog.status !== 'ready'"
        class="playlist-page__loading"
      >
        <HandyLoader />
      </div>

      <template v-else>
        <div v-if="!videos.length" class="playlist-page__center">
          <HEmptyState
            icon="playlist_add"
            title="Nothing here yet"
            body="Use the playlist button on any video page to add videos here."
            action-label="Browse videos"
            @action="router.push('/videos')"
          />
        </div>

        <!-- Edit mode renders the grid itself so every card can carry a
             remove button on top of the artwork -->
        <div v-else-if="editing" class="playlist-page__grid">
          <div
            v-for="video in videos"
            :key="video.partnerVideoId"
            class="playlist-page__cell"
          >
            <VideoCard :video="video" />
            <q-btn
              round
              dense
              unelevated
              icon="close"
              size="sm"
              aria-label="Remove from playlist"
              class="playlist-page__remove"
              @click="
                settings.toggleInPlaylist(playlist.id, video.partnerVideoId)
              "
            />
          </div>
        </div>
        <VideoGrid v-else :videos="videos" />
      </template>
    </div>

    <!-- Rename -->
    <q-dialog v-model="renameOpen">
      <HModal title="Rename playlist" closable>
        <q-input
          :model-value="renameInput"
          filled
          label="Playlist name"
          maxlength="60"
          autofocus
          @update:model-value="renameInput = String($event ?? '')"
          @keyup.enter="saveRename"
        />
        <template #actions>
          <HBtn
            label="Save"
            :disable="!renameInput.trim()"
            @click="saveRename"
          />
        </template>
      </HModal>
    </q-dialog>

    <!-- Share: the export JSON as text, a file, or a temporary paste link -->
    <q-dialog v-model="shareOpen">
      <HModal title="Share playlist" closable class="playlist-page__share">
        <div class="playlist-page__share-stack">
          <q-input
            :model-value="exportText"
            type="textarea"
            filled
            readonly
            aria-label="Playlist export JSON"
            :input-style="{
              minHeight: '160px',
              fontFamily: 'monospace',
              fontSize: '12px'
            }"
          />
          <template v-if="shareUrl">
            <q-input
              :model-value="shareUrl"
              filled
              dense
              readonly
              aria-label="Share link"
            >
              <template #append>
                <q-btn
                  flat
                  round
                  dense
                  icon="content_copy"
                  aria-label="Copy share link"
                  @click="copyShareUrl"
                />
              </template>
            </q-input>
            <p class="text-caption playlist-page__share-hint">
              Anyone with the link can import this playlist. The paste is
              temporary — it expires after about 90 days.
            </p>
          </template>
        </div>
        <template #actions>
          <HBtn variant="tertiary" label="Copy JSON" @click="copyExportText" />
          <HBtn variant="tertiary" label="Save file" @click="exportThis" />
          <HBtn
            :label="shareUrl ? 'New share link' : 'Create share link'"
            :loading="sharing"
            @click="createShareLink"
          />
        </template>
      </HModal>
    </q-dialog>

    <!-- Connection key prompt for the bulk script download -->
    <ConnectionKeyDialog v-model="keyDialog" @saved="downloadAllScripts">
      Scripts are bound to your Handy. Enter the connection key from the Handy
      app to continue.
    </ConnectionKeyDialog>

    <!-- Delete confirm -->
    <q-dialog v-model="deleteOpen">
      <HModal :title="`Delete '${playlist?.name ?? ''}'?`">
        The videos stay in the catalog — only the playlist goes away.
        <template #actions>
          <HBtn variant="tertiary" label="Cancel" @click="deleteOpen = false" />
          <HBtn
            variant="danger"
            label="Delete playlist"
            @click="confirmDelete"
          />
        </template>
      </HModal>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
// One playlist as a page: the videos in the order they were added, with
// rename/delete and an edit mode for pulling videos out. Playlists are
// intentionally ungated, like favorites — you curated them yourself.
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  HBtn,
  HEmptyState,
  HModal,
  HandyLoader,
  hToast
} from "@/components/handy";
import ConnectionKeyDialog from "@/components/ConnectionKeyDialog.vue";
import VideoCard from "@/components/VideoCard.vue";
import VideoGrid from "@/components/VideoGrid.vue";
import {
  exportPlaylist,
  playlistExportText,
  uploadPlaylistPaste
} from "@/services/playlist-transfer";
import { downloadFreeScript } from "@/services/script-download";
import { inOrder } from "@/services/script-index/queries";
import { useCatalogStore } from "@/stores/catalog";
import { useSettingsStore } from "@/stores/settings";

const route = useRoute("//playlists/[playlistId]");
const router = useRouter();
const catalog = useCatalogStore();
const settings = useSettingsStore();

const playlist = computed(() =>
  settings.playlists.find(item => item.id === route.params.playlistId)
);

const videos = computed(() =>
  playlist.value && catalog.status === "ready"
    ? inOrder(catalog.videos, playlist.value.videoIds)
    : []
);

const countLabel = computed(() => {
  const count =
    catalog.status === "ready"
      ? videos.value.length
      : (playlist.value?.videoIds.length ?? 0);
  return `${count.toLocaleString()} ${count === 1 ? "video" : "videos"}`;
});

// --- edit mode (remove videos) ---

const editing = ref(false);

// --- share / export ---

const shareOpen = ref(false);
const shareUrl = ref("");
const sharing = ref(false);

// stale links shouldn't linger into the next open — the list may have changed
watch(shareOpen, open => {
  if (!open) shareUrl.value = "";
});

const exportText = computed(() =>
  playlist.value ? playlistExportText(playlist.value) : ""
);

function exportThis() {
  if (playlist.value) exportPlaylist(playlist.value);
}

async function copyExportText() {
  try {
    await navigator.clipboard.writeText(exportText.value);
    hToast("positive", "JSON copied");
  } catch {
    hToast("negative", "Couldn't copy the JSON");
  }
}

async function copyShareUrl() {
  try {
    await navigator.clipboard.writeText(shareUrl.value);
    hToast("positive", "Share link copied");
  } catch {
    hToast("negative", "Couldn't copy the link");
  }
}

async function createShareLink() {
  const current = playlist.value;
  if (!current || sharing.value) return;
  sharing.value = true;
  try {
    shareUrl.value = await uploadPlaylistPaste(current);
    try {
      await navigator.clipboard.writeText(shareUrl.value);
      hToast(
        "positive",
        "Share link copied",
        "Anyone with the link can import this playlist."
      );
    } catch {
      hToast("positive", "Share link created");
    }
  } catch {
    hToast(
      "negative",
      "Couldn't create a share link",
      "The paste service didn't answer. Copy the JSON instead."
    );
  } finally {
    sharing.value = false;
  }
}

// --- bulk script download ---

const keyDialog = ref(false);
const bulkBusy = ref(false);
const bulkDone = ref(0);

/** videos the index marks as having a free script — the only downloadables */
const freeVideos = computed(() =>
  videos.value.filter(video => video.scriptAccess === "public")
);

const freeCount = computed(() => freeVideos.value.length);

async function downloadAllScripts() {
  if (bulkBusy.value || !freeCount.value) return;
  const key = settings.connectionKey.trim();
  if (!key) {
    keyDialog.value = true;
    return;
  }
  bulkBusy.value = true;
  bulkDone.value = 0;
  let failed = 0;
  for (const video of freeVideos.value) {
    try {
      await downloadFreeScript(video, key);
    } catch {
      failed += 1;
    }
    bulkDone.value += 1;
  }
  bulkBusy.value = false;
  const saved = freeCount.value - failed;
  if (!saved) {
    hToast(
      "negative",
      "Couldn't get the scripts",
      "Check your connection key and try again."
    );
  } else if (failed) {
    hToast(
      "info",
      "Scripts downloaded",
      `${saved.toLocaleString()} saved, ${failed.toLocaleString()} failed.`
    );
  } else {
    hToast(
      "positive",
      "Scripts downloaded",
      `${saved.toLocaleString()} script${saved === 1 ? "" : "s"} saved.`
    );
  }
}

// --- rename ---

const renameOpen = ref(false);
const renameInput = ref("");

function openRename() {
  renameInput.value = playlist.value?.name ?? "";
  renameOpen.value = true;
}

function saveRename() {
  const current = playlist.value;
  const name = renameInput.value.trim();
  if (!current || !name) return;
  settings.renamePlaylist(current.id, name);
  renameOpen.value = false;
}

// --- delete ---

const deleteOpen = ref(false);

function confirmDelete() {
  const current = playlist.value;
  if (!current) return;
  deleteOpen.value = false;
  settings.deletePlaylist(current.id);
  void router.replace("/playlists");
  hToast("positive", "Playlist deleted", `'${current.name}' is gone.`);
}
</script>

<style scoped lang="scss">
.playlist-page {
  padding-bottom: var(--space-3xl);
}

.playlist-page__center {
  display: flex;
  justify-content: center;
  padding-top: var(--space-xl);
}

.playlist-page__loading {
  min-height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.playlist-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
}

.playlist-page__heading {
  min-width: 0;
}

.playlist-page__title {
  margin: 0;
  overflow-wrap: anywhere;
}

.playlist-page__count {
  color: var(--color-text-tertiary);
  margin: var(--space-xs) 0 0;
}

.playlist-page__actions {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.playlist-page__icon-btn {
  color: var(--color-text-secondary);
}

.playlist-page__share {
  width: min(520px, 100%);
}

.playlist-page__share-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.playlist-page__share-hint {
  color: var(--color-text-tertiary);
  margin: 0;
}

// same responsive contract as VideoGrid — owned here so cells can layer a
// remove button over each card
.playlist-page__grid {
  display: grid;
  gap: var(--space-sm);
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}

.playlist-page__cell {
  position: relative;
}

// card surface + hairline ring so the button reads on any artwork
.playlist-page__remove {
  position: absolute;
  top: var(--space-xs);
  right: var(--space-xs);
  z-index: 1;
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  box-shadow: 0 0 0 1px var(--color-stroke-default);
}
</style>
