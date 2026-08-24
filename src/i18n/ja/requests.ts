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
    title: "接続キーが必要です",
    boardBody:
      "リクエストボードはお使いのHandyに紐付いています。リクエストの閲覧・投稿・投票には、Handyアプリの接続キーを追加してください。",
    queueBody:
      "キューはお使いのHandyに紐付いています。表示するには、Handyアプリの接続キーを追加してください。",
    addAction: "接続キーを追加",
    rejectedTitle: "接続キーが拒否されました",
    rejectedBody:
      "キーが間違っているか、Handyがオンラインになっていません。Handyアプリでキーを確認し、デバイスの電源が入っていて接続されていることを確かめてから、もう一度入力してください。",
    rejectedAction: "キーを再入力",
    boardDialog:
      "リクエストボードはお使いのHandyに紐付いています。続けるには、Handyアプリの接続キーを入力してください。",
    queueDialog:
      "キューはお使いのHandyに紐付いています。続けるには、Handyアプリの接続キーを入力してください。"
  },

  // The voting board page. There are four count messages rather than one
  // stem the render bolts suffixes onto: "of {total}" only appears while
  // filters narrow the list, and the capped note only when the board is
  // longer than the single load we do. `{requests}` arrives already counted
  // and pluralized ("12 requests", from common.count.requests) — move it
  // wherever the sentence wants it.
  board: {
    title: "スクリプトのリクエスト",
    lead: "次にスクリプトを作る動画を投票で決めます。得票数の多いリクエストから順に対応します。",
    queueLink: "キューを見る",
    emptyTitle: "待機中のリクエストはありません",
    emptyBody:
      "現在、投票を受け付けているリクエストはありません。上のフォームから動画をリクエストしてください。",
    errorTitle: "リクエストを読み込めませんでした",
    noMatchBody:
      "その条件に一致するリクエストはボードにありません。条件をゆるめると残りが表示されます。",
    countAll: "{requests}が投票受付中",
    countAllCapped:
      "{requests}が投票受付中（読み込んだ分より多くのリクエストがあります）",
    countFiltered: "{requests}（全{total}件）",
    countFilteredCapped:
      "{requests}（全{total}件・読み込んだ分より多くのリクエストがあります）"
  },

  // The queue page: the same requests, ranked, read-only.
  queue: {
    title: "リクエストキュー",
    lead: "スクリプトを作る順番です。得票数の多いリクエストから作成します。",
    boardLink: "投票ボード",
    emptyTitle: "キューは空です",
    emptyBody:
      "現在、スクリプト待ちのものはありません。投票ボードから動画をリクエストしてください。",
    emptyAction: "リクエストへ移動",
    errorTitle: "キューを読み込めませんでした",
    noMatchBody:
      "その条件に一致するリクエストはキューにありません。条件をゆるめると残りが表示されます。",
    countWaiting: "{requests}が待機中",
    countWaitingCapped:
      "{requests}が待機中（読み込んだ分より多くのリクエストがあります）",
    countFiltered: "{requests}が待機中（全{total}件）",
    countFilteredCapped:
      "{requests}が待機中（全{total}件・読み込んだ分より多くのリクエストがあります）"
  },

  // The submit row on the board, plus the two toasts it can raise.
  submit: {
    title: "動画をリクエスト",
    hint: "スクリプトを作ってほしい動画のリンクを貼り付けてください。確認を通過してから、投票の対象として表示されます。",
    urlLabel: "動画のURL",
    action: "リクエストする",
    sentTitle: "リクエストを送信しました",
    sentBody: "確認を通過してから、投票の対象として表示されます。",
    failedTitle: "リクエストに失敗しました",
    failedBody:
      "スクリプトインデックスがそのURLを受け付けませんでした。もう一度お試しください。"
  },

  // The vote button and its toasts. `failedKeyBody` is the auth case: the key
  // was rotated or the device went offline mid-session.
  vote: {
    action: "投票",
    voted: "投票済み",
    successTitle: "投票を受け付けました",
    successBody: "得票数の多いリクエストから順にスクリプトを作成します。",
    failedTitle: "投票に失敗しました",
    failedKeyBody:
      "キーが間違っているか、Handyがオンラインになっていません。両方を確認して、もう一度入力してください。",
    failedBody:
      "スクリプトインデックスが投票を受け付けませんでした。もう一度お試しください。"
  },

  // One request tile.
  card: {
    untitled: "動画リクエスト",
    openAria: "{name}を開く",
    // the request's place in the scripting order, on a badge with room for
    // about four characters
    rank: "{rank}位"
  },

  // The control row shared by both pages.
  filters: {
    searchPlaceholder: "リクエストを検索",
    searchAria: "タイトルでリクエストを検索",
    sortAria: "リクエストを並べ替え",
    tagLabel: "タグ",
    tagEmpty: "一致するタグがありません",
    // one row of the tag picker: the tag, then how many requests carry it
    tagOption: "{tag}（{count}）",
    removeTagAria: "フィルターを解除：{tag}",
    hideVoted: "投票済みを隠す",
    hideVotedTitle: "すでに投票したリクエストを隠します",
    emptyTitle: "一致するリクエストがありません"
  },

  // Sort picker. Keys match RequestSortKey.
  sort: {
    votes: "得票数順",
    newest: "新着順",
    longest: "再生時間が長い順",
    title: "タイトル順"
  }
};

export default requests;
