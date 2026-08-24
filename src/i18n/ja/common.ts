import type enUS from "../en-US/common";

// Vocabulary shared by more than one surface. Same admission rule as the
// component menu in ARCHITECTURE.md: a string is promoted here on its
// *second* consumer — a phrase used once belongs in its feature namespace,
// where a translator can see the context it is used in.
//
// Plural messages carry a `{count}` named param instead of vue-i18n's bare
// `{n}`, because the count has to be run through `$n()` first so 15000 reads
// "15,000" in English and "15 000" in Norwegian. Call them as
// `$t("common.count.videos", { count: $n(x) }, x)`.
const common: typeof enUS = {
  action: {
    backToHome: "ホームへ戻る",
    browseVideos: "動画一覧へ",
    cancel: "キャンセル",
    clear: "クリア",
    clearFilters: "フィルターをクリア",
    clearSearch: "検索をクリア",
    create: "作成",
    delete: "削除",
    done: "完了",
    import: "読み込む",
    manage: "管理",
    rename: "名前を変更",
    retry: "再試行",
    save: "保存",
    share: "共有"
  },

  state: {
    catalogErrorTitle: "カタログを読み込めませんでした",
    catalogErrorBody:
      "スクリプトインデックスから応答がありませんでした。接続を確認して、もう一度お試しください。",
    emptyTitle: "表示できるものがありません"
  },

  // "12 of 340" — the shown/total pair every filtered listing prints. Both
  // sides arrive pre-formatted through `$n()`.
  ofTotal: {
    videos: "動画{total}本中{shown}本",
    performers: "出演者{total}人中{shown}人",
    tags: "タグ{total}個中{shown}個"
  },

  count: {
    performers: "出演者{count}人",
    playlists: "プレイリスト{count}個",
    requests: "リクエスト{count}件",
    sites: "{count}サイト",
    tags: "タグ{count}個",
    videos: "動画{count}本",
    votes: "{count}票"
  },

  // Duration is assembled from parts rather than formatted in the service:
  // Norwegian abbreviates hours "t", not "h", and only the message layer
  // knows that. `durationParts()` in services/format.ts picks which key.
  duration: {
    hoursMinutes: "{hours}時間{minutes}分",
    hours: "{hours}時間",
    minutes: "{minutes}分",
    seconds: "{seconds}秒"
  },

  justNow: "たった今",

  // Shared by the settings radio group, the browse filters and the header
  // switcher — the same "can't drift apart" reason ORIENTATION_LABELS gave
  // for living in queries.ts, which is where these strings came from.
  orientation: {
    straight: "ストレート",
    gay: "ゲイ",
    trans: "トランス",
    all: "すべて"
  },

  language: {
    label: "言語",
    caption: "このサイトの表示言語を選びます",
    system: "ブラウザに合わせる"
  }
};

export default common;
