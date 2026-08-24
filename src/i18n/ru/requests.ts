import type enUS from "../en-US/requests";

// The community side of the catalog: the voting board (submit a video URL,
// upvote what should get scripted next) and the queue that shows the same
// requests in scripting order. Both are gated on the Handy connection key,
// which is why `key.*` carries a body per surface — the sentence names the
// thing you were trying to reach.
const requests: typeof enUS = {
  // Connection-key gate and the two failure states behind it. Shown by both
  // pages; only the body differs.
  key: {
    title: "Нужен ключ подключения",
    boardBody:
      "Доска запросов привязана к вашему Handy. Добавьте ключ подключения из приложения Handy, чтобы смотреть запросы, отправлять свои и голосовать.",
    queueBody:
      "Очередь привязана к вашему Handy. Добавьте ключ подключения из приложения Handy, чтобы её увидеть.",
    addAction: "Добавить ключ подключения",
    rejectedTitle: "Ключ подключения отклонён",
    rejectedBody:
      "Либо ключ неверный, либо Handy не в сети. Проверьте ключ в приложении Handy, убедитесь, что устройство включено и подключено, и введите ключ снова.",
    rejectedAction: "Ввести ключ снова",
    boardDialog:
      "Доска запросов привязана к вашему Handy. Введите ключ подключения из приложения Handy, чтобы продолжить.",
    queueDialog:
      "Очередь привязана к вашему Handy. Введите ключ подключения из приложения Handy, чтобы продолжить."
  },

  // The voting board page. There are four count messages rather than one
  // stem the render bolts suffixes onto: "of {total}" only appears while
  // filters narrow the list, and the capped note only when the board is
  // longer than the single load we do. `{requests}` arrives already counted
  // and pluralized ("12 requests", from common.count.requests) — move it
  // wherever the sentence wants it.
  board: {
    title: "Запросы на скрипты",
    lead: "Голосуйте за то, для каких видео сделают скрипты дальше — первым идёт запрос с наибольшим числом голосов.",
    queueLink: "Смотреть очередь",
    emptyTitle: "Запросов нет",
    emptyBody:
      "Сейчас голосовать не за что. Отправьте запрос на видео выше — и дело сдвинется.",
    errorTitle: "Не удалось загрузить запросы",
    noMatchBody:
      "На доске нет запросов под эти фильтры. Ослабьте их, чтобы увидеть остальные.",
    countAll: "{requests} на голосовании",
    countAllCapped:
      "{requests} на голосовании (доска длиннее, чем мы загрузили)",
    countFiltered: "{requests} из {total}",
    countFilteredCapped:
      "{requests} из {total} (доска длиннее, чем мы загрузили)"
  },

  // The queue page: the same requests, ranked, read-only.
  queue: {
    title: "Очередь запросов",
    lead: "Порядок работы: скрипт первым получает запрос с наибольшим числом голосов.",
    boardLink: "Доска голосования",
    emptyTitle: "Очередь пуста",
    emptyBody:
      "Сейчас ни одно видео не ждёт скрипта. Отправьте запрос с доски голосования — и дело сдвинется.",
    emptyAction: "Перейти к запросам",
    errorTitle: "Не удалось загрузить очередь",
    noMatchBody:
      "В очереди нет запросов под эти фильтры. Ослабьте их, чтобы увидеть остальные.",
    countWaiting: "{requests} в очереди",
    countWaitingCapped:
      "{requests} в очереди (очередь длиннее, чем мы загрузили)",
    countFiltered: "{requests} из {total} в очереди",
    countFilteredCapped:
      "{requests} из {total} (очередь длиннее, чем мы загрузили)"
  },

  // The submit row on the board, plus the two toasts it can raise.
  submit: {
    title: "Запросить видео",
    hint: "Вставьте ссылку на видео, для которого хотите скрипт. Перед выходом на голосование запрос проходит проверку.",
    urlLabel: "URL видео",
    action: "Отправить запрос",
    sentTitle: "Запрос отправлен",
    sentBody: "Перед выходом на голосование он проходит проверку.",
    failedTitle: "Запрос не отправлен",
    failedBody: "Индекс скриптов не принял этот URL. Попробуйте снова."
  },

  // The vote button and its toasts. `failedKeyBody` is the auth case: the key
  // was rotated or the device went offline mid-session.
  vote: {
    action: "Голосовать",
    voted: "Голос отдан",
    successTitle: "Голос учтён",
    successBody: "Запросы с наибольшим числом голосов получают скрипт первыми.",
    failedTitle: "Голос не засчитан",
    failedKeyBody:
      "Либо ключ неверный, либо Handy не в сети — проверьте и то и другое и введите ключ снова.",
    failedBody: "Индекс скриптов не принял голос. Попробуйте снова."
  },

  // One request tile.
  card: {
    untitled: "Запрос на видео",
    openAria: "Открыть: {name}",
    // the request's place in the scripting order, on a badge with room for
    // about four characters
    rank: "№{rank}"
  },

  // The control row shared by both pages.
  filters: {
    searchPlaceholder: "Поиск запросов",
    searchAria: "Поиск запросов по названию",
    sortAria: "Сортировка запросов",
    tagLabel: "Тег",
    tagEmpty: "Теги не найдены",
    // one row of the tag picker: the tag, then how many requests carry it
    tagOption: "{tag} ({count})",
    removeTagAria: "Убрать фильтр: {tag}",
    hideVoted: "Без моего голоса",
    hideVotedTitle: "Скрыть запросы, за которые вы уже голосовали",
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
