<template>
  <TileCard
    :to="`/videos/${video.partnerVideoId}`"
    :aria-label="video.title ?? $t('media.card.fallbackTitle')"
  >
    <template #media>
      <MediaPreview
        v-if="settings.nsfw && artwork"
        :poster="artwork"
        :images="video.images ?? []"
        :preview="video.preview ?? ''"
        :alt="video.title ?? $t('media.card.fallbackTitle')"
        class="tile-card__img"
      />
      <div v-else class="tile-card__placeholder">
        <q-icon name="movie" size="32px" />
      </div>
      <HChip v-if="isVr" label="VR" class="video-card__badge" />

      <!-- Right-click (or long-press) quick menu, anchored to the artwork -->
      <q-menu context-menu touch-position>
        <q-list dense class="video-card__menu">
          <q-item v-close-popup clickable @click="open">
            <q-item-section side>
              <q-icon name="play_arrow" size="20px" />
            </q-item-section>
            <q-item-section>{{ $t("media.menu.open") }}</q-item-section>
          </q-item>
          <q-item v-close-popup clickable @click="openNewTab">
            <q-item-section side>
              <q-icon name="open_in_new" size="20px" />
            </q-item-section>
            <q-item-section>{{ $t("media.menu.openNewTab") }}</q-item-section>
          </q-item>
          <q-separator />
          <q-item
            v-close-popup
            clickable
            @click="settings.toggleFavorite(video.partnerVideoId)"
          >
            <q-item-section side>
              <q-icon name="favorite" size="20px" />
            </q-item-section>
            <q-item-section>{{ favoriteLabel }}</q-item-section>
          </q-item>
          <q-item v-close-popup clickable @click="playlistDialog = true">
            <q-item-section side>
              <q-icon name="playlist_add" size="20px" />
            </q-item-section>
            <q-item-section>
              {{ $t("media.menu.addToPlaylist") }}
            </q-item-section>
          </q-item>
          <q-item
            v-if="video.scriptAccess === 'public'"
            v-close-popup
            clickable
            @click="downloadScript"
          >
            <q-item-section side>
              <q-icon name="download" size="20px" />
            </q-item-section>
            <q-item-section>
              {{ $t("media.menu.downloadScript") }}
            </q-item-section>
          </q-item>
          <q-item v-else disable>
            <q-item-section side>
              <q-icon name="workspace_premium" size="20px" />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{ $t("media.menu.downloadBlocked") }}
              </q-item-label>
              <q-item-label caption>
                {{ $t("media.menu.downloadBlockedCaption") }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item v-close-popup clickable @click="copyLink">
            <q-item-section side>
              <q-icon name="link" size="20px" />
            </q-item-section>
            <q-item-section>{{ $t("media.menu.copyLink") }}</q-item-section>
          </q-item>
          <q-item
            v-if="video.videoUrl"
            v-close-popup
            clickable
            @click="openOnSite"
          >
            <q-item-section side>
              <q-icon name="language" size="20px" />
            </q-item-section>
            <q-item-section>{{ watchLabel }}</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </template>
    <div class="text-body-compact video-card__title">
      {{ video.title }}
    </div>
    <div v-if="caption || ratingLabel" class="text-caption video-card__caption">
      <span>{{ caption }}</span>
      <span v-if="ratingLabel" class="video-card__rating">{{
        ratingLabel
      }}</span>
    </div>

    <AddToPlaylistDialog
      v-model="playlistDialog"
      :video-id="video.partnerVideoId"
    />

    <ConnectionKeyDialog v-model="keyDialog" @saved="downloadScript">
      {{ $t("media.keyDialog.body") }}
    </ConnectionKeyDialog>
  </TileCard>
</template>

<script setup lang="ts">
// The catalog media tile: TileCard with a 16:9 thumbnail well over two text
// lines. Explicit artwork only renders when the NSFW setting is on — which
// also gates the hover preview, since that is the same artwork in motion.
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { HChip, hToast } from "@/components/handy";
import AddToPlaylistDialog from "@/components/AddToPlaylistDialog.vue";
import ConnectionKeyDialog from "@/components/ConnectionKeyDialog.vue";
import MediaPreview from "@/components/MediaPreview.vue";
import TileCard from "@/components/TileCard.vue";
import { useFormat } from "@/composables/useFormat";
import { downloadFreeScript } from "@/services/script-download";
import { artworkOf } from "@/services/script-index/queries";
import type { PartnerVideo } from "@/services/script-index/types";
import { useSettingsStore } from "@/stores/settings";

const props = defineProps<{ video: PartnerVideo }>();

const router = useRouter();
const settings = useSettingsStore();
const { t } = useI18n();
const { duration, num } = useFormat();

const artwork = computed(() => artworkOf(props.video));

const isVr = computed(() => props.video.format?.format === "vr");

const caption = computed(() =>
  [props.video.partnerName, duration(props.video.duration)]
    .filter(Boolean)
    .join(" · ")
);

const ratingLabel = computed(() =>
  props.video.rating
    ? t("media.card.rating", { rating: num(Math.round(props.video.rating)) })
    : ""
);

// --- quick menu ---

const playlistDialog = ref(false);

const detailPath = computed(() => `/videos/${props.video.partnerVideoId}`);

const favorite = computed(() =>
  settings.isFavorite(props.video.partnerVideoId)
);

const favoriteLabel = computed(() =>
  favorite.value ? t("media.menu.removeFavorite") : t("media.menu.addFavorite")
);

// the partner name is catalog data, so it stays untranslated inside the
// message — but an entry without one needs a sentence of its own rather than
// a translated word dropped into the slot
const watchLabel = computed(() =>
  props.video.partnerName
    ? t("media.menu.watchOn", { site: props.video.partnerName })
    : t("media.menu.watchOnSite")
);

/** absolute URL to the detail page — hash-router aware via resolve() */
function detailUrl(): string {
  return new URL(router.resolve(detailPath.value).href, window.location.href)
    .href;
}

function open() {
  void router.push(detailPath.value);
}

function openNewTab() {
  window.open(detailUrl(), "_blank", "noopener");
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(detailUrl());
    hToast("positive", t("media.toast.linkCopied"));
  } catch {
    hToast("negative", t("media.toast.linkCopyFailed"));
  }
}

function openOnSite() {
  if (props.video.videoUrl) {
    window.open(props.video.videoUrl, "_blank", "noopener");
  }
}

// --- script download (free scripts only — the menu item is hidden otherwise) ---

const keyDialog = ref(false);

async function downloadScript() {
  const key = settings.connectionKey.trim();
  if (!key) {
    keyDialog.value = true;
    return;
  }
  try {
    await downloadFreeScript(props.video, key);
    hToast("positive", t("media.toast.scriptDownloaded"));
  } catch {
    hToast(
      "negative",
      t("media.toast.scriptFailedTitle"),
      t("media.toast.scriptFailedBody")
    );
  }
}
</script>

<style scoped lang="scss">
.video-card__badge {
  position: absolute;
  top: var(--space-xs);
  left: var(--space-xs);
}

.video-card__title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  min-height: 2.66em; // two compact lines, so cards in a row stay equal
}

.video-card__caption {
  color: var(--color-text-tertiary);
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-xs);
}

.video-card__rating {
  white-space: nowrap;
}
</style>

<style lang="scss">
// unscoped — the menu teleports to the body, outside this component's scope
.video-card__menu {
  min-width: 200px;
  font-family: var(--font-brand);
}
</style>
