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
    plays: "Больше всего запусков",
    rating: "Лучший рейтинг",
    // an alphabet range, so it changes with the language
    name: "По алфавиту",
    age: "Возраст",
    height: "Рост",
    weight: "Вес",
    bmi: "Телосложение",
    cup: "Размер груди",
    unknownLast:
      "Те, у кого в профиле этого нет, всегда в конце — в любом порядке.",
    profilesError:
      "Для этой сортировки нужны все профили, а их не удалось загрузить. Проверь подключение и попробуй ещё раз.",
    // Four whole messages rather than one with a {direction} param: the
    // button says what the order *is* and what clicking does, and neither
    // language builds that sentence from the same pieces.
    descAria: "Сортировка по убыванию — обратить порядок",
    ascAria: "Сортировка по возрастанию — обратить порядок",
    descTitle: "Сортировка по убыванию — нажми, чтобы обратить порядок",
    ascTitle: "Сортировка по возрастанию — нажми, чтобы обратить порядок"
  },

  // the star chip on a card; Norwegian puts a space before the percent sign
  ratingBadge: "★ {rating}%",

  card: {
    age: "Возраст: {age}",
    height: "{cm} cm",
    weight: "{kg} kg",
    cup: "Чашка {cup}",
    previewPlay: "Воспроизвести превью: {name}",
    previewStop: "Остановить превью: {name}"
  },

  errorTitle: "Не удалось загрузить актёров",
  hiddenBody:
    "Фильтр платного контента и заглушённые теги скрывают всех актёров. Ослабь их в настройках.",
  noMatchTitle: "Актёры не найдены",
  noMatchBody:
    "В индексе нет совпадений с «{query}». Попробуй более короткое имя.",

  filters: {
    title: "Фильтр актёров",
    lead: "В большинстве профилей указана лишь часть этих данных. Фильтр оставляет только тех актёров, в чьём профиле есть выбранное тобой.",
    errorTitle: "Не удалось загрузить профили",
    errorBody:
      "Фильтрам нужны профили всех актёров, а они не загрузились. Проверь соединение и попробуй ещё раз.",
    noMatchBody:
      "В индексе нет никого, кто подходил бы под все эти фильтры. Убери некоторые, чтобы увидеть больше.",
    chip: "{facet}: {value}",
    facets: {
      gender: "Пол",
      hair: "Волосы",
      eyes: "Глаза",
      ethnicity: "Этничность",
      cup: "Размер груди",
      natural: "Грудь",
      tattoos: "Татуировки",
      piercings: "Пирсинг",
      age: "Возраст",
      height: "Рост",
      bmi: "Телосложение"
    },
    options: {
      gender: {
        woman: "Женщина",
        man: "Мужчина",
        trans: "Транс",
        couple: "Пара",
        nonBinary: "Небинарный"
      },
      hair: {
        blonde: "Светлые",
        brunette: "Каштановые",
        black: "Чёрные",
        red: "Рыжие",
        grey: "Седые",
        bald: "Без волос",
        other: "Другие"
      },
      eyes: {
        brown: "Карие",
        blue: "Голубые",
        green: "Зелёные",
        hazel: "Ореховые",
        grey: "Серые",
        black: "Чёрные",
        other: "Другие"
      },
      ethnicity: {
        white: "Европейская",
        latina: "Латиноамериканская",
        asian: "Азиатская",
        black: "Африканская",
        indian: "Индийская",
        middleEastern: "Ближневосточная",
        mixed: "Смешанная",
        other: "Другая"
      },
      cup: {
        a: "A",
        b: "B",
        c: "C",
        d: "D",
        ddPlus: "DD+"
      },
      natural: {
        natural: "Натуральная",
        enhanced: "Увеличенная"
      }
    },
    ageAny: "Любой возраст",
    ageFrom: "от {min}",
    ageUpTo: "до {max}",
    ageRange: "{min}–{max}",
    heightAny: "Любой рост",
    heightFrom: "от {min} cm",
    heightUpTo: "до {max} cm",
    heightRange: "{min}–{max} cm",
    bmiAny: "Любое телосложение",
    bmiFrom: "{min} и полнее",
    bmiUpTo: "{max} и стройнее",
    bmiRange: "{min} — {max}",
    build: {
      slender: "миниатюрное",
      slim: "стройное",
      medium: "среднее",
      curvy: "с изгибами",
      full: "пышное"
    }
  },

  report: {
    helpAria: "Об этом профиле — сообщить об ошибке",
    title: "Об этом профиле",
    disclaimer:
      "Данные профиля взяты с сайтов-партнёров и из других открытых источников. IVDB их не проверяет, поэтому что-то может быть неверным или устаревшим.",
    question: "Нашёл ошибку? Отметь, что не так:",
    reason: {
      measurements: "Параметры, рост или вес",
      age: "Возраст или дата рождения",
      details: "Другие данные (волосы, глаза, страна…)",
      media: "На фото или видео не этот человек",
      self: "Это я, и я хочу что-то исправить или удалить",
      other: "Другое"
    },
    detailsLabel: "Что неверно и как должно быть? (необязательно)",
    note: "Откроется почтовое приложение с готовым сообщением для команды IVDB.",
    send: "Написать письмо",
    email: {
      subject: "Исправление профиля в IVDB: {name}",
      intro: "Хочу сообщить об ошибке в этом профиле.",
      nameLine: "Актёр: {name}",
      idLine: "ID: {id}",
      linkLine: "Страница: {link}",
      reasonsLine: "Что не так:",
      detailsLine: "Подробности:",
      profileLine: "Что сейчас указано в профиле:"
    }
  },

  media: {
    photos: "Фото",
    reel: "Шоурил",
    fromVideo: "Открыть видео",
    counter: "{index} / {total}",
    slideshow: "слайд-шоу",
    previous: "Предыдущее фото",
    next: "Следующее фото",
    previousVideo: "Предыдущее видео",
    nextVideo: "Следующее видео",
    pause: "Пауза",
    play: "Воспроизвести"
  },

  profile: {
    eyebrow: "Актёр",
    plays:
      "{count} запуск script | {count} запуска script | {count} запусков script",
    linkAria: "{site} — откроется в новой вкладке",
    socials: "Соцсети",
    moreOf: "{name} на других сайтах",
    partnerLinkAria: "Профиль на {site} — откроется в новой вкладке",
    about: "Биография",
    hobbies: "Хобби",
    details: "Профиль",
    born: "Дата рождения",
    age: "Возраст",
    from: "Откуда",
    career: "Карьера",
    careerSpan: "{start}–{end}",
    careerSince: "С {start} года",
    careerActive: "Снимается",
    careerInactive: "Не снимается",
    height: "Рост",
    weight: "Вес",
    heightValue: "{cm} cm",
    weightValue: "{kg} kg",
    measurements: "Параметры",
    hair: "Волосы",
    eyes: "Глаза",
    ethnicity: "Этничность",
    starSign: "Знак зодиака",
    tattoos: "Татуировки",
    piercings: "Пирсинг",
    yes: "Есть",
    no: "Нет"
  }
};

export default performers;
