import type enUS from "../en-US/errors";

// The catch-all route: a URL that matched no page. Grouped under `notFound`
// so a future failure screen can sit beside it without renaming these keys.
const errors: typeof enUS = {
  notFound: {
    title: "여기엔 아무것도 없어요",
    body: "그 링크와 맞는 항목이 색인에 없어요."
  }
};

export default errors;
