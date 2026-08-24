import type enUS from "../en-US/home";

// The front page: the featured hero at the top, the config-driven carousel
// shelves under it, and the confirm dialog behind the recently-viewed
// shelf's clear icon. Shelf titles are row headers in a tight horizontal
// strip — keep them short.
const home: typeof enUS = {
  hero: {
    kicker: "추천",
    /** alt text when the featured video has no title of its own */
    alt: "추천 동영상",
    cta: "동영상 보기",
    emptyTitle: "추천할 동영상이 없어요"
  },

  // One sentence, two places: under the empty hero and under the empty shelf
  // list. Both are the same "you filtered the catalog away" state.
  filteredOutBody:
    "필터와 차단한 태그가 카탈로그 전체를 가리고 있어요. 설정에서 조건을 풀어 보세요.",

  rows: {
    recent: "최근 추가됨",
    favorites: "내 즐겨찾기",
    recentlyViewed: "최근 본 동영상",
    /** help-icon tooltip on the recently-viewed shelf */
    recentlyViewedHint:
      "이 브라우저에만 저장돼요. 시청 기록은 추적하지도, 어디로 보내지도 않아요.",
    /** delete-icon tooltip on the same shelf */
    recentlyViewedClear: "최근 본 동영상 지우기",
    /** {tag} is a catalog tag and stays untranslated */
    becauseYouLike: "「{tag}」 태그를 좋아해서",
    topRated: "평점 높은 순",
    mostPlayed: "재생 많은 순",
    updated: "최근 업데이트됨"
  },

  clearHistory: {
    title: "최근 본 동영상을 지울까요?",
    body: "동영상은 카탈로그에 그대로 남아요. 이 브라우저에 남은 열어본 목록만 사라져요.",
    confirm: "기록 지우기",
    done: "최근 본 동영상을 지웠어요"
  }
};

export default home;
