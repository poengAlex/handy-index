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
//
// Two German house rulings this locale follows everywhere:
//
// 1. `tag` is translated, as "Schlagwort" (n., pl. "Schlagwörter"). German
//    "Tag" is a false friend — it is the word for *day*, so "1 Tag
//    stummgeschaltet" reads as "1 day muted" right next to a publish date.
//    "Schlagwort" is the ordinary German word for a catalog keyword, and it
//    is neuter where "Tag" is masculine, so the articles and adjectives
//    around it move with it ("1 stummgeschaltetes Schlagwort").
//
// 2. `script` is NOT translated: it is the Handy motion file, the thing
//    users download and search support for, so it stays the English word,
//    uninflected, like `connection key`. It is lowercase mid-sentence
//    ("Lade das script herunter") and sentence-cased when it opens a string
//    ("Script bereit"). German compounds keep it whole behind a hyphen
//    ("Script-Index", "Premium-Script"); where a compound would fuse an
//    ending onto it the sentence is restructured instead.
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
    // "Verbindung" alone is too vague here, and the connection key is now
    // named in English anyway — it is the network that failed, so the
    // compound says which connection
    catalogErrorBody:
      "Der Script-Index hat nicht geantwortet. Prüfe deine Internetverbindung und versuche es erneut.",
    emptyTitle: "Nichts zu zeigen"
  },

  // "12 of 340" — the shown/total pair every filtered listing prints. Both
  // sides arrive pre-formatted through `$n()`.
  ofTotal: {
    videos: "{shown} von {total} Video | {shown} von {total} Videos",
    performers:
      "{shown} von {total} Darsteller | {shown} von {total} Darstellern",
    tags: "{shown} von {total} Schlagwort | {shown} von {total} Schlagwörtern"
  },

  count: {
    performers: "{count} Darsteller | {count} Darsteller",
    playlists: "{count} Wiedergabeliste | {count} Wiedergabelisten",
    requests: "{count} Anfrage | {count} Anfragen",
    sites: "{count} Website | {count} Websites",
    tags: "{count} Schlagwort | {count} Schlagwörter",
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
  //
  // Pinned to English in every locale, by product decision: the filter is
  // derived from the catalog's own English tags, so these read as data
  // values rather than UI copy. Do not translate them back — check-i18n.mjs
  // pins all four and fails the build on any difference. The sentences that
  // interpolate one (gates.notice.*Orientation, browse.empty.orientation*)
  // are written to take the bare, uninflectable English word.
  orientation: {
    straight: "Straight",
    gay: "Gay",
    trans: "Trans",
    all: "Everything"
  },

  language: {
    label: "Sprache",
    caption: "Wähle die Sprache, in der diese Seite angezeigt wird",
    system: "Browsersprache verwenden"
  }
};

export default common;
