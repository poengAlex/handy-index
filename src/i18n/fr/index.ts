import about from "./about";
import browse from "./browse";
import common from "./common";
import errors from "./errors";
import gates from "./gates";
import help from "./help";
import home from "./home";
import kit from "./kit";
import library from "./library";
import media from "./media";
import nav from "./nav";
import performers from "./performers";
import playlists from "./playlists";
import privacy from "./privacy";
import requests from "./requests";
import services from "./services";
import settings from "./settings";
import sites from "./sites";
import tags from "./tags";
import video from "./video";
import type enUSMessages from "../en-US";

// Each namespace file is individually typed against its English twin;
// this re-assertion catches a whole namespace going missing.
const fr: typeof enUSMessages = {
  about,
  browse,
  common,
  errors,
  gates,
  help,
  home,
  kit,
  library,
  media,
  nav,
  performers,
  playlists,
  privacy,
  requests,
  services,
  settings,
  sites,
  tags,
  video
};

export default fr;
