// The tracking plan, as code: every event IVDB may send, declared once.
//
// Each entry says what the event means, which group it belongs to and whether
// it is switched on, and `EventProps` types its properties — so a call site
// that misspells an event, or adds a field the plan doesn't list, fails the
// build instead of quietly sending it. That is the point of keeping the list
// here rather than as a string union with comments (the Handyverse and
// onboarding apps' `PosthogEvent`): what can leave the browser is reviewable
// in one file, and switching an event off is one `enabled: false`.
//
// The rules every entry follows — they are the promise the privacy page's
// "Anonymous usage statistics" section makes, so a new event that breaks one
// needs that text changed first:
// - IDs, counts and kinds only. Never orientation, tag, performer or scripter
//   names, search text, video titles, comment text or request URLs.
// - Never the connection key. Identification uses a hash of it (identity.ts).
// - URLs leave without their query string, whatever the event (sanitize.ts).

export type EventGroup =
  | "core"
  | "discovery"
  | "library"
  | "community"
  | "settings"
  | "health";

/** Where on screen an action was taken. */
export type Surface = "video_page" | "quick_menu" | "playlist";

/** How a key-gated or network action ended. `no_key` means the key prompt
 * opened instead; `key_rejected` that the API refused the saved key. */
export type Outcome = "ok" | "no_key" | "key_rejected" | "failed";

/** The page a video was opened from; `direct` is no page at all — a shared
 * link, a bookmark, a new tab. */
export type VideoSource =
  | "home"
  | "videos"
  | "video"
  | "favorites"
  | "history"
  | "playlist"
  | "other"
  | "direct";

/** Why the connection-key prompt opened. */
export type KeyReason =
  | "script_download"
  | "rating"
  | "comments"
  | "requests"
  | "playlist_download";

/** Settings whose changes are reported. Orientation is deliberately absent. */
export type SettingName =
  | "theme"
  | "explicit_previews"
  | "premium_scripts"
  | "premium_videos"
  | "embedded_players"
  | "performer_media"
  | "video_card_previews"
  | "performer_card_previews"
  | "full_width"
  | "background"
  | "background_motion";

type Empty = Record<string, never>;

export interface EventProps {
  // --- core: does the site do its job ---
  video_opened: {
    partnerVideoId: string;
    partnerId: string | null;
    vr: boolean;
    freeScript: boolean;
    source: VideoSource;
    /** the row it was picked from, by kind — see shelfKind() */
    shelf: string | null;
  };
  script_download: {
    surface: Surface;
    outcome: Outcome;
    partnerVideoId?: string;
    partnerId?: string | null;
    /** "Get all scripts" on a playlist: how many it fetched */
    count?: number;
  };
  partner_outbound_click: {
    surface: Surface;
    partnerVideoId: string;
    partnerId: string | null;
  };

  // --- discovery: how people find videos ---
  $pageview: {
    /** the route pattern, e.g. /videos/:partnerVideoId */
    route: string;
  };
  search_performed: {
    queryLength: number;
    results: number;
  };
  browse_filtered: {
    sort: string;
    descending: boolean;
    /** how many tags are filtered on — never which */
    tags: number;
    site: boolean;
    performer: boolean;
    scripter: boolean;
    vr: boolean;
    /** the inverse: non-VR videos only */
    flat: boolean;
    clip: boolean;
    published: boolean;
    duration: boolean;
    speed: boolean;
    results: number;
  };
  link_shared: {
    what: "video" | "results";
    method: "share_sheet" | "clipboard";
    outcome: "ok" | "failed";
  };

  // --- library ---
  favorite_toggled: { added: boolean };
  playlist_created: Empty;
  playlist_exported: {
    format: "file" | "text" | "link";
    outcome: "ok" | "failed";
  };
  playlist_imported: {
    format: "file" | "text" | "link";
    outcome: "ok" | "failed";
    videos?: number;
  };
  history_cleared: Empty;

  // --- community: the connection-key gated actions ---
  key_prompt_shown: { reason: KeyReason };
  connection_key_saved: { via: "prompt" | "settings" };
  script_rated: { stars: number; outcome: Outcome };
  comment_posted: { outcome: Outcome };
  request_voted: { outcome: Outcome };
  request_submitted: { outcome: Outcome };

  // --- language & settings ---
  language_changed: {
    from: string;
    to: string;
    /** false: "Match my browser" was picked */
    picked: boolean;
    /** a change in the first-visit dialog means the browser guess was wrong */
    where: "first_visit" | "settings";
  };
  setting_changed: { setting: SettingName; value: string | boolean };
  consent_answered: { accepted: boolean };
  analytics_opted_out: Empty;
  analytics_opted_in: Empty;
  data_cleared: { what: string };
  changelog_opened: Empty;

