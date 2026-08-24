import type enUS from "../en-US/common";

// Vocabulary shared by more than one surface. Same admission rule as the
// component menu in ARCHITECTURE.md: a string is promoted here on its
// *second* consumer — a phrase used once belongs in its feature namespace,
// where a translator can see the context it is used in.
//
// Plural messages carry a `{count}` named param instead of vue-i18n's bare
// `{n}`, because the count has to be run through `$n()` first so 15000 reads
// "15,000" in English and "15 000" in Norwegian. Call them as
// `$t("common.count.videos", { count: $n(x) }, x)`.
const common: typeof enUS = {
  action: {
    backToHome: "返回首页",
    browseVideos: "浏览视频",
    cancel: "取消",
    clear: "清除",
    clearFilters: "清除筛选",
    clearSearch: "清除搜索",
    create: "创建",
    delete: "删除",
    done: "完成",
    import: "导入",
    manage: "管理",
    rename: "重命名",
    retry: "重试",
    save: "保存",
    share: "分享"
  },

  state: {
    catalogErrorTitle: "无法加载片库",
    catalogErrorBody: "Script 索引没有响应。检查网络连接后重试。",
    emptyTitle: "暂无内容"
  },

  // "12 of 340 tags" — the shown/total pair every filtered listing prints.
  //
  // One message per noun, rather than a generic "{shown} of {total}" handed a
  // pre-counted total. Japanese, Korean and Chinese attach a counter to *both*
  // numbers and the counter is chosen by the noun (動画→本, タグ→個, 出演者→人),
  // which a shared message cannot express — all four CJK/Slavic reviewers
  // independently reported the generic form as their worst string. Russian
  // needs it too: the noun after the total declines with it.
  //
  // Both numbers arrive bare through `$n()`; the plural branch is chosen by
  // the *total*, not by what is shown.
  ofTotal: {
    videos: "{total} 个视频中的 {shown} 个",
    performers: "{total} 位演员中的 {shown} 位",
    tags: "{total} 个标签中的 {shown} 个"
  },

  count: {
    performers: "{count} 位演员",
    playlists: "{count} 个播放列表",
    requests: "{count} 个请求",
    sites: "{count} 个网站",
    tags: "{count} 个标签",
    videos: "{count} 个视频",
    votes: "{count} 票"
  },

  // Duration is assembled from parts rather than formatted in the service:
  // Norwegian abbreviates hours "t", not "h", and only the message layer
  // knows that. `durationParts()` in services/format.ts picks which key.
  duration: {
    hoursMinutes: "{hours} 小时 {minutes} 分钟",
    hours: "{hours} 小时",
    minutes: "{minutes} 分钟",
    seconds: "{seconds} 秒"
  },

  justNow: "刚刚",

  // Shared by the settings radio group, the browse filters and the header
  // switcher — the same "can't drift apart" reason ORIENTATION_LABELS gave
  // for living in queries.ts, which is where these strings came from.
  orientation: {
    straight: "Straight",
    gay: "Gay",
    trans: "Trans",
    all: "Everything"
  },

  language: {
    label: "语言",
    caption: "选择本站显示的语言",
    system: "跟随浏览器"
  }
};

export default common;
