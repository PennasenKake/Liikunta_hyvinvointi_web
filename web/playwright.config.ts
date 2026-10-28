// playwright.config.ts: Playwright-savutestien asetukset.
// Savutesti (smoke test) on nopea tarkistus, joka varmistaa, että sivuston
// tärkeimmät asiat toimivat: sivu latautuu, navigaatio toimii ja 404 palauttaa
// oikean tilakoodin. Testit ajetaan oikeassa selaimessa tuotantobuildia vastaan.
//
// Ajo:  npm run test:e2e        (tekee buildin ja käynnistää palvelimen itse)
// Raportti virheen jälkeen:  npx playwright show-report

import { defineConfig, devices } from "@playwright/test";

// Oma portti, jottei testipalvelin törmää käynnissä olevaan dev-palvelimeen (3000).
const PORT = 3100;
const isCI = !!process.env.CI; // GitHub Actions asettaa CI=true automaattisesti

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI, // Unohtunut test.only() kaataa CI-ajon, jottei osa testeistä jää ajamatta
  retries: isCI ? 1 : 0, // CI:ssä yksi uusintayritys satunnaisten aikakatkaisujen varalta
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",

  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry", // Epäonnistuneesta ajosta tallentuu jäljitys vianetsintää varten
  },

  // Kaksi selainprofiilia: työpöytä ja mobiili. Mobiilissa testataan hampurilaisvalikko.
  // Pixel 7 käyttää Chromium-moottoria, joten erillistä selainta ei tarvitse asentaa.
  projects: [
    { name: "tyopoyta", use: { ...devices["Desktop Chrome"] } },
    { name: "mobiili", use: { ...devices["Pixel 7"] } },
  ],

  // Playwright käynnistää palvelimen ennen testejä ja sammuttaa sen lopuksi.
  // CI:ssä build on jo tehty edellisessä vaiheessa, joten pelkkä käynnistys riittää.
  // Paikallisesti käytetään valmiina olevaa palvelinta, jos portti on jo käytössä.
  webServer: {
    command: isCI ? `npm run start -- -p ${PORT}` : `npm run build && npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !isCI,
    timeout: 180_000, // Build voi kestää hitaalla koneella pari minuuttia
  },
});
