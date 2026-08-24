import type enUS from "../en-US/nav";

// The app shell: header toolbar, main nav row, mobile drawer and the header's
// orientation switcher. Every link label here is rendered twice — once in the
// desktop nav, once in the drawer — from a single list.
const nav: typeof enUS = {
  // Landmark and icon-button labels a screen reader reads out. `homeAria`
  // names the logo link's destination; IVDB is a proper noun, not translated.
  menuAria: "メニュー",
  homeAria: "IVDBホーム",
  mainNavAria: "メイン",
  settingsAria: "設定",

  links: {
    home: "ホーム",
    videos: "動画",
    tags: "タグ",
    sites: "サイト",
    performers: "出演者",
    playlists: "プレイリスト",
    requests: "リクエスト",
    favorites: "お気に入り",
    history: "最近見た動画",
    help: "ヘルプと機能",
    privacy: "プライバシー"
  },

  // The mute badge in the toolbar, as both tooltip and aria-label. Two
  // shapes: before anything is hidden it can only name the gate, after that
  // it leads with the cost — "1 tag muted" reads as trivia, the video figure
  // is the part that surprises you. `mutedTags` is not a duplicate of
  // `common.count.tags`: the adjective inflects with the noun in Norwegian
  // ("1 dempet tagg" / "2 dempede tagger"), so it has to plural together.
  // `{tags}` receives the whole muted-tag phrase, so word order stays with
  // the translator.
  mutedTags: "ミュート中のタグ{count}個",
  mutedHidden: "動画{count}本を非表示（{tags}）",

  orientation: {
    aria: "性的指向：{value}",
    header: "表示する内容"
  }
};

export default nav;
