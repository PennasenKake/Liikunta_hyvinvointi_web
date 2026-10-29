// build-pages.mjs: staattinen build GitHub Pagesia varten (npm run build:pages).
//
// GitHub Pages tarjoilee vain valmiita tiedostoja (ei Node.js-palvelinta), ja projektisivu
// on alipolussa: https://pennasenkake.github.io/Liikunta_hyvinvointi_web/
// Tämä skripti:
//   1. asettaa ympäristömuuttujat, joilla next.config.ts vaihtaa staattiseen vientiin (out/-kansio)
//   2. siirtää robots.ts:n ja sitemap.ts:n hetkeksi sivuun: Next.js ei osaa viedä niitä
//      staattisesti Cache Components -tilassa. Testiversioon kirjoitetaan tilalle oma robots.txt.
//   3. palauttaa tiedostot aina, myös jos build epäonnistuu (try/finally)
//   4. lisää out/-kansioon .nojekyll-tiedoston: ilman sitä GitHub Pages piilottaa
//      alaviivalla alkavat kansiot, kuten _next/, ja sivulta puuttuisivat tyylit ja skriptit.
//
// Tavallinen build (npm run build), testit ja myöhempi Netlify-julkaisu eivät muutu.

import { spawnSync } from "node:child_process";
import { existsSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";

const REPO = "Liikunta_hyvinvointi_web";
const BASE_PATH = `/${REPO}`;
const SITE_URL = `https://pennasenkake.github.io${BASE_PATH}`;

const env = {
  ...process.env,
  GITHUB_PAGES: "true",            // next.config.ts: output "export", basePath jne.
  NEXT_PUBLIC_BASE_PATH: BASE_PATH, // lib/paths.ts: alipolku kuviin ja <a>-linkkeihin
  NEXT_PUBLIC_SITE_URL: SITE_URL,   // lib/seo.ts: täydet osoitteet (canonical, jakokuva)
  NEXT_PUBLIC_NOINDEX: "1",         // Testiversio pois hakukoneista
  NEXT_TELEMETRY_DISABLED: "1",
};

// Tiedostot, joita staattinen vienti ei tue. Pääte .pages-tauko piilottaa ne Next.js:ltä.
const parked = ["src/app/robots.ts", "src/app/sitemap.ts"].filter((f) => existsSync(f));
parked.forEach((f) => renameSync(f, `${f}.pages-tauko`));

let status = 1;
try {
  // Ajetaan Next.js suoraan Nodella: toimii samalla tavalla Windowsissa ja Linuxissa
  const nextBin = path.join("node_modules", "next", "dist", "bin", "next");
  const result = spawnSync(process.execPath, [nextBin, "build"], { stdio: "inherit", env });
  status = result.status ?? 1;
} finally {
  parked.forEach((f) => renameSync(`${f}.pages-tauko`, f));
}

if (status === 0) {
  writeFileSync("out/.nojekyll", "");
  writeFileSync("out/robots.txt", "User-agent: *\nDisallow: /\n"); // Testiversiota ei indeksoida
  console.log(`\nGitHub Pages -build valmis: out/  →  ${SITE_URL}/`);
}
process.exit(status);
