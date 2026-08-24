import type enUS from "../en-US/browse";

// The browse + search page (/videos): the toolbar above the grid, the
// active-filter chips, the advanced-filters modal, and one empty state per
// reason the grid can come back empty (a muted tag, the orientation gate,
// or plain over-filtering).
const browse: typeof enUS = {
  title: "동영상",

  toolbar: {
    searchPlaceholder: "제목 검색",
    searchAria: "제목으로 동영상 검색",
    sortAria: "동영상 정렬",
    // The flip button names the direction the list is *in*, then what a
    // click would do — four flat keys rather than a sentence assembled from
    // a direction word, which would strand the translator.
    dirDescAria: "내림차순 정렬 — 순서 뒤집기",
    dirAscAria: "오름차순 정렬 — 순서 뒤집기",
    dirDescTitle: "내림차순 정렬 — 누르면 순서가 뒤집혀요",
    dirAscTitle: "오름차순 정렬 — 누르면 순서가 뒤집혀요",
    filters: "필터",
    filtersCount: "필터 ({count})",
    shareAria: "이 결과 공유 — 링크에 모든 필터가 담겨요"
  },

  // The sort dropdown. Keyed by SortKey so the option list can stay a
  // module constant holding keys instead of English.
  sort: {
    recent: "최근 추가순",
    updated: "최근 업데이트순",
    top: "평점 높은 순",
    plays: "재생 많은 순",
    views: "조회 많은 순",
    longest: "길이 긴 순",
    title: "제목순"
  },

  chip: {
    // {label} is catalog data — a tag, a site name, a performer name
    removeAria: "필터 제거: {label}",
    // stand-ins for a filtered id whose name isn't in the loaded catalog
    partnerFallback: "파트너",
    performerFallback: "출연자"
  },

  filters: {
    title: "필터",
    addTag: "태그 추가",
    noTags: "일치하는 태그가 없어요",
    site: "사이트",
    noSites: "일치하는 사이트가 없어요",
    // one row of either picker: the tag or site name, then how many videos
    // picking it would leave on screen
    option: "{name} ({count})",
    vrLabel: "VR만",
    vrCaption: "VR 동영상만 보여줘요",
    orientation: "성향",
    access: "이용 범위",
    premiumScriptsLabel: "유료 스크립트",
    premiumScriptsCaption: "파트너 사이트에서 유료로 파는 스크립트도 포함해요",
    premiumVideosLabel: "유료 동영상",
    premiumVideosCaption: "파트너 사이트에서 유료로 파는 동영상도 포함해요",
    mutedLabel: "차단한 태그",
    mutedNone: "차단한 태그 없음",
    // {tags} is a comma-joined list of the first few muted tags
    mutedMore: "{tags} 외 {rest}개",
    duration: "길이",
    durationAny: "전체",
    durationFrom: "{min}분 이상",
    durationRange: "{min}–{max}분"
  },

  empty: {
    // A muted tag arriving via ?tag= empties the grid and no filter change
    // can fix it, so the one-tag case names the tag it is talking about.
    mutedOneTitle: "「{tag}」 태그는 차단 상태예요",
    mutedOneBody:
      "이 태그가 붙은 동영상은 어디에서도 보이지 않아요. 결과를 보려면 차단을 해제하세요.",
    mutedOneAction: "「{tag}」 태그 차단 해제",
    mutedManyTitle: "차단한 태그가 섞여 있어요",
    mutedManyBody:
      "이 태그들이 붙은 동영상은 어디에서도 보이지 않아요. 결과를 보려면 차단을 해제하세요.",
    mutedManyAction: "차단 해제하기",
    // {orientation} comes from common.orientation.* via useFormat()
    orientationTitle: "{orientation} 필터에 맞는 동영상이 없어요",
    // one sentence, not a count phrase glued to a clause: the verb agrees
    // with the count in English and the word order differs in Norwegian
    orientationBody:
      "나머지 조건에는 모두 맞지만 {orientation} 필터에 걸리는 동영상이 {count}개 있어요.",
    orientationAction: "모든 성향 보기",
    noneTitle: "일치하는 동영상이 없어요",
    noneBody:
      "모든 동영상이 필터에서 걸러졌어요. 검색 범위를 넓히거나 필터를 지워 보세요.",
    noneAction: "모든 필터 지우기"
  },

  share: {
    // {count} arrives already localized and pluralized as "12 videos"
    // (useFormat().count), so this message only decides where it sits
    title: "IVDB — {count}",
    fallbackTitle: "IVDB 동영상",
    copiedTitle: "링크를 복사했어요",
    copiedBody: "설정한 모든 필터가 링크에 담겨 있어요.",
    failedTitle: "링크를 복사하지 못했어요"
  }
};

export default browse;
