import type enUS from "../en-US/help";

// The feature tour at /help — one row per capability, grouped the way people
// actually use the site. Every `label` is a short feature name; every
// `caption` is the single sentence sitting under it. Keep captions to one
// sentence: the row truncates nothing, but a second sentence turns the list
// into documentation, which is what this page exists to replace.
const help: typeof enUS = {
  title: "帮助",
  lead: "本站能做的一切，都在这一页。带箭头的条目可以直接跳过去。",

  finding: {
    title: "找视频",
    search: {
      label: "搜索与筛选",
      caption:
        "先搜标题，再按标签、网站、演员、VR 和时长缩小范围——每个筛选条件都写在 URL 里，所以结果可以分享"
    },
    sort: {
      label: "想怎么排就怎么排",
      caption:
        "最近添加、评分最高、播放最多等等——排序旁边的箭头按钮可以反转顺序"
    },
    tags: {
      label: "标签云",
      caption:
        "片库里所有未被你屏蔽的标签，可搜索、可排序——点一下就能筛选浏览页"
    },
    performers: {
      label: "演员",
      caption: "按演员浏览，作品最多的排在最前"
    },
    sites: {
      label: "网站",
      caption: "索引里的每个合作网站，以及它的视频数量"
    }
  },

  library: {
    title: "你的内容库",
    favorites: {
      label: "收藏",
      caption: "给任意视频点个心，随手就能找到——只存在这台设备上"
    },
    playlists: {
      label: "播放列表",
      caption: "用任意视频创建、重命名和整理播放列表"
    },
    transfer: {
      label: "分享、导入与导出播放列表",
      caption:
        "把播放列表变成文件、可复制的 JSON 文本或临时分享链接带走——这三种也都能导入回来"
    },
    bulkDownload: {
      label: "一次获取全部脚本",
      caption: "在播放列表上点一下，就下载里面所有的免费脚本"
    },
    quickMenu: {
      label: "快捷菜单",
      caption:
        "右键（或长按）任意视频缩略图，就能收藏、添加到播放列表、复制链接等等"
    }
  },

  scripts: {
    title: "脚本与你的 Handy",
    free: {
      label: "免费脚本",
      caption: "标着“免费”的视频，用你的 Handy 连接密钥就能下载脚本"
    },
    rate: {
      label: "给脚本评分",
      caption: "在视频页上直接给任意免费脚本打星"
    },
    comments: {
      label: "脚本评论",
      caption: "阅读脚本评论，也可以匿名发表"
    },
    requests: {
      label: "请求视频",
      caption: "为任意视频申请脚本，并投票决定接下来做哪一个"
    }
  },

  personalize: {
    title: "调成你的样子",
    previews: {
      label: "露骨预览",
      caption: "默认关闭——在设置里打开真实封面"
    },
    players: {
      label: "内嵌播放器",
      caption:
        "默认关闭——在视频页上直接看 Pornhub 和 xHamster 的视频（播放不会和 Handy 同步）"
    },
    filters: {
      label: "取向、脚本与视频筛选",
      caption:
        "免费还是付费脚本、免费还是付费视频，以及片子里是谁——在设置里改，或者直接在浏览页的筛选里改"
    },
    mutedTags: {
      label: "已屏蔽标签",
      caption:
        "屏蔽一个标签，带这个标签的视频就全部从片库里消失——右键任意标签，或者在设置里管理这个列表"
    },
    theme: {
      label: "浅色与深色主题",
      caption: "在顶栏切换——全站都跟着你的选择走"
    },
    share: {
      label: "分享",
      caption: "每个视频页、每份筛选结果，都有一个可以分享的链接"
    }
  }
};

export default help;
