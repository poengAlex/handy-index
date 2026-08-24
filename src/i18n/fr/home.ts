import type enUS from "../en-US/home";

// The front page: the featured hero at the top, the config-driven carousel
// shelves under it, and the confirm dialog behind the recently-viewed
// shelf's clear icon. Shelf titles are row headers in a tight horizontal
// strip — keep them short.
const home: typeof enUS = {
  hero: {
    kicker: "À la une",
    /** alt text when the featured video has no title of its own */
    alt: "Vidéo à la une",
    cta: "Voir la vidéo",
    emptyTitle: "Rien à mettre en avant"
  },

  // One sentence, two places: under the empty hero and under the empty shelf
  // list. Both are the same "you filtered the catalog away" state.
  filteredOutBody:
    "Vos filtres et vos tags en sourdine masquent tout le catalogue. Assouplissez-les dans les paramètres.",

  rows: {
    recent: "Ajoutées récemment",
    favorites: "Mes favoris",
    recentlyViewed: "Vues récemment",
    /** help-icon tooltip on the recently-viewed shelf */
    recentlyViewedHint:
      "Conservé uniquement dans ce navigateur — votre historique n'est jamais suivi ni envoyé où que ce soit.",
    /** delete-icon tooltip on the same shelf */
    recentlyViewedClear: "Effacer l'historique",
    /** {tag} is a catalog tag and stays untranslated */
    becauseYouLike: "Parce que vous aimez « {tag} »",
    topRated: "Les mieux notées",
    mostPlayed: "Les plus jouées",
    updated: "Mises à jour récemment"
  },

  clearHistory: {
    title: "Effacer l'historique ?",
    body: "Les vidéos restent dans le catalogue — seule la liste de ce que vous avez ouvert dans ce navigateur disparaît.",
    confirm: "Effacer l'historique",
    done: "Historique effacé"
  }
};

export default home;
