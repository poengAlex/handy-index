import type enUS from "../en-US/video";

// Typed against the English namespace: a key that exists there and not here
// is a build error, not a silent English string in the middle of a Norwegian
// page. Same contract in every nb-NO file.
const video: typeof enUS = {
  missingTitle: "Fant ikke videoen",
  missingBody:
    "Denne videoen ligger ikke i indeksen lenger, eller så er lenken feil.",

  // "nettstedet" og "dette nettstedet" står i bestemt form fordi de alltid
  // havner etter en preposisjon: "Se på nettstedet", "Mer fra dette
  // nettstedet".
  fallback: {
    video: "Video",
    player: "Videospiller",
    site: "nettstedet",
    thisSite: "dette nettstedet"
  },

  hero: {
    premiumChip: "Premiumskript"
  },

  action: {
    getScript: "Hent skript",
    watchOn: "Se på {site}",
    addFavorite: "Legg til i favoritter",
    removeFavorite: "Fjern fra favoritter",
    addToPlaylist: "Legg til i spilleliste",
    report: "Rapporter denne videoen"
  },

  premiumNote:
    "Skriptet til denne videoen er premium — det følger med videoen på partnernettstedet.",

  // "Handy-en" med bindestrek, samme som services.ts: den bestemte endelsen
  // på et engelsk merkenavn ser ut som en skrivefeil uten.
  playerNote:
    "Handy-en synkroniserer ikke med avspillingen her på IVDB — denne spilleren viser bare video. Last ned skriptet og spill det av i Handy-oppsettet ditt, så følger bevegelsene videoen.",

  // Demping «fjernes», den «oppheves» ikke — samme ordlyd som gates.ts og
  // browse.ts, så de tre stedene man møter en dempet tagg sier det likt.
  tag: {
    unmuteAria: "Fjern demping av taggen {tag}",
    mutedTitle: "«{tag}» er dempet — klikk for å fjerne dempingen",
    browse: "Utforsk denne taggen",
    mute: "Demp denne taggen"
  },

  details: {
    title: "Detaljer",
    script: "Skript",
    free: "Gratis",
    premium: "Premium",
    published: "Publisert",
    duration: "Varighet",
    format: "Format",
    // motstykket til "VR 180°" i det samme feltet: "flat" sier ingenting på
    // norsk, "2D" sier det med én gang
    formatFlat: "2D",
    site: "Nettsted",
    scriptBy: "Skript av",
    rating: "Vurdering",
    // norsk setter mellomrom foran prosenttegnet
    ratingValue: "{percent} %",
    ratingWithVotes: "{percent} % · {votes}",
    scriptPlays: "Avspillinger"
  },

  rate: {
    title: "Vurder dette skriptet",
    community: "Fellesskapet: {percent} %",
    thanks: "Takk for vurderingen",
    errorTitle: "Klarte ikke å lagre vurderingen"
  },

  gallery: {
    photosTitle: "Bilder",
    previewTitle: "Forhåndsvisning",
    previewBadge: "Forhåndsvisning",
    clipAria: "Spill av forhåndsvisningen i full størrelse",
    photoAria: "Åpne bilde {index} av {total}",
    stillAlt: "Stillbilde {number} fra {title}",
    previousPhoto: "Forrige bilde",
    nextPhoto: "Neste bilde",
    closeViewer: "Lukk visningen",
    viewerCount: "{index} / {total}"
  },

  comments: {
    title: "Kommentarer",
    gateHint: "Kommentarer krever tilkoblingsnøkkelen din.",
    gateAction: "Legg inn nøkkel",
    inputLabel: "Skriv en kommentar",
    submit: "Kommenter",
    errorHint: "Kunne ikke laste kommentarene.",
    emptyHint: "Ingen kommentarer ennå — bli den første.",
    postedTitle: "Kommentaren er sendt inn",
    postedBody: "Den dukker opp så snart den er godkjent.",
    postErrorTitle: "Klarte ikke å sende inn kommentaren"
  },

  more: {
    related: "Mer som dette",
    fromPartner: "Mer fra {site}"
  },

  keyPrompt: {
    script:
      "Skript er bundet til Handy-en din. Skriv inn tilkoblingsnøkkelen fra Handy-appen for å fortsette.",
    action:
      "Vurderinger og kommentarer er bundet til Handy-en din. Skriv inn tilkoblingsnøkkelen fra Handy-appen for å fortsette."
  },

  script: {
    readyTitle: "Skriptet er klart",
    readyBody: "Nedlastingen startet i en ny fane.",
    errorTitle: "Klarte ikke å hente skriptet",
    errorBody:
      "Enten er tilkoblingsnøkkelen feil, eller så er ikke Handy-en din på nett. Sjekk begge deler og prøv igjen."
  },

  mute: {
    refusedTitle: "«{tag}» kan ikke dempes",
    refusedBody:
      "Orienteringstagger bestemmer hvilken katalog du ser — det endrer du i innstillingene.",
    doneTitle: "Dempet «{tag}»",
    doneBody:
      "Den ligger i listen over dempede tagger — fjern dempingen når du vil.",
    undoneTitle: "Fjernet dempingen av «{tag}»"
  },

  share: {
    copiedTitle: "Lenken er kopiert",
    errorTitle: "Klarte ikke å kopiere lenken"
  },

  report: {
    subject: "Jeg vil rapportere en video",
    intro: "Jeg vil rapportere en video.",
    titleLine: "Tittel: {title}",
    untitled: "(uten tittel)",
    idLine: "Video-ID: {id}",
    siteLine: "Nettsted: {site}",
    linkLine: "Lenke: {link}",
    reasonLine: "Årsak til rapporteringen:"
  }
};

export default video;
