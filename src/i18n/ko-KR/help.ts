import type enUS from "../en-US/help";

// The feature tour at /help — one row per capability, grouped the way people
// actually use the site. Every `label` is a short feature name; every
// `caption` is the single sentence sitting under it. Keep captions to one
// sentence: the row truncates nothing, but a second sentence turns the list
// into documentation, which is what this page exists to replace.
const help: typeof enUS = {
  title: "도움말",
  lead: "이 사이트에서 할 수 있는 모든 것을 한곳에 모았어요. 화살표가 있는 항목을 누르면 바로 그 화면으로 넘어가요.",

  finding: {
    title: "동영상 찾기",
    search: {
      label: "검색과 필터",
      caption:
        "제목으로 검색한 뒤 태그, 사이트, 출연자, VR, 길이로 좁혀 보세요 — 모든 필터가 URL에 담기니 결과를 그대로 공유할 수 있어요"
    },
    sort: {
      label: "원하는 방식으로 정렬",
      caption:
        "최근 추가순, 평점 높은 순, 재생 많은 순 등으로 정렬하고, 정렬 옆 화살표 버튼으로 순서를 뒤집을 수 있어요"
    },
    tags: {
      label: "태그 클라우드",
      caption:
        "차단한 태그를 뺀 카탈로그의 모든 태그를 검색하고 정렬할 수 있고, 한 번 누르면 동영상 목록에 필터로 걸려요"
    },
    performers: {
      label: "출연자",
      caption: "출연작이 많은 순서로 출연자를 둘러볼 수 있어요"
    },
    sites: {
      label: "사이트",
      caption: "색인에 있는 모든 제휴 사이트를 동영상 수와 함께 보여줘요"
    }
  },

  library: {
    title: "내 보관함",
    favorites: {
      label: "즐겨찾기",
      caption:
        "동영상에 하트를 누르면 언제든 바로 꺼내 볼 수 있어요 — 이 기기에만 저장돼요"
    },
    playlists: {
      label: "재생목록",
      caption:
        "어떤 동영상으로든 재생목록을 만들고, 이름을 바꾸고, 다듬을 수 있어요"
    },
    transfer: {
      label: "재생목록 공유·가져오기·내보내기",
      caption:
        "재생목록을 파일로, 복사할 수 있는 JSON 텍스트로, 또는 임시 공유 링크로 옮길 수 있고, 셋 중 어떤 방식으로든 가져올 수도 있어요"
    },
    bulkDownload: {
      label: "Script 한 번에 받기",
      caption:
        "재생목록에서 한 번만 누르면 그 안의 무료 script를 모두 다운로드해요"
    },
    quickMenu: {
      label: "빠른 메뉴",
      caption:
        "동영상 썸네일을 오른쪽 클릭(또는 길게 누르기)하면 즐겨찾기, 재생목록, 링크 복사 등을 바로 쓸 수 있어요"
    }
  },

  scripts: {
    title: "Script와 Handy",
    free: {
      label: "무료 script",
      caption:
        "무료로 표시된 동영상은 Handy connection key 값으로 script를 다운로드할 수 있어요"
    },
    rate: {
      label: "Script 평가",
      caption: "무료 script는 동영상 페이지에서 바로 별점을 매길 수 있어요"
    },
    comments: {
      label: "Script 댓글",
      caption: "Script에 달린 익명 댓글을 읽고, 직접 남길 수도 있어요"
    },
    requests: {
      label: "동영상 요청",
      caption:
        "어떤 동영상이든 script를 요청하고, 다음에 무엇을 만들지 투표할 수 있어요"
    }
  },

  personalize: {
    title: "내 취향대로",
    previews: {
      label: "선정적 미리보기",
      caption: "기본은 꺼짐이에요 — 설정에서 이미지를 켤 수 있어요"
    },
    players: {
      label: "내장 플레이어",
      caption:
        "기본은 꺼짐이에요 — 켜면 Pornhub와 xHamster 동영상을 동영상 페이지에서 바로 볼 수 있어요 (재생은 Handy와 동기화되지 않아요)"
    },
    filters: {
      label: "성향·script·동영상 필터",
      caption:
        "Script와 동영상을 무료만 볼지 유료까지 볼지, 그리고 누가 나오는 동영상을 볼지 — 설정에서, 또는 둘러보기 필터에서 바로 정할 수 있어요"
    },
    mutedTags: {
      label: "차단한 태그",
      caption:
        "태그를 차단하면 그 태그가 붙은 동영상이 카탈로그에서 모두 빠져요 — 태그를 오른쪽 클릭하거나 설정에서 목록을 관리하세요"
    },
    theme: {
      label: "라이트·다크 테마",
      caption: "상단 바에서 전환하면 고른 테마가 모든 화면에 그대로 이어져요"
    },
    share: {
      label: "공유",
      caption:
        "모든 동영상 페이지와 필터를 건 결과 목록에는 공유할 수 있는 링크가 있어요"
    }
  },

  about: {
    title: "이 사이트 소개",
    appCaption: "이 사이트가 무엇인지, 누가 만드는지, 사용 중인 버전",
    changelogCaption: "사이트에서 바뀐 모든 내용, 최신순",
    privacyCaption:
      "무엇이 저장되는지, 무엇이 브라우저를 떠나는지, 그리고 연령 제한"
  }
};

export default help;
