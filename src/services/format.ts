// Small display formatters. Framework-free and locale-free by design: the
// arithmetic ("3595 s is 1 h, never 60 min") is universal, the words around
// it are not. Each function returns *parts*; the message layer turns them
// into a sentence, because only it knows that Norwegian abbreviates the hour
// "t" and that "for 3 dager siden" is not "3 days ago" with words swapped.

/** Connection keys are [A-Za-z0-9] only, max 32 chars — filter at input time. */
export function sanitizeConnectionKey(value: string): string {
  return value.replace(/[^A-Za-z0-9]/g, "").slice(0, 32);
}

export type DurationSpan =
  | { unit: "hoursMinutes"; hours: number; minutes: number }
  | { unit: "hours"; hours: number }
  | { unit: "minutes"; minutes: number }
  | { unit: "seconds"; seconds: number }
  | null;

/** Picks which duration message applies and supplies its numbers. `null`
 * means "nothing worth showing" — the caller renders an empty string. */
export function durationSpan(seconds?: number): DurationSpan {
  if (!seconds || seconds <= 0) return null;
  // round to whole minutes first so 3595 s is "1 h", never "60 min"
  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) {
    return minutes > 0
      ? { unit: "hoursMinutes", hours, minutes }
      : { unit: "hours", hours };
  }
  if (totalMinutes > 0) return { unit: "minutes", minutes: totalMinutes };
  return { unit: "seconds", seconds: Math.round(seconds) };
}

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60]
];

export type RelativeSpan =
  | { value: number; unit: Intl.RelativeTimeFormatUnit }
  | "now"
  | null;

/** The coarsest unit that fits, signed (negative = past) for
 * `Intl.RelativeTimeFormat`. `"now"` is under a minute either way; `null` is
 * a missing or unparseable timestamp. */
export function relativeSpan(iso?: string): RelativeSpan {
  if (!iso) return null;
  const timestamp = Date.parse(iso);
  if (Number.isNaN(timestamp)) return null;
  const elapsed = (timestamp - Date.now()) / 1000;
  for (const [unit, span] of RELATIVE_UNITS) {
    if (Math.abs(elapsed) >= span) {
      return { value: Math.round(elapsed / span), unit };
    }
  }
  return "now";
}
