// serve.mjs: pieni staattinen palvelin dist/-kansiolle testejä ja esikatselua varten.
// Toimii kuten oikeat hostingit (GitHub Pages, Netlify, Cloudflare Pages):
// - /tietosuoja → uudelleenohjaus /tietosuoja/ → tietosuoja/index.html
// - tuntematon osoite → 404.html tilakoodilla 404
// (vite preview palauttaisi tuntemattomaan osoitteeseen etusivun tilakoodilla 200.)
//
// Ajo: node scripts/serve.mjs [portti]   (oletus 4173)

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve("dist");
const port = Number(process.argv[2] ?? 4173);
const types = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2",
  ".woff": "font/woff", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8",
};

const isFile = async (p) => (await stat(p).catch(() => null))?.isFile() ?? false;
const isDir = async (p) => (await stat(p).catch(() => null))?.isDirectory() ?? false;

createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  // normalize + tarkistus: polku ei voi karata dist-kansion ulkopuolelle (../)
  const file = normalize(join(root, decodeURIComponent(url.pathname)));
  if (!file.startsWith(root)) return res.writeHead(400).end();

  if (await isFile(file)) {
    res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" });
    return res.end(await readFile(file));
  }
  if (await isDir(file)) {
    if (!url.pathname.endsWith("/")) return res.writeHead(301, { location: `${url.pathname}/` }).end();
    if (await isFile(join(file, "index.html"))) {
      res.writeHead(200, { "content-type": types[".html"] });
      return res.end(await readFile(join(file, "index.html")));
    }
  }
  res.writeHead(404, { "content-type": types[".html"] });
  res.end(await readFile(join(root, "404.html")));
}).listen(port, () => console.log(`dist/ tarjoillaan osoitteessa http://localhost:${port}`));
