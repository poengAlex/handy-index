import type enUS from "../en-US/common";

// Typed against the English namespace: a key that exists there and not here
// is a build error, not a silent English string in the middle of a Norwegian
// page. Same contract in every nb-NO file.
const common: typeof enUS = {
  action: {
    backToHome: "Tilbake til forsiden",
    browseVideos: "Utforsk videoer",
    cancel: "Avbryt",
    clear: "Tøm",
    clearFilters: "Nullstill filtre",
    clearSearch: "Tøm søket",
    create: "Opprett",
    delete: "Slett",
    done: "Ferdig",
    import: "Importer",
    manage: "Administrer",
    rename: "Gi nytt navn",
    retry: "Prøv igjen",
    save: "Lagre",
    share: "Del"
  },

  state: {
    catalogErrorTitle: "Kunne ikke laste katalogen",
    // "nettforbindelsen", not "tilkoblingen": it is the network connection
    // that fails here, and nothing to do with the connection key.
    catalogErrorBody:
      "Script-indeksen svarte ikke. Sjekk nettforbindelsen og prøv igjen.",
    emptyTitle: "Ingenting å vise"
  },

  ofTotal: {
    videos: "{shown} av {total} video | {shown} av {total} videoer",
    performers:
      "{shown} av {total} skuespiller | {shown} av {total} skuespillere",
    tags: "{shown} av {total} tagg | {shown} av {total} tagger"
  },

  count: {
    performers: "{count} skuespiller | {count} skuespillere",
    playlists: "{count} spilleliste | {count} spillelister",
    requests: "{count} forespørsel | {count} forespørsler",
    sites: "{count} nettsted | {count} nettsteder",
    tags: "{count} tagg | {count} tagger",
    videos: "{count} video | {count} videoer",
    votes: "{count} stemme | {count} stemmer"
  },

  duration: {
    // Norwegian abbreviates the hour "t" (time), not "h" — the whole reason
    // duration is assembled here instead of inside the formatter.
    hoursMinutes: "{hours} t {minutes} min",
    hours: "{hours} t",
    minutes: "{minutes} min",
    seconds: "{seconds} s"
  },

  justNow: "akkurat nå",

  orientation: {
    straight: "Straight",
    gay: "Gay",
    trans: "Trans",
    all: "Everything"
  },

  language: {
    label: "Språk",
    caption: "Velg hvilket språk nettstedet vises på",
    system: "Følg nettleseren"
  }
};

export default common;
