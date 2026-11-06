// The AI scripts page (/ai-scripts): every script Handy's auto-scripter has
// published. Reached only from the help page. The warning is the point of
// the page — translate its claim as strongly as English makes it: made by
// AI, checked by nobody.
export default {
  title: "AI scripts",
  lead: "Every script Handy's auto-scripter has made, newest first.",

  warning: {
    title: "Highly experimental",
    body: "Every script on this page was made by AI and has not been checked by any human. Expect mistakes: strokes out of sync, missing or wrong parts. Use them at your own risk."
  },

  search: {
    placeholder: "Search AI scripts",
    aria: "Search AI scripts by video title"
  },

  count: "{count} AI script | {count} AI scripts",
  /** under each title, after the length; {when} is "3 hours ago" */
  made: "Made {when}",
  download: "Download",
  showMore: "Show more",

  emptyBody: "The auto-scripter hasn't published any scripts yet.",
  errorTitle: "Couldn't load AI scripts",
  errorBody: "The AI script server didn't answer. Try again in a moment.",
  noMatchTitle: "No matching scripts",
  noMatchBody: "No AI script has a title with that in it."
};
