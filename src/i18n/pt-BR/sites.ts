import type enUS from "../en-US/sites";

// The site directory (/sites): one nav card per partner site, with a name
// filter. Almost every string here is a count shape — the header line and the
// card captions are built from `common.count.*` pieces joined with "·", so
// each message below covers one phrase of that line, never the whole line.
const sites: typeof enUS = {
  title: "Sites",

  search: {
    placeholder: "Buscar sites",
    aria: "Buscar sites"
  },

  count: {
    // the tail of the header line when no filter is narrowing anything;
    // {total} arrives as "2,000 videos" from common.count.videos
    totalInIndex: "{total} no índice",
    // the two paywalls are named in full on the cards: they are different
    // gates, and a bare "500 premium" would not say which
    premiumVideos: "{count} vídeo premium | {count} vídeos premium",
    premiumScripts: "{count} script premium | {count} scripts premium"
  },

  errorTitle: "Não foi possível carregar os sites",
  emptyBody: "O índice voltou sem nenhum site. Tente carregar de novo.",
  noMatchTitle: "Nenhum site encontrado",
  noMatchBody: "Nenhum nome de site bate com essa busca. Tente menos letras."
};

export default sites;
