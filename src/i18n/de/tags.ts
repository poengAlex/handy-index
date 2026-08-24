import type enUS from "../en-US/tags";

// The tag cloud at /tags: every tag in the visible catalog as a clickable
// pill, searchable and sortable, plus the long index-download wait it sits
// behind and the right-click menu that mutes a tag.
const tags: typeof enUS = {
  title: "Schlagwörter",
  errorTitle: "Schlagwörter konnten nicht geladen werden",

  // The cloud can't draw a pill until the whole ~40 MB index is in, so the
  // wait gets a phase, a percentage and a reason it's worth it.
  loading: {
    barLabel: "Schlagwörter werden geladen",
    // Norwegian puts a space before the percent sign, so this is a message
    // rather than a bare "%" glued on in the template. German wants it too,
    // as a non-breaking space (U+00A0) so the figure never wraps.
    percent: "{percent} %",
    downloading: "Script-Index wird heruntergeladen",
    parsing: "Index wird gelesen",
    noteParsing: "Alles da — wird jetzt in Schlagwörter sortiert.",
    note: "{received} von ~{total} MB entpackt — der ganze Katalog, einmal geladen, danach ist jede Seite sofort da.",
    // the expected total is only last visit's size, so an index that grew
    // since gets a line that doesn't print "44 of ~41 MB"
    noteOversize: "{received} MB entpackt — der ganze Katalog, einmal geladen."
  },

  controls: {
    searchPlaceholder: "Schlagwörter suchen",
    searchLabel: "Schlagwörter suchen",
    sortLabel: "Schlagwörter sortieren",
    sortByCount: "Meiste Videos",
    // the alphabet's first and last letter — Norwegian ends at Å
    sortByName: "A–Z",
    sortedDescLabel: "Absteigend sortiert — umkehren",
    sortedAscLabel: "Aufsteigend sortiert — umkehren",
    sortedDescTitle: "Absteigend sortiert — zum Umkehren klicken",
    sortedAscTitle: "Aufsteigend sortiert — zum Umkehren klicken",
    muted: "Stumm",
    mutedCount: "Stumm ({count})"
  },

  empty: {
    searchTitle: "Keine passenden Schlagwörter",
    searchBody: "Nichts im Index passt zu „{query}“.",
    filteredBody:
      "Deine Filter und stummgeschalteten Schlagwörter verbergen jedes Schlagwort im Index. Lockere sie in den Einstellungen.",
    filteredAction: "Stummgeschaltete Schlagwörter"
  },

  menu: {
    browse: "Nach diesem Schlagwort filtern",
    mute: "Dieses Schlagwort stummschalten"
  },

  toast: {
    refusedTitle: "„{tag}“ lässt sich nicht stummschalten",
    refusedBody:
      "Orientierungs-Schlagwörter bestimmen, welchen Katalog du siehst — ändere das in den Einstellungen.",
    mutedTitle: "„{tag}“ stummgeschaltet",
    mutedBody:
      "Das Schlagwort steht jetzt in deiner Liste — du kannst die Stummschaltung jederzeit aufheben."
  }
};

export default tags;
