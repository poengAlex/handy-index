import type enUS from "../en-US/common";

// Vocabulary shared by more than one surface. Same admission rule as the
// component menu in ARCHITECTURE.md: a string is promoted here on its
// *second* consumer — a phrase used once belongs in its feature namespace,
// where a translator can see the context it is used in.
//
// Plural messages carry a `{count}` named param instead of vue-i18n's bare
// `{n}`, because the count has to be run through `$n()` first so 15000 reads
// "15,000" in English and "15 000" in Norwegian. Call them as
// `$t("common.count.videos", { count: $n(x) }, x)`.
const common: typeof enUS = {
  action: {
    backToHome: "홈으로 돌아가기",
    browseVideos: "동영상 둘러보기",
    cancel: "취소",
    clear: "지우기",
    clearFilters: "필터 지우기",
    clearSearch: "검색어 지우기",
    create: "만들기",
    delete: "삭제",
    done: "완료",
    import: "가져오기",
    manage: "관리",
    rename: "이름 변경",
    retry: "다시 시도",
    save: "저장",
    share: "공유"
  },

  state: {
    catalogErrorTitle: "카탈로그를 불러오지 못했어요",
    catalogErrorBody:
      "스크립트 색인이 응답하지 않았어요. 연결을 확인하고 다시 시도해 보세요.",
    emptyTitle: "표시할 내용이 없어요"
  },

  // "12 of 340" — the shown/total pair every filtered listing prints. Both
  // sides arrive pre-formatted through `$n()`.
  ofTotal: {
    videos: "동영상 {total}개 중 {shown}개",
    performers: "출연자 {total}명 중 {shown}명",
    tags: "태그 {total}개 중 {shown}개"
  },

  count: {
    performers: "출연자 {count}명",
    playlists: "재생목록 {count}개",
    requests: "요청 {count}건",
    sites: "사이트 {count}곳",
    tags: "태그 {count}개",
    videos: "동영상 {count}개",
    votes: "{count}표"
  },

  // Duration is assembled from parts rather than formatted in the service:
  // Norwegian abbreviates hours "t", not "h", and only the message layer
  // knows that. `durationParts()` in services/format.ts picks which key.
  duration: {
    hoursMinutes: "{hours}시간 {minutes}분",
    hours: "{hours}시간",
    minutes: "{minutes}분",
    seconds: "{seconds}초"
  },

  justNow: "방금 전",

  // Shared by the settings radio group, the browse filters and the header
  // switcher — the same "can't drift apart" reason ORIENTATION_LABELS gave
  // for living in queries.ts, which is where these strings came from.
  orientation: {
    straight: "이성애",
    gay: "게이",
    trans: "트랜스",
    all: "전체"
  },

  language: {
    label: "언어",
    caption: "이 사이트를 표시할 언어를 고르세요",
    system: "브라우저 설정 따르기"
  }
};

export default common;
