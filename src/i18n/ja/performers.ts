import type enUS from "../en-US/performers";

// The performer directory (/performers): a grid of avatar cards with a name
// search, a sort control and endless scroll. Same page shape as `sites` — a
// header count line, a search box and two empty states — so the key names are
// kept parallel with that namespace on purpose.
const performers: typeof enUS = {
  title: "出演者",

  search: {
    placeholder: "出演者を検索",
    aria: "出演者を名前で検索"
  },

  sort: {
    aria: "出演者を並べ替え",
    count: "動画数順",
    rating: "評価順",
    // an alphabet range, so it changes with the language
    name: "名前順",
    // Four whole messages rather than one with a {direction} param: the
    // button says what the order *is* and what clicking does, and neither
    // language builds that sentence from the same pieces.
    descAria: "降順で表示中。並び順を反転します",
    ascAria: "昇順で表示中。並び順を反転します",
    descTitle: "降順で表示中。クリックで反転します",
    ascTitle: "昇順で表示中。クリックで反転します"
  },

  // the star chip on a card; Norwegian puts a space before the percent sign
  ratingBadge: "★ {rating}%",

  errorTitle: "出演者を読み込めませんでした",
  hiddenBody:
    "有料コンテンツのフィルターとミュート中のタグで、すべての出演者が隠れています。設定で条件を緩めてください。",
  noMatchTitle: "一致する出演者がいません",
  noMatchBody:
    "「{query}」に一致するものは、インデックスにありません。もっと短い名前でお試しください。"
};

export default performers;
