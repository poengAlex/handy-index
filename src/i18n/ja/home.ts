import type enUS from "../en-US/home";

// The front page: the featured hero at the top, the config-driven carousel
// shelves under it, and the confirm dialog behind the recently-viewed
// shelf's clear icon. Shelf titles are row headers in a tight horizontal
// strip — keep them short.
const home: typeof enUS = {
  hero: {
    kicker: "注目",
    /** alt text when the featured video has no title of its own */
    alt: "注目の動画",
    cta: "動画を見る",
    emptyTitle: "注目の動画がありません"
  },

  // One sentence, two places: under the empty hero and under the empty shelf
  // list. Both are the same "you filtered the catalog away" state.
  filteredOutBody:
    "フィルターとミュート中のタグで、カタログ全体が隠れています。設定で条件を緩めてください。",

  rows: {
    recent: "新着",
    favorites: "お気に入り",
    recentlyViewed: "最近見た動画",
    /** help-icon tooltip on the recently-viewed shelf */
    recentlyViewedHint:
      "このブラウザにのみ保存されます。閲覧履歴が追跡されたり、どこかへ送信されたりすることはありません。",
    /** delete-icon tooltip on the same shelf */
    recentlyViewedClear: "最近見た動画を消去",
    /** {tag} is a catalog tag and stays untranslated */
    becauseYouLike: "「{tag}」が好きな方に",
    topRated: "高評価",
    mostPlayed: "再生数トップ",
    updated: "最近の更新"
  },

  clearHistory: {
    title: "最近見た動画を消去しますか？",
    body: "動画自体はカタログに残ります。消えるのは、このブラウザに記録された閲覧リストだけです。",
    confirm: "履歴を消去",
    done: "最近見た動画を消去しました"
  }
};

export default home;
