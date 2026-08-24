import type enUS from "../en-US/tags";

// The tag cloud at /tags: every tag in the visible catalog as a clickable
// pill, searchable and sortable, plus the long index-download wait it sits
// behind and the right-click menu that mutes a tag.
const tags: typeof enUS = {
  title: "タグ",
  errorTitle: "タグを読み込めませんでした",

  // The cloud can't draw a pill until the whole ~40 MB index is in, so the
  // wait gets a phase, a percentage and a reason it's worth it.
  loading: {
    barLabel: "タグを読み込み中",
    // Norwegian puts a space before the percent sign, so this is a message
    // rather than a bare "%" glued on in the template
    percent: "{percent}%",
    downloading: "スクリプトインデックスをダウンロード中",
    parsing: "インデックスを読み込み中",
    noteParsing: "取得完了。タグに整理しています。",
    note: "約{total}MB中{received}MBを展開しました。カタログ全体を一度だけ取得するので、これ以降のページはすぐに開きます。",
    // the expected total is only last visit's size, so an index that grew
    // since gets a line that doesn't print "44 of ~41 MB"
    noteOversize:
      "{received}MBを展開しました。カタログ全体を一度だけ取得します。"
  },

  controls: {
    searchPlaceholder: "タグを検索",
    searchLabel: "タグを検索",
    sortLabel: "タグを並べ替え",
    sortByCount: "動画数順",
    // the alphabet's first and last letter — Norwegian ends at Å
    sortByName: "名前順",
    sortedDescLabel: "降順で表示中。並び順を反転します",
    sortedAscLabel: "昇順で表示中。並び順を反転します",
    sortedDescTitle: "降順で表示中。クリックで反転します",
    sortedAscTitle: "昇順で表示中。クリックで反転します",
    muted: "ミュート中",
    mutedCount: "ミュート中（{count}）"
  },

  empty: {
    searchTitle: "一致するタグがありません",
    searchBody: "「{query}」に一致するものは、インデックスにありません。",
    filteredBody:
      "フィルターとミュート中のタグで、インデックス内のすべてのタグが隠れています。設定で条件を緩めてください。",
    filteredAction: "ミュート中のタグ"
  },

  menu: {
    browse: "このタグの動画を見る",
    mute: "このタグをミュート"
  },

  toast: {
    refusedTitle: "「{tag}」はミュートできません",
    refusedBody:
      "性的指向のタグは、表示するカタログそのものを決めるものです。設定から変更してください。",
    mutedTitle: "「{tag}」をミュートしました",
    mutedBody: "ミュート一覧に追加しました。いつでも解除できます。"
  }
};

export default tags;
