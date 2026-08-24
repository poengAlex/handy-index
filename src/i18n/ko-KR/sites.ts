import type enUS from "../en-US/sites";

// The site directory (/sites): one nav card per partner site, with a name
// filter. Almost every string here is a count shape — the header line and the
// card captions are built from `common.count.*` pieces joined with "·", so
// each message below covers one phrase of that line, never the whole line.
const sites: typeof enUS = {
  title: "사이트",

  search: {
    placeholder: "사이트 검색",
    aria: "사이트 검색"
  },

  count: {
    // the tail of the header line when no filter is narrowing anything;
    // {total} arrives as "2,000 videos" from common.count.videos
    totalInIndex: "색인 전체 {total}",
    // the two paywalls are named in full on the cards: they are different
    // gates, and a bare "500 premium" would not say which
    premiumVideos: "유료 동영상 {count}개",
    premiumScripts: "유료 스크립트 {count}개"
  },

  errorTitle: "사이트를 불러오지 못했어요",
  emptyBody: "색인에 사이트가 하나도 없어요. 다시 불러와 보세요.",
  noMatchTitle: "일치하는 사이트가 없어요",
  noMatchBody: "그 검색어와 맞는 사이트 이름이 없어요. 글자 수를 줄여 보세요."
};

export default sites;
