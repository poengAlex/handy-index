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
    nsfwLabel: "Откровенный предпросмотр",
    nsfwCaption: "Показывать настоящие обложки вместо нейтральных плиток",
    playersLabel: "Встроенные плееры",
    playersCaption:
      "Воспроизводить видео Pornhub и xHamster прямо на странице видео",
    fullWidthLabel: "Во всю ширину",
    fullWidthCaption: "Использовать весь экран вместо колонки по центру"
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

  backgroundSceneTitle: "Стиль фона",
  backgroundSceneOff: "Выключено",
  backgroundMotionLabel: "Движение",
  backgroundMotionCaption:
    "Фон медленно движется и ненадолго ускоряется при смене страницы",
  orientationTitle: "Ориентация",

  access: {
    title: "Доступ",
    premiumScriptsLabel: "Платные scripts",
    premiumScriptsCaption:
      "Включать видео, script которых доступен у партнёра только платно",
    premiumVideosLabel: "Платные видео",
    premiumVideosCaption: "Включать видео, доступные у партнёра только платно"
  },

  previews: {
    title: "Предпросмотр на карточках",
    hint:
      "Наведи курсор на карточку — или проведи по ней пальцем, — чтобы " +
      "увидеть предпросмотр. Нажми на подпись, чтобы вернуть исходную скорость.",
    imageSpeed: "Скорость изображения",
    clipSpeed: "Скорость клипа"
  },

  // shared by the settings field and the connection-key prompt
  connectionKey: {
    label: "Connection key",
    placeholder: "например, a1B2c3D4e5",
    hint: "Твой connection key от Handy — нужен для скачивания scripts."
  },

  clearDataAction: "Очистить данные…",

  // ClearDataDialog. Every row names its own toast instead of sharing one
  // "{thing} cleared" template: the verb already differs per row in English
  // (a key is deleted, preferences are reset), and more so in Norwegian.
  clear: {
    title: "Очистить сохранённые данные",
    lead:
      "Всё, что сайт помнит, хранится в этом браузере. Удаляй по частям " +
      "или сотри всё сразу.",
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
      "{count} оценка script | {count} оценки scripts | {count} оценок scripts",
    requestVoteCount:
      "{count} голос за запрос | {count} голоса за запросы | {count} голосов за запросы",

    keySaved: "Сохранён на этом устройстве",
    keyUnset: "Не задан",
    keyToast: "Твой connection key удалён",

    preferencesLabel: "Настройки просмотра",
    preferencesCaption:
      "Откровенный предпросмотр, ориентация, фильтры доступа, скорость " +
      "предпросмотра, фон",
    preferencesToast: "Настройки просмотра сброшены"
  },

  // ConsentDialog — the first-visit age gate. Legally load-bearing: every
  // condition the English states has to survive into every translation.
  consent: {
    title: "Прежде чем начать",
    body:
      "IVDB — каталог интерактивного видео для взрослых со scripts для " +
      "Handy. Подтверди, что тебе есть 18 лет, чтобы смотреть каталог с " +
      "откровенным предпросмотром. Если продолжить без подтверждения, " +
      "предпросмотр останется скрытым — изменить это можно в любой " +
      "момент в настройках. Твои настройки хранятся только в этом " +
      "браузере.",
    decline: "Продолжить без предпросмотра",
    accept: "Мне есть 18 лет"
  },

  // ConnectionKeyDialog — shown when an action needs a key that isn't set
  keyPrompt: {
    title: "Нужен connection key",
    body:
      "Это действие привязано к твоему Handy. Введи connection key из " +
      "приложения Handy, чтобы продолжить.",
    hint:
      "Чтобы ключ сработал, Handy должен быть включён и в сети — устройство " +
      "не в сети даёт ровно ту же ошибку, что и неверный ключ.",
    save: "Сохранить и продолжить"
  }
};

export default settings;
