// Semantic toast + plain notify [DESIGN.md Part 5 §6] — the one place
// toast styling knobs live. Renders on the card surface with a semantic
// left accent via the global .h-toast classes (app.scss; global because
// q-notify portals out of any scoped style). Errors hold 8s, others 5s.
// Position is responsive: bottom below md, top-right on md and larger.
// Requires Quasar's Notify plugin (registered in quasar.config.ts).
import { Notify, Screen } from "quasar";

export type ToastSeverity = "positive" | "negative" | "warning" | "info";

const TOAST_ICONS: Record<ToastSeverity, string> = {
  positive: "check_circle",
  info: "info",
  warning: "warning",
  negative: "error"
};

// resolved per call, not per module load — the viewport can change
function toastPosition(): "bottom" | "top-right" {
  return Screen.lt.md ? "bottom" : "top-right";
}

export function hToast(
  severity: ToastSeverity,
  message: string,
  caption?: string
): void {
  Notify.create({
    message,
    ...(caption ? { caption } : {}),
    icon: TOAST_ICONS[severity],
    iconColor: severity,
    position: toastPosition(),
    timeout: severity === "negative" ? 8000 : 5000,
    classes: `h-toast h-toast--${severity}`
  });
}

/** the quiet default — a short unstyled confirmation ("Saved.") */
export function hNotify(message: string, timeout = 1500): void {
  Notify.create({ message, timeout, position: toastPosition() });
}
