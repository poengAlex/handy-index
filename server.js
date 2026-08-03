// Static production server. Hash-mode routing means every deep link hits /,
// so plain static serving is all this needs.
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 5000;

const app = express();

app.use(express.static(path.join(dirname, "dist/spa")));
app.listen(port);
