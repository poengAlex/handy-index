import common from "./common";
import nav from "./nav";
import settings from "./settings";
import gates from "./gates";
import media from "./media";
import kit from "./kit";
import library from "./library";
import errors from "./errors";
import home from "./home";
import browse from "./browse";
import video from "./video";
import tags from "./tags";
import sites from "./sites";
import performers from "./performers";
import playlists from "./playlists";
import requests from "./requests";
import help from "./help";
import about from "./about";
import privacy from "./privacy";
import services from "./services";

// English is the source of truth: every other locale is typed against this
// object, so a key added here and forgotten elsewhere is a build error.
// One file per feature surface — a translator opening `video.ts` sees the
// whole video page and nothing else.
const enUS = {
  common,
  nav,
  settings,
  gates,
  media,
  kit,
  library,
  errors,
  home,
  browse,
  video,
  tags,
  sites,
  performers,
  playlists,
  requests,
  help,
  about,
  privacy,
  services
};

export default enUS;
