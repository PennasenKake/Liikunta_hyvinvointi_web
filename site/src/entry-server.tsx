// entry-server.tsx: palvelinversio esirenderöintiä varten.
//
// Build: `vite build --ssr src/entry-server.tsx --outDir dist-ssr` kääntää tämän
// Node.js:llä ajettavaksi. scripts/prerender.mjs kutsuu render()-funktiota jokaiselle
// reitille ja kirjoittaa tuloksen HTML-tiedostoon. Palvelinta ei ajeta tuotannossa:
// valmiit tiedostot tarjoillaan staattisina (GitHub Pages, Netlify, Cloudflare Pages).

import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { routes, notFoundRoute, fullTitle, type Route } from "./routes";
import { NOINDEX, SITE_ORIGIN } from "./lib/seo";
import { withBase } from "./lib/paths";

// Sivun HTML merkkijonona (menee <div id="root">:n sisään)
export function render(path: string): string {
  return renderToString(
    <StrictMode>
      <App path={path} />
    </StrictMode>,
  );
}

// HTML-erikoismerkit koodataan, jottei teksti voi rikkoa metatagia
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Sivukohtaiset <head>-tagit: otsikko, kuvaus, canonical, jakokuva (Open Graph) ja robots
export function head(route: Route): { title: string; tags: string } {
  const title = fullTitle(route);
  const url = SITE_ORIGIN + withBase(route.path);
  const image = SITE_ORIGIN + withBase("/opengraph-image.png");
  const tags = [
    `<meta name="description" content="${esc(route.description)}" />`,
    route.noindex ? "" : `<link rel="canonical" href="${url}" />`,
    // Esikatselussa (VITE_NOINDEX=1) ja 404-sivulla pyydetään hakukoneita olemaan indeksoimatta
    NOINDEX || route.noindex ? `<meta name="robots" content="noindex, nofollow" />` : "",
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="fi_FI" />`,
    `<meta property="og:site_name" content="Tahkon Amanda" />`,
    `<meta property="og:title" content="${esc(route.path === "/" ? "Tahkon Amanda – Liikunta ja hyvinvointi" : title)}" />`,
    `<meta property="og:description" content="${esc(route.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Tahkon Amanda – liikunta ja hyvinvointi Tahkolla, Siilinjärvellä, Kuopiossa ja Rautavaaralla. Piirros Tahkovuoresta rinteineen." />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ]
    .filter(Boolean)
    .join("\n    ");
  return { title, tags };
}

// Esirenderöinti tarvitsee nämä: reitit, 404-sivu ja tiedot sitemapia ja robots.txt:tä varten
export { routes, notFoundRoute };
export { SITE_ORIGIN, NOINDEX } from "./lib/seo";
export { CONTENT_UPDATED } from "./lib/seo";
export { withBase } from "./lib/paths";
export { stockPhotos } from "./lib/photos";
