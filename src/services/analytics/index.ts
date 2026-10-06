// The usage-statistics runtime: the only file that talks to PostHog.
//
// Everything else calls track() / captureError() and never sees the SDK. That
// keeps three promises in one place:
// - the event list in events.ts is enforced: off events, off groups, once and
//   sampling are decided here, before anything is queued;
// - every event passes sanitize.ts on its way out (PostHog's before_send);
// - the visitor's switch is final: off means nothing is queued, and PostHog
//   is never even downloaded on a visit that starts switched off.
//
// PostHog itself loads late (config.loadDelayMs) as its own chunk, so the
// first visit's catalog download doesn't share the line with it. Whatever is
// tracked before then waits in a short queue.

import type { PostHog } from "posthog-js/dist/module.slim.no-external";
import { ANALYTICS_CONFIG as config } from "./config";
import { EVENTS, type EventName, type EventProps } from "./events";
import { sanitizeEvent } from "./sanitize";

export * from "./events";
export { hashConnectionKey } from "./identity";

type Op = (posthog: PostHog) => void;

const QUEUE_CAP = 100;

let instance: PostHog | null = null;
let loading: Promise<PostHog | null> | null = null;
let queue: Op[] = [];
/** the visitor's switch, as last reported by the boot file */
let enabled = false;
let superProps: Record<string, unknown> = {};
const sentOnce = new Set<EventName>();

const canSend = (): boolean => config.send && config.token !== "";

function run(op: Op): void {
  if (!enabled || !canSend()) return;
  if (instance) op(instance);
  else if (queue.length < QUEUE_CAP) queue.push(op);
}

// --- errors from before PostHog is here ---
//
// PostHog's own handlers only exist once it has loaded, and the first seconds
// (the catalog download and parse) are when a crash hurts most. These queue
// those errors and hand over to PostHog when it arrives.

function onEarlyError(event: ErrorEvent): void {
  captureError(event.error ?? event.message);
}

function onEarlyRejection(event: PromiseRejectionEvent): void {
  captureError(event.reason);
}

function watchEarlyErrors(on: boolean): void {
  if (!config.errors) return;
  if (on) {
    window.addEventListener("error", onEarlyError);
    window.addEventListener("unhandledrejection", onEarlyRejection);
  } else {
    window.removeEventListener("error", onEarlyError);
    window.removeEventListener("unhandledrejection", onEarlyRejection);
  }
}

function load(): Promise<PostHog | null> {
  if (!canSend()) return Promise.resolve(null);
  loading ??= (async () => {
    const [{ posthog }, { ErrorTrackingExtensions }] = await Promise.all([
      import("posthog-js/dist/module.slim.no-external"),
      import("posthog-js/dist/extension-bundles"),
      // registers the error hooks on window, so PostHog never fetches them
      // from its own servers (which the CSP wouldn't allow anyway)
      import("posthog-js/dist/exception-autocapture")
    ]);
    const origin = window.location.origin;
    posthog.init(config.token, {
      api_host: config.apiHost,
      persistence: "localStorage",
      person_profiles: "identified_only",
      // only what events.ts lists: no automatic clicks, page leaves,
      // recordings, heatmaps, surveys or remote config
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      capture_dead_clicks: false,
      capture_heatmaps: false,
      capture_performance: false,
      disable_session_recording: true,
      disable_surveys: true,
      disable_product_tours: true,
      disable_conversations: true,
      disable_web_experiments: true,
      advanced_disable_flags: true,
      disable_external_dependency_loading: true,
      capture_exceptions: config.errors
        ? {
            capture_unhandled_errors: true,
            capture_unhandled_rejections: true,
            capture_console_errors: false
          }
        : false,
      before_send: event => (event ? sanitizeEvent(event, origin) : event),
      __extensionClasses: { ...ErrorTrackingExtensions }
    });
    // the visitor's switch is the truth; PostHog's own remembered opt-out
    // (from a previous "off") must not outvote a later "on"
    if (enabled && posthog.has_opted_out_capturing()) {
      posthog.opt_in_capturing({ captureEventName: false });
    }
    posthog.register(superProps);
    instance = posthog;
    watchEarlyErrors(false);
    const pending = queue;
    queue = [];
    if (enabled) for (const op of pending) op(posthog);
    return posthog;
  })().catch(() => {
    // a failed chunk download: statistics are never worth breaking the page
    queue = [];
    return null;
  });
  return loading;
}

/** Starts the runtime with the visitor's switch. Called once, from the boot
 * file, before anything is tracked. */
