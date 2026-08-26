import type enUS from "../en-US/browse";

// The browse + search page (/videos): the toolbar above the grid, the
// active-filter chips, the advanced-filters modal, and one empty state per
// reason the grid can come back empty (a muted tag, the orientation gate,
// or plain over-filtering).
const browse: typeof enUS = {
  title: "视频",

  toolbar: {
    searchPlaceholder: "搜索标题",
    searchAria: "按标题搜索视频",
    sortAria: "视频排序",
    // The flip button names the direction the list is *in*, then what a
    // click would do — four flat keys rather than a sentence assembled from
    // a direction word, which would strand the translator.
    dirDescAria: "当前降序——反转",
    dirAscAria: "当前升序——反转",
    dirDescTitle: "当前降序——点击反转",
    dirAscTitle: "当前升序——点击反转",
    filters: "筛选",
    filtersCount: "筛选（{count}）",
    shareAria: "分享这份结果——链接带着全部筛选条件"
  },

  // The sort dropdown. Keyed by SortKey so the option list can stay a
  // module constant holding keys instead of English.
  sort: {
    recent: "最近添加",
    updated: "最近更新",
    top: "评分最高",
    plays: "播放最多",
    views: "观看最多",
    longest: "时长最长",
    title: "A–Z"
  },

  chip: {
    // {label} is catalog data — a tag, a site name, a performer name
    removeAria: "移除筛选：{label}",
    // stand-ins for a filtered id whose name isn't in the loaded catalog
    partnerFallback: "合作网站",
    performerFallback: "演员"
  },

  filters: {
    title: "筛选",
    addTag: "添加标签",
    noTags: "没有匹配的标签",
    site: "网站",
    noSites: "没有匹配的网站",
    performer: "演员",
    noPerformers: "没有匹配的演员",
    // one row of any picker: the tag, site or performer name, then how
    // many videos picking it would leave on screen
    option: "{name}（{count}）",
    vrLabel: "仅 VR",
    vrCaption: "只显示 VR 视频",
    orientation: "取向",
    access: "访问权限",
    premiumScriptsLabel: "付费 scripts",
    premiumScriptsCaption: "包含需在合作网站付费的 scripts",
    premiumVideosLabel: "付费视频",
    premiumVideosCaption: "包含需在合作网站付费的视频",
    mutedLabel: "已屏蔽标签",
    mutedNone: "未屏蔽任何标签",
    // {tags} is a comma-joined list of the first few muted tags
    mutedMore: "{tags} 等另外 {rest} 个",
    duration: "时长",
    durationAny: "不限",
    durationFrom: "{min} 分钟以上",
    durationRange: "{min}–{max} 分钟"
  },

  empty: {
    // A muted tag arriving via ?tag= empties the grid and no filter change
    // can fix it, so the one-tag case names the tag it is talking about.
    mutedOneTitle: "“{tag}”已屏蔽",
    mutedOneBody: "带这个标签的视频在全站都会隐藏。取消屏蔽才能看到这些结果。",
    mutedOneAction: "取消屏蔽“{tag}”",
    mutedManyTitle: "其中有些标签已被屏蔽",
    mutedManyBody: "带这些标签的视频在全站都会隐藏。取消屏蔽才能看到这些结果。",
    mutedManyAction: "取消屏蔽这些标签",
    // {orientation} comes from common.orientation.* via useFormat()
    orientationTitle: "当前取向（{orientation}）下没有内容",
    // one sentence, not a count phrase glued to a clause: the verb agrees
    // with the count in English and the word order differs in Norwegian
    orientationBody:
      "这里有 {count} 个视频符合你设置的其他全部条件，只是不符合取向筛选（{orientation}）。",
    orientationAction: "显示所有取向",
    noneTitle: "没有匹配的视频",
    noneBody: "所有视频都被筛掉了。放宽搜索，或者去掉几个筛选条件。",
    noneAction: "清除全部筛选"
  },

  share: {
    // {count} arrives already localized and pluralized as "12 videos"
    // (useFormat().count), so this message only decides where it sits
    title: "IVDB — {count}",
    fallbackTitle: "IVDB 视频",
    copiedTitle: "链接已复制",
    copiedBody: "它带着你设置的全部筛选条件。",
    failedTitle: "无法复制链接"
  }
};

export default browse;
