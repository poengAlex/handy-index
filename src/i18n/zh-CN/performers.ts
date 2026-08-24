import type enUS from "../en-US/performers";

// The performer directory (/performers): a grid of avatar cards with a name
// search, a sort control and endless scroll. Same page shape as `sites` — a
// header count line, a search box and two empty states — so the key names are
// kept parallel with that namespace on purpose.
const performers: typeof enUS = {
  title: "演员",

  search: {
    placeholder: "搜索演员",
    aria: "按名字搜索演员"
  },

  sort: {
    aria: "演员排序",
    count: "视频最多",
    rating: "评分最高",
    // an alphabet range, so it changes with the language
    name: "A–Z",
    // Four whole messages rather than one with a {direction} param: the
    // button says what the order *is* and what clicking does, and neither
    // language builds that sentence from the same pieces.
    descAria: "当前降序——反转",
    ascAria: "当前升序——反转",
    descTitle: "当前降序——点击反转",
    ascTitle: "当前升序——点击反转"
  },

  // the star chip on a card; Norwegian puts a space before the percent sign
  ratingBadge: "★ {rating}%",

  errorTitle: "无法加载演员",
  hiddenBody: "你的付费筛选和屏蔽标签把所有演员都藏了起来。到设置里放宽一些。",
  noMatchTitle: "没有匹配的演员",
  noMatchBody: "索引里没有匹配“{query}”的内容。换个更短的名字试试。"
};

export default performers;
