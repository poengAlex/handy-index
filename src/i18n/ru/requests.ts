import type enUS from "../en-US/requests";

// The community side of the catalog: one voting board that is also the
// queue — submit a video URL, upvote what should get scripted next, and read
// each tile's rank as its place in the scripting order. The board is gated on
// the Handy connection key, which is what `key.*` covers.
const requests: typeof enUS = {
  // Connection-key gate and the two failure states behind it.
  key: {
    title: "Нужен connection key",
    boardBody:
      "Доска запросов привязана к твоему Handy. Добавь connection key из приложения Handy, чтобы смотреть запросы, отправлять свои и голосовать.",
    addAction: "Добавить connection key",
    rejectedTitle: "Твой connection key отклонён",
    rejectedBody:
      "Либо ключ неверный, либо Handy не в сети. Проверь ключ в приложении Handy, убедись, что устройство включено и подключено, и введи ключ снова.",
    rejectedAction: "Ввести ключ снова",
    boardDialog:
      "Доска запросов привязана к твоему Handy. Введи connection key из приложения Handy, чтобы продолжить."
  },

  // The voting board page. There are four count messages rather than one
  // stem the render bolts suffixes onto: "of {total}" only appears while
  // filters narrow the list, and the capped note only when the board is
  // longer than the single load we do. `{requests}` arrives already counted
  // and pluralized ("12 requests", from common.count.requests) — move it
  // wherever the sentence wants it.
  board: {
    title: "Запросы на scripts",
    lead: "Голосуй за то, для каких видео сделают scripts дальше — первым идёт запрос с наибольшим числом голосов.",
    emptyTitle: "Запросов нет",
    emptyBody:
      "Сейчас голосовать не за что. Отправь запрос на видео выше — и дело сдвинется.",
    errorTitle: "Не удалось загрузить запросы",
    noMatchBody:
      "На доске нет запросов под эти фильтры. Ослабь их, чтобы увидеть остальные.",
    countAll: "{requests} на голосовании",
    countAllCapped:
      "{requests} на голосовании (доска длиннее, чем мы загрузили)",
    countFiltered: "{requests} из {total}",
    countFilteredCapped:
      "{requests} из {total} (доска длиннее, чем мы загрузили)"
  },

  // The submit row on the board, plus the two toasts it can raise.
  submit: {
    title: "Запросить видео",
    hint: "Вставь ссылку на видео, для которого хочешь script. Перед выходом на голосование запрос проходит проверку.",
    urlLabel: "URL видео",
    action: "Отправить запрос",
    sentTitle: "Запрос отправлен",
    sentBody: "Перед выходом на голосование он проходит проверку.",
    failedTitle: "Запрос не отправлен",
    failedBody: "Индекс script не принял этот URL. Попробуй снова."
  },

  // The vote button and its toasts. `failedKeyBody` is the auth case: the key
  // was rotated or the device went offline mid-session.
  vote: {
    action: "Голосовать",
    voted: "Голос отдан",
    successTitle: "Голос учтён",
    successBody: "Запросы с наибольшим числом голосов получают script первыми.",
    failedTitle: "Голос не засчитан",
    failedKeyBody:
      "Либо ключ неверный, либо Handy не в сети — проверь и то и другое и введи ключ снова.",
    failedBody: "Индекс script не принял голос. Попробуй снова."
  },

  // One request tile.
  card: {
    untitled: "Запрос на видео",
    openAria: "Открыть: {name}",
    // the request's place in the scripting order, on a badge with room for
    // about four characters
    rank: "№{rank}"
  },

  // The control row above the list.
  filters: {
    searchPlaceholder: "Поиск запросов",
    searchAria: "Поиск запросов по названию",
    sortAria: "Сортировка запросов",
    tagLabel: "Тег",
    tagEmpty: "Теги не найдены",
    // one row of the tag picker: the tag, then how many requests carry it
    tagOption: "{tag} ({count})",
    removeTagAria: "Убрать фильтр: {tag}",
    performerLabel: "Актёр",
    performerEmpty: "Актёры не найдены",
    // one row of the performer picker: who they are, then how many
    // requests name them
    performerOption: "{name} ({count})",
    removePerformerAria: "Убрать фильтр: {name}",
    hideVoted: "Без моего голоса",
    hideVotedTitle: "Скрыть запросы с моим голосом",
    emptyTitle: "Запросы не найдены"
  },

  // Sort picker. Keys match RequestSortKey.
  sort: {
    votes: "По голосам",
    newest: "Сначала новые",
    longest: "По длительности",
    title: "По алфавиту"
  }
};

export default requests;
