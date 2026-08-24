import type enUS from "../en-US/home";

// The front page: the featured hero at the top, the config-driven carousel
// shelves under it, and the confirm dialog behind the recently-viewed
// shelf's clear icon. Shelf titles are row headers in a tight horizontal
// strip — keep them short.
const home: typeof enUS = {
  hero: {
    kicker: "Destaque",
    /** alt text when the featured video has no title of its own */
    alt: "Vídeo em destaque",
    cta: "Ver vídeo",
    emptyTitle: "Nada para destacar"
  },

  // One sentence, two places: under the empty hero and under the empty shelf
  // list. Both are the same "you filtered the catalog away" state.
  filteredOutBody:
    "Seus filtros e tags silenciadas escondem o catálogo inteiro. Ajuste os filtros nas configurações.",

  rows: {
    recent: "Adicionados recentemente",
    favorites: "Meus favoritos",
    recentlyViewed: "Vistos recentemente",
    /** help-icon tooltip on the recently-viewed shelf */
    recentlyViewedHint:
      "Fica salvo só neste navegador — seu histórico nunca é rastreado nem enviado para lugar nenhum.",
    /** delete-icon tooltip on the same shelf */
    recentlyViewedClear: "Limpar vistos recentemente",
    /** {tag} is a catalog tag and stays untranslated */
    becauseYouLike: "Porque você curte {tag}",
    topRated: "Mais bem avaliados",
    mostPlayed: "Mais reproduzidos",
    updated: "Atualizados recentemente"
  },

  clearHistory: {
    title: "Limpar vistos recentemente?",
    body: "Os vídeos continuam no catálogo — some só a lista do que você abriu neste navegador.",
    confirm: "Limpar histórico",
    done: "Histórico limpo"
  }
};

export default home;
