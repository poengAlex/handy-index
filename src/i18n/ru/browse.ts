import type enUS from "../en-US/browse";

// The browse + search page (/videos): the toolbar above the grid, the
// active-filter chips, the advanced-filters modal, and one empty state per
// reason the grid can come back empty (a muted tag, the orientation gate,
// or plain over-filtering).
const browse: typeof enUS = {
  title: "Видео",

  toolbar: {
    searchPlaceholder: "Поиск по названию",
    searchAria: "Поиск видео по названию",
    sortAria: "Сортировка видео",
    // The flip button names the direction the list is *in*, then what a
    // click would do — four flat keys rather than a sentence assembled from
    // a direction word, which would strand the translator.
    dirDescAria: "Сортировка по убыванию — обратить порядок",
    dirAscAria: "Сортировка по возрастанию — обратить порядок",
    dirDescTitle: "Сортировка по убыванию — нажмите, чтобы обратить порядок",
    dirAscTitle: "Сортировка по возрастанию — нажмите, чтобы обратить порядок",
    filters: "Фильтры",
    filtersCount: "Фильтры ({count})",
    shareAria: "Поделиться результатами — в ссылке сохранятся все фильтры"
  },

  // The sort dropdown. Keyed by SortKey so the option list can stay a
  // module constant holding keys instead of English.
  sort: {
    recent: "Сначала новые",
    updated: "Сначала обновлённые",
    top: "По рейтингу",
    plays: "По запускам",
    views: "По просмотрам",
    longest: "По длительности",
    title: "По алфавиту"
  },

  chip: {
    // {label} is catalog data — a tag, a site name, a performer name
    removeAria: "Убрать фильтр: {label}",
    // stand-ins for a filtered id whose name isn't in the loaded catalog
    partnerFallback: "Партнёр",
    performerFallback: "Актёр"
  },

  filters: {
    title: "Фильтры",
    addTag: "Добавить тег",
    noTags: "Теги не найдены",
    site: "Сайт",
    noSites: "Сайты не найдены",
    // one row of either picker: the tag or site name, then how many videos
    // picking it would leave on screen
    option: "{name} ({count})",
    vrLabel: "Только VR",
    vrCaption: "Только видео в виртуальной реальности",
    orientation: "Ориентация",
    access: "Доступ",
    premiumScriptsLabel: "Платные скрипты",
    premiumScriptsCaption:
      "Включать скрипты, доступные у партнёра только платно",
    premiumVideosLabel: "Платные видео",
    premiumVideosCaption: "Включать видео, доступные у партнёра только платно",
    mutedLabel: "Заглушённые теги",
    mutedNone: "Ничего не заглушено",
    // {tags} is a comma-joined list of the first few muted tags
    mutedMore: "{tags} и ещё {rest}",
    duration: "Длительность",
    durationAny: "Любая",
    durationFrom: "от {min} мин",
    durationRange: "{min}–{max} мин"
  },

  empty: {
    // A muted tag arriving via ?tag= empties the grid and no filter change
    // can fix it, so the one-tag case names the tag it is talking about.
    mutedOneTitle: "Тег «{tag}» заглушён",
    mutedOneBody:
      "Видео с этим тегом скрыты везде. Верните тег, чтобы увидеть эти результаты.",
    mutedOneAction: "Вернуть тег «{tag}»",
    mutedManyTitle: "Часть этих тегов заглушена",
    mutedManyBody:
      "Видео с этими тегами скрыты везде. Верните их, чтобы увидеть эти результаты.",
    mutedManyAction: "Вернуть их",
    // {orientation} comes from common.orientation.* via useFormat()
    orientationTitle: "В разделе «{orientation}» ничего нет",
    // one sentence, not a count phrase glued to a clause: the verb agrees
    // with the count in English and the word order differs in Norwegian
    orientationBody:
      "{count} видео подходит по всем остальным вашим фильтрам, но не по фильтру «{orientation}». | {count} видео подходят по всем остальным вашим фильтрам, но не по фильтру «{orientation}». | {count} видео подходят по всем остальным вашим фильтрам, но не по фильтру «{orientation}».",
    orientationAction: "Показать все ориентации",
    noneTitle: "Видео не найдены",
    noneBody:
      "Фильтры отсеяли все видео. Упростите запрос или снимите часть фильтров.",
    noneAction: "Сбросить все фильтры"
  },

  share: {
    // {count} arrives already localized and pluralized as "12 videos"
    // (useFormat().count), so this message only decides where it sits
    title: "IVDB — {count}",
    fallbackTitle: "Видео на IVDB",
    copiedTitle: "Ссылка скопирована",
    copiedBody: "В ней сохранены все ваши фильтры.",
    failedTitle: "Не удалось скопировать ссылку"
  }
};

export default browse;
