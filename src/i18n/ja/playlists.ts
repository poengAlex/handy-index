import type enUS from "../en-US/playlists";

// The three playlist surfaces: the overview page, one playlist's own page
// (rename, delete, share/export, bulk script download) and the "add to
// playlist" dialog on a video.
//
// Playlist names are the user's own words — they are interpolated as {name}
// and never translated. Counts of playlists and videos come from
// `useFormat().count()`, so they are not repeated here.
const playlists: typeof enUS = {
  title: "プレイリスト",

  // the create row on the overview page and inside the add dialog
  newLabel: "新しいプレイリスト",
  newPlaceholder: "例：週末のおすすめ",
  nameLabel: "プレイリスト名",
  importHint: "このサイトから書き出したプレイリストを読み込みます",

  emptyTitle: "プレイリストはまだありません",
  emptyBody:
    "ここで作成するか、動画ページのプレイリストボタンから、気に入った動画をもとに作成できます。",

  import: {
    title: "プレイリストを読み込む",
    placeholder:
      "書き出したプレイリスト（JSON）またはpastes.devのリンクを貼り付けてください",
    inputAria: "プレイリストの書き出しテキストまたは共有リンク",
    chooseFile: "ファイルを選択…",
    // The name an export gets when the file carried none. It becomes the
    // playlist's name, so write a name, not a sentence.
    defaultName: "読み込んだプレイリスト",
    doneTitle: "プレイリストを読み込みました",
    doneBody: "「{name}」：動画{count}本。",
    failedTitle: "読み込めませんでした",
    // One key per `PlaylistImportFailure` in services/playlist-transfer.ts,
    // plus `unknown` for a throw from somewhere else entirely.
    error: {
      unreachable: "共有リンクのサービスに接続できませんでした。",
      linkDead:
        "その共有リンクは応答しません。期限が切れている可能性があります。",
      notJson: "そのファイルは有効なJSONではありません。",
      notExport: "そのファイルはプレイリストの書き出しではありません。",
      tooNew:
        "そのファイルは、このサイトの新しいバージョンで書き出されたものです。ページを再読み込みして、もう一度試してください。",
      malformed: "そのファイルに入っているプレイリストの形式が壊れています。",
      unknown: "書き出しデータの読み取り中に問題が発生しました。"
    }
  },

  // one playlist's page
  detail: {
    notFoundTitle: "プレイリストが見つかりません",
    notFoundBody:
      "このプレイリストはすでに存在しないか、リンクが間違っています。",
    notFoundAction: "プレイリスト一覧",
    emptyTitle: "まだ何もありません",
    emptyBody: "動画ページのプレイリストボタンから、ここに動画を追加できます。",
    // toggles the grid into remove-a-video mode; "Done" turns it back off
    edit: "編集",
    removeVideo: "プレイリストから削除",
    renameTitle: "プレイリスト名を変更",
    deleteTitle: "「{name}」を削除しますか？",
    deleteBody:
      "動画自体はカタログに残ります。なくなるのはプレイリストだけです。",
    deleteConfirm: "プレイリストを削除",
    deletedTitle: "プレイリストを削除しました",
    deletedBody: "「{name}」はなくなりました。"
  },

  // share dialog: the export as JSON text, as a file, or as a paste link
  share: {
    title: "プレイリストを共有",
    open: "プレイリストを共有",
    openHint: "このプレイリストを共有・書き出しします",
    exportAria: "プレイリストの書き出しJSON",
    linkAria: "共有リンク",
    copyLink: "共有リンクをコピー",
    note: "リンクを知っている人は誰でも、このプレイリストを読み込めます。共有リンクは一時的なもので、約90日で期限切れになります。",
    copyJson: "JSONをコピー",
    saveFile: "ファイルに保存",
    createLink: "共有リンクを作成",
    newLink: "新しい共有リンク",
    jsonCopied: "JSONをコピーしました",
    jsonCopyFailed: "JSONをコピーできませんでした",
    linkCopied: "共有リンクをコピーしました",
    linkCopiedBody:
      "リンクを知っている人は誰でも、このプレイリストを読み込めます。",
    linkCopyFailed: "リンクをコピーできませんでした",
    linkCreated: "共有リンクを作成しました",
    linkFailedTitle: "共有リンクを作成できませんでした",
    linkFailedBody:
      "共有リンクのサービスが応答しませんでした。代わりにJSONをコピーしてください。"
  },

  // downloading every free script in the playlist, one after another
  bulk: {
    label: "Scriptをすべて取得（{count}）",
    progress: "取得中 {done}/{total}…",
    keyPrompt:
      "ScriptはHandyに紐付いています。続けるには、Handyアプリのconnection keyを入力してください。",
    // the explanation under this title is the shared one from
    // `services.scriptDownload.*` — same failure, same words as everywhere else
    failedTitle: "Scriptを取得できませんでした",
    doneTitle: "Scriptをダウンロードしました",
    doneBody: "Script{count}件を保存しました。",
    // both counts in one sentence: the split between them is not the same
    // shape in every language
    partialBody: "{saved}件を保存、{failed}件が失敗しました。"
  },

  // the dialog a video page opens to file that video
  add: {
    title: "プレイリストに追加",
    empty: "プレイリストはまだありません。下から最初の1つを作成してください。"
  }
};

export default playlists;
