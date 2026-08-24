import type enUS from "../en-US/library";

// The two personal shelves, both of them local to the visitor's browser:
// /favorites (every hearted video) and /history (recently viewed, plus the
// dialog that empties it).
const library: typeof enUS = {
  favorites: {
    title: "我的收藏",
    // {count} arrives already pluralized from useFormat().count("videos", n),
    // so this message only owns the frame around the noun
    count: "已保存 {count}",
    emptyTitle: "还没有收藏",
    emptyBody: "在任意视频页点一下心形按钮，它就会存到这里，方便随时打开。"
  },

  history: {
    title: "最近观看",
    note: "只存在这个浏览器里——你的观看记录不会被追踪，也不会发送到任何地方。",
    emptyTitle: "还没有看过任何视频",
    emptyBody: "你打开过的视频会记在这里，仅限本设备。",
    clearTitle: "清除最近观看？",
    clearBody: "视频仍在片库里——消失的只是这个浏览器记下的打开列表。",
    clearConfirm: "清除记录",
    clearedToast: "已清除最近观看"
  }
};

export default library;
