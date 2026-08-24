import type enUS from "../en-US/sites";

// The site directory (/sites): one nav card per partner site, with a name
// filter. Almost every string here is a count shape — the header line and the
// card captions are built from `common.count.*` pieces joined with "·", so
// each message below covers one phrase of that line, never the whole line.
const sites: typeof enUS = {
  title: "Websites",

  search: {
    placeholder: "Websites suchen",
    aria: "Websites suchen"
  },

  count: {
    // the tail of the header line when no filter is narrowing anything;
    // {total} arrives as "2,000 videos" from common.count.videos
    totalInIndex: "{total} im Index",
    // the two paywalls are named in full on the cards: they are different
    // gates, and a bare "500 premium" would not say which
    premiumVideos: "{count} Premium-Video | {count} Premium-Videos",
    premiumScripts: "{count} Premium-Skript | {count} Premium-Skripte"
  },

  errorTitle: "Websites konnten nicht geladen werden",
  emptyBody:
    "Der Index kam ohne eine einzige Website zurück. Versuche, ihn neu zu laden.",
  noMatchTitle: "Keine passenden Websites",
  noMatchBody:
    "Kein Website-Name passt zu dieser Suche. Versuche es mit weniger Buchstaben."
};

export default sites;
