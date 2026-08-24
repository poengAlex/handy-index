import type enUS from "../en-US/tags";

// The tag cloud at /tags: every tag in the visible catalog as a clickable
// pill, searchable and sortable, plus the long index-download wait it sits
// behind and the right-click menu that mutes a tag.
const tags: typeof enUS = {
  title: "Теги",
  errorTitle: "Не удалось загрузить теги",

  // The cloud can't draw a pill until the whole ~40 MB index is in, so the
  // wait gets a phase, a percentage and a reason it's worth it.
  loading: {
    barLabel: "Загрузка тегов",
    // Norwegian puts a space before the percent sign, so this is a message
    // rather than a bare "%" glued on in the template
    percent: "{percent}%",
    downloading: "Загружаем индекс script",
    parsing: "Читаем индекс",
    noteParsing: "Всё получено — раскладываем по тегам.",
    note: "Распаковано {received} из ~{total} МБ — весь каталог скачивается один раз, дальше каждая страница открывается мгновенно.",
    // the expected total is only last visit's size, so an index that grew
    // since gets a line that doesn't print "44 of ~41 MB"
    noteOversize:
      "Распаковано {received} МБ — весь каталог скачивается один раз."
  },

  controls: {
    searchPlaceholder: "Поиск тегов",
    searchLabel: "Поиск тегов",
    sortLabel: "Сортировка тегов",
    sortByCount: "Больше всего видео",
    // the alphabet's first and last letter — Norwegian ends at Å
    sortByName: "По алфавиту",
    sortedDescLabel: "Сортировка по убыванию — обратить порядок",
    sortedAscLabel: "Сортировка по возрастанию — обратить порядок",
    sortedDescTitle: "Сортировка по убыванию — нажми, чтобы обратить порядок",
    sortedAscTitle:
      "Сортировка по возрастанию — нажми, чтобы обратить порядок",
    muted: "Заглушённые",
    mutedCount: "Заглушённые ({count})"
  },

  empty: {
    searchTitle: "Теги не найдены",
    searchBody: "В индексе нет совпадений с «{query}».",
    filteredBody:
      "Твои фильтры и заглушённые теги скрывают все теги в индексе. Ослабь их в настройках.",
    filteredAction: "Заглушённые теги"
  },

  menu: {
    browse: "Видео с этим тегом",
    mute: "Заглушить этот тег"
  },

  toast: {
    refusedTitle: "Тег «{tag}» нельзя заглушить",
    refusedBody:
      "Теги ориентации определяют, какой каталог ты видишь, — измени это в настройках.",
    mutedTitle: "Тег «{tag}» заглушён",
    mutedBody: "Он в списке заглушённых — вернуть можно в любой момент."
  }
};

export default tags;
