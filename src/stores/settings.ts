import { acceptHMRUpdate, defineStore } from "pinia";
import { computed, ref } from "vue";
import { UNMUTABLE_TAGS } from "@/services/script-index/queries";
import type { Orientation } from "@/services/script-index/queries";

export interface Playlist {
  id: string;
  name: string;
  videoIds: string[];
}

const RECENTLY_VIEWED_CAP = 30;

/**
 * Persisted user preferences. Favorites, playlists and history store
 * partnerVideoIds only — the catalog is the single source of video data.
 */
export const useSettingsStore = defineStore(
  "settings",
  () => {
    /** the first-visit consent modal has been answered (either way) */
    const consentAnswered = ref(false);
    /** show explicit thumbnails; off renders neutral placeholder tiles */
    const nsfw = ref(false);
    /** include videos without a free script (on by default — the catalog
     * shows everything until the user narrows it) */
    const showPremium = ref(true);
    /** embedded partner players (Pornhub/xHamster) on video pages */
    const inlinePlayers = ref(false);
    const orientation = ref<Orientation>("straight");
    const connectionKey = ref("");
    const favorites = ref<string[]>([]);
    /** tags the user muted — any video carrying one leaves the catalog.
     * Plain string[] on purpose: persisted state is JSON, and a Set
     * round-trips to {}. The O(1) lookup structure is mutedSet below. */
    const mutedTags = ref<string[]>([]);
    /** requestIds the user already upvoted (the API doesn't dedupe for us) */
    const requestUpvotes = ref<string[]>([]);
    /** the user's star vote per scriptId (1–5) — the API keeps no per-user
     * record, so this is what "you rated this" is drawn from */
    const scriptVotes = ref<Record<string, number>>({});
    /** partnerVideoIds of visited detail pages, most recent first */
    const recentlyViewed = ref<string[]>([]);
    const playlists = ref<Playlist[]>([]);

    function answerConsent(accepted: boolean): void {
      consentAnswered.value = true;
      nsfw.value = accepted;
    }

    /** membership structure for the 15k-item baseline gate; a getter, so it
     * is never persisted — recomputed only when mutedTags changes */
    const mutedSet = computed(() => new Set(mutedTags.value));

    function isMuted(tag: string): boolean {
      return mutedSet.value.has(tag);
    }

    /** Stored verbatim (trimmed only). Every tag reaching here comes from the
     * catalog, and the gate compares raw video.tags — lowercasing the key
     * would make a mixed-case tag store something that never matches, muting
     * nothing while looking muted. Returns false when nothing was added, so
     * callers never report a mute that didn't happen. */
    function muteTag(tag: string): boolean {
      const clean = tag.trim();
      if (!clean || UNMUTABLE_TAGS.has(clean.toLowerCase())) return false;
      if (mutedTags.value.includes(clean)) return false;
      mutedTags.value = [...mutedTags.value, clean];
      return true;
    }

    function unmuteTag(tag: string): void {
      const clean = tag.trim();
      mutedTags.value = mutedTags.value.filter(entry => entry !== clean);
    }

    function clearMutedTags(): void {
      mutedTags.value = [];
    }

    function isFavorite(partnerVideoId: string): boolean {
      return favorites.value.includes(partnerVideoId);
    }

    function toggleFavorite(partnerVideoId: string): void {
      if (isFavorite(partnerVideoId)) {
        favorites.value = favorites.value.filter(id => id !== partnerVideoId);
      } else {
        favorites.value = [...favorites.value, partnerVideoId];
      }
    }

    function hasUpvoted(requestId: string): boolean {
      return requestUpvotes.value.includes(requestId);
    }

    function markUpvoted(requestId: string): void {
      if (!hasUpvoted(requestId)) {
        requestUpvotes.value = [...requestUpvotes.value, requestId];
      }
    }

    function getScriptVote(scriptId: string): number {
      return scriptVotes.value[scriptId] ?? 0;
    }

    function setScriptVote(scriptId: string, stars: number): void {
      scriptVotes.value = { ...scriptVotes.value, [scriptId]: stars };
    }

    function recordView(partnerVideoId: string): void {
      recentlyViewed.value = [
        partnerVideoId,
        ...recentlyViewed.value.filter(id => id !== partnerVideoId)
      ].slice(0, RECENTLY_VIEWED_CAP);
    }

    function createPlaylist(name: string): Playlist {
      const playlist: Playlist = {
        id: crypto.randomUUID(),
        name: name.trim(),
        videoIds: []
      };
      playlists.value = [...playlists.value, playlist];
      return playlist;
    }

    /** Adds a playlist from an import — ids are deduped, name pre-validated
     * by the transfer layer. Always creates a new playlist, never merges. */
    function importPlaylist(name: string, videoIds: string[]): Playlist {
      const playlist: Playlist = {
        id: crypto.randomUUID(),
        name: name.trim(),
        videoIds: [...new Set(videoIds)]
      };
      playlists.value = [...playlists.value, playlist];
      return playlist;
    }

    function renamePlaylist(id: string, name: string): void {
      playlists.value = playlists.value.map(playlist =>
        playlist.id === id ? { ...playlist, name: name.trim() } : playlist
      );
    }

    function deletePlaylist(id: string): void {
      playlists.value = playlists.value.filter(playlist => playlist.id !== id);
    }

    function isInPlaylist(playlistId: string, partnerVideoId: string): boolean {
      return Boolean(
        playlists.value
          .find(playlist => playlist.id === playlistId)
          ?.videoIds.includes(partnerVideoId)
      );
    }

    function toggleInPlaylist(
      playlistId: string,
      partnerVideoId: string
    ): void {
      playlists.value = playlists.value.map(playlist => {
        if (playlist.id !== playlistId) return playlist;
        const videoIds = playlist.videoIds.includes(partnerVideoId)
          ? playlist.videoIds.filter(id => id !== partnerVideoId)
          : [...playlist.videoIds, partnerVideoId];
        return { ...playlist, videoIds };
      });
    }

    // --- granular clears (the settings "Clear stored data" module) ---

    function clearRecentlyViewed(): void {
      recentlyViewed.value = [];
    }

    function clearFavorites(): void {
      favorites.value = [];
    }

    function clearPlaylists(): void {
      playlists.value = [];
    }

    /** script star-ratings and request upvotes together — both are "what
     * I voted on" memory, neither is useful without the other's context */
    function clearVotes(): void {
      scriptVotes.value = {};
      requestUpvotes.value = [];
    }

    function clearConnectionKey(): void {
      connectionKey.value = "";
    }

    /** viewing prefs back to first-run defaults; consent stays answered so
     * the consent modal doesn't reappear */
    function resetPreferences(): void {
      nsfw.value = false;
      showPremium.value = true;
      inlinePlayers.value = false;
      orientation.value = "straight";
    }

    function clearAll(): void {
      consentAnswered.value = false;
      nsfw.value = false;
      showPremium.value = true;
      inlinePlayers.value = false;
      orientation.value = "straight";
      connectionKey.value = "";
      favorites.value = [];
      // resetPreferences deliberately leaves mutes alone (one tap on a
      // low-stakes row must not silently unmute); "clear everything" must not
      mutedTags.value = [];
      requestUpvotes.value = [];
      scriptVotes.value = {};
      recentlyViewed.value = [];
      playlists.value = [];
    }

    return {
      consentAnswered,
      nsfw,
      showPremium,
      inlinePlayers,
      orientation,
      connectionKey,
      favorites,
      mutedTags,
      mutedSet,
      requestUpvotes,
      scriptVotes,
      recentlyViewed,
      playlists,
      answerConsent,
      isFavorite,
      toggleFavorite,
      isMuted,
      muteTag,
      unmuteTag,
      clearMutedTags,
      hasUpvoted,
      markUpvoted,
      getScriptVote,
      setScriptVote,
      recordView,
      createPlaylist,
      importPlaylist,
      renamePlaylist,
      deletePlaylist,
      isInPlaylist,
      toggleInPlaylist,
      clearRecentlyViewed,
      clearFavorites,
      clearPlaylists,
      clearVotes,
      clearConnectionKey,
      resetPreferences,
      clearAll
    };
  },
  {
    persist: {
      // the gate assumes clean input, but a blob from an older build or a
      // hand-edited localStorage can carry mixed case, dupes or an
      // orientation tag — normalize once on the way in
      afterHydrate: ({ store }) => {
        const settings = store as ReturnType<typeof useSettingsStore>;
        const raw: unknown = settings.mutedTags;
        settings.mutedTags = [
          ...new Set(
            (Array.isArray(raw) ? raw : [])
              .map(entry => String(entry).trim())
              .filter(
                entry => entry && !UNMUTABLE_TAGS.has(entry.toLowerCase())
              )
          )
        ];
      }
    }
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot));
}
