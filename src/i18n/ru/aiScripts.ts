import type enUS from "../en-US/aiScripts";

// The AI scripts page (/ai-scripts): every script Handy's auto-scripter has
// published. Reached only from the help page. The warning is the point of
// the page — translate its claim as strongly as English makes it: made by
// AI, checked by nobody.
const aiScripts: typeof enUS = {
  title: "Scripts от ИИ",
  lead: "Все scripts, сделанные авто-скриптером Handy, сначала новые.",

  warning: {
    title: "Сугубо экспериментальная функция",
    body: "Все scripts на этой странице созданы ИИ и не проверены ни одним человеком. Будь готов к ошибкам: движения не в такт, пропущенные или неверные фрагменты. Используй на свой страх и риск."
  },

  search: {
    placeholder: "Поиск scripts от ИИ",
    aria: "Поиск scripts от ИИ по названию видео"
  },

  count: "{count} script от ИИ | {count} scripts от ИИ | {count} scripts от ИИ",
  /** under each title, after the length; {when} is "3 hours ago" */
  made: "Создан {when}",
  download: "Скачать",
  showMore: "Показать ещё",

  emptyBody: "Авто-скриптер пока не опубликовал ни одного script.",
  errorTitle: "Не удалось загрузить scripts от ИИ",
  errorBody: "Сервер scripts от ИИ не ответил. Попробуй ещё раз чуть позже.",
  noMatchTitle: "Ничего не найдено",
  noMatchBody: "Ни у одного script от ИИ нет такого в названии."
};

export default aiScripts;
