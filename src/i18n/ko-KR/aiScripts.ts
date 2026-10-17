import type enUS from "../en-US/aiScripts";

// The AI scripts page (/ai-scripts): every script Handy's auto-scripter has
// published. Reached only from the help page. The warning is the point of
// the page — translate its claim as strongly as English makes it: made by
// AI, checked by nobody.
const aiScripts: typeof enUS = {
  title: "AI script",
  lead: "Handy의 자동 script 생성기가 만든 모든 script, 최신순이에요.",

  warning: {
    title: "매우 실험적인 기능이에요",
    body: "이 페이지의 모든 script는 AI가 만들었고, 어떤 사람도 확인하지 않았어요. 동작이 영상과 맞지 않거나, 빠지거나 틀린 부분이 있을 수 있어요. 사용에 따른 책임은 본인에게 있어요."
  },

  search: {
    placeholder: "AI script 검색",
    aria: "동영상 제목으로 AI script 검색"
  },

  count: "AI script {count}개",
  /** under each title, after the length; {when} is "3 hours ago" */
  made: "{when} 생성",
  download: "다운로드",
  showMore: "더 보기",

  emptyBody: "자동 script 생성기가 아직 script를 공개하지 않았어요.",
  errorTitle: "AI script를 불러오지 못했어요",
  errorBody: "AI script 서버가 응답하지 않았어요. 잠시 후 다시 시도해 주세요.",
  noMatchTitle: "일치하는 script가 없어요",
  noMatchBody: "제목에 그 내용이 들어간 AI script가 없어요."
};

export default aiScripts;
