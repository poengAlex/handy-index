#!/usr/bin/env python3
"""Fetch the site icons shown on a performer's external links, into public/.

Each link chip on a performer's page (their own socials, their profile on
each partner site) carries the linked site's icon. The icons are bundled
rather than loaded live:

- Live from each site, a third of the partners have none to give: their icon
  is named in the page's <link rel="icon">, which a browser can't read across
  origins, and /favicon.ico is a 404 (vrhush, realjamvr, sexlikereal, …).
- A favicon service (Google's, DuckDuckGo's) would solve that by telling a
  third party which links every visitor looks at.
- Bundled, they come from our own origin, cost nothing until a chip shows,
  and show whether or not explicit previews are on — the privacy statement
  promises no requests to partner sites while they are off.

Which sites: every partner the API lists (/partners), every site a
performer's partner profile points to, and every site at least MIN_LINKS
performers link to themselves. For each, the best icon its home page names
(apple-touch-icon, then the largest <link rel="icon">), else /favicon.ico,
cut to a 32px PNG — twice the 16px it is drawn at, for high-density screens.
A site that blocks the fetch or names no usable icon is skipped and reported;
its chips simply carry no icon.

Run when partners are added (`npm run favicons:fetch`; needs
`pip install pillow`, or `uv run --with pillow`). Writes
public/favicons/<host>.png and src/services/favicons.json, the list the app
checks before asking for one, so a site without an icon is never a 404.
"""

import io
import json
import re
import sys
import urllib.parse
import urllib.request
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public/favicons"
MANIFEST = ROOT / "src/services/favicons.json"

API = "https://scripts01.handyfeeling.com/api/script/index/v0"
ROSTER_PAGE = 500
#: a site this many performers link to themselves is worth an icon
MIN_LINKS = 3
SIZE = 32
TIMEOUT = 15
#: a page or icon bigger than this is not what we came for
MAX_BYTES = 2_000_000
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/130.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}

LINK_TAG = re.compile(r"<link\b[^>]*>", re.I)
ATTR = re.compile(r"""([a-z-]+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)""", re.I)


def fetch(url: str) -> tuple[bytes, str]:
    request = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(request, timeout=TIMEOUT) as response:
        return response.read(MAX_BYTES), response.geturl()


def api(path: str):
    return json.loads(fetch(API + path)[0])


def host_of(url: str | None) -> str:
    host = urllib.parse.urlparse((url or "").strip()).hostname or ""
    return host.lower().removeprefix("www.")


def wanted_hosts() -> list[str]:
    hosts = {partner["name"].lower().removeprefix("www.") for partner in api("/partners")}
    own_links: Counter[str] = Counter()
    skip = 0
    while True:
        page = api(f"/performers?take={ROSTER_PAGE}&skip={skip}")
        for performer in page:
            for ref in performer.get("partner_site_refs") or []:
                hosts.add(host_of(ref.get("url")))
            for link in performer.get("some") or []:
                own_links[host_of(link.get("url"))] += 1
        if len(page) < ROSTER_PAGE:
            break
        skip += ROSTER_PAGE
    hosts |= {host for host, count in own_links.items() if count >= MIN_LINKS}
    return sorted(host for host in hosts if "." in host)


def candidates(host: str) -> list[str]:
    """Icon URLs worth trying, best first."""
    found: list[tuple[int, str]] = []
    for base in (f"https://{host}/", f"https://www.{host}/"):
        try:
            body, final = fetch(base)
        except Exception:
            continue
        html = body.decode("utf-8", "replace")
        for tag in LINK_TAG.findall(html):
            attrs = {
                key.lower(): value.strip("\"'") for key, value in ATTR.findall(tag)
            }
            rel = attrs.get("rel", "").lower()
            href = attrs.get("href")
            if not href or "icon" not in rel or "mask-icon" in rel:
                continue
            sizes = [int(n) for n in re.findall(r"(\d+)x\d+", attrs.get("sizes", ""))]
            # an apple-touch-icon is a solid 180px square: the best source
            # to cut 32px from; then the largest declared icon
            score = 1000 if "apple-touch-icon" in rel else max(sizes, default=16)
            found.append((score, urllib.parse.urljoin(final, href)))
        if found:
            break
    ranked = [url for _, url in sorted(found, key=lambda pair: -pair[0])]
    return ranked + [f"https://{host}/favicon.ico", f"https://www.{host}/favicon.ico"]


