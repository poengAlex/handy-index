import type enUS from "../en-US/errors";

// The catch-all route: a URL that matched no page. Grouped under `notFound`
// so a future failure screen can sit beside it without renaming these keys.
const errors: typeof enUS = {
  notFound: {
    title: "Здесь ничего нет",
    body: "По этой ссылке в индексе ничего не найдено."
  }
};

export default errors;
