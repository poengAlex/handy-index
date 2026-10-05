#!/usr/bin/env python3
"""Cut Material Symbols Outlined down to the icons this app can show.

The full variable font is 3.96 MB of woff2 — about as much as the whole
catalog download — and every first visit paid for it, in parallel with the
catalog, for ~100 of its ~3,800 icons. It is also `font-display: block`, so
until it lands every icon on the page is blank.

Which icons: every lowercase word in a string or attribute anywhere in src/
(`name="play_arrow"`, `icon: "movie"`, `'favorite_border'`, …) that is also
an icon name in the font, plus the icons Quasar's own components use. That
over-includes a few ordinary words that happen to be icon names too ("home",
"list") — about a kilobyte each — and in exchange cannot miss one.

Icons are ligatures: the text "home" in the icon font is drawn as the house
glyph. Subsetting by text alone would keep every ligature that can be spelled
with the kept letters, which is all of them, so the ligature table is pruned
to the wanted words first. The variation axes (fill, weight, grade, optical
size) are kept, so icons render exactly as before.

Run after adding an icon (`npm run icons:subset`; needs `pip install
fonttools brotli`). `npm run icons:check` compares src/ against the manifest
without Python, and is part of `lint:check`.
"""

import json
import re
import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
EXTRAS = ROOT / "node_modules/@quasar/extras/exports/material-symbols-outlined"
QUASAR_SET = ROOT / "node_modules/quasar/icon-set/material-symbols-outlined.js"
ICON_LIST = EXTRAS / "icons.json"
OUT_DIR = ROOT / "src/css/icons"
OUT_FONT = OUT_DIR / "material-symbols-outlined.subset.woff2"
OUT_MANIFEST = OUT_DIR / "material-symbols-outlined.subset.json"

TOKEN = re.compile(r"""["'`]([a-z][a-z0-9_]*)["'`]""")
PREFIX = re.compile(r"^sym_o_")
CAMEL = re.compile(r"(?<=.)([A-Z])")


def candidate_words() -> set[str]:
    words: set[str] = set()
    for path in (ROOT / "src").rglob("*"):
        if path.suffix not in {".vue", ".ts"} or "/i18n/" in path.as_posix():
            continue
        for word in TOKEN.findall(path.read_text(encoding="utf8")):
            words.add(PREFIX.sub("", word))
    for word in re.findall(r"sym_o_([a-z0-9_]+)", QUASAR_SET.read_text()):
        words.add(word)
    return words


def main() -> None:
    source = next((EXTRAS / "web-font").glob("*.woff2"))
    # the source's own timestamp, so regenerating unchanged icons is a no-op diff
    font = TTFont(source, recalcTimestamp=False)
    reverse_cmap = {glyph: chr(code) for code, glyph in font.getBestCmap().items()}

    def spelled(first: str, components: list[str]) -> str:
        return "".join(reverse_cmap.get(g, "\0") for g in [first, *components])

    every_icon: set[str] = set()
    ligature_tables = []
    for lookup in font["GSUB"].table.LookupList.Lookup:
        for table in lookup.SubTable:
            table = getattr(table, "ExtSubTable", table)
            if table.LookupType == 4:
                ligature_tables.append(table)
                for first, ligatures in table.ligatures.items():
                    every_icon.update(spelled(first, l.Component) for l in ligatures)

    wanted = candidate_words() & every_icon
    kept_glyphs: set[str] = set()
    for table in ligature_tables:
        for first in list(table.ligatures):
            keep = [
                l for l in table.ligatures[first]
                if spelled(first, l.Component) in wanted
            ]
            if keep:
                table.ligatures[first] = keep
                kept_glyphs.update(l.LigGlyph for l in keep)
            else:
                del table.ligatures[first]

    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.notdef_outline = True
    subsetter = subset.Subsetter(options)
    # the letters the icon names are spelled with, plus the drawn icons
    letters = {ord(c) for word in wanted for c in word}
    subsetter.populate(unicodes=letters, glyphs=kept_glyphs)
    subsetter.subset(font)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    font.save(OUT_FONT)
    # the check script reads Quasar's icon list for what counts as an icon;
    # the font also draws ~700 older aliases ("help_outline", "clear") that
    # list leaves out, so they ride along here
    listed = {
        CAMEL.sub(r"_\1", name.removeprefix("symOutlined")).lower()
        for name in json.loads(ICON_LIST.read_text())
    }
    OUT_MANIFEST.write_text(
        json.dumps(
            {"icons": sorted(wanted), "aliases": sorted(every_icon - listed)},
            indent=2,
        )
        + "\n"
    )
    print(
        f"{len(wanted)} icons, {OUT_FONT.stat().st_size / 1000:.0f} kB "
        f"(full font {source.stat().st_size / 1e6:.2f} MB) -> "
        f"{OUT_FONT.relative_to(ROOT)}",
        file=sys.stderr,
    )


if __name__ == "__main__":
    main()
