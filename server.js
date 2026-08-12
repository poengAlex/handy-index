// Static production server. Hash-mode routing means every deep link hits /,
// so plain static serving is all this needs — except the social-preview tags:
// link scrapers require an absolute og:image URL, so index.html is served
// with the request's own origin substituted in (keeps the repo domain-free).
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 5000;
const spa = path.join(dirname, "dist/spa");

const indexHtml = fs.readFileSync(path.join(spa, "index.html"), "utf8");

const app = express();
// honor x-forwarded-proto so req.protocol is https behind the platform proxy
app.set("trust proxy", true);

const serveIndex = (req, res) => {
  const origin = `${req.protocol}://${req.get("host")}`;
  res
    .type("html")
    .send(indexHtml.replaceAll("/og-image.png", `${origin}/og-image.png`));
};
app.get("/", serveIndex);
app.get("/index.html", serveIndex);

app.use(express.static(spa));
app.listen(port);
