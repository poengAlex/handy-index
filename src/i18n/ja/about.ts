import type enUS from "../en-US/about";

const about: typeof enUS = {
  title: "IVDB について",
  body: "IVDB は Handy スクリプトのある動画のカタログです。Ohdoki AS の Handy チームが作っていて、無料で使えます。",
  beta: "このバージョンはまだベータ版です。未完成のところも、たぶん壊れているところもあります。何か見つけたら教えてください。",

  version: "バージョン {version}",
  built: "ビルド日 {date}",
  copyright: "© {year} Ohdoki AS",

  changelog: {
    title: "更新履歴",
    lead: "サイトの変更点を、新しい順に並べています。",
    englishOnly: "この一覧は英語だけで書かれています。",
    errorTitle: "更新履歴を読み込めませんでした",
    errorBody:
      "一覧を読み込めませんでした。接続を確認して、もう一度お試しください。"
  }
};

export default about;
