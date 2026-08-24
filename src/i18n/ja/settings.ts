import type enUS from "../en-US/settings";

// The settings modal and the three dialogs that hang off it: clear-data, the
// first-visit consent gate, and the connection-key prompt. The language
// picker inside settings is `common.language.*`, because the same wording is
// used wherever a locale is offered.
const settings: typeof enUS = {
  title: "設定",

  // the toggle list at the top of the modal
  display: {
    darkModeLabel: "ダークモード",
    darkModeCaption: "暗い配色テーマを使います",
    nsfwLabel: "露骨なプレビュー",
    nsfwCaption: "無地のタイルではなく実際のサムネイルを表示します",
    playersLabel: "埋め込みプレーヤー",
    playersCaption: "PornhubとxHamsterの動画を動画ページ上で直接再生します",
    fullWidthLabel: "全幅レイアウト",
    fullWidthCaption: "中央寄せの列ではなく画面全体を使います",
    backgroundLabel: "アニメーション背景",
    backgroundCaption: "各ページの背後にゆっくり動くグラデーションを表示します"
  },

  // The muted-tags row. `caption` pluralizes over the count itself rather
  // than taking a pre-counted noun phrase: Bokmål inflects the adjective with
  // the noun ("1 dempet tagg" / "2 dempede tagger"), which a `{tags}` slot
  // cannot express
  // ("3 tags") rather than a bare number, so the pluralization stays in
  // `common.count.tags` and this message only carries the verb.
  muted: {
    label: "ミュート中のタグ",
    caption: "タグ{count}個をミュート中",
    empty: "ミュートなし"
  },

  orientationTitle: "性的指向",

  access: {
    title: "利用条件",
    premiumScriptsLabel: "有料スクリプト",
    premiumScriptsCaption:
      "スクリプトがパートナーサイトの有料エリアにある動画も含めます",
    premiumVideosLabel: "有料動画",
    premiumVideosCaption: "パートナーサイトの有料エリアにある動画も含めます"
  },

  previews: {
    title: "カードのプレビュー",
    hint:
      "カードにカーソルを合わせる、または指でなぞるとプレビューが再生されます。" +
      "ラベルをクリックすると、その速度が元に戻ります。",
    imageSpeed: "画像の速度",
    clipSpeed: "クリップの速度"
  },

  // shared by the settings field and the connection-key prompt
  connectionKey: {
    label: "接続キー",
    placeholder: "例：a1B2c3D4e5",
    hint: "スクリプトのダウンロードに使う、Handyの接続キーです。"
  },

  clearDataAction: "データを消去…",

  // ClearDataDialog. Every row names its own toast instead of sharing one
  // "{thing} cleared" template: the verb already differs per row in English
  // (a key is deleted, preferences are reset), and more so in Norwegian.
  clear: {
    title: "保存データの消去",
    lead:
      "このサイトが覚えている情報は、すべてこのブラウザの中にあります。" +
      "項目ごとに消すことも、まとめて消すこともできます。",
    clearAll: "すべてのデータを消去",
    allToast: "ローカルデータをすべて消去しました",

    recentLabel: "最近見た動画",
    recentToast: "最近見た動画を消去しました",
    favoritesLabel: "お気に入り",
    favoritesToast: "お気に入りを消去しました",
    playlistsLabel: "プレイリスト",
    playlistsToast: "プレイリストを消去しました",
    mutedToast: "ミュート中のタグを消去しました",

    // the two halves of the ratings row's caption, printed side by side
    votesLabel: "評価と投票",
    votesEmpty: "記録なし",
    votesToast: "評価と投票を消去しました",
    ratingCount: "スクリプト評価{count}件",
    requestVoteCount: "リクエスト投票{count}件",

    keySaved: "このデバイスに保存済み",
    keyUnset: "未設定",
    keyToast: "接続キーを消去しました",

    preferencesLabel: "表示の設定",
    preferencesCaption:
      "露骨なプレビュー、性的指向、利用条件のフィルター、プレビュー速度、背景",
    preferencesToast: "表示の設定をリセットしました"
  },

  // ConsentDialog — the first-visit age gate. Legally load-bearing: every
  // condition the English states has to survive into every translation.
  consent: {
    title: "閲覧の前に",
    body:
      "IVDBは、Handy用のスクリプトが付いたインタラクティブなアダルト動画を" +
      "集めたカタログです。露骨なプレビューを表示して閲覧するには、" +
      "18歳以上であることを確認してください。確認せずに進んだ場合、" +
      "プレビューは非表示のままになります。これは設定でいつでも変更できます。" +
      "設定内容はこのブラウザにのみ保存されます。",
    decline: "プレビューなしで続ける",
    accept: "18歳以上です"
  },

  // ConnectionKeyDialog — shown when an action needs a key that isn't set
  keyPrompt: {
    title: "接続キーが必要です",
    body:
      "この操作はお使いのHandyに紐付いています。続けるには、" +
      "Handyアプリの接続キーを入力してください。",
    hint:
      "キーが働くには、Handyの電源が入っていてオンラインである必要があります。" +
      "オフラインのデバイスは、キーが間違っている場合とまったく同じように失敗します。",
    save: "保存して続ける"
  }
};

export default settings;
