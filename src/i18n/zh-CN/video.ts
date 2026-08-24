import type enUS from "../en-US/video";

// The video detail page — the biggest single surface in the app: the hero and
// its chips, the action row, the opt-in partner player, the tag strip, the
// details card, the star rating, the stills gallery and its full-size viewer,
// script comments, the "more like this" shelves, and a toast for every
// outcome each of those can produce.
const video: typeof enUS = {
  missingTitle: "未找到视频",
  missingBody: "该视频已不在索引中，或者链接有误。",

  // Stand-ins for catalog fields the index published empty. They are read
  // out loud (alt text, an iframe title) or land mid-sentence, so each one
  // has to work in the slot it fills — "Watch on the site" (the same reading
  // media.ts gives an unnamed partner), "Still 3 from Video".
  fallback: {
    video: "视频",
    player: "视频播放器",
    site: "原网站",
    thisSite: "该网站"
  },

  hero: {
    premiumChip: "付费脚本"
  },

  action: {
    getScript: "获取脚本",
    // {site} is the partner's own name, or `fallback.site` when it has none
    watchOn: "在 {site} 观看",
    addFavorite: "加入收藏",
    removeFavorite: "取消收藏",
    addToPlaylist: "添加到播放列表",
    report: "举报此视频"
  },

  premiumNote: "此视频的脚本为付费内容——它随合作网站上的视频一同提供。",

  playerNote:
    "在 IVDB 上播放时 Handy 不会同步——这里只有画面。下载脚本，用你的 Handy 播放，才能得到同步的动作。",

  tag: {
    unmuteAria: "取消屏蔽标签：{tag}",
    mutedTitle: "“{tag}”已屏蔽——点击取消屏蔽",
    browse: "浏览此标签",
    mute: "屏蔽此标签"
  },

  details: {
    title: "详情",
    script: "脚本",
    free: "免费",
    premium: "付费",
    published: "发布时间",
    duration: "时长",
    format: "格式",
    // the non-VR case: an ordinary 2D video
    formatFlat: "平面",
    site: "网站",
    scriptBy: "脚本作者",
    rating: "评分",
    ratingValue: "{percent}%",
    // {votes} arrives already pluralized from useFormat().count("votes", n)
    ratingWithVotes: "{percent}% · {votes}",
    scriptPlays: "脚本播放次数"
  },

  rate: {
    title: "为此脚本评分",
    community: "社区评分：{percent}%",
    thanks: "感谢你为这个脚本评分",
    errorTitle: "无法保存评分"
  },

  gallery: {
    // the strip is headed "Photos" unless the only thing in it is the
    // partner's roll clip
    photosTitle: "图片",
    previewTitle: "预览",
    previewBadge: "预览",
    clipAria: "全屏播放预览片段",
    photoAria: "打开第 {index} 张图片，共 {total} 张",
    stillAlt: "{title} 的第 {number} 张截图",
    previousPhoto: "上一张",
    nextPhoto: "下一张",
    closeViewer: "关闭查看器",
    // position counter under the full-size viewer — "3 / 12"
    viewerCount: "{index} / {total}"
  },

  comments: {
    title: "评论",
    gateHint: "评论需要连接密钥。",
    gateAction: "添加密钥",
    inputLabel: "写评论",
    submit: "发表",
    errorHint: "无法加载评论。",
    emptyHint: "还没有评论——来做第一个。",
    postedTitle: "评论已提交",
    postedBody: "通过审核后就会显示出来。",
    postErrorTitle: "无法发表评论"
  },

  more: {
    related: "相似视频",
    fromPartner: "{site} 的更多视频"
  },

  // Replaces ConnectionKeyDialog's generic blurb — the reason the key is
  // being asked for differs per action.
  keyPrompt: {
    script: "脚本与你的 Handy 绑定。输入 Handy 应用里的连接密钥以继续。",
    action: "评分和评论与你的 Handy 绑定。输入 Handy 应用里的连接密钥以继续。"
  },

  script: {
    readyTitle: "脚本已就绪",
    readyBody: "下载已在新标签页中打开。",
    errorTitle: "无法获取脚本",
    errorBody: "连接密钥有误，或者 Handy 不在线。两者都检查一遍，然后重试。"
  },

  mute: {
    refusedTitle: "“{tag}”无法屏蔽",
    refusedBody: "取向标签决定你看到哪个片库——到设置里更改。",
    doneTitle: "已屏蔽“{tag}”",
    doneBody: "它已进入你的屏蔽列表——随时可以取消屏蔽。",
    undoneTitle: "已取消屏蔽“{tag}”"
  },

  share: {
    copiedTitle: "链接已复制",
    errorTitle: "无法复制链接"
  },

  // The report button opens a pre-filled mail draft. The reader is the one
  // who finishes and sends it, so the draft is written in their language;
  // the identifying lines keep it useful once it reaches the inbox.
  report: {
    subject: "我要举报一个视频",
    intro: "我要举报一个视频。",
    titleLine: "标题：{title}",
    untitled: "（无标题）",
    idLine: "视频 ID：{id}",
    siteLine: "网站：{site}",
    linkLine: "链接：{link}",
    reasonLine: "举报原因："
  }
};

export default video;
