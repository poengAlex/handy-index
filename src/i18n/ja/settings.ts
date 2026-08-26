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
    fullWidthCaption: "中央寄せの列ではなく画面全体を使います"
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

  backgroundSceneTitle: "背景のスタイル",
  backgroundSceneOff: "オフ",
  backgroundMotionLabel: "動き",
  backgroundMotionCaption:
    "背景をゆっくり動かし、ページを切り替えたときに少しだけ速めます",
  orientationTitle: "性的指向",

  access: {
    title: "利用条件",
    premiumScriptsLabel: "有料script",
    premiumScriptsCaption:
      "Scriptがパートナーサイトの有料エリアにある動画も含めます",
    premiumVideosLabel: "有料動画",
    premiumVideosCaption: "パートナーサイトの有料エリアにある動画も含めます"
  },

  previews: {
    title: "カードのプレビュー",
    hint:
      "カードにカーソルを合わせる、または指で触れるとプレビューが再生されます。" +
      "ラベルをクリックすると、その速度が元に戻ります。",
    imageSpeed: "画像の速度",
    clipSpeed: "クリップの速度"
  },

  // Shared by the settings field and the connection-key prompt. "connection
  // key" — like "script" — is a fixed system term and stays in Latin script
  // in every locale; Japanese particles attach straight to it, with no space
  // on either side, the way Handy/IVDB/API are already set in this locale.
  // House rule on case: sentence case when the term opens a string, verbatim
  // lowercase anywhere inside one.
  connectionKey: {
    label: "Connection key",
    placeholder: "例：a1B2c3D4e5",
    hint: "Scriptのダウンロードに使う、Handyのconnection keyです。"
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
    ratingCount: "Script評価{count}件",
    requestVoteCount: "リクエスト投票{count}件",

    keySaved: "このデバイスに保存済み",
    keyUnset: "未設定",
    keyToast: "Connection keyを消去しました",

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
      "IVDBは、The Handy用のscriptが付いたインタラクティブなアダルト動画を" +
      "集めたカタログです。露骨なプレビューを表示して閲覧するには、" +
      "18歳以上であることを確認してください。確認せずに進んだ場合、" +
      "プレビューは非表示のままになります。これは設定でいつでも変更できます。" +
      "設定内容はこのブラウザにのみ保存されます。",
    decline: "プレビューなしで続ける",
    accept: "18歳以上です"
  },

  // ConnectionKeyDialog — shown when an action needs a key that isn't set
  keyPrompt: {
    title: "Connection keyが必要です",
    body:
      "この操作はHandyに紐付いています。続けるには、" +
      "Handyアプリのconnection keyを入力してください。",
    hint:
      "キーが働くには、Handyの電源が入っていてオンラインである必要があります。" +
      "オフラインのデバイスは、キーが間違っている場合とまったく同じように失敗します。",
    save: "保存して続ける"
  }
};

export default settings;
