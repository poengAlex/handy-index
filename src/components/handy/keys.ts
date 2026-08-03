// Connection-key generation — domain logic that belongs with
// HConnectionKey, not re-implemented per page. Keys are alphanumeric with
// the ambiguous glyphs removed (no 0/O, 1/l/I) so they survive being read
// aloud or typed (§7 connection key).
const KEY_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
const KEY_DIGITS = "23456789";

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
