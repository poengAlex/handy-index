import type enUS from "../en-US/playlists";

// The three playlist surfaces: the overview page, one playlist's own page
// (rename, delete, share/export, bulk script download) and the "add to
// playlist" dialog on a video.
//
// Playlist names are the user's own words — they are interpolated as {name}
// and never translated. Counts of playlists and videos come from
// `useFormat().count()`, so they are not repeated here.
const playlists: typeof enUS = {
  title: "播放列表",

  // the create row on the overview page and inside the add dialog
  newLabel: "新建播放列表",
  newPlaceholder: "例如：周末精选",
  nameLabel: "播放列表名称",
  importHint: "导入从本站导出的播放列表",

  emptyTitle: "还没有播放列表",
  emptyBody:
    "就在这里创建一个，或者在任意视频页点播放列表按钮，从你喜欢的视频开始。",

  import: {
    title: "导入播放列表",
    placeholder: "粘贴播放列表导出内容（JSON）或 pastes.dev 链接",
    inputAria: "播放列表导出文本或分享链接",
    chooseFile: "选择文件…",
    // The name an export gets when the file carried none. It becomes the
    // playlist's name, so write a name, not a sentence.
    defaultName: "导入的播放列表",
    doneTitle: "播放列表已导入",
    doneBody: "“{name}”——{count} 个视频。",
    failedTitle: "无法导入",
    // One key per `PlaylistImportFailure` in services/playlist-transfer.ts,
    // plus `unknown` for a throw from somewhere else entirely.
    error: {
      unreachable: "无法连接分享链接服务。",
      linkDead: "这个分享链接没有响应——可能已经过期。",
      notJson: "这个文件不是有效的 JSON。",
      notExport: "这个文件不是播放列表导出文件。",
      tooNew: "这个文件是由更新版本的本站导出的。刷新页面后重试。",
      malformed: "文件里的播放列表格式有误。",
      unknown: "读取导出内容时出错。"
    }
  },

  // one playlist's page
  detail: {
    notFoundTitle: "未找到播放列表",
    notFoundBody: "这个播放列表已经不存在了，或者链接有误。",
    notFoundAction: "全部播放列表",
    emptyTitle: "这里还是空的",
    emptyBody: "在任意视频页点播放列表按钮，就能把视频加到这里。",
    // toggles the grid into remove-a-video mode; "Done" turns it back off
    edit: "编辑",
    removeVideo: "移出播放列表",
    renameTitle: "重命名播放列表",
    deleteTitle: "删除“{name}”？",
    deleteBody: "视频仍在片库里——消失的只是这个播放列表。",
    deleteConfirm: "删除播放列表",
    deletedTitle: "播放列表已删除",
    deletedBody: "“{name}”没了。"
  },

  // share dialog: the export as JSON text, as a file, or as a paste link
  share: {
    title: "分享播放列表",
    open: "分享播放列表",
    openHint: "分享或导出这个播放列表",
    exportAria: "播放列表导出 JSON",
    linkAria: "分享链接",
    copyLink: "复制分享链接",
    note: "任何拿到链接的人都能导入这个播放列表。分享内容是临时的——大约 90 天后过期。",
    copyJson: "复制 JSON",
    saveFile: "保存文件",
    createLink: "创建分享链接",
    newLink: "新的分享链接",
    jsonCopied: "JSON 已复制",
    jsonCopyFailed: "无法复制 JSON",
    linkCopied: "分享链接已复制",
    linkCopiedBody: "任何拿到链接的人都能导入这个播放列表。",
    linkCopyFailed: "无法复制链接",
    linkCreated: "分享链接已创建",
    linkFailedTitle: "无法创建分享链接",
    linkFailedBody: "分享链接服务没有响应。改为复制 JSON。"
  },

  // downloading every free script in the playlist, one after another
  bulk: {
    label: "获取全部 scripts（{count}）",
    progress: "正在获取 {done}/{total}…",
    keyPrompt: "Scripts 与你的 Handy 绑定。输入 Handy 应用里的 connection key 以继续。",
    // the explanation under this title is the shared one from
    // `services.scriptDownload.*` — same failure, same words as everywhere else
    failedTitle: "无法获取 scripts",
    doneTitle: "Scripts 已下载",
    doneBody: "已保存 {count} 个 script。",
    // both counts in one sentence: the split between them is not the same
    // shape in every language
    partialBody: "已保存 {saved} 个，失败 {failed} 个。"
  },

  // the dialog a video page opens to file that video
  add: {
    title: "添加到播放列表",
    empty: "还没有播放列表——在下面建第一个。"
  }
};

export default playlists;
