import type enUS from "../en-US/media";

const media: typeof enUS = {
  card: {
    fallbackTitle: "Video",
    // Norwegian sets a space before the percent sign
    rating: "★ {rating} %"
  },

  menu: {
    open: "Åpne",
    openNewTab: "Åpne i ny fane",
    addFavorite: "Legg til i favoritter",
    removeFavorite: "Fjern fra favoritter",
    addToPlaylist: "Legg til i spilleliste…",
    copyLink: "Kopier lenke",
    downloadScript: "Last ned skript",
    downloadBlocked: "Kan ikke lastes ned",
    downloadBlockedCaption: "Dette er et premium-skript",
    watchOn: "Se på {site}",
    watchOnSite: "Se på nettstedet"
  },

  toast: {
    linkCopied: "Lenken er kopiert",
    linkCopyFailed: "Klarte ikke å kopiere lenken",
    scriptDownloaded: "Skriptet er lastet ned",
    scriptFailedTitle: "Klarte ikke å hente skriptet",
    scriptFailedBody:
      "Enten er tilkoblingsnøkkelen feil, eller så er ikke Handy-en din på nett. Sjekk begge deler og prøv igjen."
  },

  keyDialog: {
    // "Handy-en" med bindestrek, samme som services.ts og video.ts: den
    // bestemte endelsen henges på et engelsk merkenavn
    body: "Skript er bundet til Handy-en din. Skriv inn tilkoblingsnøkkelen fra Handy-appen for å fortsette."
  }
};

export default media;
