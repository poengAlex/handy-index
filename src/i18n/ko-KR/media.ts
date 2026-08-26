import type enUS from "../en-US/media";

// The shared media primitives — the catalog tile every listing renders, its
// right-click quick menu, and the toasts that menu raises. The tile's own
// text (title, partner name) is catalog data and is never translated; what
// lives here is the chrome around it.
const media: typeof enUS = {
  card: {
    // accessible name for an entry the index published without a title
    fallbackTitle: "동영상",
    // the star rating printed beside the tile caption — "★ 92%"
    rating: "★ {rating}%"
  },

  menu: {
    moreActions: "더 보기",
    open: "열기",
    openNewTab: "새 탭에서 열기",
    addFavorite: "즐겨찾기에 추가",
    removeFavorite: "즐겨찾기에서 제거",
    addToPlaylist: "재생목록에 추가…",
    copyLink: "링크 복사",
    downloadScript: "Script 다운로드",
    downloadBlocked: "다운로드 불가",
    downloadBlockedCaption: "유료 script예요",
    // {site} is the partner's own name; the second form covers the entries
    // that arrive without one, and has to read as a whole sentence
    watchOn: "{site}에서 보기",
    watchOnSite: "해당 사이트에서 보기"
  },

  toast: {
    linkCopied: "링크를 복사했어요",
    linkCopyFailed: "링크를 복사하지 못했어요",
    scriptDownloaded: "Script를 다운로드했어요",
    scriptFailedTitle: "Script를 받지 못했어요",
    scriptFailedBody:
      "connection key 값이 틀렸거나 Handy가 온라인 상태가 아니에요. 둘 다 확인한 뒤 다시 시도해 보세요."
  },

  keyDialog: {
    // replaces ConnectionKeyDialog's generic blurb when the key is needed for
    // a script download
    body: "Script는 Handy와 연결돼 있어요. 계속하려면 Handy 앱에 있는 connection key 값을 입력하세요."
  }
};

export default media;
