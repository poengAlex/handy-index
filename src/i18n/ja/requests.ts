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
    title: "Connection keyが必要です",
    boardBody:
      "投票ページはHandyに紐付いています。リクエストの閲覧・投稿・投票には、Handyアプリのconnection keyを追加してください。",
    queueBody:
      "順番待ちの一覧はHandyに紐付いています。表示するには、Handyアプリのconnection keyを追加してください。",
    addAction: "Connection keyを追加",
    rejectedTitle: "Connection keyが拒否されました",
    rejectedBody:
      "キーが間違っているか、Handyがオンラインになっていません。Handyアプリでキーを確認し、デバイスの電源が入っていて接続されていることを確かめてから、もう一度入力してください。",
    rejectedAction: "キーを再入力",
    boardDialog:
      "投票ページはHandyに紐付いています。続けるには、Handyアプリのconnection keyを入力してください。",
    queueDialog:
      "順番待ちの一覧はHandyに紐付いています。続けるには、Handyアプリのconnection keyを入力してください。"
  },

  // The voting board page. There are four count messages rather than one
  // stem the render bolts suffixes onto: "of {total}" only appears while
  // filters narrow the list, and the capped note only when the board is
  // longer than the single load we do. `{requests}` arrives already counted
  // and pluralized ("12 requests", from common.count.requests) — move it
  // wherever the sentence wants it.
  board: {
    title: "Scriptのリクエスト",
    lead: "次にscriptを作る動画を投票で決めます。得票数の多いリクエストから順に対応します。",
    queueLink: "順番待ちを見る",
    emptyTitle: "待機中のリクエストはありません",
    emptyBody:
      "現在、投票を受け付けているリクエストはありません。上のフォームから動画をリクエストしてください。",
    errorTitle: "リクエストを読み込めませんでした",
    noMatchBody:
      "投票ページには、その条件に一致するリクエストがありません。条件を緩めると残りが表示されます。",
    countAll: "{requests}が投票受付中",
    countAllCapped:
      "{requests}が投票受付中（読み込んだ分より多くのリクエストがあります）",
    countFiltered: "{requests}（全{total}件）",
    countFilteredCapped:
      "{requests}（全{total}件・読み込んだ分より多くのリクエストがあります）"
  },

  // The queue page: the same requests, ranked, read-only.
  queue: {
    title: "リクエストの順番待ち",
    lead: "Scriptを作る順番です。得票数の多いリクエストから作成します。",
    boardLink: "投票ページ",
    emptyTitle: "順番待ちはありません",
    emptyBody:
      "現在、scriptの作成を待っているものはありません。投票ページから動画をリクエストしてください。",
    emptyAction: "リクエストへ移動",
    errorTitle: "順番待ちを読み込めませんでした",
    noMatchBody:
      "順番待ちには、その条件に一致するリクエストがありません。条件を緩めると残りが表示されます。",
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
    hint: "Scriptを作ってほしい動画のリンクを貼り付けてください。確認を通過してから、投票の対象として表示されます。",
    urlLabel: "動画のURL",
    action: "リクエストする",
    sentTitle: "リクエストを送信しました",
    sentBody: "確認を通過してから、投票の対象として表示されます。",
    failedTitle: "リクエストに失敗しました",
    failedBody:
      "ScriptインデックスがそのURLを受け付けませんでした。もう一度試してください。"
  },

  // The vote button and its toasts. `failedKeyBody` is the auth case: the key
  // was rotated or the device went offline mid-session.
  vote: {
    action: "投票",
    voted: "投票済み",
    successTitle: "投票を受け付けました",
    successBody: "得票数の多いリクエストから順にscriptを作成します。",
    failedTitle: "投票に失敗しました",
    failedKeyBody:
      "キーが間違っているか、Handyがオンラインになっていません。両方を確認して、もう一度入力してください。",
    failedBody:
      "Scriptインデックスが投票を受け付けませんでした。もう一度試してください。"
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
    performerLabel: "出演者",
    performerEmpty: "一致する出演者がいません",
    // one row of the performer picker: who they are, then how many
    // requests name them
    performerOption: "{name}（{count}）",
    removePerformerAria: "フィルターを解除：{name}",
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
