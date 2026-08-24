import type enUS from "../en-US/settings";

// The settings modal and the three dialogs that hang off it: clear-data, the
// first-visit consent gate, and the connection-key prompt. The language
// picker inside settings is `common.language.*`, because the same wording is
// used wherever a locale is offered.
const settings: typeof enUS = {
  title: "설정",

  // the toggle list at the top of the modal
  display: {
    darkModeLabel: "다크 모드",
    darkModeCaption: "어두운 색상 테마를 사용해요",
    nsfwLabel: "선정적 미리보기",
    nsfwCaption: "밋밋한 타일 대신 실제 이미지를 보여줘요",
    playersLabel: "내장 플레이어",
    playersCaption: "Pornhub와 xHamster 동영상을 상세 페이지에서 바로 재생해요",
    fullWidthLabel: "전체 너비 레이아웃",
    fullWidthCaption: "가운데 정렬된 단 대신 화면 전체를 사용해요",
    backgroundLabel: "애니메이션 배경",
    backgroundCaption:
      "모든 페이지 뒤에 부드럽게 움직이는 그라데이션을 보여줘요"
  },

  // The muted-tags row. `caption` pluralizes over the count itself rather
  // than taking a pre-counted noun phrase: Bokmål inflects the adjective with
  // the noun ("1 dempet tagg" / "2 dempede tagger"), which a `{tags}` slot
  // cannot express
  // ("3 tags") rather than a bare number, so the pluralization stays in
  // `common.count.tags` and this message only carries the verb.
  muted: {
    label: "차단한 태그",
    caption: "태그 {count}개 차단됨",
    empty: "차단한 태그 없음"
  },

  orientationTitle: "성향",

  access: {
    title: "이용 범위",
    premiumScriptsLabel: "유료 스크립트",
    premiumScriptsCaption:
      "파트너 사이트에서 스크립트를 유료로 파는 동영상도 포함해요",
    premiumVideosLabel: "유료 동영상",
    premiumVideosCaption: "파트너 사이트에서 유료로 파는 동영상도 포함해요"
  },

  previews: {
    title: "카드 미리보기",
    hint:
      "카드에 마우스를 올리거나 손가락으로 문지르면 미리보기가 나와요. " +
      "라벨을 누르면 그 속도가 원래대로 돌아가요.",
    imageSpeed: "이미지 속도",
    clipSpeed: "클립 속도"
  },

  // shared by the settings field and the connection-key prompt
  connectionKey: {
    label: "연결 키",
    placeholder: "예: a1B2c3D4e5",
    hint: "스크립트를 다운로드할 때 쓰는 Handy 연결 키예요."
  },

  clearDataAction: "데이터 지우기…",

  // ClearDataDialog. Every row names its own toast instead of sharing one
  // "{thing} cleared" template: the verb already differs per row in English
  // (a key is deleted, preferences are reset), and more so in Norwegian.
  clear: {
    title: "저장된 데이터 지우기",
    lead:
      "이 사이트가 기억하는 것은 전부 이 브라우저 안에만 있어요. 하나씩 " +
      "지우거나 한 번에 전부 지울 수 있어요.",
    clearAll: "모든 데이터 지우기",
    allToast: "모든 로컬 데이터를 지웠어요",

    recentLabel: "최근 본 동영상",
    recentToast: "최근 본 동영상을 지웠어요",
    favoritesLabel: "즐겨찾기",
    favoritesToast: "즐겨찾기를 지웠어요",
    playlistsLabel: "재생목록",
    playlistsToast: "재생목록을 지웠어요",
    mutedToast: "차단한 태그를 지웠어요",

    // the two halves of the ratings row's caption, printed side by side
    votesLabel: "평가 및 투표",
    votesEmpty: "기록 없음",
    votesToast: "평가와 투표를 지웠어요",
    ratingCount: "스크립트 평가 {count}개",
    requestVoteCount: "요청 투표 {count}표",

    keySaved: "이 기기에 저장됨",
    keyUnset: "설정 안 됨",
    keyToast: "연결 키를 지웠어요",

    preferencesLabel: "보기 설정",
    preferencesCaption:
      "선정적 미리보기, 성향, 이용 범위 필터, 미리보기 속도, 배경",
    preferencesToast: "보기 설정을 초기화했어요"
  },

  // ConsentDialog — the first-visit age gate. Legally load-bearing: every
  // condition the English states has to survive into every translation.
  consent: {
    title: "둘러보기 전에",
    body:
      "IVDB는 The Handy용 스크립트가 있는 인터랙티브 성인 동영상을 정리한 " +
      "카탈로그예요. 선정적 미리보기를 켜고 둘러보려면 만 18세 이상임을 " +
      "확인하세요. 확인하지 않고 계속하면 미리보기는 계속 숨겨진 채로 " +
      "남고, 설정에서 언제든 바꿀 수 있어요. 설정한 내용은 이 브라우저에만 " +
      "저장돼요.",
    decline: "미리보기 없이 계속",
    accept: "만 18세 이상이에요"
  },

  // ConnectionKeyDialog — shown when an action needs a key that isn't set
  keyPrompt: {
    title: "연결 키가 필요해요",
    body:
      "이 작업은 Handy와 연결돼 있어요. 계속하려면 Handy 앱에 있는 " +
      "연결 키를 입력하세요.",
    hint:
      "키가 작동하려면 Handy가 켜져 있고 온라인 상태여야 해요. 기기가 " +
      "오프라인이면 키를 잘못 넣었을 때와 똑같은 방식으로 실패해요.",
    save: "저장하고 계속"
  }
};

export default settings;
