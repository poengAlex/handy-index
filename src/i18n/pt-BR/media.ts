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
    open: "Abrir",
    openNewTab: "Abrir em nova aba",
    addFavorite: "Adicionar aos favoritos",
    removeFavorite: "Remover dos favoritos",
    addToPlaylist: "Adicionar a uma playlist…",
    copyLink: "Copiar link",
    downloadScript: "Baixar script",
    downloadBlocked: "Download indisponível",
    downloadBlockedCaption: "Este script é premium",
    // {site} is the partner's own name; the second form covers the entries
    // that arrive without one, and has to read as a whole sentence
    watchOn: "Assistir no {site}",
    watchOnSite: "Assistir no site"
  },

  toast: {
    linkCopied: "Link copiado",
    linkCopyFailed: "Não foi possível copiar o link",
    scriptDownloaded: "Script baixado",
    scriptFailedTitle: "Não foi possível baixar o script",
    scriptFailedBody:
      "Ou a chave de conexão está errada, ou o seu Handy não está online. Verifique os dois e tente de novo."
  },

  keyDialog: {
    // replaces ConnectionKeyDialog's generic blurb when the key is needed for
    // a script download
    body: "Os scripts estão vinculados ao seu Handy. Digite a chave de conexão do app do Handy para continuar."
  }
};

export default media;
