import type enUS from "../en-US/home";

// The front page: the featured hero at the top, the config-driven carousel
// shelves under it, and the confirm dialog behind the recently-viewed
// shelf's clear icon. Shelf titles are row headers in a tight horizontal
// strip — keep them short.
const home: typeof enUS = {
  hero: {
    kicker: "Destacado",
    /** alt text when the featured video has no title of its own */
    alt: "Vídeo destacado",
    cta: "Ver el vídeo",
    emptyTitle: "Nada que destacar"
  },

  // One sentence, two places: under the empty hero and under the empty shelf
  // list. Both are the same "you filtered the catalog away" state.
  filteredOutBody:
    "Tus filtros y etiquetas silenciadas ocultan todo el catálogo. Quita alguno en los ajustes.",

  rows: {
    recent: "Recién añadidos",
    favorites: "Mis favoritos",
    recentlyViewed: "Vistos recientemente",
    /** help-icon tooltip on the recently-viewed shelf */
    recentlyViewedHint:
      "Solo se guarda en este navegador — tu historial no se rastrea ni se envía a ninguna parte.",
    /** delete-icon tooltip on the same shelf */
    recentlyViewedClear: "Borrar el historial",
    /** {tag} is a catalog tag and stays untranslated */
    becauseYouLike: "Porque te gusta {tag}",
    topRated: "Mejor valorados",
    mostPlayed: "Más reproducidos",
    updated: "Recién actualizados"
  },

  clearHistory: {
    title: "¿Borrar el historial?",
    body: "Los vídeos siguen en el catálogo — solo desaparece la lista de lo que has abierto en este navegador.",
    confirm: "Borrar el historial",
    done: "Historial borrado"
  }
};

export default home;
