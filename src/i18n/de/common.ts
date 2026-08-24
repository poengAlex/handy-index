import type enUS from "../en-US/common";

// Vocabulary shared by more than one surface. Same admission rule as the
// component menu in ARCHITECTURE.md: a string is promoted here on its
// *second* consumer — a phrase used once belongs in its feature namespace,
// where a translator can see the context it is used in.
//
// Plural messages carry a `{count}` named param instead of vue-i18n's bare
// `{n}`, because the count has to be run through `$n()` first so 15000 reads
// "15,000" in English and "15 000" in Norwegian. Call them as
// `$t("common.count.videos", { count: $n(x) }, x)`.
const common: typeof enUS = {
  action: {
    backToHome: "Zurück zur Startseite",
    browseVideos: "Videos durchstöbern",
    cancel: "Abbrechen",
    clear: "Löschen",
    clearFilters: "Filter zurücksetzen",
    clearSearch: "Suche löschen",
    create: "Erstellen",
    delete: "Löschen",
    done: "Fertig",
    import: "Importieren",
    manage: "Verwalten",
    rename: "Umbenennen",
    retry: "Erneut versuchen",
    save: "Speichern",
    share: "Teilen"
  },

  state: {
    catalogErrorTitle: "Katalog konnte nicht geladen werden",
    // "Verbindung" alone would read as the connection key here — it is the
    // network that failed, so the compound says so
    catalogErrorBody:
      "Der Skriptindex hat nicht geantwortet. Prüfe deine Internetverbindung und versuche es erneut.",
    emptyTitle: "Nichts zu zeigen"
  },

  // "12 of 340" — the shown/total pair every filtered listing prints. Both
  // sides arrive pre-formatted through `$n()`.
  ofTotal: {
    videos: "{shown} von {total} Video | {shown} von {total} Videos",
    performers:
      "{shown} von {total} Darsteller | {shown} von {total} Darstellern",
    tags: "{shown} von {total} Tag | {shown} von {total} Tags"
  },

  count: {
    performers: "{count} Darsteller | {count} Darsteller",
    playlists: "{count} Wiedergabeliste | {count} Wiedergabelisten",
    requests: "{count} Anfrage | {count} Anfragen",
    sites: "{count} Website | {count} Websites",
    tags: "{count} Tag | {count} Tags",
    videos: "{count} Video | {count} Videos",
    votes: "{count} Stimme | {count} Stimmen"
  },

  // Duration is assembled from parts rather than formatted in the service:
  // Norwegian abbreviates hours "t", not "h", and only the message layer
  // knows that. `durationParts()` in services/format.ts picks which key.
  duration: {
    hoursMinutes: "{hours} Std. {minutes} Min.",
    hours: "{hours} Std.",
    minutes: "{minutes} Min.",
    seconds: "{seconds} Sek."
  },

  justNow: "gerade eben",

  // Shared by the settings radio group, the browse filters and the header
  // switcher — the same "can't drift apart" reason ORIENTATION_LABELS gave
  // for living in queries.ts, which is where these strings came from.
  orientation: {
    straight: "Hetero",
    gay: "Gay",
    trans: "Trans",
    all: "Alles"
  },

  language: {
    label: "Sprache",
    caption: "Wähle die Sprache, in der diese Seite angezeigt wird",
    system: "Browsersprache verwenden"
  }
};

export default common;
