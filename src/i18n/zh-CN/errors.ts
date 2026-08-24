import type enUS from "../en-US/errors";

// The catch-all route: a URL that matched no page. Grouped under `notFound`
// so a future failure screen can sit beside it without renaming these keys.
const errors: typeof enUS = {
  notFound: {
    title: "这里什么都没有",
    body: "这个链接在索引里找不到对应的内容。"
  }
};

export default errors;
