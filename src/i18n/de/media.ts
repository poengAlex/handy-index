import type enUS from "../en-US/media";

// The shared media primitives — the catalog tile every listing renders, its
// right-click quick menu, and the toasts that menu raises. The tile's own
// text (title, partner name) is catalog data and is never translated; what
// lives here is the chrome around it.
const media: typeof enUS = {
  card: {
    // accessible name for an entry the index published without a title
    fallbackTitle: "Video",
    // the star rating printed beside the tile caption — "★ 92%"
    // German sets a space before the percent sign; it is a non-breaking one
    // (U+00A0) so the chip never wraps between the number and the sign
    rating: "★ {rating} %"
  },

  menu: {
    moreActions: "Weitere Aktionen",
    open: "Öffnen",
    openNewTab: "In neuem Tab öffnen",
    addFavorite: "Zu Favoriten hinzufügen",
    removeFavorite: "Aus Favoriten entfernen",
    addToPlaylist: "Zur Wiedergabeliste hinzufügen…",
    copyLink: "Link kopieren",
    downloadScript: "Script herunterladen",
    downloadBlocked: "Download nicht möglich",
    downloadBlockedCaption: "Das ist ein Premium-Script",
    // {site} is the partner's own name; the second form covers the entries
    // that arrive without one, and has to read as a whole sentence
    watchOn: "Auf {site} ansehen",
    watchOnSite: "Auf der Website ansehen"
  },

  toast: {
    linkCopied: "Link kopiert",
    linkCopyFailed: "Link konnte nicht kopiert werden",
    scriptDownloaded: "Script heruntergeladen",
    scriptFailedTitle: "Script konnte nicht abgerufen werden",
    scriptFailedBody:
      "Entweder ist der connection key falsch, oder The Handy ist nicht online. Prüfe beides und versuche es erneut."
  },

  keyDialog: {
    // replaces ConnectionKeyDialog's generic blurb when the key is needed for
    // a script download
    body: "Scripts sind an The Handy gebunden. Gib den connection key aus der Handy-App ein, um fortzufahren."
  }
};

export default media;
