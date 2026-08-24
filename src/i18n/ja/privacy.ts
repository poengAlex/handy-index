import type enUS from "../en-US/privacy";

// The privacy & terms page at /privacy. Every sentence here is a factual
// claim about what the site stores, what leaves the browser and who may use
// it — translate the claim, never a looser version of it. `apiBody` and
// `contact.body` are rendered through <i18n-t> with the anchors supplied as
// named slots, so the link text lives in its own key and the sentence stays
// one unit whose word order a translator is free to move.
const privacy: typeof enUS = {
  title: "プライバシーと利用規約",

  // Shown only when the page is being read in a translation — the English
  // wording is the one the site is held to, and a reader of the Norwegian
  // needs to know that before the first claim, not after the last.
  authoritativeNotice:
    "これは翻訳版です。英語版と内容が食い違う場合は、英語版が優先されます。",

  intro:
    "IVDBは、Handyのscriptがある動画のカタログで、Handyチーム（Ohdoki AS）が運営しています。このページでは、このサイトがデータをどう扱うかを説明します。要点を先に言えば、扱うのは最小限です。",

  what: {
    title: "このサイトについて",
    body: "このサイトは、scriptのある動画を一覧で紹介し、scriptと、実際のコンテンツを配信するパートナーサイトへのリンクを提供します。動画はこちらのサーバーには保存しておらず、保存しているのはscriptだけです。Handyのユーザーは無料で閲覧できます。",
    apiBody:
      "このサイトは、公開されているscriptインデックスのAPIの上に作られています。自分のプロジェクトでも自由に使ってください：{apiDocs}。サイト自体も、透明性のためにオープンソースで公開しています：{repo}。",
    apiDocsLink: "APIドキュメント",
    repoLink: "GitHubリポジトリ"
  },

  local: {
    title: "このブラウザに残るもの",
    intro:
      "アカウントもクッキーもアクセス解析もありません。設定した内容はすべて、このブラウザのローカルストレージにのみ保存されます：",
    item: {
      consent: "初回訪問時の確認画面での回答",
      previews: "露骨なプレビュー（NSFW）の設定",
      orientation: "性的指向のフィルター",
      accessFilters: "Scriptと動画の利用条件フィルター",
      favorites: "お気に入り",
      votes: "動画リクエストへの投票",
      connectionKey: "Handyのconnection key"
    },
    outro:
      "別のデバイスでこのサイトを開いたり、ブラウザのデータを消したりすると、これらは失われます。サーバーから復元できるものはありません。アクセス解析がないということは、こちらでエラーの発生を確認できないということでもあるので、不具合の報告は大歓迎です。"
  },

  catalog: {
    title: "カタログの出どころ",
    body: "カタログとそのメタデータ、そしてscriptは、handyfeeling.comのscriptインデックスAPIから読み込まれます。scriptをダウンロードしたとき、動画リクエストを送信したとき、リクエストに投票したときには、認証情報としてconnection keyがそのAPIに送信されます。入力した情報がブラウザの外に出るのは、このときだけです。"
  },

  thirdParty: {
    title: "第三者のサイト",
    body: "動画ページからは、その動画を配信するパートナーサイトへのリンクが張られています。これらは第三者のアダルトサイトで、独自のプライバシーポリシーと独自のアクセス解析を持っています。IVDBを離れた時点で、そちらのルールが適用されます。露骨なプレビューを有効にすると、サムネイルはパートナーサイトから直接読み込まれるため、ブラウザから、相手のサーバーが記録できるリクエストが送信されます。気になる場合は、プレビューをオフのままにするか、VPNを使ってください。"
  },

  age: {
    title: "年齢制限",
    body: "このサイトはアダルトコンテンツを扱っており、成人のみを対象としています。利用するには、18歳以上、または住んでいる地域の成年年齢に達している必要があります。"
  },

  choices: {
    title: "選んだ内容の変更",
    body: "初回訪問時の確認画面で選んだ内容は、あとから変更できます。露骨なプレビュー、性的指向、scriptと動画の利用条件フィルターは、上部バーの設定画面からいつでも変更できます。"
  },

  contact: {
    title: "連絡先",
    body: "質問、不具合の報告、削除の依頼は：{email}"
  }
};

export default privacy;
