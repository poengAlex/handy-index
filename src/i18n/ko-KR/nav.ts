import type enUS from "../en-US/nav";

// The app shell: header toolbar, main nav row, mobile drawer and the header's
// orientation switcher. Every link label here is rendered twice — once in the
// desktop nav, once in the drawer — from a single list.
const nav: typeof enUS = {
  // Landmark and icon-button labels a screen reader reads out. `homeAria`
  // names the logo link's destination; IVDB is a proper noun, not translated.
  menuAria: "메뉴",
  homeAria: "IVDB 홈",
  mainNavAria: "주 메뉴",
  settingsAria: "설정",

  backToTop: "맨 위로",

  links: {
    home: "홈",
    videos: "동영상",
    tags: "태그",
    sites: "사이트",
    performers: "출연자",
    playlists: "재생목록",
    requests: "요청",
    favorites: "즐겨찾기",
    history: "최근 본 동영상",
    help: "도움말 및 기능",
    privacy: "개인정보"
  },

  // The mute badge in the toolbar, as both tooltip and aria-label. Two
  // shapes: before anything is hidden it can only name the gate, after that
  // it leads with the cost — "1 tag muted" reads as trivia, the video figure
  // is the part that surprises you. `mutedTags` is not a duplicate of
  // `common.count.tags`: the adjective inflects with the noun in Norwegian
  // ("1 dempet tagg" / "2 dempede tagger"), so it has to plural together.
  // `{tags}` receives the whole muted-tag phrase, so word order stays with
  // the translator.
  mutedTags: "차단한 태그 {count}개",
  mutedHidden: "{tags} 때문에 동영상 {count}개 숨김",

  orientation: {
    aria: "성향: {value}",
    header: "보고 싶은 것"
  }
};

export default nav;
