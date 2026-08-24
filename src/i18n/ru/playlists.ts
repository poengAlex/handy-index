import type enUS from "../en-US/playlists";

// The three playlist surfaces: the overview page, one playlist's own page
// (rename, delete, share/export, bulk script download) and the "add to
// playlist" dialog on a video.
//
// Playlist names are the user's own words — they are interpolated as {name}
// and never translated. Counts of playlists and videos come from
// `useFormat().count()`, so they are not repeated here.
const playlists: typeof enUS = {
  title: "Плейлисты",

  // the create row on the overview page and inside the add dialog
  newLabel: "Новый плейлист",
  newPlaceholder: "например, На выходные",
  nameLabel: "Название плейлиста",
  importHint: "Импорт плейлиста, выгруженного с этого сайта",

  emptyTitle: "Плейлистов пока нет",
  emptyBody:
    "Создай плейлист прямо здесь или нажми кнопку плейлиста на странице любого видео, чтобы начать с понравившегося.",

  import: {
    title: "Импорт плейлиста",
    placeholder: "Вставь выгрузку плейлиста (JSON) или ссылку pastes.dev",
    inputAria: "Текст выгрузки плейлиста или ссылка",
    chooseFile: "Выбрать файл…",
    // The name an export gets when the file carried none. It becomes the
    // playlist's name, so write a name, not a sentence.
    defaultName: "Импортированный плейлист",
    doneTitle: "Плейлист импортирован",
    doneBody:
      "«{name}» — {count} видео. | «{name}» — {count} видео. | «{name}» — {count} видео.",
    failedTitle: "Не удалось импортировать",
    // One key per `PlaylistImportFailure` in services/playlist-transfer.ts,
    // plus `unknown` for a throw from somewhere else entirely.
    error: {
      unreachable: "Не удалось связаться с сервисом ссылок.",
      linkDead: "Эта ссылка не отвечает — возможно, срок её действия истёк.",
      notJson: "Это не корректный JSON.",
      notExport: "Это не выгрузка плейлиста.",
      tooNew:
        "Файл выгружен более новой версией сайта. Перезагрузи страницу и попробуй снова.",
      malformed: "Плейлист в этом файле повреждён.",
      unknown: "При чтении выгрузки что-то пошло не так."
    }
  },

  // one playlist's page
  detail: {
    notFoundTitle: "Плейлист не найден",
    notFoundBody: "Этого плейлиста больше нет, либо ссылка неверна.",
    notFoundAction: "Все плейлисты",
    emptyTitle: "Здесь пока пусто",
    emptyBody: "Добавляй видео кнопкой плейлиста на странице любого видео.",
    // toggles the grid into remove-a-video mode; "Done" turns it back off
    edit: "Изменить",
    removeVideo: "Убрать из плейлиста",
    renameTitle: "Переименовать плейлист",
    deleteTitle: "Удалить «{name}»?",
    deleteBody: "Видео останутся в каталоге — исчезнет только плейлист.",
    deleteConfirm: "Удалить плейлист",
    deletedTitle: "Плейлист удалён",
    deletedBody: "Плейлиста «{name}» больше нет."
  },

  // share dialog: the export as JSON text, as a file, or as a paste link
  share: {
    title: "Поделиться плейлистом",
    open: "Поделиться плейлистом",
    openHint: "Поделиться плейлистом или выгрузить его",
    exportAria: "JSON-выгрузка плейлиста",
    linkAria: "Ссылка на плейлист",
    copyLink: "Скопировать ссылку",
    note: "Любой, у кого есть ссылка, сможет импортировать этот плейлист. Ссылка временная — она перестанет работать примерно через 90 дней.",
    copyJson: "Скопировать JSON",
    saveFile: "Сохранить файл",
    createLink: "Создать ссылку",
    newLink: "Новая ссылка",
    jsonCopied: "JSON скопирован",
    jsonCopyFailed: "Не удалось скопировать JSON",
    linkCopied: "Ссылка скопирована",
    linkCopiedBody:
      "Любой, у кого есть ссылка, сможет импортировать этот плейлист.",
    linkCopyFailed: "Не удалось скопировать ссылку",
    linkCreated: "Ссылка создана",
    linkFailedTitle: "Не удалось создать ссылку",
    linkFailedBody: "Сервис ссылок не ответил — скопируй JSON."
  },

  // downloading every free script in the playlist, one after another
  bulk: {
    label: "Скачать все scripts ({count})",
    progress: "Скачивание {done}/{total}…",
    keyPrompt:
      "Scripts привязаны к твоему Handy. Введи connection key из приложения Handy, чтобы продолжить.",
    // the explanation under this title is the shared one from
    // `services.scriptDownload.*` — same failure, same words as everywhere else
    failedTitle: "Не удалось скачать scripts",
    doneTitle: "Scripts скачаны",
    doneBody:
      "Сохранён {count} script. | Сохранено {count} scripts. | Сохранено {count} scripts.",
    // both counts in one sentence: the split between them is not the same
    // shape in every language
    partialBody: "Сохранено: {saved}, с ошибкой: {failed}."
  },

  // the dialog a video page opens to file that video
  add: {
    title: "Добавить в плейлист",
    empty: "Плейлистов пока нет — создай первый ниже."
  }
};

export default playlists;