  // --- health ---
  catalog_loaded: {
    from: "cache" | "download";
    ms: number;
    /** downloaded size; null off the disk cache */
    mb: number | null;
    /** what the browser reports, where it does (Chromium only) */
    connection: string | null;
    deviceMemoryGb: number | null;
  };
  catalog_load_failed: { ms: number; online: boolean };
}

export type EventName = keyof EventProps;

export interface EventSpec {
  group: EventGroup;
  enabled: boolean;
  description: string;
  /** send at most once per page load */
  once?: boolean;
  /** share of occurrences sent, 0–1; omitted means all of them */
  sample?: number;
}

export const EVENTS: { readonly [K in EventName]: EventSpec } = {
  video_opened: {
    group: "core",
    enabled: true,
    description: "A video page loaded, and where it was opened from"
  },
  script_download: {
    group: "core",
    enabled: true,
    description:
      "Get script, the quick-menu download, or a playlist's Get all scripts"
  },
  partner_outbound_click: {
    group: "core",
    enabled: true,
    description: "Watch on site — a visitor sent to a partner"
  },

  $pageview: {
    group: "discovery",
    enabled: true,
    description: "A different page opened (filter changes don't count)"
  },
  search_performed: {
    group: "discovery",
    enabled: true,
    description: "A search was committed — its length and result count only"
  },
  browse_filtered: {
    group: "discovery",
    enabled: true,
    description: "Filters or sort changed on Videos — which kinds, not values"
  },
  link_shared: {
    group: "discovery",
    enabled: true,
    description: "Share or copy link, on a video or on browse results"
  },

  favorite_toggled: {
    group: "library",
    enabled: true,
    description: "A favorite added or removed"
  },
  playlist_created: {
    group: "library",
    enabled: true,
    description: "A playlist created"
  },
  playlist_exported: {
    group: "library",
    enabled: true,
    description: "A playlist exported as a file, as text, or as a share link"
  },
  playlist_imported: {
    group: "library",
    enabled: true,
    description: "A playlist imported, and whether it worked"
  },
  history_cleared: {
    group: "library",
    enabled: false,
    description: "Recently viewed cleared"
  },

  key_prompt_shown: {
    group: "community",
    enabled: true,
    description: "The connection-key prompt opened, and what asked for it"
  },
  connection_key_saved: {
    group: "community",
    enabled: true,
    description: "A connection key saved, from the prompt or from settings"
  },
  script_rated: {
    group: "community",
    enabled: true,
    description: "A script rated"
  },
  comment_posted: {
    group: "community",
    enabled: true,
    description: "A script comment posted (never its text)"
  },
  request_voted: {
    group: "community",
    enabled: true,
    description: "A vote on a video request"
  },
  request_submitted: {
    group: "community",
    enabled: true,
    description: "A video request submitted (never its URL)"
  },

  language_changed: {
    group: "settings",
    enabled: true,
    description: "A language picked, in the first-visit dialog or settings"
  },
  setting_changed: {
    group: "settings",
    enabled: true,
    description: "One of the SettingName settings changed"
  },
  consent_answered: {
    group: "settings",
    enabled: true,
    description: "The first-visit dialog answered"
  },
  // sent by index.ts itself on the way out, past the enabled checks — listed
  // so the plan is complete
  analytics_opted_out: {
    group: "settings",
    enabled: true,
    description: "Statistics switched off — the last event that visitor sends"
  },
  analytics_opted_in: {
    group: "settings",
    enabled: true,
    description: "Statistics switched back on"
  },
  data_cleared: {
    group: "settings",
    enabled: false,
    description: "A row in Clear stored data used"
  },
  changelog_opened: {
    group: "settings",
    enabled: false,
    description: "What's new opened"
  },

  catalog_loaded: {
    group: "health",
    enabled: true,
    description: "The catalog loaded: from disk or network, and how fast"
  },
  catalog_load_failed: {
    group: "health",
    enabled: true,
    description: "The catalog failed to load"
  }
};

/** The page a route path belongs to, for video_opened's source. Takes the
 * router's "back" entry, so null — nothing before this page in the tab —
 * is a link from outside. */
export function sourceFromPath(path: string | null | undefined): VideoSource {
  if (!path) return "direct";
  const bare = path.split("?")[0] ?? "";
  if (bare === "/" || bare === "") return "home";
  if (bare === "/videos") return "videos";
  if (bare.startsWith("/videos/")) return "video";
  if (bare === "/favorites") return "favorites";
  if (bare === "/history") return "history";
  if (bare.startsWith("/playlists/")) return "playlist";
  return "other";
}

/** A home row's id, reduced to its kind: the per-tag rows carry the tag in
 * their id, and a tag never leaves the browser. */
export function shelfKind(key: string): string {
  if (key.startsWith("tag-")) return "tag";
  if (key.startsWith("like-")) return "because_you_like";
  return key;
}
