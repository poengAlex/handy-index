// The ID an identified visitor is known by: a hash of their connection key,
// built exactly the way the Handyverse and onboarding apps build theirs
// (anonymizeConnectionKey there) — the key's first three characters, a dash,
// then its SHA-256, cut to 16 characters. Same recipe, so the same Handy is
// the same ID in every Handy project's statistics.
//
// Unlike those apps this never falls back to the raw key in development, or
// to a random string when hashing fails: no ID means no identification.

export async function hashConnectionKey(key: string): Promise<string | null> {
  try {
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(key)
    );
    const hex = Array.from(new Uint8Array(digest), byte =>
      byte.toString(16).padStart(2, "0")
    ).join("");
    return `${key.substring(0, 3)}-${hex}`.substring(0, 16);
  } catch {
    // no SubtleCrypto outside a secure context
    return null;
  }
}
