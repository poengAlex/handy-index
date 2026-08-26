import type enUS from "../en-US/media";

const media: typeof enUS = {
  card: {
    fallbackTitle: "Video",
    // Norwegian sets a space before the percent sign
    rating: "★ {rating} %"
  },

  menu: {
    moreActions: "Flere handlinger",
    open: "Åpne",
    openNewTab: "Åpne i ny fane",
    addFavorite: "Legg til i favoritter",
    removeFavorite: "Fjern fra favoritter",
    addToPlaylist: "Legg til i spilleliste…",
    copyLink: "Kopier lenke",
    downloadScript: "Last ned script",
    downloadBlocked: "Kan ikke lastes ned",
    downloadBlockedCaption: "Dette er et premium-script",
    watchOn: "Se på {site}",
    watchOnSite: "Se på nettstedet"
  },

  toast: {
    linkCopied: "Lenken er kopiert",
    linkCopyFailed: "Klarte ikke å kopiere lenken",
    scriptDownloaded: "Script lastet ned",
    scriptFailedTitle: "Klarte ikke å hente script",
    scriptFailedBody:
      "Enten er connection key feil, eller så er ikke din Handy på nett. Sjekk begge deler og prøv igjen."
  },

  keyDialog: {
    // The device name, `connection key` and `script` stay English and
    // uninflected: the Norwegian possessive goes in front ("din Handy"),
    // never a definite suffix on the term itself. The English source says
    // "Scripts are bound", so the English plural `scripts` carries over.
    body: "Scripts er bundet til din Handy. Skriv inn connection key fra Handy-appen for å fortsette."
  }
};

export default media;
