/// <reference types="vitest/config" />
import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  // react(): JSX ja nopea päivitys kehityksessä. tailwindcss(): Tailwind v4 käsittelee
  // CSS:n Viten build-putkessa.
  plugins: [react(), tailwindcss()],

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
    include: ["src/**/*.test.ts"],
  },
});
