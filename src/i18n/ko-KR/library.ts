import type enUS from "../en-US/library";

// The two personal shelves, both of them local to the visitor's browser:
// /favorites (every hearted video) and /history (recently viewed, plus the
// dialog that empties it).
const library: typeof enUS = {
  favorites: {
    title: "내 즐겨찾기",
    // {count} arrives already pluralized from useFormat().count("videos", n),
    // so this message only owns the frame around the noun
    count: "{count} 저장됨",
    emptyTitle: "아직 즐겨찾기가 없어요",
    emptyBody:
      "동영상 페이지에서 하트 버튼을 누르면 여기에 저장돼서 바로 찾을 수 있어요."
  },

  history: {
    title: "최근 본 동영상",
    note: "이 브라우저에만 저장돼요. 시청 기록은 추적하지도, 어디로 보내지도 않아요.",
    emptyTitle: "아직 본 동영상이 없어요",
    emptyBody: "열어본 동영상은 이 기기에만 기록돼요.",
    clearTitle: "최근 본 동영상을 지울까요?",
    clearBody:
      "동영상은 카탈로그에 그대로 남아요. 이 브라우저에 남은 열어본 목록만 사라져요.",
    clearConfirm: "기록 지우기",
    clearedToast: "최근 본 동영상을 지웠어요"
  }
};

export default library;
