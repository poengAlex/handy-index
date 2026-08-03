// Small display formatters (Intl-based, no date library).

/** Connection keys are [A-Za-z0-9] only, max 32 chars — filter at input time. */
export function sanitizeConnectionKey(value: string): string {
  return value.replace(/[^A-Za-z0-9]/g, "").slice(0, 32);
}

export function formatDuration(seconds?: number): string {
  if (!seconds || seconds <= 0) return "";
  // round to whole minutes first so 3595 s is "1 h", never "60 min"
  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0)
    return minutes > 0 ? `${hours} h ${minutes} min` : `${hours} h`;
  if (totalMinutes > 0) return `${totalMinutes} min`;
  return `${Math.round(seconds)} s`;
}

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60]
];

const relativeFormat = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export function relativeTime(iso?: string): string {
  if (!iso) return "";
  const timestamp = Date.parse(iso);
  if (Number.isNaN(timestamp)) return "";
  const elapsed = (timestamp - Date.now()) / 1000;
  for (const [unit, span] of RELATIVE_UNITS) {
    if (Math.abs(elapsed) >= span) {
      return relativeFormat.format(Math.round(elapsed / span), unit);
    }
  }
  return "just now";
}
