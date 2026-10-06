import { Dark } from "quasar";
import { computed, nextTick, readonly, ref, watch } from "vue";
import { defineBoot } from "#q-app";
import { canHover } from "@/composables/useCanHover";
import { detectLocale, matchLocale } from "@/i18n/locales";
import type { Locale } from "@/i18n/locales";
import {
  captureError,
  hashConnectionKey,
  identify,
  resetIdentity,
  setEnabled,
  setSuperProperties,
  start,
  takeKeySource,
  track,
  type SettingName
} from "@/services/analytics";
import { ANALYTICS_CONFIG } from "@/services/analytics/config";
import { APP_VERSION } from "@/services/build-info";
import { getDeviceInfo } from "@/services/handy-device";
import { useCatalogStore } from "@/stores/catalog";
import { useSettingsStore } from "@/stores/settings";

// Wires the usage statistics to the app. Everything that is tracked by
// watching state rather than at a click lives here — page views, settings,
// language, the catalog load, identification, Vue's errors — so pages only
// carry the events that belong to a button. What may be sent at all is
// services/analytics/events.ts.

/** A live media-query answer, for the super properties. */
function mediaRef(query: string) {
  const list = typeof matchMedia === "undefined" ? null : matchMedia(query);
  const state = ref(list?.matches ?? false);
  list?.addEventListener("change", event => {
    state.value = event.matches;
  });
  return readonly(state);
}

interface NetworkInformation {
  effectiveType?: string;
}

