import type enUS from "../en-US/gates";

// Why the catalog is smaller than the index: the disclosure line under every
// listing (`notice`) and the muted-tag manager it opens (`muted`).
//
// `notice` carries two phrasings of the same four reasons on purpose. A lone
// reason is a whole sentence and says the noun ("7,468 videos hidden by muted
// tags"); once a total leads the line the noun has already been said, so each
// reason after it is a bare clause ("1,816 by the Straight filter"). Both
// receive `{count}` pre-formatted — the sentence form through
// `useFormat().count("videos", n)`, the clause form through `$n()`.
const gates: typeof enUS = {
  notice: {
    hiddenByMuted: "차단한 태그로 숨겨진 {count}",
    hiddenByOrientation: "{orientation} 필터로 숨겨진 {count}",
    hiddenByScript: "유료 script 필터로 숨겨진 {count}",
    hiddenByVideo: "유료 동영상 필터로 숨겨진 {count}",

    hiddenTotal: "숨겨진 {count}",
    byMuted: "차단한 태그로 {count}개",
    byOrientation: "{orientation} 필터로 {count}개",
    byScript: "유료 script 필터로 {count}개",
    byVideo: "유료 동영상 필터로 {count}개"
  },

  muted: {
    title: "차단한 태그",
    lead:
      "차단한 태그는 카탈로그에서 사라져요. 둘러보기, 검색, 홈 목록, 관련 " +
      "동영상 어디에도 나오지 않아요. 정확히 일치하는 태그만 차단하므로 " +
      "「gay」를 차단해도 「gay massage」는 그대로 남아요. 즐겨찾기와 " +
      "재생목록은 직접 담은 것이라 그대로 남아요.",

    // the tag picker, and the cost printed under every option in it
    pickerLabel: "차단할 태그",
    pickerEmpty: "일치하는 태그가 없어요",
    costNone: "지금 보이는 동영상 중에는 없음",
    costLine: "{count} · 지금 보이는 것의 {share}",
    // a share small enough to round to zero still isn't nothing, so it gets
    // its own reading rather than "0%"
    percent: "{value}%",
    percentTiny: "<1%",

    // the inline confirm a tag heavy enough to take a tenth of the catalog
    // has to pass first
    confirmBody:
      "「{tag}」 태그가 달린 {count} — 지금 보이는 것의 {share}. 차단하면 " +
      "둘러보기, 검색, 홈 목록, 관련 동영상 어디에서도 빠져요.",
    confirmMute: "그래도 차단",

    chipUnmuteAria: "「{tag}」 태그 차단 해제",
    empty:
      "아직 차단한 태그가 없어요. 위에서 태그를 고르면 그 태그가 달린 " +
      "동영상이 카탈로그에서 모두 빠져요.",
    unmuteAll: "전체 차단 해제",

    toastMutedTitle: "「{tag}」 태그를 차단했어요",
    toastMutedBody: "{count} 숨김",
    toastUnmutedAll: "모든 태그를 차단 해제했어요"
  }
};

export default gates;
