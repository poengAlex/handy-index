import type enUS from "../en-US/performers";

// The performer directory (/performers): a grid of avatar cards with a name
// search, a sort control and endless scroll. Same page shape as `sites` — a
// header count line, a search box and two empty states — so the key names are
// kept parallel with that namespace on purpose.
const performers: typeof enUS = {
  title: "演员",

  search: {
    placeholder: "搜索演员",
    aria: "按名字搜索演员"
  },

  sort: {
    aria: "演员排序",
    count: "视频最多",
    plays: "播放最多",
    rating: "评分最高",
    // an alphabet range, so it changes with the language
    name: "A–Z",
    // the profile properties with an order; they start low to high
    age: "年龄",
    height: "身高",
    weight: "体重",
    bmi: "体型",
    cup: "罩杯",
    // under the controls while a profile property is the sort
    unknownLast: "资料中未注明的演员，无论正序倒序都排在最后。",
    profilesError:
      "按此排序需要所有人的资料，但未能下载。请检查网络连接后重试。",
    // Four whole messages rather than one with a {direction} param: the
    // button says what the order *is* and what clicking does, and neither
    // language builds that sentence from the same pieces.
    descAria: "当前降序——反转",
    ascAria: "当前升序——反转",
    descTitle: "当前降序——点击反转",
    ascTitle: "当前升序——点击反转"
  },

  // the star chip on a card; Norwegian puts a space before the percent sign
  ratingBadge: "★ {rating}%",

  // the value a card shows while the list is sorted by a profile property;
  // all numbers arrive localized, heights and weights with every unit
  card: {
    age: "{age}岁",
    height: "{cm} cm",
    weight: "{kg} kg",
    cup: "{cup}罩杯"
  },

  errorTitle: "无法加载演员",
  hiddenBody: "你的付费筛选和屏蔽标签把所有演员都藏了起来。到设置里放宽一些。",
  noMatchTitle: "没有匹配的演员",
  noMatchBody: "索引里没有匹配“{query}”的内容。换个更短的名字试试。",

  // The property filters: a dialog of toggle pills per facet (hair, eyes, …)
  // and a track each for age and height, plus one chip per facet in use on
  // the page. Every value is folded from the profiles' free text into a few
  // groups, so these name the groups, not anything a site wrote.
  filters: {
    title: "筛选演员",
    lead: "大多数资料只列出其中一部分信息。筛选只会保留资料中写明了你所选内容的演员。",
    errorTitle: "无法加载资料",
    errorBody: "筛选需要所有人的资料，但下载失败了。请检查网络连接后重试。",
    noMatchBody: "索引里没有演员符合所有这些筛选条件。去掉一些条件再看看。",
    // an active-filter chip on the page; {facet} is one of the facets below,
    // {value} its picks joined with "or" ("Blonde or Red") or an age or
    // height band as the track prints it
    chip: "{facet}：{value}",
    facets: {
      gender: "性别",
      hair: "发色",
      eyes: "瞳色",
      ethnicity: "族裔",
      cup: "罩杯",
      // natural or enhanced breasts
      natural: "胸部",
      tattoos: "纹身",
      piercings: "穿孔",
      age: "年龄",
      height: "身高",
      bmi: "体型"
    },
    options: {
      gender: {
        woman: "女性",
        man: "男性",
        trans: "跨性别",
        couple: "情侣",
        nonBinary: "非二元"
      },
      hair: {
        blonde: "金发",
        brunette: "棕发",
        black: "黑发",
        red: "红发",
        grey: "灰发",
        bald: "光头",
        other: "其他"
      },
      eyes: {
        brown: "棕色",
        blue: "蓝色",
        green: "绿色",
        hazel: "淡褐色",
        grey: "灰色",
        black: "黑色",
        other: "其他"
      },
      ethnicity: {
        white: "白人",
        latina: "拉丁裔",
        asian: "亚裔",
        black: "黑人",
        indian: "印度裔",
        middleEastern: "中东裔",
        mixed: "混血",
        other: "其他"
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
        enhanced: "隆胸"
      }
    },
    // The age, height and build tracks. Their ends are open: a handle resting on
    // one means no limit that way. All numbers arrive localized; heights
    // come with every unit — {min} and {max} in cm, {minFeet} {minInches}
    // {maxFeet} {maxInches} — so each language prints its own system.
    ageAny: "不限年龄",
    ageFrom: "{min} 岁及以上",
    ageUpTo: "{max} 岁及以下",
    ageRange: "{min}–{max} 岁",
    heightAny: "不限身高",
    heightFrom: "{min} cm 及以上",
    heightUpTo: "{max} cm 及以下",
    heightRange: "{min}–{max} cm",
    // build: {min} and {max} arrive as the words below, never as numbers
    bmiAny: "不限体型",
    bmiFrom: "{min}及以上",
    bmiUpTo: "{max}及以下",
    bmiRange: "{min}至{max}",
    // the build words, slimmest first — the range reads in these, not in
    // numbers
    build: {
      slender: "纤细",
      slim: "苗条",
      medium: "匀称",
      curvy: "有曲线",
      full: "丰腴"
    }
  },

  // The ? on a performer's profile: a disclaimer that profile details are
  // scraped and unchecked, and a correction report the reader sends from
  // their own email app. `email` is that email's text, in the reader's
  // language; {link} is the page address.
  report: {
    helpAria: "关于此资料 · 报告错误",
    title: "关于此资料",
    disclaimer:
      "资料信息来自合作网站和其他公开来源。IVDB 不对其进行核实，因此部分内容可能有误或已过时。",
    question: "发现错误了吗？请勾选有误的内容：",
    reason: {
      measurements: "三围、身高或体重",
      age: "年龄或生日",
      details: "其他信息（头发、眼睛、国家等）",
      media: "照片或视频中不是此人",
      self: "我是本人，希望更正或删除某些内容",
      other: "其他"
    },
    detailsLabel: "哪里有误，正确的应该是什么？（可选）",
    note: "这会打开你的邮件应用，并自动填好发给 IVDB 团队的报告。",
    send: "写邮件",
    email: {
      subject: "IVDB 资料更正：{name}",
      intro: "我想报告此演员资料中的错误。",
      nameLine: "演员：{name}",
      idLine: "演员 ID：{id}",
      linkLine: "页面：{link}",
      reasonsLine: "错误内容：",
      detailsLine: "详细说明：",
      profileLine: "资料当前内容："
    }
  },

  // Under the profile panel: two slideshows, one item at a time — photos
  // of them, and their videos (a preview clip, or the video's stills where
  // it has none). Settings can switch both off.
  media: {
    photos: "照片",
    reel: "精彩片段",
    // stand-in link text for a video with no title
    fromVideo: "打开视频",
    counter: "{index} / {total}",
    // what a screen reader calls the photo and clip players
    slideshow: "幻灯片",
    previous: "上一张",
    next: "下一张",
    previousVideo: "上一个视频",
    nextVideo: "下一个视频",
    // the slideshows' pause/play button
    pause: "暂停",
    play: "播放"
  },

  profile: {
    eyebrow: "演员",
    plays: "Script 播放 {count} 次",
    linkAria: "{site}(在新标签页打开)",
    // the two link cards: their own accounts, and their profile on each
    // partner site; {name} is the performer's, as the panel prints it
    socials: "社交媒体",
    moreOf: "更多{name}的内容",
    // {site} is the partner site's domain — "pornhub.com"
    partnerLinkAria: "{site} 上的个人主页(在新标签页打开)",
    about: "简介",
    hobbies: "爱好",
    details: "资料",
    born: "出生日期",
    age: "年龄",
    from: "来自",
    career: "从业经历",
    careerSpan: "{start}–{end} 年",
    careerSince: "{start} 年起",
    careerActive: "活跃",
    careerInactive: "已不活跃",
    height: "身高",
    weight: "体重",
    heightValue: "{cm} cm",
    weightValue: "{kg} kg",
    measurements: "三围",
    hair: "发色",
    eyes: "瞳色",
    ethnicity: "族裔",
    starSign: "星座",
    tattoos: "纹身",
    piercings: "穿孔",
    yes: "有",
    no: "无"
  }
};

export default performers;
