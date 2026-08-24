import type enUS from "../en-US/sites";

// The site directory (/sites): one nav card per partner site, with a name
// filter. Almost every string here is a count shape — the header line and the
// card captions are built from `common.count.*` pieces joined with "·", so
// each message below covers one phrase of that line, never the whole line.
const sites: typeof enUS = {
  title: "サイト",

  search: {
    placeholder: "サイトを検索",
    aria: "サイトを検索"
  },

  count: {
    // the tail of the header line when no filter is narrowing anything;
    // {total} arrives as "2,000 videos" from common.count.videos
    totalInIndex: "インデックス内に{total}",
    // the two paywalls are named in full on the cards: they are different
    // gates, and a bare "500 premium" would not say which
    premiumVideos: "有料動画{count}本",
    premiumScripts: "有料スクリプト{count}件"
  },

  errorTitle: "サイトを読み込めませんでした",
  emptyBody:
    "インデックスにサイトが1件も入っていませんでした。もう一度読み込んでみてください。",
  noMatchTitle: "一致するサイトがありません",
  noMatchBody:
    "その検索に一致するサイト名はありません。文字数を減らしてお試しください。"
};

export default sites;
