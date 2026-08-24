import type enUS from "../en-US/media";

// The shared media primitives — the catalog tile every listing renders, its
// right-click quick menu, and the toasts that menu raises. The tile's own
// text (title, partner name) is catalog data and is never translated; what
// lives here is the chrome around it.
const media: typeof enUS = {
  card: {
    // accessible name for an entry the index published without a title
    fallbackTitle: "Vidéo",
    // the star rating printed beside the tile caption — "★ 92%"
    rating: "★ {rating} %"
  },

  menu: {
    open: "Ouvrir",
    openNewTab: "Ouvrir dans un nouvel onglet",
    addFavorite: "Ajouter aux favoris",
    removeFavorite: "Retirer des favoris",
    addToPlaylist: "Ajouter à une playlist…",
    copyLink: "Copier le lien",
    downloadScript: "Télécharger le script",
    downloadBlocked: "Téléchargement impossible",
    downloadBlockedCaption: "C'est un script premium",
    // {site} is the partner's own name; the second form covers the entries
    // that arrive without one, and has to read as a whole sentence
    watchOn: "Regarder sur {site}",
    watchOnSite: "Regarder sur le site"
  },

  toast: {
    linkCopied: "Lien copié",
    linkCopyFailed: "Impossible de copier le lien",
    scriptDownloaded: "Script téléchargé",
    scriptFailedTitle: "Impossible d'obtenir le script",
    scriptFailedBody:
      "Soit la clé de connexion est incorrecte, soit votre Handy n'est pas en ligne. Vérifiez les deux, puis réessayez."
  },

  keyDialog: {
    // replaces ConnectionKeyDialog's generic blurb when the key is needed for
    // a script download
    body: "Les scripts sont liés à votre Handy. Saisissez la clé de connexion de l'application Handy pour continuer."
  }
};

export default media;
