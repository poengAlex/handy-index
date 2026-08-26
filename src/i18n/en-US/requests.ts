// The community side of the catalog: one voting board that is also the
// queue — submit a video URL, upvote what should get scripted next, and read
// each tile's rank as its place in the scripting order. The board is gated on
// the Handy connection key, which is what `key.*` covers.
export default {
  // Connection-key gate and the two failure states behind it.
  key: {
    title: "Connection key needed",
    boardBody:
      "The request board is tied to your Handy. Add the connection key from the Handy app to see, submit and vote on requests.",
    addAction: "Add connection key",
    rejectedTitle: "Connection key rejected",
    rejectedBody:
      "Either the key is wrong or your Handy isn't online. Check the key in the Handy app, make sure the device is switched on and connected, then enter it again.",
    rejectedAction: "Enter key again",
    boardDialog:
      "The request board is bound to your Handy. Enter the connection key from the Handy app to continue."
  },

  // The voting board page. There are four count messages rather than one
  // stem the render bolts suffixes onto: "of {total}" only appears while
  // filters narrow the list, and the capped note only when the board is
  // longer than the single load we do. `{requests}` arrives already counted
  // and pluralized ("12 requests", from common.count.requests) — move it
  // wherever the sentence wants it.
  board: {
    title: "Script requests",
    lead: "Vote on which videos get scripted next — the top-voted request goes first.",
    emptyTitle: "No requests waiting",
    emptyBody:
      "Nothing is up for a vote right now. Request a video above to get things moving.",
    errorTitle: "Couldn't load requests",
    noMatchBody:
      "Nothing on the board matches those filters. Loosen them to see the rest.",
    countAll: "{requests} up for a vote",
    countAllCapped:
      "{requests} up for a vote (the board is longer than we loaded)",
    countFiltered: "{requests} of {total}",
    countFilteredCapped:
      "{requests} of {total} (the board is longer than we loaded)"
  },

  // The submit row on the board, plus the two toasts it can raise.
  submit: {
    title: "Request a video",
    hint: "Paste a link to a video you'd like scripted. It goes through verification before it shows up for voting.",
    urlLabel: "Video URL",
    action: "Request video",
    sentTitle: "Request sent",
    sentBody: "It goes through verification before it shows up for voting.",
    failedTitle: "Request failed",
    failedBody: "The script index didn't accept the URL. Try again."
  },

  // The vote button and its toasts. `failedKeyBody` is the auth case: the key
  // was rotated or the device went offline mid-session.
  vote: {
    action: "Vote",
    voted: "Voted",
    successTitle: "Vote counted",
    successBody: "Top-voted requests get scripted first.",
    failedTitle: "Vote failed",
    failedKeyBody:
      "Either the key is wrong or your Handy isn't online — check both and enter it again.",
    failedBody: "The script index didn't accept the vote. Try again."
  },

  // One request tile.
  card: {
    untitled: "Video request",
    openAria: "Open {name}",
    // the request's place in the scripting order, on a badge with room for
    // about four characters
    rank: "#{rank}"
  },

  // The control row above the list.
  filters: {
    searchPlaceholder: "Search requests",
    searchAria: "Search requests by title",
    sortAria: "Sort requests",
    tagLabel: "Tag",
    tagEmpty: "No matching tags",
    // one row of the tag picker: the tag, then how many requests carry it
    tagOption: "{tag} ({count})",
    removeTagAria: "Remove filter: {tag}",
    performerLabel: "Performer",
    performerEmpty: "No matching performers",
    // one row of the performer picker: who they are, then how many
    // requests name them
    performerOption: "{name} ({count})",
    removePerformerAria: "Remove filter: {name}",
    hideVoted: "Hide voted",
    hideVotedTitle: "Hide the requests you already voted on",
    emptyTitle: "No requests match"
  },

  // Sort picker. Keys match RequestSortKey.
  sort: {
    votes: "Most votes",
    newest: "Newest",
    longest: "Longest",
    title: "A–Z"
  }
};
