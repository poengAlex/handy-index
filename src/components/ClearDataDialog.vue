<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <HModal title="Clear stored data" closable class="clear-data">
      <p class="text-body-sm clear-data__lead">
        Everything this site remembers lives in this browser. Clear pieces one
        by one, or wipe everything at once.
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
              label="Clear"
              :disable="row.empty"
              @click="clearRow(row)"
            />
          </template>
        </HListRow>
      </HList>

      <template #actions>
        <HBtn variant="danger" label="Clear all data" @click="clearAll" />
        <HBtn v-close-popup label="Done" />
      </template>
    </HModal>
  </q-dialog>
</template>

<script setup lang="ts">
// Granular local-storage housekeeping: every category the settings store
// persists, clearable on its own. "Clear all data" (the old settings button)
// lives here too and still wipes everything including consent.
import { computed } from "vue";
import { HBtn, HList, HListRow, HModal, hToast } from "@/components/handy";
import { useSettingsStore } from "@/stores/settings";

defineProps<{ modelValue: boolean }>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  /** everything was wiped — the parent settings dialog closes too */
  "cleared-all": [];
}>();

const settings = useSettingsStore();

interface ClearRow {
  key: string;
  icon: string;
  label: string;
  caption: string;
  empty: boolean;
  clear: () => void;
}

function countLabel(count: number, noun: string): string {
  return `${count.toLocaleString()} ${noun}${count === 1 ? "" : "s"}`;
}

const rows = computed<ClearRow[]>(() => {
  const ratingCount = Object.keys(settings.scriptVotes).length;
  const upvoteCount = settings.requestUpvotes.length;
  const votes = ratingCount + upvoteCount;
  const voteCaption = [
    ratingCount ? countLabel(ratingCount, "script rating") : "",
    upvoteCount ? countLabel(upvoteCount, "request vote") : ""
  ]
    .filter(Boolean)
    .join(" · ");
  const preferencesTouched =
    settings.nsfw ||
    settings.showPremiumScripts ||
    !settings.showPaidVideos ||
    settings.inlinePlayers ||
    settings.orientation !== "straight";
  return [
    {
      key: "recent",
      icon: "history",
      label: "Recently viewed",
      caption: countLabel(settings.recentlyViewed.length, "video"),
      empty: !settings.recentlyViewed.length,
      clear: settings.clearRecentlyViewed
    },
    {
      key: "favorites",
      icon: "favorite",
      label: "Favorites",
      caption: countLabel(settings.favorites.length, "video"),
      empty: !settings.favorites.length,
      clear: settings.clearFavorites
    },
    {
      key: "playlists",
      icon: "playlist_play",
      label: "Playlists",
      caption: countLabel(settings.playlists.length, "playlist"),
      empty: !settings.playlists.length,
      clear: settings.clearPlaylists
    },
    {
      key: "muted",
      icon: "block",
      label: "Muted tags",
      caption: settings.mutedTags.length
        ? countLabel(settings.mutedTags.length, "tag")
        : "Nothing muted",
      empty: !settings.mutedTags.length,
      clear: settings.clearMutedTags
    },
    {
      key: "votes",
      icon: "star",
      label: "Ratings & votes",
      caption: votes ? voteCaption : "Nothing recorded",
      empty: !votes,
      clear: settings.clearVotes
    },
    {
      key: "key",
      icon: "key",
      label: "Connection key",
      caption: settings.connectionKey ? "Saved on this device" : "Not set",
      empty: !settings.connectionKey,
      clear: settings.clearConnectionKey
    },
    {
      key: "preferences",
      icon: "tune",
      label: "Viewing preferences",
      caption: "Explicit previews, orientation, script & video access",
      empty: !preferencesTouched,
      clear: settings.resetPreferences
    }
  ];
});

function clearRow(row: ClearRow): void {
  row.clear();
  hToast("info", `${row.label} cleared`);
}

function clearAll(): void {
  settings.clearAll();
  emit("update:modelValue", false);
  emit("cleared-all");
  hToast("info", "All local data cleared");
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
