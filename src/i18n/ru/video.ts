import type enUS from "../en-US/video";

// The video detail page — the biggest single surface in the app: the hero and
// its chips, the action row, the opt-in partner player, the tag strip, the
// details card, the star rating, the stills gallery and its full-size viewer,
// script comments, the "more like this" shelves, and a toast for every
// outcome each of those can produce.
const video: typeof enUS = {
  missingTitle: "Видео не найдено",
  missingBody: "Этого видео больше нет в индексе, либо ссылка неверна.",

  // Stand-ins for catalog fields the index published empty. They are read
  // out loud (alt text, an iframe title) or land mid-sentence, so each one
  // has to work in the slot it fills — "Watch on the site" (the same reading
  // media.ts gives an unnamed partner), "Still 3 from Video".
  fallback: {
    video: "Видео",
    player: "Видеоплеер",
    site: "сайте",
    thisSite: "этого сайта"
  },

  hero: {
    premiumChip: "Платный скрипт"
  },

  action: {
    getScript: "Скачать скрипт",
    // {site} is the partner's own name, or `fallback.site` when it has none
    watchOn: "Смотреть на {site}",
    addFavorite: "Добавить в избранное",
    removeFavorite: "Убрать из избранного",
    addToPlaylist: "Добавить в плейлист",
    report: "Пожаловаться на видео"
  },

  premiumNote:
    "Скрипт для этого видео платный — он идёт вместе с видео на сайте партнёра.",

  playerNote:
    "Handy не синхронизируется с воспроизведением здесь, на IVDB, — этот плеер только показывает видео. Скачайте скрипт и запустите его в своём плеере для Handy, чтобы движения совпадали с картинкой.",

  tag: {
    unmuteAria: "Вернуть тег: {tag}",
    mutedTitle: "Тег «{tag}» заглушён — нажмите, чтобы вернуть",
    browse: "Видео с этим тегом",
    mute: "Заглушить этот тег"
  },

  details: {
    title: "Подробности",
    script: "Скрипт",
    free: "Бесплатный",
    premium: "Платный",
    published: "Опубликовано",
    duration: "Длительность",
    format: "Формат",
    // the non-VR case: an ordinary 2D video
    formatFlat: "2D",
    site: "Сайт",
    scriptBy: "Автор скрипта",
    rating: "Рейтинг",
    ratingValue: "{percent}%",
    // {votes} arrives already pluralized from useFormat().count("votes", n)
    ratingWithVotes: "{percent}% · {votes}",
    scriptPlays: "Запуски скрипта"
  },

  rate: {
    title: "Оцените скрипт",
    community: "Сообщество: {percent}%",
    thanks: "Спасибо за оценку",
    errorTitle: "Не удалось сохранить оценку"
  },

  gallery: {
    // the strip is headed "Photos" unless the only thing in it is the
    // partner's roll clip
    photosTitle: "Фото",
    previewTitle: "Превью",
    previewBadge: "Превью",
    clipAria: "Воспроизвести превью на весь экран",
    photoAria: "Открыть фото {index} из {total}",
    stillAlt: "Кадр {number} из «{title}»",
    previousPhoto: "Предыдущее фото",
    nextPhoto: "Следующее фото",
    closeViewer: "Закрыть просмотр",
    // position counter under the full-size viewer — "3 / 12"
    viewerCount: "{index} / {total}"
  },

  comments: {
    title: "Комментарии",
    gateHint: "Для комментариев нужен ключ подключения.",
    gateAction: "Добавить ключ",
    inputLabel: "Добавить комментарий",
    submit: "Отправить",
    errorHint: "Не удалось загрузить комментарии.",
    emptyHint: "Комментариев пока нет — будьте первым.",
    postedTitle: "Комментарий отправлен",
    postedBody: "Он появится после проверки.",
    postErrorTitle: "Не удалось отправить комментарий"
  },

  more: {
    related: "Похожие видео",
    fromPartner: "Ещё с {site}"
  },

  // Replaces ConnectionKeyDialog's generic blurb — the reason the key is
  // being asked for differs per action.
  keyPrompt: {
    script:
      "Скрипты привязаны к вашему Handy. Введите ключ подключения из приложения Handy, чтобы продолжить.",
    action:
      "Оценки и комментарии привязаны к вашему Handy. Введите ключ подключения из приложения Handy, чтобы продолжить."
  },

  script: {
    readyTitle: "Скрипт готов",
    readyBody: "Загрузка открылась в новой вкладке.",
    errorTitle: "Не удалось скачать скрипт",
    errorBody:
      "Либо неверный ключ подключения, либо Handy не в сети. Проверьте и то и другое, затем попробуйте снова."
  },

  mute: {
    refusedTitle: "Тег «{tag}» нельзя заглушить",
    refusedBody:
      "Теги ориентации определяют, какой каталог вы видите, — измените это в настройках.",
    doneTitle: "Тег «{tag}» заглушён",
    doneBody: "Он в списке заглушённых — вернуть можно в любой момент.",
    undoneTitle: "Тег «{tag}» возвращён"
  },

  share: {
    copiedTitle: "Ссылка скопирована",
    errorTitle: "Не удалось скопировать ссылку"
  },

  // The report button opens a pre-filled mail draft. The reader is the one
  // who finishes and sends it, so the draft is written in their language;
  // the identifying lines keep it useful once it reaches the inbox.
  report: {
    subject: "Жалоба на видео",
    intro: "Хочу пожаловаться на видео.",
    titleLine: "Название: {title}",
    untitled: "(без названия)",
    idLine: "ID видео: {id}",
    siteLine: "Сайт: {site}",
    linkLine: "Ссылка: {link}",
    reasonLine: "Причина жалобы:"
  }
};

export default video;
