import type enUS from "../en-US/performers";

// The performer directory (/performers): a grid of avatar cards with a name
// search, a sort control and endless scroll. Same page shape as `sites` — a
// header count line, a search box and two empty states — so the key names are
// kept parallel with that namespace on purpose.
const performers: typeof enUS = {
  title: "출연자",

  search: {
    placeholder: "출연자 검색",
    aria: "이름으로 출연자 검색"
  },

  sort: {
    aria: "출연자 정렬",
    count: "동영상 많은 순",
    rating: "평점 높은 순",
    // an alphabet range, so it changes with the language
    name: "이름순",
    // Four whole messages rather than one with a {direction} param: the
    // button says what the order *is* and what clicking does, and neither
    // language builds that sentence from the same pieces.
    descAria: "내림차순 정렬 — 순서 뒤집기",
    ascAria: "오름차순 정렬 — 순서 뒤집기",
    descTitle: "내림차순 정렬 — 누르면 순서가 뒤집혀요",
    ascTitle: "오름차순 정렬 — 누르면 순서가 뒤집혀요"
  },

  // the star chip on a card; Norwegian puts a space before the percent sign
  ratingBadge: "★ {rating}%",

  errorTitle: "출연자를 불러오지 못했어요",
  hiddenBody:
    "유료 필터와 차단한 태그가 모든 출연자를 가리고 있어요. 설정에서 조건을 풀어 보세요.",
  noMatchTitle: "일치하는 출연자가 없어요",
  noMatchBody:
    "색인에 「{query}」 검색 결과가 없어요. 더 짧은 이름으로 찾아 보세요."
};

export default performers;
