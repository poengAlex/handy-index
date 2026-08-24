// The site directory (/sites): one nav card per partner site, with a name
// filter. Almost every string here is a count shape — the header line and the
// card captions are built from `common.count.*` pieces joined with "·", so
// each message below covers one phrase of that line, never the whole line.
export default {
  title: "Sites",

  search: {
    placeholder: "Search sites",
    aria: "Search sites"
  },

  count: {
    // the tail of the header line when no filter is narrowing anything;
    // {total} arrives as "2,000 videos" from common.count.videos
    totalInIndex: "{total} in the index",
    // the two paywalls are named in full on the cards: they are different
    // gates, and a bare "500 premium" would not say which
    premiumVideos: "{count} premium video | {count} premium videos",
    premiumScripts: "{count} premium script | {count} premium scripts"
  },

  errorTitle: "Couldn't load sites",
  emptyBody: "The index came back without a single site. Try loading it again.",
  noMatchTitle: "No sites match",
  noMatchBody: "No site names match that search. Try fewer letters."
};
