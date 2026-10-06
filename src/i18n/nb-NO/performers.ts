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
    plays: "Mest spilt",
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
    "Ingenting i indeksen passer til «{query}». Prøv et kortere navn.",

  profile: {
    eyebrow: "Skuespiller",
    plays: "{count} script-avspilling | {count} script-avspillinger",
    linkAria: "{site} — åpnes i ny fane",
    about: "Biografi",
    hobbies: "Hobbyer",
    details: "Profil",
    born: "Født",
    age: "Alder",
    from: "Fra",
    career: "Karriere",
    careerSpan: "{start}–{end}",
    careerSince: "Siden {start}",
    careerActive: "Aktiv",
    careerInactive: "Inaktiv",
    height: "Høyde",
    weight: "Vekt",
    heightValue: "{cm} cm",
    weightValue: "{kg} kg",
    measurements: "Mål",
    hair: "Hår",
    eyes: "Øyne",
    ethnicity: "Etnisitet",
    starSign: "Stjernetegn",
    tattoos: "Tatoveringer",
    piercings: "Piercinger",
    yes: "Ja",
    no: "Nei"
  }
};

export default performers;
