import type enUS from "../en-US/about";

const about: typeof enUS = {
  title: "Об IVDB",
  body: "IVDB — каталог видео, для которых есть скрипты Handy. Его делает команда Handy в Ohdoki AS, и пользоваться им бесплатно.",
  beta: "Это всё ещё бета-версия. Что-то не доделано, а что-то наверняка сломано — если заметишь, расскажи нам.",

  version: "Версия {version}",
  built: "Собрано {date}",
  copyright: "© {year} Ohdoki AS",

  changelog: {
    title: "Что нового",
    lead: "Изменения на сайте, новые сверху.",
    englishOnly: "Этот список есть только на английском.",
    errorTitle: "Не удалось загрузить список изменений",
    errorBody: "Список не загрузился. Проверь соединение и попробуй ещё раз."
  }
};

export default about;
