// prerender.mjs: buildin jälkivaihe. Esirenderöinti, sitemap ja robots.txt.
// Ajetaan osana komentoa `npm run build` (ks. package.json). Sama malli kuin GlossTahkossa,
// mutta monelle sivulle: jokaisesta reitistä (src/routes.tsx) tulee oma HTML-tiedosto.
//
// 1. Vite on jo tehnyt selainversion kansioon dist/ (dist/index.html on pohja)
// 2. Vite on tehnyt myös palvelinversion kansioon dist-ssr/ (src/entry-server.tsx)
// 3. Tämä skripti ajaa palvelinversion jokaiselle reitille ja kirjoittaa valmiin HTML:n:
//    "/" → dist/index.html, "/tietosuoja/" → dist/tietosuoja/index.html, 404 → dist/404.html
// 4. Lopuksi sitemap.xml ja robots.txt

import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const { render, head, routes, notFoundRoute, SITE_ORIGIN, NOINDEX, CONTENT_UPDATED, withBase } = await import(
  pathToFileURL(resolve("dist-ssr/entry-server.js")).href
);

const template = await readFile("dist/index.html", "utf-8");
for (const marker of ["<!--app-head-->", "<!--app-html-->", "<title>"]) {
  if (!template.includes(marker)) throw new Error(`dist/index.html:stä puuttuu ${marker}`);
}

// Yhden sivun HTML: sivukohtainen otsikko ja metatagit <head>:iin, sisältö root-elementtiin.
// Korvaukset funktiolla (() => ...), jottei sisällön $-merkkejä tulkita korvauskuvioiksi.
function page(route, html) {
  const { title, tags } = head(route);
  return template
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${title.replace(/</g, "&lt;")}</title>`)
    .replace("<!--app-head-->", () => tags)
    .replace("<!--app-html-->", () => html)
    // data-path: selain herättää saman sivun, joka tähän renderöitiin. Tärkeä 404-sivulle:
    // osoite voi olla mikä tahansa (/vesijumpa), mutta HTML on 404-sivun.
    .replace('<div id="root">', () => `<div id="root" data-path="${route.path}">`);
}

async function write(file, content) {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, content);
}

// --- 1. Sivut ---
for (const route of routes) {
  const file = route.path === "/" ? "dist/index.html" : `dist${route.path}index.html`;
  await write(file, page(route, render(route.path)));
  console.log(`esirenderöity ${route.path} → ${file}`);
}

// --- 2. 404-sivu: hosting näyttää tämän tuntemattomille osoitteille (GitHub Pages, Netlify, Cloudflare) ---
await write("dist/404.html", page(notFoundRoute, render(notFoundRoute.path)));
console.log("esirenderöity 404 → dist/404.html");

// --- 3. robots.txt ja sitemap.xml ---
// Esikatselussa (VITE_NOINDEX=1) indeksointi kielletään kokonaan, eikä sitemapia tehdä.
const base = SITE_ORIGIN + withBase("");
if (NOINDEX) {
  await write("dist/robots.txt", "User-agent: *\nDisallow: /\n");
  console.log("robots.txt: indeksointi kielletty (esikatselu)");
} else {
  await write("dist/robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`);
  const urls = routes
    .filter((r) => !r.noindex)
    .map(
      (r) =>
        `  <url>\n    <loc>${SITE_ORIGIN}${withBase(r.path)}</loc>\n    <lastmod>${CONTENT_UPDATED}</lastmod>\n    <priority>${r.path === "/" ? "1.0" : "0.3"}</priority>\n  </url>`,
    )
    .join("\n");
  await write(
    "dist/sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
  console.log("robots.txt ja sitemap.xml kirjoitettu");
}

// --- 4. Siivous: palvelinversiota ei julkaista ---
await rm("dist-ssr", { recursive: true, force: true });
