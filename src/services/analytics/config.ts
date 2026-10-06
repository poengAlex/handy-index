// The switches for the usage statistics. The event list itself — what each
// event means and carries, and the per-event on/off — is events.ts; this file
// is what applies across all of them.

import type { EventGroup } from "./events";

export const ANALYTICS_CONFIG = {
  /** The PostHog project token — project "IVDB" (id 295548, EU cloud).
   * Public by design: it ships in the page for anyone to read, and it can
   * only write events. Empty means PostHog is never loaded and nothing is
   * sent. */
  token: "phc_pR2K7QmMTXPeoUrkb4cFBBMy7owZaLHCUK3mLMy57D6k" as string,

  /** PostHog's EU ingestion host. The only PostHog address the page talks
   * to — the CSP in index.html allows exactly this one. */
  apiHost: "https://eu.i.posthog.com",

  /** Production builds send; a dev build only logs what it would have sent,
   * so working on the site never pollutes the numbers. */
  send: import.meta.env.PROD,
  log: import.meta.env.DEV,

  /** Whole groups on or off — on top of each event's own `enabled`. */
  groups: {
    core: true,
    discovery: true,
    library: true,
    community: true,
    settings: true,
    health: true
  } satisfies Record<EventGroup, boolean>,

  /** Uncaught errors, failed promises and errors inside Vue components. */
  errors: true,

  /** PostHog is fetched this long after startup, off the first visit's
   * critical path — the catalog download needs the bandwidth more. Events
   * from before then wait in a queue. */
  loadDelayMs: 2000,

  identify: {
    /** The Handy REST API's application key (X-Api-Key), generated at
     * user.handyfeeling.com. Identification asks that API whether the device
     * behind the saved connection key is online; with no key here it never
     * asks, and every visitor stays anonymous. */
    handyApiKey: "UG1TQNKqr8sB4Qft4Iobg7VxzF~eS~IJ",
    /** an offline device is asked about again at most this often */
    retryAfterMs: 5 * 60_000
  }
} as const;
