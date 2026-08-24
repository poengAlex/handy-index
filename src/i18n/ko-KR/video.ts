import type enUS from "../en-US/video";

// The video detail page — the biggest single surface in the app: the hero and
// its chips, the action row, the opt-in partner player, the tag strip, the
// details card, the star rating, the stills gallery and its full-size viewer,
// script comments, the "more like this" shelves, and a toast for every
// outcome each of those can produce.
const video: typeof enUS = {
  missingTitle: "동영상을 찾을 수 없어요",
  missingBody: "이 동영상은 더 이상 색인에 없거나, 링크가 잘못됐어요.",

  // Stand-ins for catalog fields the index published empty. They are read
  // out loud (alt text, an iframe title) or land mid-sentence, so each one
  // has to work in the slot it fills — "Watch on the site" (the same reading
  // media.ts gives an unnamed partner), "Still 3 from Video".
  fallback: {
    video: "동영상",
    player: "동영상 플레이어",
    site: "해당 사이트",
    thisSite: "이 사이트"
  },

  hero: {
    premiumChip: "유료 스크립트"
  },

  action: {
    getScript: "스크립트 받기",
    // {site} is the partner's own name, or `fallback.site` when it has none
    watchOn: "{site}에서 보기",
    addFavorite: "즐겨찾기에 추가",
    removeFavorite: "즐겨찾기에서 제거",
    addToPlaylist: "재생목록에 추가",
    report: "이 동영상 신고하기"
  },

  premiumNote:
    "이 동영상의 스크립트는 유료예요. 파트너 사이트에서 동영상과 함께 제공돼요.",

  playerNote:
    "IVDB에서는 재생 화면이 Handy와 동기화되지 않아요. 여기 플레이어는 영상만 재생해요. 움직임까지 맞추려면 스크립트를 내려받아 Handy 환경에서 재생하세요.",

  tag: {
    unmuteAria: "「{tag}」 태그 차단 해제",
    mutedTitle: "「{tag}」 태그는 차단 상태예요 — 누르면 해제돼요",
    browse: "이 태그 둘러보기",
    mute: "이 태그 차단하기"
  },

  details: {
    title: "상세 정보",
    script: "스크립트",
    free: "무료",
    premium: "유료",
    published: "공개일",
    duration: "길이",
    format: "형식",
    // the non-VR case: an ordinary 2D video
    formatFlat: "일반",
    site: "사이트",
    scriptBy: "스크립트 제작자",
    rating: "평점",
    ratingValue: "{percent}%",
    // {votes} arrives already pluralized from useFormat().count("votes", n)
    ratingWithVotes: "{percent}% · {votes}",
    scriptPlays: "스크립트 재생 수"
  },

  rate: {
    title: "이 스크립트 평가하기",
    community: "커뮤니티: {percent}%",
    thanks: "이 스크립트를 평가해 주셔서 고마워요",
    errorTitle: "평가를 저장하지 못했어요"
  },

  gallery: {
    // the strip is headed "Photos" unless the only thing in it is the
    // partner's roll clip
    photosTitle: "사진",
    previewTitle: "미리보기",
    previewBadge: "미리보기",
    clipAria: "미리보기 클립 전체 화면으로 재생",
    photoAria: "사진 {total}장 중 {index}번째 열기",
    stillAlt: "「{title}」의 {number}번째 스틸",
    previousPhoto: "이전 사진",
    nextPhoto: "다음 사진",
    closeViewer: "뷰어 닫기",
    // position counter under the full-size viewer — "3 / 12"
    viewerCount: "{index} / {total}"
  },

  comments: {
    title: "댓글",
    gateHint: "댓글에는 연결 키가 필요해요.",
    gateAction: "키 추가",
    inputLabel: "댓글 남기기",
    submit: "댓글 등록",
    errorHint: "댓글을 불러오지 못했어요.",
    emptyHint: "아직 댓글이 없어요. 첫 댓글을 남겨 보세요.",
    postedTitle: "댓글을 등록했어요",
    postedBody: "검수를 통과하면 표시돼요.",
    postErrorTitle: "댓글을 등록하지 못했어요"
  },

  more: {
    related: "비슷한 동영상",
    fromPartner: "{site}의 다른 동영상"
  },

  // Replaces ConnectionKeyDialog's generic blurb — the reason the key is
  // being asked for differs per action.
  keyPrompt: {
    script:
      "스크립트는 Handy와 연결돼 있어요. 계속하려면 Handy 앱에 있는 연결 키를 입력하세요.",
    action:
      "평가와 댓글은 Handy와 연결돼 있어요. 계속하려면 Handy 앱에 있는 연결 키를 입력하세요."
  },

  script: {
    readyTitle: "스크립트 준비 완료",
    readyBody: "새 탭에서 다운로드가 시작됐어요.",
    errorTitle: "스크립트를 받지 못했어요",
    errorBody:
      "연결 키가 틀렸거나 Handy가 온라인 상태가 아니에요. 둘 다 확인한 뒤 다시 시도해 보세요."
  },

  mute: {
    refusedTitle: "「{tag}」 태그는 차단할 수 없어요",
    refusedBody:
      "성향 태그는 어떤 카탈로그를 볼지 정해요 — 설정에서 바꿀 수 있어요.",
    doneTitle: "「{tag}」 태그를 차단했어요",
    doneBody: "차단 목록에 들어갔어요. 언제든 해제할 수 있어요.",
    undoneTitle: "「{tag}」 태그 차단을 해제했어요"
  },

  share: {
    copiedTitle: "링크를 복사했어요",
    errorTitle: "링크를 복사하지 못했어요"
  },

  // The report button opens a pre-filled mail draft. The reader is the one
  // who finishes and sends it, so the draft is written in their language;
  // the identifying lines keep it useful once it reaches the inbox.
  report: {
    subject: "동영상을 신고합니다",
    intro: "동영상을 신고하고 싶습니다.",
    titleLine: "제목: {title}",
    untitled: "(제목 없음)",
    idLine: "동영상 ID: {id}",
    siteLine: "사이트: {site}",
    linkLine: "링크: {link}",
    reasonLine: "신고 사유:"
  }
};

export default video;
