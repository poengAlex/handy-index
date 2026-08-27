// Semantic toast + plain notify [DESIGN.md Part 5 §6] — the one place
// toast styling knobs live. Renders on the card surface with a semantic
// left accent via the global .h-toast classes (app.scss; global because
// q-notify portals out of any scoped style). Errors hold 8s, others 5s.
// Position is responsive: bottom below md, top-right on md and larger.
// Requires Quasar's Notify plugin (registered in quasar.config.ts).
import type { QNotifyCreateOptions } from "quasar";
import { Notify, Screen } from "quasar";
import { kitLabel } from "./labels";

export type ToastSeverity = "positive" | "negative" | "warning" | "info";

const TOAST_ICONS: Record<ToastSeverity, string> = {
  positive: "check_circle",
  info: "info",
  warning: "warning",
  negative: "error"
};

export interface ToastOptions {
  /** runs before the toast closes when the user clicks it (not the × button) */
  onClick?: () => void;
}

// resolved per call, not per module load — the viewport can change
function toastPosition(): "bottom" | "top-right" {
  return Screen.lt.md ? "bottom" : "top-right";
}

// The × button. A Quasar action with no handler dismisses its own
// notification, so this needs no wiring — and being a real button it is the
// keyboard/AT way out, which the card itself is not (a role="alert" div is
// not focusable). Built per call, not once: kitLabel must be read after a
// host has had the chance to install its resolver.
const DISMISS_CLASS = "h-toast__dismiss";

function dismissAction() {
  return {
    icon: "close",
    round: true,
    dense: true,
    size: "sm",
    class: DISMISS_CLASS,
    "aria-label": kitLabel("dismiss")
  };
}

function fromDismissButton(ev: MouseEvent): boolean {
  const target = ev.target;
  return (
    target instanceof Element && target.closest(`.${DISMISS_CLASS}`) !== null
  );
}

// Show a notification; clicking anywhere on it dismisses it early.
// `Notify.create` returns its own dismiss fn and `attrs` are v-bound onto
// the notification element, so a native onClick there closes the toast; the
// cursor affordance rides along via the .h-toast--dismissable class
// (app.scss).
function notify(options: QNotifyCreateOptions, onClick?: () => void): void {
  const classes = [options.classes, "h-toast--dismissable"]
    .filter(Boolean)
    .join(" ");
  const dismiss = Notify.create({
    ...options,
    classes,
    attrs: {
      ...options.attrs,
      onClick: (ev: MouseEvent) => {
        // the × bubbles up here too — it only ever means "close", never
        // "do the thing the message offers"
        if (onClick && !fromDismissButton(ev)) onClick();
        dismiss();
      }
    }
  });
}

export function hToast(
  severity: ToastSeverity,
  message: string,
  caption?: string,
  options?: ToastOptions
): void {
  notify(
    {
      message,
      ...(caption ? { caption } : {}),
      icon: TOAST_ICONS[severity],
      iconColor: severity,
      position: toastPosition(),
      timeout: severity === "negative" ? 8000 : 5000,
      classes: `h-toast h-toast--${severity}`,
      actions: [dismissAction()]
    },
    options?.onClick
  );
}

/**
 * the quiet default — a short unstyled confirmation ("Saved."). Click-to-
 * dismiss like a toast, but no × button: it is gone in a second and a half.
 */
export function hNotify(message: string, timeout = 1500): void {
  notify({ message, timeout, position: toastPosition() });
}
