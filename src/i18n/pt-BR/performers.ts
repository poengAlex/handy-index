import type enUS from "../en-US/performers";

// The performer directory (/performers): a grid of avatar cards with a name
// search, a sort control and endless scroll. Same page shape as `sites` — a
// header count line, a search box and two empty states — so the key names are
// kept parallel with that namespace on purpose.
const performers: typeof enUS = {
  title: "Artistas",

  search: {
    placeholder: "Buscar artistas",
    aria: "Buscar artistas pelo nome"
  },

  sort: {
    aria: "Ordenar artistas",
    count: "Mais vídeos",
    rating: "Mais bem avaliados",
    // an alphabet range, so it changes with the language
    name: "A–Z",
    // Four whole messages rather than one with a {direction} param: the
    // button says what the order *is* and what clicking does, and neither
    // language builds that sentence from the same pieces.
    descAria: "Ordem decrescente — inverter",
    ascAria: "Ordem crescente — inverter",
    descTitle: "Ordem decrescente — clique para inverter",
    ascTitle: "Ordem crescente — clique para inverter"
  },

  // the star chip on a card; Norwegian puts a space before the percent sign
  ratingBadge: "★ {rating}%",

  errorTitle: "Não foi possível carregar os artistas",
  hiddenBody:
    "Seu filtro premium e as tags silenciadas escondem todos os artistas. Ajuste os filtros nas configurações.",
  noMatchTitle: "Nenhum artista encontrado",
  noMatchBody:
    "Nada no índice corresponde a “{query}”. Tente um nome mais curto."
};

export default performers;
