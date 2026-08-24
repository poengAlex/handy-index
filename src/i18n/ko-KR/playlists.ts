import type enUS from "../en-US/playlists";

// The three playlist surfaces: the overview page, one playlist's own page
// (rename, delete, share/export, bulk script download) and the "add to
// playlist" dialog on a video.
//
// Playlist names are the user's own words — they are interpolated as {name}
// and never translated. Counts of playlists and videos come from
// `useFormat().count()`, so they are not repeated here.
const playlists: typeof enUS = {
  title: "재생목록",

  // the create row on the overview page and inside the add dialog
  newLabel: "새 재생목록",
  newPlaceholder: "예: 주말에 볼 것",
  nameLabel: "재생목록 이름",
  importHint: "이 사이트에서 내보낸 재생목록을 가져와요",

  emptyTitle: "재생목록이 아직 없어요",
  emptyBody:
    "여기에서 바로 만들거나, 마음에 드는 동영상 페이지의 재생목록 버튼으로 하나 시작해 보세요.",

  import: {
    title: "재생목록 가져오기",
    placeholder:
      "재생목록 내보내기 파일(JSON)이나 pastes.dev 링크를 붙여 넣으세요",
    inputAria: "재생목록 내보내기 텍스트 또는 공유 링크",
    chooseFile: "파일 선택…",
    // The name an export gets when the file carried none. It becomes the
    // playlist's name, so write a name, not a sentence.
    defaultName: "가져온 재생목록",
    doneTitle: "재생목록을 가져왔어요",
    doneBody: "「{name}」 — 동영상 {count}개.",
    failedTitle: "가져오지 못했어요",
    // One key per `PlaylistImportFailure` in services/playlist-transfer.ts,
    // plus `unknown` for a throw from somewhere else entirely.
    error: {
      unreachable: "공유 링크 서비스에 연결하지 못했어요.",
      linkDead: "그 공유 링크가 응답하지 않아요. 만료됐을 수 있어요.",
      notJson: "그 파일은 올바른 JSON이 아니에요.",
      notExport: "그 파일은 재생목록 내보내기 파일이 아니에요.",
      tooNew:
        "그 파일은 이 사이트의 더 새로운 버전에서 내보낸 거예요. 페이지를 새로 고친 뒤 다시 시도해 보세요.",
      malformed: "그 파일에 든 재생목록의 형식이 잘못됐어요.",
      unknown: "내보내기 파일을 읽는 중에 문제가 생겼어요."
    }
  },

  // one playlist's page
  detail: {
    notFoundTitle: "재생목록을 찾을 수 없어요",
    notFoundBody: "이 재생목록은 더 이상 없거나, 링크가 잘못됐어요.",
    notFoundAction: "전체 재생목록",
    emptyTitle: "여기엔 아직 아무것도 없어요",
    emptyBody: "동영상 페이지의 재생목록 버튼으로 여기에 동영상을 추가하세요.",
    // toggles the grid into remove-a-video mode; "Done" turns it back off
    edit: "편집",
    removeVideo: "재생목록에서 제거",
    renameTitle: "재생목록 이름 변경",
    deleteTitle: "「{name}」 재생목록을 삭제할까요?",
    deleteBody: "동영상은 카탈로그에 그대로 남아요. 재생목록만 사라져요.",
    deleteConfirm: "재생목록 삭제",
    deletedTitle: "재생목록을 삭제했어요",
    deletedBody: "「{name}」 재생목록이 사라졌어요."
  },

  // share dialog: the export as JSON text, as a file, or as a paste link
  share: {
    title: "재생목록 공유",
    open: "재생목록 공유",
    openHint: "이 재생목록을 공유하거나 내보내요",
    exportAria: "재생목록 내보내기 JSON",
    linkAria: "공유 링크",
    copyLink: "공유 링크 복사",
    note: "링크가 있는 사람은 누구나 이 재생목록을 가져갈 수 있어요. 공유 링크는 임시라서 약 90일 뒤에 만료돼요.",
    copyJson: "JSON 복사",
    saveFile: "파일로 저장",
    createLink: "공유 링크 만들기",
    newLink: "새 공유 링크",
    jsonCopied: "JSON을 복사했어요",
    jsonCopyFailed: "JSON을 복사하지 못했어요",
    linkCopied: "공유 링크를 복사했어요",
    linkCopiedBody: "링크가 있는 사람은 누구나 이 재생목록을 가져갈 수 있어요.",
    linkCopyFailed: "링크를 복사하지 못했어요",
    linkCreated: "공유 링크를 만들었어요",
    linkFailedTitle: "공유 링크를 만들지 못했어요",
    linkFailedBody:
      "공유 링크 서비스가 응답하지 않았어요. 대신 JSON을 복사하세요."
  },

  // downloading every free script in the playlist, one after another
  bulk: {
    label: "Script 전체 받기 ({count})",
    progress: "{done}/{total} 받는 중…",
    keyPrompt:
      "Script는 Handy와 연결돼 있어요. 계속하려면 Handy 앱에 있는 connection key 값을 입력하세요.",
    // the explanation under this title is the shared one from
    // `services.scriptDownload.*` — same failure, same words as everywhere else
    failedTitle: "Script를 받지 못했어요",
    doneTitle: "Script를 다운로드했어요",
    doneBody: "Script {count}개를 저장했어요.",
    // both counts in one sentence: the split between them is not the same
    // shape in every language
    partialBody: "{saved}개 저장, {failed}개 실패."
  },

  // the dialog a video page opens to file that video
  add: {
    title: "재생목록에 추가",
    empty: "재생목록이 아직 없어요. 아래에서 첫 재생목록을 만들어 보세요."
  }
};

export default playlists;
