import type enUS from "../en-US/tags";

const tags: typeof enUS = {
  title: "Tagger",
  errorTitle: "Kunne ikke laste taggene",

  loading: {
    barLabel: "Laster tagger",
    // Norwegian sets a space between the number and the percent sign
    percent: "{percent} %",
    downloading: "Laster ned skriptindeksen",
    parsing: "Leser indeksen",
    noteParsing: "Alt er inne — sorterer den i tagger nå.",
    note: "{received} av ~{total} MB pakket ut — hele katalogen, hentet én gang, så hver side etter dette lastes umiddelbart.",
    noteOversize: "{received} MB pakket ut — hele katalogen, hentet én gang."
  },

  controls: {
    searchPlaceholder: "Søk i tagger",
    searchLabel: "Søk i tagger",
    sortLabel: "Sorter tagger",
    sortByCount: "Flest videoer",
    // the Norwegian alphabet ends at Å, so the A–Z shorthand is A–Å
    sortByName: "A–Å",
    sortedDescLabel: "Sortert synkende — snu",
    sortedAscLabel: "Sortert stigende — snu",
    sortedDescTitle: "Sortert synkende — klikk for å snu",
    sortedAscTitle: "Sortert stigende — klikk for å snu",
    muted: "Dempet",
    mutedCount: "Dempet ({count})"
  },

  empty: {
    searchTitle: "Ingen treff blant taggene",
    searchBody: "Ingenting i indeksen passer til «{query}».",
    filteredBody:
      "Filtrene og de dempede taggene dine skjuler hver eneste tagg i indeksen. Løsne på dem i innstillingene.",
    filteredAction: "Dempede tagger"
  },

  menu: {
    browse: "Utforsk denne taggen",
    mute: "Demp denne taggen"
  },

  toast: {
    refusedTitle: "«{tag}» kan ikke dempes",
    refusedBody:
      "Orienteringstagger bestemmer hvilken katalog du ser — det endrer du i innstillingene.",
    mutedTitle: "Dempet «{tag}»",
    mutedBody:
      "Den ligger i listen over dempede tagger — fjern dempingen når du vil."
  }
};

export default tags;
