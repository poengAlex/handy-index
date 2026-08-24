import type enUS from "../en-US/home";

// The front page: the featured hero at the top, the config-driven carousel
// shelves under it, and the confirm dialog behind the recently-viewed
// shelf's clear icon. Shelf titles are row headers in a tight horizontal
// strip — keep them short.
const home: typeof enUS = {
  hero: {
    kicker: "Рекомендуем",
    /** alt text when the featured video has no title of its own */
    alt: "Рекомендуемое видео",
    cta: "Смотреть видео",
    emptyTitle: "Нечего рекомендовать"
  },

  // One sentence, two places: under the empty hero and under the empty shelf
  // list. Both are the same "you filtered the catalog away" state.
  filteredOutBody:
    "Ваши фильтры и заглушённые теги скрывают весь каталог. Ослабьте их в настройках.",

  rows: {
    recent: "Новинки",
    favorites: "Моё избранное",
    recentlyViewed: "История просмотров",
    /** help-icon tooltip on the recently-viewed shelf */
    recentlyViewedHint:
      "Хранится только в этом браузере — история просмотров нигде не отслеживается и никуда не отправляется.",
    /** delete-icon tooltip on the same shelf */
    recentlyViewedClear: "Очистить историю просмотров",
    /** {tag} is a catalog tag and stays untranslated */
    becauseYouLike: "Раз вам нравится «{tag}»",
    topRated: "Высокий рейтинг",
    mostPlayed: "Чаще всего запускают",
    updated: "Недавно обновлённые"
  },

  clearHistory: {
    title: "Очистить историю просмотров?",
    body: "Видео останутся в каталоге — исчезнет только список того, что вы открывали в этом браузере.",
    confirm: "Очистить историю",
    done: "История просмотров очищена"
  }
};

export default home;