export default defineBoot(({ app, router }) => {
  const settings = useSettingsStore();
  const catalog = useCatalogStore();

  start(settings.analytics);
  watch(
    () => settings.analytics,
    on => setEnabled(on)
  );

  // --- sent with every event ---

  const systemDark = mediaRef("(prefers-color-scheme: dark)");
  const reducedMotion = mediaRef("(prefers-reduced-motion: reduce)");

  const superProperties = computed(() => ({
    appVersion: APP_VERSION,
    locale: settings.resolvedLocale,
    /** picked in settings, matched from the browser, or English because the
     * browser asked only for languages we don't have */
    localeSource: settings.locale
      ? "picked"
      : matchLocale()
        ? "browser"
        : "fallback",
    theme: Dark.isActive ? "dark" : "light",
    systemTheme: systemDark.value ? "dark" : "light",
    reducedMotion: reducedMotion.value,
    canHover: canHover.value,
    explicitPreviews: settings.nsfw,
    premiumScripts: settings.showPremiumScripts,
    premiumVideos: settings.showPaidVideos,
    embeddedPlayers: settings.inlinePlayers,
    fullWidth: settings.fullWidth,
    background: settings.backgroundScene,
    backgroundMotion: settings.backgroundMotion,
    hasKey: settings.connectionKey.trim() !== "",
    // how many, never which
    favorites: settings.favorites.length,
    playlists: settings.playlists.length,
    mutedTags: settings.mutedTags.length
  }));
  watch(superProperties, setSuperProperties, { immediate: true });

  // --- errors Vue catches before window.onerror could see them ---

  const previousHandler = app.config.errorHandler;
  app.config.errorHandler = (error, instance, info) => {
    captureError(error, { vueInfo: info });
    if (previousHandler) previousHandler(error, instance, info);
    else console.error(error);
  };

  // --- page views: a different page, not a filter change ---
  //
  // The browse page writes every filter into the query, so counting every
  // route change would count each slider nudge as a page view.

  router.afterEach((to, from, failure) => {
    if (failure) return;
    if (from.matched.length && to.path === from.path) return;
    track("$pageview", { route: to.matched.at(-1)?.path ?? to.path });
  });

  // --- store actions ---

  /** set while a bulk action runs, so the setting watchers below don't
   * report each field it resets as a choice */
  let bulk = false;
  const BULK_ACTIONS = new Set([
    "answerConsent",
    "resetPreferences",
    "clearAll"
  ]);

  settings.$onAction(({ name, args, after }) => {
    if (BULK_ACTIONS.has(name)) {
      bulk = true;
      // the setting watchers run in the flush the action's writes queued;
      // a tick callback registered now runs after that flush, not before
      after(() => {
        void nextTick(() => {
          bulk = false;
        });
      });
    }
    switch (name) {
      case "answerConsent":
        track("consent_answered", { accepted: Boolean(args[0]) });
        break;
      case "toggleFavorite": {
        const id = String(args[0]);
        after(() =>
          track("favorite_toggled", { added: settings.isFavorite(id) })
        );
        break;
      }
      case "createPlaylist":
        after(() => track("playlist_created"));
        break;
      case "clearRecentlyViewed":
        after(() => track("history_cleared"));
        break;
      case "clearAll":
        // everything stored is gone, and the statistics ID is stored data
        after(() => resetIdentity(false));
        break;
    }
  });

  // --- settings and language ---

  const REPORTED: [SettingName, () => boolean | string][] = [
    ["explicit_previews", () => settings.nsfw],
    ["premium_scripts", () => settings.showPremiumScripts],
    ["premium_videos", () => settings.showPaidVideos],
    ["embedded_players", () => settings.inlinePlayers],
    ["full_width", () => settings.fullWidth],
    ["background", () => settings.backgroundScene],
    ["background_motion", () => settings.backgroundMotion]
  ];
  for (const [setting, read] of REPORTED) {
    watch(read, value => {
      if (!bulk) track("setting_changed", { setting, value });
    });
  }

  // The theme lives outside the store (useHandyTheme persists it under
  // "handy-theme"), and it also changes on its own while it follows the OS.
  // Only an explicit choice writes that key — after painting, hence "post".
  watch(
    () => Dark.isActive,
    dark => {
      if (localStorage.getItem("handy-theme") === null) return;
      track("setting_changed", {
        setting: "theme",
        value: dark ? "dark" : "light"
      });
    },
    { flush: "post" }
  );

  watch(
    () => settings.locale,
    (now, before: Locale | null) => {
      if (bulk) return;
      track("language_changed", {
        from: before ?? detectLocale(),
        to: settings.resolvedLocale,
        picked: now !== null,
        where: settings.consentAnswered ? "settings" : "first_visit"
      });
    }
  );

  // --- the catalog load ---

  let loadStartedAt = 0;
  let loadStartedEpoch = 0;
  watch(
    () => catalog.status,
    (status, previous) => {
      if (status === "loading") {
        loadStartedAt = performance.now();
        loadStartedEpoch = Date.now();
        return;
      }
      if (previous !== "loading") return;
      const ms = Math.round(performance.now() - loadStartedAt);
      if (status === "ready") {
        // a disk copy keeps its original download time, which predates this
        // load; a fresh download is stamped after it started
        const fromCache = catalog.fetchedAt < loadStartedEpoch;
        const connection = (
          navigator as Navigator & { connection?: NetworkInformation }
        ).connection;
        const memory = (navigator as Navigator & { deviceMemory?: number })
          .deviceMemory;
        track("catalog_loaded", {
          from: fromCache ? "cache" : "download",
          ms,
          mb: fromCache ? null : Math.round(catalog.loadedBytes / 1e5) / 10,
          connection: connection?.effectiveType ?? null,
          deviceMemoryGb: memory ?? null
        });
      } else if (status === "error") {
        track("catalog_load_failed", { ms, online: navigator.onLine });
      }
    },
    { immediate: true }
  );

  // --- connection key: saved, and identification ---
  //
  // With a key saved and its Handy online, events are linked to a hash of
  // the key, the way the Handyverse app does it — so a person is a device,
  // not a browser. The device check is the Handy API's /info, which only
  // answers for a connected device; an offline one is asked again later.

  const { handyApiKey, retryAfterMs } = ANALYTICS_CONFIG.identify;
  let identifiedKey = "";
  let lastAttempt = 0;
  let checking = false;

  async function identifyDevice(key: string): Promise<void> {
    if (!settings.analytics || !handyApiKey || !key) return;
    if (key === identifiedKey || checking) return;
    checking = true;
    lastAttempt = Date.now();
    try {
      const info = await getDeviceInfo(key, handyApiKey);
      // offline, or the key changed while we asked
      if (!info || settings.connectionKey.trim() !== key) return;
      const id = await hashConnectionKey(key);
      if (!id) return;
      // the property names the Handyverse app uses, so the two projects'
      // person profiles read the same
      identify(id, {
        keyLength: key.length,
        hwModelNr: info.hwModelNo,
        hwModelName: info.hwModelName,
        hwModelVariant: info.hwModelVariant,
        fwVersion: info.fwVersion,
        fwFeatureFlags: info.fwFeatureFlags,
        darkMode: Dark.isActive,
        language: settings.resolvedLocale,
        deviceLanguage: navigator.language
      });
      identifiedKey = key;
    } finally {
      checking = false;
    }
  }

  // the settings field writes the key per keystroke; act once typing stops
  let keyTimer = 0;
  let savedKey = settings.connectionKey.trim();
  watch(
    () => settings.connectionKey.trim(),
    key => {
      window.clearTimeout(keyTimer);
      keyTimer = window.setTimeout(() => {
        if (key === savedKey) return;
        savedKey = key;
        if (!key) {
          // removed: back to anonymous
          identifiedKey = "";
          resetIdentity(true);
          return;
        }
        track("connection_key_saved", { via: takeKeySource() });
        void identifyDevice(key);
      }, 1500);
    }
  );

  // a key saved on an earlier visit — asked about once startup is over —
  // and statistics switched on later
  window.setTimeout(
    () => void identifyDevice(savedKey),
    ANALYTICS_CONFIG.loadDelayMs
  );
  watch(
    () => settings.analytics,
    on => {
      if (on) void identifyDevice(settings.connectionKey.trim());
    }
  );
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") return;
    if (Date.now() - lastAttempt < retryAfterMs) return;
    void identifyDevice(settings.connectionKey.trim());
  });
});
