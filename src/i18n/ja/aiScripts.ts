import type enUS from "../en-US/aiScripts";

// The AI scripts page (/ai-scripts): every script Handy's auto-scripter has
// published. Reached only from the help page. The warning is the point of
// the page — translate its claim as strongly as English makes it: made by
// AI, checked by nobody.
const aiScripts: typeof enUS = {
  title: "AI script",
  lead: "Handyの自動script生成ツールが作ったすべてのscript（新しい順）。",

  warning: {
    title: "非常に実験的な機能です",
    body: "このページのscriptはすべてAIが作成したもので、人間は誰も確認していません。動きのずれ、欠けている部分や間違った部分などがある前提でお使いください。ご利用は自己責任でお願いします。"
  },

  search: {
    placeholder: "AI scriptを検索",
    aria: "動画タイトルでAI scriptを検索"
  },

  count: "{count}件のAI script",
  /** under each title, after the length; {when} is "3 hours ago" */
  made: "{when}に作成",
  download: "ダウンロード",
  showMore: "もっと見る",

  emptyBody: "自動script生成ツールはまだscriptを公開していません。",
  errorTitle: "AI scriptを読み込めませんでした",
  errorBody:
    "AI scriptのサーバーが応答しませんでした。少し待ってからもう一度お試しください。",
  noMatchTitle: "一致するscriptはありません",
  noMatchBody: "その語句をタイトルに含むAI scriptはありません。"
};

export default aiScripts;
