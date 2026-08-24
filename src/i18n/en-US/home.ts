// The front page: the featured hero at the top, the config-driven carousel
// shelves under it, and the confirm dialog behind the recently-viewed
// shelf's clear icon. Shelf titles are row headers in a tight horizontal
// strip — keep them short.
export default {
  hero: {
    kicker: "Featured",
    /** alt text when the featured video has no title of its own */
    alt: "Featured video",
    cta: "View video",
    emptyTitle: "Nothing to feature"
  },

  // One sentence, two places: under the empty hero and under the empty shelf
  // list. Both are the same "you filtered the catalog away" state.
  filteredOutBody:
    "Your filters and muted tags hide the whole catalog. Loosen them in settings.",

  rows: {
    recent: "Recently added",
    favorites: "My favorites",
    recentlyViewed: "Recently viewed",
    /** help-icon tooltip on the recently-viewed shelf */
    recentlyViewedHint:
      "Only stored in this browser — your viewing history is never tracked or sent anywhere.",
    /** delete-icon tooltip on the same shelf */
    recentlyViewedClear: "Clear recently viewed",
    /** {tag} is a catalog tag and stays untranslated */
    becauseYouLike: "Because you like {tag}",
    topRated: "Top rated",
    mostPlayed: "Most played",
    updated: "Recently updated"
  },

  clearHistory: {
    title: "Clear recently viewed?",
    body: "The videos stay in the catalog — only this browser's list of what you've opened goes away.",
    confirm: "Clear history",
    done: "Recently viewed cleared"
  }
};
