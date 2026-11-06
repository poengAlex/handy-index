import { defineBoot } from "#q-app";
import { installHandyKit } from "@/components/handy/install";

// The kit's Quasar setup (the sym_o_ icon map, the M3 slider prop defaults,
// the responsive toast position) lives in the kit and arrives with every
// sync. The kit-label resolver stays with the catalogs, in boot/i18n.
export default defineBoot(() => {
  installHandyKit();
});
