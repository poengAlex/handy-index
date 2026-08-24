import type enUS from "../en-US/errors";

// The catch-all route: a URL that matched no page. Grouped under `notFound`
// so a future failure screen can sit beside it without renaming these keys.
const errors: typeof enUS = {
  notFound: {
    title: "Rien ici",
    body: "Ce lien ne correspond à rien dans l'index."
  }
};

export default errors;
