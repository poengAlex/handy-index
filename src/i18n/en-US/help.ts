// The feature tour at /help — one row per capability, grouped the way people
// actually use the site. Every `label` is a short feature name; every
// `caption` is the single sentence sitting under it. Keep captions to one
// sentence: the row truncates nothing, but a second sentence turns the list
// into documentation, which is what this page exists to replace.
export default {
  title: "Help",
  lead: "Everything this site can do, in one place. Rows with an arrow take you straight there.",

  finding: {
    title: "Finding videos",
    search: {
      label: "Search and filter",
      caption:
        "Search titles, then narrow by tag, site, performer, VR and duration — every filter lives in the URL, so results are shareable"
    },
    sort: {
      label: "Sort any way you like",
      caption:
        "Recently added, top rated, most played and more — the arrow button next to the sort reverses the direction"
    },
    tags: {
      label: "Tag cloud",
      caption:
        "Every tag in the catalog except the ones you've muted, searchable and sortable — one click filters the browse page"
    },
    performers: {
      label: "Performers",
      caption: "Browse by performer, biggest filmography first"
    },
    sites: {
      label: "Sites",
      caption: "Every partner site in the index with its video count"
    }
  },

  library: {
    title: "Your library",
    favorites: {
      label: "Favorites",
      caption: "Heart any video to keep it handy — stored on this device"
    },
    playlists: {
      label: "Playlists",
      caption: "Create, rename and curate playlists of any videos"
    },
    transfer: {
      label: "Share, import & export playlists",
      caption:
        "Move a playlist as a file, as copyable JSON text, or as a temporary share link — and import from any of them"
    },
    bulkDownload: {
      label: "Get all scripts at once",
      caption: "One click on a playlist downloads every free script in it"
    },
    quickMenu: {
      label: "Quick menu",
      caption:
        "Right-click (or long-press) any video thumbnail for favorites, playlists, copy link and more"
    }
  },

  scripts: {
    title: "Scripts & your Handy",
    free: {
      label: "Free scripts",
      caption:
        "Videos marked Free have a script you can download with your Handy connection key"
    },
    rate: {
      label: "Rate scripts",
      caption: "Star-rate any free script right on the video page"
    },
    comments: {
      label: "Script comments",
      caption: "Read and post anonymous comments on scripts"
    },
    requests: {
      label: "Request videos",
      caption:
        "Ask for a script for any video, and vote on what gets scripted next"
    }
  },

  personalize: {
    title: "Make it yours",
    previews: {
      label: "Explicit previews",
      caption: "Off by default — turn artwork on in settings"
    },
    players: {
      label: "Embedded players",
      caption:
        "Off by default — watch Pornhub and xHamster videos right on the video page (playback doesn't sync with the Handy)"
    },
    filters: {
      label: "Orientation, script & video filters",
      caption:
        "Free or premium scripts, free or premium videos, and who's in them — in settings, or right in the browse filters"
    },
    mutedTags: {
      label: "Muted tags",
      caption:
        "Mute a tag and every video carrying it drops out of the catalog — right-click any tag pill, or manage the list in settings"
    },
    theme: {
      label: "Light & dark theme",
      caption: "Toggle in the header — follows your choice everywhere"
    },
    share: {
      label: "Share",
      caption:
        "Every video page and every filtered result list has a shareable link"
    }
  }
};
