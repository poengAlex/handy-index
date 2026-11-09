import type enUS from "../en-US/home";

// The front page: the featured hero at the top, the config-driven carousel
// shelves under it, and the confirm dialog behind the recently-viewed
// shelf's clear icon. Shelf titles are row headers in a tight horizontal
// strip — keep them short.
const home: typeof enUS = {
  oldSite: "IVDB v2 已上线。想用旧版？旧版仍可在 {link} 访问。",

  hero: {
    kicker: "精选",
    /** alt text when the featured video has no title of its own */
    alt: "精选视频",
    cta: "查看视频",
    emptyTitle: "没有可精选的内容"
  },

  // One sentence, two places: under the empty hero and under the empty shelf
  // list. Both are the same "you filtered the catalog away" state.
  filteredOutBody: "你的筛选和屏蔽标签把整个片库都藏了起来。到设置里放宽一些。",

  // The line between the hero and the first shelf. Both counts are the whole
  // index, not the visitor's filtered view: they describe the database, and a
  // number that moved with the orientation switch would read as a bug.
  // {count} arrives as an emphasised, already-localized number; {month} is the
  // month alone ("September"), so the sentence supplies the preposition.
  stats: {
    total: "{count} 个 script",
    /** the previous calendar month, by the day each video went live */
    lastMonth: "{month}新增 {count} 个"
  },

  rows: {
    recent: "最近添加",
    favorites: "我的收藏",
    recentlyViewed: "最近观看",
    /** help-icon tooltip on the recently-viewed shelf */
    recentlyViewedHint:
      "只存在这个浏览器里——你的观看记录不会被追踪，也不会发送到任何地方。",
    /** delete-icon tooltip on the same shelf */
    recentlyViewedClear: "清除最近观看",
    /** {tag} is a catalog tag and stays untranslated */
    becauseYouLike: "因为你喜欢 {tag}",
    topRated: "评分最高",
    mostPlayed: "播放最多",
    updated: "最近更新"
  },

  clearHistory: {
    title: "清除最近观看？",
    body: "视频仍在片库里——消失的只是这个浏览器记下的打开列表。",
    confirm: "清除记录",
    done: "已清除最近观看"
  }
};

export default home;
