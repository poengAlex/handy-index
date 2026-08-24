import type enUS from "../en-US/gates";

// Why the catalog is smaller than the index: the disclosure line under every
// listing (`notice`) and the muted-tag manager it opens (`muted`).
//
// `notice` carries two phrasings of the same four reasons on purpose. A lone
// reason is a whole sentence and says the noun ("7,468 videos hidden by muted
// tags"); once a total leads the line the noun has already been said, so each
// reason after it is a bare clause ("1,816 by the Straight filter"). Both
// receive `{count}` pre-formatted — the sentence form through
// `useFormat().count("videos", n)`, the clause form through `$n()`.
const gates: typeof enUS = {
  notice: {
    hiddenByMuted: "屏蔽标签隐藏了 {count}",
    hiddenByOrientation: "取向筛选（{orientation}）隐藏了 {count}",
    hiddenByScript: "付费 script 筛选隐藏了 {count}",
    hiddenByVideo: "付费视频筛选隐藏了 {count}",

    hiddenTotal: "已隐藏 {count}",
    byMuted: "屏蔽标签：{count}",
    byOrientation: "取向筛选（{orientation}）：{count}",
    byScript: "付费 script 筛选：{count}",
    byVideo: "付费视频筛选：{count}"
  },

  muted: {
    title: "已屏蔽标签",
    lead:
      "被屏蔽的标签会从片库里消失——浏览、搜索、首页各行和相关视频都会跳过它们。" +
      "匹配是精确的，屏蔽“gay”不会连带屏蔽“gay massage”。收藏和播放列表是你自己的，原样保留。",

    // the tag picker, and the cost printed under every option in it
    pickerLabel: "屏蔽一个标签",
    pickerEmpty: "没有匹配的标签",
    costNone: "可见视频里一个都没有",
    costLine: "{count} · 占可见的 {share}",
    // a share small enough to round to zero still isn't nothing, so it gets
    // its own reading rather than "0%"
    percent: "{value}%",
    percentTiny: "<1%",

    // the inline confirm a tag heavy enough to take a tenth of the catalog
    // has to pass first
    confirmBody:
      "“{tag}”出现在 {count} 中——占你当前可见内容的 {share}。屏蔽后，" +
      "它们会从浏览、搜索、首页各行和相关视频中全部消失。",
    confirmMute: "仍然屏蔽",

    chipUnmuteAria: "取消屏蔽标签：{tag}",
    empty: "还没有屏蔽任何标签。在上面挑一个，带该标签的视频就会全部离开片库。",
    unmuteAll: "全部取消屏蔽",

    toastMutedTitle: "已屏蔽“{tag}”",
    toastMutedBody: "已隐藏 {count}",
    toastUnmutedAll: "已取消屏蔽所有标签"
  }
};

export default gates;
