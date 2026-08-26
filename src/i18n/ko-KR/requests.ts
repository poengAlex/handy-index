import type enUS from "../en-US/requests";

// The community side of the catalog: one voting board that is also the
// queue — submit a video URL, upvote what should get scripted next, and read
// each tile's rank as its place in the scripting order. The board is gated on
// the Handy connection key, which is what `key.*` covers.
const requests: typeof enUS = {
  // Connection-key gate and the two failure states behind it.
  key: {
    title: "Connection key 값이 필요해요",
    boardBody:
      "요청 게시판은 Handy와 연결돼 있어요. 요청을 보고, 올리고, 투표하려면 Handy 앱에 있는 connection key 값을 추가하세요.",
    addAction: "Connection key 추가",
    rejectedTitle: "Connection key 값이 거부됐어요",
    rejectedBody:
      "키가 틀렸거나 Handy가 온라인 상태가 아니에요. Handy 앱에서 키를 확인하고, 기기가 켜져 있고 연결됐는지 본 다음 다시 입력하세요.",
    rejectedAction: "키 다시 입력",
    boardDialog:
      "요청 게시판은 Handy와 연결돼 있어요. 계속하려면 Handy 앱에 있는 connection key 값을 입력하세요."
  },

  // The voting board page. There are four count messages rather than one
  // stem the render bolts suffixes onto: "of {total}" only appears while
  // filters narrow the list, and the capped note only when the board is
  // longer than the single load we do. `{requests}` arrives already counted
  // and pluralized ("12 requests", from common.count.requests) — move it
  // wherever the sentence wants it.
  board: {
    title: "Script 요청",
    lead: "다음에 어떤 동영상에 script를 만들지 투표하세요 — 표를 가장 많이 받은 요청부터 만들어요.",
    emptyTitle: "기다리는 요청이 없어요",
    emptyBody:
      "지금은 투표할 요청이 없어요. 위에서 동영상을 요청하면 시작돼요.",
    errorTitle: "요청을 불러오지 못했어요",
    noMatchBody:
      "게시판에 그 필터와 맞는 요청이 없어요. 조건을 풀면 나머지가 보여요.",
    countAll: "{requests} 투표 진행 중",
    countAllCapped: "{requests} 투표 진행 중 (불러온 것보다 요청이 더 많아요)",
    countFiltered: "전체 {total}건 중 {requests}",
    countFilteredCapped:
      "전체 {total}건 중 {requests} (불러온 것보다 요청이 더 많아요)"
  },

  // The submit row on the board, plus the two toasts it can raise.
  submit: {
    title: "동영상 요청",
    hint: "Script가 있었으면 하는 동영상 링크를 붙여 넣으세요. 확인 절차를 거친 뒤 투표 목록에 올라와요.",
    urlLabel: "동영상 URL",
    action: "동영상 요청하기",
    sentTitle: "요청을 보냈어요",
    sentBody: "확인 절차를 거친 뒤 투표 목록에 올라와요.",
    failedTitle: "요청에 실패했어요",
    failedBody: "Script 색인이 URL을 받아들이지 않았어요. 다시 시도해 보세요."
  },

  // The vote button and its toasts. `failedKeyBody` is the auth case: the key
  // was rotated or the device went offline mid-session.
  vote: {
    action: "투표",
    voted: "투표 완료",
    successTitle: "투표했어요",
    successBody: "표를 많이 받은 요청부터 script를 만들어요.",
    failedTitle: "투표에 실패했어요",
    failedKeyBody:
      "키가 틀렸거나 Handy가 온라인 상태가 아니에요. 둘 다 확인하고 다시 입력하세요.",
    failedBody: "Script 색인이 투표를 받아들이지 않았어요. 다시 시도해 보세요."
  },

  // One request tile.
  card: {
    untitled: "동영상 요청",
    openAria: "{name} 열기",
    // the request's place in the scripting order, on a badge with room for
    // about four characters
    rank: "#{rank}"
  },

  // The control row above the list.
  filters: {
    searchPlaceholder: "요청 검색",
    searchAria: "제목으로 요청 검색",
    sortAria: "요청 정렬",
    tagLabel: "태그",
    tagEmpty: "일치하는 태그가 없어요",
    // one row of the tag picker: the tag, then how many requests carry it
    tagOption: "{tag} ({count})",
    removeTagAria: "필터 제거: {tag}",
    performerLabel: "출연자",
    performerEmpty: "일치하는 출연자가 없어요",
    // one row of the performer picker: who they are, then how many
    // requests name them
    performerOption: "{name} ({count})",
    removePerformerAria: "필터 제거: {name}",
    hideVoted: "투표한 요청 숨기기",
    hideVotedTitle: "이미 투표한 요청을 목록에서 숨겨요",
    emptyTitle: "일치하는 요청이 없어요"
  },

  // Sort picker. Keys match RequestSortKey.
  sort: {
    votes: "득표 많은 순",
    newest: "최신순",
    longest: "길이 긴 순",
    title: "제목순"
  }
};

export default requests;
