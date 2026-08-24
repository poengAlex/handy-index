import type enUS from "../en-US/privacy";

// The privacy & terms page at /privacy. Every sentence here is a factual
// claim about what the site stores, what leaves the browser and who may use
// it — translate the claim, never a looser version of it. `apiBody` and
// `contact.body` are rendered through <i18n-t> with the anchors supplied as
// named slots, so the link text lives in its own key and the sentence stays
// one unit whose word order a translator is free to move.
const privacy: typeof enUS = {
  title: "개인정보와 이용약관",

  // Shown only when the page is being read in a translation — the English
  // wording is the one the site is held to, and a reader of the Norwegian
  // needs to know that before the first claim, not after the last.
  authoritativeNotice:
    "이 페이지는 번역본이에요. 두 판본의 내용이 다르면 기준이 되는 것은 영어 원문이에요.",

  intro:
    "IVDB는 Handy 스크립트가 있는 동영상을 모아 둔 카탈로그이고, Handy 팀(Ohdoki AS)이 운영해요. 이 페이지는 사이트가 여러분의 데이터를 어떻게 다루는지 설명해요. 짧게 말하면, 가능한 한 적게 다뤄요.",

  what: {
    title: "이 사이트는 무엇인가요",
    body: "이 사이트는 스크립트가 있는 동영상을 목록으로 보여주고, 스크립트와 실제 콘텐츠를 제공하는 파트너 사이트로 연결해 줘요. 동영상은 저희 서버에 저장하지 않아요. 저장하는 것은 스크립트뿐이에요. Handy 사용자는 무료로 둘러볼 수 있어요.",
    apiBody:
      "이 사이트는 공개된 스크립트 색인 API 위에 만들었어요. 직접 만드는 프로젝트에도 자유롭게 쓰세요: {apiDocs}. 사이트 자체도 투명성을 위해 오픈 소스로 공개하고 있어요: {repo}.",
    apiDocsLink: "API 문서",
    repoLink: "GitHub 저장소"
  },

  local: {
    title: "이 브라우저에만 남는 것",
    intro:
      "계정도, 쿠키도, 분석 도구도 없어요. 설정한 내용은 모두 이 브라우저의 로컬 저장소에만 저장돼요:",
    item: {
      consent: "첫 방문 동의 창에서 고른 답변",
      previews: "선정적 미리보기(NSFW) 설정",
      orientation: "성향 필터",
      accessFilters: "스크립트와 동영상 이용 범위 필터",
      favorites: "즐겨찾기",
      votes: "동영상 요청에 던진 표",
      connectionKey: "Handy 연결 키"
    },
    outro:
      "다른 기기에서 사이트를 열거나 브라우저 데이터를 지우면 이 내용은 사라져요. 서버에서 되살릴 수 있는 것은 없어요. 분석 도구가 없다는 건 오류가 일어나도 저희 눈에 보이지 않는다는 뜻이니, 버그 제보는 언제나 환영이에요."
  },

  catalog: {
    title: "카탈로그의 출처",
    body: "카탈로그와 메타데이터, 스크립트는 handyfeeling.com 스크립트 색인 API에서 불러와요. 스크립트를 내려받거나, 동영상을 요청하거나, 요청에 투표할 때 연결 키가 인증 정보로 그 API에 전송돼요. 여러분이 입력한 것이 브라우저 밖으로 나가는 경우는 이때뿐이에요."
  },

  thirdParty: {
    title: "제3자 사이트",
    body: "동영상 페이지는 그 동영상을 제공하는 파트너 사이트로 연결돼요. 이들은 각자의 개인정보 처리방침과 각자의 분석 도구를 갖춘 제3자 성인 사이트예요. IVDB를 떠나는 순간부터는 그쪽 규칙이 적용돼요. 선정적 미리보기를 켜면 썸네일을 파트너 사이트에서 바로 불러오기 때문에, 브라우저가 보내는 요청이 그쪽 서버에 기록될 수 있어요. 이 점이 신경 쓰인다면 미리보기를 꺼 두거나 VPN을 쓰세요."
  },

  age: {
    title: "연령 제한",
    body: "이 사이트는 성인 콘텐츠를 색인하며 성인만 이용할 수 있어요. 만 18세 이상, 또는 거주 지역의 성년 연령 이상이어야 이용할 수 있어요."
  },

  choices: {
    title: "선택 바꾸기",
    body: "첫 방문 창에서 고른 것 가운데 되돌릴 수 없는 것은 없어요. 선정적 미리보기, 성향, 스크립트와 동영상 이용 범위 필터는 상단 바의 설정 창에서 언제든 바꿀 수 있어요."
  },

  contact: {
    title: "문의",
    body: "질문, 버그 제보, 삭제 요청은 이곳으로: {email}"
  }
};

export default privacy;
