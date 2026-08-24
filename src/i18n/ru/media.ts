import type enUS from "../en-US/media";

// The shared media primitives — the catalog tile every listing renders, its
// right-click quick menu, and the toasts that menu raises. The tile's own
// text (title, partner name) is catalog data and is never translated; what
// lives here is the chrome around it.
const media: typeof enUS = {
  card: {
    // accessible name for an entry the index published without a title
    fallbackTitle: "Видео",
    // the star rating printed beside the tile caption — "★ 92%"
    rating: "★ {rating}%"
  },

  menu: {
    open: "Открыть",
    openNewTab: "Открыть в новой вкладке",
    addFavorite: "Добавить в избранное",
    removeFavorite: "Убрать из избранного",
    addToPlaylist: "Добавить в плейлист…",
    copyLink: "Копировать ссылку",
    downloadScript: "Скачать script",
    downloadBlocked: "Скачивание недоступно",
    downloadBlockedCaption: "Это платный script",
    // {site} is the partner's own name; the second form covers the entries
    // that arrive without one, and has to read as a whole sentence
    watchOn: "Смотреть на {site}",
    watchOnSite: "Смотреть на сайте"
  },

  toast: {
    linkCopied: "Ссылка скопирована",
    linkCopyFailed: "Не удалось скопировать ссылку",
    scriptDownloaded: "Script скачан",
    scriptFailedTitle: "Не удалось скачать script",
    scriptFailedBody:
      "Либо connection key неверный, либо Handy не в сети. Проверь и то и другое, затем попробуй снова."
  },

  keyDialog: {
    // replaces ConnectionKeyDialog's generic blurb when the key is needed for
    // a script download
    body: "Scripts привязаны к твоему Handy. Введи connection key из приложения Handy, чтобы продолжить."
  }
};

export default media;
