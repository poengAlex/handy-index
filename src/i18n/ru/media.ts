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
    downloadScript: "Скачать скрипт",
    downloadBlocked: "Скачивание недоступно",
    downloadBlockedCaption: "Это платный скрипт",
    // {site} is the partner's own name; the second form covers the entries
    // that arrive without one, and has to read as a whole sentence
    watchOn: "Смотреть на {site}",
    watchOnSite: "Смотреть на сайте"
  },

  toast: {
    linkCopied: "Ссылка скопирована",
    linkCopyFailed: "Не удалось скопировать ссылку",
    scriptDownloaded: "Скрипт скачан",
    scriptFailedTitle: "Не удалось скачать скрипт",
    scriptFailedBody:
      "Либо неверный ключ подключения, либо Handy не в сети. Проверьте и то и другое, затем попробуйте снова."
  },

  keyDialog: {
    // replaces ConnectionKeyDialog's generic blurb when the key is needed for
    // a script download
    body: "Скрипты привязаны к вашему Handy. Введите ключ подключения из приложения Handy, чтобы продолжить."
  }
};

export default media;
