import type enUS from "../en-US/performers";

// The performer directory (/performers): a grid of avatar cards with a name
// search, a sort control and endless scroll. Same page shape as `sites` — a
// header count line, a search box and two empty states — so the key names are
// kept parallel with that namespace on purpose.
const performers: typeof enUS = {
  title: "Intérpretes",

  search: {
    placeholder: "Buscar intérpretes",
    aria: "Buscar intérpretes por nombre"
  },

  sort: {
    aria: "Ordenar intérpretes",
    count: "Más videos",
    rating: "Mejor valorados",
    // an alphabet range, so it changes with the language
    name: "A–Z",
    // Four whole messages rather than one with a {direction} param: the
    // button says what the order *is* and what clicking does, and neither
    // language builds that sentence from the same pieces.
    descAria: "Orden descendente — invertir",
    ascAria: "Orden ascendente — invertir",
    descTitle: "Orden descendente — haz clic para invertir",
    ascTitle: "Orden ascendente — haz clic para invertir"
  },

  // the star chip on a card; Norwegian puts a space before the percent sign
  ratingBadge: "★ {rating}%",

  errorTitle: "No se pudieron cargar los intérpretes",
  hiddenBody:
    "Tu filtro premium y las etiquetas silenciadas ocultan a todos los intérpretes. Quita alguno en los ajustes.",
  noMatchTitle: "Ningún intérprete coincide",
  noMatchBody:
    "Nada del índice coincide con “{query}”. Prueba con un nombre más corto."
};

export default performers;
