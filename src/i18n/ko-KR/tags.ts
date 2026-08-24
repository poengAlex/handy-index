import type enUS from "../en-US/tags";

// The tag cloud at /tags: every tag in the visible catalog as a clickable
// pill, searchable and sortable, plus the long index-download wait it sits
// behind and the right-click menu that mutes a tag.
const tags: typeof enUS = {
  title: "태그",
  errorTitle: "태그를 불러오지 못했어요",

  // The cloud can't draw a pill until the whole ~40 MB index is in, so the
  // wait gets a phase, a percentage and a reason it's worth it.
  loading: {
    barLabel: "태그 불러오는 중",
    // Norwegian puts a space before the percent sign, so this is a message
    // rather than a bare "%" glued on in the template
    percent: "{percent}%",
    downloading: "스크립트 색인 내려받는 중",
    parsing: "색인 읽는 중",
    noteParsing: "다 받았어요. 지금 태그로 정리하는 중이에요.",
    note: "약 {total} MB 중 {received} MB 풀었어요. 카탈로그 전체를 한 번만 받아 두면 이다음부터는 모든 페이지가 바로 열려요.",
    // the expected total is only last visit's size, so an index that grew
    // since gets a line that doesn't print "44 of ~41 MB"
    noteOversize: "{received} MB 풀었어요. 카탈로그 전체를 한 번만 받아요."
  },

  controls: {
    searchPlaceholder: "태그 검색",
    searchLabel: "태그 검색",
    sortLabel: "태그 정렬",
    sortByCount: "동영상 많은 순",
    // the alphabet's first and last letter — Norwegian ends at Å
    sortByName: "이름순",
    sortedDescLabel: "내림차순 정렬 — 순서 뒤집기",
    sortedAscLabel: "오름차순 정렬 — 순서 뒤집기",
    sortedDescTitle: "내림차순 정렬 — 누르면 순서가 뒤집혀요",
    sortedAscTitle: "오름차순 정렬 — 누르면 순서가 뒤집혀요",
    muted: "차단됨",
    mutedCount: "차단됨 ({count})"
  },

  empty: {
    searchTitle: "일치하는 태그가 없어요",
    searchBody: "색인에 「{query}」 검색 결과가 없어요.",
    filteredBody:
      "필터와 차단한 태그가 색인의 모든 태그를 가리고 있어요. 설정에서 조건을 풀어 보세요.",
    filteredAction: "차단한 태그"
  },

  menu: {
    browse: "이 태그 둘러보기",
    mute: "이 태그 차단하기"
  },

  toast: {
    refusedTitle: "「{tag}」 태그는 차단할 수 없어요",
    refusedBody:
      "성향 태그는 어떤 카탈로그를 볼지 정해요 — 설정에서 바꿀 수 있어요.",
    mutedTitle: "「{tag}」 태그를 차단했어요",
    mutedBody: "차단 목록에 들어갔어요. 언제든 해제할 수 있어요."
  }
};

export default tags;
