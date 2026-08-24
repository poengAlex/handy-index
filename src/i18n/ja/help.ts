import type enUS from "../en-US/help";

// The feature tour at /help — one row per capability, grouped the way people
// actually use the site. Every `label` is a short feature name; every
// `caption` is the single sentence sitting under it. Keep captions to one
// sentence: the row truncates nothing, but a second sentence turns the list
// into documentation, which is what this page exists to replace.
const help: typeof enUS = {
  title: "ヘルプ",
  lead: "このサイトでできることをまとめました。矢印の付いた項目からは、その場所へ直接移動できます。",

  finding: {
    title: "動画を探す",
    search: {
      label: "検索と絞り込み",
      caption:
        "タイトルで検索し、タグ・サイト・出演者・VR・再生時間で絞り込めます。フィルターはすべてURLに入るので、結果をそのまま共有できます"
    },
    sort: {
      label: "自由に並べ替え",
      caption:
        "新着順、評価が高い順、script再生数順などで並べ替えられます。隣の矢印ボタンで昇順と降順が入れ替わります"
    },
    tags: {
      label: "タグクラウド",
      caption:
        "ミュート中のものを除く、カタログのすべてのタグを検索・並べ替えできます。クリックすると一覧ページがそのタグで絞り込まれます"
    },
    performers: {
      label: "出演者",
      caption: "出演者ごとに探せます。出演作品の多い順に並びます"
    },
    sites: {
      label: "サイト",
      caption:
        "インデックスにあるすべてのパートナーサイトを、動画の本数とあわせて表示します"
    }
  },

  library: {
    title: "自分のライブラリ",
    favorites: {
      label: "お気に入り",
      caption:
        "動画のハートを押しておくとすぐに呼び出せます。このデバイス内に保存されます"
    },
    playlists: {
      label: "プレイリスト",
      caption:
        "好きな動画でプレイリストを作り、名前の変更や中身の整理ができます"
    },
    transfer: {
      label: "プレイリストの共有・読み込み・書き出し",
      caption:
        "プレイリストはファイル、コピーできるJSONテキスト、一時的な共有リンクとして持ち出せます。どの形式からでも読み込めます"
    },
    bulkDownload: {
      label: "Scriptを一括取得",
      caption:
        "プレイリストで1回クリックすると、含まれている無料scriptをすべてダウンロードします"
    },
    quickMenu: {
      label: "クイックメニュー",
      caption:
        "動画のサムネイルを右クリック（または長押し）すると、お気に入り、プレイリスト、リンクのコピーなどを操作できます"
    }
  },

  scripts: {
    title: "ScriptとHandy",
    free: {
      label: "無料script",
      caption:
        "「無料」と表示された動画のscriptは、Handyのconnection keyがあればダウンロードできます"
    },
    rate: {
      label: "Scriptを評価",
      caption: "無料scriptは動画ページでそのまま星をつけて評価できます"
    },
    comments: {
      label: "Scriptへのコメント",
      caption: "Scriptへの匿名コメントを読んだり投稿したりできます"
    },
    requests: {
      label: "動画をリクエスト",
      caption:
        "好きな動画のscript作成を依頼し、次に作るものを投票で決められます"
    }
  },

  personalize: {
    title: "自分好みに設定",
    previews: {
      label: "露骨なプレビュー",
      caption: "初期状態ではオフです。設定で実際の画像の表示をオンにできます"
    },
    players: {
      label: "埋め込みプレーヤー",
      caption:
        "初期状態ではオフです。PornhubとxHamsterの動画を動画ページでそのまま視聴できます（再生はHandyと同期しません）"
    },
    filters: {
      label: "性的指向・script・動画のフィルター",
      caption:
        "Scriptと動画それぞれの無料・有料、そして出演者の性的指向を、設定からでも一覧のフィルターからでも指定できます"
    },
    mutedTags: {
      label: "ミュート中のタグ",
      caption:
        "タグをミュートすると、そのタグが付いた動画はカタログから外れます。タグを右クリックするか、設定で一覧を管理できます"
    },
    theme: {
      label: "ライトテーマとダークテーマ",
      caption:
        "ヘッダーで切り替えられます。選んだテーマはサイト全体に適用されます"
    },
    share: {
      label: "共有",
      caption:
        "すべての動画ページと、絞り込んだ結果の一覧に、共有できるリンクがあります"
    }
  }
};

export default help;
