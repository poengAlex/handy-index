import type enUS from "../en-US/performers";

// The performer directory (/performers): a grid of avatar cards with a name
// search, a sort control and endless scroll. Same page shape as `sites` — a
// header count line, a search box and two empty states — so the key names are
// kept parallel with that namespace on purpose.
const performers: typeof enUS = {
  title: "Актёры",

  search: {
    placeholder: "Поиск актёров",
    aria: "Поиск актёров по имени"
  },

  sort: {
    aria: "Сортировка актёров",
    count: "Больше всего видео",
    rating: "Лучший рейтинг",
    // an alphabet range, so it changes with the language
    name: "По алфавиту",
    // Four whole messages rather than one with a {direction} param: the
    // button says what the order *is* and what clicking does, and neither
    // language builds that sentence from the same pieces.
    descAria: "Сортировка по убыванию — обратить порядок",
    ascAria: "Сортировка по возрастанию — обратить порядок",
    descTitle: "Сортировка по убыванию — нажмите, чтобы обратить порядок",
    ascTitle: "Сортировка по возрастанию — нажмите, чтобы обратить порядок"
  },

  // the star chip on a card; Norwegian puts a space before the percent sign
  ratingBadge: "★ {rating}%",

  errorTitle: "Не удалось загрузить актёров",
  hiddenBody:
    "Фильтр платного контента и заглушённые теги скрывают всех актёров. Ослабьте их в настройках.",
  noMatchTitle: "Актёры не найдены",
  noMatchBody:
    "В индексе нет совпадений с «{query}». Попробуйте более короткое имя."
};

export default performers;
