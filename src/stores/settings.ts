import { acceptHMRUpdate, defineStore } from "pinia";
import { computed, ref } from "vue";
import { detectLocale, isLocale } from "@/i18n/locales";
import type { Locale } from "@/i18n/locales";
import type { SceneId } from "@/components/background";
import { UNMUTABLE_TAGS } from "@/services/script-index/queries";
import type { Orientation } from "@/services/script-index/queries";

export interface Playlist {
  id: string;
  name: string;
  videoIds: string[];
}

const RECENTLY_VIEWED_CAP = 30;

/** The background looks offered in settings. The component ships ten scenes;
 * these are the two this app puts a switch on. Typed as SceneId so a rename
 * upstream fails the build here rather than silently falling back to the
 * component's own default at render. */
export const BACKGROUND_SCENES = [
  "handy",
  "erin"
] as const satisfies readonly SceneId[];

export type BackgroundScene = (typeof BACKGROUND_SCENES)[number];

function isBackgroundScene(value: unknown): value is BackgroundScene {
  return BACKGROUND_SCENES.includes(value as BackgroundScene);
}

/** Bounds for the two card-preview speeds, shared by the settings sliders and
 * the hydration clamp so a hand-edited blob can't hand a card a 0 ms interval
 * or a playback rate no browser will accept. */
export const PREVIEW_FRAME_MS = {
  min: 200,
  max: 3000,
  step: 100,
  default: 800
};

export const PREVIEW_CLIP_RATE = {
  min: 0.25,
  max: 3,
  step: 0.25,
  default: 1
};

function clamp(
  value: unknown,
  bounds: { min: number; max: number; default: number }
): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return bounds.default;
  return Math.min(Math.max(n, bounds.min), bounds.max);
}

/**
 * Persisted user preferences. Favorites, playlists and history store
 * partnerVideoIds only — the catalog is the single source of video data.
 */
export const useSettingsStore = defineStore(
  "settings",
  () => {
    /** the first-visit consent modal has been answered (either way) */
    const consentAnswered = ref(false);
    /** the language the user *picked*. null means "no opinion" — follow the
     * browser, and keep following it if they change their browser later.
     * Storing the detected locale instead would freeze a first-visit guess
     * into a permanent choice the user never actually made. */
    const locale = ref<Locale | null>(null);
    /** show explicit thumbnails; off renders neutral placeholder tiles */
    const nsfw = ref(false);
    /** include videos whose script is behind a partner's paywall. OFF by
     * default — a script you can't download is the one thing a script
     * database can't do anything with */
    const showPremiumScripts = ref(false);
    /** include videos behind the partner's own paywall — a different question
     * entirely (2,939 videos are premium to watch but have a free script). ON
     * by default: what you can watch is the partner's business, not ours */
    const showPaidVideos = ref(true);
    /** how long each still holds while a card preview cycles its images */
    const previewFrameMs = ref(PREVIEW_FRAME_MS.default);
    /** playback rate for the partner roll clip a card preview plays */
    const previewClipRate = ref(PREVIEW_CLIP_RATE.default);
    /** embedded partner players (Pornhub/xHamster) on video pages */
    const inlinePlayers = ref(false);
    /** let pages span the whole viewport instead of the 1440px column */
    const fullWidth = ref(false);
    /** the animated gradient field behind every page. ON by default; the
     * toggle exists for anyone who finds a moving background distracting */
    const background = ref(true);
    /** which of the offered background looks is in effect */
    const backgroundScene = ref<BackgroundScene>("handy");
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

    /** the locale actually in effect: the explicit pick, else whatever the
     * browser asks for. This is what the boot file hands vue-i18n. */
    const resolvedLocale = computed<Locale>(
      () => locale.value ?? detectLocale()
    );

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
      locale.value = null;
      nsfw.value = false;
      showPremiumScripts.value = false;
      showPaidVideos.value = true;
      previewFrameMs.value = PREVIEW_FRAME_MS.default;
      previewClipRate.value = PREVIEW_CLIP_RATE.default;
      inlinePlayers.value = false;
      fullWidth.value = false;
      background.value = true;
      backgroundScene.value = "handy";
      orientation.value = "straight";
    }

    function clearAll(): void {
      consentAnswered.value = false;
      locale.value = null;
      nsfw.value = false;
      showPremiumScripts.value = false;
      showPaidVideos.value = true;
      previewFrameMs.value = PREVIEW_FRAME_MS.default;
      previewClipRate.value = PREVIEW_CLIP_RATE.default;
      inlinePlayers.value = false;
      fullWidth.value = false;
      background.value = true;
      backgroundScene.value = "handy";
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
      locale,
      resolvedLocale,
      nsfw,
      showPremiumScripts,
      showPaidVideos,
      previewFrameMs,
      previewClipRate,
      inlinePlayers,
      fullWidth,
      background,
      backgroundScene,
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
      // hand-edited localStorage can carry a retired access key, a non-boolean
      // switch, or muted tags with mixed case, dupes or an orientation tag —
      // normalize once on the way in
      afterHydrate: ({ store }) => {
        const settings = store as ReturnType<typeof useSettingsStore>;
        // The script switch has been through two retired shapes: a single
        // showPremium boolean, then a three-way premiumFilter/scriptFilter
        // ("free" | "all" | "premium"). All of them meant script access, and
        // the premium-only mode has no boolean equivalent — it becomes "show
        // them". $state, not the store: an unknown key patched in by the
        // hydrator lands there, and that is also what gets re-serialized — so
        // the delete is what retires it.
        const legacy = settings.$state as unknown as Record<string, unknown>;
        const retired = (value: unknown): boolean | undefined => {
          if (typeof value === "boolean") return value;
          if (value === "free") return false;
          if (value === "all" || value === "premium") return true;
          return undefined;
        };
        settings.showPremiumScripts =
          retired(legacy.scriptFilter) ??
          retired(legacy.premiumFilter) ??
          retired(legacy.showPremium) ??
          settings.showPremiumScripts;
        settings.showPaidVideos =
          retired(legacy.videoFilter) ?? settings.showPaidVideos;
        delete legacy.showPremium;
        delete legacy.premiumFilter;
        delete legacy.scriptFilter;
        delete legacy.videoFilter;
        // a retired or hand-typed locale tag must not strand the UI on a
        // bundle that no longer exists — fall back to following the browser
        if (!isLocale(settings.locale)) settings.locale = null;
        // a hand-edited blob can still carry a non-boolean
        settings.showPremiumScripts = Boolean(settings.showPremiumScripts);
        settings.showPaidVideos = Boolean(settings.showPaidVideos);
        // defaults ON, so only an explicit false survives hydration
        settings.background = settings.background !== false;
        // a retired scene id must not reach the component, which would fall
        // back to its own default and leave the radio matching nothing
        if (!isBackgroundScene(settings.backgroundScene)) {
          settings.backgroundScene = "handy";
        }
        settings.previewFrameMs = clamp(
          settings.previewFrameMs,
          PREVIEW_FRAME_MS
        );
        settings.previewClipRate = clamp(
          settings.previewClipRate,
          PREVIEW_CLIP_RATE
        );
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
