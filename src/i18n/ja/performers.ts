import type enUS from "../en-US/performers";

// The performer directory (/performers): a grid of avatar cards with a name
// search, a sort control and endless scroll. Same page shape as `sites` — a
// header count line, a search box and two empty states — so the key names are
// kept parallel with that namespace on purpose.
const performers: typeof enUS = {
  title: "出演者",

  search: {
    placeholder: "出演者を検索",
    aria: "出演者を名前で検索"
  },

  sort: {
    aria: "出演者を並べ替え",
    count: "動画数順",
    plays: "Script再生数順",
    rating: "評価順",
    // an alphabet range, so it changes with the language
    name: "名前順",
    // the profile properties with an order; they start low to high
    age: "年齢",
    height: "身長",
    weight: "体重",
    bmi: "体型",
    cup: "カップ",
    // under the controls while a profile property is the sort
    unknownLast:
      "プロフィールに記載がない出演者は、並び順にかかわらず最後に表示されます。",
    profilesError:
      "この並べ替えには全員のプロフィールが必要ですが、ダウンロードできませんでした。接続を確認して、もう一度お試しください。",
    // Four whole messages rather than one with a {direction} param: the
    // button says what the order *is* and what clicking does, and neither
    // language builds that sentence from the same pieces.
    descAria: "降順で表示中。並び順を反転します",
    ascAria: "昇順で表示中。並び順を反転します",
    descTitle: "降順で表示中。クリックで反転します",
    ascTitle: "昇順で表示中。クリックで反転します"
  },

  // the star chip on a card; Norwegian puts a space before the percent sign
  ratingBadge: "★ {rating}%",

  // the value a card shows while the list is sorted by a profile property;
  // all numbers arrive localized, heights and weights with every unit
  card: {
    age: "{age}歳",
    height: "{cm} cm",
    weight: "{kg} kg",
    cup: "{cup}カップ"
  },

  errorTitle: "出演者を読み込めませんでした",
  hiddenBody:
    "有料コンテンツのフィルターとミュート中のタグで、すべての出演者が隠れています。設定で条件を緩めてください。",
  noMatchTitle: "一致する出演者がいません",
  noMatchBody:
    "「{query}」に一致するものは、インデックスにありません。もっと短い名前で試してください。",

  // The property filters: a dialog of toggle pills per facet (hair, eyes, …)
  // and a track each for age and height, plus one chip per facet in use on
  // the page. Every value is folded from the profiles' free text into a few
  // groups, so these name the groups, not anything a site wrote.
  filters: {
    title: "出演者をフィルター",
    lead: "プロフィールにこれらの情報がすべて載っているとは限りません。フィルターは、選んだ内容がプロフィールに書かれている出演者だけを表示します。",
    errorTitle: "プロフィールを読み込めませんでした",
    errorBody:
      "フィルターには全員のプロフィールが必要ですが、ダウンロードできませんでした。接続を確認して、もう一度お試しください。",
    noMatchBody:
      "これらの条件をすべて満たす出演者はインデックスにいません。条件を減らしてみてください。",
    // an active-filter chip on the page; {facet} is one of the facets below,
    // {value} its picks joined with "or" ("Blonde or Red") or an age or
    // height band as the track prints it
    chip: "{facet}：{value}",
    facets: {
      gender: "性別",
      hair: "髪の色",
      eyes: "瞳の色",
      ethnicity: "民族",
      cup: "カップ",
      // natural or enhanced breasts
      natural: "バスト",
      tattoos: "タトゥー",
      piercings: "ピアス",
      age: "年齢",
      height: "身長",
      bmi: "体型"
    },
    options: {
      gender: {
        woman: "女性",
        man: "男性",
        trans: "トランス",
        couple: "カップル",
        nonBinary: "ノンバイナリー"
      },
      hair: {
        blonde: "ブロンド",
        brunette: "ブラウン",
        black: "黒",
        red: "赤",
        grey: "グレー",
        bald: "なし",
        other: "その他"
      },
      eyes: {
        brown: "茶",
        blue: "青",
        green: "緑",
        hazel: "ヘーゼル",
        grey: "グレー",
        black: "黒",
        other: "その他"
      },
      ethnicity: {
        white: "白人",
        latina: "ラティーナ",
        asian: "アジア系",
        black: "黒人",
        indian: "インド系",
        middleEastern: "中東系",
        mixed: "ミックス",
        other: "その他"
      },
      // US cup letters, as the measurements give them
      cup: {
        a: "A",
        b: "B",
        c: "C",
        d: "D",
        ddPlus: "DD+"
      },
      natural: {
        natural: "天然",
        enhanced: "豊胸"
      }
    },
    // The age, height and build tracks. Their ends are open: a handle resting on
    // one means no limit that way. All numbers arrive localized; heights
    // come with every unit — {min} and {max} in cm, {minFeet} {minInches}
    // {maxFeet} {maxInches} — so each language prints its own system.
    ageAny: "すべての年齢",
    ageFrom: "{min}歳以上",
    ageUpTo: "{max}歳以下",
    ageRange: "{min}–{max}歳",
    heightAny: "すべての身長",
    heightFrom: "{min} cm以上",
    heightUpTo: "{max} cm以下",
    heightRange: "{min}–{max} cm",
    // build: {min} and {max} arrive as the words below, never as numbers
    bmiAny: "すべての体型",
    bmiFrom: "{min}以上",
    bmiUpTo: "{max}以下",
    bmiRange: "{min}〜{max}",
    // the build words, slimmest first — the range reads in these, not in
    // numbers
    build: {
      slender: "華奢",
      slim: "スリム",
      medium: "標準",
      curvy: "グラマー",
      full: "ふくよか"
    }
  },

  // The ? on a performer's profile: a disclaimer that profile details are
  // scraped and unchecked, and a correction report the reader sends from
  // their own email app. `email` is that email's text, in the reader's
  // language; {link} is the page address.
  report: {
    helpAria: "このプロフィールについて・誤りを報告",
    title: "このプロフィールについて",
    disclaimer:
      "プロフィールの情報はパートナーサイトやその他の公開情報から取得しています。IVDBでは確認していないため、誤りや古い情報が含まれる場合があります。",
    question: "誤りを見つけましたか？該当するものにチェックを入れてください：",
    reason: {
      measurements: "スリーサイズ・身長・体重",
      age: "年齢・誕生日",
      details: "その他の情報（髪、目、国など）",
      media: "写真や動画が本人ではない",
      self: "本人です。情報の訂正・削除を希望します",
      other: "その他"
    },
    detailsLabel: "何が誤りで、正しくはどうなりますか？（任意）",
    note: "メールアプリが開き、IVDBチーム宛ての報告が入力された状態になります。",
    send: "メールを作成",
    email: {
      subject: "IVDBプロフィール訂正：{name}",
      intro: "この出演者プロフィールの誤りを報告します。",
      nameLine: "出演者：{name}",
      idLine: "出演者ID：{id}",
      linkLine: "ページ：{link}",
      reasonsLine: "誤りの内容：",
      detailsLine: "詳細：",
      profileLine: "現在のプロフィールの内容："
    }
  },

  // Under the profile panel: two slideshows, one item at a time — photos
  // of them, and their videos (a preview clip, or the video's stills where
  // it has none). Settings can switch both off.
  media: {
    photos: "写真",
    reel: "クリップ",
    // stand-in link text for a video with no title
    fromVideo: "動画を開く",
    counter: "{index} / {total}",
    // what a screen reader calls the photo and clip players
    slideshow: "スライドショー",
    previous: "前の写真",
    next: "次の写真",
    previousVideo: "前の動画",
    nextVideo: "次の動画",
    // the slideshows' pause/play button
    pause: "一時停止",
    play: "再生"
  },

  profile: {
    eyebrow: "出演者",
    plays: "Script再生{count}回",
    linkAria: "{site}(新しいタブで開きます)",
    // the two link cards: their own accounts, and their profile on each
    // partner site; {name} is the performer's, as the panel prints it
    socials: "SNS",
    moreOf: "{name}をもっと見る",
    // {site} is the partner site's domain — "pornhub.com"
    partnerLinkAria: "{site}のプロフィール(新しいタブで開きます)",
    about: "紹介",
    hobbies: "趣味",
    details: "プロフィール",
    born: "生年月日",
    age: "年齢",
    from: "出身",
    career: "キャリア",
    careerSpan: "{start}–{end}年",
    careerSince: "{start}年から",
    careerActive: "活動中",
    careerInactive: "活動休止",
    height: "身長",
    weight: "体重",
    heightValue: "{cm} cm",
    weightValue: "{kg} kg",
    measurements: "スリーサイズ",
    hair: "髪の色",
    eyes: "瞳の色",
    ethnicity: "民族",
    starSign: "星座",
    tattoos: "タトゥー",
    piercings: "ピアス",
    yes: "あり",
    no: "なし"
  }
};

export default performers;
