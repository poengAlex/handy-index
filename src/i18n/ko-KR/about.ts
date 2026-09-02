import type enUS from "../en-US/about";

const about: typeof enUS = {
  title: "IVDB 소개",
  body: "IVDB는 Handy 스크립트가 있는 영상을 모아 둔 목록입니다. Ohdoki AS의 Handy 팀이 만들고, 무료로 볼 수 있습니다.",
  beta: "이 버전은 아직 베타입니다. 완성되지 않은 부분도 있고 고장 난 부분도 있을 겁니다. 발견하면 알려주세요.",

  version: "버전 {version}",
  built: "빌드 날짜 {date}",
  copyright: "© {year} Ohdoki AS",

  changelog: {
    title: "새로운 소식",
    lead: "사이트 변경 내용을 최신순으로 보여 줍니다.",
    englishOnly: "이 목록은 영어로만 쓰여 있습니다.",
    errorTitle: "변경 내용을 불러오지 못했습니다",
    errorBody:
      "목록을 불러오지 못했습니다. 연결을 확인한 뒤 다시 시도해 주세요."
  }
};

export default about;
