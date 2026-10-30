// Draw the 1200×630 card that Twitter/X, Teams, Slack, Discord and iMessage
// show for a shared IVDB link, to public/og-image.png: the file index.html's
// og:image names and server.js serves.
//
//   npm run share:card
//
// The card is brand-ux design.md 9.3's: one row, centred top to bottom, of the
// horizontal lockup, a Connected Purple rule as tall as the name, and the
// product name, on Near Black. Everything comes from the kit: the logo art is
// read out of src/components/handy/handy-logo-art.ts (never retyped), Figtree
// comes from the app's own @fontsource dependency, and the only colours are
// palette colours. brand-ux's tools/make-share-assets.mjs and scripter4's
// scripts/make-share-assets.mjs draw the same card.
import { chromium } from "playwright";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const pkg = JSON.parse(await readFile(join(ROOT, "package.json"), "utf8"));
const PRODUCT_NAME = pkg.productName;

// brand-ux design.md §5.2.1 — raw palette. No colour outside this set.
const NEAR_BLACK = "#1C1E21";
const CONNECTED_PURPLE = "#A121CE";
const WHITE = "#FFFFFF";

// ---------------------------------------------------------------- logo art

/** The lockups are template literals in a .ts module. Read them out textually
 * rather than importing: this script runs on plain node, and the extraction is
 * exact either way — a change to the art flows straight through. */
async function readLogoArt(name) {
  const src = await readFile(
    join(ROOT, "src/components/handy/handy-logo-art.ts"),
    "utf8"
  );
  const match = src.match(new RegExp(`const ${name} = \`([\\s\\S]*?)\`;`));
  if (!match) throw new Error(`logo variant "${name}" not found in the art`);
  return match[1];
}

/** The art renders in `currentColor`; the card is a standalone file, so the
 * ink has to be baked in. White on the Near Black ground — never a tint. */
const inked = (svg, color) => svg.replaceAll("currentColor", color);

// ------------------------------------------------------------------- fonts

async function figtreeFace() {
  const woff2 = await readFile(
    join(
      ROOT,
      "node_modules/@fontsource-variable/figtree/files/figtree-latin-wght-normal.woff2"
    )
  );
  return `@font-face {
    font-family: "Figtree Variable";
    font-style: normal;
    font-weight: 300 900;
    src: url(data:font/woff2;base64,${woff2.toString("base64")}) format("woff2-variations");
  }`;
}

// --------------------------------------------------------------- the card

/** The rule is the card's one decorative element. A long name takes two
 * balanced lines rather than a smaller size, and the description stays in the
 * tags: the chat prints it beside the card. */
async function cardHtml() {
  const logo = inked(await readLogoArt("horizontal"), WHITE);
  return `<style>
    ${await figtreeFace()}
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1200px; height: 630px; overflow: hidden;
      background: ${NEAR_BLACK}; color: ${WHITE};
      font-family: "Figtree Variable", -apple-system, sans-serif;
    }
    /* the 80px safe area — some clients crop the long edges */
    .body { height: 100%; padding: 80px; display: flex; align-items: center; }
    .row { display: flex; align-items: center; gap: 48px; min-width: 0; }
    .logo { flex: none; height: 96px; }
    .logo svg { height: 100%; width: auto; display: block; shape-rendering: geometricPrecision; }
    .rule {
      flex: none; align-self: stretch; width: 6px; border-radius: 3px;
      background: ${CONNECTED_PURPLE};
    }
    h1 {
      min-width: 0;
      font-size: 96px; font-weight: 500; line-height: 116%; letter-spacing: 0;
      font-feature-settings: "ss01", "ss02", "cv11";
      text-wrap: balance;
    }
  </style>
  <div class="body">
    <div class="row">
      <div class="logo">${logo}</div>
      <div class="rule"></div>
      <h1>${PRODUCT_NAME}</h1>
    </div>
  </div>`;
}

/** design.md 9.3: the name takes at most two lines. A third means the name is
 * too long for a card, not that it should shrink, so stop before writing it. */
async function checkNameLines(page) {
  const lines = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    const lineHeight = parseFloat(getComputedStyle(h1).lineHeight);
    return Math.round(h1.getBoundingClientRect().height / lineHeight);
  });
  if (lines > 2) {
    throw new Error(
      `"${PRODUCT_NAME}" takes ${lines} lines on the share card; design.md 9.3 allows two`
    );
  }
}

// ------------------------------------------------------------------- run

// at exactly 1200×630, no device-scale trickery: the file is served as it is
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(await cardHtml());
await page.evaluate(() => document.fonts.ready);
await checkNameLines(page);
await writeFile(join(ROOT, "public/og-image.png"), await page.screenshot());
await browser.close();
console.log("public/og-image.png  1200×630");
