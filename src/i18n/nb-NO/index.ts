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
import privacy from "./privacy";
import services from "./services";
import type enUSMessages from "../en-US";

// Bokmål. Each namespace file is individually typed against its English
// twin; this re-assertion catches a whole namespace going missing.
const nbNO: typeof enUSMessages = {
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
  privacy,
  services
};

export default nbNO;
