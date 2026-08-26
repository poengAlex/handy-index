import type enUS from "../en-US/settings";

// House glossary: the product name, `connection key` and `script` stay
// English and uninflected, and the Norwegian grammar is built around them —
// "din Handy", never a Norwegian definite suffix welded onto the term. Where
// Norwegian would compound, the compound takes a hyphen instead, so the
// Norwegian head carries the inflection ("script-vurderinger").
const settings: typeof enUS = {
  title: "Innstillinger",

  display: {
    darkModeLabel: "Mørk modus",
    darkModeCaption: "Bruk det mørke fargetemaet",
    nsfwLabel: "Eksplisitte forhåndsvisninger",
    nsfwCaption: "Vis ekte bilder i stedet for nøytrale ruter",
    playersLabel: "Innebygde spillere",
    playersCaption: "Spill av Pornhub- og xHamster-videoer rett på videosiden",
    fullWidthLabel: "Full bredde",
    fullWidthCaption: "Bruk hele skjermen i stedet for en midtstilt kolonne"
  },

  muted: {
    label: "Dempede tagger",
    caption: "{count} dempet tagg | {count} dempede tagger",
    empty: "Ingenting dempet"
  },

  backgroundSceneTitle: "Bakgrunnsstil",
  backgroundSceneOff: "Av",
  backgroundMotionLabel: "Bevegelse",
  backgroundMotionCaption:
    "La bakgrunnen drive, med et kort byks når du bytter side",
  orientationTitle: "Orientering",

  access: {
    title: "Tilgang",
    premiumScriptsLabel: "Premium-scripts",
    premiumScriptsCaption:
      "Ta med videoer som har script bak en partners betalingsmur",
    premiumVideosLabel: "Premiumvideoer",
    premiumVideosCaption:
      "Ta med videoer som ligger bak en partners betalingsmur"
  },

  previews: {
    title: "Forhåndsvisning på kort",
    hint:
      "Hold pekeren over et kort — eller dra fingeren over det — for å " +
      "forhåndsvise det. Klikk på navnet til en glidebryter for å " +
      "nullstille hastigheten.",
    imageSpeed: "Bildehastighet",
    clipSpeed: "Klipphastighet"
  },

  connectionKey: {
    label: "Connection key",
    placeholder: "f.eks. a1B2c3D4e5",
    hint: "Connection key til din Handy. Den brukes når du laster ned scripts."
  },

  clearDataAction: "Slett data…",

  clear: {
    title: "Slett lagrede data",
    lead:
      "Alt dette nettstedet husker, ligger i denne nettleseren. Slett én " +
      "ting om gangen, eller alt på én gang.",
    clearAll: "Slett alle data",
    allToast: "Alle lokale data er slettet",

    recentLabel: "Nylig sett",
    recentToast: "Nylig sett er slettet",
    favoritesLabel: "Favoritter",
    favoritesToast: "Favorittene er slettet",
    playlistsLabel: "Spillelister",
    playlistsToast: "Spillelistene er slettet",
    mutedToast: "Dempingen er slettet",

    votesLabel: "Vurderinger og stemmer",
    votesEmpty: "Ingenting registrert",
    votesToast: "Vurderingene og stemmene er slettet",
    ratingCount: "{count} script-vurdering | {count} script-vurderinger",
    requestVoteCount:
      "{count} forespørselsstemme | {count} forespørselsstemmer",

    keySaved: "Lagret på denne enheten",
    keyUnset: "Ikke lagret",
    keyToast: "Connection key er slettet",

    preferencesLabel: "Visningsinnstillinger",
    preferencesCaption:
      "Eksplisitte forhåndsvisninger, orientering, tilgangsfiltre, " +
      "hastigheter og bakgrunn",
    preferencesToast: "Visningsinnstillingene er tilbakestilt"
  },

  consent: {
    title: "Før du utforsker katalogen",
    body:
      "IVDB katalogiserer interaktive voksenvideoer med scripts for The " +
      "Handy. Bekreft at du er 18 år eller eldre for å utforske med " +
      "eksplisitte forhåndsvisninger. Fortsetter du uten å bekrefte, " +
      "forblir forhåndsvisningene skjult — du kan endre dette når som " +
      "helst i innstillingene. Valgene dine lagres bare i denne nettleseren.",
    decline: "Fortsett uten forhåndsvisninger",
    accept: "Jeg er 18 år eller eldre"
  },

  keyPrompt: {
    title: "Du trenger en connection key",
    body:
      "Denne handlingen er bundet til din Handy. Skriv inn connection key " +
      "fra Handy-appen for å fortsette.",
    hint:
      "Din Handy må være slått på og tilkoblet nettet for at nøkkelen skal " +
      "virke — en frakoblet enhet gir nøyaktig samme feil som en feil nøkkel.",
    save: "Lagre og fortsett"
  }
};

export default settings;
