// What build the visitor is looking at. The two values are compiled in by
// quasar.config.ts, so nothing is fetched and nothing can drift: the version
// is the one in package.json at build time, and it is the same number the
// top entry of public/CHANGELOG.md is written against.

/** e.g. "2.1.0" */
export const APP_VERSION: string = __APP_VERSION__;

/** When this bundle was built. Invalid only if the define went missing, in
 * which case the callers below hide the date rather than print "Invalid
 * Date". */
export const BUILD_DATE: Date = new Date(__BUILD_DATE__);

export function hasBuildDate(): boolean {
  return !Number.isNaN(BUILD_DATE.getTime());
}
