import type enUS from "../en-US/performers";

// The performer directory (/performers): a grid of avatar cards with a name
// search, a sort control and endless scroll. Same page shape as `sites` — a
// header count line, a search box and two empty states — so the key names are
// kept parallel with that namespace on purpose.
const performers: typeof enUS = {
  title: "출연자",

  search: {
    placeholder: "출연자 검색",
    aria: "이름으로 출연자 검색"
  },

  sort: {
    aria: "출연자 정렬",
    count: "동영상 많은 순",
    plays: "재생 많은 순",
    rating: "평점 높은 순",
    // an alphabet range, so it changes with the language
    name: "이름순",
    // the profile properties with an order; they start low to high
    age: "나이",
    height: "키",
    weight: "몸무게",
    bmi: "체형",
    cup: "컵 사이즈",
    // under the controls while a profile property is the sort
    unknownLast:
      "프로필에 정보가 없는 출연자는 순서와 상관없이 맨 뒤에 나와요.",
    profilesError:
      "이 정렬에는 모든 프로필이 필요한데 내려받지 못했어요. 연결을 확인하고 다시 시도해 주세요.",
    // Four whole messages rather than one with a {direction} param: the
    // button says what the order *is* and what clicking does, and neither
    // language builds that sentence from the same pieces.
    descAria: "내림차순 정렬 — 순서 뒤집기",
    ascAria: "오름차순 정렬 — 순서 뒤집기",
    descTitle: "내림차순 정렬 — 누르면 순서가 뒤집혀요",
    ascTitle: "오름차순 정렬 — 누르면 순서가 뒤집혀요"
  },

  // the star chip on a card; Norwegian puts a space before the percent sign
  ratingBadge: "★ {rating}%",

  // the value a card shows while the list is sorted by a profile property;
  // all numbers arrive localized, heights and weights with every unit
  card: {
    age: "{age}세",
    height: "{cm} cm",
    weight: "{kg} kg",
    cup: "{cup}컵"
  },

  errorTitle: "출연자를 불러오지 못했어요",
  hiddenBody:
    "유료 필터와 차단한 태그가 모든 출연자를 가리고 있어요. 설정에서 조건을 풀어 보세요.",
  noMatchTitle: "일치하는 출연자가 없어요",
  noMatchBody:
    "색인에 「{query}」 검색 결과가 없어요. 더 짧은 이름으로 찾아 보세요.",

  // The property filters: a dialog of toggle pills per facet (hair, eyes, …)
  // and a track each for age and height, plus one chip per facet in use on
  // the page. Every value is folded from the profiles' free text into a few
  // groups, so these name the groups, not anything a site wrote.
  filters: {
    title: "출연자 필터",
    lead: "프로필에 이 정보가 모두 적혀 있지는 않아요. 필터는 고른 조건이 프로필에 적힌 출연자만 보여 줘요.",
    errorTitle: "프로필을 불러오지 못했어요",
    errorBody:
      "필터에는 모든 출연자의 프로필이 필요한데 내려받지 못했어요. 연결을 확인하고 다시 시도해 주세요.",
    noMatchBody:
      "이 필터를 모두 만족하는 출연자가 색인에 없어요. 조건을 몇 개 빼 보세요.",
    // an active-filter chip on the page; {facet} is one of the facets below,
    // {value} its picks joined with "or" ("Blonde or Red") or an age or
    // height band as the track prints it
    chip: "{facet}: {value}",
    facets: {
      gender: "성별",
      hair: "머리 색",
      eyes: "눈 색",
      ethnicity: "인종",
      cup: "컵 사이즈",
      // natural or enhanced breasts
      natural: "가슴",
      tattoos: "타투",
      piercings: "피어싱",
      age: "나이",
      height: "키",
      bmi: "체형"
    },
    options: {
      gender: {
        woman: "여성",
        man: "남성",
        trans: "트랜스",
        couple: "커플",
        nonBinary: "논바이너리"
      },
      hair: {
        blonde: "금발",
        brunette: "갈색",
        black: "검정",
        red: "빨강",
        grey: "회색",
        bald: "대머리",
        other: "기타"
      },
      eyes: {
        brown: "갈색",
        blue: "파랑",
        green: "초록",
        hazel: "헤이즐",
        grey: "회색",
        black: "검정",
        other: "기타"
      },
      ethnicity: {
        white: "백인",
        latina: "라티나",
        asian: "아시아계",
        black: "흑인",
        indian: "인도계",
        middleEastern: "중동계",
        mixed: "혼혈",
        other: "기타"
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
        natural: "자연",
        enhanced: "수술"
      }
    },
    // The age, height and build tracks. Their ends are open: a handle resting on
    // one means no limit that way. All numbers arrive localized; heights
    // come with every unit — {min} and {max} in cm, {minFeet} {minInches}
    // {maxFeet} {maxInches} — so each language prints its own system.
    ageAny: "모든 나이",
    ageFrom: "{min}세 이상",
    ageUpTo: "{max}세 이하",
    ageRange: "{min}–{max}세",
    heightAny: "모든 키",
    heightFrom: "{min} cm 이상",
    heightUpTo: "{max} cm 이하",
    heightRange: "{min}–{max} cm",
    // build: {min} and {max} arrive as the words below, never as numbers
    bmiAny: "모든 체형",
    bmiFrom: "{min} 이상",
    bmiUpTo: "{max} 이하",
    bmiRange: "{min}~{max}",
    // the build words, slimmest first — the range reads in these, not in
    // numbers
    build: {
      slender: "가녀린",
      slim: "슬림한",
      medium: "보통",
      curvy: "볼륨 있는",
      full: "풍만한"
    }
  },

  // The ? on a performer's profile: a disclaimer that profile details are
  // scraped and unchecked, and a correction report the reader sends from
  // their own email app. `email` is that email's text, in the reader's
  // language; {link} is the page address.
  report: {
    helpAria: "이 프로필에 대해 · 오류 신고",
    title: "이 프로필에 대해",
    disclaimer:
      "프로필 정보는 파트너 사이트와 기타 공개 자료에서 가져와요. IVDB가 확인하지 않기 때문에 일부는 틀리거나 오래된 정보일 수 있어요.",
    question: "오류를 발견했나요? 틀린 항목을 선택해 주세요:",
    reason: {
      measurements: "신체 치수, 키 또는 몸무게",
      age: "나이 또는 생일",
      details: "기타 정보(머리, 눈, 국가 등)",
      media: "사진이나 동영상이 이 사람이 아니에요",
      self: "제가 본인이고, 정보를 수정하거나 삭제하고 싶어요",
      other: "기타"
    },
    detailsLabel: "무엇이 틀렸고, 어떻게 되어야 하나요? (선택)",
    note: "이메일 앱이 열리고, IVDB 팀에게 보낼 신고 내용이 미리 채워져 있어요.",
    send: "이메일 쓰기",
    email: {
      subject: "IVDB 프로필 수정 요청: {name}",
      intro: "이 출연자 프로필의 오류를 신고합니다.",
      nameLine: "출연자: {name}",
      idLine: "출연자 ID: {id}",
      linkLine: "페이지: {link}",
      reasonsLine: "틀린 항목:",
      detailsLine: "자세한 내용:",
      profileLine: "현재 프로필 내용:"
    }
  },

  // Under the profile panel: two slideshows, one item at a time — photos
  // of them, and their videos (a preview clip, or the video's stills where
  // it has none). Settings can switch both off.
  media: {
    photos: "사진",
    reel: "클립",
    // stand-in link text for a video with no title
    fromVideo: "동영상 열기",
    counter: "{index} / {total}",
    // what a screen reader calls the photo and clip players
    slideshow: "슬라이드쇼",
    previous: "이전 사진",
    next: "다음 사진",
    previousVideo: "이전 동영상",
    nextVideo: "다음 동영상",
    // the slideshows' pause/play button
    pause: "일시정지",
    play: "재생"
  },

  profile: {
    eyebrow: "출연자",
    plays: "Script 재생 {count}회",
    linkAria: "{site} — 새 탭에서 열려요",
    // the two link cards: their own accounts, and their profile on each
    // partner site; {name} is the performer's, as the panel prints it
    socials: "소셜 미디어",
    moreOf: "{name} 더 보기",
    // {site} is the partner site's domain — "pornhub.com"
    partnerLinkAria: "{site} 프로필 — 새 탭에서 열려요",
    about: "소개",
    hobbies: "취미",
    details: "프로필",
    born: "생년월일",
    age: "나이",
    from: "출신",
    career: "경력",
    careerSpan: "{start}–{end}년",
    careerSince: "{start}년부터",
    careerActive: "활동 중",
    careerInactive: "활동 중단",
    height: "키",
    weight: "몸무게",
    heightValue: "{cm} cm",
    weightValue: "{kg} kg",
    measurements: "신체 사이즈",
    hair: "머리 색",
    eyes: "눈 색",
    ethnicity: "인종",
    starSign: "별자리",
    tattoos: "타투",
    piercings: "피어싱",
    yes: "있음",
    no: "없음"
  }
};

export default performers;
