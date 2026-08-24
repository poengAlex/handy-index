import type enUS from "../en-US/library";

// The two personal shelves, both of them local to the visitor's browser:
// /favorites (every hearted video) and /history (recently viewed, plus the
// dialog that empties it).
const library: typeof enUS = {
  favorites: {
    title: "お気に入り",
    // {count} arrives already pluralized from useFormat().count("videos", n),
    // so this message only owns the frame around the noun
    count: "{count}を保存済み",
    emptyTitle: "お気に入りはまだありません",
    emptyBody:
      "動画ページのハートボタンを押すと、ここに保存されてすぐに開けます。"
  },

  history: {
    title: "最近見た動画",
    note: "このブラウザにのみ保存されます。閲覧履歴が追跡されたり、どこかへ送信されたりすることはありません。",
    emptyTitle: "まだ何も見ていません",
    emptyBody: "開いた動画はここに記録されます。記録先はこのデバイスだけです。",
    clearTitle: "最近見た動画を消去しますか？",
    clearBody:
      "動画自体はカタログに残ります。消えるのは、このブラウザに記録された閲覧リストだけです。",
    clearConfirm: "履歴を消去",
    clearedToast: "最近見た動画を消去しました"
  }
};

export default library;
