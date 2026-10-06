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
    plays: "Le plus de lectures",
    rating: "Les mieux notés",
    // an alphabet range, so it changes with the language
    name: "A–Z",
    // the profile properties with an order; they start low to high
    age: "Âge",
    height: "Taille",
    weight: "Poids",
    bmi: "Silhouette",
    cup: "Bonnet",
    // under the controls while a profile property is the sort
    unknownLast:
      "Les profils qui ne le précisent pas viennent en dernier, dans un sens comme dans l'autre.",
    profilesError:
      "Ce tri a besoin de tous les profils, et ils n'ont pas pu être téléchargés. Vérifie ta connexion et réessaie.",
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

  // the value a card shows while the list is sorted by a profile property;
  // all numbers arrive localized, heights and weights with every unit
  card: {
    age: "{age} ans",
    height: "{cm} cm",
    weight: "{kg} kg",
    cup: "Bonnet {cup}",
    // the play button on a card on touch devices; {name} is the performer's
    previewPlay: "Lire l’aperçu : {name}",
    previewStop: "Arrêter l’aperçu : {name}"
  },

  errorTitle: "Impossible de charger les acteurs",
  hiddenBody:
    "Ton filtre premium et tes étiquettes en sourdine masquent tous les acteurs. Assouplis-les dans les paramètres.",
  noMatchTitle: "Aucun acteur ne correspond",
  noMatchBody:
    "Rien dans l'index ne correspond à « {query} ». Essaie un nom plus court.",

  // The property filters: a dialog of toggle pills per facet (hair, eyes, …)
  // and a track each for age and height, plus one chip per facet in use on
  // the page. Every value is folded from the profiles' free text into a few
  // groups, so these name the groups, not anything a site wrote.
  filters: {
    title: "Filtrer les acteurs",
    lead: "La plupart des profils ne renseignent qu'une partie de ces critères. Un filtre ne garde que les acteurs dont le profil indique ce que tu as choisi.",
    errorTitle: "Impossible de charger les profils",
    errorBody:
      "Les filtres ont besoin du profil de chacun, et le téléchargement a échoué. Vérifie ta connexion et réessaie.",
    noMatchBody:
      "Personne dans l'index ne correspond à tous ces filtres. Retire-en quelques-uns pour en voir plus.",
    // an active-filter chip on the page; {facet} is one of the facets below,
    // {value} its picks joined with "or" ("Blonde or Red") or an age or
    // height band as the track prints it
    chip: "{facet} : {value}",
    facets: {
      gender: "Genre",
      hair: "Cheveux",
      eyes: "Yeux",
      ethnicity: "Origine ethnique",
      cup: "Bonnet",
      // natural or enhanced breasts
      natural: "Poitrine",
      tattoos: "Tatouages",
      piercings: "Piercings",
      age: "Âge",
      height: "Taille",
      bmi: "Silhouette"
    },
    options: {
      gender: {
        woman: "Femme",
        man: "Homme",
        trans: "Trans",
        couple: "Couple",
        nonBinary: "Non binaire"
      },
      hair: {
        blonde: "Blond",
        brunette: "Brun",
        black: "Noir",
        red: "Roux",
        grey: "Gris",
        bald: "Chauve",
        other: "Autre"
      },
      eyes: {
        brown: "Marron",
        blue: "Bleu",
        green: "Vert",
        hazel: "Noisette",
        grey: "Gris",
        black: "Noir",
        other: "Autre"
      },
      ethnicity: {
        white: "Blanche",
        latina: "Latina",
        asian: "Asiatique",
        black: "Noire",
        indian: "Indienne",
        middleEastern: "Moyen-orientale",
        mixed: "Métisse",
        other: "Autre"
      },
      // US cup letters, as the measurements give them
      cup: {
        a: "A",
        b: "B",
        c: "C",
        d: "D",
        ddPlus: "DD+"
      },
      natural: {
        natural: "Naturelle",
        enhanced: "Refaite"
      }
    },
    // The age, height and build tracks. Their ends are open: a handle resting on
    // one means no limit that way. All numbers arrive localized; heights
    // are printed in cm here.
    ageAny: "Tous les âges",
    ageFrom: "{min} ans et plus",
    ageUpTo: "{max} ans et moins",
    ageRange: "{min}–{max} ans",
    heightAny: "Toutes les tailles",
    heightFrom: "{min} cm et plus",
    heightUpTo: "{max} cm et moins",
    heightRange: "{min}–{max} cm",
    // build: {min} and {max} arrive as the words below, never as numbers
    bmiAny: "Toutes les silhouettes",
    bmiFrom: "{min} ou plus ronde",
    bmiUpTo: "{max} ou plus mince",
    bmiRange: "de {min} à {max}",
    // the build words, slimmest first — the range reads in these, not in
    // numbers
    build: {
      slender: "menue",
      slim: "mince",
      medium: "moyenne",
      curvy: "pulpeuse",
      full: "généreuse"
    }
  },

  // The ? on a performer's profile: a disclaimer that profile details are
  // scraped and unchecked, and a correction report the reader sends from
  // their own email app. `email` is that email's text, in the reader's
  // language; {link} is the page address.
  report: {
    helpAria: "À propos de ce profil — signaler une erreur",
    title: "À propos de ce profil",
    disclaimer:
      "Les informations du profil viennent des sites partenaires et d’autres sources publiques. IVDB ne les vérifie pas : certaines peuvent être fausses ou dépassées.",
    question: "Tu as repéré une erreur ? Coche ce qui ne va pas :",
    reason: {
      measurements: "Mensurations, taille ou poids",
      age: "Âge ou date de naissance",
      details: "Une autre information (cheveux, yeux, pays…)",
      media: "Les photos ou vidéos ne montrent pas cette personne",
      self: "Je suis cette personne et je veux faire corriger ou retirer quelque chose",
      other: "Autre chose"
    },
    detailsLabel:
      "Qu’est-ce qui est faux, et que devrait-il y avoir ? (facultatif)",
    note: "Cela ouvre ton application e-mail avec le signalement déjà rempli, adressé à l’équipe IVDB.",
    send: "Écrire l’e-mail",
    email: {
      subject: "Correction de profil IVDB : {name}",
      intro: "Je souhaite signaler une erreur sur ce profil.",
      nameLine: "Acteur : {name}",
      idLine: "ID : {id}",
      linkLine: "Page : {link}",
      reasonsLine: "Ce qui ne va pas :",
      detailsLine: "Détails :",
      profileLine: "Ce que le profil indique actuellement :"
    }
  },

  // Under the profile panel: two slideshows, one item at a time — photos
  // of them, and their videos (a preview clip, or the video's stills where
  // it has none). Settings can switch both off.
  media: {
    photos: "Photos",
    reel: "Extraits",
    // stand-in link text for a video with no title
    fromVideo: "Ouvrir la vidéo",
    counter: "{index} / {total}",
    // what a screen reader calls the photo and clip players
    slideshow: "diaporama",
    previous: "Photo précédente",
    next: "Photo suivante",
    previousVideo: "Vidéo précédente",
    nextVideo: "Vidéo suivante",
    // the slideshows' pause/play button
    pause: "Pause",
    play: "Lecture"
  },

  profile: {
    eyebrow: "Acteur",
    plays: "{count} lecture du script | {count} lectures du script",
    linkAria: "{site} — s'ouvre dans un nouvel onglet",
    // the two link cards: their own accounts, and their profile on each
    // partner site; {name} is the performer's, as the panel prints it
    socials: "Réseaux sociaux",
    moreOf: "Plus de {name}",
    // {site} is the partner site's domain — "pornhub.com"
    partnerLinkAria: "Profil sur {site} — s'ouvre dans un nouvel onglet",
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
