import type enUS from "../en-US/video";

// The video detail page — the biggest single surface in the app: the hero and
// its chips, the action row, the opt-in partner player, the tag strip, the
// details card, the star rating, the stills gallery and its full-size viewer,
// script comments, the "more like this" shelves, and a toast for every
// outcome each of those can produce.
const video: typeof enUS = {
  missingTitle: "動画が見つかりません",
  missingBody:
    "この動画はすでにインデックスに存在しないか、リンクが間違っています。",

  // Stand-ins for catalog fields the index published empty. They are read
  // out loud (alt text, an iframe title) or land mid-sentence, so each one
  // has to work in the slot it fills — "Watch on the site" (the same reading
  // media.ts gives an unnamed partner), "Still 3 from Video".
  fallback: {
    video: "動画",
    player: "動画プレーヤー",
    site: "配信サイト",
    thisSite: "このサイト"
  },

  hero: {
    premiumChip: "有料スクリプト"
  },

  action: {
    getScript: "スクリプトを取得",
    // {site} is the partner's own name, or `fallback.site` when it has none
    watchOn: "{site}で見る",
    addFavorite: "お気に入りに追加",
    removeFavorite: "お気に入りから削除",
    addToPlaylist: "プレイリストに追加",
    report: "この動画を報告"
  },

  premiumNote:
    "この動画のスクリプトは有料です。パートナーサイトで動画と一緒に提供されます。",

  playerNote:
    "IVDB上の再生はHandyと同期しません。このプレーヤーは映像のみです。動きを同期させるには、スクリプトをダウンロードして、お使いのHandy環境で再生してください。",

  tag: {
    unmuteAria: "タグのミュートを解除：{tag}",
    mutedTitle: "「{tag}」はミュート中です。クリックで解除します",
    browse: "このタグの動画を見る",
    mute: "このタグをミュート"
  },

  details: {
    title: "詳細",
    script: "スクリプト",
    free: "無料",
    premium: "有料",
    published: "公開日",
    duration: "再生時間",
    format: "形式",
    // the non-VR case: an ordinary 2D video
    formatFlat: "2D",
    site: "サイト",
    scriptBy: "スクリプト作成者",
    rating: "評価",
    ratingValue: "{percent}%",
    // {votes} arrives already pluralized from useFormat().count("votes", n)
    ratingWithVotes: "{percent}%・{votes}",
    scriptPlays: "スクリプト再生回数"
  },

  rate: {
    title: "このスクリプトを評価",
    community: "みんなの評価：{percent}%",
    thanks: "スクリプトの評価ありがとうございます",
    errorTitle: "評価を保存できませんでした"
  },

  gallery: {
    // the strip is headed "Photos" unless the only thing in it is the
    // partner's roll clip
    photosTitle: "写真",
    previewTitle: "プレビュー",
    previewBadge: "プレビュー",
    clipAria: "プレビュー動画を全画面で再生",
    photoAria: "写真を開く（{index}/{total}）",
    stillAlt: "{title}の静止画{number}枚目",
    previousPhoto: "前の写真",
    nextPhoto: "次の写真",
    closeViewer: "ビューアーを閉じる",
    // position counter under the full-size viewer — "3 / 12"
    viewerCount: "{index} / {total}"
  },

  comments: {
    title: "コメント",
    gateHint: "コメントの利用には接続キーが必要です。",
    gateAction: "キーを追加",
    inputLabel: "コメントを入力",
    submit: "投稿",
    errorHint: "コメントを読み込めませんでした。",
    emptyHint: "まだコメントはありません。最初の1件をどうぞ。",
    postedTitle: "コメントを送信しました",
    postedBody: "確認を通過すると表示されます。",
    postErrorTitle: "コメントを投稿できませんでした"
  },

  more: {
    related: "関連動画",
    fromPartner: "{site}の他の動画"
  },

  // Replaces ConnectionKeyDialog's generic blurb — the reason the key is
  // being asked for differs per action.
  keyPrompt: {
    script:
      "スクリプトはお使いのHandyに紐付いています。続けるには、Handyアプリの接続キーを入力してください。",
    action:
      "評価とコメントはお使いのHandyに紐付いています。続けるには、Handyアプリの接続キーを入力してください。"
  },

  script: {
    readyTitle: "スクリプトを準備しました",
    readyBody: "新しいタブでダウンロードを開きました。",
    errorTitle: "スクリプトを取得できませんでした",
    errorBody:
      "接続キーが間違っているか、Handyがオンラインになっていません。両方を確認してから、もう一度お試しください。"
  },

  mute: {
    refusedTitle: "「{tag}」はミュートできません",
    refusedBody:
      "性的指向のタグは、表示するカタログそのものを決めるものです。設定から変更してください。",
    doneTitle: "「{tag}」をミュートしました",
    doneBody: "ミュート一覧に追加しました。いつでも解除できます。",
    undoneTitle: "「{tag}」のミュートを解除しました"
  },

  share: {
    copiedTitle: "リンクをコピーしました",
    errorTitle: "リンクをコピーできませんでした"
  },

  // The report button opens a pre-filled mail draft. The reader is the one
  // who finishes and sends it, so the draft is written in their language;
  // the identifying lines keep it useful once it reaches the inbox.
  report: {
    subject: "動画を報告します",
    intro: "動画を報告します。",
    titleLine: "タイトル：{title}",
    untitled: "（タイトルなし）",
    idLine: "動画ID：{id}",
    siteLine: "サイト：{site}",
    linkLine: "リンク：{link}",
    reasonLine: "報告の理由："
  }
};

export default video;
