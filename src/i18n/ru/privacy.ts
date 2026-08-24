import type enUS from "../en-US/privacy";

// The privacy & terms page at /privacy. Every sentence here is a factual
// claim about what the site stores, what leaves the browser and who may use
// it — translate the claim, never a looser version of it. `apiBody` and
// `contact.body` are rendered through <i18n-t> with the anchors supplied as
// named slots, so the link text lives in its own key and the sentence stays
// one unit whose word order a translator is free to move.
const privacy: typeof enUS = {
  title: "Конфиденциальность и условия",

  // Shown only when the page is being read in a translation — the English
  // wording is the one the site is held to, and a reader of the Norwegian
  // needs to know that before the first claim, not after the last.
  authoritativeNotice:
    "Это перевод. При расхождении версий действует английская.",

  intro:
    "IVDB — каталог видео со scripts для Handy; его ведёт команда Handy (Ohdoki AS). На этой странице описано, что сайт делает с твоими данными. Коротко: как можно меньше.",

  what: {
    title: "Что это за сайт",
    body: "Сайт перечисляет видео со scripts и даёт ссылки на сами scripts и на партнёрские сайты, где лежит само содержимое. Видео на наших серверах не хранятся — только scripts. Для владельцев Handy просмотр каталога бесплатный.",
    apiBody:
      "Сайт построен на открытом API индекса script — используй его в своих проектах: {apiDocs}. Исходный код самого сайта открыт ради полной прозрачности: {repo}.",
    apiDocsLink: "Документация API",
    repoLink: "Репозиторий на GitHub"
  },

  local: {
    title: "Что остаётся в этом браузере",
    intro:
      "Здесь нет ни аккаунтов, ни куки-файлов, ни аналитики. Всё, что ты настраиваешь, хранится только в локальном хранилище этого браузера:",
    item: {
      consent: "твой ответ в окне согласия при первом посещении",
      previews: "настройка откровенного предпросмотра (NSFW)",
      orientation: "фильтр ориентации",
      accessFilters: "твои фильтры доступа к script и видео",
      favorites: "твоё избранное",
      votes: "твои голоса за запросы видео",
      connectionKey: "твой connection key от Handy"
    },
    outro:
      "Открой сайт на другом устройстве или очисти данные браузера — и всего этого не будет: восстанавливать с сервера нечего. Обратная сторона отсутствия аналитики в том, что мы не видим ошибок, поэтому сообщения о них особенно ценны."
  },

  catalog: {
    title: "Откуда берётся каталог",
    body: "Каталог, его метаданные и scripts загружаются из API индекса script на handyfeeling.com. Когда ты скачиваешь script, отправляешь запрос на видео или голосуешь за него, твой connection key уходит в этот API как авторизация — это единственный случай, когда введённые тобой данные покидают браузер."
  },

  thirdParty: {
    title: "Сторонние сайты",
    body: "Со страниц видео ведут ссылки на партнёрские сайты, где эти видео и лежат. Это сторонние сайты для взрослых со своими политиками конфиденциальности и своей аналитикой: как только ты уходишь с IVDB, действуют их правила. Если включён откровенный предпросмотр, обложки грузятся прямо с партнёрских сайтов, то есть твой браузер шлёт запросы, которые их серверы могут записывать. Если это тебя беспокоит, держи предпросмотр выключенным или используй VPN."
  },

  age: {
    title: "Возрастное ограничение",
    body: "Сайт индексирует материалы для взрослых и предназначен только для совершеннолетних. Пользоваться им можно с 18 лет или с возраста совершеннолетия там, где ты живёшь."
  },

  choices: {
    title: "Как изменить свой выбор",
    body: "Ничто из выбранного в окне при первом посещении не окончательно. Откровенный предпросмотр, ориентацию и фильтры доступа к script и видео можно изменить в любой момент в окне настроек в верхней панели."
  },

  contact: {
    title: "Контакты",
    body: "Вопросы, сообщения об ошибках и требования об удалении: {email}"
  }
};

export default privacy;
