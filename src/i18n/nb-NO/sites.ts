import type enUS from "../en-US/sites";

const sites: typeof enUS = {
  title: "Nettsteder",

  search: {
    placeholder: "Søk i nettsteder",
    aria: "Søk i nettsteder"
  },

  count: {
    totalInIndex: "{total} i indeksen",
    // Norwegian compounds these into one word; "skript" is neuter and one
    // syllable, so its plural stays unmarked.
    premiumVideos: "{count} premiumvideo | {count} premiumvideoer",
    premiumScripts: "{count} premiumskript | {count} premiumskript"
  },

  errorTitle: "Kunne ikke laste nettstedene",
  emptyBody:
    "Indeksen kom tilbake uten et eneste nettsted. Prøv å laste den inn på nytt.",
  noMatchTitle: "Ingen treff blant nettstedene",
  noMatchBody: "Ingen nettstedsnavn passer til søket. Prøv med færre bokstaver."
};

export default sites;