export function start(on: boolean): void {
  enabled = on;
  if (config.log) {
    console.debug(
      `[analytics] ${on ? "on" : "off"}; ${canSend() ? "sending" : "not sending (dev build or no token)"}`
    );
  }
  if (!on || !canSend()) return;
  watchEarlyErrors(true);
  window.setTimeout(() => void load(), config.loadDelayMs);
}

/** The visitor flipped the switch. Off sends one last event saying so —
 * loading PostHog for it if it isn't here yet — and then nothing more. */
export function setEnabled(on: boolean): void {
  if (on === enabled) return;
  enabled = on;
  if (config.log) console.debug(`[analytics] switched ${on ? "on" : "off"}`);
  if (!canSend()) return;
  if (!on) {
    queue = [];
    watchEarlyErrors(false);
    void load().then(posthog => {
      // switched back on while this was loading: nothing to opt out of
      if (!posthog || enabled) return;
      posthog.capture("analytics_opted_out", {}, { send_instantly: true });
      posthog.opt_out_capturing();
    });
    return;
  }
  if (instance) {
    instance.opt_in_capturing({ captureEventName: "analytics_opted_in" });
  } else {
    watchEarlyErrors(true);
    void load().then(posthog => {
      if (posthog && enabled) posthog.capture("analytics_opted_in");
    });
  }
}

type PropsArg<K extends EventName> =
  EventProps[K] extends Record<string, never>
    ? [props?: EventProps[K]]
    : [props: EventProps[K]];

/** Sends one event from the plan in events.ts, if the plan and the visitor
 * both allow it. */
export function track<K extends EventName>(
  name: K,
  ...[props]: PropsArg<K>
): void {
  const spec = EVENTS[name];
  if (!spec.enabled || !config.groups[spec.group]) return;
  if (spec.once) {
    if (sentOnce.has(name)) return;
    sentOnce.add(name);
  }
  if (spec.sample !== undefined && Math.random() >= spec.sample) return;
  if (!enabled) return;
  if (config.log) console.debug("[analytics]", name, props ?? {});
  run(posthog => posthog.capture(name, props ?? {}));
}

/** Reports an error that was caught — by Vue, or by a handler that wants it
 * seen anyway. Uncaught ones PostHog finds on its own. */
export function captureError(
  error: unknown,
  extra?: Record<string, unknown>
): void {
  if (!config.errors || !enabled) return;
  run(posthog => posthog.captureException(error, extra));
}

/** Properties sent with every event (settings, language, app version…). */
export function setSuperProperties(props: Record<string, unknown>): void {
  superProps = props;
  run(posthog => posthog.register(props));
}

function isIdentified(posthog: PostHog): boolean {
  return posthog.get_property("$user_state") === "identified";
}

/** Links this browser's events to a device. A different device than the one
 * already identified starts a fresh anonymous ID first, so two keys never
 * share a person. */
export function identify(
  distinctId: string,
  personProps: Record<string, unknown>
): void {
  if (config.log) console.debug("[analytics] identify", distinctId);
  run(posthog => {
    if (isIdentified(posthog) && posthog.get_distinct_id() !== distinctId) {
      posthog.reset();
      posthog.register(superProps);
    }
    posthog.identify(distinctId, personProps);
  });
}

/** Back to a fresh anonymous ID: the key was removed (`onlyIfIdentified`),
 * or everything stored was cleared (always). */
export function resetIdentity(onlyIfIdentified: boolean): void {
  run(posthog => {
    if (onlyIfIdentified && !isIdentified(posthog)) return;
    posthog.reset();
    posthog.register(superProps);
  });
}

// --- hand-offs between a click and the page it leads to ---

let pendingShelf: { partnerVideoId: string; shelf: string; at: number } | null =
  null;
let keyFromPrompt = false;

/** A card in a row was clicked; the video page asks for it on arrival. */
export function noteVideoShelf(partnerVideoId: string, shelf: string): void {
  pendingShelf = { partnerVideoId, shelf, at: Date.now() };
}

/** The row the video now opening was picked from, if it was picked from one
 * just now. */
export function takeVideoShelf(partnerVideoId: string): string | null {
  const pending = pendingShelf;
  pendingShelf = null;
  if (!pending || pending.partnerVideoId !== partnerVideoId) return null;
  return Date.now() - pending.at < 10_000 ? pending.shelf : null;
}

/** The key about to change was typed into the prompt, not into settings. */
export function noteKeyFromPrompt(): void {
  keyFromPrompt = true;
}

export function takeKeySource(): "prompt" | "settings" {
  const via = keyFromPrompt ? "prompt" : "settings";
  keyFromPrompt = false;
  return via;
}
