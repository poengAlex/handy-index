import type enUS from "../en-US/tags";

// The tag cloud at /tags: every tag in the visible catalog as a clickable
// pill, searchable and sortable, plus the long index-download wait it sits
// behind and the right-click menu that mutes a tag.
const tags: typeof enUS = {
  title: "标签",
  errorTitle: "无法加载标签",

  // The cloud can't draw a pill until the whole ~40 MB index is in, so the
  // wait gets a phase, a percentage and a reason it's worth it.
  loading: {
    barLabel: "正在加载标签",
    // Norwegian puts a space before the percent sign, so this is a message
    // rather than a bare "%" glued on in the template
    percent: "{percent}%",
    downloading: "正在下载 script 索引",
    parsing: "正在读取索引",
    noteParsing: "全部到齐——正在整理成标签。",
    note: "已解压 {received} / 约 {total} MB——整个片库只取一次，之后每一页都是秒开。",
    // the expected total is only last visit's size, so an index that grew
    // since gets a line that doesn't print "44 of ~41 MB"
    noteOversize: "已解压 {received} MB——整个片库只取一次。"
  },

  controls: {
    searchPlaceholder: "搜索标签",
    searchLabel: "搜索标签",
    sortLabel: "标签排序",
    sortByCount: "视频最多",
    // the alphabet's first and last letter — Norwegian ends at Å
    sortByName: "A–Z",
    sortedDescLabel: "当前降序——反转",
    sortedAscLabel: "当前升序——反转",
    sortedDescTitle: "当前降序——点击反转",
    sortedAscTitle: "当前升序——点击反转",
    muted: "已屏蔽",
    mutedCount: "已屏蔽（{count}）"
  },

  empty: {
    searchTitle: "没有匹配的标签",
    searchBody: "索引里没有匹配“{query}”的内容。",
    filteredBody:
      "你的筛选和屏蔽标签把索引里的标签全藏了起来。到设置里放宽一些。",
    filteredAction: "已屏蔽标签"
  },

  menu: {
    browse: "浏览此标签",
    mute: "屏蔽此标签"
  },

  toast: {
    refusedTitle: "“{tag}”无法屏蔽",
    refusedBody: "取向标签决定你看到哪个片库——到设置里更改。",
    mutedTitle: "已屏蔽“{tag}”",
    mutedBody: "它已进入你的屏蔽列表——随时可以取消屏蔽。"
  }
};

export default tags;
