import path from "node:path";
import type { NextConfig } from "next";

// Projektin juuri = tämä web-kansio. Ilman tätä Next.js etsii lukitustiedostoa
// (package-lock.json) myös yläkansioista ja varoittaa, jos löytää ylimääräisen
// esim. käyttäjän kotikansiosta. Juuren asettaminen poistaa arvailun ja varoituksen.
const projectRoot = path.resolve(__dirname);

// GitHub Pages -build (npm run build:pages → scripts/build-pages.mjs asettaa nämä).
// Tavallisessa buildissa ehdot ovat epätosia, eikä mikään alla oleva muutu.
const isPages = process.env.GITHUB_PAGES === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Cache Components ("use cache" -direktiivi) ja linkkien osittainen esilataus.
  // Staattinen vienti ei tue niitä (ne vaativat palvelimen), joten GitHub Pages -buildissa
  // ne korvataan experimental.useCache-asetuksella: "use cache" toimii silloin buildin aikana,
  // eli kalenteri luetaan kerran julkaisussa.
  cacheComponents: !isPages,
  partialPrefetching: !isPages,
  ...(isPages && { experimental: { useCache: true } }),

  ...(isPages && {
    output: "export",            // Valmiit HTML-tiedostot out/-kansioon, ei palvelinta
    basePath,                    // Sivusto alipolussa /Liikunta_hyvinvointi_web
    trailingSlash: true,         // /kayttoehdot/ → kayttoehdot/index.html (GitHub Pages löytää sen)
    images: { unoptimized: true }, // Kuvien optimointi vaatii palvelimen: kuvat sellaisenaan
  }),

  outputFileTracingRoot: projectRoot, // Mistä tuotantobuildin tarvitsemat tiedostot jäljitetään

  turbopack: {
    root: projectRoot, // Mistä Turbopack ratkaisee moduulit
    rules: {
      // Tailwind CSS v4 käsittelee CSS-tiedostot Turbopackin kautta
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
