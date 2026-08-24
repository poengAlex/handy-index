import type enUS from "../en-US/home";

// The front page: the featured hero at the top, the config-driven carousel
// shelves under it, and the confirm dialog behind the recently-viewed
// shelf's clear icon. Shelf titles are row headers in a tight horizontal
// strip — keep them short.
const home: typeof enUS = {
  hero: {
    kicker: "Empfohlen",
    /** alt text when the featured video has no title of its own */
    alt: "Empfohlenes Video",
    cta: "Video ansehen",
    emptyTitle: "Nichts zu empfehlen"
  },

  // One sentence, two places: under the empty hero and under the empty shelf
  // list. Both are the same "you filtered the catalog away" state.
  filteredOutBody:
    "Deine Filter und stummgeschalteten Schlagwörter verbergen den ganzen Katalog. Lockere sie in den Einstellungen.",

  rows: {
    recent: "Zuletzt hinzugefügt",
    favorites: "Meine Favoriten",
    recentlyViewed: "Zuletzt gesehen",
    /** help-icon tooltip on the recently-viewed shelf */
    recentlyViewedHint:
      "Nur in diesem Browser gespeichert — dein Verlauf wird nirgendwo erfasst und nirgendwohin gesendet.",
    /** delete-icon tooltip on the same shelf */
    recentlyViewedClear: "Verlauf löschen",
    /** {tag} is a catalog tag and stays untranslated */
    becauseYouLike: "Weil du {tag} magst",
    topRated: "Bestbewertet",
    mostPlayed: "Meistgespielt",
    updated: "Zuletzt aktualisiert"
  },

  clearHistory: {
    title: "Verlauf löschen?",
    body: "Die Videos bleiben im Katalog — nur die Liste dessen, was du geöffnet hast, verschwindet aus diesem Browser.",
    confirm: "Verlauf löschen",
    done: "Verlauf gelöscht"
  }
};

export default home;
