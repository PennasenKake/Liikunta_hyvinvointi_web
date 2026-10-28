import path from "node:path";
import type { NextConfig } from "next";

// Projektin juuri = tämä web-kansio. Ilman tätä Next.js etsii lukitustiedostoa
// (package-lock.json) myös yläkansioista ja varoittaa, jos löytää ylimääräisen
// esim. käyttäjän kotikansiosta. Juuren asettaminen poistaa arvailun ja varoituksen.
const projectRoot = path.resolve(__dirname);

const nextConfig: NextConfig = {
  cacheComponents: true,    // Next.js 16:n Cache Components ("use cache" -direktiivi)
  partialPrefetching: true, // Linkkien esilataus vain tarvittavilta osin

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