def square_icon(data: bytes) -> Image.Image | None:
    try:
        image = Image.open(io.BytesIO(data))
        if image.format == "ICO":
            # the largest frame, not the 16px one Pillow might hand back
            image.size = max(image.ico.sizes())
        image = image.convert("RGBA")
    except Exception:
        return None
    if image.width < 16 or image.height < 16:
        return None
    if image.getextrema()[3][1] == 0:  # fully transparent
        return None
    side = max(image.size)
    canvas = Image.new("RGBA", (side, side))
    canvas.paste(image, ((side - image.width) // 2, (side - image.height) // 2))
    icon = canvas.resize((SIZE, SIZE), Image.LANCZOS)
    return on_tile(icon) if see_through(icon) else icon


def see_through(icon: Image.Image) -> bool:
    """Whether enough of it is transparent for the chip behind to show."""
    alpha = icon.getchannel("A").tobytes()
    return sum(1 for a in alpha if a < 128) > len(alpha) * 0.05


def on_tile(icon: Image.Image) -> Image.Image:
    """A glyph on a transparent ground vanishes on one theme or the other —
    black X on the dark chip, white beacons dots on the light one — so it is
    set on a small rounded tile: white, or near-black for a light glyph.
    Opaque icons are tiles already and are left as they are."""
    data = icon.tobytes()
    pixels = (data[i : i + 4] for i in range(0, len(data), 4))
    solid = [px for px in pixels if px[3] >= 128]
    light = bool(solid) and (
        sum(0.299 * r + 0.587 * g + 0.114 * b for r, g, b, _ in solid) / len(solid)
        > 200
    )
    tile = Image.new("RGBA", (SIZE, SIZE))
    ImageDraw.Draw(tile).rounded_rectangle(
        (0, 0, SIZE - 1, SIZE - 1),
        radius=SIZE // 5,
        fill=(24, 24, 27, 255) if light else (255, 255, 255, 255),
    )
    inset = SIZE // 8
    glyph = icon.resize((SIZE - 2 * inset, SIZE - 2 * inset), Image.LANCZOS)
    tile.alpha_composite(glyph, (inset, inset))
    return tile


def icon_for(host: str) -> tuple[str, bool]:
    for url in candidates(host):
        if url.lower().split("?")[0].endswith(".svg"):
            continue  # Pillow can't draw SVG; the next candidate usually can
        try:
            data, _ = fetch(url)
        except Exception:
            continue
        icon = square_icon(data)
        if icon:
            icon.save(OUT_DIR / f"{host}.png", optimize=True)
            return host, True
    return host, False


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    hosts = wanted_hosts()
    with ThreadPoolExecutor(max_workers=8) as pool:
        results = list(pool.map(icon_for, hosts))
    missed = sorted(host for host, ok in results if not ok)
    # drop icons for sites no longer wanted, so public/ doesn't accrete — but
    # keep one a site merely failed to serve this time (rate limit, outage)
    for stale in OUT_DIR.glob("*.png"):
        if stale.stem not in hosts:
            stale.unlink()
    saved = sorted(host for host in hosts if (OUT_DIR / f"{host}.png").exists())
    MANIFEST.write_text(json.dumps(saved, indent=2) + "\n", encoding="utf8")
    size = sum((OUT_DIR / f"{host}.png").stat().st_size for host in saved)
    print(f"{len(saved)} of {len(hosts)} icons, {size // 1024} kB -> {OUT_DIR.relative_to(ROOT)}")
    if missed:
        print("no usable icon: " + ", ".join(missed), file=sys.stderr)


if __name__ == "__main__":
    main()
