// vite-env.d.ts: omien ympäristömuuttujien tyypit (import.meta.env).
// Vite päästää selaimeen vain VITE_-alkuiset muuttujat, joten salaisuudet eivät
// voi vahingossa päätyä sivuston koodiin. Älä silti laita salaisuuksia VITE_-muuttujiin.

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string; // Julkinen osoite, esim. https://tahkonamanda.fi
  readonly VITE_NOINDEX?: string;  // "1" = esikatselu, ei hakukoneisiin
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
