import type enUS from "../en-US/performers";

// The performer directory (/performers): a grid of avatar cards with a name
// search, a sort control and endless scroll. Same page shape as `sites` — a
// header count line, a search box and two empty states — so the key names are
// kept parallel with that namespace on purpose.
const performers: typeof enUS = {
  title: "Acteurs",

  search: {
    placeholder: "Rechercher un acteur",
    aria: "Rechercher un acteur par son nom"
  },

  sort: {
    aria: "Trier les acteurs",
    count: "Le plus de vidéos",
    rating: "Les mieux notés",
    // an alphabet range, so it changes with the language
    name: "A–Z",
    // Four whole messages rather than one with a {direction} param: the
    // button says what the order *is* and what clicking does, and neither
    // language builds that sentence from the same pieces.
    descAria: "Tri décroissant — inverser",
    ascAria: "Tri croissant — inverser",
    descTitle: "Tri décroissant — cliquer pour inverser",
    ascTitle: "Tri croissant — cliquer pour inverser"
  },

  // the star chip on a card; Norwegian puts a space before the percent sign
  ratingBadge: "★ {rating} %",

  errorTitle: "Impossible de charger les acteurs",
  hiddenBody:
    "Ton filtre premium et tes étiquettes en sourdine masquent tous les acteurs. Assouplis-les dans les paramètres.",
  noMatchTitle: "Aucun acteur ne correspond",
  noMatchBody:
    "Rien dans l'index ne correspond à « {query} ». Essaie un nom plus court.",

  profile: {
    eyebrow: "Acteur",
    plays: "{count} lecture du script | {count} lectures du script",
    linkAria: "{site} — s'ouvre dans un nouvel onglet",
    about: "Biographie",
    hobbies: "Loisirs",
    details: "Profil",
    born: "Naissance",
    age: "Âge",
    from: "Origine",
    career: "Carrière",
    careerSpan: "{start}–{end}",
    careerSince: "Depuis {start}",
    careerActive: "En activité",
    careerInactive: "Plus en activité",
    height: "Taille",
    weight: "Poids",
    heightValue: "{cm} cm",
    weightValue: "{kg} kg",
    measurements: "Mensurations",
    hair: "Cheveux",
    eyes: "Yeux",
    ethnicity: "Origine ethnique",
    starSign: "Signe astrologique",
    tattoos: "Tatouages",
    piercings: "Piercings",
    yes: "Oui",
    no: "Non"
  }
};

export default performers;
