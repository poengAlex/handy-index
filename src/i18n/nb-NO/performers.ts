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
    age: "Alder",
    height: "Høyde",
    weight: "Vekt",
    bmi: "Kroppsbygning",
    cup: "Cupstørrelse",
    unknownLast:
      "Profiler som ikke oppgir dette, kommer sist uansett rekkefølge.",
    profilesError:
      "Denne sorteringen trenger alle profilene, og de ble ikke lastet ned. Sjekk tilkoblingen og prøv igjen.",
    descAria: "Sortert synkende — snu",
    ascAria: "Sortert stigende — snu",
    descTitle: "Sortert synkende — klikk for å snu",
    ascTitle: "Sortert stigende — klikk for å snu"
  },

  ratingBadge: "★ {rating} %",

  card: {
    age: "{age} år",
    height: "{cm} cm",
    weight: "{kg} kg",
    cup: "Cup {cup}"
  },

  errorTitle: "Kunne ikke laste skuespillerne",
  hiddenBody:
    "Premiumfilteret og de dempede taggene dine skjuler alle skuespillere. Løsne på dem i innstillingene.",
  noMatchTitle: "Ingen treff blant skuespillerne",
  noMatchBody:
    "Ingenting i indeksen passer til «{query}». Prøv et kortere navn.",

  filters: {
    title: "Filtrer skuespillere",
    lead: "De fleste profiler oppgir bare noen av disse egenskapene. Filteret beholder bare skuespillerne hvis profil sier det du valgte.",
    errorTitle: "Kunne ikke laste profilene",
    errorBody:
      "Filtrene trenger profilene til alle, og de ble ikke lastet ned. Sjekk tilkoblingen og prøv igjen.",
    noMatchBody:
      "Ingen i indeksen passer til alle disse filtrene. Fjern noen for å se flere.",
    chip: "{facet}: {value}",
    facets: {
      gender: "Kjønn",
      hair: "Hår",
      eyes: "Øyne",
      ethnicity: "Etnisitet",
      cup: "Kupestørrelse",
      natural: "Bryster",
      tattoos: "Tatoveringer",
      piercings: "Piercinger",
      age: "Alder",
      height: "Høyde",
      bmi: "Kroppsbygning"
    },
    options: {
      gender: {
        woman: "Kvinne",
        man: "Mann",
        trans: "Trans",
        couple: "Par",
        nonBinary: "Ikke-binær"
      },
      hair: {
        blonde: "Blondt",
        brunette: "Brunt",
        black: "Svart",
        red: "Rødt",
        grey: "Grått",
        bald: "Skallet",
        other: "Annet"
      },
      eyes: {
        brown: "Brune",
        blue: "Blå",
        green: "Grønne",
        hazel: "Nøttebrune",
        grey: "Grå",
        black: "Svarte",
        other: "Andre"
      },
      ethnicity: {
        white: "Hvit",
        latina: "Latina",
        asian: "Asiatisk",
        black: "Svart",
        indian: "Indisk",
        middleEastern: "Midtøsten",
        mixed: "Blandet",
        other: "Annen"
      },
      cup: {
        a: "A",
        b: "B",
        c: "C",
        d: "D",
        ddPlus: "DD+"
      },
      natural: {
        natural: "Naturlige",
        enhanced: "Forstørrede"
      }
    },
    ageAny: "Hvilken som helst alder",
    ageFrom: "{min} og eldre",
    ageUpTo: "{max} og yngre",
    ageRange: "{min}–{max}",
    heightAny: "Hvilken som helst høyde",
    heightFrom: "fra {min} cm",
    heightUpTo: "opp til {max} cm",
    heightRange: "{min}–{max} cm",
    bmiAny: "Alle kroppsbygninger",
    bmiFrom: "{min} eller fyldigere",
    bmiUpTo: "{max} eller slankere",
    bmiRange: "{min} til {max}",
    build: {
      slender: "spinkel",
      slim: "slank",
      medium: "middels",
      curvy: "kurvete",
      full: "fyldig"
    }
  },

  report: {
    helpAria: "Om denne profilen – meld fra om feil",
    title: "Om denne profilen",
    disclaimer:
      "Profilopplysningene kommer fra partnersidene og andre offentlige kilder. IVDB sjekker dem ikke, så noe kan være feil eller utdatert.",
    question: "Fant du en feil? Kryss av for det som er feil:",
    reason: {
      measurements: "Mål, høyde eller vekt",
      age: "Alder eller fødselsdato",
      details: "En annen opplysning (hår, øyne, land …)",
      media: "Bildene eller videoene er ikke av denne personen",
      self: "Dette er meg, og jeg vil få noe rettet eller fjernet",
      other: "Noe annet"
    },
    detailsLabel: "Hva er feil, og hva burde stå der? (valgfritt)",
    note: "Dette åpner e-postappen din med meldingen ferdig utfylt, til IVDB-teamet.",
    send: "Skriv e-post",
    email: {
      subject: "Rettelse av profil på IVDB: {name}",
      intro: "Jeg vil melde fra om en feil i denne profilen.",
      nameLine: "Skuespiller: {name}",
      idLine: "ID: {id}",
      linkLine: "Side: {link}",
      reasonsLine: "Hva som er feil:",
      detailsLine: "Detaljer:",
      profileLine: "Hva profilen sier nå:"
    }
  },

  media: {
    photos: "Bilder",
    reel: "Klipp",
    fromVideo: "Åpne videoen",
    counter: "{index} / {total}",
    slideshow: "lysbildefremvisning",
    previous: "Forrige bilde",
    next: "Neste bilde",
    previousVideo: "Forrige video",
    nextVideo: "Neste video",
    pause: "Pause",
    play: "Spill av"
  },

  profile: {
    eyebrow: "Skuespiller",
    plays: "{count} script-avspilling | {count} script-avspillinger",
    linkAria: "{site} — åpnes i ny fane",
    socials: "Sosiale medier",
    moreOf: "Mer med {name}",
    partnerLinkAria: "Profil på {site} — åpnes i ny fane",
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
