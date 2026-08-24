import type enUS from "../en-US/common";

// Vocabulary shared by more than one surface. Same admission rule as the
// component menu in ARCHITECTURE.md: a string is promoted here on its
// *second* consumer — a phrase used once belongs in its feature namespace,
// where a translator can see the context it is used in.
//
// Plural messages carry a `{count}` named param instead of vue-i18n's bare
// `{n}`, because the count has to be run through `$n()` first so 15000 reads
// "15,000" in English and "15 000" in Norwegian. Call them as
// `$t("common.count.videos", { count: $n(x) }, x)`.
const common: typeof enUS = {
  action: {
    backToHome: "На главную",
    browseVideos: "Смотреть каталог",
    cancel: "Отмена",
    clear: "Очистить",
    clearFilters: "Сбросить фильтры",
    clearSearch: "Очистить поиск",
    create: "Создать",
    delete: "Удалить",
    done: "Готово",
    import: "Импорт",
    manage: "Управление",
    rename: "Переименовать",
    retry: "Повторить",
    save: "Сохранить",
    share: "Поделиться"
  },

  state: {
    catalogErrorTitle: "Не удалось загрузить каталог",
    catalogErrorBody:
      "Индекс script не ответил. Проверь соединение и попробуй снова.",
    emptyTitle: "Показывать нечего"
  },

  // "12 of 340" — the shown/total pair every filtered listing prints. Both
  // sides arrive pre-formatted through `$n()`.
  ofTotal: {
    videos:
      "{shown} из {total} видео | {shown} из {total} видео | {shown} из {total} видео",
    performers:
      "{shown} из {total} актёра | {shown} из {total} актёров | {shown} из {total} актёров",
    tags: "{shown} из {total} тега | {shown} из {total} тегов | {shown} из {total} тегов"
  },

  count: {
    performers: "{count} актёр | {count} актёра | {count} актёров",
    playlists: "{count} плейлист | {count} плейлиста | {count} плейлистов",
    requests: "{count} запрос | {count} запроса | {count} запросов",
    sites: "{count} сайт | {count} сайта | {count} сайтов",
    tags: "{count} тег | {count} тега | {count} тегов",
    videos: "{count} видео | {count} видео | {count} видео",
    votes: "{count} голос | {count} голоса | {count} голосов"
  },

  // Duration is assembled from parts rather than formatted in the service:
  // Norwegian abbreviates hours "t", not "h", and only the message layer
  // knows that. `durationParts()` in services/format.ts picks which key.
  duration: {
    hoursMinutes: "{hours} ч {minutes} мин",
    hours: "{hours} ч",
    minutes: "{minutes} мин",
    seconds: "{seconds} с"
  },

  justNow: "только что",

  // Shared by the settings radio group, the browse filters and the header
  // switcher — the same "can't drift apart" reason ORIENTATION_LABELS gave
  // for living in queries.ts, which is where these strings came from.
  orientation: {
    straight: "Straight",
    gay: "Gay",
    trans: "Trans",
    all: "Everything"
  },

  language: {
    label: "Язык",
    caption: "Выбери язык, на котором показывать сайт",
    system: "Как в браузере"
  }
};

export default common;
