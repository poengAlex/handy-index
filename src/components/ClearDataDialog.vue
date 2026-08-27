<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <HModal :title="$t('settings.clear.title')" closable class="clear-data">
      <p class="text-body-sm clear-data__lead">
        {{ $t("settings.clear.lead") }}
      </p>

      <HList>
        <HListRow
          v-for="row in rows"
          :key="row.key"
          :icon="row.icon"
          :label="row.label"
          :caption="row.caption"
          :clickable="false"
        >
          <template #trailing>
            <HBtn
              variant="tertiary"
              size="sm"
              :label="$t('common.action.clear')"
              :disable="row.empty"
              @click="clearRow(row)"
            />
          </template>
        </HListRow>
      </HList>

      <template #actions>
        <HBtn
          variant="danger"
          :label="$t('settings.clear.clearAll')"
          @click="clearAll"
        />
        <HBtn v-close-popup :label="$t('common.action.done')" />
      </template>
    </HModal>
  </q-dialog>
</template>

<script setup lang="ts">
// Granular local-storage housekeeping: every category the settings store
// persists, clearable on its own. "Clear all data" (the old settings button)
// lives here too and still wipes everything including consent.
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { HBtn, HList, HListRow, HModal, hToast } from "@/components/handy";
import { useFormat } from "@/composables/useFormat";
import {
  PREVIEW_CLIP_RATE,
  PREVIEW_FRAME_MS,
  useSettingsStore
} from "@/stores/settings";

defineProps<{ modelValue: boolean }>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  /** everything was wiped — the parent settings dialog closes too */
  "cleared-all": [];
}>();

const settings = useSettingsStore();
const { t } = useI18n();
const { count, num } = useFormat();

interface ClearRow {
  key: string;
  icon: string;
  label: string;
  caption: string;
  /** what the toast says after this row is cleared — the verb is not the
   * same for every row, so the message can't be built from the label */
  toast: string;
  empty: boolean;
  clear: () => void;
}

const rows = computed<ClearRow[]>(() => {
  const ratingCount = Object.keys(settings.scriptVotes).length;
  const upvoteCount = settings.requestUpvotes.length;
  const votes = ratingCount + upvoteCount;
  // a list of what is stored, not a sentence — the middot is a separator and
  // each side is a whole message
  const voteCaption = [
    ratingCount
      ? t(
          "settings.clear.ratingCount",
          { count: num(ratingCount) },
          ratingCount
        )
      : "",
    upvoteCount
      ? t(
          "settings.clear.requestVoteCount",
          { count: num(upvoteCount) },
          upvoteCount
        )
      : ""
  ]
    .filter(Boolean)
    .join(" · ");
  const preferencesTouched =
    settings.nsfw ||
    settings.showPremiumScripts ||
    !settings.showPaidVideos ||
    settings.previewFrameMs !== PREVIEW_FRAME_MS.default ||
    settings.previewClipRate !== PREVIEW_CLIP_RATE.default ||
    settings.inlinePlayers ||
    settings.orientation !== "straight";
  return [
    {
      key: "recent",
      icon: "history",
      label: t("settings.clear.recentLabel"),
      caption: count("videos", settings.recentlyViewed.length),
      toast: t("settings.clear.recentToast"),
      empty: !settings.recentlyViewed.length,
      clear: settings.clearRecentlyViewed
    },
    {
      key: "favorites",
      icon: "favorite",
      label: t("settings.clear.favoritesLabel"),
      caption: count("videos", settings.favorites.length),
      toast: t("settings.clear.favoritesToast"),
      empty: !settings.favorites.length,
      clear: settings.clearFavorites
    },
    {
      key: "playlists",
      icon: "playlist_play",
      label: t("settings.clear.playlistsLabel"),
      caption: count("playlists", settings.playlists.length),
      toast: t("settings.clear.playlistsToast"),
      empty: !settings.playlists.length,
      clear: settings.clearPlaylists
    },
    {
      key: "muted",
      icon: "block",
      label: t("settings.muted.label"),
      caption: settings.mutedTags.length
        ? t(
            "settings.muted.caption",
            { count: num(settings.mutedTags.length) },
            settings.mutedTags.length
          )
        : t("settings.muted.empty"),
      toast: t("settings.clear.mutedToast"),
      empty: !settings.mutedTags.length,
      clear: settings.clearMutedTags
    },
    {
      key: "votes",
      icon: "star",
      label: t("settings.clear.votesLabel"),
      caption: votes ? voteCaption : t("settings.clear.votesEmpty"),
      toast: t("settings.clear.votesToast"),
      empty: !votes,
      clear: settings.clearVotes
    },
    {
      key: "key",
      icon: "key",
      label: t("settings.connectionKey.label"),
      caption: settings.connectionKey
        ? t("settings.clear.keySaved")
        : t("settings.clear.keyUnset"),
      toast: t("settings.clear.keyToast"),
      empty: !settings.connectionKey,
      clear: settings.clearConnectionKey
    },
    {
      key: "preferences",
      icon: "tune",
      label: t("settings.clear.preferencesLabel"),
      caption: t("settings.clear.preferencesCaption"),
      toast: t("settings.clear.preferencesToast"),
      empty: !preferencesTouched,
      clear: settings.resetPreferences
    }
  ];
});

function clearRow(row: ClearRow): void {
  row.clear();
  hToast("info", row.toast);
}

function clearAll(): void {
  settings.clearAll();
  emit("update:modelValue", false);
  emit("cleared-all");
  hToast("info", t("settings.clear.allToast"));
}
</script>

<style scoped lang="scss">
.clear-data {
  width: min(480px, 100%);
}

.clear-data__lead {
  color: var(--color-text-tertiary);
  margin: 0 0 var(--space-sm);
}
</style>
