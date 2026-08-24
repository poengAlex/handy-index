import type enUS from "../en-US/media";

// The shared media primitives — the catalog tile every listing renders, its
// right-click quick menu, and the toasts that menu raises. The tile's own
// text (title, partner name) is catalog data and is never translated; what
// lives here is the chrome around it.
const media: typeof enUS = {
  card: {
    // accessible name for an entry the index published without a title
    fallbackTitle: "動画",
    // the star rating printed beside the tile caption — "★ 92%"
    rating: "★ {rating}%"
  },

  menu: {
    open: "開く",
    openNewTab: "新しいタブで開く",
    addFavorite: "お気に入りに追加",
    removeFavorite: "お気に入りから削除",
    addToPlaylist: "プレイリストに追加…",
    copyLink: "リンクをコピー",
    downloadScript: "スクリプトをダウンロード",
    downloadBlocked: "ダウンロードできません",
    downloadBlockedCaption: "有料スクリプトです",
    // {site} is the partner's own name; the second form covers the entries
    // that arrive without one, and has to read as a whole sentence
    watchOn: "{site}で見る",
    watchOnSite: "配信サイトで見る"
  },

  toast: {
    linkCopied: "リンクをコピーしました",
    linkCopyFailed: "リンクをコピーできませんでした",
    scriptDownloaded: "スクリプトをダウンロードしました",
    scriptFailedTitle: "スクリプトを取得できませんでした",
    scriptFailedBody:
      "接続キーが間違っているか、Handyがオンラインになっていません。両方を確認してから、もう一度お試しください。"
  },

  keyDialog: {
    // replaces ConnectionKeyDialog's generic blurb when the key is needed for
    // a script download
    body: "スクリプトはお使いのHandyに紐付いています。続けるには、Handyアプリの接続キーを入力してください。"
  }
};

export default media;
