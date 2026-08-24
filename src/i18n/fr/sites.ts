import type enUS from "../en-US/sites";

// The site directory (/sites): one nav card per partner site, with a name
// filter. Almost every string here is a count shape — the header line and the
// card captions are built from `common.count.*` pieces joined with "·", so
// each message below covers one phrase of that line, never the whole line.
const sites: typeof enUS = {
  title: "Sites",

  search: {
    placeholder: "Rechercher un site",
    aria: "Rechercher un site"
  },

  count: {
    // the tail of the header line when no filter is narrowing anything;
    // {total} arrives as "2,000 videos" from common.count.videos
    totalInIndex: "{total} dans l'index",
    // the two paywalls are named in full on the cards: they are different
    // gates, and a bare "500 premium" would not say which
    premiumVideos: "{count} vidéo premium | {count} vidéos premium",
    premiumScripts: "{count} script premium | {count} scripts premium"
  },

  errorTitle: "Impossible de charger les sites",
  emptyBody:
    "L'index est revenu sans le moindre site. Essayez de le charger à nouveau.",
  noMatchTitle: "Aucun site ne correspond",
  noMatchBody:
    "Aucun nom de site ne correspond à cette recherche. Essayez moins de lettres."
};

export default sites;
