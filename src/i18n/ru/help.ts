import type enUS from "../en-US/help";

// The feature tour at /help — one row per capability, grouped the way people
// actually use the site. Every `label` is a short feature name; every
// `caption` is the single sentence sitting under it. Keep captions to one
// sentence: the row truncates nothing, but a second sentence turns the list
// into documentation, which is what this page exists to replace.
const help: typeof enUS = {
  title: "Помощь",
  lead: "Всё, что умеет этот сайт, в одном месте. Строки со стрелкой ведут прямо туда.",

  finding: {
    title: "Поиск видео",
    search: {
      label: "Поиск и фильтры",
      caption:
        "Ищи по названиям и сужай выборку по тегу, сайту, актёру, VR и длительности — все фильтры хранятся в URL, поэтому результатами можно делиться"
    },
    sort: {
      label: "Сортировка на любой вкус",
      caption:
        "Сначала новые, по рейтингу, по запускам и не только — кнопка со стрелкой рядом с сортировкой обращает порядок"
    },
    tags: {
      label: "Облако тегов",
      caption:
        "Все теги каталога, кроме заглушённых тобой, с поиском и сортировкой — один клик фильтрует страницу видео"
    },
    performers: {
      label: "Актёры",
      caption: "Смотри по актёрам — впереди те, у кого больше всего видео"
    },
    sites: {
      label: "Сайты",
      caption: "Все партнёрские сайты индекса с числом видео"
    }
  },

  library: {
    title: "Твоя библиотека",
    favorites: {
      label: "Избранное",
      caption:
        "Отметь видео сердечком, чтобы оно было под рукой — хранится на этом устройстве"
    },
    playlists: {
      label: "Плейлисты",
      caption: "Создавай, переименовывай и наполняй плейлисты любыми видео"
    },
    transfer: {
      label: "Обмен, импорт и выгрузка плейлистов",
      caption:
        "Перенеси плейлист файлом, текстом JSON или временной ссылкой — и импортируй любым из этих способов"
    },
    bulkDownload: {
      label: "Все scripts разом",
      caption: "Один клик на плейлисте скачивает все бесплатные scripts из него"
    },
    quickMenu: {
      label: "Быстрое меню",
      caption:
        "Правый клик (или долгое нажатие) на обложке видео открывает избранное, плейлисты, копирование ссылки и не только"
    }
  },

  scripts: {
    title: "Scripts и твой Handy",
    free: {
      label: "Бесплатные scripts",
      caption:
        "У видео с пометкой «Бесплатный» есть script, который можно скачать по твоему connection key от Handy"
    },
    rate: {
      label: "Оценка scripts",
      caption: "Ставь звёзды любому бесплатному script прямо на странице видео"
    },
    comments: {
      label: "Комментарии к scripts",
      caption: "Читай и пиши анонимные комментарии к scripts"
    },
    requests: {
      label: "Запросы на видео",
      caption:
        "Попроси script для любого видео и голосуй за то, для чего сделают script дальше"
    }
  },

  personalize: {
    title: "Настрой под себя",
    previews: {
      label: "Откровенный предпросмотр",
      caption: "По умолчанию выключен — включи обложки в настройках"
    },
    players: {
      label: "Встроенные плееры",
      caption:
        "По умолчанию выключены — смотри видео с Pornhub и xHamster прямо на странице видео (воспроизведение не синхронизируется с Handy)"
    },
    filters: {
      label: "Фильтры ориентации, script и видео",
      caption:
        "Бесплатные или платные scripts, бесплатные или платные видео и кто в них снимается — в настройках или прямо в фильтрах на странице видео"
    },
    mutedTags: {
      label: "Заглушённые теги",
      caption:
        "Заглуши тег — и все видео с ним исчезнут из каталога: правый клик по любому тегу или список в настройках"
    },
    theme: {
      label: "Светлая и тёмная тема",
      caption: "Переключатель в шапке — выбор действует везде"
    },
    share: {
      label: "Поделиться",
      caption:
        "У каждой страницы видео и у каждого списка с фильтрами есть ссылка, которой можно поделиться"
    }
  },

  about: {
    title: "О сайте",
    appCaption: "Что это за сайт, кто его делает и какая у тебя версия",
    changelogCaption: "Всё, что изменилось на сайте, новое сверху",
    privacyCaption:
      "Что хранится, что покидает твой браузер и возрастное ограничение"
  }
};

export default help;
