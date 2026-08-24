import type enUS from "../en-US/sites";

const sites: typeof enUS = {
  title: "Nettsteder",

  search: {
    placeholder: "Søk i nettsteder",
    aria: "Søk i nettsteder"
  },

  count: {
    totalInIndex: "{total} i indeksen",
    // "premiumvideo" compounds into one word the Norwegian way. `script` is
    // a protected English term, so its compound takes a hyphen and the
    // English plural the source uses — no Norwegian ending on the term.
    premiumVideos: "{count} premiumvideo | {count} premiumvideoer",
    premiumScripts: "{count} premium-script | {count} premium-scripts"
  },

  errorTitle: "Kunne ikke laste nettstedene",
  emptyBody:
    "Indeksen kom tilbake uten et eneste nettsted. Prøv å laste den inn på nytt.",
  noMatchTitle: "Ingen treff blant nettstedene",
  noMatchBody: "Ingen nettstedsnavn passer til søket. Prøv med færre bokstaver."
};

export default sites;
