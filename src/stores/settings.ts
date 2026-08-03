import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
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
    /** include videos without a free script */
    const showPremium = ref(false);
    const orientation = ref<Orientation>("straight");
    const connectionKey = ref("");
    const favorites = ref<string[]>([]);
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

    function clearAll(): void {
      consentAnswered.value = false;
      nsfw.value = false;
      showPremium.value = false;
      orientation.value = "straight";
      connectionKey.value = "";
      favorites.value = [];
      requestUpvotes.value = [];
      scriptVotes.value = {};
      recentlyViewed.value = [];
      playlists.value = [];
    }

    return {
      consentAnswered,
      nsfw,
      showPremium,
      orientation,
      connectionKey,
      favorites,
      requestUpvotes,
      scriptVotes,
      recentlyViewed,
      playlists,
      answerConsent,
      isFavorite,
      toggleFavorite,
      hasUpvoted,
      markUpvoted,
      getScriptVote,
      setScriptVote,
      recordView,
      createPlaylist,
      renamePlaylist,
      deletePlaylist,
      isInPlaylist,
      toggleInPlaylist,
      clearAll
    };
  },
  { persist: true }
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot));
}
