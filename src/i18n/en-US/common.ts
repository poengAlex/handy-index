// Vocabulary shared by more than one surface. Same admission rule as the
// component menu in ARCHITECTURE.md: a string is promoted here on its
// *second* consumer — a phrase used once belongs in its feature namespace,
// where a translator can see the context it is used in.
//
// Plural messages carry a `{count}` named param instead of vue-i18n's bare
// `{n}`, because the count has to be run through `$n()` first so 15000 reads
// "15,000" in English and "15 000" in Norwegian. Call them as
// `$t("common.count.videos", { count: $n(x) }, x)`.
export default {
  action: {
    backToHome: "Back to home",
    browseVideos: "Browse videos",
    cancel: "Cancel",
    clear: "Clear",
    clearFilters: "Clear filters",
    clearSearch: "Clear search",
    create: "Create",
    delete: "Delete",
    done: "Done",
    import: "Import",
    manage: "Manage",
    rename: "Rename",
    retry: "Try again",
    save: "Save",
    share: "Share"
  },

  state: {
    catalogErrorTitle: "Couldn't load the catalog",
    catalogErrorBody:
      "The script index didn't answer. Check your connection and try again.",
    emptyTitle: "Nothing to show"
  },

  // "12 of 340 tags" — the shown/total pair every filtered listing prints.
  //
  // One message per noun, rather than a generic "{shown} of {total}" handed a
  // pre-counted total. Japanese, Korean and Chinese attach a counter to *both*
  // numbers and the counter is chosen by the noun (動画→本, タグ→個, 出演者→人),
  // which a shared message cannot express — all four CJK/Slavic reviewers
  // independently reported the generic form as their worst string. Russian
  // needs it too: the noun after the total declines with it.
  //
  // Both numbers arrive bare through `$n()`; the plural branch is chosen by
  // the *total*, not by what is shown.
  ofTotal: {
    videos: "{shown} of {total} video | {shown} of {total} videos",
    performers: "{shown} of {total} performer | {shown} of {total} performers",
    tags: "{shown} of {total} tag | {shown} of {total} tags"
  },

  count: {
    performers: "{count} performer | {count} performers",
    playlists: "{count} playlist | {count} playlists",
    requests: "{count} request | {count} requests",
    sites: "{count} site | {count} sites",
    tags: "{count} tag | {count} tags",
    videos: "{count} video | {count} videos",
    votes: "{count} vote | {count} votes"
  },

  // Duration is assembled from parts rather than formatted in the service:
  // Norwegian abbreviates hours "t", not "h", and only the message layer
  // knows that. `durationParts()` in services/format.ts picks which key.
  duration: {
    hoursMinutes: "{hours} h {minutes} min",
    hours: "{hours} h",
    minutes: "{minutes} min",
    seconds: "{seconds} s"
  },

  justNow: "just now",

  // Shared by the settings radio group, the browse filters and the header
  // switcher — the same "can't drift apart" reason ORIENTATION_LABELS gave
  // for living in queries.ts, which is where these strings came from.
  orientation: {
    straight: "Straight",
    gay: "Gay",
    trans: "Trans",
    all: "Everything"
  },

  language: {
    label: "Language",
    caption: "Choose the language this site is shown in",
    system: "Match my browser"
  }
};
