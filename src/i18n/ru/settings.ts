import type enUS from "../en-US/settings";

// The settings modal and the three dialogs that hang off it: clear-data, the
// first-visit consent gate, and the connection-key prompt. The language
// picker inside settings is `common.language.*`, because the same wording is
// used wherever a locale is offered.
const settings: typeof enUS = {
  title: "Настройки",

  // the toggle list at the top of the modal
  display: {
    darkModeLabel: "Тёмная тема",
    darkModeCaption: "Использовать тёмное оформление",
    nsfwLabel: "Откровенные превью",
    nsfwCaption: "Показывать настоящие обложки вместо нейтральных плиток",
    playersLabel: "Встроенные плееры",
    playersCaption:
      "Воспроизводить видео Pornhub и xHamster прямо на странице видео",
    fullWidthLabel: "Во всю ширину",
    fullWidthCaption: "Использовать весь экран вместо колонки по центру",
    backgroundLabel: "Анимированный фон",
    backgroundCaption:
      "Показывать мягкий движущийся градиент позади каждой страницы"
  },

  // The muted-tags row. `caption` pluralizes over the count itself rather
  // than taking a pre-counted noun phrase: Bokmål inflects the adjective with
  // the noun ("1 dempet tagg" / "2 dempede tagger"), which a `{tags}` slot
  // cannot express
  // ("3 tags") rather than a bare number, so the pluralization stays in
  // `common.count.tags` and this message only carries the verb.
  muted: {
    label: "Заглушённые теги",
    caption:
      "{count} тег заглушён | {count} тега заглушено | {count} тегов заглушено",
    empty: "Ничего не заглушено"
  },

  orientationTitle: "Ориентация",

  access: {
    title: "Доступ",
    premiumScriptsLabel: "Платные скрипты",
    premiumScriptsCaption:
      "Включать видео, скрипт которых доступен у партнёра только платно",
    premiumVideosLabel: "Платные видео",
    premiumVideosCaption: "Включать видео, доступные у партнёра только платно"
  },

  previews: {
    title: "Превью на карточках",
    hint:
      "Наведите курсор на карточку — или проведите по ней пальцем, — чтобы " +
      "увидеть превью. Нажмите на подпись, чтобы вернуть исходную скорость.",
    imageSpeed: "Скорость изображения",
    clipSpeed: "Скорость клипа"
  },

  // shared by the settings field and the connection-key prompt
  connectionKey: {
    label: "Ключ подключения",
    placeholder: "например, a1B2c3D4e5",
    hint: "Ключ подключения вашего Handy — нужен для скачивания скриптов."
  },

  clearDataAction: "Очистить данные…",

  // ClearDataDialog. Every row names its own toast instead of sharing one
  // "{thing} cleared" template: the verb already differs per row in English
  // (a key is deleted, preferences are reset), and more so in Norwegian.
  clear: {
    title: "Очистить сохранённые данные",
    lead:
      "Всё, что сайт помнит, хранится в этом браузере. Удаляйте по частям " +
      "или сотрите всё сразу.",
    clearAll: "Очистить все данные",
    allToast: "Все локальные данные удалены",

    recentLabel: "История просмотров",
    recentToast: "История просмотров очищена",
    favoritesLabel: "Избранное",
    favoritesToast: "Избранное очищено",
    playlistsLabel: "Плейлисты",
    playlistsToast: "Плейлисты удалены",
    mutedToast: "Список заглушённых тегов очищен",

    // the two halves of the ratings row's caption, printed side by side
    votesLabel: "Оценки и голоса",
    votesEmpty: "Ничего не записано",
    votesToast: "Оценки и голоса удалены",
    ratingCount:
      "{count} оценка скрипта | {count} оценки скриптов | {count} оценок скриптов",
    requestVoteCount:
      "{count} голос за запрос | {count} голоса за запросы | {count} голосов за запросы",

    keySaved: "Сохранён на этом устройстве",
    keyUnset: "Не задан",
    keyToast: "Ключ подключения удалён",

    preferencesLabel: "Настройки просмотра",
    preferencesCaption:
      "Откровенные превью, ориентация, фильтры доступа, скорость превью, " +
      "фон",
    preferencesToast: "Настройки просмотра сброшены"
  },

  // ConsentDialog — the first-visit age gate. Legally load-bearing: every
  // condition the English states has to survive into every translation.
  consent: {
    title: "Прежде чем начать",
    body:
      "IVDB — каталог интерактивного видео для взрослых со скриптами для " +
      "Handy. Подтвердите, что вам есть 18 лет, чтобы смотреть каталог с " +
      "откровенными превью. Если продолжить без подтверждения, превью " +
      "останутся скрытыми — изменить это можно в любой момент в настройках. " +
      "Ваши настройки хранятся только в этом браузере.",
    decline: "Продолжить без превью",
    accept: "Мне есть 18 лет"
  },

  // ConnectionKeyDialog — shown when an action needs a key that isn't set
  keyPrompt: {
    title: "Нужен ключ подключения",
    body:
      "Это действие привязано к вашему Handy. Введите ключ подключения из " +
      "приложения Handy, чтобы продолжить.",
    hint:
      "Чтобы ключ сработал, Handy должен быть включён и в сети — устройство " +
      "не в сети даёт ровно ту же ошибку, что и неверный ключ.",
    save: "Сохранить и продолжить"
  }
};

export default settings;
