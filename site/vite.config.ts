/// <reference types="vitest/config" />
import { fileURLToPath, URL } from "node:url";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  // preact(): koodi kirjoitetaan Reactina, mutta selaimeen menee Preact (3 kt React-yhteensopiva
  // kirjasto 45 kt:n React DOMin sijaan). Puhelimen sivulataus nopeutuu selvästi, eikä koodiin
  // tarvitse koskea: preset ohjaa "react"- ja "react-dom"-tuonnit Preactiin (preact/compat).
  // Sisältää myös nopean päivityksen kehityksessä. tailwindcss(): Tailwind v4 Viten build-putkessa.
  plugins: [preact(), tailwindcss()],

  // Polku, jonka alla sivu julkaistaan. Oma domain: "/" (oletus).
  // GitHub Pages -testi: osoite on pennasenkake.github.io/Liikunta_hyvinvointi_web/,
  // joten scripts/build-pages.mjs asettaa VITE_BASE=/Liikunta_hyvinvointi_web/.
  base: process.env.VITE_BASE ?? "/",

  // "@/lib/site" → src/lib/site.ts
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },

  // Vitest: vain yksikkötestit kansiosta src/. Selaintestit (e2e/) ajaa Playwright.
  test: {
    include: ["src/**/*.test.ts", "scripts/**/*.test.mjs"],
  },
});
