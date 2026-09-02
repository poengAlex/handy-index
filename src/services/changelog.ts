// Reads public/CHANGELOG.md — the list of changes visitors see under Help.
//
// The file is Markdown so it can be edited (and read on GitHub) without a
// build step, but only the four shapes below are understood, and the file is
// written to stay inside them. That is deliberate: a full Markdown parser is
// a dependency and an escaping problem, and this text is ours.
//
//   ## 2.1.0 — 2 September 2026     a release, version and date split on the
//                                   dash; everything after it belongs to it
//   ### Help                        a group heading inside a release
//   - line                          one change; wrapped lines continue it
//   anything else                   a paragraph (the note under a release)
//
// `#` (the file's own title) and HTML comments are dropped.

export type ChangelogBlock =
  | { kind: "group"; text: string }
  | { kind: "note"; text: string }
  | { kind: "change"; text: string };

export interface ChangelogRelease {
  /** "2.1.0" — also the key the list renders by */
  version: string;
  /** as written in the file, already human-readable; "" when omitted */
  date: string;
  blocks: ChangelogBlock[];
}

/** The dash between version and date. An em dash is what the file uses; the
 * hyphen is accepted so a hand-typed entry still splits. */
const DATE_SEPARATOR = /\s+[—-]\s+/;

export function parseChangelog(markdown: string): ChangelogRelease[] {
  const releases: ChangelogRelease[] = [];
  // where a wrapped line continues: the last thing that can absorb one
  let open: { text: string } | null = null;

  // comments may wrap across lines, so they are stripped from the whole text
  const lines = markdown.replaceAll(/<!--[\s\S]*?-->/g, "").split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    const current = releases.at(-1);

    if (!trimmed) {
      open = null;
      continue;
    }

    if (trimmed.startsWith("## ")) {
      const [version = "", date = ""] = trimmed
        .slice(3)
        .trim()
        .split(DATE_SEPARATOR);
      releases.push({ version, date, blocks: [] });
      open = null;
      continue;
    }

    if (trimmed.startsWith("### ")) {
      const block: ChangelogBlock = { kind: "group", text: trimmed.slice(4) };
      current?.blocks.push(block);
      open = null;
      continue;
    }

    // the file's own "# What's new in IVDB" heads the page, not a release
    if (trimmed.startsWith("#")) {
      open = null;
      continue;
    }

    if (trimmed.startsWith("- ")) {
      const block: ChangelogBlock = { kind: "change", text: trimmed.slice(2) };
      current?.blocks.push(block);
      open = block;
      continue;
    }

    // a continuation of the bullet or paragraph above — rejoined with the
    // single space the line break stood for
    if (open) {
      open.text += ` ${trimmed}`;
      continue;
    }

    const block: ChangelogBlock = { kind: "note", text: trimmed };
    current?.blocks.push(block);
    open = block;
  }

  return releases;
}

/** Fetches the changelog from the app's own origin. Not cached here: the
 * dialog holds what it got for the session, and a visitor who reopens it
 * after a deploy should see the new file. */
export async function fetchChangelog(): Promise<ChangelogRelease[]> {
  const response = await fetch(`${import.meta.env.BASE_URL}CHANGELOG.md`);
  if (!response.ok) {
    throw new Error(`Changelog request failed: ${response.status}`);
  }
  return parseChangelog(await response.text());
}
