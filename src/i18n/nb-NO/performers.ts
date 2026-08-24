import type enUS from "../en-US/performers";

const performers: typeof enUS = {
  title: "Skuespillere",

  search: {
    placeholder: "Søk i skuespillere",
    aria: "Søk i skuespillere etter navn"
  },

  sort: {
    aria: "Sorter skuespillere",
    count: "Flest videoer",
    rating: "Best vurdert",
    // the Norwegian alphabet ends at Å
    name: "A–Å",
    descAria: "Sortert synkende — snu",
    ascAria: "Sortert stigende — snu",
    descTitle: "Sortert synkende — klikk for å snu",
    ascTitle: "Sortert stigende — klikk for å snu"
  },

  ratingBadge: "★ {rating} %",

  errorTitle: "Kunne ikke laste skuespillerne",
  hiddenBody:
    "Premiumfilteret og de dempede taggene dine skjuler alle skuespillere. Løsne på dem i innstillingene.",
  noMatchTitle: "Ingen treff blant skuespillerne",
  noMatchBody:
    "Ingenting i indeksen passer til «{query}». Prøv et kortere navn."
};

export default performers;
