import type enUS from "../en-US/performers";

// The performer directory (/performers): a grid of avatar cards with a name
// search, a sort control and endless scroll. Same page shape as `sites` — a
// header count line, a search box and two empty states — so the key names are
// kept parallel with that namespace on purpose.
const performers: typeof enUS = {
  title: "Darsteller",

  search: {
    placeholder: "Darsteller suchen",
    aria: "Darsteller nach Namen suchen"
  },

  sort: {
    aria: "Darsteller sortieren",
    count: "Meiste Videos",
    plays: "Meistgespielt",
    rating: "Bestbewertet",
    // an alphabet range, so it changes with the language
    name: "A–Z",
    // the profile properties with an order; they start low to high
    age: "Alter",
    height: "Größe",
    weight: "Gewicht",
    bmi: "Statur",
    cup: "Körbchengröße",
    // under the controls while a profile property is the sort
    unknownLast:
      "Wer im Profil keine Angabe dazu hat, steht am Ende – in beide Richtungen.",
    profilesError:
      "Für diese Sortierung braucht es alle Profile, und die ließen sich nicht laden. Prüf deine Verbindung und versuch es noch einmal.",
    // Four whole messages rather than one with a {direction} param: the
    // button says what the order *is* and what clicking does, and neither
    // language builds that sentence from the same pieces.
    descAria: "Absteigend sortiert — umkehren",
    ascAria: "Aufsteigend sortiert — umkehren",
    descTitle: "Absteigend sortiert — zum Umkehren klicken",
    ascTitle: "Aufsteigend sortiert — zum Umkehren klicken"
  },

  // the star chip on a card; Norwegian puts a space before the percent sign
  // — so does German, and here it is a non-breaking one (U+00A0) so the chip
  // never wraps between the number and the sign
  ratingBadge: "★ {rating} %",

  // the value a card shows while the list is sorted by a profile property;
  // all numbers arrive localized, heights and weights with every unit
  card: {
    age: "Alter {age}",
    height: "{cm} cm",
    weight: "{kg} kg",
    cup: "Körbchen {cup}"
  },

  errorTitle: "Darsteller konnten nicht geladen werden",
  hiddenBody:
    "Dein Premium-Filter und die stummgeschalteten Schlagwörter verbergen jeden Darsteller. Lockere sie in den Einstellungen.",
  noMatchTitle: "Keine passenden Darsteller",
  noMatchBody:
    "Nichts im Index passt zu „{query}“. Versuche es mit einem kürzeren Namen.",

  // The property filters: a dialog of toggle pills per facet (hair, eyes, …)
  // and a track each for age and height, plus one chip per facet in use on
  // the page. Every value is folded from the profiles' free text into a few
  // groups, so these name the groups, not anything a site wrote.
  filters: {
    title: "Darsteller filtern",
    lead: "Die meisten Profile enthalten nur einen Teil dieser Angaben. Ein Filter zeigt nur Darsteller, deren Profil das Gewählte nennt.",
    errorTitle: "Profile konnten nicht geladen werden",
    errorBody:
      "Die Filter brauchen die Profile aller Darsteller, und der Download hat nicht geklappt. Prüfe deine Verbindung und versuche es erneut.",
    noMatchBody:
      "Kein Darsteller im Index erfüllt alle diese Filter. Entferne einige, um mehr zu sehen.",
    // an active-filter chip on the page; {facet} is one of the facets below,
    // {value} its picks joined with "or" ("Blonde or Red") or an age or
    // height band as the track prints it
    chip: "{facet}: {value}",
    facets: {
      gender: "Geschlecht",
      hair: "Haare",
      eyes: "Augen",
      ethnicity: "Ethnie",
      cup: "Körbchengröße",
      // natural or enhanced breasts
      natural: "Brüste",
      tattoos: "Tattoos",
      piercings: "Piercings",
      age: "Alter",
      height: "Größe",
      bmi: "Statur"
    },
    options: {
      gender: {
        woman: "Weiblich",
        man: "Männlich",
        trans: "Trans",
        couple: "Paar",
        nonBinary: "Nicht-binär"
      },
      hair: {
        blonde: "Blond",
        brunette: "Braun",
        black: "Schwarz",
        red: "Rot",
        grey: "Grau",
        bald: "Glatze",
        other: "Andere"
      },
      eyes: {
        brown: "Braun",
        blue: "Blau",
        green: "Grün",
        hazel: "Haselnussbraun",
        grey: "Grau",
        black: "Schwarz",
        other: "Andere"
      },
      ethnicity: {
        white: "Weiß",
        latina: "Latina",
        asian: "Asiatisch",
        black: "Schwarz",
        indian: "Indisch",
        middleEastern: "Nahöstlich",
        mixed: "Gemischt",
        other: "Andere"
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
        natural: "Natürlich",
        enhanced: "Vergrößert"
      }
    },
    // The age, height and build tracks. Their ends are open: a handle resting on
    // one means no limit that way. All numbers arrive localized; heights
    // are printed in cm here.
    ageAny: "Jedes Alter",
    ageFrom: "ab {min}",
    ageUpTo: "bis {max}",
    ageRange: "{min}–{max}",
    heightAny: "Jede Größe",
    heightFrom: "ab {min} cm",
    heightUpTo: "bis {max} cm",
    heightRange: "{min}–{max} cm",
    // build: {min} and {max} arrive as the words below, never as numbers
    bmiAny: "Jede Statur",
    bmiFrom: "{min} oder voller",
    bmiUpTo: "{max} oder schlanker",
    bmiRange: "{min} bis {max}",
    // the build words, slimmest first — the range reads in these, not in
    // numbers
    build: {
      slender: "zierlich",
      slim: "schlank",
      medium: "mittel",
      curvy: "kurvig",
      full: "vollschlank"
    }
  },

  // The ? on a performer's profile: a disclaimer that profile details are
  // scraped and unchecked, and a correction report the reader sends from
  // their own email app. `email` is that email's text, in the reader's
  // language; {link} is the page address.
  report: {
    helpAria: "Über dieses Profil – Fehler melden",
    title: "Über dieses Profil",
    disclaimer:
      "Die Profilangaben stammen von den Partnerseiten und anderen öffentlichen Quellen. IVDB prüft sie nicht, daher können manche falsch oder veraltet sein.",
    question: "Einen Fehler entdeckt? Kreuz an, was nicht stimmt:",
    reason: {
      measurements: "Maße, Größe oder Gewicht",
      age: "Alter oder Geburtstag",
      details: "Eine andere Angabe (Haare, Augen, Land …)",
      media: "Die Fotos oder Videos zeigen nicht diese Person",
      self: "Ich bin diese Person und möchte etwas korrigieren oder entfernen lassen",
      other: "Etwas anderes"
    },
    detailsLabel: "Was ist falsch, und was sollte dort stehen? (optional)",
    note: "Damit öffnet sich deine E-Mail-App mit der fertig ausgefüllten Meldung an das IVDB-Team.",
    send: "E-Mail schreiben",
    email: {
      subject: "IVDB-Profilkorrektur: {name}",
      intro: "Ich möchte einen Fehler in diesem Darstellerprofil melden.",
      nameLine: "Darsteller: {name}",
      idLine: "Darsteller-ID: {id}",
      linkLine: "Seite: {link}",
      reasonsLine: "Was nicht stimmt:",
      detailsLine: "Details:",
      profileLine: "Was das Profil derzeit angibt:"
    }
  },

  // Under the profile panel: two slideshows, one item at a time — photos
  // of them, and their videos (a preview clip, or the video's stills where
  // it has none). Settings can switch both off.
  media: {
    photos: "Fotos",
    reel: "Clips",
    // stand-in link text for a video with no title
    fromVideo: "Video öffnen",
    counter: "{index} / {total}",
    // what a screen reader calls the photo and clip players
    slideshow: "Diashow",
    previous: "Voriges Foto",
    next: "Nächstes Foto",
    previousVideo: "Voriges Video",
    nextVideo: "Nächstes Video",
    // the slideshows' pause/play button
    pause: "Anhalten",
    play: "Abspielen"
  },

  profile: {
    eyebrow: "Darsteller",
    plays: "{count} Script-Wiedergabe | {count} Script-Wiedergaben",
    linkAria: "{site} — öffnet sich in einem neuen Tab",
    // the two link cards: their own accounts, and their profile on each
    // partner site; {name} is the performer's, as the panel prints it
    socials: "Social Media",
    moreOf: "Mehr von {name}",
    // {site} is the partner site's domain — "pornhub.com"
    partnerLinkAria: "Profil auf {site} — öffnet sich in einem neuen Tab",
    about: "Biografie",
    hobbies: "Hobbys",
    details: "Profil",
    born: "Geboren",
    age: "Alter",
    from: "Herkunft",
    career: "Karriere",
    careerSpan: "{start}–{end}",
    careerSince: "Seit {start}",
    careerActive: "Aktiv",
    careerInactive: "Inaktiv",
    height: "Größe",
    weight: "Gewicht",
    heightValue: "{cm} cm",
    weightValue: "{kg} kg",
    measurements: "Maße",
    hair: "Haare",
    eyes: "Augen",
    ethnicity: "Ethnie",
    starSign: "Sternzeichen",
    tattoos: "Tattoos",
    piercings: "Piercings",
    yes: "Ja",
    no: "Nein"
  }
};

export default performers;
