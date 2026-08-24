import type enUS from "../en-US/video";

// Typed against the English namespace: a key that exists there and not here
// is a build error, not a silent English string in the middle of a Norwegian
// page. Same contract in every nb-NO file.
const video: typeof enUS = {
  missingTitle: "Fant ikke videoen",
  missingBody:
    "Denne videoen ligger ikke i indeksen lenger, eller så er lenken feil.",

  // "nettstedet" and "dette nettstedet" are definite because they always land
  // after a preposition: "Se på nettstedet", "Mer fra dette nettstedet".
  fallback: {
    video: "Video",
    player: "Videospiller",
    site: "nettstedet",
    thisSite: "dette nettstedet"
  },

  hero: {
    premiumChip: "Premium-script"
  },

  action: {
    getScript: "Hent script",
    watchOn: "Se på {site}",
    addFavorite: "Legg til i favoritter",
    removeFavorite: "Fjern fra favoritter",
    addToPlaylist: "Legg til i spilleliste",
    report: "Rapporter denne videoen"
  },

  premiumNote:
    "Denne videoens script er premium — det følger med videoen på partnernettstedet.",

  // The device name takes no Norwegian article or definite suffix — it is
  // handled as a proper noun, the same way services.ts and help.ts handle it.
  // `script` is protected the same way: bare after the verb, never the
  // Norwegian definite "skriptet".
  playerNote:
    "Handy synkroniserer ikke med avspillingen her på IVDB — denne spilleren viser bare video. Last ned script og spill det av i Handy-oppsettet ditt, så følger bevegelsene videoen.",

  // A mute is "fjernet", never "opphevet" — the same wording as gates.ts and
  // browse.ts, so all three places you meet a muted tag say it alike.
  tag: {
    unmuteAria: "Fjern demping av taggen {tag}",
    mutedTitle: "«{tag}» er dempet — klikk for å fjerne dempingen",
    browse: "Utforsk denne taggen",
    mute: "Demp denne taggen"
  },

  details: {
    title: "Detaljer",
    script: "Script",
    free: "Gratis",
    premium: "Premium",
    published: "Publisert",
    duration: "Varighet",
    format: "Format",
    // the counterpart to "VR 180°" in the same field: "flat" says nothing in
    // Norwegian, "2D" says it at once
    formatFlat: "2D",
    site: "Nettsted",
    scriptBy: "Script av",
    rating: "Vurdering",
    // Norwegian sets a space before the percent sign
    ratingValue: "{percent} %",
    ratingWithVotes: "{percent} % · {votes}",
    // "Avspillinger" alone reads as video plays; `script` is protected, so
    // the label keeps it and the Norwegian head carries the compound
    scriptPlays: "Script-avspillinger"
  },

  rate: {
    title: "Vurder denne videoens script",
    community: "Fellesskapet: {percent} %",
    // the compound keeps `script` and puts the definite ending on the
    // Norwegian head — the same shape settings.ts counts in
    // "{count} script-vurderinger"
    thanks: "Takk for script-vurderingen",
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
    gateHint: "Kommentarer krever din connection key.",
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
      "Scripts er bundet til din Handy. Skriv inn connection key fra Handy-appen for å fortsette.",
    action:
      "Vurderinger og kommentarer er bundet til din Handy. Skriv inn connection key fra Handy-appen for å fortsette."
  },

  script: {
    readyTitle: "Script klart",
    readyBody: "Nedlastingen startet i en ny fane.",
    errorTitle: "Klarte ikke å hente script",
    errorBody:
      "Enten er connection key feil, eller så er ikke din Handy på nett. Sjekk begge deler og prøv igjen."
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
