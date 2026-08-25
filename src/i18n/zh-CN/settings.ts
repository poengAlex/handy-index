import type enUS from "../en-US/settings";

// The settings modal and the three dialogs that hang off it: clear-data, the
// first-visit consent gate, and the connection-key prompt. The language
// picker inside settings is `common.language.*`, because the same wording is
// used wherever a locale is offered.
const settings: typeof enUS = {
  title: "设置",

  // the toggle list at the top of the modal
  display: {
    darkModeLabel: "深色模式",
    darkModeCaption: "使用深色主题",
    nsfwLabel: "露骨预览",
    nsfwCaption: "显示真实封面，而不是中性占位图",
    playersLabel: "内嵌播放器",
    playersCaption: "直接在视频页播放 Pornhub 和 xHamster 的视频",
    fullWidthLabel: "全宽布局",
    fullWidthCaption: "铺满整个屏幕，而不是居中单栏",
    backgroundLabel: "动态背景",
    backgroundCaption: "在每个页面背后显示柔和的流动渐变"
  },

  // The muted-tags row. `caption` pluralizes over the count itself rather
  // than taking a pre-counted noun phrase: Bokmål inflects the adjective with
  // the noun ("1 dempet tagg" / "2 dempede tagger"), which a `{tags}` slot
  // cannot express
  // ("3 tags") rather than a bare number, so the pluralization stays in
  // `common.count.tags` and this message only carries the verb.
  muted: {
    label: "已屏蔽标签",
    caption: "已屏蔽 {count} 个标签",
    empty: "未屏蔽任何标签"
  },

  backgroundSceneTitle: "背景样式",
  orientationTitle: "取向",

  access: {
    title: "访问权限",
    premiumScriptsLabel: "付费 scripts",
    premiumScriptsCaption: "包含 script 需在合作网站付费的视频",
    premiumVideosLabel: "付费视频",
    premiumVideosCaption: "包含需在合作网站付费的视频"
  },

  previews: {
    title: "卡片预览",
    hint: "把鼠标悬停在卡片上，或用手指划过卡片，就能预览。点一下速度名称即可恢复默认。",
    imageSpeed: "图片速度",
    clipSpeed: "片段速度"
  },

  // shared by the settings field and the connection-key prompt
  connectionKey: {
    label: "Connection key",
    placeholder: "例如 a1B2c3D4e5",
    hint: "你的 Handy connection key，下载 scripts 时使用。"
  },

  clearDataAction: "清除数据…",

  // ClearDataDialog. Every row names its own toast instead of sharing one
  // "{thing} cleared" template: the verb already differs per row in English
  // (a key is deleted, preferences are reset), and more so in Norwegian.
  clear: {
    title: "清除已存数据",
    lead: "本站记住的一切都存在这个浏览器里。可以逐项清除，也可以一次全清。",
    clearAll: "清除全部数据",
    allToast: "已清除全部本地数据",

    recentLabel: "最近观看",
    recentToast: "已清除最近观看",
    favoritesLabel: "收藏",
    favoritesToast: "已清除收藏",
    playlistsLabel: "播放列表",
    playlistsToast: "已清除播放列表",
    mutedToast: "已清除屏蔽标签",

    // the two halves of the ratings row's caption, printed side by side
    votesLabel: "评分与投票",
    votesEmpty: "没有记录",
    votesToast: "已清除评分和投票",
    ratingCount: "{count} 个 script 评分",
    requestVoteCount: "{count} 个请求投票",

    keySaved: "已保存在本设备",
    keyUnset: "未设置",
    keyToast: "已清除 connection key",

    preferencesLabel: "浏览偏好",
    preferencesCaption: "露骨预览、取向、访问权限筛选、预览速度、背景",
    preferencesToast: "已重置浏览偏好"
  },

  // ConsentDialog — the first-visit age gate. Legally load-bearing: every
  // condition the English states has to survive into every translation.
  consent: {
    title: "浏览之前",
    body:
      "IVDB 收录带有 The Handy 动作 scripts 的互动成人视频。确认你已年满 18 周岁，" +
      "才能在浏览时看到露骨预览。不确认也可以继续，预览会保持隐藏——" +
      "随时可以在设置里更改。你的偏好只保存在这个浏览器里。",
    decline: "不看预览，继续",
    accept: "我已年满 18 周岁"
  },

  // ConnectionKeyDialog — shown when an action needs a key that isn't set
  keyPrompt: {
    title: "需要 connection key",
    body: "此操作与你的 Handy 绑定。输入 Handy 应用里的 connection key 以继续。",
    hint: "密钥要生效，Handy 必须开机并联网——设备离线的报错和密钥错误一模一样。",
    save: "保存并继续"
  }
};

export default settings;
