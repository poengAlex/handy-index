import type enUS from "../en-US/media";

// The shared media primitives — the catalog tile every listing renders, its
// right-click quick menu, and the toasts that menu raises. The tile's own
// text (title, partner name) is catalog data and is never translated; what
// lives here is the chrome around it.
const media: typeof enUS = {
  card: {
    // accessible name for an entry the index published without a title
    fallbackTitle: "视频",
    // the star rating printed beside the tile caption — "★ 92%"
    rating: "★ {rating}%"
  },

  menu: {
    open: "打开",
    openNewTab: "在新标签页打开",
    addFavorite: "加入收藏",
    removeFavorite: "取消收藏",
    addToPlaylist: "添加到播放列表…",
    copyLink: "复制链接",
    downloadScript: "下载脚本",
    downloadBlocked: "无法下载",
    downloadBlockedCaption: "这是付费脚本",
    // {site} is the partner's own name; the second form covers the entries
    // that arrive without one, and has to read as a whole sentence
    watchOn: "在 {site} 观看",
    watchOnSite: "在原网站观看"
  },

  toast: {
    linkCopied: "链接已复制",
    linkCopyFailed: "无法复制链接",
    scriptDownloaded: "脚本已下载",
    scriptFailedTitle: "无法获取脚本",
    scriptFailedBody:
      "连接密钥有误，或者 Handy 不在线。两者都检查一遍，然后重试。"
  },

  keyDialog: {
    // replaces ConnectionKeyDialog's generic blurb when the key is needed for
    // a script download
    body: "脚本与你的 Handy 绑定。输入 Handy 应用里的连接密钥以继续。"
  }
};

export default media;
