import type enUS from "../en-US/settings";

// "Handy-en din" med bindestrek, samme konvensjon som services.ts: den
// bestemte endelsen henger på et engelsk varemerke, og bindestreken holder
// navnet lesbart.
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
    fullWidthCaption: "Bruk hele skjermen i stedet for en midtstilt kolonne",
    backgroundLabel: "Animert bakgrunn",
    backgroundCaption: "Vis den myke, bevegelige gradienten bak hver side"
  },

  muted: {
    label: "Dempede tagger",
    caption: "{count} dempet tagg | {count} dempede tagger",
    empty: "Ingenting dempet"
  },

  orientationTitle: "Orientering",

  access: {
    title: "Tilgang",
    premiumScriptsLabel: "Premiumskript",
    premiumScriptsCaption:
      "Ta med videoer der skriptet ligger bak en partners betalingsmur",
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
    label: "Tilkoblingsnøkkel",
    placeholder: "f.eks. a1B2c3D4e5",
    hint:
      "Tilkoblingsnøkkelen til Handy-en din. Den brukes når du laster ned " +
      "skript."
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
    ratingCount: "{count} skriptvurdering | {count} skriptvurderinger",
    requestVoteCount:
      "{count} forespørselsstemme | {count} forespørselsstemmer",

    keySaved: "Lagret på denne enheten",
    keyUnset: "Ikke lagret",
    keyToast: "Tilkoblingsnøkkelen er slettet",

    preferencesLabel: "Visningsinnstillinger",
    preferencesCaption:
      "Eksplisitte forhåndsvisninger, orientering, tilgangsfiltre, " +
      "hastigheter og bakgrunn",
    preferencesToast: "Visningsinnstillingene er tilbakestilt"
  },

  consent: {
    title: "Før du utforsker katalogen",
    body:
      "IVDB katalogiserer interaktive voksenvideoer med skript for The " +
      "Handy. Bekreft at du er 18 år eller eldre for å utforske med " +
      "eksplisitte forhåndsvisninger. Fortsetter du uten å bekrefte, " +
      "forblir forhåndsvisningene skjult — du kan endre dette når som " +
      "helst i innstillingene. Valgene dine lagres bare i denne nettleseren.",
    decline: "Fortsett uten forhåndsvisninger",
    accept: "Jeg er 18 år eller eldre"
  },

  keyPrompt: {
    title: "Du trenger en tilkoblingsnøkkel",
    body:
      "Denne handlingen er bundet til Handy-en din. Skriv inn " +
      "tilkoblingsnøkkelen fra Handy-appen for å fortsette.",
    hint:
      "Handy-en din må være slått på og tilkoblet nettet for at nøkkelen " +
      "skal virke — en frakoblet enhet gir nøyaktig samme feil som en feil " +
      "nøkkel.",
    save: "Lagre og fortsett"
  }
};

export default settings;
