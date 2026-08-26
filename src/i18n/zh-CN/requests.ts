import type enUS from "../en-US/requests";

// The community side of the catalog: the voting board (submit a video URL,
// upvote what should get scripted next) and the queue that shows the same
// requests in scripting order. Both are gated on the Handy connection key,
// which is why `key.*` carries a body per surface — the sentence names the
// thing you were trying to reach.
const requests: typeof enUS = {
  // Connection-key gate and the two failure states behind it. Shown by both
  // pages; only the body differs.
  key: {
    title: "需要 connection key",
    boardBody:
      "请求榜与你的 Handy 绑定。添加 Handy 应用里的 connection key，即可查看请求、提交请求并投票。",
    queueBody:
      "队列与你的 Handy 绑定。添加 Handy 应用里的 connection key 即可查看。",
    addAction: "添加 connection key",
    rejectedTitle: "Connection key 被拒绝",
    rejectedBody:
      "密钥有误，或者 Handy 不在线。在 Handy 应用里核对密钥，确认设备已开机并联网，然后重新输入。",
    rejectedAction: "重新输入密钥",
    boardDialog:
      "请求榜与你的 Handy 绑定。输入 Handy 应用里的 connection key 以继续。",
    queueDialog:
      "队列与你的 Handy 绑定。输入 Handy 应用里的 connection key 以继续。"
  },

  // The voting board page. There are four count messages rather than one
  // stem the render bolts suffixes onto: "of {total}" only appears while
  // filters narrow the list, and the capped note only when the board is
  // longer than the single load we do. `{requests}` arrives already counted
  // and pluralized ("12 requests", from common.count.requests) — move it
  // wherever the sentence wants it.
  board: {
    title: "Script 请求",
    lead: "投票决定接下来给哪些视频做 script——票数最高的先做。",
    queueLink: "查看队列",
    emptyTitle: "没有等待中的请求",
    emptyBody: "现在没有可投票的请求。在上方请求一个视频，让队列动起来。",
    errorTitle: "无法加载请求",
    noMatchBody: "榜上没有符合这些筛选条件的请求。放宽条件就能看到其余的。",
    countAll: "{requests}正在等待投票",
    countAllCapped: "{requests}正在等待投票（榜单未全部加载）",
    countFiltered: "{requests}，共 {total} 个",
    countFilteredCapped: "{requests}，共 {total} 个（榜单未全部加载）"
  },

  // The queue page: the same requests, ranked, read-only.
  queue: {
    title: "请求队列",
    lead: "制作顺序：票数最高的请求最先做 script。",
    boardLink: "投票榜",
    emptyTitle: "队列为空",
    emptyBody:
      "现在没有等着做 script 的视频。到投票榜请求一个视频，让队列动起来。",
    emptyAction: "前往请求页",
    errorTitle: "无法加载队列",
    noMatchBody: "队列里没有符合这些筛选条件的请求。放宽条件就能看到其余的。",
    countWaiting: "{requests}正在等待",
    countWaitingCapped: "{requests}正在等待（队列未全部加载）",
    countFiltered: "{requests}正在等待，共 {total} 个",
    countFilteredCapped: "{requests}，共 {total} 个（队列未全部加载）"
  },

  // The submit row on the board, plus the two toasts it can raise.
  submit: {
    title: "请求视频",
    hint: "粘贴一个你希望有 script 的视频链接。它要先通过核验，才会出现在投票列表里。",
    urlLabel: "视频 URL",
    action: "提交请求",
    sentTitle: "请求已发送",
    sentBody: "它要先通过核验，才会出现在投票列表里。",
    failedTitle: "请求发送失败",
    failedBody: "Script 索引没有接受这个 URL。再试一次。"
  },

  // The vote button and its toasts. `failedKeyBody` is the auth case: the key
  // was rotated or the device went offline mid-session.
  vote: {
    action: "投票",
    voted: "已投票",
    successTitle: "投票已计入",
    successBody: "票数最高的请求最先做 script。",
    failedTitle: "投票失败",
    failedKeyBody:
      "密钥有误，或者 Handy 不在线——两者都检查一遍，然后重新输入。",
    failedBody: "Script 索引没有接受这次投票。再试一次。"
  },

  // One request tile.
  card: {
    untitled: "视频请求",
    openAria: "打开 {name}",
    // the request's place in the scripting order, on a badge with room for
    // about four characters
    rank: "#{rank}"
  },

  // The control row shared by both pages.
  filters: {
    searchPlaceholder: "搜索请求",
    searchAria: "按标题搜索请求",
    sortAria: "请求排序",
    tagLabel: "标签",
    tagEmpty: "没有匹配的标签",
    // one row of the tag picker: the tag, then how many requests carry it
    tagOption: "{tag}（{count}）",
    removeTagAria: "移除筛选：{tag}",
    performerLabel: "演员",
    performerEmpty: "没有匹配的演员",
    // one row of the performer picker: who they are, then how many
    // requests name them
    performerOption: "{name}（{count}）",
    removePerformerAria: "移除筛选：{name}",
    hideVoted: "隐藏已投票",
    hideVotedTitle: "隐藏你已经投过票的请求",
    emptyTitle: "没有匹配的请求"
  },

  // Sort picker. Keys match RequestSortKey.
  sort: {
    votes: "票数最多",
    newest: "最新",
    longest: "时长最长",
    title: "A–Z"
  }
};

export default requests;
