import type enUS from "../en-US/sites";

// The site directory (/sites): one nav card per partner site, with a name
// filter. Almost every string here is a count shape — the header line and the
// card captions are built from `common.count.*` pieces joined with "·", so
// each message below covers one phrase of that line, never the whole line.
const sites: typeof enUS = {
  title: "Sitios",

  search: {
    placeholder: "Buscar sitios",
    aria: "Buscar sitios"
  },

  count: {
    // the tail of the header line when no filter is narrowing anything;
    // {total} arrives as "2,000 videos" from common.count.videos
    totalInIndex: "{total} en el índice",
    // the two paywalls are named in full on the cards: they are different
    // gates, and a bare "500 premium" would not say which
    premiumVideos: "{count} video premium | {count} videos premium",
    premiumScripts: "{count} script premium | {count} scripts premium"
  },

  errorTitle: "No se pudieron cargar los sitios",
  emptyBody: "El índice llegó sin un solo sitio. Vuelve a cargarlo.",
  noMatchTitle: "Ningún sitio coincide",
  noMatchBody:
    "Ningún nombre de sitio coincide con esa búsqueda. Prueba con menos letras."
};

export default sites;
