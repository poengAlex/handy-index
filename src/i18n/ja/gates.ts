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
    hiddenByMuted: "{count}をミュート中のタグで非表示",
    hiddenByOrientation: "{count}を「{orientation}」フィルターで非表示",
    hiddenByScript: "{count}を有料スクリプトのフィルターで非表示",
    hiddenByVideo: "{count}を有料動画のフィルターで非表示",

    hiddenTotal: "{count}を非表示",
    byMuted: "ミュート中のタグ：{count}本",
    byOrientation: "「{orientation}」フィルター：{count}本",
    byScript: "有料スクリプトのフィルター：{count}本",
    byVideo: "有料動画のフィルター：{count}本"
  },

  muted: {
    title: "ミュート中のタグ",
    lead:
      "ミュートしたタグはカタログから消えます。一覧・検索・各行・関連動画の" +
      "すべてで除外されます。照合は完全一致なので、「gay」をミュートしても" +
      "「gay massage」はミュートされません。お気に入りとプレイリストは" +
      "あなたのものなので、そのまま残ります。",

    // the tag picker, and the cost printed under every option in it
    pickerLabel: "タグをミュート",
    pickerEmpty: "一致するタグがありません",
    costNone: "表示中の動画には該当なし",
    costLine: "{count}・表示中の{share}",
    // a share small enough to round to zero still isn't nothing, so it gets
    // its own reading rather than "0%"
    percent: "{value}%",
    percentTiny: "1%未満",

    // the inline confirm a tag heavy enough to take a tenth of the catalog
    // has to pass first
    confirmBody:
      "「{tag}」は{count}に付いています。現在表示できるものの{share}です。" +
      "ミュートすると、一覧・検索・各行・関連動画のすべてから" +
      "外れます。",
    confirmMute: "それでもミュート",

    chipUnmuteAria: "タグのミュートを解除：{tag}",
    empty:
      "まだ何もミュートしていません。上でタグを選ぶと、そのタグが付いた" +
      "動画はすべてカタログから外れます。",
    unmuteAll: "すべて解除",

    toastMutedTitle: "「{tag}」をミュートしました",
    toastMutedBody: "{count}を非表示にしました",
    toastUnmutedAll: "すべてのタグのミュートを解除しました"
  }
};

export default gates;
