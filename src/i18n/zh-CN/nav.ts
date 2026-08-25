import type enUS from "../en-US/nav";

// The app shell: header toolbar, main nav row, mobile drawer and the header's
// orientation switcher. Every link label here is rendered twice — once in the
// desktop nav, once in the drawer — from a single list.
const nav: typeof enUS = {
  // Landmark and icon-button labels a screen reader reads out. `homeAria`
  // names the logo link's destination; IVDB is a proper noun, not translated.
  menuAria: "菜单",
  homeAria: "IVDB 首页",
  mainNavAria: "主导航",
  settingsAria: "设置",

  backToTop: "回到顶部",

  links: {
    home: "首页",
    videos: "视频",
    tags: "标签",
    sites: "网站",
    performers: "演员",
    playlists: "播放列表",
    requests: "请求",
    favorites: "收藏",
    history: "最近观看",
    help: "帮助与功能",
    privacy: "隐私"
  },

  // The mute badge in the toolbar, as both tooltip and aria-label. Two
  // shapes: before anything is hidden it can only name the gate, after that
  // it leads with the cost — "1 tag muted" reads as trivia, the video figure
  // is the part that surprises you. `mutedTags` is not a duplicate of
  // `common.count.tags`: the adjective inflects with the noun in Norwegian
  // ("1 dempet tagg" / "2 dempede tagger"), so it has to plural together.
  // `{tags}` receives the whole muted-tag phrase, so word order stays with
  // the translator.
  mutedTags: "已屏蔽 {count} 个标签",
  mutedHidden: "{tags}，隐藏了 {count} 个视频",

  orientation: {
    aria: "取向：{value}",
    header: "我想看"
  }
};

export default nav;
