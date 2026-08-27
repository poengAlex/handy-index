// Connection-key generation — domain logic that belongs with
// HConnectionKey, not re-implemented per page. Keys are alphanumeric with
// the ambiguous glyphs removed (no 0/O, 1/l/I) so they survive being read
// aloud or typed (§7 connection key).
const KEY_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
const KEY_DIGITS = "23456789";

/** The alphabet a key may contain, and its length cap (design.md §7). */
export const KEY_ALPHABET = /[^A-Za-z0-9]/g;
export const KEY_MAX_LENGTH = 32;

/**
 * Filter typed or pasted text down to a legal key.
 *
 * The asymmetry with generateKey is deliberate: keys we MINT avoid the
 * ambiguous glyphs (0/O, 1/l/I) so they survive being read aloud, but keys we
 * RECEIVE must accept them, because they came from somewhere that did not make
 * that promise. design.md §7 asks inputs to "filter at input time rather than
 * validate after — disallowed characters never land in the field".
 *
 * Note for callers: a controlled q-input will not re-render when sanitising is
 * a no-op on the bound ref, so an input that filters needs the usual
 * force-a-change-cycle dance around the assignment.
 */
export function sanitizeKey(value: string): string {
  return value.replace(KEY_ALPHABET, "").slice(0, KEY_MAX_LENGTH);
}

export function generateKey(length = 10): string {
  const out: string[] = [];
  for (let i = 0; i < length; i++) {
    out.push(KEY_CHARS[Math.floor(Math.random() * KEY_CHARS.length)]!);
  }
  // guarantee a digit or two: a key doubles as the showcase for the
  // digit colouring, and ~1 in 5 ten-char draws would have none at all
  const positions = new Set<number>();
  while (positions.size < Math.min(2, length)) {
    positions.add(Math.floor(Math.random() * length));
  }
  for (const p of positions) {
    if (!/\d/.test(out[p]!)) {
      out[p] = KEY_DIGITS[Math.floor(Math.random() * KEY_DIGITS.length)]!;
    }
  }
  return out.join("");
}
