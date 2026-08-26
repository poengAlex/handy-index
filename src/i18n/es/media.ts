import type enUS from "../en-US/media";

// The shared media primitives — the catalog tile every listing renders, its
// right-click quick menu, and the toasts that menu raises. The tile's own
// text (title, partner name) is catalog data and is never translated; what
// lives here is the chrome around it.
const media: typeof enUS = {
  card: {
    // accessible name for an entry the index published without a title
    fallbackTitle: "Vídeo",
    // the star rating printed beside the tile caption — "★ 92%"
    rating: "★ {rating}%"
  },

  menu: {
    moreActions: "Más acciones",
    open: "Abrir",
    openNewTab: "Abrir en una pestaña nueva",
    addFavorite: "Añadir a favoritos",
    removeFavorite: "Quitar de favoritos",
    addToPlaylist: "Añadir a una lista…",
    copyLink: "Copiar enlace",
    downloadScript: "Descargar script",
    downloadBlocked: "Descarga no disponible",
    downloadBlockedCaption: "Este script es premium",
    // {site} is the partner's own name; the second form covers the entries
    // that arrive without one, and has to read as a whole sentence
    watchOn: "Ver en {site}",
    watchOnSite: "Ver en el sitio"
  },

  toast: {
    linkCopied: "Enlace copiado",
    linkCopyFailed: "No se ha podido copiar el enlace",
    scriptDownloaded: "Script descargado",
    scriptFailedTitle: "No se ha podido descargar el script",
    scriptFailedBody:
      "O la connection key es incorrecta o tu Handy no está en línea. Revisa las dos cosas y vuelve a intentarlo."
  },

  keyDialog: {
    // replaces ConnectionKeyDialog's generic blurb when the key is needed for
    // a script download
    body: "Los scripts están vinculados a tu Handy. Escribe la connection key de la app de Handy para continuar."
  }
};

export default media;
